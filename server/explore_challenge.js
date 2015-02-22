Meteor.methods({
  initBattleLog: initBattleLog,
  updateBattleLog: updateBattleLog,
  calculateATB: calculateATB,
  getBossBattleLogs: getBossBattleLogs
});

function calculateATB(battleRegId, enemyId){
  enemy = Challenges.findOne(enemyId);
  if(!enemy)
    return new Error();

  var userReady = false;
  var enemyProgress = 0;
  var lastBattleLog;
  if(enemy.boss)
    lastBattleLog  = BattleLogs.find({battleRegId: battleRegId, enemyId: enemyId}, {sort : {date: -1}}).fetch()[0];
  else
    lastBattleLog  = BattleLogs.find({battleRegId: battleRegId}, {sort : {date: -1}}).fetch()[0];
  //tests on battleLog
  //Enemy!!
  if(lastBattleLog.enemyProgress >= 100){
    //Manage enemy atk

  }else if(lastBattleLog.enemyDebuffs.stunDebuff.active){
    //manage enemy debuff
    manageEnemyStunDebuff();
  }else{
    //calculate progress
    var speedBuff = lastBattleLog.enemyBuffs.speedBuff.qty;
    var speedDebuff = lastBattleLog.enemyDebuffs.speedDebuff.qty;
    var speed = enemy.spd + (speedBuff ? speedBuff : 0) - (speedDebuff ? speedDebuff : 0);
    if(speed > 0){
      BATTLE_HELPER.updateEnemyATB(lastBattleLog, speed);
      enemyProgress = lastBattleLog.enemyProgress + speed;
    }
  }

  //user!!
  if(Meteor.user().profile.battle.progress >= 100){
    //Set user Ready
    userReady = true;
  }else if(Meteor.user().profile.debuffs.stunDebuff.active){
    //manage stun debuf
    manageCharStunDebuff();
  }else{
    //calculate progress
    var speedBuff = Meteor.user().profile.buffs.speedBuff.qty;
    var speedDebuff = Meteor.user().profile.debuffs.speedDebuff.qty;
    var speed = Meteor.user().profile.totalSpd + (speedBuff ? speedBuff : 0) - (speedDebuff ? speedDebuff : 0);
    if(speed > 0){
      BATTLE_HELPER.updateCharATB(speed);
    }
  }

  return {ready: userReady, enemyProgress: enemyProgress};
}

function initBattleLog(enemyId){

  enemy = Challenges.findOne(enemyId);

  if(!enemy){
    return new Error();
  }

  battleReg = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    enemyId: enemyId,
    enemyName: enemy.name
  }

  var battleRegId = BattleRegs.insert(battleReg)

  battleLog = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    charName: Meteor.user().profile.charName,
    charMaxHP: Meteor.user().profile.maxHP,
    charCurrentHP: Meteor.user().profile.currentHP,
    enemyId: enemyId,
    enemyName: enemy.name,
    enemyMaxHP: enemy.maxHP,
    enemyCurrentHP: enemy.maxHP,
    log: Meteor.user().profile.charName + " engages " + enemy.name,
    date: new Date().getTime(),
    result : {
      state: 'initied', won_by: null
    },
    battleRegId: battleRegId,
    enemyDebuffs: {
      stunDebuff: {
        active: false,
        tick: 0
      },

      speedDebuff: {
        active: false,
        tick: 0,
        qty: 0
      }
    },
    enemyBuffs: {
      speedBuff: {
        active: false,
        tick: 0,
        qty: 0
      }
    },
    enemyProgress: 0,
    damage: 0
  }

  Meteor.users.update(Meteor.userId(), {
    $inc: {
      "profile.sta": -5
    }
  });

  BATTLE_HELPER.resetCharBuffs();
  BATTLE_HELPER.resetCharATB();
  BattleLogs.insert(battleLog);
  return battleRegId;


}

