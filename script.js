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

  let currentIndex = 0;
  let isPlaying = false;

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