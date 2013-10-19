
Meteor.publish("userStatus", function(){
  Meteor.users.find({"profile.online": true})
}, {
  field: {_id: 1, activeGameIds: 1}
});