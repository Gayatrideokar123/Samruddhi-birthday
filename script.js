
const pages = [...document.querySelectorAll(".page")];

function goTo(id) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "final") {
    celebration();
    if (musicOn) playFinaleMusic();
  } else if (musicOn) {
    finaleMusic.pause();
    birthdayMusic.play().catch(() => {});
  }
}

document.getElementById("beginButton").addEventListener("click", () => {
  goTo("gift");
  sprinkleStars(16);
});

document.getElementById("giftButton").addEventListener("click", () => {
  const button = document.getElementById("giftButton");

  if (button.dataset.opened === "yes") return;

  button.dataset.opened = "yes";
  button.querySelector(".gift-emoji").textContent = "💝";
  button.querySelector(".gift-emoji").style.transform =
    "scale(1.35) rotate(10deg)";

  document.getElementById("giftMessage").textContent =
    "Surprise! You deserve all the happiness in the world, Samruddhi! 💗";

  document.getElementById("toMemories").classList.remove("hidden");

  sprinkleStars(35);
  playChime();
});

document.getElementById("toMemories").addEventListener("click", () => {
  goTo("memories");
});

document.getElementById("toReasons").addEventListener("click", () => {
  goTo("reasons");
});

document.getElementById("toLetter").addEventListener("click", () => {
  goTo("letter");
});

document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("letterContent").classList.remove("hidden");
  document.getElementById("openLetter").classList.add("hidden");
  document.getElementById("toFinal").classList.remove("hidden");
  playChime();
});

document.getElementById("toFinal").addEventListener("click", () => {
  goTo("final");
});

document.getElementById("celebrateButton").addEventListener("click", celebration);


// MUSIC

let musicOn = false;

const musicButton = document.getElementById("musicButton");

const birthdayMusic = new Audio(
  "./bright-happy-acoustic-instrumental.mp3"
);

const finaleMusic = new Audio(
  "./happy-birthday-pop-finale.mp3"
);

finaleMusic.loop = false;
finaleMusic.volume = 0.62;

function playFinaleMusic() {
  birthdayMusic.pause();
  finaleMusic.currentTime = 0;

  finaleMusic.play().catch(() => {
    musicButton.innerHTML = "♫ <span>Tap to play birthday pop</span>";
  });

  musicButton.innerHTML = "♫ <span>Happy Birthday pop is playing</span>";
}

function playChime() {
  // Surprise interactions remain quiet.
}

async function toggleMusic() {
  if (!musicOn) {
    try {
      musicOn = true;

      if (document.getElementById("final").classList.contains("active")) {
        await finaleMusic.play();
        musicButton.innerHTML =
          "♫ <span>Happy Birthday pop is playing</span>";
      } else {
        await birthdayMusic.play();
        musicButton.innerHTML =
          "♫ <span>Happy instrumental is playing</span>";
      }

      musicButton.setAttribute("aria-pressed", "true");

    } catch (error) {
      musicOn = false;
      musicButton.innerHTML =
        "♫ <span>Tap to play happy instrumental</span>";
      musicButton.setAttribute("aria-pressed", "false");
    }

  } else {
    birthdayMusic.pause();
    finaleMusic.pause();

    musicOn = false;

    musicButton.innerHTML =
      "♫ <span>Play happy instrumental</span>";

    musicButton.setAttribute("aria-pressed", "false");
  }
}

musicButton.addEventListener("click", toggleMusic);


// STAR ANIMATION

function sprinkleStars(count = 25) {
  const holder = document.getElementById("stars");
  const symbols = ["✦", "✧", "♡", "✶"];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const star = document.createElement("span");

      star.className = "star-particle";
      star.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      star.style.left = Math.random() * 96 + "vw";
      star.style.top = (30 + Math.random() * 65) + "vh";
      star.style.fontSize = (12 + Math.random() * 17) + "px";

      holder.appendChild(star);

      setTimeout(() => star.remove(), 3100);
    }, i * 45);
  }
}

function celebration() {
  sprinkleStars(55);
  fireworks();
}

function fireworks() {
  const canvas = document.getElementById("effects");
  const ctx = canvas.getContext("2d");

  const dpr = Math.min(devicePixelRatio || 1, 2);

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = [
    "#f28bb4", "#ffd1e2", "#e7a6ff", "#ffd27f", "#ffffff"
  ];

  const bursts = Array.from({ length: 7 }, (_, i) => ({
    x: innerWidth * (0.15 + Math.random() * 0.7),
    y: innerHeight * (0.15 + Math.random() * 0.48),

    particles: Array.from({ length: 34 }, () => ({
      a: Math.random() * Math.PI * 2,
      s: 1.2 + Math.random() * 3,
      r: 1.5 + Math.random() * 2,
      c: colors[Math.floor(Math.random() * colors.length)]
    })),

    delay: i * 170
  }));

  const start = performance.now();

  function draw(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    let active = false;

    bursts.forEach(b => {
      const t = (now - start - b.delay) / 1000;

      if (t < 0 || t > 1.7) {
        if (t <= 1.7) active = true;
        return;
      }

      active = true;

      b.particles.forEach(p => {
        const distance = p.s * t * 95;
        const alpha = Math.max(0, 1 - t / 1.7);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.c;

        ctx.beginPath();

        ctx.arc(
          b.x + Math.cos(p.a) * distance,
          b.y + Math.sin(p.a) * distance + 45 * t * t,
          p.r,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });
    });

    ctx.globalAlpha = 1;

    if (active) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  requestAnimationFrame(draw);
}


// PHOTO GALLERY - CORRECTED

const photoGrid = document.getElementById("photoGrid");

function markPhotoLoaded(img) {
  const card = img.closest(".photo-card");

  if (card && img.naturalWidth > 0) {
    card.classList.add("has-photo");
  }
}

function markPhotoError(img) {
  const card = img.closest(".photo-card");

  if (card) {
    card.classList.remove("has-photo");
  }
}

// Load all existing project photos
if (photoGrid) {
  const galleryImages = photoGrid.querySelectorAll(".photo-card img");

  galleryImages.forEach((img, index) => {

    // Correct path: photos are in the same folder as index.html
    img.src = `photo-${index + 1}.jpg`;

    img.onload = () => markPhotoLoaded(img);
    img.onerror = () => markPhotoError(img);

    if (img.complete && img.naturalWidth > 0) {
      markPhotoLoaded(img);
    }
  });
}


// PHOTO UPLOAD PREVIEW

const photoUpload = document.getElementById("photoUpload");

if (photoUpload && photoGrid) {

  photoUpload.addEventListener("change", () => {

    const files = [...photoUpload.files]
      .filter(file => file.type.startsWith("image/"))
      .slice(0, 7);

    const cards = [
      ...document.querySelectorAll("#photoGrid .photo-card")
    ];

    // Reset to original project photos
    cards.forEach((card, index) => {
      const img = card.querySelector("img");

      if (img.dataset.previewUrl) {
        URL.revokeObjectURL(img.dataset.previewUrl);
      }

      delete img.dataset.previewUrl;

      img.src = `photo-${index + 1}.jpg`;
      img.onload = () => markPhotoLoaded(img);
      img.onerror = () => markPhotoError(img);

      card.classList.remove("has-photo");
    });

    // Display uploaded preview photos
    files.forEach((file, index) => {
      const card = cards[index];

      if (!card) return;

      const img = card.querySelector("img");
      const url = URL.createObjectURL(file);

      img.dataset.previewUrl = url;

      img.onload = () => markPhotoLoaded(img);
      img.onerror = () => markPhotoError(img);

      img.src = url;
    });

    if (files.length > 0) {
      photoGrid.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });
}
