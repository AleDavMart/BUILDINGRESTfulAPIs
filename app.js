const express = require('express');

const app = express();
// creating a router
const bookRouter = express.Router();
const port = process.env.PORT || 3000;


bookRouter.route('/books')
  .get( (req,res)=>{ //like a regular get route
    const response = { hello: 'This is my API'};

    res.json(response);
  });
app.use('/api', bookRouter);
  
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});



app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
