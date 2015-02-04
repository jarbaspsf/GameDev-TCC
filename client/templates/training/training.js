TRAINING_GLOBAL = null;

Template.training.rendered = function(){
  if(!Meteor.user().profile.inTraining){
    $("#in-training").hide();
  }else{
    $("#select-training").hide();
    $("#in-training").show();
    initCountdown(Meteor.user().profile.initTimeTraining,
      Meteor.user().profile.trainingTime);
  }

}


Template.training.helpers({
  stats: function(){
      stats = {
        maxHP: Meteor.user().profile.maxHP,
        str: Meteor.user().profile.str,
        def: Meteor.user().profile.def,
        spd: Meteor.user().profile.spd
      };
      return stats;
  },

  skillPoints: function(){
    return Meteor.user().profile.skp;
  }
})

Template.training.events({
  'click .trainingButton' : function(event){
    event.preventDefault();
    $("#select-training").hide();
    $("#in-training").show();
    calculateTrainingTime(true);
  },

  'click .btn-stats' : function(event){
    event.preventDefault();
    type = $(event.target).attr('name');
    Meteor.call("updateStats", type, function(err, data){

    });
  }
});

function calculateTrainingTime(saveTraining){

  trainingTime = Meteor.user().profile.lvl * 600;

  if(saveTraining){
    Meteor.call("initTraining", function(err, result){
      if(err){
        console.log(err);
      }else{
        //Init!
        initCountdown(result.dateTime, result.seconds);
      }
    });
  }else{
    return trainingTime;
  }
}

function initCountdown(initDateTimeTraining, seconds){
  var millesecondsToAdd = seconds * 1000;
  var targetDateTime = initDateTimeTraining + millesecondsToAdd;
  var days, hours, minutes, seconds;

  var countdown = document.getElementById("trainingTime");
  // update the tag with id "countdown" every 1 second
  TRAINING_GLOBAL = setInterval(function () {
    // find the amount of "seconds" between now and target
    var current_date = new Date().getTime();
    var seconds_left = (targetDateTime - current_date) / 1000;

    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;

    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;

    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);

    if(seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0){
      Meteor.call("updateSkillPoints");
      clearInterval(TRAINING_GLOBAL);
      $("#select-training").show();
      $("#in-training").hide();
    }

    // format countdown string + set tag value
    countdown.innerHTML = days + "d, " + hours + "h, "
    + minutes + "m, " + seconds + "s";

  }, 1000);

}
