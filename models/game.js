
Games = new Meteor.Collection('games');

Meteor.methods({
  'newGame': function(){
    var userId = checkLogin();
    return Games.insert({
      width: 3,
      height: 3,
      name: "My game",
      creatorId: userId,
    });
  }
});

checkLogin = function(){
  return 42;
}