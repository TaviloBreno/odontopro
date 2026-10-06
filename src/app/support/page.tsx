import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Suporte | Odonto PRO",
  description: "Orientação para problemas de acesso, cobrança e agendamentos.",
  robots: { index: true, follow: true },
}

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Suporte</h1>
        <p>Para ajuda com acesso, cobrança ou reservas, escreva para:</p>
        <a className="font-medium underline" href="mailto:breno_wk2@hotmail.com">
          breno_wk2@hotmail.com
        </a>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Problemas de login</h2>
        <p>
          Confira o endereço de e-mail e tente novamente. O login Google só está
          disponível quando configurado pela clínica. Não envie sua senha ou código
          de autenticação ao suporte.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Cobrança</h2>
        <p>
          Informe o e-mail da conta e uma descrição do problema. Não envie número
          completo de cartão, CVV, senha ou dados de autenticação.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Agendamento</h2>
        <p>
          Para consultar, reagendar ou cancelar, use o link secreto mostrado após
          reservar. Se não o salvou, contate diretamente a clínica. Para uma
          solicitação de privacidade, use o mesmo endereço e descreva se deseja
          acesso, correção ou exclusão; não envie informações clínicas por e-mail.
        </p>
      </section>

      <p className="rounded-md bg-amber-50 p-4 text-sm text-amber-950">
        Este canal é para suporte da plataforma, não para atendimento clínico ou
        emergências. O prazo de resposta será informado quando houver uma equipe
        de suporte formalmente definida.
      </p>
    </main>
  )
}
