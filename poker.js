var cardConversion = {
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


//Function takes in an array of cards in any order. Slowly looks down the line of poker hands
function evaluatePokerHand(cards) {


    // Function to check if all cards have the same suit
    function isFlush() {
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
        if (Math.max(...counter) >= 5){
            return true
        }
        return false
    }

    // Sort the cards in descending order of their values
    const sortedCards = cards.slice().sort((a, b) => (b) - (a));
  


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
    
    // Function to check if the cards form a straight
    function isStraight() {
        const values = sortedCards.map(card => (card));
        const uniqueValues = [...new Set(values)];
        const min = Math.min(...uniqueValues);
        const max = Math.max(...uniqueValues);
        return max - min === 4 && uniqueValues.length === 5;
    }

    // Check for a straight flush
    if (isFlush() && isStraight()) {
        return ['straight flush', (sortedCards[0]), null];
    }

    //Four of a kind
    for (const [key, value] of Object.entries(cardCounts)){
  
        if (value === 4){
            return ['four of a kind', parseInt(key), null]
        }
    }



    // Check for full house
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
        return ['full house', Math.max(thrice[2], thrice[3]), Math.min(thrice[2], thrice[3])]
    }
    if (thrice[1] === 1 && twice[0] === true){
        return ['full house', thrice[2], twice[1]]
    }

    // Check for flush
    if (isFlush()) {
        return ['flush', sortedCards[0], sortedCards[1]];
    }

    // Check for straight
    if (isStraight()) {
        return ['straight', sortedCards[0], null];
    }

    // Check for three of a kind
    for (const [key, value] of Object.entries(cardCounts)){
        console.log([key, value])
        if (value === 3){
            return ['three of a kind', parseInt(key), null]
        }
    }
    // Check for two pairs
    if ((sortedCards[0] === sortedCards[1] && sortedCards[2] === sortedCards[3])
        || (sortedCards[0] === sortedCards[1] && sortedCards[3] === sortedCards[4])
        || (sortedCards[1] === sortedCards[2] && sortedCards[3] === sortedCards[4])) {
        return ['two pairs', sortedCards[0], sortedCards[3]];
    }


    // Check for one pair
    for (let i = 0; i < 4; i++) {
        if (sortedCards[i] === sortedCards[i + 1]) {
            return ['one pair', sortedCards[i], sortedCards[4]];
        }
    }

    // If no specific hand is detected, return a default result
    return ['high card', sortedCards[0], sortedCards[1]];
}

// Example usage
const cards = [[2, 'S'], [2, 'S'], [2, 'S'], [3, 'S'], [3, 'S'], [3, 'D'], [9, 'H']];
const result = evaluatePokerHand(cards);
console.log(result);

