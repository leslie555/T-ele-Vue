var et = require('element-theme')
// build
et.run({
  config: './src/renderer/styles/variables.scss',
  out: './src/renderer/styles/element-theme-tgf',
  minimize: true
})
