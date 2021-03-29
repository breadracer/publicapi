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

app.get('/', (req, res) => {
  res.render('index', {});
  
});

app.get('/search', async (req, res) => {
  // Get the request parameters
  let name = req.param('name');
  let country = req.param('country');
  let page = Number(req.param('page'));

  // Make the API call
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

  console.log(total_length)
  // Rendering
  res.render('list', { data, total_length, page_length, name, country, page });

});

app.listen(3000);
