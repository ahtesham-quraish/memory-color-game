/** 
 *@desc Constructor method for card object
 * it initialize the two properties @color and @state.
 **/
function Card(color) {
    this.color = color;
    this.state = false;

}
/** 
 *@desc This method flip the state of card.
 **/
Card.prototype.flip = function() {
    this.state = !this.state
}

/** 
 *@desc Create the array of cards object.
 * Each color has two objects and retrun the @cards array.
 **/
createPackCards = function(colors) {
    var cards = [];
    colors.forEach(function(color) {
        cards.push(new Card(color));
        cards.push(new Card(color));

    });
    return cards;

}

/** 
 *@desc Shuffle the array of @cards. 
 **/

function shuffle(array) {
    var i = 0,
        j = 0,
        temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

/** 
 *@desc This @Game class basically takes the @colors array.
 * Call the @createPackCards method to create the cards deck.
 * Then call the @shuffle method to shuffle the @cards.
 **/
function Game(colors) {
    this.pairs = 8;
    var cards = createPackCards(colors);
    this.grid = shuffle(cards)
    this.score = 0;
    this.color = 'nothing';

    this.flipCard = function(card) {
            if (card.state) {
                return;
            }
            card.flip();
            if (!this.firstcard || this.secondcard) {
                if (this.secondcard) {
                    /* if the user pick the two cards with diff color then both cards are faced down*/
                    /*  and score is decreamented */
                    this.firstcard.flip();
                    this.secondcard.flip();
                    this.firstcard = undefined;
                    this.secondcard = undefined;
                    this.score--;

                }
                this.firstcard = card;

            } else {
                /* if the user first and second pick is same then score is increamented and pair is decreamented */
                /* matching cards are removed from the grid and grid is shuffled again*/
                if (this.firstcard.color == card.color) {
                    wait(500);
                    this.firstcard = undefined;
                    this.secondcard = undefined;
                    this.score++;
                    this.pairs--
                        this.color = card.color;
                    removeCard(this.grid, card.color)
                    return;



                } else {
                    this.secondcard = card;
                }
            }

        }
        /** 
         *@desc This method takes the @cards array and $color value to be removed .
         **/
    function removeCard(cards, color) {

        var tester = false;
        var firstcard = undefined;
        var secondcard = undefined;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].color === color) {
                if (!firstcard) {
                    firstcard = i
                } else {
                    secondcard = i
                }
            }

        }

        /* if cards those are being removed are adjacency then if is run otherwise else part is run*/
        if (firstcard + 1 === secondcard) {
            cards.splice(firstcard, 2);
        } else {
            cards.splice(firstcard, 1);
            cards.splice(secondcard - 1, 1);
        }


    }

    function wait(ms) {
        var d = new Date();
        var d2 = null;
        do {
            d2 = new Date();
        }
        while (d2 - d < ms);
    }




}