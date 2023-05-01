// Generate token secret
console.log(require('crypto').randomBytes(64).toString('hex'));