const express = require('express');

function routes() {
  const bookRouter = express.Router();

  bookRouter.route('/books')
    .post((req, res) => {
      const book = new Book(req.body); //Whatever gets posted to this route will create a new book in DB

      book.save();//saving the new book in DB
      return res.status(201).json(book); //returning that object and status
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

  bookRouter.route('/books/:bookId') //filtering a single book by ID
    .get((req, res) => { //query to the mongodb and action to be taken

      Book.findById(req.params.bookId, (err, book) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    });

    return bookRouter;//will return the book route back 
}

module.exports = routes; 