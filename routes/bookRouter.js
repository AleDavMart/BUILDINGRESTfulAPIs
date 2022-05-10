/* eslint-disable no-param-reassign */
const express = require('express');

function routes(Book) {

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
  bookRouter.use('/books/:bookId', (req, res, next) => { //Created Middleware to inject bookId to the requests
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next(); //letting it know we are done and to continue
      }
      return res.sendStatus(404);
    });
  });
  bookRouter.route('/books/:bookId') //filtering a single book by ID
    .get((req, res) => res.json(req.book))
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
      .patch((req, res) => {
          const { book } = req;
          // eslint-disable-next-line no-underscore-dangle
          if (req.body._id) { //we do not want to update/mess with the Id
            // eslint-disable-next-line no-underscore-dangle
            delete req.body._id;
          }

          Object.entries(req.body).forEach((item) => { //using to pull out array of key value pairs from body
            const key = item[0];
            const value = item[1];
            book[key] = value;
          });
          
          req.book.save((err) => {
            if (err) {
              return res.send(err);
            }
            return res.json(book);
          });
        });


  return bookRouter;//will return the book route back 
}

module.exports = routes; 