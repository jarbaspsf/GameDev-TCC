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

if(!Skills.find().count()){

  var skill = {
    name: "Power Strike",
    description: "Attacks the enemy with a powerfull strike",
    dmgMod: 1.6,
    manaCost: 8,
    stats: 'str',
    type: 'dmg',
    target: 'enemy',
    iconPath: '/skills/knight/powerStrike.png',
    reqLvl: 1,
    class: "Knight"
  }

  Skills.insert(skill);

  var skill = {
    name: "Fireball",
    description: "Throw a fireball at the enemy",
    dmgMod: 2.0,
    manaCost: 18,
    type: 'dmg',
    stats: 'int',
    target: 'enemy',
    iconPath: '/skills/mage/fireball.png',
    reqLvl: 1,
    class: "Mage"
  }

  Skills.insert(skill);

  var skill = {
    name: "Backstab",
    description: "Jump behind the enemy and strike",
    dmgMod: 1.8,
    manaCost: 10,
    type: 'dmg',
    stats: 'str',
    target: 'enemy',
    iconPath: '/skills/rogue/backstab.png',
    reqLvl: 1,
    class: "Rogue"
  }

  Skills.insert(skill);
}

if(!Items.find().count()){

  var item = {
    name: "Iron Sword",
    description: "Normal Attacks does 20% more damage, +3 Strength",
    dmgMod: 1.2,
    bonus: {
      str: 3
    },
    slot: "MH",
    iconPath: '/items/equipment/knight/iron_sword.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Iron Shield",
    description: "A simple iron shield, +4 Defense",
    bonus: {
      def: 4
    },
    slot: "OH",
    iconPath: '/items/equipment/knight/iron_shield.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Iron Helmet",
    description: "A simple iron helmet, +3 Defense",
    bonus: {
      def: 3
    },
    slot: "head",
    iconPath: '/items/equipment/knight/iron_helmet.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Iron Armor",
    description: "A simple iron armor, +3 Defense, +30 Max HP",
    bonus: {
      def: 3,
      maxHP: 30
    },
    slot: "armor",
    iconPath: '/items/equipment/knight/iron_armor.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Iron Leggins",
    description: "A simple iron leggins, +3 Defense",
    bonus: {
      def: 3
    },
    slot: "legs",
    iconPath: '/items/equipment/knight/iron_leggins.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Iron Boots",
    description: "A simple iron boot, +3 Defense",
    bonus: {
      def: 3
    },
    slot: "boots",
    iconPath: '/items/equipment/knight/iron_boots.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);


  ///////////////////////////////
  //Mage Items
  ///////////////////////////////


  var item = {
    name: "Basic Staff",
    description: "Normal Attacks does 10% more damage, +3 Inteligence",
    dmgMod: 1.1,
    bonus: {
      int: 3
    },
    slot: "MH",
    iconPath: '/items/equipment/mage/basic_staff.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Basic Scepter",
    description: "The basic adept scepter, +1 Inteligence",
    bonus: {
      int: 1
    },
    slot: "OH",
    iconPath: '/items/equipment/mage/basic_scepter.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Adept Helmet",
    description: "The basic adept helmet, +1 Defense",
    bonus: {
      def: 1
    },
    slot: "head",
    iconPath: '/items/equipment/mage/adept_helmet.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Adept Coat",
    description: "The basic adept coat, +1 Defense, +30 Max Mana",
    bonus: {
      def: 1,
      maxMana: 30
    },
    slot: "armor",
    iconPath: '/items/equipment/mage/adept_coat.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Adept Leggins",
    description: "The basic adept leggins, +1 Defense",
    bonus: {
      def: 1
    },
    slot: "legs",
    iconPath: '/items/equipment/mage/adept_leggins.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Adept Shoes",
    description: "The basic adept shoes, +1 Defense",
    bonus: {
      def: 1
    },
    slot: "boots",
    iconPath: '/items/equipment/mage/adept_shoes.png',
    reqLvl: 1,
    class: "Mage",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  ///////////////////////////////
  //Rogue Items
  ///////////////////////////////


  var item = {
    name: "Basic Dagger",
    description: "Normal Attacks does 15% more damage, +2 Strength",
    dmgMod: 1.15,
    bonus: {
      str: 2
    },
    slot: "MH",
    iconPath: '/items/equipment/rogue/basic_dagger.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Basic Pistol",
    description: "A basic pistol, +2 Strength",
    bonus: {
      str: 2
    },
    slot: "OH",
    iconPath: '/items/equipment/rogue/basic_pistol.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Leather Mask",
    description: "A basic leather mask, +1 Defense, +1 Speed",
    bonus: {
      def: 1,
      spd: 1
    },
    slot: "head",
    iconPath: '/items/equipment/rogue/leather_mask.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Leather Jacket",
    description: "A basic leather jacket, +2 Defense",
    bonus: {
      def: 2
    },
    slot: "armor",
    iconPath: '/items/equipment/rogue/leather_jacket.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Leather Leggins",
    description: "A basic leather leggins, +2 Defense",
    bonus: {
      def: 2
    },
    slot: "legs",
    iconPath: '/items/equipment/rogue/leather_leggins.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  var item = {
    name: "Leather Boots",
    description: "A basic leather boots, +2 Defense, +2 Speed",
    bonus: {
      def: 1,
      spd: 2
    },
    slot: "boots",
    iconPath: '/items/equipment/rogue/leather_boots.png',
    reqLvl: 1,
    class: "Rogue",
    equipment: true,
    consumable: false,
    skillItem: false,
    tier: 0
  }

  Items.insert(item);

  //Consumable

  var item = {
    name: "Bread",
    description: "A tasteful bread",
    bonus: {
      def: 1
    },
    slot: null,
    iconPath: '/items/food/bread.png',
    reqLvl: 1,
    class: false,
    equipment: false,
    consumable: true,
    skillItem: false,
    tier: 1
  }

  Items.insert(item);

  var item = {
    name: "Wine",
    description: "A tasteful wine",
    bonus: {
      def: 1
    },
    slot: null,
    iconPath: '/items/food/wine.png',
    reqLvl: 1,
    class: "Knight",
    equipment: true,
    tier: 1
  }

  Items.insert(item);
}
