class Card {
  constructor(suitData, valueData, rankData, faceData) {
    this.suit = suitData;
    this.value = valueData;
    this.rank = rankData;
    this.face = faceData;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.suits = [
      "clubs \u2663",
      "diamonds \u2666",
      "hearts \u2665",
      "spades \u2660",
    ];
    this.values = [
      "Ace",
      "King",
      "Queen",
      "Jack",
      "Ten",
      "Nine",
      "Eight",
      "Seven",
      "Six",
      "Five",
      "Four",
      "Three",
      "Two",
    ];
    this.suits.forEach((suit, suitIndex) => {
      //   console.log("suit index:", suitIndex, "suit:", suit);
      this.values.forEach((value, valueIndex) => {
        // console.log("value index:", valueIndex, "value:", value);
        this.cards.push(
          new Card(suit, value, valueIndex, `${value} of ${suit}`)
        );
      });
    });
  }

  shuffle() {
    for (let i = 0; i < this.cards.length; i++) {
      let swapIdx = Math.trunc(Math.random() * this.cards.length);
      let tmp = this.cards[swapIdx];
      this.cards[swapIdx] = this.cards[i];
      this.cards[i] = tmp;
    }
  }

  draw() {
    return this.cards.pop();
  }
}

//Game will need a Dealer(CPU) and a Player
class Player {
  constructor(nameData, moneyData) {
    this.name = nameData;
    this.hand = [];
    this.money = moneyData;
    this.total = 0;
    this.busted = false;
  }

  takeCard(deck) {
    this.hand.push(deck.draw());
  }
}

class Game {
  constructor() {
    this.deck = [];

    let playerName = "Matthew";
    this.player = new Player(playerName, 1000); //creates a new player and starts them with $1000

    this.playerName = this.player.name + "'s"; //Cool way to display the player's name with an apostrophe

    this.dealer = new Player("Dealer", 999999999); //creates a new dealer (CPU), dealer starts with 999999999 money
    this.dealerName = this.dealer.name + "'s"; //Cool way to display the dealer's name with an apostrophe

    this.playerTurn = null;
  }

  play() {
    if (this.player.money <= 0) {
      console.log("You are out of money!");
      return;
    }

    //clear the player and dealer hands
    this.player.hand = [];
    this.dealer.hand = [];
    this.playerBusted = false;
    this.dealerBusted = false;

    //create a new deck of cards
    this.deck = new Deck();
    //shuffle the deck of cards
    this.deck.shuffle();

    /*
      1. This game is BlackJack.
      2. If the player cannot bid anymore money the game is over.
      3. The hand with the highest total wins as long as it doesn't exceed 21.
      4. A hand with a higher total than 21 is said to bust.
      5. Cards 2 through 10 are worth their values, and face cards (jack, queen, king) are also worth 10.
      6. Aces are worth 1 or 11, whichever the player chooses.
      */
    this.runPlayerTurn();
  }

  runPlayerTurn() {
    this.playerTurn = true; ///sets the player's turn to true

    //Prompts the player on how much to bet.
    let playerBet = prompt(
      `How much would you like to bet? You have $${this.player.money}`
    );
    //subtract the bet from the player's money
    this.player.money -= playerBet;
    console.log(this.playerName, "money:", this.player.money);

    //deal two cards to the player
    this.player.takeCard(this.deck);
    this.player.takeCard(this.deck);

    //add two card ranks to the player's total
    this.player.total = this.player.hand[0].rank + this.player.hand[1].rank;
    console.log(this.playerName, "hand:", this.player.hand);
    console.log(this.playerName, "total:", this.player.total);

    //prompts the player to hit or stay
    let playerChoice = prompt(
      `Would you like to hit or stay?
      
      You have $${this.player.money}`
    );

    //continue to prompt for a hit or stay until the player busts or stays
    while (playerChoice.toLowerCase() === "hit") {
      this.player.takeCard(this.deck);
      //add the card rank to the player's total
      this.player.total += this.player.hand[this.player.hand.length - 1].rank;
      console.log(this.playerName, "total:", this.player.total);

      //if the player busts.
      if (this.player.total > 21) {
        console.log(`
          You busted!
          ${this.playerName} total: ${this.player.total}
          `);

        this.playerTurn = false;
        this.player.busted = true;

        //checks for a winner
        this.checkForWinner(playerBet);
      }
      console.log(this.playerName, "hand:", this.player.hand);
      playerChoice = prompt(
        `Would you like to hit or stay? You have $${this.player.money}`
      );
    }

    //if the player stays, the player's turn is over
    if (playerChoice.toLowerCase() === "stay") {
      console.log("You stayed!", this.playerName, "total:", this.player.total);
      this.playerTurn = false;
      this.runDealerTurn(playerBet);
    }
  }

  runDealerTurn(playerBet) {
    console.log("Player Bet:", playerBet);
    console.log("Dealer's turn", this.dealerName, "money:", this.dealer.money);

    // deal two cards to the dealer
    this.dealer.takeCard(this.deck);
    this.dealer.takeCard(this.deck);
    console.log(this.dealerName, "hand:", this.dealer.hand);

    //add two card ranks to the dealer's total
    this.dealer.total = this.dealer.hand[0].rank + this.dealer.hand[1].rank;
    console.log(this.dealerName, "total:", this.dealer.total);

    //continue to hit until the dealer busts or has 17 or higher
    while (this.dealer.total < 17) {
      this.dealer.takeCard(this.deck);

      //add the card rank to the dealer's total
      this.dealer.total += this.dealer.hand[this.dealer.hand.length - 1].rank;
      console.log(this.dealerName, "total:", this.dealer.total);

      //if the dealer busts, the dealer's turn is over
      if (this.dealer.total > 21) {
        console.log(
          "Dealer busted!",
          this.dealerName,
          "total:",
          this.dealer.total
        );

        this.dealer.busted = true;
        this.checkForWinner(playerBet);
      }
      console.log(this.dealerName, "hand:", this.dealer.hand);
    }

    //if the dealer has 17 or higher, the dealer's turn is over
    if (this.dealer.total >= 17) {
      console.log(
        "Dealer stayed!",
        this.dealerName,
        "total:",
        this.dealer.total
      );
      this.checkForWinner(playerBet);
    }
  }

  checkForWinner(playerBet) {
    //if player and dealer have the same total, it's a tie
    if (this.player.total === this.dealer.total) {
      console.log("It's a tie!");
    }
    //if player has 21, player wins and dealer is less than 21 || if dealer busts, player wins
    else if (
      (this.player.total === 21 && this.dealer.total < 21) ||
      (this.dealer.busted === true && this.player.busted === false)
    ) {
      this.player.money += playerBet * 2;
      console.log(`${this.playerName} wins!`);
    }
    //if dealer has 21, dealer wins player is less than 21 || if player busts, dealer wins
    else if (
      (this.dealer.total === 21 && this.player.total < 21) ||
      (this.player.busted === true && this.dealer.busted === false)
    ) {
      this.dealer.money += playerBet;
      console.log(`${this.dealerName} wins!`);
    }
    //if player has higher total than dealer, player wins
    else if (this.player.total < this.dealer.total) {
      this.dealer.money += playerBet;
      console.log(`${this.dealerName} wins!`);
    }
    //if dealer has higher total than player, dealer wins
    else if (this.player.total > this.dealer.total) {
      this.player.money += playerBet * 2;
      console.log(`${this.playerName} wins!`);
    }

    //start the game over again
    this.play();
  }
}

let game = new Game();
game.play();
