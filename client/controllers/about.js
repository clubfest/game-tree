
Template.about.unlockedGames = function(){
  return Games.find({
    locked: false,
    // activePlayers: {$size: {$ne:0}},
  });
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