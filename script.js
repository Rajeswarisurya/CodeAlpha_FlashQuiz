const STORAGE_KEY = "study_flashcards_v1";

const defaultCards = [
  {
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language"
  },
  {
    question: "Which JavaScript method converts a JSON string into an object?",
    answer: "JSON.parse()"
  },
  {
    question: "What is the time complexity of binary search on a sorted array?",
    answer: "O(log n)"
  }
];

let cards = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultCards;
let currentIndex = 0;
let showingAnswer = false;
let editingIndex = null;

const cardCounter = document.getElementById("cardCounter");
const cardBadge = document.getElementById("cardBadge");
const cardText = document.getElementById("cardText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleAnswerBtn = document.getElementById("toggleAnswerBtn");
const openAddBtn = document.getElementById("openAddBtn");
const openEditBtn = document.getElementById("openEditBtn");
const deleteBtn = document.getElementById("deleteBtn");
const formPanel = document.getElementById("formPanel");
const formTitle = document.getElementById("formTitle");
const cardForm = document.getElementById("cardForm");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const cancelFormBtn = document.getElementById("cancelFormBtn");

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function renderCard() {
  if (cards.length === 0) {
    cardCounter.textContent = "No cards available";
    cardBadge.textContent = "Empty Deck";
    cardBadge.classList.remove("answer-mode");
    cardText.textContent = 'Click "+ Add Card" below to create your first flashcard.';
    toggleAnswerBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    openEditBtn.disabled = true;
    deleteBtn.disabled = true;
    return;
  }

  const currentCard = cards[currentIndex];
  cardCounter.textContent = `Card ${currentIndex + 1} of ${cards.length}`;

  if (showingAnswer) {
    cardBadge.textContent = "Answer";
    cardBadge.classList.add("answer-mode");
    cardText.textContent = currentCard.answer;
    toggleAnswerBtn.textContent = "Show Question";
  } else {
    cardBadge.textContent = "Question";
    cardBadge.classList.remove("answer-mode");
    cardText.textContent = currentCard.question;
    toggleAnswerBtn.textContent = "Show Answer";
  }

  toggleAnswerBtn.disabled = false;
  openEditBtn.disabled = false;
  deleteBtn.disabled = false;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
}

toggleAnswerBtn.addEventListener("click", () => {
  showingAnswer = !showingAnswer;
  renderCard();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showingAnswer = false;
    renderCard();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    showingAnswer = false;
    renderCard();
  }
});

openAddBtn.addEventListener("click", () => {
  editingIndex = null;
  formTitle.textContent = "Add New Flashcard";
  questionInput.value = "";
  answerInput.value = "";
  formPanel.classList.add("active");
  questionInput.focus();
});

openEditBtn.addEventListener("click", () => {
  if (cards.length === 0) return;
  editingIndex = currentIndex;
  formTitle.textContent = `Edit Card ${currentIndex + 1}`;
  questionInput.value = cards[currentIndex].question;
  answerInput.value = cards[currentIndex].answer;
  formPanel.classList.add("active");
  questionInput.focus();
});

cancelFormBtn.addEventListener("click", () => {
  formPanel.classList.remove("active");
});

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (!question || !answer) return;

  if (editingIndex !== null) {
    cards[editingIndex] = { question, answer };
  } else {
    cards.push({ question, answer });
    currentIndex = cards.length - 1;
  }

  showingAnswer = false;
  saveCards();
  renderCard();
  formPanel.classList.remove("active");
});

deleteBtn.addEventListener("click", () => {
  if (cards.length === 0) return;
  cards.splice(currentIndex, 1);
  if (currentIndex >= cards.length) {
    currentIndex = Math.max(0, cards.length - 1);
  }
  showingAnswer = false;
  saveCards();
  renderCard();
});

renderCard();

