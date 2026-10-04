import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { db } from './client.js'

const migrator = new Migrator({
  db,

  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, 'migrations'),
  }),
})

async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`Migration "${result.migrationName}" succeeded`)
    } else if (result.status === 'Error') {
      console.error(`Migration "${result.migrationName}" failed`)
    }
  })

  if (error) {
    console.error('Migration failed')
    console.error(error)

    await db.destroy()

    process.exit(1)
  }

  await db.destroy()
}

await migrateToLatest()
