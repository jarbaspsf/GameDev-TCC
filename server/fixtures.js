if(!Challenges.find().count()){

  var challenge = {
    name: "Orc",
    imagePath: "orc_sovereign.png",
    maxHP: 30,
    str: 8,
    def: 8,
    spd: 10,
    boss: false
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Orc Leader",
    imagePath: "orc_leader.png",
    maxHP: 50,
    str: 13,
    def: 13,
    spd: 13,
    boss: false
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Huntsman",
    imagePath: "huntsman.png",
    maxHP: 80,
    str: 15,
    def: 10,
    spd: 15,
    boss: false
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Druid",
    imagePath: "druid.png",
    maxHP: 90,
    str: 25,
    def: 7,
    spd: 10,
    boss: false
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Soldier",
    imagePath: "soldier.png",
    maxHP: 190,
    str: 25,
    def: 30,
    spd: 25,
    boss: false
  };

  Challenges.insert(challenge);

  var challenge = {
    name: "Archmage",
    imagePath: "archmage.png",
    maxHP: 300,
    str: 40,
    def: 15,
    spd: 20,
    boss: false
  };

  Challenges.insert(challenge);

  var wBoss = {
    name: "King Basara IV",
    imagePath: "basara.png",
    maxHP: 5000,
    currentHP: 5000,
    str: 50,
    def: 50,
    spd: 20,
    time: 23,
    boss: true
  };

  Challenges.insert(wBoss);

  var wBoss = {
    name: "King Draco",
    imagePath: "kingdraco.png",
    maxHP: 12000,
    currentHP: 12000,
    str: 120,
    def: 120,
    spd: 25,
    time: 16,
    boss: true
  };

  Challenges.insert(wBoss);

  var wBoss = {
    name: "Death Bringer",
    imagePath: "deathbringer.png",
    maxHP: 20000,
    currentHP: 20000,
    str: 200,
    def: 200,
    spd: 30,
    time: 19,
    boss: true
  };

  Challenges.insert(wBoss);

  var wBoss = {
    name: "Death Spectre",
    imagePath: "spectre.png",
    maxHP: 40000,
    currentHP: 40000,
    str: 400,
    def: 350,
    spd: 30,
    time: 15,
    boss: true
  };

  Challenges.insert(wBoss);

  var wBoss = {
    name: "Dark Lord Sinwo",
    imagePath: "sinwo.png",
    maxHP: 50000,
    currentHP: 50000,
    str: 400,
    def: 750,
    spd: 30,
    time: 17,
    boss: true
  };

  Challenges.insert(wBoss);

}
