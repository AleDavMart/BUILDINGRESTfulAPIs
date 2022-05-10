/* eslint-disable no-param-reassign */
const express = require('express');
const booksController = require('../controllers/booksControllers');

function routes(Book) {

  const bookRouter = express.Router();
  const controller = booksController(Book);

  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);

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
    .get((req, res) => {
      const returnBook = req.book.toJSON();

      returnBook.links = {};
      const genre = req.book.genre.replace(' ', '%20'); // to replace the space in the link
      returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      res.json(returnBook);
    })
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
      })
      .delete((req, res) =>{
        req.book.remove((err)=>{
          if(err){
            return res.send(err);
          }
          return res.sendStatus(204); //removed status
        });
      });

  return bookRouter;//will return the book route back 
}

module.exports = routes; 