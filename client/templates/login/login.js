Template.login.events({
  "submit #loginForm": function(event){
    event.preventDefault();

    var user = {
      username: $(event.target).find("[name=username]").val(),
      password: $(event.target).find("[name=password]").val()
    };

    Meteor.loginWithPassword(user.username, user.password, function(err){
      if(err){
        alert("LOL");
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

      }else{
        Router.go("/newAcc");
      }
    });
  },
});
