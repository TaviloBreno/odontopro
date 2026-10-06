import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white px-4 py-6 text-sm text-gray-600">
      <nav
        aria-label="Informações legais e suporte"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-2"
      >
        <Link className="underline underline-offset-2" href="/privacy">
          Aviso de Privacidade
        </Link>
        <Link className="underline underline-offset-2" href="/terms">
          Termos de Uso
        </Link>
        <Link className="underline underline-offset-2" href="/support">
          Suporte
        </Link>
        <a className="underline underline-offset-2" href="mailto:breno_wk2@hotmail.com">
          Contato
        </a>
      </nav>
    </footer>
  )
}
