"use client"

import { useCallback, useEffect, useState } from "react"
import { AppointmentStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  cancelPatientAppointment,
  getAvailableRescheduleTimes,
  reschedulePatientAppointment,
} from "./_actions/manage-appointment"
import { toast } from "sonner"

interface AppointmentManagementProps {
  token: string
  appointment: {
    status: AppointmentStatus
    name: string
    appointmentDate: Date
    time: string
    durationAtBooking: number
    serviceNameAtBooking: string
    priceAtBooking: number
    canManage: boolean
    user: {
      name: string | null
      timeZone: string | null
      isPublished: boolean
    }
  }
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date)
}

function currentDateAtTimeZone(timeZone: string | null) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""
  return `${get("year")}-${get("month")}-${get("day")}`
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100)
}

export function AppointmentManagementContent({
  token,
  appointment: initialAppointment,
}: AppointmentManagementProps) {
  const [appointment, setAppointment] = useState(initialAppointment)
  const [date, setDate] = useState(dateKey(initialAppointment.appointmentDate))
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [working, setWorking] = useState(false)
  const [availabilityError, setAvailabilityError] = useState("")

  const loadAvailableTimes = useCallback(async (requestedDate: string) => {
    setLoadingTimes(true)
    setAvailabilityError("")
    setSelectedTime("")
    try {
      const result = await getAvailableRescheduleTimes({ token, date: requestedDate })
      if (!("data" in result)) {
        setAvailableTimes([])
        setAvailabilityError(result.error)
        return
      }
      setAvailableTimes(result.data)
    } catch (error) {
      console.error("Falha ao carregar horários para alteração:", error)
      setAvailableTimes([])
      setAvailabilityError("Não foi possível carregar os horários. Tente novamente.")
    } finally {
      setLoadingTimes(false)
    }
  }, [token])

  useEffect(() => {
    if (appointment.status === "SCHEDULED" && appointment.canManage) {
      void loadAvailableTimes(date)
    }
  }, [appointment.canManage, appointment.status, date, loadAvailableTimes])

  async function handleCancel() {
    if (!window.confirm("Deseja cancelar este agendamento?")) return

    setWorking(true)
    try {
      const result = await cancelPatientAppointment({ token })
      if (result.error) {
        toast.error(result.error)
        return
      }
      setAppointment((current) => ({ ...current, status: "CANCELLED" }))
      toast.success("Agendamento cancelado.")
    } catch (error) {
      console.error("Falha ao cancelar agendamento:", error)
      toast.error("Não foi possível cancelar. Tente novamente.")
    } finally {
      setWorking(false)
    }
  }

  async function handleReschedule() {
    if (!selectedTime) {
      toast.error("Selecione um horário disponível.")
      return
    }

    setWorking(true)
    try {
      const result = await reschedulePatientAppointment({ token, date, time: selectedTime })
      if (!("data" in result)) {
        toast.error(result.error)
        await loadAvailableTimes(date)
        return
      }

      setAppointment((current) => ({
        ...current,
        appointmentDate: new Date(`${result.data.date}T00:00:00.000Z`),
        time: result.data.time,
      }))
      toast.success("Agendamento alterado com sucesso.")
      await loadAvailableTimes(result.data.date)
    } catch (error) {
      console.error("Falha ao alterar agendamento:", error)
      toast.error("Não foi possível alterar. Tente novamente.")
    } finally {
      setWorking(false)
    }
  }

  const statusText = {
    SCHEDULED: "Agendado",
    CANCELLED: "Cancelado",
    COMPLETED: "Concluído",
  }[appointment.status]

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-xl space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        <header>
          <p className="text-sm font-medium text-emerald-700">{appointment.user.name || "Clínica"}</p>
          <h1 className="mt-1 text-2xl font-bold">Gerenciar agendamento</h1>
          <p className="mt-2 text-sm text-gray-600">
            Olá, {appointment.name}. Confira os dados da sua consulta.
          </p>
        </header>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-md bg-gray-50 p-4 text-sm">
          <dt className="text-gray-600">Serviço</dt>
          <dd className="font-medium">{appointment.serviceNameAtBooking}</dd>
          <dt className="text-gray-600">Data</dt>
          <dd className="font-medium">{formatDate(appointment.appointmentDate)}</dd>
          <dt className="text-gray-600">Horário</dt>
          <dd className="font-medium">{appointment.time}</dd>
          <dt className="text-gray-600">Duração</dt>
          <dd className="font-medium">{appointment.durationAtBooking} min</dd>
          <dt className="text-gray-600">Valor</dt>
          <dd className="font-medium">{formatPrice(appointment.priceAtBooking)}</dd>
          <dt className="text-gray-600">Status</dt>
          <dd className="font-medium">{statusText}</dd>
        </dl>

        {appointment.status === "SCHEDULED" && !appointment.canManage && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900" role="status">
            O horário da consulta já começou ou passou. Não é mais possível alterá-la online.
          </p>
        )}

        {appointment.status === "SCHEDULED" && appointment.canManage && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="new-date" className="block text-sm font-medium">
                Escolha uma nova data
              </label>
              <input
                id="new-date"
                type="date"
                min={currentDateAtTimeZone(appointment.user.timeZone)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Horários disponíveis</p>
              {loadingTimes ? (
                <p className="text-sm text-gray-600">Carregando horários...</p>
              ) : availabilityError ? (
                <p className="text-sm text-red-700" role="alert">{availabilityError}</p>
              ) : availableTimes.length === 0 ? (
                <p className="text-sm text-gray-600">Não há horários disponíveis nesta data.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      aria-pressed={selectedTime === time}
                      onClick={() => setSelectedTime(time)}
                      disabled={working}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                onClick={handleReschedule}
                disabled={working || loadingTimes || !selectedTime}
              >
                {working ? "Salvando..." : "Confirmar nova data e horário"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleCancel}
                disabled={working}
              >
                Cancelar agendamento
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              O link desta página é exclusivo. Guarde-o para consultar ou alterar sua reserva.
            </p>
          </div>
        )}

        {appointment.status !== "SCHEDULED" && (
          <p className="text-sm text-gray-600" role="status">
            Este agendamento não aceita mais alterações online.
          </p>
        )}
      </section>
    </main>
  )
}
