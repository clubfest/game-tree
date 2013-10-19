
Meteor.users.find({"profile.online": true}).observe({
  added: function(id){
    // console.log('add called')
  },
  removed: function(user){
    _.each(user.activeGameIds, function(gameId){
      Meteor.call('removeUserFromActiveGame', user._id, gameId, function(err){
        if (err) console.log(err.reason);
      })
    });
    Meteor.call('removeActiveGamesFromUser', user._id, function(err){
      if (err) console.log(err.reason);
    })
  }
})