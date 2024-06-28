import { z } from 'zod'

export const patchMealBodySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	isDiet: z.boolean().optional(),
})
