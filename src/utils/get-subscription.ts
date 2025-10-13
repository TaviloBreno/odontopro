"use server"

import prisma from "@/lib/prisma"

export async function getSubscription({ userId }: { userId: string }) {

  if (!userId) {
    return null;
  }

  try {
    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username:password')) {
      console.log("⚠️ DATABASE_URL não configurada - retornando assinatura fictícia como inativa");
      
      // Retorna null para mostrar os planos (como se não tivesse assinatura)
      return null;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId
      }
    })

    console.log("✅ Assinatura carregada do banco:", subscription?.status || 'nenhuma');
    return subscription;

  } catch (err) {
    console.log("⚠️ Erro ao carregar assinatura - usando fallback (sem assinatura ativa)");
    // Retorna null para permitir que o usuário veja os planos disponíveis
    return null;
  }

}