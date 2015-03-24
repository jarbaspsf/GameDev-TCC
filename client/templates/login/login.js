

Template.login.events({
  "submit #loginForm": function(event){
    event.preventDefault();

    var user = {
      username: $(event.target).find("[name=username]").val(),
      password: $(event.target).find("[name=password]").val()
    };

    Meteor.loginWithPassword(user.username, user.password, function(err){
      if(err){
        var data = {
          message: err.reason,
          tittle: "Login Error"
        }
        Modal.show('simpleModal', data);
      }else{
        if(Meteor.user().profile.firstLogin)
          Router.go("/newAcc");
        else
          Router.go("/main");
      }
    })

  },

  "submit #createAccountForm": function(event){
    event.preventDefault();

    var user = {
        username: $(event.target).find("[name=username]").val(),
        password: $(event.target).find("[name=password]").val(),
        profile: {
          fullName: $(event.target).find("[name=fullName]").val(),
          firstLogin: true
        }
    };

    Accounts.createUser(user, function(err){
      if(err){
        var data = {
          message: err.reason,
          tittle: "Create Account Error"
        }
        Modal.show('simpleModal', data);
      }else{
        Router.go("/newAcc");
      }
    });
  },

  'click #doLogin': function(event){
    event.preventDefault();
    if(Meteor.user().profile.firstLogin)
      Router.go("/newAcc");
    else
      Router.go("/main");
  }
});

Template.simpleModal.events({
  'click button': function(event){
    if(Session.equals("currentTemplate", "exploreChallenge")){
      Session.set("currentTemplate", "explore");
    }
  }
})
