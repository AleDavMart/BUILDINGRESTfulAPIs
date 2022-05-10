require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app); //only required for super test to run app

describe('Book CRUD Test', () => {
  it('Should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My book 300', author: 'Ale Tito', genre: 'Fiction' }

    agent.post('/api/books') //going to send a post request to the route
      .send(bookPost)
      .expect(200)
      .end((err, result) => {
       // console.log(result);
        //result.body.read.should.not.equal(false);
        result.body.should.have.property('_id');
        done();
      });
  });

  afterEach((done)=>{ //cleaning up the db after each test
    Book.deleteMany({}).exec();
    done();
  });
});
