import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env file so DATABASE_URL is available when Prisma reads this config
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
