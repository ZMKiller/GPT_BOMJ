const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 300;

const homeless = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 60,
  color: 'brown',
  speed: 3,
  hasGuitar: false
};

let money = 0;
let food = 100;
let mood = 100;
let health = 100;
let energy = 100;
let day = 1;
let dayTime = 0;
const dayLength = 60000; // 60 секунд

const coins = [];
const passersby = [];
const foods = [];

let lastSpawn = 0;
let lastFoodSpawn = 0;
let lastTime = 0;

let musicActive = false;
let musicTimer = 0;
let lastMusicCoin = 0;

const keys = {};

document.addEventListener('keydown', e => {
  keys[e.key] = true;
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

/*** UI Elements ***/
const moneyElem = document.getElementById('money');
const foodElem = document.getElementById('food');
const moodElem = document.getElementById('mood');
const healthElem = document.getElementById('health');
const energyElem = document.getElementById('energy');
const dayElem = document.getElementById('day');

const buyFoodBtn = document.getElementById('buyFood');
const restBtn = document.getElementById('rest');
const buyGuitarBtn = document.getElementById('buyGuitar');
const playMusicBtn = document.getElementById('playMusic');
const startBusinessBtn = document.getElementById('startBusiness');

/*** Game Loop ***/
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleInput(delta);

  // Draw homeless
  ctx.fillStyle = homeless.color;
  ctx.fillRect(homeless.x, homeless.y, homeless.width, homeless.height);

  // Spawn entities
  if (timestamp - lastSpawn > Math.max(500, 2000 - day * 100)) {
    spawnPasserby();
    lastSpawn = timestamp;
  }

  if (timestamp - lastFoodSpawn > 10000) {
    spawnFood();
    lastFoodSpawn = timestamp;
  }

  updateEntities(delta, timestamp);

  updateStats(delta);
  updateUI();
  checkGameOver();

  // Day cycle
  dayTime += delta;
  if (dayTime >= dayLength) {
    day++;
    dayTime = 0;
    dayElem.textContent = day;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

/*** Input ***/
function handleInput(delta) {
  const move = homeless.speed * delta / 16; // scale with time
  if (keys['ArrowLeft']) {
    homeless.x -= move;
  }
  if (keys['ArrowRight']) {
    homeless.x += move;
  }
  homeless.x = Math.max(0, Math.min(canvas.width - homeless.width, homeless.x));
}

/*** Entities ***/
function spawnPasserby() {
  const passerby = {
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    color: '#ccc',
    speed: 1 + Math.random() * 2
  };
  passersby.push(passerby);
}

function spawnFood() {
  const foodItem = {
    x: Math.random() * (canvas.width - 20),
    y: -20,
    size: 20,
    color: 'green',
    speed: 1 + Math.random() * 1.5
  };
  foods.push(foodItem);
}

function updateEntities(delta, timestamp) {
  // Passersby
  for (let i = passersby.length - 1; i >= 0; i--) {
    const p = passersby[i];
    p.y += p.speed * delta / 16;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);

    // Drop coin when passing near homeless
    if (p.y > homeless.y && p.y < homeless.y + homeless.height) {
      coins.push({
        x: p.x + p.width / 2,
        y: p.y + p.height,
        radius: 5,
        color: 'gold',
        speed: 2
      });
      passersby.splice(i, 1);
    } else if (p.y > canvas.height) {
      passersby.splice(i, 1);
    }
  }

  // Coins
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    c.y += c.speed * delta / 16;

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();

    if (checkCollisionCircleRect(c, homeless)) {
      money += musicActive ? 10 : 5; // музыка увеличивает доход
      coins.splice(i, 1);
      checkBusinessUnlock();
    } else if (c.y > canvas.height) {
      coins.splice(i, 1);
    }
  }

  // Food items
  for (let i = foods.length - 1; i >= 0; i--) {
    const f = foods[i];
    f.y += f.speed * delta / 16;

    ctx.fillStyle = f.color;
    ctx.fillRect(f.x, f.y, f.size, f.size);

    if (checkCollisionRectRect(f, homeless)) {
      food = Math.min(100, food + 20);
      energy = Math.min(100, energy + 10);
      foods.splice(i, 1);
    } else if (f.y > canvas.height) {
      foods.splice(i, 1);
    }
  }

  // Music coins
  if (musicActive) {
    musicTimer -= delta;
    if (timestamp - lastMusicCoin > 500) {
      coins.push({
        x: homeless.x + homeless.width / 2 + (Math.random() * 40 - 20),
        y: homeless.y,
        radius: 5,
        color: 'gold',
        speed: 2
      });
      lastMusicCoin = timestamp;
    }
    if (musicTimer <= 0) {
      musicActive = false;
      playMusicBtn.disabled = false;
    }
  }
}

function checkCollisionCircleRect(circle, rect) {
  return (
    circle.x > rect.x &&
    circle.x < rect.x + rect.width &&
    circle.y > rect.y &&
    circle.y < rect.y + rect.height
  );
}

function checkCollisionRectRect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.size > b.x &&
    a.y < b.y + b.height &&
    a.y + a.size > b.y
  );
}

