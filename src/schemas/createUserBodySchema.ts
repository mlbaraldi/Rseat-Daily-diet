import { z } from 'zod'

export const createUserBodySchema = z.object({
	name: z.string(),
})
