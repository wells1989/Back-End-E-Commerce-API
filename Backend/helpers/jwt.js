const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
        {url: '/api/vi/products' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/products/:id' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/products/get/featured' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/products/get/count' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/products/get/featured/count' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/categories' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/categories/:id' , methods: ['GET', 'OPTIONS']},
        {url: '/api/vi/users/get/count' , methods: ['GET', 'OPTIONS']},
        '/api/vi/users/login',
        '/api/vi/users/register',
        {url: '/api/vi/orders' , methods: ['GET', 'OPTIONS']},
    ]
  })
}
// above, requires authentication, UNLESS the url is on products and it matches the types of requests, also the register / login pages no included
// tried to use regular expressions to include everything with e.g. /products, but denied access, so included separate paths (BUT individual /:id routes not working?)

// also issue with trying to e.g. delete users with valid token, and not being accepted, just giving a blank response

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }
    done(); 
}
// above, if the user is NOT admin, it will revoke the token

module.exports = authJwt;