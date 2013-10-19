
Template.game.created = function(){
  Session.set('isRecording', true);
  Session.set('colorId', 1);
  Deps.autorun(updateStateId);
  Deps.autorun(function(){
    if (!Session.get('stateId')) return ;
    var state = States.findOne(Session.get('stateId'));
    if (!state) return;
    var parent = States.findOne(state.parentId);
    if (!parent) return ;
    var childIdx = -1;
    for (var i=0; i<parent.childrenIds.length; i++){
      if (parent.childrenIds[i]==state._id){
        childIdx = i;
        break;
      }
    }
    Session.set('prevSiblingId', parent.childrenIds[i-1])
    Session.set('nextSiblingId', parent.childrenIds[i+1])
  });
  Deps.autorun(function(){
    var game = Games.findOne(Session.get('gameId'), {width: 1, height: 1})
    if (!game) return ;
    Session.set('width', game.width);
    Session.set('height', game.height);
  });
}


Template.game.rendered = function(){
  Deps.autorun(showCurrentColor);
  Deps.autorun(paintMoves);
  $.fn.editable.defaults.mode = 'inline';
  $('#game-title.editable:not(.editable-click)').editable('destroy').editable({
    success: function(response, newValue) {
      Meteor.call('updateTitle', Session.get('stateId'), newValue, function(err){
        if (err) alert(err.reason);
      });
    }
  });
  $('#game-content.editable:not(.editable-click)').editable('destroy').editable({
    success: function(response, newValue) {
      Meteor.call('updateContent', Session.get('stateId'), newValue, function(err){
        if (err) alert(err.reason);
      });
    }
  });
}

Template.game.events({
  'click #record-control button': function(){
    Session.set('isRecording', !Session.get('isRecording'));
  },
  'click #backward-btn': function(){
    Meteor.call("goBack", Session.get('stateId'));
  },
  'click #forward-btn': function(){
    Meteor.call("goForward", Session.get('stateId'));
  },
  'click .game-board td': function(evt){
    var data = evt.currentTarget.dataset;
    var move = {
      row: data.row,
      col: data.col,
      colorId: Session.get('colorId'),
    };
    paint(move);
    Meteor.call('addState', move, Session.get('stateId'));
  },
  'click .color-options td': function(evt){
    Session.set('colorId', evt.currentTarget.dataset.colorId);
  },
  'click #next-sibling-btn': function(){
    Meteor.call('updateCurrentState', Session.get('gameId'),
      Session.get('nextSiblingId'), function(err){
        if (err) alert(err.reason);
    });
  },
  'click #prev-sibling-btn': function(){
    Meteor.call('updateCurrentState', Session.get('gameId'),
      Session.get('prevSiblingId'), function(err){
        if (err) alert(err.reason);
    });
  },
  'click #delete-state-btn': function(){
    var state = States.findOne(Session.get('stateId'));
    var parentId = state.parentId;
    Meteor.call('removeState', Session.get('stateId'), function(err){
      if (err) alert(err.reason);
    });
  },
  'click #width-increase': function(){
    Meteor.call('incrementWidth', 1, Session.get('gameId'), function(err){
      if (err) alert(err.reason);
    });
  },
  'click #width-decrease': function(){
    Meteor.call('incrementWidth', -1, Session.get('gameId'), function(err){
      if (err) alert(err.reason);
    });
  },
  'click #height-increase': function(){
    Meteor.call('incrementHeight', 1, Session.get('gameId'), function(err){
      if (err) alert(err.reason);
    });
  },
  'click #height-decrease': function(){
    Meteor.call('incrementHeight', -1, Session.get('gameId'), function(err){
      if (err) alert(err.reason);
    });
  },
});

Template.game.isRecording = function(){
  return Session.get('isRecording');
}

Template.game.currentState = function(){
  return States.findOne(Session.get('stateId'));
}

Template.game.currentGame = function(){
  return Games.findOne(Session.get('gameId'));
}

Template.game.noBackward = function(){
  var state = States.findOne(Session.get('stateId'));
  if (!state) return false;
  return !state.parentId
}

Template.game.noForward = function(){
  var state = States.findOne(Session.get('stateId'));
  if (!state) return false;
  return !state.forwardStateId
}

Template.game.hasNextSibling = function(){
  return !!Session.get('nextSiblingId');
}

Template.game.hasPrevSibling = function(){
  return !!Session.get('prevSiblingId');
}

Template.game.hasSibling = function(){
  return Session.get('prevSiblingId') || Session.get('nextSiblingId');
}



function updateStateId(){
  var game = Games.findOne(Session.get('gameId'));
  if (game && Session.get('stateId')!=game.currentStateId){
    Session.set('stateId', game.currentStateId);
  }
}

function showCurrentColor(){
  $('.color-options tr td').removeAttr('data-selected');
  $(".color-options tr td[data-color-id='"+Session.get('colorId')+"']").attr('data-selected', 'true');
}

function paintMoves(){
  var state = States.findOne(Session.get('stateId'));
  if (!state || !state.moves) return ;
  $('.game-board tr td').removeAttr('data-selected');
  for (var i=0; i<state.moves.length; i++){
    paint(state.moves[i]);
  }
}
function paint(move){
  $("td[data-col='"+move.col+"']"+
    "[data-row='"+move.row+"']"
  ).attr('data-color-id', move.colorId);
};

Template.game.width = function(){
  return Session.get('width')
}

Template.game.height = function(){
  return Session.get('height')
}

