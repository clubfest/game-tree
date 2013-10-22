
Games = new Meteor.Collection('games');
States = new Meteor.Collection('states');
// DiscardedGames = new Meteor.Collection('discardedGames');

Games.find({locked: false}).observeChanges({
  changed: function(id, game){
    if (game.activePayers && game.activePlayers.length===0){
      Games.update(id, {$set:{locked: true}})
    }
  }
})

Games.find({locked: true}).observeChanges({
  changed: function(id, game){
    if (game.activePayers && game.activePlayers.length>0){
      Games.update(id, {$set:{locked: false}})
    }
  }
})