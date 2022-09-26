// Example of how to use jsonwebtoken.

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'HDFUINI3N7FBCDSOF8NCSDOA8hfg74893f8q9';

const myToken = jwt.sign(
  {
    name: 'Thiago',
  },
  SECRET_KEY,
  {
    expiresIn: '1y',
    subject: '1',
  },
);

console.log(myToken);

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGhpYWdvIiwiaWF0IjoxNjYyNzQ2NDI3LCJleHAiOjE2OTQzMDQwMjcsInN1YiI6IjEifQ.Q6saMH1x9XE_c57uHDxQBsKFD2LugFEC5xvJRuPa83I';

// console.log(jwt.decode(myToken));
console.log(jwt.decode(TOKEN))

// console.log(jwt.verify(myToken, SECRET_KEY));
// console.log(jwt.verify(TOKEN, SECRET_KEY));
console.log(jwt.verify(TOKEN, 'WRONG-KEY'));
