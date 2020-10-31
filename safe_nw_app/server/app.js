const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();

// Add all common middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", function(req, res, next){
    res.render('index', { title: 'Express' });
});

app.listen(3000, ()=>{
  console.log(`listening on port 3000...`);
});