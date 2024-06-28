import type { Knex } from 'knex'
import { env } from './src/env'

if (!process.env.DATABASE_URL) {
	throw new Error('db not found')
}

const connection =
	env.DATABASE_CLIENT === 'sqlite3'
		? { filename: env.DATABASE_URL }
		: env.DATABASE_URL

const configDb: Knex.Config = {
	client: env.DATABASE_CLIENT,
	connection: connection,
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: './db/migrations',
	},
}

export default configDb
