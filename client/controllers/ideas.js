
Template.ideas.publishedGames = function(){
  return Games.find({shared: true});
}