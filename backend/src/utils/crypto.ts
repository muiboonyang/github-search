import { randomBytes } from 'crypto';

 // Generate token secret
console.log(randomBytes(64).toString('hex'));