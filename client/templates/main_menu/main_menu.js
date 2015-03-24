Template.mainMenu.rendered = function(){
  Session.set('currentTemplate', "welcome");
  initialize();
}

function initialize(){
  userProfile = Meteor.user().profile;
  if(userProfile.sta < 100)
    $('#stBar').addClass('active');

  if(userProfile.currentHP < userProfile.maxHP)
    $('#hpBar').addClass('active');

  if(userProfile.currentMana < userProfile.maxMana)
    $('#manaBar').addClass('active');
}

Template.mainMenu.helpers({
  dynamicTemplate : function(){
    return Session.get('currentTemplate');
  },

  charProfile: function(){
    return Meteor.user().profile;
  }
})

Template.mainMenu.events({
  'click .menuSelect' : function(event){
    event.preventDefault();
    linkName = event.target.text;
    linkName = linkName.replace(/\s+/g, '');
    templateName = linkName[0].toLowerCase() + linkName.substr(1);
    Session.set('currentTemplate', templateName);
  },

  'click .logout' : function(event){
    Meteor.logout(function(){
      Router.go("/");
    })
  }


})
