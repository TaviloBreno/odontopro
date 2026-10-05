import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ButtonCopyLink } from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'
import { Appointments } from './_components/appointments/appointments'
import { checkSubscription } from '@/utils/permissions/checkSubscription'
import { LabelSubscription } from '@/components/ui/label-subscription'
import { getClinicAccess } from '@/lib/clinic-access'
import prisma from '@/lib/prisma'

export default async function Dashboard() {
  const access = await getClinicAccess()

  if (!access) redirect("/login")
  if (access.role === "EMPLOYEE") redirect("/dashboard/employee")

  const session = await getSesion()
  if (!session) redirect("/login")

  const subscription = await checkSubscription(access.clinicId)
  const clinicSetup = await prisma.user.findUnique({
    where: { id: access.clinicId },
    select: { isPublished: true },
  })

  if (!clinicSetup) {
    throw new Error("A clínica da sessão não foi encontrada.")
  }

  return (
    <main>
      {!clinicSetup.isPublished && (
        <aside className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h1 className="font-semibold">Sua clínica ainda não está publicada</h1>
          <p className="mt-1 text-sm">
            Cadastre pelo menos um serviço, configure os horários e publique a clínica pelo perfil para aparecer na busca e aceitar reservas.
          </p>
          <div className="mt-3 flex gap-4 text-sm font-medium">
            <Link className="text-emerald-700 underline" href="/dashboard/services">Cadastrar serviços</Link>
            <Link className="text-emerald-700 underline" href="/dashboard/profile">Configurar horários e publicar</Link>
          </div>
        </aside>
      )}

      <div className='space-x-2 flex items-center justify-end'>
        <Link
          href={`/clinica/${access.clinicId}`}
          target='_blank'
        >
          <Button className='bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]'>
            <Calendar className='w-5 h-5' />
            <span>Novo agendamento</span>
          </Button>
        </Link>

        <ButtonCopyLink userId={access.clinicId} />
      </div>

      {subscription?.subscriptionStatus === "EXPIRED" && (
        <LabelSubscription expired={true} />
      )}

      {subscription?.subscriptionStatus === "TRIAL" && (
        <div className='bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md my-2'>
          <p className='font-semibold'>
            {subscription?.message}
          </p>
        </div>
      )}

      {subscription?.subscriptionStatus !== "EXPIRED" && (
        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4'>
          <Appointments userId={access.clinicId} />

          <Reminders userId={access.clinicId} />
        </section>
      )}

    </main>
  )
}