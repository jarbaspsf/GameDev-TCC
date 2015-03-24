Template.createChar.events({
  'submit #createCharForm': function(event){
    event.preventDefault();

    charName = $(event.target).find("[name=charName]").val();

    if(!charName){
      alert("Please enter with a character name, yeah i know this is dificult...");
      return;
    }

    if(!Session.get("charClass")){
      alert("Please enter with a character Class, yeah i know this is dificult...");
      return;
    }

    Meteor.call("createChar", Session.get("charClass"), charName, function(err, result){
      if(err){
        var data = {
          message: err.reason,
          tittle: "Character Creation Error"
        }
        Modal.show('simpleModal', data);
      }else{
        Router.go("/main");
      }
    })
  },

  "click .classChoice": function(event){
    event.preventDefault();
    $(".classChoice").removeClass("active");
    $(event.target).addClass("active");
    $(".panel").removeClass("hover");
    $(event.target).parent().parent().addClass("hover");
    Session.set("charClass", $(event.target).text().split(" ").reverse()[0]);
  }
});
