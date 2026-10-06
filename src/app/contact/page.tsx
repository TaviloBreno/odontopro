import type { Metadata } from "next"

const contactAddress = "Rua Manoel Idelfonso, 937, Crateús, Ceará"
const mapQuery = encodeURIComponent(contactAddress)

export const metadata: Metadata = {
  title: "Contato | Odonto PRO",
  description: "Entre em contato com o Odonto PRO e veja a localização informada em Crateús, Ceará.",
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <header className="space-y-3">
        <p className="font-semibold text-emerald-700">Odonto PRO</p>
        <h1 className="text-3xl font-bold">Contato</h1>
        <p className="text-gray-700">
          Para dúvidas sobre a plataforma, acesso, cobrança ou agendamentos,
          utilize o e-mail abaixo.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="space-y-5 rounded-lg border p-5">
          <div>
            <h2 className="font-semibold">E-mail</h2>
            <a className="mt-1 inline-block underline" href="mailto:breno_wk2@hotmail.com">
              breno_wk2@hotmail.com
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Endereço informado</h2>
            <address className="mt-1 not-italic text-gray-700">{contactAddress}</address>
          </div>
          <a
            className="inline-block rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            Abrir rotas no Google Maps
          </a>
          <p className="text-sm text-gray-500">
            O mapa é fornecido pelo Google e pode receber dados técnicos do seu
            navegador ao ser carregado.
          </p>
        </div>

        <div className="min-h-80 overflow-hidden rounded-lg border">
          <iframe
            title={`Mapa: ${contactAddress}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  )
}
