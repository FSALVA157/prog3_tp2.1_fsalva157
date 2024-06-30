class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }

    toggleFlip(){
        if (this.isFlipped) {
            this.isFlipped = false;
            this.#unflip();
        } else {
            this.isFlipped = true;
            this.#flip();
        }
    }

    matches(otherCard){
        return this.name === otherCard.name;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }

    shuffleCards(){
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let aux = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = aux;
        }
    }//fin metodo shuffleCards

    flipDownAllCards(){
        this.cards.forEach((card) => {
            if(card.isFlipped){
                card.toggleFlip();
            }
        });
    }

    reset(){
        this.shuffleCards();
        this.render();
        this.flipDownAllCards();
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        this.counterMove = 0;
        this.timeStarter = null;
        this.timeElapsed = 0;
        this.intervalTime = 0;
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
        this.counterMovesShow();
        this.timerShow();
        this.starterTime();

    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                this.counterMove++;
                this.counterMovesShow();
                setTimeout(() => this.checkForMatch(), this.flipDuration);
                
            }
        }
    }

    counterMovesShow(){
        const moves = document.getElementById("contador-movimientos");
        moves.textContent = `Total Movimientos: ${this.counterMove}`;
    }

    timerShow(){
        const relojDom = document.getElementById("reloj");
        relojDom.textContent = `Tiempo Transcurrido: ${Math.floor(this.timeElapsed / 1000)}seg`;
    }

    starterTime() {
        this.timeStarter = Date.now();
        this.intervalTime = setInterval(() => {
            this.timeElapsed = Date.now() - this.timeStarter;
            this.timerShow();
        }, 1000);
    }

    timerStop() {
        clearInterval(this.timerInterval);
    }

    checkForMatch() {        
        if(this.flippedCards[0].matches(this.flippedCards[1])){
            this.flippedCards.forEach((card) => {
                this.matchedCards.push(card);
            });
            }
            else{
                this.flippedCards.forEach((card) => {
                    card.toggleFlip();
                });
            }
        this.flippedCards = [];                    
        if(this.matchedCards.length === this.board.cards.length){
            alert("Ganaste");
        }else{
            this.flippedCards.forEach((card) => {
                card.toggleFlip();
            });
            this.flippedCards = [];
        }
    }

    resetGame() {
        this.flippedCards = [];
        this.matchedCards = [];
        this.counterMove = 0;
        this.counterMovesShow();
        this.timerShow();
        this.timerStop();
        this.starterTime();
        this.board.reset();

    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
