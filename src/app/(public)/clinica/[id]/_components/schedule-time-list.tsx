"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from '@/lib/utils'
import { isSlotInThePastAtTimeZone, isTodayAtTimeZone, isSlotSequenceAvailable } from './schedule-utils'

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  timeZone: string;
  onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  timeZone,
  requiredSlots,
  selectedTime,
  onSelectTime
}: ScheduleTimeListProps) {

  const dateIsToday = isTodayAtTimeZone(selectedDate, timeZone)


  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {

        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        )

        const slotIsPast = dateIsToday && isSlotInThePastAtTimeZone(slot.time, timeZone)

        const slotEnabled = slot.available && sequenceOK && !slotIsPast;


        return (
          <Button
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn("h-10 select-none",
              selectedTime === slot.time && "border-2 border-emerald-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={!slotEnabled}
          >
            {slot.time}
          </Button>
        )
      })}

    </div>
  )
}