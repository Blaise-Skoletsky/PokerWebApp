Task List: 




Server Side:
    - Create general function that can be used to determine the hand of a player, I thought it might be simple to map values to an array: EX the hand [[2, H], [3,H], [2,D], [7,D], [14, S], [6, C]], could return
    ['Pair', 2, 14, 7, 6, NULL]. Each hand type like pair, should have the same number of values in the array. In comparing who won, first we check the first value. Since we have pair here, we can determine what hands we beat, tie and lose to
    with just this info. If it happens to be a tie, we move to the second value in the array. This value signfies the value of the pair of cards. This means our hand has two 2's. If the tied array has anything greater, we would lose. If its the 
    same we move to the next tie break, which is just the highest card in the hand. We keep going till the winner is decided, or there could still be a tie, which we have to prepare for. (Also we don't need to include the word pair, we will asign
    values to that as well, like high card is 0, pair is 1, two pair is 2, three of a kind is 3, and so on.)

    - Should keep track of everyones socketID, which can be used to identify which player is doing what action. 

    - Server should keep track of the global current bet amount, global pot

    - Server should map the socketID to an array of values containing things like: [Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)]


    -Once the server knows play is done, we basically look at each socketIDs info. If isPlaying is still true, we take their hand and input it into the evaluateHand function. We do the same with each hand that is still playing, and compute a winner.
    After a winner is decided, take everyones Amount of money variable, and subtract their currentBet value from it if they lost. If they won, add the global pot to the Amount of money. 

    - Once winner is decided, reset values and restart the game from the next player. When reseting, if a player has 0 in their Amount of Money, never let the isTurn become true for them. (Or find some other way to kick them out without
    removing them from the website.)


Client Side: 
    - General turn actions should take place on the client. The server should tell the specific client id that it is it's turn. This should make the call, fold and raise buttons appear, or make them clickable. If they click a button, it might be easy to
    implement error checking on the client side, meaning information like the amount of money a player has, and amount currently being bet, must be stored in the client side. Once a button is pressed, like raising, the new bet amount is sent back to the server,
    and the server now knows that that player is done making a move.


    -Once play has ended, so betting has come to a close, send the server the hands of the player that are in play. 

    -The game should always display the players in a correct order, with themselves at the bottom of the screen.
