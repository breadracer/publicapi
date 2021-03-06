const express = require('express');
const ejs = require('ejs');
const axios = require('axios');

const InMemoryCache = require('./cache');

const app = express();

const PAGE_LENGTH = 5;
const CACHE_MAX_SIZE = 10000;

app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Length of a page for pagination
let page_length = PAGE_LENGTH;

// In-memory cache of search results
let cache = new InMemoryCache(CACHE_MAX_SIZE);
let cache_hit;

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('/search', async (req, res) => {
  // Setup the timer
  let timer_start = process.hrtime();

  // Get the request parameters
  let name = req.param('name');
  let country = req.param('country');
  let page = Number(req.param('page'));
  let data = [];

  if (cache.contains(name, country)) {
    // If cache hit, pull it from the cache
    data = cache.get(name, country);
    cache_hit = true;
  } else {
    // Otherwise, make the API call
    console.log('Made a request to API');
    let universities = await axios({
      method: 'get',
      url: `http://universities.hipolabs.com/search?name=${
        name ? name : ''}&country=${country ? country : ''}`
    });

    // Insert the search results into cache
    cache.add(name, country, universities.data);
    data = universities.data;
    cache_hit = false;
  }

  // Pagination
  let total_length = data.length;
  let start = (page - 1) * page_length;
  let end = start + page_length;
  if (total_length < end) end = total_length;
  data = data.slice(start, end);

  // Compute the rough server-side latency
  let latency = process.hrtime(timer_start);
  let latency_ms = latency[0] * 1000 + latency[1] / 1000000;
  console.log(cache.size + '/' + cache.max_size);
  console.log(latency_ms);

  // Rendering
  res.render('list', { data, total_length, page_length, name, country, page, latency_ms, cache_hit,
    cache_size: cache.size, cache_max_size: cache.max_size });

});

app.listen(3000);
