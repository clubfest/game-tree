

Meteor.methods({
  'addUserToGame': function(gameId){
    var userId = checkUserId();
    Games.update(gameId, {$addToSet: {
      admins: {id: userId},
      activePlayers: {id: userId},
    }});
    Meteor.users.update(userId, {$addToSet: {
      activeGameIds: gameId,
    }});
  },
  'removeUserFromActiveGame': function(userId, gameId){
    console.log('removed')
    Games.update(gameId, {$pull: {
      activePlayers: {id: userId}
    }});
  },
  removeActiveGamesFromUser: function(userId){
    Meteor.users.update(userId, {$set: {activeGameIds: []}});
  },
  'newGame': function(){
    var user = checkUser();
    var stateId = States.insert({moves: []});
    var gameId = Games.insert({
      createdAt: new Date(),
      editedAt: new Date(),
      creatorId: user._id,
      creatorName: user.profile.name,
      admins: [{id: user._id}],
      activePlayers: [],
      title: "unknown game",
      currentStateId: stateId,
      locked: false,
      linked: true,
      width: 5,
      height: 5,
      adjustable: true,
    });
    States.update(stateId, {$set: {gameId: gameId}});
    Meteor.users.update(user._id, {$addToSet: {activeGameIds: gameId}});
    return gameId;
  },
  'updateTitle': function(gameId, title){
    Games.update(gameId, {$set:{ title: title }});
  },
  'updateContent': function(stateId, content){
    States.update(stateId, {$set:{ content: content }});
  },
  'deleteGame': function(gameId){
    States.remove({gameId: gameId});
    Games.remove(gameId);
  },
  'shareGame': function(gameId){
    Games.update(gameId, {$set: {shared: true}});
  },
  'unshareGame': function(gameId){
    Games.update(gameId, {$set: {shared: false}});
  },
  incrementHeight: function(incr, gameId){
    Games.update(gameId, {$inc: {height: incr}})
  },
  incrementWidth: function(incr, gameId){
    Games.update(gameId, {$inc: {width: incr}})
  },
});
