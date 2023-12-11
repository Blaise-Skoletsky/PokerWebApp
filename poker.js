module.exports = {
    cardConversion: cardConversion,
    generateDeck: generateDeck,
    centerGenerator: centerGenerator,
    playerHandGenerator: playerHandGenerator,
    getImage: getImage,
    winnerOrder: winnerOrder,
    distributePot: distributePot
}

function cardConversion(value){
    var convert = {
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: 'J',
        12: 'Q',
        13: 'K',
        14: 'A',
    }

    return convert.value
}

const path = require('path');
const IMAGES_FOLDER = 'PNG-cards-1.3';

function getImage(value) {
    var [cardValue, suit] = value;
    if(suit == 'D'){
        suit = 'diamonds'
    }
    else if(suit == 'S'){
        suit = 'spades'
    }
    else if(suit == 'H'){
        suit = 'hearts'
    }
    else if(suit == 'C'){
        suit = 'clubs'
    }
    const filename = `${cardValue}_of_${suit}.png`;
    const imagePath = path.join(__dirname, IMAGES_FOLDER, filename);

    return imagePath;
}

// testing out getImage()
const imagePath = getImage([2, 'C']);
console.log("======image path here: " + imagePath);

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
//Generates a fresh deck
function generateDeck(){
    deck = []
    suits = ['S', 'H', 'D', 'C']
    for (let i = 2; i < 15; i++){
        for (let j = 0; j < 4; j++){
            deck.push([i, suits[j]])
        }
    }

    return deck
}
//Makes deck
deck = generateDeck()

//Generates 5 global cards
function centerGenerator(deck){
    centerCards = []
    for (let i = 0; i < 5; i++){
        card1 = getRandomIntInclusive(0, deck.length-1)
        centerCards.push(deck[card1])
        deck.splice(card1, 1) 
    }

    return centerCards

}

//Generates 2 cards per hand
function playerHandGenerator(deck){
    handCards = []
    for (let i = 0; i < 2; i++){
        card1 = getRandomIntInclusive(0, deck.length-1)
        handCards.push(deck[card1])
        deck.splice(card1, 1) 
    }
    return handCards
}

centerGenerator(deck)

//Function takes in an array of cards in any order. Slowly looks down the line of poker hands
function decrementNumberInRange(inputString) {
    // Extract the number and the rest of the string
    const match = inputString.match(/^(\d+)(,(.*))?$/)
  
    if (match) {
      let number = parseInt(match[1], 10)
  
      // Check if the number is within the range [2, 14]
      if (number >= 2 && number <= 14) {
        // Decrement the number
        number--
  
        // Construct the new string with proper comma handling
        const newString = `${number}${match[2] || ''}`
  
        return newString
      } else {
        // Number is outside the range
        return "    "
      }
    } else {
      // Input string doesn't match the expected format
      return "     "
    }
}

