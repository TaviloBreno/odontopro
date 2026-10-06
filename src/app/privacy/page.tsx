import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aviso de Privacidade | Odonto PRO",
  description: "Como o Odonto PRO trata dados pessoais nas contas e reservas.",
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Aviso de Privacidade</h1>
        <p className="text-sm text-gray-600">Última atualização: 5 de outubro de 2026</p>
        <p>
          Este aviso descreve o tratamento de dados pessoais nos fluxos atualmente
          disponíveis no Odonto PRO. Ele deve ser revisado por profissional jurídico
          antes do lançamento público; não substitui orientação jurídica.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Dados tratados</h2>
        <p>
          Para uma reserva, coletamos nome, e-mail, telefone, clínica, serviço,
          data e horário escolhidos e o registro de quando o aviso foi apresentado
          e confirmado. A reserva também mantém uma cópia do nome, preço e duração
          do serviço e um hash de token usado para gerenciar o agendamento.
        </p>
        <p>
          Para contas de clínicas e equipe, o sistema trata dados de identificação
          e contato, credenciais protegidas por hash ou identificadores OAuth,
          papel e vínculo com a clínica. Se ativados, pagamentos usam identificadores
          de cliente/assinatura Stripe e imagens de perfil são armazenadas pelo
          Cloudinary. O Odonto PRO não precisa de histórico clínico ou diagnóstico
          para realizar uma reserva; não os inclua em observações, nomes de arquivo
          ou mensagens de suporte.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Finalidades e responsabilidades</h2>
        <p>
          Os dados de reserva são usados para criar e administrar o horário,
          prevenir conflitos, permitir cancelamento/reagendamento e manter o
          histórico da operação. Dados de conta apoiam autenticação, segurança,
          administração da clínica e, se contratado, cobrança. A clínica que
          oferece o atendimento decide como utiliza os dados recebidos e deve
          informar seus pacientes sobre esse tratamento; o responsável pela
          operação do Odonto PRO é o contato para solicitações relacionadas à
          plataforma.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Compartilhamento e segurança</h2>
        <p>
          Os dados são armazenados no PostgreSQL configurado pelo operador. Quando
          habilitados, Google/GitHub fornecem autenticação, Stripe processa
          informações de cobrança e Cloudinary armazena avatares, de acordo com a
          configuração da conta nesses serviços. O link de gestão de uma reserva
          é um segredo de acesso: a aplicação persiste apenas o hash do token,
          exibe o link após a reserva e não o envia por e-mail.
        </p>
        <p>
          Aplicamos autenticação e restrições por clínica nos fluxos principais.
          Nenhum sistema conectado à internet pode prometer segurança absoluta;
          credenciais e links secretos não devem ser compartilhados.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Retenção, acesso e solicitações</h2>
        <p>
          A regra operacional definida é manter dados enquanto a clínica e o
          paciente precisarem deles para administrar a reserva e atender obrigações
          aplicáveis; pedidos de acesso, correção ou exclusão são tratados após
          verificação razoável da identidade e da autoridade de quem solicita.
          Não existe ainda exclusão automática por idade do registro nem portal
          automatizado de exportação/exclusão. A exclusão pode exigir análise de
          obrigações legais, contábeis ou de terceiros antes de ser atendida.
        </p>
        <p>
          Para fazer uma solicitação, escreva para{" "}
          <a className="underline" href="mailto:breno_wk2@hotmail.com">
            breno_wk2@hotmail.com
          </a>
          . Informe como podemos localizar a conta ou reserva, sem enviar dados
          clínicos, senhas, tokens de gestão ou documentos completos por e-mail.
          Podemos pedir confirmação adicional antes de alterar ou remover dados.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Cookies e alterações</h2>
        <p>
          A autenticação usa cookies necessários para manter a sessão. Este aviso
          será atualizado se os fluxos, fornecedores ou finalidades mudarem;
          confira a data indicada no início da página.
        </p>
      </section>
    </main>
  )
}
