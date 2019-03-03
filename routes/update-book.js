'use strict';
const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const filter = require('../module/filter');

//retriving the information from specific book
//we call search and pagination getters
//so when the user presses cancel it maintaines the prev. search book(s) query and page of where they left off
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Book.findById(id).then( books => {
    res.render('update-book', { book:books,
                                title:'update book',
                                pagePath: filter.paginationGetter().pagePath,
                                searchPath: filter.searchGetter().searchPath } );
  });
});

//Deletes entrance from the table and redirects to the home page
router.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;

  Book.findById(id)
  .then( book => { return book.destroy(); })
  .then( ()   => { res.redirect('/');  });
});

//update entrance form the table then redirect to the homepage
//and if the fields are empty it catches and displays the error tot the users
router.post('/:id/update', (req, res, next) => {
  const id = req.params.id;
  const bookInfo = req.body;


  Book.findById(id) .then(book => { return book.update(bookInfo);  })
  then( () => { res.redirect('/') })
  .catch( err => {

    if(err.name === 'SequelizeValidationError'){
      const book = Book.build(req.body);

      res.render('update-book', { book: book, title:'New Book',
                                  errors: err.errors });
    }
    else{ throw err; }

  })
  .catch( () => { res.send( 500 ) });
});

module.exports = router;
