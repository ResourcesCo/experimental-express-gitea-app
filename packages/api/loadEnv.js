const env = require('./env.json')

for (const key of Object.keys(env)) {
  process.env[key] = env[key]
}
