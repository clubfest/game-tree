
Template.about.unlockedGames = function(){
  var games =Games.find({
    locked: false,
    // activePlayers: {$size: {$ne:0}},
  }).fetch();
  var activeGames = []
  _.each(games, function(game){
    if (game && game.activePlayers && game.activePlayers.length > 0) 
      activeGames.push(game);
  })
  return activeGames
}


Template.about.events({
  'click #new-game-btn': function(){
    Meteor.call('newGame', function(err, gameId){
      if (err) { alert(err.reason);
      } else { Meteor.Router.to('/game/'+gameId);
      }
    })
  }
})