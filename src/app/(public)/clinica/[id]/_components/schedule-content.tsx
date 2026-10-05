"use client"

import { useState, useCallback, useEffect } from 'react'
import Image from "next/image"
import imgTest from '../../../../../../public/foto1.png'
import { MapPin } from "lucide-react"
import { Prisma } from "@prisma/client"
import { useAppointmentForm, AppointmentFormData } from './schedule-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/utils/formatPhone'
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScheduleTimeList } from './schedule-time-list'
import { createNewAppointment } from '../_actions/create-appointment'
import { toast } from 'sonner'
import { getLocalDateKey } from './schedule-utils'

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    address: true
    image: true
    times: true
    timeZone: true
    isPublished: true
    services: {
      select: {
        id: true
        name: true
        price: true
        duration: true
      }
    }
  }
}>


interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

  const form = useAppointmentForm();
  const { watch } = form;


  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [managementPath, setManagementPath] = useState<string | null>(null);

  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])


  // Função que busca os horários bloqueados (via Fetch HTTP)
  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[] | null> => {
    setLoadingSlots(true);
    try {
      const dateString = getLocalDateKey(date)
      const params = new URLSearchParams({ userId: clinic.id, date: dateString })
      const response = await fetch(`/api/schedule/get-appointments?${params}`)

      const json = await response.json();
      if (!response.ok || !Array.isArray(json)) {
        return null
      }

      return json as string[]
    } catch {
      return null;
    } finally {
      setLoadingSlots(false)
    }
  }, [clinic.id])


  useEffect(() => {

    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setAvailabilityError(blocked === null)
        const blockedSlots = blocked ?? []
        setBlockedTimes(blockedSlots)

        const times = clinic.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: blocked !== null && !blockedSlots.includes(time)
        }))


        setAvailableTimeSlots(finalSlots)

        // Se o slot atual estiver indisponivel, limpamos a seleção
        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        )

        if (!stillAvailable) {
          setSelectedTime("");
        }


      })
    }

  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])


  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    if (!selectedTime || !selectedServiceId) {
      toast.error("Selecione um serviço e um horário disponível.")
      return;
    }

    setSubmitting(true)
    setManagementPath(null)
    try {
      const response = await createNewAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: selectedTime,
        date: getLocalDateKey(formData.date),
        serviceId: formData.serviceId,
        clinicId: clinic.id
      })

      if ("error" in response && response.error) {
        toast.error(response.error)
        const blocked = await fetchBlockedTimes(selectedDate)
        if (blocked) {
          setBlockedTimes(blocked)
          setAvailableTimeSlots(clinic.times.map((time) => ({
            time,
            available: !blocked.includes(time),
          })))
          setSelectedTime("")
        }
        return
      }

      if (!("managementPath" in response)) {
        toast.error("Não foi possível gerar o link seguro do agendamento.")
        return
      }

      setManagementPath(response.managementPath)
      toast.success(`Consulta agendada para ${getLocalDateKey(formData.date)} às ${selectedTime}.`)
      form.reset()
      setSelectedTime("")
    } catch (error) {
      console.error("Falha ao enviar a reserva:", error)
      toast.error("Não foi possível confirmar o agendamento. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="contianer mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image
                src={clinic.image ? clinic.image : imgTest}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              {clinic.name}
            </h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não informado"}
              </span>
            </div>
          </article>

        </div>
      </section>


      <section className="max-w-2xl mx-auto w-full mt-6">
        {/* Formulário de agendamento */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
          >

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Nome completo:</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      maxLength={120}
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      maxLength={254}
                      placeholder="Digite seu email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(XX) XXXXX-XXXX"
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value)
                        field.onChange(formattedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">Data do agendamento:</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      selectedDate={field.value}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date)
                          setSelectedTime("")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="font-semibold">Selecione o serviço:</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedTime("")
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className='space-y-2'>
                <Label className="font-semibold">Horários disponíveis:</Label>
                <div className='bg-gray-100 p-4 rounded-lg'>
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availabilityError ? (
                    <p role="alert">Não foi possível carregar os horários. Tente novamente.</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponível</p>
                  ) : (
                    <ScheduleTimeList
                      onSelectTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      timeZone={clinic.timeZone || "America/Sao_Paulo"}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 30) : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.isPublished ? (
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                disabled={submitting || loadingSlots || !selectedTime || !selectedServiceId || !watch("name") || !watch("email") || !watch("phone") || !watch("date")}
              >
                {submitting ? "Confirmando agendamento..." : "Realizar agendamento"}
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                A clinica está fechada nesse momento.
              </p>
            )}

          </form>
        </Form>
      </section>

      {managementPath && (
        <section className="mx-auto mt-6 w-full max-w-2xl rounded-md border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="font-semibold text-emerald-950">Sua reserva foi confirmada</h2>
          <p className="mt-2 text-sm text-emerald-900">
            Guarde este link exclusivo para consultar, reagendar ou cancelar sua consulta.
            Ele será exibido somente agora.
          </p>
          <a
            href={managementPath}
            className="mt-3 inline-block break-all font-medium text-emerald-800 underline"
          >
            Abrir página segura para gerenciar o agendamento
          </a>
        </section>
      )}

    </div>
  )
}