function updateBattleLog(actionUser, type, skillId, enemyId, pvp, battleRegId){

  var damage = 0
  var usesSkill, enemy, firstHit;
  var skill = Skills.findOne(skillId);
  enemy = Challenges.findOne(enemyId);
  //Test ATB
  if(type != "enemy"){
    if(!BATTLE_HELPER.checkCharATB())
      return {Err: "You can't attack now, please wait the ATB fill up!"};
  }

  if(enemy.boss){
    lastBattleLog  = BattleLogs.find({battleRegId: battleRegId, enemyId: enemyId}, {sort : {date: -1}}).fetch()[0];
    //first hit on boss
    if(!lastBattleLog){
      lastBattleLog = {
        enemyCurrentHP: enemy.maxHP
      }
    }
  }else{
    lastBattleLog  = BattleLogs.find({battleRegId: battleRegId}, {sort : {date: -1}}).fetch()[0];
  }

  if(lastBattleLog && lastBattleLog.result == 'finished'){
    return lastBattleLog;
  }



  //normal atk
  if(skill && skill.type == "dmg"){
    var userStats;
    if(skill.stats == 'str')
      userStats = Meteor.user().profile.totalStr;
    else
      userStats = Meteor.user().profile.totalInt

    damage = parseInt(((userStats * skill.dmgMod) * Math.floor((Math.random() * 2) + 1)).toFixed());
    usesSkill = true;
    updateMana(skill.manaCost);
  }else if(skill && skill.type == "buff"){
    usesSkill = true;
    BATTLE_HELPER.manageCharBuff(skill);
    updateMana(skill.manaCost);
  }else if(type != 'enemy'){
    var weapon = Meteor.user().profile.activeEquipment.MH;
    var dmgMod = 0;
    if(weapon && weapon.dmgMod)
      dmgMod = weapon.dmgMod;
    else
      dmgMod = 1.1;
    damage = parseInt(((Meteor.user().profile.totalStr * dmgMod) * Math.floor((Math.random() * 2) + 1)).toFixed());;
    damage = parseInt(damage - Math.floor((enemy.def * 1.2) / 2).toFixed());
  }else{
    damage = parseInt(((enemy.str * 1.2) * Math.floor((Math.random() * 2) + 1)).toFixed());
    var defBuff = Meteor.user().profile.buffs.defenseBuff.active ? Meteor.user().profile.buffs.defenseBuff.qty : 0;
    damage = parseInt(damage - Math.floor(((Meteor.user().profile.totalDef + defBuff)* 1.1) / 2).toFixed());
    if(defBuff > 0){
      BATTLE_HELPER.decreaseBuffTick("defenseBuff");
    }
  }

  if(damage < 0)
    damage = 0;

  var log;

  if(usesSkill && skill.type == 'heal'){
    log = actionUser + " uses "+ skill.name +" and heals for: "+ damage + " HP";
  }else if(usesSkill && skill.type == 'dmg'){
    log = actionUser + " uses "+ skill.name +" and hits for: "+ damage + " HP";
  }else if(usesSkill && skill.type == 'buff'){
    log = actionUser + " uses "+ skill.name;
  }else{
    log = actionUser + " attacks and hits for: "+ damage + " HP";
  }

  var lastBattleLog;

  var battleLog = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    charName: Meteor.user().profile.charName,
    charMaxHP: Meteor.user().profile.maxHP,
    charCurrentHP: Meteor.user().profile.currentHP,
    enemyId: enemyId,
    enemyName: enemy.name,
    enemyMaxHP: enemy.maxHP,
    enemyCurrentHP: lastBattleLog.enemyCurrentHP,
    log: log,
    date: new Date().getTime(),
    damage: parseInt(damage),
    enemyProgress: lastBattleLog.enemyProgress,
    enemyBuffs: lastBattleLog.enemyBuffs,
    enemyDebuffs: lastBattleLog.enemyDebuffs,
    battleRegId: battleRegId
  }

  if(type == "enemy"){
    updateCharDmg(damage);
    if(Meteor.user().profile.currentHP <= 0){
      setHpToZero();
      battleLog.result = {state: 'finished', won_by: actionUser};
      battleLog.log += "\n"+ actionUser + " won the battle!";
    }else{
      battleLog.charCurrentHP = Meteor.user().profile.currentHP;
      battleLog.result = {state: 'fighting', won_by: null};
    }
    battleLog.enemyProgress = 0;
    BattleLogs.insert(battleLog);
    return battleLog;
  }else{
    if(pvp){

    }else{
      BATTLE_HELPER.resetCharATB();
      if(enemy.boss){
        updateBossDmg(enemyId, damage);
        if(enemy.currentHP <= 0){
          battleLog.result = {state: 'finished', won_by: actionUser};
          battleLog.log += "\n"+ actionUser + " won the battle!";
        }else{
          battleLog.charCurrentHP = Meteor.user().profile.currentHP;
          battleLog.result = {state: 'fighting', won_by: null};
        }
        BattleLogs.insert(battleLog);
        return battleLog;
      }else{
        if(lastBattleLog.enemyCurrentHP - damage <= 0){
          battleLog.enemyCurrentHP = 0;
          battleLog.result = {state: 'finished', won_by: actionUser};
          battleLog.log += "\n"+ actionUser + " won the battle!";
        }else{
          battleLog.enemyCurrentHP = parseInt((lastBattleLog.enemyCurrentHP - damage).toFixed());
          battleLog.result = {state: 'fighting', won_by: null};
        }
        BattleLogs.insert(battleLog);
        return battleLog;
      }
    }
  }
}

