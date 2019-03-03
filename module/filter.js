//ints
let page, limit, offset, startPage, lastPage, searchQuery;
//strings
let searchPath, pagePath;

//getter and setter for the pagination and and search filters
module.exports = {
  paginationSetter: ({...data}) => {
    page = data.page || 1;
    page = parseInt(page, 10);
    limit = 10;
    offset = (page-1) * limit;
    startPage = page;
    lastPage = Math.ceil(data.total / limit);
    pagePath = '&page=' + page;
  },
  searchSetter: ({...data}) => {
    searchQuery = data.query;
    searchPath = 'search?query=' + searchQuery;
  }
  ,
  paginationGetter: () => {
    return { page, limit, offset, startPage, lastPage, pagePath }
  },
  searchGetter: () => {
    return { searchQuery, searchPath }
  }
}
