const express = require('express');
const ejs = require('ejs');
const axios = require('axios');

const InMemoryCache = require('./cache');

const app = express();

// app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Length of a page for pagination
let page_length = 5;

// In-memory cache of search results
let cache = new InMemoryCache(10000);
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
    data = cache.get(name, country);
    cache_hit = true;
  } else {
    // Make the API call
    console.log('Made a request to API');
    let universities = await axios({
      method: 'get',
      url: `http://universities.hipolabs.com/search?name=${
        name ? name : ''}&country=${country ? country : ''}`
    });
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

  let latency = process.hrtime(timer_start);
  let latency_ms = latency[0] * 1000 + latency[1] / 1000000;
  console.log(latency_ms);

  // Rendering
  res.render('list', { data, total_length, page_length, name, country, page, latency_ms, cache_hit });

});

app.listen(3000);
