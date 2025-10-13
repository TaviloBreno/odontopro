"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-8 sm:pb-12 lg:pb-16 sm:px-6 lg:px-8">

        <main className="flex flex-col lg:flex-row items-center justify-center min-h-[70vh] lg:min-h-[80vh] gap-8 lg:gap-12">
          
          {/* Conteúdo Principal */}
          <article className="flex-1 lg:flex-[2] max-w-3xl space-y-6 lg:space-y-8 flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold max-w-2xl tracking-tight leading-tight">
              Encontre os melhores profissionais em um único local!
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simplificada e organizada.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Button 
                onClick={() => {
                  const element = document.getElementById('profissionais')
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    })
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-400 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 font-semibold cursor-pointer text-sm sm:text-base transition-all hover:shadow-lg"
              >
                Encontre uma clínica
              </Button>
            </div>
          </article>

          {/* Imagem - Visível em tablet e desktop */}
          <div className="flex-1 justify-center items-center hidden md:flex">
            <Image
              src="/doctor-hero.png"
              alt="Foto ilustrativa de um profissional de saude"
              width={280}
              height={330}
              className="object-contain w-full max-w-[280px] md:max-w-[320px] lg:max-w-[340px] h-auto"
              quality={100}
              priority
            />
          </div>

          {/* Imagem móvel - Versão menor para mobile */}
          <div className="flex justify-center items-center md:hidden mt-4">
            <Image
              src="/doctor-hero.png"
              alt="Foto ilustrativa de um profissional de saude"
              width={200}
              height={240}
              className="object-contain w-full max-w-[200px] h-auto"
              quality={100}
              priority
            />
          </div>
        </main>

      </div>
    </section>
  )
}