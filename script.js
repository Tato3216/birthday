document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const nextButtons = document.querySelectorAll(".next-btn");
  const backArrow = document.getElementById("backArrow");

  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const musicText = document.getElementById("musicText");

  const cards = document.querySelectorAll(".mini-card");
  const modal = document.getElementById("messageModal");
  const modalText = document.getElementById("modalText");
  const closeModal = document.getElementById("closeModal");

  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseText = document.getElementById("surpriseText");

  const letterBtn = document.getElementById("letterBtn");
  const letterText = document.getElementById("letterText");

  const startGameBtn = document.getElementById("startGameBtn");
  const gameArea = document.getElementById("gameArea");
  const scoreText = document.getElementById("score");
  const timeLeftText = document.getElementById("timeLeft");
  const gameResult = document.getElementById("gameResult");
  const gameHint = document.getElementById("gameHint");
  const gameNextBtn = document.getElementById("gameNextBtn");

  let currentIndex = 0;
  let isPlaying = false;

  let score = 0;
  let timeLeft = 20;
  let gameTimer = null;
  let starTimer = null;
  let gameRunning = false;

  if (bgMusic) {
    bgMusic.volume = 0.9;
  }

  function showScreen(index) {
    screens.forEach((screen) => {
      screen.classList.remove("active");
    });

    screens[index].classList.add("active");

    if (backArrow) {
      if (index === 0) {
        backArrow.classList.add("hidden");
      } else {
        backArrow.classList.remove("hidden");
      }
    }

    const activeCard = screens[index].querySelector(".screen-card");

    if (activeCard) {
      activeCard.scrollTop = 0;
    }

    if (gameRunning && !screens[index].querySelector(".game-card")) {
      resetGame();
    }
  }

  function nextScreen() {
    if (currentIndex === screens.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    showScreen(currentIndex);

    if (currentIndex === 1) {
      tryPlayMusic();
    }
  }

  function previousScreen() {
    if (currentIndex > 0) {
      currentIndex--;
      showScreen(currentIndex);
    }
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", nextScreen);
  });

  if (backArrow) {
    backArrow.addEventListener("click", previousScreen);
  }

  function tryPlayMusic() {
    if (!bgMusic || !playPauseBtn || !musicText) return;

    bgMusic.play()
      .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = "❚❚";
        musicText.textContent = "Música reproduciéndose";
      })
      .catch(() => {
        isPlaying = false;
        playPauseBtn.textContent = "▶";
        musicText.textContent = "Presiona para reproducir";
      });
  }

  if (playPauseBtn && bgMusic && musicText) {
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        playPauseBtn.textContent = "▶";
        musicText.textContent = "Música pausada";
      } else {
        tryPlayMusic();
      }
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const message = card.getAttribute("data-message");

      if (modal && modalText) {
        modalText.textContent = message;
        modal.classList.remove("hidden");
      }
    });
  });

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  if (surpriseBtn && surpriseText) {
    surpriseBtn.addEventListener("click", () => {
      surpriseText.classList.remove("hidden");
      surpriseBtn.textContent = "Ya sabía que lo harías";
    });
  }

  if (letterBtn && letterText) {
    letterBtn.addEventListener("click", () => {
      letterText.classList.remove("hidden");
      letterBtn.textContent = "Mensaje abierto";
    });
  }

  function resetGame() {
    score = 0;
    timeLeft = 20;
    gameRunning = false;

    if (scoreText) {
      scoreText.textContent = score;
    }

    if (timeLeftText) {
      timeLeftText.textContent = timeLeft;
    }

    if (gameResult) {
      gameResult.classList.add("hidden");
      gameResult.textContent = "";
    }

    if (gameNextBtn) {
      gameNextBtn.classList.add("hidden");
    }

    clearInterval(gameTimer);
    clearInterval(starTimer);

    if (gameArea) {
      gameArea.querySelectorAll(".star-target").forEach((star) => {
        star.remove();
      });
    }

    if (gameHint) {
      gameHint.classList.remove("hidden");
      gameHint.textContent = "Presiona iniciar para jugar";
    }

    if (startGameBtn) {
      startGameBtn.classList.remove("hidden");
      startGameBtn.textContent = "Iniciar juego";
    }
  }

  function startGame() {
    if (!gameArea || gameRunning) return;

    resetGame();

    gameRunning = true;

    if (gameHint) {
      gameHint.classList.add("hidden");
    }

    if (startGameBtn) {
      startGameBtn.classList.add("hidden");
    }

    createStar();

    gameTimer = setInterval(() => {
      timeLeft--;

      if (timeLeftText) {
        timeLeftText.textContent = timeLeft;
      }

      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    starTimer = setInterval(() => {
      createStar();
    }, 900);
  }

  function createStar() {
    if (!gameArea || !gameRunning) return;

    const star = document.createElement("button");
    star.classList.add("star-target");
    star.type = "button";
    star.textContent = "✦";

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const maxX = areaWidth - 50;
    const maxY = areaHeight - 50;

    const randomX = Math.max(8, Math.floor(Math.random() * maxX));
    const randomY = Math.max(8, Math.floor(Math.random() * maxY));

    star.style.left = `${randomX}px`;
    star.style.top = `${randomY}px`;

    star.addEventListener("click", () => {
      if (!gameRunning) return;

      score++;

      if (scoreText) {
        scoreText.textContent = score;
      }

      star.remove();

      if (score >= 10) {
        endGame(true);
      }
    });

    gameArea.appendChild(star);

    setTimeout(() => {
      if (star && star.parentElement) {
        star.remove();
      }
    }, 1300);
  }

  function endGame(won) {
    gameRunning = false;

    clearInterval(gameTimer);
    clearInterval(starTimer);

    if (gameArea) {
      gameArea.querySelectorAll(".star-target").forEach((star) => {
        star.remove();
      });
    }

    if (gameResult) {
      gameResult.classList.remove("hidden");

      if (won) {
        gameResult.textContent = "Ganaste. Ahora sí desbloqueaste el mensaje guardado.";
      } else {
        gameResult.textContent = "Se acabó el tiempo. Inténtalo otra vez, señorita.";
      }
    }

    if (gameHint) {
      gameHint.classList.remove("hidden");

      if (won) {
        gameHint.textContent = "Reto completado ✨";
      } else {
        gameHint.textContent = "Casi... vuelve a intentarlo";
      }
    }

    if (won) {
      if (gameNextBtn) {
        gameNextBtn.classList.remove("hidden");
      }

      if (startGameBtn) {
        startGameBtn.classList.add("hidden");
      }
    } else {
      if (startGameBtn) {
        startGameBtn.classList.remove("hidden");
        startGameBtn.textContent = "Intentar de nuevo";
      }
    }
  }

  if (startGameBtn) {
    startGameBtn.addEventListener("click", startGame);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextScreen();
    }

    if (event.key === "ArrowLeft") {
      previousScreen();
    }

    if (event.key === "Escape" && modal) {
      modal.classList.add("hidden");
    }
  });

  showScreen(currentIndex);
});