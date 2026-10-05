import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getClinicAccess } from '@/lib/clinic-access'

export const runtime = "nodejs"

const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string
})

export const POST = async (request: Request) => {
  const access = await getClinicAccess()
  const userId = access?.role === "ADMIN" ? access.clinicId : null

  if (!userId) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: access ? 403 : 401 })
  }

  const contentLength = Number(request.headers.get("content-length"))
  if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_SIZE + 64 * 1024) {
    return NextResponse.json({ error: "A imagem deve ter no máximo 5 MB." }, { status: 413 })
  }

  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_KEY ||
    !process.env.CLOUDINARY_SECRET
  ) {
    return NextResponse.json(
      { error: "O armazenamento de imagens não está configurado." },
      { status: 503 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Envie um formulário de imagem válido." }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Selecione uma imagem." }, { status: 400 })
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return NextResponse.json({ error: "A imagem deve ter no máximo 5 MB." }, { status: 413 })
  }

  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    return NextResponse.json({ error: "Envie uma imagem PNG ou JPEG." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const isPng = PNG_SIGNATURE.every((byte, index) => buffer[index] === byte)
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff

  if ((file.type === "image/png" && !isPng) || (file.type === "image/jpeg" && !isJpeg)) {
    return NextResponse.json({ error: "O conteúdo do arquivo não corresponde a uma imagem PNG/JPEG." }, { status: 400 })
  }

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "odontopro/avatars",
          public_id: userId,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
        },
        (error, uploaded) => {
          if (error) {
            reject(error)
            return
          }

          if (!uploaded?.secure_url) {
            reject(new Error("Cloudinary não retornou a URL da imagem."))
            return
          }

          resolve({ secure_url: uploaded.secure_url })
        }
      ).end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Falha ao enviar avatar para Cloudinary:", error)
    return NextResponse.json({ error: "Não foi possível armazenar a imagem." }, { status: 502 })
  }

}