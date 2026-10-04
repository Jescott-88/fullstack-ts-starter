import { serve } from '@hono/node-server'
import { env } from './config/env.js'
import { app } from './app.js'

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on port ${info.port}`)
  },
)
