Handlebars.registerHelper('gameBoard', function(options){
  var ans = [];
  ans.push("<table class='game-board'>");
  for (var i=0; i<options.hash.height; i++){
    ans.push("<tr>");
    for (var j=0; j<options.hash.width; j++){
      ans.push("<td data-row='"+i+"' data-col='"+j+"'></td>");
    }
    ans.push("</tr>");
  }
  ans.push("</table>");
  ans.push(options.fn(this));
  return ans.join('\n');
});

Handlebars.registerHelper('length', function(array){
  if (!array) return;
  return array.length;
});

//// Date
Handlebars.registerHelper('dateAbbrev', function(date){
  return dateAbbrev(date);
});

dateAbbrev = function(date){
  if (!date) return 'T.B.A.';
  var current = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var ret = month+'/'+day;
  if (year!==current.getFullYear()){
    ret += '/'+year
  }
  return ret;
}
