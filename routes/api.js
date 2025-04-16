/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Erfolgreich verbunden');
  })
  .catch(err => {
    console.error('Verbindungsfehler:', err);
});

module.exports = Book;
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      const books = await Book.find();
      const result = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments ? book.comments.length : 0
      }));

      res.json(result);

    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.json('missing required field title');
      }


      const newBook = new Book({
        title: title,
        commentcount: 0
      });

      try {
        const savedBook = await newBook.save();

        res.json(savedBook);

      } catch (err) {
        res.status(500).json({ error: 'server fehler' });
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      
      try {

        await Book.deleteMany();
        res.status(200).json('complete delete successful');

      } catch (error) {

        res.status(500).json({ error: 'Fehler beim löschen' });
      }

    });



  app.route('/api/books/:id')
  .get(async function (req, res){
    let bookid = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(bookid)) {
      return res.status(404).json({ message: 'ID not found' });
    }
  
    try {

      const book = await Book.findById(bookid);
  
      if (!book) {
        return res.json('no book exists');
      }
  
      const result = {
        _id: book._id,
        title: book.title,
        comments: book.comments || []
      };
  
      res.json(result);
  
    } catch (error) {

      res.status(500).json({ message: 'server fehler' });
    }
  })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(404).json({ message: 'ID not found' });
      }

      try {

        const book = await Book.findById(bookid);

        if (!book) {
          return res.json('no book exists');
        }

        if (!comment) {
          return res.json('missing required field comment');
        }

        book.comments.push(comment);

        await book.save();

        book.commentcount = book.comments.length;

        const result = {
          _id: book._id,
          title: book.title,
          comments: book.comments || []
        };

        res.json(result);

      } catch (error) {
        res.status(500).json({ message: 'server fehler' });
      }

    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(404).json({ message: 'ID not found' });
      }
    
      try {
  
        const book = await Book.findById(bookid);

        if (!book) {
          return res.json('no book exists');
        }

        await book.deleteOne();
    
        res.json('delete successful');
    
      } catch (error) {
  
        res.status(500).json({ message: 'server fehler' });
      }

    });
  
};
