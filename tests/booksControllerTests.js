const { send } = require('express/lib/response');
const should = require ('should');
const sinon = require ('sinon');
const bookController = require ('../controllers/booksControllers');

describe('Book Controller Tests:', ()=>{
  deescribe('Post', ()=>{
    it('should not allow an empty title on post', ()=>{
      const Book = function(book){ this.save = () => {}};

      const req = {
        body: {
          author: 'John'
        }
      };

      const res = {
        status : sinon.spy(), // creating a spy function using sinon to keep track of what is called 
        send : sinon.spy(),
        json: sinon.spy()
      };

      const controller = bookController(Book);
      controller.post(req,res);
      
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Title is required').should.equal(true);

    });
  })
})