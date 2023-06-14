This was another back-server project, using mongodb instead of SQL querying like in my prior projects. There were online tutorials that I also used to go through the more advanced code as I hadn't used mongoose before

Technologies used:
- JavaScript / Node.js / express.js / mongodb and mongoose / JWT / morgan / CORS / multer / postman

Successes:
- Solidifying my understanding of back-end server requests
- Being able to create and adjust tables all within the same environment (as opposed to before when I was creating tables separately then sending requests etc)
- The authentication bearer token worked for the login / register routes, and I was able to add middleware to authenticate all routes
- I was able to fix a lot of the issues alone, without referring to the documentation, by following the error messages in the terminal / postman

Issues:
- The authentication exception paths proved to be difficult, as the tutorial recommended using regular expressions to include e.g. all GET paths from the /products route (e.g. including getting a specific /products:id path.) This did not work and whilst I covered the main paths via individual routes, I was unable to find a way to include the paths including request parameters
