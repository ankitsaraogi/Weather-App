//To DO

export default dataHierarchy = function() 
{
  var datajson={},metrics = {},metricsList = [],nestedData, propList = [];
  var data,fieldTypes,hierarchy,fieldSettings,msrFields;
        
  function nest()
  {
  
    var isMeasure = function(fld)
    {   
      if (fieldTypes.hasOwnProperty(fld)) 
      {
        return fieldTypes[fld].type == "Measure" ? true : false;
      }    
      else
      {
        return false;
      }
    };
  
    var round = function(value, decimals) 
    {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };
  
  
    datajson = d3.nest();
    for (var key in fieldTypes)
    {
      if (isMeasure(key))
      {
        metricsList.push(key);
      }
      else {
        if (hierarchy.indexOf(key) == -1) { propList.push(key);}
      }
    } 
  
    hierarchy.forEach(function(key) {                    
      datajson.key(function(d) {return String(d[key]).trim();});
    });
  
    datajson = datajson.rollup(function(d) { 
      metrics = {};
      for (var key in vizVariables) 
      {
        var c = vizVariables[key];
        switch (c.aggregation) 
        {
          case "Sum":
            metrics[c.column + '_' + key] = round(d3.sum(d, function (g) { return parseFloat(g[c.column]); }), 2);
            break ;
          case "Avg":
            metrics[c.column + '_' + key] = round(d3.mean(d, function (g) { return parseFloat(g[c.column]); }), 2);
            break ;
          case "Max":
            metrics[c.column + '_' + key] = round(d3.max(d, function (g) { return parseFloat(g[c.column]); }), 2);
            break ;
          case "Min":
            metrics[c.column + '_' + key] = round(d3.min(d, function (g) { return parseFloat(g[c.column]); }), 2);
            break ;
          case "Count":
            metrics[c.column + '_' + key] = round(d3.sum(d, function (g) { return 1 ; }), 2);
            break ;
        }
      }
      propList.forEach(function(dim) { 
        metrics[dim] = d[0][dim];
      });
                
      return metrics;
  
    }).entries(data);
  
    var replaceKeyValues = function(parent)
    {   
      parent.forEach(function (d)
      {
        d.name = d.key;
        d.children = d.values;
        delete d.values;
        delete d.key;
      });
  
      parent.forEach(function (d){
        if (d.children.length != undefined)
          {replaceKeyValues(d.children);}
        else
        {
          d.properties = d.children;  
          delete d.children;
        }
      });
    };
    replaceKeyValues(datajson);
  
    nestedData = {
      "name": "",
      "children":
                 datajson
    };
    return nest;
  }
  
  nest.nestedData = function(_) {
    if (!arguments.length) {return nestedData;}
    nestedData = _;
    return nest;
  };
  
  nest.data = function(_) {
    if (!arguments.length) {return data;}
    data = _;
    return nest;
  };
  
  nest.fieldTypes = function(_) {
    if (!arguments.length) {return fieldTypes;}
    fieldTypes = _;
    return nest;
  };
  
  nest.hierarchy = function(_) {
    if (!arguments.length) {return hierarchy;}
    hierarchy = _;
    return nest;
  };
  
  nest.vizVariables = function(_) {
    if (!arguments.length) {return vizVariables;}
    vizVariables = _;
    return nest;
  };
  
  return nest;
};
  
  
  
