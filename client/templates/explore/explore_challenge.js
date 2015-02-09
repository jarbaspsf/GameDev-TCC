GLOBAL_CHALLENGE = null;

Template.exploreChallenge.destroyed = function(){
  clearInterval(GLOBAL_CHALLENGE);
}

Template.exploreChallenge.rendered = function(){
  $("#enemyHpBar").attr('aria-valuemax', 100);
  $("#enemyHpBar").attr('aria-valuenow', 100);
  $("#enemyHpBar").css('width', "100%");
  GLOBAL_CHALLENGE = setInterval(activateActionBar, 1000);
}

function activateActionButtons(){
  $('#attack-btn').attr('disabled', false);
  $('#defense-btn').attr('disabled', false);
}

function deactivateActionButtons(){
  $('#attack-btn').attr('disabled', true);
  $('#defense-btn').attr('disabled', true);
}


function enemyAtk(){
  Meteor.call("updateBattleLog", getChallenge().name, 'enemy', null, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
    if(err){

    }else{
      addLog(result.log);
      if(result.result.state == 'finished'){
        clearInterval(GLOBAL_CHALLENGE);
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
      if(result.ready)
        activateActionButtons();

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
    deactivateActionButtons();
    Meteor.call("updateBattleLog", Meteor.user().profile.charName, 'user', null, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
      if(err){

      }else{
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
        }
      }

    })
  },

  "click .useSkill" : function(event){
    event.preventDefault();
    if(Meteor.user().profile.currentMana < this.manaCost){
      addLog("You don't have enough mana!");
    }else{
      Meteor.call("updateBattleLog", Meteor.user().profile.charName, 'user', this._id, Session.get("enemyId"), null, Session.get("battleRegId"), function(err, result){
        if(err){

        }else{
          if(result.Err){
            addLog(result.Err);
          }else{
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
            }
          }
        }
      })
    }
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
