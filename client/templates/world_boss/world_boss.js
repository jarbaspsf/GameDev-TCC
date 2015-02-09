WORLD_BOSS = null;

Template.worldBoss.helpers({
  worldBosses: function(){
    return Challenges.find({boss: true});
  },

  loading: function(id){
    return true;
  }
});

Template.worldBoss.events({
  'click .btn-challenge': function(event){
    event.preventDefault();

    if(Meteor.user().profile.sta < 15 || Meteor.user().profile.currentHP <= 0)
      return;

      Session.set("enemyId", this._id);
      Meteor.call("initBattleLog", this._id, function(err, result){
        if(err){
          console.log(err);
        }else{
          Session.set("battleRegId", result);
          Session.set('currentTemplate', "exploreChallenge");
        }
      })

    }
  })


Template.worldBoss.rendered = function(){
  initialize();
};

Template.worldBoss.destroyed = function(){
  clearInterval(WORLD_BOSS);
};


function initialize(){
  var wBosses = Challenges.find({boss: true}).fetch();
  wBosses.forEach(function (boss) {
    initCountdown(boss.time, boss._id);
  });
}



function initCountdown(hours, id){
  var util = new Date();
  var temporary = false;
;
  if(hours == 0){
    temporary = true;
  }

  if(hours <= util.getHours())
    util.setDate(util.getDate() + 1);

  util.setHours(hours);
  util.setMinutes(0);
  util.setSeconds(0);
  var targetDateTime = util.getTime();
  var hours, minutes, seconds;

  var countdown = document.getElementById(id);

  // update the tag with id "countdown" every 1 second
  WORLD_BOSS = setInterval(function () {
    // find the amount of "seconds" between now and target
    var current_date = new Date().getTime();
    var seconds_left = (targetDateTime - current_date) / 1000;

    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;

    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);

    if(checkWindow(util, id, temporary)){
      $("."+id).attr('disabled', false);
      countdown.innerHTML = "Ready!!!"
    }else{
      $("."+id).attr('disabled', true);
      countdown.innerHTML = formatTime(hours) + ":"
      + formatTime(minutes) + ":" + formatTime(seconds);
    }

  }, 1000);

}

function checkWindow(util, id, temporary){
  currentDate = new Date();
  if(util.getHours() == currentDate.getHours() && currentDate.getMinutes() <= 20 || temporary)
    return true;
  return false;
}

function formatTime(unit){
  if(unit.toString().length == 1)
    return "0"+unit;
  return unit;
}
