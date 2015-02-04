Template.mainMenu.rendered = function(){
//  setInterval(activateActionBar, 500);
}

Template.mainMenu.helpers({
  teste : function(){
    if(Session.get('currentMenu')){
      return Session.get('currentMenu');
    }else{
      return Session.get('currentTemplate');
    }
  },

  currentST: function(){
    return Meteor.user().profile.sta;
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

function activateActionBar(){
  $actionBar = $("#actionBar");
  current = parseInt($actionBar.attr('aria-valuenow'));
  if(current >= 100){
    $("#actionBar").attr('aria-valuenow', 0);
    $("#actionBar").css('width', 0+"%");
  }else{
    progress = current + 1;
    $("#actionBar").attr('aria-valuenow', progress);
    $("#actionBar").css('width', progress+"%");
  }
}
