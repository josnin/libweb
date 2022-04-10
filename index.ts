// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const path = require('path');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'src'),
  wildcard: false
})

// Declare a route
fastify.get('/*', async (request: any , reply: any) => {
  return await reply.sendFile("index.html");
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(5068)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()