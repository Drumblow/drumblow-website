import { z } from 'zod'

const eventDataSchema = z.object({
  name: z.string(),
  data: z.record(z.any()),
  timestamp: z.string().or(z.date())
})

export function validateEventData(data: unknown) {
  return eventDataSchema.safeParse(data)
}
