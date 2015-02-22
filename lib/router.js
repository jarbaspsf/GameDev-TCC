Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: 'loading'
});

Router.map(function(){
  this.route('login',{
    path: '/'
  });

  this.route('createChar',{
    path: '/newAcc'
  });

  this.route('mainMenu',{
    path: '/main',
    waitOn: function(){
      return [Meteor.subscribe("challenges")]
    }
  });
})

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {only: 'mainMenu'});
