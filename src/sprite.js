//src/sprite.js
export default {
  Player: {
    Portrait: {
      Key: 'player-portrait',
      Frames: {
        Neutral: 0,
        Happy: 1,
        Talk: 2,
        Sad: 3,
        Angry: 4
      }
    },
    Sprite: {
      Key: 'player-mage',
      Frames: {
        Idle: 0,
        Walk: 1,
        Attack: 2,
        Hurt: 3,
        Death: 4
      }
    }
  },
  Alchemist: {
    Portrait: {
      Key: 'alchemist-portrait',
      Frames: {
        Neutral: 4,
        Happy: 2,
        Talk: 0,
        Idle: 3,
        Angry: 1
      }
    }
  },
  Items: {
    Key: 'items',
    Frames: {
      // Define frames for each item
      Message: 0,
      Crown: 1,
      Crest: 2,
      Coins: 3,
      Key: 4, 
      QuestionMark: 5,
      Wrong: 6,
      Back: 7,
      FireScroll: 8,
      WaterScroll: 9,
      EarthScroll: 10,
      EmptyScroll: 11,
      PotionRed: 12,
      PotionBlue: 13,
      PotionGreen: 14,
      PotionWhite: 15,
      Fire: 16,
      Gem: 17,
      GreenGem: 18,
      Pocket: 19
    }
  }

}