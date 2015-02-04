if(!Challenges.find().count()){

  var challenge = {
    name: "Orc",
    imagePath: "orc_sovereign.png",
    maxHP: 100,
    currentHP: 100,
    str: 5,
    def: 5,
    spd: 4
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Orc Leader",
    imagePath: "orc_leader.png",
    maxHP: 200,
    currentHP: 200,
    str: 8,
    def: 8,
    spd: 8
  };

  Challenges.insert(challenge);
}
