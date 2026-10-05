"use client"

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Prisma } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { X, Eye, Check } from 'lucide-react'
import { cancelAppointment } from '../../_actions/cancel-appointment'
import { completeAppointment } from '../../_actions/complete-appointment'
import { toast } from 'sonner'
import {
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog'
import { DialogAppointment } from './dialog-appointment'
import { ButtonPickerAppointment } from './button-date'

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  select: {
    id: true
    name: true
    email: true
    phone: true
    time: true
    appointmentDate: true
    status: true
    priceAtBooking: true
    durationAtBooking: true
    service: { select: { id: true; name: true } }
  }
}>

interface AppointmentsListProps {
  times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {

  const searchParams = useSearchParams();
  const date = searchParams.get("date")
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)


  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {

      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today;
      }

      const url = `/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao carregar os agendamentos.")
      }

      return json as AppointmentWithService[]

    },
    staleTime: 20000, // 20 segundos
    refetchInterval: 60000, // 60 segundos
  })

  // Monta occupantMap slot > appointment
  // Se um Appointment começa no time (15:00) e tem requiredSlots 2
  // occupantMap["15:00", appoitment] occupantMap["15:30", appoitment] 
  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      // Calcular quantos slots necessarios ocupa
      const requiredSlots = Math.ceil(appointment.durationAtBooking / 30);

      // Descobrir qual é o indice do nosso array de horarios esse agendamento começa.
      const startIndex = times.indexOf(appointment.time)

      // Se encontrou o index
      if (startIndex !== -1) {

        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }

        }

      }


    }
  }


  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId: appointmentId })

    if (response.error) {
      toast.error(response.error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    await refetch()
    toast.success(response.data);

  }

  async function handleCompleteAppointment(appointmentId: string) {
    const response = await completeAppointment({ appointmentId })

    if (response.error) {
      toast.error(response.error)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    toast.success(response.data)
  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xl md:text-2xl font-bold'>
            Agendamentos
          </CardTitle>

          <ButtonPickerAppointment />
        </CardHeader>

        <CardContent>
          <ScrollArea className='h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4'>
            {isLoading ? (
              <p>Carregando agenda...</p>
            ) : isError ? (
              <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error instanceof Error ? error.message : "Não foi possível carregar a agenda."}
                <Button className="ml-2" variant="outline" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </div>
            ) : (
              times.map((slot) => {
                // ocupantMap["15:00"]
                const occupant = occupantMap[slot]

                if (occupant) {
                  const isAppointmentStart = occupant.time === slot
                  return (
                    <div
                      key={slot}
                      className='flex items-center py-2 border-t last:border-b'
                    >
                      <div className='w-16 text-sm font-semibold'>{slot}</div>

                      <div className='flex-1 text-sm'>
                        {isAppointmentStart ? (
                          <>
                            <div className='font-semibold'>{occupant.name}</div>
                            <div className='text-sm text-gray-500'>{occupant.phone}</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Ocupado pelo atendimento iniciado às {occupant.time}</div>
                        )}
                      </div>

                      {isAppointmentStart && (
                        <div className='ml-auto'>
                          <div className='flex'>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDetailAppointment(occupant)}
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                          </DialogTrigger>

                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Marcar agendamento como concluído"
                            onClick={() => handleCompleteAppointment(occupant.id)}
                          >
                            <Check className='w-4 h-4' />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Cancelar agendamento"
                            onClick={() => handleCancelAppointment(occupant.id)}
                          >
                            <X className='w-4 h-4' />
                          </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <div
                    key={slot}
                    className='flex items-center py-2 border-t last:border-b'
                  >
                    <div className='w-16 text-sm font-semibold'>{slot}</div>
                    <div className='flex-1 text-sm'>
                      Disponível
                    </div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>

      </Card>

      <DialogAppointment
        appointment={detailAppointment}
      />
    </Dialog>
  )
}