Meteor.Router.add({
  '/': 'about',
  '/game/:id': function(gameId){
    Session.set('gameId', gameId);
    if (Meteor.userId()){
      Meteor.call('addUserToGame', gameId, function(err){
        if(err) alert(err.reason);
      });
    } else {
      return "login";
    }
    return 'game';
  },
  '/profile': 'profile',
  '/ideas': 'ideas',

  '/*': 'error',
  
})