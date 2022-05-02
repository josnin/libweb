const { build } = require('esbuild')
  
build({
  entryPoints: ['src/libweb.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  platform: 'node'
}).catch((error) => {
  console.error(error)
  process.exit(1)
})
