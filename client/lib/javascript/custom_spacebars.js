UI.registerHelper('hpPercentage', function() {
  var currentHP = Meteor.user().profile.currentHP;
  var maxHP = Meteor.user().profile.totalMaxHP;
  return percentage = Math.round(((currentHP * 100) / maxHP).toFixed());
});

UI.registerHelper('manaPercentage', function() {
  var currentMana = Meteor.user().profile.currentMana;
  var maxMana = Meteor.user().profile.totalMaxMana;
  return percentage = Math.round(((currentMana * 100) / maxMana).toFixed());
});

UI.registerHelper('enemyHP', function(enemyId) {
  var enemy = Challenges.findOne(enemyId);
  if(enemy.boss){
    var currentHP = enemy.currentHP;
    var maxHP = enemy.maxHP;
    return percentage = Math.round(((currentHP * 100) / maxHP).toFixed());
  }else{
    return 100;
  }
});
