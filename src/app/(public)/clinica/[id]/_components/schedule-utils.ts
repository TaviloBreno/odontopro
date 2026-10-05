
export function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function isTodayAtTimeZone(date: Date, timeZone: string) {
  const todayParts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    todayParts.find((part) => part.type === type)?.value ?? ""
  const clinicToday = `${get("year")}-${get("month")}-${get("day")}`

  return getLocalDateKey(date) === clinicToday
}


export function isSlotInThePastAtTimeZone(slotTime: string, timeZone: string) {
  const nowParts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(nowParts.find((part) => part.type === type)?.value)
  const nowMinutes = get("hour") * 60 + get("minute")
  const [hour, minute] = slotTime.split(":").map(Number)

  return hour * 60 + minute <= nowMinutes
}


/** 
  * Verificar se, a partir de um slot inicial, existe uma sequencia de 'requiredSlots' disponiveis
  * Explo: se um serviço tem 2 required slots e começa no time 15:00,
  * precisa garantir que 15:00 e 15:30 não estejam no nosso blockedSlots
 */
export function isSlotSequenceAvailable(
  startSlot: string, //> Primeiro horario disponivel
  requiredSlots: number, //> Quantidade de slots necessários
  allSlots: string[], //> Todos horarios da clinica
  blockedSlots: string[] //> Horarios bloqueados
) {

  const startIndex = allSlots.indexOf(startSlot)
  if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
    return false;
  }

  const [startHour, startMinute] = startSlot.split(":").map(Number)
  const startMinutes = startHour * 60 + startMinute

  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allSlots[i]
    const [hour, minute] = slotTime.split(":").map(Number)
    const slotMinutes = hour * 60 + minute

    if (
      blockedSlots.includes(slotTime) ||
      slotMinutes !== startMinutes + (i - startIndex) * 30
    ) {
      return false;
    }
  }

  return true;
}