//Function takes in an array of cards in any order. Slowly looks down the line of poker hands
function evaluatePokerHand(cards) {
    let suitsMap = ['S', 'H', 'D', 'C']
    let counter = [0,0,0,0]
    for (let v = 0; v < cards.length; v++){
        if (cards[v][1] === 'S'){
            counter[0]++
        }
        if (cards[v][1] === 'H'){
            counter[1]++
        }
        if (cards[v][1] === 'D'){
            counter[2]++
        }
        if (cards[v][1] === 'C'){
            counter[3]++
        }
    }


    // Function to check if all cards have the same suit, Done!
    function isFlush() {
      
        if (Math.max(...counter) >= 5){
            return true
        }
        return false
    }

    // Sort the cards in descending order of their values

    let sortedCards = cards
    for (let i = 0; i < sortedCards.length; i++){
        const currentCard = sortedCards[i]
        let j = i-1
        while(j >= 0 && sortedCards[j][0] < currentCard[0]){
            sortedCards[j+1] = sortedCards[j]
            j--
        }
        sortedCards[j+1] = currentCard
    }

    //Makes a dictionary filled with the number mapped to the amount of times it is in the hand. 
    cardCounts = {}
    for (let i = 0; i < sortedCards.length; i++){
        if (sortedCards[i][0] in cardCounts){
            cardCounts[sortedCards[i][0]]++
        }
        else {
            cardCounts[sortedCards[i][0]] = 1
        }
    }
    
    // Function to check if the cards form a straight - Done!
    function isStraight(){

        let cardset = {}
        let finalArr = []
        for (i = 0; i < sortedCards.length; i++){
            cardset[sortedCards[i][0]] = 1
        }
        for (i = 0; i < sortedCards.length; i++){
            let first = sortedCards[i][0] - 1
            let second = first-1
            let third = second-1
            let fourth = third-1
            if (fourth == 1){
                fourth = 14
            }
            if((first in cardset) && (second in cardset) && (third in cardset) && (fourth in cardset)){
                return true
            }
        }
        return false
    }
    //Function to check for a straight flush!- Almost done- right now it is possible for their to be a flush and a straight seperately, which would make the function not work. ALSO NEED TO MAKE ACE WORK!
    if (isFlush() && isStraight()) {

        let cardset = {}
        let finalArr = []
        for (i = 0; i < sortedCards.length; i++){
            cardset[sortedCards[i].toString()] = 1
        }
    
        for (let i = 0; i < sortedCards.length; i++){
            let first = decrementNumberInRange(sortedCards[i].toString())
            let second = decrementNumberInRange(first)
            let third = decrementNumberInRange(second)
            let fourth = decrementNumberInRange(third)
            
            
            if ((first in cardset) && (second in cardset) && (third in cardset) && (fourth in cardset)){
                finalArr.push(sortedCards[i][0])
            }
        }

        return [8, Math.max(...finalArr)]

    }
    

    //Four of a kind - Done!
    for (const [key, value] of Object.entries(cardCounts)){
  
        if (value === 4){
            for (i = 0; i < sortedCards.length;i++){
                if (key != sortedCards[i][0]){
                    return [7, parseInt(key), sortedCards[i][0]]
                }
            }

           
        }
    }



    // Check for full house - Maybe done? Lets check it more!
    thrice = [false, 0]
    twice = [false]
    for (const [key, value] of Object.entries(cardCounts)){
        if (value === 3){
            if (thrice[1] === 1){
                thrice = [true, thrice[1]+1, thrice[2], key]
            }else {
                thrice = [true, thrice[1]+1, key]
            }
  
        }
        if (value === 2){
            twice = [true, key]
        }
    }
    if (thrice[1] === 2){
        return [6, Math.max(thrice[2], thrice[3]), Math.min(thrice[2], thrice[3])]
    }
    if (thrice[1] === 1 && twice[0] === true){
        return [6, thrice[2], twice[1]]
    }

    // Check for flush - Done!
    if (isFlush()) {
        console.log(counter)
        let suit = 0
        for (let i =0 ;i < counter.length; i++){
            if (counter[i] >= 5){
                suit = suitsMap[i]
            }
        }
        let thing = [5]
        for(let i = 0; i <sortedCards.length; i++){
            if (sortedCards[i][1] == suit){
                thing.push(sortedCards[i][0])
            }
        }
        return thing

       

    }

    // Check for straight - Done
    if (isStraight()) {
    
        let cardset = {}
        let finalArr = []
        for (i = 0; i < sortedCards.length; i++){
            cardset[sortedCards[i][0]] = 1
        }
        for (i = 0; i < sortedCards.length; i++){
            let first = sortedCards[i][0] - 1
            let second = first-1
            let third = second-1
            let fourth = third-1
            if (fourth == 1){
                fourth = 14
            }

            if((first in cardset) && (second in cardset) && (third in cardset) && (fourth in cardset)){
                finalArr.push(sortedCards[i][0])
            }
        }
        return [4, Math.max(...finalArr)]

    }

    // Check for three of a kind - Done
    for (const [key, value] of Object.entries(cardCounts)){
        if (value === 3){
            let things = [3, parseInt(key)]
            for (i = 0; i < sortedCards.length;i++){
                if (key != sortedCards[i][0]){
                    things.push(sortedCards[i][0])
                    if (things.length == 4){
                        return things
                    }
                    
                }
            }
        }
    }


    // Check for two pairs - Done!
    let pairsList = []
    for (const [key, value] of Object.entries(cardCounts)){
        if (value === 2){
            pairsList.push(parseInt(key))
        }
    }
    if (pairsList.length >= 2){
        let val1 = Math.max(...pairsList)
        let val1idx = pairsList.indexOf(val1)
        if (val1idx !== -1){
            pairsList.splice(val1idx, 1)
        }
        let val2 = Math.max(...pairsList)

        for (let i = 0; i < sortedCards.length; i++){
            if (sortedCards[i][0] != val1 && sortedCards[i][0] != val2){
                return [2, val1, val2, sortedCards[i][0]]

            }
        }
    }


    // Check for one pair - Done!

    for (const [key, value] of Object.entries(cardCounts)){
        if (value === 2){
            let pairsList2 = [1]
            pairsList2.push(parseInt(key))
            for (let i = 0; i < sortedCards.length; i++){
                
                if (sortedCards[i][0] != key){
                    pairsList2.push(sortedCards[i][0])
                    if (pairsList2.length >= 5){
                        return pairsList2
                    }
                }
            }
        }
    }
    

    // If no specific hand is detected, return a default result
    return [0, sortedCards[0][0], sortedCards[1][0], sortedCards[2][0], sortedCards[3][0], sortedCards[4][0]];
}

