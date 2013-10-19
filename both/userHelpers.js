
checkUserId = function(){
  var user = Meteor.userId();
  if (! user) throw new Meteor.Error(413, "You need to sign in first.")
  return user;
}

checkUser = function(){
  var user = Meteor.user();
  if (! user) throw new Meteor.Error(413, "You need to sign in first.")
  return user;
}