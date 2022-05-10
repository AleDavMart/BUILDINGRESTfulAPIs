function bookController(Book) {
  function post(req, res) {
    const book = new Book(req.body); //Whatever gets posted to this route will create a new book in DB

    book.save();//saving the new book in DB
    return res.status(201).json(book); //returning that object and status
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
      return res.json(books);
    });
  }

  return { post, get };
}

module.exports = bookController;