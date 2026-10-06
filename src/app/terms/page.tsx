import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso | Odonto PRO",
  description: "Termos para uso dos recursos disponíveis no Odonto PRO.",
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Termos de Uso</h1>
        <p className="text-sm text-gray-600">Última atualização: 5 de outubro de 2026</p>
        <p>
          Estes termos descrevem o uso dos recursos atualmente disponíveis no
          Odonto PRO e precisam de revisão jurídica antes do lançamento público.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contas e responsabilidades</h2>
        <p>
          Administradores devem manter os dados de acesso sob seu controle,
          cadastrar apenas funcionários autorizados e revisar o acesso quando
          alguém deixar a clínica. Cada usuário deve usar somente as funções
          permitidas para seu papel e não tentar acessar dados de outra clínica.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <p>
          A confirmação de um horário depende da gravação bem-sucedida da reserva
          e da disponibilidade validada pelo servidor. O paciente pode usar o link
          secreto exibido após a reserva para consultar, reagendar ou cancelar
          antes do início; deve guardá-lo e compartilhá-lo somente com pessoas
          autorizadas. A plataforma ainda não envia confirmação por e-mail ou SMS.
        </p>
        <p>
          O sistema organiza horários e dados administrativos; não fornece
          diagnóstico, orientação clínica ou atendimento de emergência. Em uma
          emergência, procure os serviços locais apropriados.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Disponibilidade, planos e terceiros</h2>
        <p>
          A disponibilidade pode depender de manutenção, conexão e serviços
          externos. Recursos de pagamento só devem ser considerados ativos quando
          a clínica concluir o fluxo de cobrança apresentado na própria aplicação;
          provedores externos têm termos e políticas próprios.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contato</h2>
        <p>
          Dúvidas sobre estes termos:{" "}
          <a className="underline" href="mailto:breno_wk2@hotmail.com">
            breno_wk2@hotmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}
