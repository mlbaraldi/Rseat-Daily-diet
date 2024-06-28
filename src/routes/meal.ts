import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex'
import { randomUUID } from 'node:crypto'
import configDb from '../../knexfile'
import { checkMeal } from '../middleware/checkMeal'
import { checkUser } from '../middleware/checkUser'
import { createMealBodySchema } from '../schemas/createMealBodySchema'
import { getMealSchema } from '../schemas/getMealSchema'
import { patchMealBodySchema } from '../schemas/patchMealBodySchema'

const db = knex(configDb)

export async function mealRoutes(app: FastifyInstance) {
	app.addHook('preHandler', checkUser)

	app.get('/', async (req, res) => {
		const user_id = req.cookies.user_id
		const meals = await db('meals').where('user_id', user_id)
		res.status(201).send({ message: 'meals registered', meals })
	})

	app.post('/', async (req: FastifyRequest, res: FastifyReply) => {
		const { name, description, isDiet } = createMealBodySchema.parse(req.body)
		const user_id = req.cookies.user_id
		const id = randomUUID()
		const meal = {
			id,
			name,
			description,
			isDiet,
			user_id,
		}
		const mealCreated = await db('meals').insert(meal).returning('*')

		res.status(201).send(mealCreated)
	})

	app.get('/:meal_id', { preHandler: checkMeal }, async (req, res) => {
		const user_id = req.cookies.user_id
		const { meal_id } = getMealSchema.parse(req.params)
		const meal = await db('meals').where({ id: meal_id, user_id })
		res.status(201).send({ message: 'Meal found', meal })
	})

	app.delete(
		'/:meal_id',
		{ preHandler: checkMeal },
		async (req: FastifyRequest, res: FastifyReply) => {
			const { meal_id } = getMealSchema.parse(req.params)
			await db('meals')
				.delete()
				.where({ id: meal_id, user_id: req.cookies.user_id })

			res.status(200).send({ message: 'meal deleted', meal_id })
		},
	)

	app.patch(
		'/:meal_id',
		{ preHandler: checkMeal },
		async (req: FastifyRequest, res: FastifyReply) => {
			const { meal_id } = getMealSchema.parse(req.params)
			const { name, description, isDiet } = patchMealBodySchema.parse(req.body)

			const meal = await db('meals')
				.update({ name, description, isDiet })
				.where({ id: meal_id, user_id: req.cookies.user_id })
				.returning('*')

			res.status(200).send({ message: 'Meal updated', meal })
		},
	)
}
