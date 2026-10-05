"use client"
import Image from 'next/image';
import { ChangeEvent, useState } from 'react'
import semFoto from '../../../../../../public/foto1.png'
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfileAvatar } from '../_actions/update-avatar';
import { useSession } from 'next-auth/react'

interface AvatarProfileProps {
  avatarUrl: string | null;
}

export function AvatarProfile({ avatarUrl }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl)
  const [loading, setLoading] = useState(false);

  const { update } = useSession();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // (X) Criar o componente
    // (X) Receber a imagem de troca.
    // Enviar a imagem para o servidor (storage)
    // Receber a url da imagem do servidor
    // Salva a nova url da imagem no banco de dados

    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error("Formato de imagem inválido");
        e.target.value = "";
        return;
      }

      if (image.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5 MB.")
        e.target.value = ""
        return
      }

      setLoading(true);
      try {
        const urlImage = await uploadImage(image)

        if (!urlImage) {
          return
        }

        const response = await updateProfileAvatar({ avatarUrl: urlImage })
        if (response.error) {
          toast.error(response.error)
          return
        }

        setPreviewImage(urlImage)
        await update({ image: urlImage })
        toast.success(response.data)
      } finally {
        setLoading(false)
        e.target.value = ""
      }
    }
  }


  async function uploadImage(image: File): Promise<string | null> {

    try {
      toast("Estamos enviando sua imagem...")

      const formData = new FormData();

      formData.append("file", image)

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/image/upload`, {
        method: "POST",
        body: formData
      })

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Falha ao alterar imagem")
        return null
      }

      return data.secure_url as string


    } catch (err) {
      console.log(err);
      toast.error("Não foi possível enviar a imagem. Tente novamente.")
      return null;
    }

  }


  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48">

      <div className='relative flex items-center justify-center w-full h-full '>
        <span className='absolute cursor-pointer z-[2] bg-slate-50/80 p-2 rounded-full shadow-xl'>
          {loading ? <Loader size={16} color="#131313" className='animate-spin' /> : <Upload size={16} color="#131313" />}
        </span>

        <input
          type="file"
          accept="image/png,image/jpeg"
          className='opacity-0 cursor-pointer relative z-50 w-48 h-48'
          onChange={handleChange}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto de perfil da clinica"
          fill
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      ) : (
        <Image
          src={semFoto}
          alt="Foto de perfil da clinica"
          fill
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      )}
    </div>
  )

}