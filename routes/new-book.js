'use strict';
const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const filter = require('../module/filter');

/* GET home page. */
// gets the query from the pagination and search
// so when the user press cancel it maintaines the prev. search book(s) and page of where they left off
router.get('/', (req, res) => {
    res.render('new-book', { book:Book.build(), title:'New Book',
                             pagePath: filter.paginationGetter().pagePath,
                             searchPath: filter.searchGetter().searchPath});
});

//creating new book and redirects to the homepage
// and add validation to all of the input fields
router.post('/', (req, res) => {
  Book.create(req.body).then( (books) => {
    res.redirect('/');
  })
  .catch( err => {
    if(err.name === 'SequelizeValidationError'){
      res.render('new-book', { book:Book.build(req.body), title:'New Book', errors: err.errors });
    }else{
      throw err;
    }
  })
  .catch( err => { res.send( 500 ) });
});

module.exports = router;
