const express = require('express');
const mongoose = require('mongoose');//will deal with MongoDB
const bodyParser = require ('body-parser');
const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');//created a db connection 
const bookRouter = express.Router(); //Created a router
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel'); // Creating a book model - mongo uses to drive the db

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); //pull JSON from POST body and format in req.body


bookRouter.route('/books')
  .post((req,res)=>{
    const book = new Book(req.body); //Whatever gets posted to this route will create a new book in DB
  })
  .get((req, res) => { //query to the mongodb and action to be taken
    const query = {};// creating an empty object for query
    if (req.query.genre) {
      query.genre = req.query.genre; //filtering queries based on generes, so weird queries will be ignored
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });
app.use('/api', bookRouter);

bookRouter.route('/books/:bookId') //filtering a single book by ID
  .get((req, res) => { //query to the mongodb and action to be taken

    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  });

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});


app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
