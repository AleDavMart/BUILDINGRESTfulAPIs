const express = require('express');
const mongoose = require('mongoose');//will deal with MongoDB

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');//created a db connection 
const bookRouter = express.Router(); //Created a router
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel'); // Creating a book model - mongo uses to drive the db


bookRouter.route('/books')
  .get((req, res) => { //query to the mongodb and take action
    Book.find((err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});


app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
