const express = require('express');
const ejs = require('ejs');
const axios = require('axios');

const app = express();

// app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let people = ['geddy', 'neil', 'alex'];
let people2 = ['geddydddddddd', 'neil', 'alex'];


app.get('/', (req, res) => {
  res.render('index', { people });
  
});

app.get('/search', async (req, res) => {
  console.log(req.param);
  let name = req.param('name');
  let country = req.param('country');
  let universities = await axios({
    method: 'get',
    url: `http://universities.hipolabs.com/search?name=${
      name ? name : ''}&country=${country ? country : ''}`
  });
  console.log(`http://universities.hipolabs.com/search?name=${name ? name : ''}&country=${country ? country : ''}`);
  res.render('list', { universities: universities.data });

});

app.listen(3000);
