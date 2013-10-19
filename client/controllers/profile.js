
Template.profile.games = function(){
  var userId = Meteor.userId();
  if (!userId) return ;
  return Games.find({admins: {$elemMatch: {id: userId}}});
}

Template.profile.events({
  'click .delete-game-btn': function(evt){
    var gameId = evt.currentTarget.dataset.gameId;
    Meteor.call('deleteGame', gameId, function(err){
      if (err) alert(err.reason);
    })
  },
  'click .share-game-btn': function(evt){
    var gameId = evt.currentTarget.dataset.gameId;
    Meteor.call('shareGame', gameId, function(err){
      if (err) alert(err.reason);
    });
  },
  'click .unshare-game-btn': function(evt){
    var gameId = evt.currentTarget.dataset.gameId;
    Meteor.call('unshareGame', gameId, function(err){
      if (err) alert(err.reason);
    });
  },
})