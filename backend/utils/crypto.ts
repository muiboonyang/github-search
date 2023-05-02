// Generate token secret
console.log(require('utils/crypto').randomBytes(64).toString('hex'));