/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {

        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {

        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res) {
          assert.equal(res.body, 'missing required field title');
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){

        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.isArray(res.body, 'response should be an array');
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){

        const invalidId = '2232';

        chai.request(server)
        .get('/api/books/' + invalidId)
        .end(function(err, res) {
          assert.equal(res.body.message, 'ID not found');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){

        const title = 'TestBook';
        
        chai.request(server)
        .post('/api/books')
        .send({ title: title })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          const bookId = res.body._id;

          chai.request(server)
          .get('/api/books/' + bookId)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, bookId);
            assert.equal(res.body.title, title);
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments.length, 0);

            done();
          });
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
  
      test('Test POST /api/books/[id] with comment', function(done){
        
        const title = 'TestBook';
        const comment = 'TestComment';
    
        chai.request(server)
          .post('/api/books')
          .send({ title: title })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            const bookId = res.body._id;
    
            chai.request(server)
              .post('/api/books/' + bookId)
              .send({ comment: comment })
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, bookId);
                assert.include(res.body.comments, comment, 'comment should be in comments array');
                done();
              });
          });
      });
    
      test('Test POST /api/books/[id] without comment field', function(done){

        const title = 'TestBook';
        const comment = 'TestComment';

        chai.request(server)
          .post('/api/books')
          .send({ title: title })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            const bookId = res.body._id;
            done();
          });
      });
    
      test('Test POST /api/books/[id] with comment, id not in db', function(done){

        const comment = 'TestComment';
        const falseBookId = '23232';

        chai.request(server)
        .post('/api/books/' + falseBookId)
        .send({ comment: comment })
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.body.message, 'ID not found');
          done();
        });
      });
    
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        
        const title = 'TestBook';

        chai.request(server)
        .post('/api/books')
        .send({ title: title })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          const bookId = res.body._id;

          chai.request(server)
          .delete('/api/books/' + bookId)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful');
            done();
          });

        });

      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){

        const falseBookId = '23232';

        chai.request(server)
        .delete('/api/books/' + falseBookId)
        .end(function(err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.body.message, 'ID not found');
          done();
        });
      });

    });

  });

});
