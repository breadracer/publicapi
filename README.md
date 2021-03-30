# University Search
A simple web app that searches and displays information pulled from the public API [University Domains and Names Data List & API](https://github.com/Hipo/university-domains-list/).
## Features
### Searching universities based on name and country
You can search your interested universities via their name and/or country. The search result will contain its name, country, and official websites.
### Server-side pagination
This web app uses pagination to move through sets of results. The pagination is implemented on the server-side, which means the client will only get one page of the results upon each request (to reduce traffic per request).
### Server-side in-memory cache
The server is implemented such that it remembers recent searches from the clients and stores them in a local in-memory cache. This cache will automatically remove the oldest content when it has reached its maximum size. This greatly boost the performance for repeated searches and pagination. Since this is only a demo app, I did not put the cache content into a database.
## Running Locally
Make sure you have [Node.js](http://nodejs.org/) installed.
```sh
git clone git@github.com:breadracer/publicapi.git
cd publicapi
npm install
node index.js
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
## Run tests with Nigthwatch
Make sure you have the correct version of chrome installed since this test is run with chromedriver. It should works with chrome 89.
After you have the app run locally already, do:
```sh
npx nightwatch tests/test.js
```
