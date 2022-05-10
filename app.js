const express = require('express');
const mongoose = require('mongoose');//will deal with MongoDB
const bodyParser = require('body-parser');

const app = express();
if(process.env.ENV === 'Test'){
  console.log('This is a test');
  const db = mongoose.connect('mongodb://localhost/bookAPI_Test');//created a TEST db to keep separate
}else{
  console.log('This is for real')
  const db = mongoose.connect('mongodb://localhost/bookAPI-prod');//created a db connection 
}

const port = process.env.PORT || 3000;
const Book = require('./models/bookModel'); // Creating a book model - mongo uses to drive the db
const bookRouter = require('./routes/bookRouter')(Book);//giving access to Book in routes -part of best practices

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //pull JSON from POST body and format in req.body

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});


app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;
