const express = require ('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

const api = process.env.API_URL;

// routers
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

// middleware

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
// above, to access any of the routes, need to include e.g. on postman the bearer token (returned from the login post route to users)

// Routers
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)


mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('database connection ready...')
})
.catch((err) => {
    console.log(err);
})    

app.listen(3000, ()=> {
    console.log('server is running on local host 3000!');
})