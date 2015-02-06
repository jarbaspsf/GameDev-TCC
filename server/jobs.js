//This updates sta and hp
var refill = function(){
  console.log("Refreshing")
  var date = new Date();
  users = Meteor.users.find().fetch();

  for (var i = users.length - 1; i >= 0; i--) {
    var query = {
      incSta: 0,
      incHP: 0
    };

    if(users[i].profile.sta < 100){
      query.incSta = 5;
    }

    if(parseInt(users[i].profile.currentHP) < parseInt(users[i].profile.maxHP)){
      if(parseInt(users[i].profile.maxHP) - parseInt(users[i].profile.currentHP) < 20){
        query.incHP = parseInt(users[i].profile.maxHP) - parseInt(users[i].profile.currentHP);
      }else{
        query.incHP = 20;
      }
    }

    Meteor.users.update(users[i]._id, {
      $inc: {
        "profile.sta": query.incSta,
        "profile.currentHP": query.incHP
      }
    });
    console.log("increased!");

  };
}

Meteor.setInterval(function(){refill()}, 3600000)
