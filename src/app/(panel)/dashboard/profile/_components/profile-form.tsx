"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface UseProfileFormProps {
  name: string | null;
  address: string | null;
  phone: string | null;
  isPublished: boolean;
  timeZone: string | null;
}


const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  isPublished: z.enum(["active", "inactive"]),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
})

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({ name, address, phone, isPublished, timeZone }: UseProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || "",
      address: address || "",
      phone: phone || "",
      isPublished: isPublished ? "active" : "inactive",
      timeZone: timeZone || ""
    }
  })
}