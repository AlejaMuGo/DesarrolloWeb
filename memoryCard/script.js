const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval; // consultar el uso de setInterval
let firstCard = null;
let secondCard = null;

//Items array
const items = [
  { name: "bee", image: "assets/bee.png" },
  { name: "crocodile", image: "assets/crocodile.png" },
  { name: "macaw", image: "assets/macaw.png" },
  { name: "gorilla", image: "assets/gorilla.png" },
  { name: "tiger", image: "assets/tiger.png" },
  { name: "monkey", image: "assets/monkey.png" },
  { name: "chameleon", image: "assets/chameleon.png" },
  { name: "piranha", image: "assets/piranha.png" },
  { name: "anaconda", image: "assets/anaconda.png" },
  { name: "sloth", image: "assets/sloth.png" },
  { name: "cockatoo", image: "assets/cockatoo.png" },
  { name: "toucan", image: "assets/toucan.png" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//Function for timer generator
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tiempo:</span>${minutesValue}:${secondsValue}`;
};

//Function for counting moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Pasos:</span>${movesCount}`;
};

//YOUR CODE STARTS HERE
//Function to choose four random cards
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Function to generate matrix for the game

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle - Fisher-Yates algorithm
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Ignorar clicks si ya hay dos cartas volteadas o si la carta ya está matched
      if (card.classList.contains("matched") || (firstCard && secondCard)) {
        return;
      }

      card.classList.add("flipped");

      // Si no hay primera carta seleccionada
      if (!firstCard) {
        firstCard = card;
        firstCard.dataset.cardValue;
        return;
      }

      // Si se clickea la misma carta dos veces
      if (card === firstCard) {
        return;
      }

      // Segunda carta seleccionada
      secondCard = card;
      movesCounter();

      // Obtener valores de las cartas
      let firstCardValue = firstCard.getAttribute("data-card-value");
      let secondCardValue = secondCard.getAttribute("data-card-value");

      // Comparar las cartas
      if (firstCardValue === secondCardValue) {
        // Son iguales - marcar como matched
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        firstCard = null;
        secondCard = null;
        winCount += 1;

        // Verificar si ganó
        if (winCount === Math.floor(cardValues.length / 2)) {
          result.innerHTML = `<h2>Ganaste SIIIUUUU owo</h2>
            <h4>Pasos: ${movesCount}</h4>
            <h4>Tiempo: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}</h4>`;
          stopGame();
        }
      } else {
        // No son iguales - voltear de nuevo después de un delay
        setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          firstCard = null;
          secondCard = null;
        }, 900);
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Pasos:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    // Clear timer
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};