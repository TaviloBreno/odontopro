"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const reminderSchema = z.object({
  description: z.string().min(1, "A descrição do lembrete é obrigatória"),
})

export type ReminderFormdata = z.infer<typeof reminderSchema>

export function useReminderForm() {
  return useForm<ReminderFormdata>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      description: ""
    }
  })
}