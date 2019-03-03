'use strict';
const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const Book = require("../models").Book;
const filter = require('../module/filter');
const Op = Sequelize.Op;


/* GET home page.  and Re-routs to books*/
router.get('/', function(req, res, next) { res.redirect('/books'); });

//calls the filter module and sets the pagination page and search query so we can later call it when we need it
//Displays all of the books in the table and adds pagination
//then renders the index and calls the pagination getters to add pagination
router.get('/books', function(req, res, next) {
  const page = req.query.page;
  filter.paginationSetter({ page });
  filter.searchSetter({ query:'' });

  Book.findAndCountAll({ offset:filter.paginationGetter().offset,
                         limit: filter.paginationGetter().limit,
                         order: [['title', 'ASC']]
  })
  .then( books => {
    filter.paginationSetter({ page, total: books.count });

    res.render('index', { books: books.rows, title: 'Books',
                          lastPage: filter.paginationGetter().lastPage,
                          startPage: filter.paginationGetter().startPage,
                          searchPath: filter.searchGetter().searchPath });
  })
  .catch( () => { res.send( 400 ) });
});

//Gets the search query to filters it and displays
// all of the books that matches(title, author, genre, and year) with pagination
//then we renders index with all of the books if theres isnt any books then it will set notFound to false
//
router.get('/books/:query', function(req, res, next) {
  const query = req.query.query.toLowerCase();
  const page = req.query.page;
  let notFound = false;

  filter.paginationSetter({ page });
  filter.searchSetter({ query });

  Book.findAndCountAll({ where:{
                          [Op.or]: [
                          {title:{ [Op.like]: '%' + query + '%'}},
                          {author:{ [Op.like]: '%' + query + '%'}},
                          {genre:{ [Op.like]: '%' + query + '%'}},
                          {year:{ [Op.like]: '%' + parseInt(query,10) + '%' }}]
                       },

                        offset:filter.paginationGetter().offset,
                        limit: filter.paginationGetter().limit,
                        order: [['title', 'ASC']] })
  .then( books => {
    books.count <= 0 ? notFound = true : notFound = false

    filter.paginationSetter({ page, total: books.count });

    res.render('index', { books: books.rows, title: 'Books',
                          lastPage: filter.paginationGetter().lastPage,
                          startPage: filter.paginationGetter().startPage,
                          searchPath: filter.searchGetter().searchPath,
                          notFound: notFound,
                          value: query});
  });
});

module.exports = router;
