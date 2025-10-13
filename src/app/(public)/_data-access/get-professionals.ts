"use server"

import prisma from "@/lib/prisma"

export async function getProfessionals() {

  try {
    // Temporariamente comentado para evitar erro de conexão com banco
    // TODO: Configurar DATABASE_URL no .env para habilitar a conexão com o banco
    
    // const professionals = await prisma.user.findMany({
    //   where: {
    //     status: true,
    //   },
    //   include: {
    //     subscription: true,
    //   }
    // })
    // return professionals;
    
    return []; // Retorna array vazio temporariamente

  } catch (err) {
    console.log("Erro ao buscar profissionais:", err);
    return []
  }

}