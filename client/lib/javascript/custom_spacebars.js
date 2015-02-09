UI.registerHelper('hpPercentage', function() {
  var currentHP = Meteor.user().profile.currentHP;
  var maxHP = Meteor.user().profile.totalMaxHP;
  return percentage = parseInt((currentHP * 100) / maxHP).toFixed();
});

UI.registerHelper('manaPercentage', function() {
  var currentMana = Meteor.user().profile.currentMana;
  var maxMana = Meteor.user().profile.totalMaxMana;
  return percentage = parseInt((currentMana * 100) / maxMana).toFixed();
});
