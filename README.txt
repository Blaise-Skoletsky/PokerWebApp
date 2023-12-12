









 - Pot splitting / Determine winner | Luke


 - Code to determine when a round starts - Blaise


 - Code to make sure it stops when one player is left and pays them out occording - Blaise

 
 - After this is all done, lets work on edge cases - like what happens when a player disconnects from the game, what happens when a hand is won




-BUG 1: Players joining need to be worked out!

-BUG 2: players leaving need to be worked out!

-BUG 3: If the first player in a turn folds right away, the players can keep calling infinitely! This is because
The round ends when it becomes the turn of the person who raised last. Normally this isn't an issue, as the playe

//Make last player to raise start at null, if it equals null, then the program knows to stop after the big blind on round 1, and the starter on rounds 2-end.