# Learn Express

## Guide

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs

## Approach

-   use the guide as a starting point, then convert from callback style to async-await style
-   start adding more features like jwt authentication, redis, etc.
-   manage tasks on Trello board https://trello.com/b/K0mY1Jpo/learn-express)

## Stack

-   Express JS for server
-   Pug for template
-   Sendgrid for sending emails
-   Mongo Atlas for database
-   Redis Labs for in-memory storage
-   Bugsnag for monitoring errors
-   Zeit Now for deployment

## How

-   run `now login` to login Zeit
-   for deploy as serverless functions, look at **api** folder and copy content from `now.serverless.json` to `now.json`
    -   notes: Now hosted functions are AWS lambda functions and has max limit of 10 seconds for executing
-   for deploy as Express server, look at **index.js** file and copy content from `now.server.json` to `now.json`
-   add secrets to Zeit
    -   e.g. run `now secrets add my-mongodb-uri <mongo uri>` to add uri to mongo atlas db
-   run `now` to deploy to Zeit
-   to test on local:
    -   run `now dev` to run with Now functions on local **_OR_**
    -   run `npm run dev` to start Express server on local

---

Check deployed site (e.g. https://learn-express.trannguyenhung011086.now.sh/)
