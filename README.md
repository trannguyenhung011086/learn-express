# Learn Express

Guide: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
Notes:

-   use the guide as a starting point, then convert from callback style to async-await style
-   add more features like jwt authentication, redis, etc. (https://trello.com/b/K0mY1Jpo/learn-express)

## Stack

-   Express JS for server
-   Pug for template
-   Zeit Now for deployment

## How

-   run `now login` to login Zeit
-   for deploy as serverless functions, look at _api_ folder and copy content from `now.server.json` to `now.json`
-   for deploy as Express server, look at _index.js_ file and copy content from `now.serverless.json` to `now.json`
-   add secrets to Zeit
    -- e.g. run `now secrets add my-mongodb-uri <mongo uri>` to add uri to mongo atlas db
-   run `now` to deploy to Zeit
