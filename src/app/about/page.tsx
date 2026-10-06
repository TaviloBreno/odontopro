import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre | Odonto PRO",
  description: "Conheça o Odonto PRO, uma plataforma para conectar pacientes e clínicas odontológicas.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-3">
        <p className="font-semibold text-emerald-700">Odonto PRO</p>
        <h1 className="text-3xl font-bold">Sobre a plataforma</h1>
        <p className="text-lg text-gray-700">
          O Odonto PRO ajuda clínicas odontológicas a apresentar seus serviços e
          horários e permite que pacientes encontrem uma clínica e solicitem um
          agendamento online.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Uma experiência mais organizada</h2>
        <p className="text-gray-700">
          Administradores podem configurar o perfil público da clínica, cadastrar
          serviços e gerenciar a equipe. Funcionários têm acesso à agenda e aos
          lembretes da clínica a que estão vinculados. Pacientes podem consultar
          clínicas publicadas e reservar sem criar uma conta.
        </p>
      </section>

      <section className="rounded-lg border bg-gray-50 p-5">
        <h2 className="text-xl font-semibold">Importante</h2>
        <p className="mt-2 text-gray-700">
          O Odonto PRO é uma ferramenta de organização e agendamento, não oferece
          diagnóstico ou orientação médica. A disponibilidade dos serviços e a
          realização do atendimento são responsabilidade de cada clínica.
        </p>
      </section>
    </main>
  )
}
