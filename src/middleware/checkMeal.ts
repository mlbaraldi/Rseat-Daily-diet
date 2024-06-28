import type { FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex'
import configDb from '../../knexfile'
import { getMealSchema } from '../schemas/getMealSchema'

const db = knex(configDb)

export async function checkMeal(req: FastifyRequest, res: FastifyReply) {
	const { meal_id } = getMealSchema.parse(req.params)
	const searchDb = await db('meals').where('id', meal_id)

	if (searchDb?.length === 0) {
		return res.status(401).send({
			error: 'Meal does not exist. Please verify Meal Id',
		})
	}
}
