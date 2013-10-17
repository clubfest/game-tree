Meteor.Router.add({
  '/': 'about',
  '/game/:id': function(id){
    Session.set('gameId', id);
    return 'game';
  },
  
})