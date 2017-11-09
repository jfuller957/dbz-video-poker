// const PokerEvaluator = require("poker-evaluator");


var myGame = function(){
  this.fiveCards = [];
  this.heldCards = [];
  this.allCards  = this.mapCards();
  this.cash      = 1000;
  this.setup();
}

myGame.prototype.setup = function(){
  $('#dealNext').hide()
  $('#cashAmount').html(this.cash)
  $('#playHand').on("click", this.playHand.bind(this))
  $('#dealNext').on("click", this.dealNextHand.bind(this))
}

myGame.prototype.playHand = function(){
  if(this.cash <= 0){
    $('#playHand').hide()
    $('#dealNext').hide()
    $('#cards').html("<h1 id='moneyOut'>You ran out of moneyyss!</h1>")
  }else{
    $('#betAmount').hide()
    $('#playHand').hide()
    $('#dealNext').show()
    this.bet = $('#betAmount').val()
    $('#result').html("<span class='strong'>You bet:</span> "+this.bet)
    this.cash -= this.bet
    $('#cashAmount').html(this.cash)
    $('#betAmount').val("")
    this.allCards  = this.mapCards();
    this.fiveCards = [];
    this.heldCards = [];
    $('#cards').html("")
    this.getRandomCardsSet(5)
    console.log(this.fiveCards)
    $('.playingCards').on("click", this.holdCard.bind(this))
  }
}

myGame.prototype.dealNextHand = function(){
  $('#betAmount').show()
  $('#playHand').show()
  $('#dealNext').hide()
  this.fiveCards = []
  $('#cards').html("")
  for (var i = 0; i < this.heldCards.length; i++) {
    this.fiveCards.push(this.heldCards[i])
    $("#cards").append("<li><img class='playingCards' id='"+this.heldCards[i]+"'src='./images/classic-cards/"+this.heldCards[i]+".png'></li>")
  };
  this.getRandomCardsSet(5-this.heldCards.length);

  this.checkHand();



  if(this.cash <= 0){
    $('#playHand').hide()
    $('#dealNext').hide()
    $('#betAmount').hide()
    setTimeout(function(){ 
      $('#cards').html("<h1 id='moneyOut'>You ran out of candy!</h1>")
    },3000);
  }
}

myGame.prototype.checkHand = function(){
  var result = $('#result')
  if(this.straightFlush()){
    result.html("Got a straight flush, you win "+(this.bet*50))
    this.cash += (this.bet*50)
  }else if(this.fourOfAKind()){
    result.html("Got four of a kind, you win "+(this.bet*35))
    this.cash += (this.bet*35)
  }else if(this.fullHouse()){
    result.html("Got full house, you win "+(this.bet*25))
    this.cash += (this.bet*25)
  }else if (this.flush()){
    result.html("Got a flush, you win "+(this.bet*15))
    this.cash += (this.bet*15)
  }else if(this.straight()){
    result.html("Got a straight, you win "+(this.bet*10))
    this.cash += (this.bet*10)
  }else if(this.threeOfAKind()){
    result.html("Got three of a kind, you win "+(this.bet*5))
    this.cash += (this.bet*5)
  }else if(this.twoPair()){
    result.html("Got two pair, you win "+(this.bet*2))
    this.cash += (this.bet*2)
  }else if(this.pair()){
    result.html("Got a pair, you win "+(this.bet*1.5))
    this.cash += (this.bet*1.5)
  }
  $('#cashAmount').html(this.cash)
}

myGame.prototype.pair = function(){
  var arr = []
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(this.fiveCards[i].split(/_/)[1])
  };
  for (var i = 0; i < arr.length; i++) {
    var count = this.countInArray(arr, arr[i])
    if(count===2){
      return true
    }
  };
}

myGame.prototype.twoPair = function(){
  var arr = []
  var pairs = []
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(this.fiveCards[i].split(/_/)[1])
  };
  for (var i = 0; i < arr.length; i++) {
    var count = this.countInArray(arr, arr[i])
    if(count===2){
      pairs.push(count)
    }
  };
  console.log(pairs)
  if(pairs.length > 2){
    return true
  }
}

myGame.prototype.threeOfAKind = function(){
  var arr = []
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(this.fiveCards[i].split(/_/)[1])
  };
  for (var i = 0; i < arr.length; i++) {
    var count = this.countInArray(arr, arr[i])
    if(count===3){
      return true
    }
  };
}

myGame.prototype.straight = function(){
  var arr = [];
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(parseInt(this.fiveCards[i].split(/_/)[1]))
  };
  arr.sort();
  if(arr[0]===arr[1]-1 && arr[1]===arr[2]-1 && arr[2]===arr[3]-1 && arr[3]===arr[4]-1){
    return true
  }
}

myGame.prototype.flush = function(){
  var arr = [];
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(parseInt(this.fiveCards[i].split(/_/)[0]))
  };
  console.log(arr)
  if(arr[0]===arr[1] && arr[1]===arr[2] && arr[2]===arr[3] && arr[3]===arr[4]){
    return true
  }
}

myGame.prototype.fullHouse = function(){
  if(this.threeOfAKind() && this.pair()){
    return true
  }
}

myGame.prototype.fourOfAKind = function(){
  var arr = []
  for (var i = 0; i < this.fiveCards.length; i++) {
    arr.push(this.fiveCards[i].split(/_/)[1])
  };
  for (var i = 0; i < arr.length; i++) {
    var count = this.countInArray(arr, arr[i])
    console.log(count)
    if(count===4){
      return true
    }
  };
}

myGame.prototype.straightFlush = function(){
  if(this.straight() && this.flush()){
    return true
  }
}

myGame.prototype.countInArray = function(array, what) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === what) {
      count++;
    }
  }
  return count;
}

myGame.prototype.holdCard = function(){
  if($(event.currentTarget).hasClass('chosen-card')){
    var index = this.heldCards.indexOf(event.currentTarget.id)
    $(event.currentTarget).removeClass('chosen-card')
    this.heldCards.splice(event.currentTarget, 1)
  }else{
    $(event.currentTarget).addClass('chosen-card')
    this.heldCards.push(event.currentTarget.id)
  }
}

myGame.prototype.mapCards = function(){
  var allCards = [];
  for (var i = 1; i <= 4; i++) {
    for (var j = 1; j <= 13; j++) {
      allCards.push(i+"_"+j)
    };
  };
  return allCards
}

myGame.prototype.getRandomCardsSet = function(numberOfCards){
  for (var i = 0; i < numberOfCards; i++) {
    var cardNumber = Math.floor(Math.random() * this.allCards.length)
    var thisCard   = this.allCards.splice(cardNumber, 1)[0]
    this.fiveCards.push(thisCard)
    $("#cards").append("<li><img class='playingCards' id='"+thisCard+"'src='./images/classic-cards/"+thisCard+".png'></li>")
  };
}

window.onload = function(){
  var newgame = new myGame()
}


// PokerEvaluator.evalHand(["As", "Ks", "Qs", "Js", "Ts", "3c", "5h"]);

//{ handType: 9,
//  handRank: 10,
//  value: 36874,
//  handName: 'straight flush' }

// PokerEvaluator.evalHand(["As", "Ac", "Ad", "5d", "5s"]);

//{ handType: 7,
//  handRank: 148,
//  value: 28820,
//  handName: 'full house' }

// PokerEvaluator.evalHand(["As", "Ac", "Qs"]);

//{ handType: 2,
//  handRank: 2761,
//  value: 10953,
//  handName: 'one pair' }