function bookController(Book) {
  function post(req, res) {
    const book = new Book(req.body); //Whatever gets posted to this route will create a new book in DB

    if(!req.body.title){
      res.status(400);
      return res.send('Title is required');
    }

    book.save();//saving the new book in DB
    res.status(201)
    return res.json(book); //returning that object and status
  }

  function get(req, res) { //query to the mongodb and action to be taken
    const query = {};// creating an empty object for query
    if (req.query.genre) {
      query.genre = req.query.genre; //filtering queries based on generes, so weird queries will be ignored
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      const returnBooks = books.map((book)=>{
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });
      return res.json(returnBooks);
    });
  }

  return { post, get };
}

module.exports = bookController;