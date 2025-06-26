const wordContainer = document.getElementById("wordContainer");
const startButton = document.getElementById("startButton");
const usedLettersElement = document.getElementById("usedLetters");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
  [4, 2, 1, 1],
  [4, 3, 1, 2],
  [3, 5, 1, 1],
  [5, 5, 1, 1],
  [3, 3, 1, 1],
  [5, 3, 1, 1],
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;
let gameOver = false;

const addLetter = (letter) => {
  const letterElement = document.createElement("span");
  letterElement.innerHTML = letter.toUpperCase();

  // Agregar clase para indicar si la letra fue correcta o incorrecta
  if (selectedWord.includes(letter)) {
    letterElement.classList.add("correct");
  } else {
    letterElement.classList.add("incorrect");
  }

  usedLettersElement.appendChild(letterElement);
};

const addBodyPart = (bodyPart) => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(...bodyPart);

  // Añadir efecto de "temblor" en el canvas cuando se comete un error
  canvas.classList.add("shake");
  setTimeout(() => {
    canvas.classList.remove("shake");
  }, 500);
};

const wrongLetter = () => {
  addBodyPart(bodyParts[mistakes]);
  mistakes++;
  if (mistakes === bodyParts.length) {
    showGameOverMessage(false);
    endGame();
  }
};

const showGameOverMessage = (won) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("game-message");

  if (won) {
    messageElement.classList.add("win-message");
    messageElement.textContent = "¡GANASTE!";
  } else {
    messageElement.classList.add("lose-message");
    messageElement.textContent = "¡PERDISTE!";

    // Mostrar la palabra correcta
    const correctWordElement = document.createElement("div");
    correctWordElement.classList.add("correct-word");
    correctWordElement.textContent = `La palabra era: ${selectedWord.join("")}`;
    messageElement.appendChild(correctWordElement);
  }

  document.querySelector(".game-container").appendChild(messageElement);

  // Remover el mensaje después de unos segundos cuando se reinicie el juego
  startButton.addEventListener(
    "click",
    () => {
      if (document.querySelector(".game-message")) {
        document.querySelector(".game-message").remove();
      }
    },
    { once: true }
  );
};

const endGame = () => {
  document.removeEventListener("keydown", letterEvent);
  startButton.style.display = "block";
  gameOver = true;
};

const correctLetter = (letter) => {
  const { children } = wordContainer;
  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML === letter) {
      children[i].classList.toggle("hidden");
      children[i].classList.add("correct-letter");
      hits++;
    }
  }

  if (hits === selectedWord.length) {
    showGameOverMessage(true);
    endGame();
  }
};

const letterInput = (letter) => {
  if (gameOver) return;

  if (selectedWord.includes(letter)) {
    correctLetter(letter);
  } else {
    wrongLetter();
  }
  addLetter(letter);
  usedLetters.push(letter);
};

const letterEvent = (event) => {
  let newLetter = event.key.toUpperCase();
  if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
    letterInput(newLetter);
  }
};

const drawWord = () => {
  selectedWord.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.innerHTML = letter.toUpperCase();
    letterElement.classList.add("letter");
    letterElement.classList.add("hidden");
    wordContainer.appendChild(letterElement);
  });
};

const selectRandomWord = () => {
  let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
  selectedWord = word.split("");
};

const drawHangMan = () => {
  ctx.canvas.width = 120;
  ctx.canvas.height = 160;
  ctx.scale(20, 20);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d95d39";
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
  usedLetters = [];
  mistakes = 0;
  hits = 0;
  gameOver = false;
  wordContainer.innerHTML = "";
  usedLettersElement.innerHTML = "";
  startButton.style.display = "none";
  drawHangMan();
  selectRandomWord();
  drawWord();

  // Agregar una animación al iniciar el juego
  canvas.classList.add("game-start");
  setTimeout(() => {
    canvas.classList.remove("game-start");
  }, 700);

  document.addEventListener("keydown", letterEvent);
};

startButton.addEventListener("click", startGame);
