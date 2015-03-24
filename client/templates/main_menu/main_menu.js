Template.mainMenu.rendered = function(){
  Session.set('currentTemplate', "welcome");
  initialize();

  if(!isPlaying()){
    AUDIO_BACK = new Audio("HallsOfDespair.mp3");
    AUDIO_BACK.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    AUDIO_BACK.play();
  }
}

Template.mainMenu.destroyed = function(){
  AUDIO_BACK.pause();
  AUDIO_BACK.currentTime = 0;
  AUDIO_BACK = null;
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

function isPlaying(){
  if(AUDIO_BACK)
    return !AUDIO_BACK.paused;
  return false;
}
