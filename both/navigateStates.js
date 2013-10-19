
Meteor.methods({
  'addState': function(move, stateId){
    var state = States.findOne(stateId);
    var gameId = state.gameId;
    var prevChildId;
    if (state.childrenIds && state.childrenIds.length > 0){
      prevChildId = state.childrenIds[state.childrenIds.length-1];
    }
    var moves = state.moves;
    moves.push(move);
    // create new state
    var nextStateId = States.insert({
      parentId: stateId,
      prevSiblingId: prevChildId,
      moves: moves,
      gameId: gameId,
    });
    // update parent state
    States.update(stateId, {
      $push: { childrenIds: nextStateId },
      $set: { forwardStateId: nextStateId },
    });
    // if forking, update the other child's next sibling
    if (state.childrenIds && state.childrenIds.length > 0) {
      States.update(prevChildId, {
        $set: {nextSiblingId: nextStateId}
      });
    }
    // update Game
    Games.update(gameId, {$set:{ 
      currentStateId: nextStateId,
      adjustable: false, // TODO: allow customization
    }});
  },
  'goBack': function(stateId){
    var state = States.findOne(stateId);
    if (!state.parentId) throw new Meteor.Error(413, "Can't go further back.")
    Games.update(state.gameId, {
      $set: {currentStateId: state.parentId},
    });
    States.update(state.parentId, {
      $set: {forwardStateId: stateId}
    })
  },
  'goForward': function(stateId){
    var state = States.findOne(stateId);
    if (!state.forwardStateId) throw new Meteor.Error(413, "Can't go forward")
    Games.update(state.gameId, {$set: {currentStateId: state.forwardStateId}});
  },
  'updateCurrentState': function(gameId, newStateId){
    Games.update(gameId, {$set: {currentStateId: newStateId}});
  },
  removeState: function(stateId){
    var state = States.findOne(stateId);
    if (!state.parentId) {
      // root
      Games.remove(state.gameId);
      if (Meteor.isClient){
        Meteor.Router.to('/');
      }
    } else {
      Games.update(state.gameId, {
        $set: {currentStateId: state.parentId},
      });
      States.update(state.parentId, {
        $pull: {childrenIds: stateId },
      });
      var parent = States.findOne(state.parentId);
      var forwardState = null
      if (parent.childrenIds.length > 0){
        forwardState = parent.childrenIds[0];
      }
      States.update(state.parentId, {
        $set: {forwardStateId: forwardState},
      })
    }
    _.each(state.childrenIds, removeChildrenRecursively);
    States.remove(stateId);
  },
})

function removeChildrenRecursively(stateId){
  var state = States.findOne(stateId);
  _.each(state.childrenIds, removeChildrenRecursively);
  States.remove(stateId);
}