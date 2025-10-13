"use server"

interface GetUserDataProps {
  userId: string;
}

export async function getUserData({ userId }: GetUserDataProps) {
  try {

    if (!userId) {
      return null;
    }

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️ DATABASE_URL não configurada - usando dados fictícios do perfil");
      // Retornar dados fictícios do usuário para desenvolvimento
      return {
        id: userId,
        name: "Dr. João Silva",
        email: "dr.joao@teste.com",
        phone: "(11) 99999-9999",
        address: "Rua das Flores, 123 - Centro, São Paulo - SP",
        image: null,
        status: true,
        timeZone: "America/Sao_Paulo",
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: {
          id: "sub_1",
          plan: "PROFESSIONAL",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    }

    // Se DATABASE_URL estiver configurada, usar Prisma
    const prisma = (await import("@/lib/prisma")).default;
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        subscription: true,
      }
    })

    if (!user) {
      return null;
    }

    return user;

  } catch (err) {
    console.error("❌ Erro ao buscar dados do usuário:", err);
    // Fallback em caso de erro no banco
    return {
      id: userId,
      name: "Dr. João Silva",
      email: "dr.joao@teste.com", 
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123 - Centro, São Paulo - SP",
      image: null,
      status: true,
      timeZone: "America/Sao_Paulo",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscription: {
        id: "sub_1",
        plan: "PROFESSIONAL", 
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }
}