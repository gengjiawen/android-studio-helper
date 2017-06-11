import Dexie from 'dexie'

const db = new Dexie('myDb')
db.version(1).stores({
  repos: `value, lastUsed`
})

export default db
