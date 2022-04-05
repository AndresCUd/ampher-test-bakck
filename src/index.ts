import { Route } from './types'
import { functionWrapper } from './errors'

import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()


import entriesRoutes from './routes/EntriesAndres'
async function startServer() {
    const app = express()
    app.use(express.json())
    app.use(cors())
    const routes = [
        ...entriesRoutes,
    ] as Route[]
    const appWithRoutes = routes.reduce((app, route) => {
        if (route.type === 'POST')
            app.post(route.path, route.validator, functionWrapper(route.handler))
        else if (route.type === 'GET')
            app.get(route.path, route.validator, functionWrapper(route.handler))
        else
            app.put(route.path, route.validator, functionWrapper(route.handler))
        return app
    }, app)

    const PORT = process.env.PORT || 5001
    appWithRoutes.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()
