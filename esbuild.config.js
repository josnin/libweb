const { build } = require('esbuild')
  
build({
  entryPoints: ['src/static/js/index.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  platform: 'node'
}).catch((error) => {
  console.error(error)
  process.exit(1)
})
