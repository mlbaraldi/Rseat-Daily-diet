import type { FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex'
import configDb from '../../knexfile'

const db = knex(configDb)
export async function checkUser(req: FastifyRequest, res: FastifyReply) {
	let { user_id } = req.cookies
	if (!user_id) {
		res
			.status(401)
			.send({ error: 'Unauthorized Acess. Please create a User in POST /user' })
	}

	user_id = await db('users').where('id', user_id)

	if (user_id?.length === 0) {
		return res.status(401).send({
			error: 'User does not exist. Please verify userId',
		})
	}
}
