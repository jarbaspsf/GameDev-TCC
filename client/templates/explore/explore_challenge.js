GLOBAL_CHALLENGE = null;
MY_AUDIO = null;

Template.exploreChallenge.destroyed = function(){
  clearInterval(GLOBAL_CHALLENGE);
  MY_AUDIO.pause();
  MY_AUDIO.currentTime = 0;
  MY_AUDIO = null;
}

Template.exploreChallenge.rendered = function(){
  $("#enemyHpBar").attr('aria-valuemax', 100);
  $("#enemyHpBar").attr('aria-valuenow', 100);
  $("#enemyHpBar").css('width', "100%");
  GLOBAL_CHALLENGE = setInterval(activateActionBar, 1000);
  if(getChallenge().boss)
    MY_AUDIO = new Audio('boss.mp3');
  else
    MY_AUDIO = new Audio('battle.mp3');

  MY_AUDIO.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  MY_AUDIO.play();
}

function enemyAtk(){
  Meteor.call("updateBattleLog", getChallenge().name, 'enemy', null, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
    if(err){

    }else{
      hitSound(true);
      addLog(result.log);
      if(result.result.state == 'finished'){
        clearInterval(GLOBAL_CHALLENGE);
        var data = {
          message: "C'mon you can do better!",
          tittle: "You Failed so bad"
        }
        Modal.show('simpleModal', data);
        endBattle("over");
      }
    }
  })

}

function activateActionBar(){
/*  $actionBar = $("#timeBar");
  current = parseInt($actionBar.attr('aria-valuenow'));
  progress = current + (Meteor.user().profile.spd * 1.25);
  $("#timeBar").attr('aria-valuenow', progress);
  $("#timeBar").css('width', progress+"%");
  if(parseInt($actionBar.attr('aria-valuenow')) >= parseInt($actionBar.attr('aria-valuemax'))){
    activateActionButtons();
  }

  $actionBar = $("#timeBarE");
  current = parseInt($actionBar.attr('aria-valuenow'));
  if(current >= 100){
    $("#timeBarE").attr('aria-valuenow', 0);
    $("#timeBarE").css('width', "0%");
  }else{
    progress = current + getChallenge().spd;
    $("#timeBarE").attr('aria-valuenow', progress);
    $("#timeBarE").css('width', progress+"%");
    if(parseInt($actionBar.attr('aria-valuenow')) >= parseInt($actionBar.attr('aria-valuemax'))){
      enemyAtk();
    }
  } */

  Meteor.call("calculateATB", Session.get("battleRegId"), Session.get("enemyId"), function(err, result){
    if(err){

    }else{
      if(result.enemyProgress > 0){
        $actionBar = $("#timeBarE");
        $("#timeBarE").attr('aria-valuenow', result.enemyProgress);
        $("#timeBarE").css('width', result.enemyProgress+"%");
        if(result.enemyProgress >= 100){
          enemyAtk();
        }
      }
    }
  })
}

Template.exploreChallenge.helpers({
  charProfile : function(){
    return Meteor.user().profile;
  },

  challenge: function(){
    return getChallenge();
  }
});


Template.exploreChallenge.events({
  'click #attack-btn' : function(event){
    event.preventDefault();

    Meteor.call("updateBattleLog", Meteor.user().profile.charName, 'user', null, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
      if(err){

      }else{
        if(result.Err){
          addLog(result.Err);
        }else{
          hitSound();
          currentHP = getChallenge().boss ? getChallenge().currentHP : result.enemyCurrentHP;
          maxHP = getChallenge().boss ? getChallenge().maxHP : result.enemyMaxHP;
          percentage = Math.round(((currentHP * 100) / maxHP).toFixed());
          console.log(percentage);
          $("#enemyHpBar").attr('aria-valuenow', currentHP);
          $("#enemyHpBar").css('width', percentage+"%");
          $("#timeBar").attr('aria-valuenow', 0);
          $("#timeBar").css('width', "0%");
          addLog(result.log);
          if(result.result.state == 'finished'){
            clearInterval(GLOBAL_CHALLENGE);
            var data = {
              message: "You won! The monster dropped some gold... just kidding, why a monster will carry gold?",
              tittle: "Congratulations!"
            }
            Modal.show('simpleModal', data);
            endBattle("won");
          }
        }
      }
    })
  },

  "click .useSkill" : function(event){
    event.preventDefault();
    if(Meteor.user().profile.currentMana < this.manaCost){
      addLog("You don't have enough mana!");
    }else{
      var that = this;
      Meteor.call("updateBattleLog", Meteor.user().profile.charName, 'user', this._id, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
        if(err){

        }else{
          if(result.Err){
            addLog(result.Err);
          }else{
            skillSound(that.sound);
            currentHP = getChallenge().boss ? getChallenge().currentHP : result.enemyCurrentHP;
            maxHP = getChallenge().boss ? getChallenge().maxHP : result.enemyMaxHP;
            percentage = parseInt((currentHP * 100) / maxHP);
            $("#enemyHpBar").attr('aria-valuenow', currentHP);
            $("#enemyHpBar").css('width', percentage+"%");
            $("#timeBar").attr('aria-valuenow', 0);
            $("#timeBar").css('width', "0%");
            addLog(result.log);
            if(result.result.state == 'finished'){
              clearInterval(GLOBAL_CHALLENGE);
              var data = {
                message: "You won! The monster dropped some gold... just kidding, why a monster will carry gold?",
                tittle: "Congratulations!"
              }
              Modal.show('simpleModal', data);
              endBattle("won");
            }
          }
        }
      })
    }
  },

  'click #run-btn': function(event){
    event.preventDefault();
    Session.set("currentTemplate", "explore");
  }
});

function addLog(log) {
  var txtArea = $("#textLog");
  txtArea.val( txtArea.val() + log+"\n");
  $('#textLog').scrollTop($('#textLog')[0].scrollHeight);
}

function getChallenge(){
  return Challenges.findOne(Session.get("enemyId"));
}

function endBattle(name){
  MY_AUDIO.pause();
  MY_AUDIO.currentTime = 0;
  MY_AUDIO = null;
  MY_AUDIO = new Audio(name+'.mp3');
  MY_AUDIO.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  MY_AUDIO.play();
}

function skillSound(sound){
  var skillAudio = null;
  console.log(sound);
  skillAudio = new Audio(sound);
  if(skillAudio){
    skillAudio.play();
  }
}

function hitSound(enemy){
  var attackAudio = null;
  if(Meteor.user().profile.charClass == "Mage" && !enemy)
    attackAudio = new Audio('bolt.wav');
  else
    attackAudio = new Audio('hit.wav');

  if(attackAudio){
    attackAudio.play();
  }
}
