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

app.post('/search', async (req, res) => {
  console.log(req.body);
  let universities = await axios({
    method: 'get',
    url: `http://universities.hipolabs.com/search?name=${req.body.name}`
  });
  // console.log(universities);
  res.render('list', { universities: universities.data });

});

app.listen(3000);
