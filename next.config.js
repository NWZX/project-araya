const withPWA = require('next-pwa')

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === 'production' ? false : true,
    dest: 'public'
  }
})