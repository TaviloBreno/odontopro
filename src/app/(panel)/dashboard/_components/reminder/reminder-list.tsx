"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Reminder } from "@prisma/client"
import { Check, Plus, RotateCcw, Trash } from "lucide-react"
import { ScrollArea } from '@/components/ui/scroll-area'
import { deleteReminder } from '../../_actions/delete-reminder'
import { setReminderCompletion } from '../../_actions/set-reminder-completion'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import { ReminderContent } from './reminder-content'


interface ReminderListProps {
  reminder: Reminder[]
}

export function ReminderList({ reminder }: ReminderListProps) {

  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDeleteReminder(id: string) {
    const response = await deleteReminder({ reminderId: id })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data);
    router.refresh();
  }

  async function handleToggleCompletion(id: string, isCompleted: boolean) {
    const response = await setReminderCompletion({ reminderId: id, isCompleted })
    if (response.error) {
      toast.error(response.error)
      return
    }
    toast.success(response.data)
    router.refresh()
  }



  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Lembretes
          </CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-9 p-0">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogDescription>Criar um novo lembrete para sua lista.</DialogDescription>
              </DialogHeader>

              <ReminderContent
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>

          </Dialog>

        </CardHeader>

        <CardContent>
          {reminder.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum lembrete registrado...
            </p>
          )}

          <ScrollArea
            className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1"
          >
            {reminder.map((item) => (
              <article
                key={item.id}
                className={`flex flex-wrap flex-row items-center justify-between py-2 mb-2 px-2 rounded-md ${item.isCompleted ? "bg-gray-100 text-gray-500" : "bg-yellow-100"}`}
              >
                <p className={`text-sm lg:text-base ${item.isCompleted ? "line-through" : ""}`}>{item.description}</p>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={item.isCompleted ? "Reabrir lembrete" : "Concluir lembrete"}
                    onClick={() => handleToggleCompletion(item.id, !item.isCompleted)}
                  >
                    {item.isCompleted ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2"
                    size="sm"
                    aria-label="Excluir lembrete"
                    onClick={() => handleDeleteReminder(item.id)}
                  >
                    <Trash className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </article>
            ))}
          </ScrollArea>

        </CardContent>
      </Card>
    </div>
  )
}