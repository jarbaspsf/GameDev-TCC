

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
          errReason: err.reason,
          error: "Login Error"
        }
        Modal.show('loginErrorModal', data);
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
          maxHP: 0,
          str: 0,
          defense: 0,
          speed: 0,
          sta: 0,
          firstLogin: true
        }
    };

    Accounts.createUser(user, function(err){
      if(err){
        var data = {
          errReason: err.reason,
          error: "Create Account Error"
        }
        Modal.show('loginErrorModal', data);
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
