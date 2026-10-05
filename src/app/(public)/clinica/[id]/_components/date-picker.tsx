"use client"
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'

import "react-datepicker/dist/react-datepicker.css"

registerLocale("pt-BR", ptBR)

interface DateTimePickerProps {
  minDate?: Date;
  className?: string;
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({ selectedDate, className, minDate, onChange }: DateTimePickerProps) {
  function handleChange(date: Date | null) {
    if (date) {
      onChange(date)
    }
  }


  return (
    <DatePicker
      className={className}
      selected={selectedDate}
      locale="pt-BR"
      minDate={minDate ?? new Date()}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
    />
  )
}