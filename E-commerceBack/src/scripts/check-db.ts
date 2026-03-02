import { loadEnv } from "@medusajs/framework/utils"
// @ts-ignore
import pg from "pg"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

async function checkConnection() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not defined in environment variables.")
    process.exit(1)
  }

  console.log(`Attempting to connect to database...`)
  // Mask the password in the log
  const maskedUrl = connectionString.replace(/:([^:@]+)@/, ":****@")
  console.log(`Connection string: ${maskedUrl}`)

  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for some cloud DBs like Supabase/Neon if valid certs aren't available locally
    },
  })

  try {
    await client.connect()
    console.log("✅ Successfully connected to the database!")
    
    const res = await client.query('SELECT NOW() as now')
    console.log(`✅ Database time: ${res.rows[0].now}`)
    
    const resVersion = await client.query('SELECT version()')
    console.log(`✅ Database version: ${resVersion.rows[0].version}`)

    await client.end()
    process.exit(0)
  } catch (err: any) {
    console.error("❌ Failed to connect to the database:")
    console.error(err)
    if (err.message.includes("password authentication failed")) {
      console.error("\n💡 Hint: Check your database password in .env")
    } else if (err.message.includes("getaddrinfo EAI_AGAIN")) {
      console.error("\n💡 Hint: Check your internet connection or database host URL")
    }
    process.exit(1)
  }
}

checkConnection()
