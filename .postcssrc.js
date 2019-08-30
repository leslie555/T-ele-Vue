// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    // to edit target browsers: use "browserlist" field in package.json
    'autoprefixer': {
      browsers: [
        'last 4 version',
        'not ie <= 11'
      ]
    }
  }
}