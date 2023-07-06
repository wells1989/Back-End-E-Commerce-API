# E-Commerce API (Backend)

This was a practice project to build a back-end server with mongoDB as the database

## Installation

npm install

### Dependencies

      "dependencies": {
        "bcryptjs": "^2.4.3",
        "body-parser": "^1.20.2",
        "cors": "^2.8.5",
        "dotenv": "^16.1.4",
        "express": "^4.18.2",
        "express-jwt": "^8.4.1",
        "jsonwebtoken": "^9.0.0",
        "mongoose": "^7.2.3",
        "morgan": "^1.10.0",
        "multer": "^1.4.5-lts.1",
        "nodemon": "^2.0.22"
      }

### Start API

npm start

## Use

### Routes

#### Products

- GET:    api/vi/products/
- GET:    api/vi/products/:id
- POST:   api/vi/products/
- PUT:    api/vi/products/:id
- DELETE: api/vi/products/:id
- GET: api/vi/products/get/count (gets a total count of all products)
- GET: api/vi/products/get/featured (gets a list of featured products)
- GET api/vi/products/get/featured/:count (gets a count of the featured products list)
- PUT: api/vi/products/gallery-images/:id (adds images to a certain product)

#### Orders

- GET: api/vi/orders/
- GET: api/vi/orders/:id
- POST: api/vi/orders/
- PUT: api/vi/orders/:id
- DELETE: api/vi/orders/:id
- GET: api/vi/orders/get/totalsales (get totalsales in monetary value)
- GET: api/vi/orders/get/count (gets a count of all orders made)
- GET: api/vi/orders/get/userorders/:userid (gets a count of orders made by a certain User ID)

#### Users

- GET: api/vi/users/
- GET api/vi/users/:id
- POST: api/vi/users/
- POST: api/vi/users/register
- POST: api/vi/users/login
- GET: api/vi/users/get/count (gets a count of the registered users)
- DELETE: api/vi/users/:id

#### Categories

- GET: api/vi/categories/
- GET: api/vi/categories/:id
- POST: api/vi/categories/
- PUT: api/vi/categories/:id
- DELETE: api/vi/categories/:id

## Personal Notes

This was another back-server project, using mongodb instead of SQL querying like in my prior projects. There were online tutorials that I also used to go through the more advanced code as I hadn't used mongoose before

### Successes:
- Solidifying my understanding of back-end server requests
- Being able to create and adjust tables all within the same environment (as opposed to before when I was creating tables separately then sending requests etc)
- The authentication bearer token worked for the login / register routes, and I was able to add middleware to authenticate all routes
- I was able to fix a lot of the issues alone, without referring to the documentation, by following the error messages in the terminal / postman

### Issues:
- The authentication exception paths proved to be difficult, as the tutorial recommended using regular expressions to include e.g. all GET paths from the /products route (e.g. including getting a specific /products:id path.) This did not work and whilst I covered the main paths via individual routes, I was unable to find a way to include the paths including request parameters
- The use of multer was very challenging to successfully upload images, and whilst I was able to complete the multiple images path, the individual image path in the /products post request did not work, so I opted for a simpler route using the image URL as text.
