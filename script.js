/* =========================================================
   01. ELEMENTS
========================================================= */

const flashcard = document.getElementById("flashcard");

const germanInput = document.getElementById("germanInput");
const portugueseInput = document.getElementById("portugueseInput");

const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");

const createCardButton = document.getElementById("createCardButton");
const flipButton = document.getElementById("flipButton");


/* =========================================================
   02. FLIP CARD
========================================================= */

function flipCard() {
  flashcard.classList.toggle("flipped");
}


/* =========================================================
   03. CREATE CARD
========================================================= */

function createCard() {
  const germanText = germanInput.value.trim();
  const portugueseText = portugueseInput.value.trim();

  if (!germanText || !portugueseText) {
    alert("Preencha os dois lados da carta.");

    return;
  }

  frontText.textContent = germanText;
  backText.textContent = portugueseText;

  flashcard.classList.remove("flipped");
}


/* =========================================================
   04. EVENTS
========================================================= */

createCardButton.addEventListener("click", createCard);

flipButton.addEventListener("click", flipCard);

flashcard.addEventListener("click", flipCard);

flashcard.addEventListener("keydown", function(event) {
  if (
    event.key === "Enter" ||
    event.key === " "
  ) {
    event.preventDefault();

    flipCard();
  }
});