// Example usage
const cards = [[6, 'S'], [5, 'S'], [4, 'S'], [3, 'S'], [2, 'S'], [4, 'S'], [9, 'H']];
const result = evaluatePokerHand(cards);
console.log(result);


//orders the winners into order of best hand desending.
function winnerOrder(players){
    for(let p = 0; p < players.length(); p++){
        if(players[p].isPlaying === false){
            players[p].hand[0] = 0;
        }
    }
    for(let i = 1; i < players.length(); i++){
        let current = players[i];
        let j = i - 1;
        while(j >= 0 && players[j].hand[0] < current.hand[0]){
            if(players[j].hand[0] === current.hand[0] && players[j].hand[0] > 0){         //check if the hands are the same. If they are goes through cards until one is higher. Add 1 to the win value of the higher card.
                for(let k = 1; k < 6; k++){                     //have win value go up by 10
                    if(player[j].hand[k] > current.hand[k]){    
                        player[j].hand[0] += 1;
                        break;
                    }
                    else if(player[j].hand[k] < current.hand[k]){
                        current.hand[0] += 1;
                        break;
                    }
                }
            }
            players[j+1] = players[j];
            j--;
        }
        players[j + 1].hand[0] = currentElement;
    }
    return players;
}

function distributePot(players){
    for(let i = 0; i < players.length(); i++){
        if(players[i].hand[0] != players[i+1].hand[0] && players[i].hand[0] > 0){ //runs through all players still in the game
            let savedBet = players[i].bet;                                        
            for(let j = i+1; j < players.length(); j++){                            //runs through players whose money needs to be distibuted
                if(savedBet <= players[j].bet){                                  //Checks whose bet was higher
                    players[j].bet -= savedBet;
                    players[i].bet += savedBet                              //subtracts amount lost from current bet
                }
                else{
                    players[j].bet = 0;
                    players[i].bet += players[j].bet;
                }
            }
        }
        else if(players[i].hand[0] === players[i+1].hand[0] && players[i].hand[0] > 0){
            let firstTied = i;
            let numTied = 0;

            while(players[i].hand[0] === players[i+1].hand[0]){
                numTied++;
                i++;                
        }
        //add each players bet/numtied to each of the ties players
        for(let q = firstTied; q <= numTied; q++){
            let savedBet = players[q].bet;                                        
            for(let t = t+1; t < players.length(); t++){                            //runs through players whose money needs to be distibuted
                if(savedBet <= players[t].bet){                                  //Checks whose bet was higher
                    players[t].bet -= (savedBet)/numTied;
                    players[q].bet += (players[t].bet)/numTied;                     //subtracts amount lost from current bet
                }
                else{
                    players[t].bet -= (players[t].bet)/numTied;
                    players[q].bet += (players[t].bet)/numTied;
                }
            }
        }
    }
}
}