/*** Stats and UI ***/
function updateStats(delta) {
  const seconds = delta / 1000;
  food -= 0.5 * seconds;
  mood -= 0.2 * seconds;
  energy -= 1 * seconds;

  if (food < 20) health -= 0.5 * seconds;
  if (mood < 20) health -= 0.2 * seconds;
  if (energy <= 0) {
    energy = 0;
    health -= 0.5 * seconds;
  }

  food = Math.max(0, Math.min(100, food));
  mood = Math.max(0, Math.min(100, mood));
  health = Math.max(0, Math.min(100, health));
  energy = Math.max(0, Math.min(100, energy));
}

function updateUI() {
  moneyElem.textContent = Math.floor(money);
  foodElem.textContent = Math.floor(food);
  moodElem.textContent = Math.floor(mood);
  healthElem.textContent = Math.floor(health);
  energyElem.textContent = Math.floor(energy);
}

function checkGameOver() {
  if (health <= 0) {
    alert('Вы проиграли! Здоровье закончилось.');
    resetGame();
  }
}

function resetGame() {
  money = 0;
  food = 100;
  mood = 100;
  health = 100;
  energy = 100;
  day = 1;
  dayTime = 0;
  coins.length = 0;
  passersby.length = 0;
  foods.length = 0;
  homeless.hasGuitar = false;
  buyGuitarBtn.disabled = false;
  playMusicBtn.disabled = true;
  startBusinessBtn.disabled = true;
  updateUI();
  dayElem.textContent = day;
}

/*** Player actions ***/
buyFoodBtn.addEventListener('click', () => {
  if (money >= 10) {
    money -= 10;
    food = Math.min(100, food + 20);
    energy = Math.min(100, energy + 10);
    updateUI();
  } else {
    alert('Недостаточно денег!');
  }
});

restBtn.addEventListener('click', () => {
  energy = Math.min(100, energy + 40);
  mood = Math.min(100, mood + 20);
  health = Math.min(100, health + 10);
  updateUI();
});

buyGuitarBtn.addEventListener('click', () => {
  if (money >= 50) {
    money -= 50;
    homeless.hasGuitar = true;
    buyGuitarBtn.disabled = true;
    playMusicBtn.disabled = false;
    mood = Math.min(100, mood + 10);
    updateUI();
  } else {
    alert('Нужно 50 ₽ для покупки гитары.');
  }
});

playMusicBtn.addEventListener('click', () => {
  if (!homeless.hasGuitar) return;
  if (energy < 20) {
    alert('Недостаточно энергии для игры.');
    return;
  }
  musicActive = true;
  musicTimer = 5000; // 5 секунд
  energy -= 20;
  playMusicBtn.disabled = true;
});

startBusinessBtn.addEventListener('click', () => {
  if (money >= 1000) {
    money -= 1000;
    updateUI();
    alert('Поздравляем! Вы открыли бизнес и выиграли игру!');
    resetGame();
  } else {
    alert('Нужно 1000 ₽ для открытия бизнеса.');
  }
});

function checkBusinessUnlock() {
  if (money >= 1000) {
    startBusinessBtn.disabled = false;
  }
}
