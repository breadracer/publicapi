const express = require('express');
const ejs = require('ejs');
const axios = require('axios');

const app = express();

// app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Length of a page for pagination
let page_length = 5;

// In-memory cache of search results
let cache = {};

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

  
  // Make the API call
  console.log('Made a request to API');
  let universities = await axios({
    method: 'get',
    url: `http://universities.hipolabs.com/search?name=${
      name ? name : ''}&country=${country ? country : ''}`
  });

  // Pagination
  let total_length = universities.data.length;
  let start = (page - 1) * page_length;
  let end = start + page_length;
  if (total_length < end) end = total_length;
  let data = universities.data.slice(start, end);

  let latency = process.hrtime(timer_start);
  let latency_ms = latency[0] * 1000 + latency[1] / 1000000;
  console.log(latency_ms);

  // Rendering
  res.render('list', { data, total_length, page_length, name, country, page, latency_ms });

});

app.listen(3000);
