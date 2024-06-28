import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { env } from './env'
import { mealRoutes } from './routes/meal'
import { userRoutes } from './routes/user'

const app = fastify({ logger: true })

app.register(fastifyCookie)
app.register(userRoutes, { prefix: 'user' })
app.register(mealRoutes, { prefix: 'meal' })

app.listen({ port: env.PORT }, () => {
	console.log(`App Running on port ${env.PORT}`)
})
