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
      query.incSta = Math.floor(5 + (users[i].profile.totalCon * 0.1)).toFixed();
    }

    if(parseInt(users[i].profile.currentHP) < parseInt(users[i].profile.maxHP)){
      if(parseInt(users[i].profile.maxHP) - parseInt(users[i].profile.currentHP) < 20){
        query.incHP = parseInt(users[i].profile.maxHP) - parseInt(users[i].profile.currentHP);
      }else{
        query.incHP = Math.floor(20 + (users[i].profile.totalCon * 0.25)).toFixed();
      }
    }

    if(parseInt(users[i].profile.currentMana) < parseInt(users[i].profile.totalMaxMana)){
      if(parseInt(users[i].profile.totalMaxMana) - parseInt(users[i].profile.currentMana) < 5){
        query.incMana = parseInt(users[i].profile.maxHP) - parseInt(users[i].profile.currentHP);
      }else{
        query.incMana = Math.floor(5 + (users[i].profile.totalInt * 0.25)).toFixed();
      }
    }

    console.log(query);

    Meteor.users.update(users[i]._id, {
      $inc: {
        "profile.sta": query.incSta,
        "profile.currentHP": query.incHP,
        "profile.currentMana": query.incMana,
      }
    });
    console.log("increased!");

  };
}

Meteor.setInterval(function(){refill()}, 3600000)
