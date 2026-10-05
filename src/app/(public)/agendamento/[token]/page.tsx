import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AppointmentManagementContent } from "./appointment-management-content"
import { getAppointmentManagement } from "./_data-access/get-appointment-management"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Gerenciar agendamento | Odonto PRO",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
}

export default async function AppointmentManagementPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const appointment = await getAppointmentManagement(token)
  if (!appointment) notFound()

  return <AppointmentManagementContent token={token} appointment={appointment} />
}
