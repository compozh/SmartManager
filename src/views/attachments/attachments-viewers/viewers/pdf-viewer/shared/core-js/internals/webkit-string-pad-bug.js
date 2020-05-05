// https://github.com/zloirock/core-js/issues/280
var userAgent = require('./user-agent')

// eslint-disable-next-line unicorn/no-unsafe-regex
module.exports = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent)
