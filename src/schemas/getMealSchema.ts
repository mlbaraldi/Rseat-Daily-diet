import { z } from 'zod'

export const getMealSchema = z.object({
	meal_id: z.string().uuid(),
})
