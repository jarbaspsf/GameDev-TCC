UI.registerHelper('hpPercentage', function() {
  currentHP = Meteor.user().profile.currentHP;
  maxHP = Meteor.user().profile.totalMaxHP;
  return percentage = parseInt((currentHP * 100) / maxHP).toFixed();
});

UI.registerHelper('manaPercentage', function() {
  currentMana = Meteor.user().profile.currentMana;
  maxMana = Meteor.user().profile.totalMaxMana;
  return percentage = parseInt((currentMana * 100) / maxMana).toFixed();
});
