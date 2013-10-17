
Template.about.activeGames = function(){
  return [{
    gameId: 3,
    name: "TicTacToe",
    creatorName: "Chor",
  }]
}

Template.about.events({
  'click #new-game-btn': function(){
    Meteor.call('newGame', function(err, gameId){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to('/game/'+gameId);
      }
    })
  }
})