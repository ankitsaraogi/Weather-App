import { nest, ascending, descending, sum, max, mean } from 'd3';


export default dataNest = function(data, options) {
    
  let nestData = nest(data); 

  /**
   * keys = [{ column: 'column_name1', sort: 'asc'},
   *         { column: 'column_name2', sort: 'desc'},
   *         { column: 'column_name3', sort: function(a,b) { return column_name3.indexOf(a) - column_name3.indexOf(b); }},
   *         { column: 'column_name4'},
   *        ]
   * sort is an optional property
   */

  let keys = options.keys;

  /**
   * rollups = [{ column: 'column_name', agg: 'count'},{ column: 'column_name', agg: 'sum'}]
   * agg functions supported - count, sum, max, avg
   */

  let rollups = options.rollups;

  /**
   * sortFunc = function(a,b) { return parseFloat(a.column) - parseFloat(b.column); }
   * sortFunc = function(a,b) { return ((a.who < b.who)? -1: 1); return 0;}
   * 
   */

  let sortFunc = options.sortFunc;
  
  let out = []; 

  keys.forEach(function(key) {
    if (key)
    {
      if (key.column) { nestData.key(function (d) { return d[key.column];}) ;}
      if (key.sort) { 
        switch (key.sort) 
        {
          case "asc":
            nestData.sortKeys(ascending);
            break ;
          case "desc":
            nestData.sortKeys(descending);
            break ;
          default:
            if (typeof(key.sort) === "function") {nestData.sortKeys(key.sort) ;}
            break ;
        }}
    }
  }, this);

  rollups.forEach(function(rollup) {
    if (rollup)
    {
      if (rollup.column) { nestData.key(function (d) { return d[key.column];}) ;}
      if (rollup.agg) { 
        switch (key.sort) 
        {
          case "asc":
            nestData.sortKeys(ascending);
            break ;
          case "desc":
            nestData.sortKeys(descending);
            break ;
          default:
            if (typeof(key.sort) === "function") {nestData.sortKeys(key.sort) ;}
            break ;
        }}
    }
  }, this);

};
