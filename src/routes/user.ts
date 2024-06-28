import type { FastifyInstance } from 'fastify'
import knex from 'knex'
import { randomUUID } from 'node:crypto'
import configDb from '../../knexfile'
import { checkUser } from '../middleware/checkUser'
import { createUserBodySchema } from '../schemas/createUserBodySchema'

const db = knex(configDb)

export async function userRoutes(app: FastifyInstance) {
	app.post('/', async (req, res) => {
		const { name } = createUserBodySchema.parse(req.body)
		const id = randomUUID()
		const dbUser = {
			id,
			name,
		}
		await db('users').insert(dbUser)

		res.cookie('user_id', id)

		res.status(201).send('User created')
	})

	app.get('/', { preHandler: checkUser }, async (req, res) => {
		const user_id = req.cookies.user_id

		const meals = await db('meals').where({ user_id }).orderBy('created_at')

		const totalMeals = meals.length
		const totalMealsOnDiet = meals.filter((meal) => meal.isDiet === 1).length
		const totalMealsOffDiet = totalMeals - totalMealsOnDiet

		let currentStreak = 0
		let maxStreak = 0

		for (let i = 0; i < totalMeals; i++) {
			if (meals[i].isDiet === 1) {
				currentStreak++
				if (currentStreak > maxStreak) {
					maxStreak = currentStreak
				}
			} else {
				currentStreak = 0
			}
		}

		const response = {
			User: user_id,
			'Total meals': totalMeals,
			'Total meals on diet': totalMealsOnDiet,
			'Total meals off diet': totalMealsOffDiet,
			'Diet Streak!': currentStreak,
		}
		res.status(200).send(response)
	})
}