BATTLE_HELPER = {
  updateCharATB: function(speed){
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.battle.progress": speed
      }
    })
  },

  resetCharATB: function(speed){
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.battle.progress": 0
      }
    })
  },

  checkCharATB: function(){
    return Meteor.user().profile.battle.progress >= 100;
  },

  updateEnemyATB: function(battleLog, speed){
    var totalProgress = battleLog.enemyProgress + speed;
    var newDate = new Date().getTime();
    BattleLogs.update(battleLog._id, {
      $set: {
        "enemyProgress": totalProgress,
        "date": newDate
      }
    });
  },

  manageCharBuff: function(skill){
    console.log("buffando 2")
    var qty = 0;
    var query = {};
    var capitilized = skill.buff.stats.charAt(0).toUpperCase() + skill.buff.stats.slice(1)
    if(skill.buff.type == 'percentage'){
      var factor = parseFloat((skill.buff.qty / 100).toFixed(2));
      console.log(factor);
      qty = Meteor.user().profile["total"+capitilized] * factor;
      console.log(qty);
    }else{
      qty = skill.buff.qty
    }

    query["profile.buffs."+skill.buff.buffType] = {
      active: true,
      tick: skill.buff.tick,
      qty: qty
    }

    console.log(query);

    Meteor.users.update(Meteor.userId(), {
      $set: query
    })

    return qty;
  },

  resetCharBuffs: function(){

    var resetBuff = {
      active: false,
      tick: 0,
      qty: 0
    }

    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.buffs.speedBuff": resetBuff,
        "profile.buffs.strengthBuff": resetBuff,
        "profile.buffs.inteligenceBuff": resetBuff,
        "profile.buffs.defenseBuff": resetBuff,
        "profile.buffs.constitutionBuff":resetBuff
      }
    });
  },

  decreaseBuffTick: function(buffType){
    buff = Meteor.user().profile.buffs[buffType];
    if(!buff.active)
      return;

    var query = {};

    if(buff.tick <= 1){
      var resetBuff = {
        active: false,
        tick: 0,
        qty: 0
      }
      query["profile.buffs."+buffType] = resetBuff;
      Meteor.users.update(Meteor.userId(), {
        $set : query
      });
    }else{
      query["profile.buffs."+buffType+".tick"] = -1;
      Meteor.users.update(Meteor.userId(), {
        $inc : query
      });
    }

  }

}

function getBossBattleLogs(enemyId){
  console.log(BattleLogsAggr.find().fetch());
}

function updateCharDmg(damage){

  Meteor.users.update(Meteor.userId(), {
    $inc: {
      "profile.currentHP": -(damage)
    }
  });
}

function updateMana(mana){

  Meteor.users.update(Meteor.userId(), {
    $inc: {
      "profile.currentMana": -(mana)
    }
  });
}

function updateBossDmg(enemyId, damage){

  Challenges.update(enemyId, {
    $inc: {
      "currentHP": -(damage)
    }
  });
}

function setHpToZero(){

  Meteor.users.update(Meteor.userId(), {
    $set: {
      "profile.currentHP": 0
    }
  });
}
