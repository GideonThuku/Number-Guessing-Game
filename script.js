// 🎲 Number Guessing Game – Interactive (Glow removed, centered layout)
// Rule: any number in [44..50] is "Correct". No hints.
// Adds: attempts, reset, Enter-to-submit, success burst,
// and an interactive image badge that pauses/resumes rotation on click.

(() => {
  const input = document.getElementById("guess");
  const msg = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const rulesBtn = document.getElementById("rulesBtn");
  const meterBar = document.getElementById("meterBar");
  const attemptsLabel = document.getElementById("attemptsLabel");
  const card = document.getElementById("card");
  const burst = document.getElementById("burst");
  const artBadge = document.getElementById("artBadge");

  const MAX_ATTEMPTS = 10;
  let attemptsLeft = MAX_ATTEMPTS;
  let finished = false;

  function updateMeter() {
    const ratio = Math.max(0, attemptsLeft) / MAX_ATTEMPTS;
    meterBar.style.transform = `scaleX(${ratio})`;
    attemptsLabel.textContent = attemptsLeft;
  }

  function setMessage(text, type = "info") {
    msg.textContent = text;
    if (type === "ok") {
      msg.style.color = "var(--teal)";
    } else if (type === "bad") {
      msg.style.color = "var(--accent)";
    } else {
      msg.style.color = "var(--text)";
    }
  }

  function pulseCard(ok = false) {
    card.style.transition = "transform .12s ease, box-shadow .2s ease";
    card.style.transform = ok ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(0.995)";
    setTimeout(() => (card.style.transform = ""), 140);
  }

  function showBurst() {
    burst.classList.remove("show");
    // reflow to restart animation
    // eslint-disable-next-line no-unused-expressions
    burst.offsetHeight;
    burst.classList.add("show");
  }

  function disableGame() {
    finished = true;
    submitBtn.disabled = true;
    input.disabled = true;
  }

  function enableGame() {
    finished = false;
    submitBtn.disabled = false;
    input.disabled = false;
  }

  function checkGuess() {
    if (finished) return;

    const value = Number(input.value.trim());
    if (Number.isNaN(value)) {
      setMessage("⚠️ Please enter a number.");
      pulseCard(false);
      return;
    }

    if (value >= 44 && value <= 50) {
      setMessage("✅ Correct! You guessed it!", "ok");
      pulseCard(true);
      showBurst();
      disableGame();
      return;
    }

    // Wrong—no hints
    attemptsLeft -= 1;
    updateMeter();

    if (attemptsLeft <= 0) {
      setMessage("❌ Game over. Out of attempts!", "bad");
      disableGame();
    } else {
      setMessage("❌ Wrong! Try again.", "bad");
      pulseCard(false);
    }
  }

  function resetGame() {
    attemptsLeft = MAX_ATTEMPTS;
    updateMeter();
    setMessage("");
    input.value = "";
    enableGame();
    input.focus();
  }

  function showRules() {
    alert(
`How it works:
• Type any number and press Submit (or Enter).
• You have ${MAX_ATTEMPTS} attempts.
• If your number is between a certain range, you win.
• No hints are given—only “Correct” or “Wrong”.
• Press Reset to start a new round.`
    );
  }

  // Interactive image badge: click to pause/resume rotation + brighten
  function toggleBadge() {
    artBadge.classList.toggle("paused");
  }

  // Wire up events
  submitBtn.addEventListener("click", checkGuess);
  resetBtn.addEventListener("click", resetGame);
  rulesBtn.addEventListener("click", showRules);
  artBadge.addEventListener("click", toggleBadge);

  // Enter key submits
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkGuess();
  });

  // Disable submit if input is empty (UX nicety)
  const toggleSubmitDisabled = () => {
    submitBtn.disabled = input.value.trim() === "";
  };
  input.addEventListener("input", toggleSubmitDisabled);
  toggleSubmitDisabled();

  // Init
  updateMeter();
  input.focus();
})();
