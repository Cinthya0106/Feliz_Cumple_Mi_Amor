const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mensajeDiv = document.getElementById('mensaje');

// Imagen del personaje
const personaje = new Image();
personaje.src = 'personaje.png';

// Imágenes de los obstáculos
const obstaculoImgs = [
  new Image(),
  new Image(),
  new Image(),
  new Image()
];

obstaculoImgs[0].src = 'obstaculo1.png';
obstaculoImgs[1].src = 'obstaculo2.png';
obstaculoImgs[2].src = 'obstaculo3.png';
obstaculoImgs[3].src = 'obstaculo4.png';

// Jugador
const player = {
  x: 50,
  y: 300,
  width: 48,
  height: 48,
  velocityY: 0,
  gravity: 0.6,
  jumpPower: -12,
  onGround: true
};

// Suelo
const groundHeight = 50;

// Niveles y obstáculos
let currentLevel = 1;
let obstaclesPassed = 0;

const levels = {
  1: [{ x: 400 }, { x: 700 }, { x: 1000 }],
  2: [{ x: 400 }, { x: 650 }, { x: 900 }],
  3: [{ x: 300 }, { x: 550 }, { x: 800 }]
};

let obstacles = JSON.parse(JSON.stringify(levels[currentLevel]));

// Mensajes
const mensajes = {
  inicio: '🚨 Alerta: tu novia ha programado este juego especialmente para ti. Corre o ríe... ¡o ambas! 🏃‍♂️💥',
  nivel1: '✅ Nivel 1 superado: Has esquivado más obstáculos que yo cuando tengo hambre y no hay comida.',
  inicio2: '🔥 Nivel 2: Si pasas este, oficialmente te graduas como el novio más pro del mundo (según la NASA).',
  nivel2: '🎯 Nivel 2 completado: ¡Cuidado! Este juego se pone más intenso que yo cuando me antojo de cualquier cosa.',
  inicio3: '⚠️ Último nivel: ¡Concentración máxima! Porque al final hay una sorpresa... o una trampa. ¿Quién sabe?',
};

// Mostrar mensaje
function mostrarMensaje(texto) {
  mensajeDiv.innerText = texto;
  mensajeDiv.style.display = 'block';
  setTimeout(() => {
    mensajeDiv.style.display = 'none';
  }, 7000);
}

// Control del salto
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.onGround) {
    player.velocityY = player.jumpPower;
    player.onGround = false;
  }
});

// Iniciar juego
mostrarMensaje(mensajes.inicio);
update();

function update() {
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Suelo
  if (player.y + player.height >= canvas.height - groundHeight) {
    player.y = canvas.height - groundHeight - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }

  // Obstáculos
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    ob.x -= 4;

    // Colisión
    if (
      player.x < ob.x + 30 &&
      player.x + player.width > ob.x &&
      player.y + player.height > canvas.height - groundHeight - 30
    ) {
      alert('¡Oh no! Intenta de nuevo el nivel ' + currentLevel);
      resetLevel();
      return;
    }

    // Si pasa obstáculo
    if (ob.x + 30 < player.x && !ob.passed) {
      ob.passed = true;
      obstaclesPassed++;
    }
  }

  // Pasó el nivel
  if (obstaclesPassed >= 3) {
    if (currentLevel === 1) mostrarMensaje(mensajes.nivel1);
    if (currentLevel === 2) mostrarMensaje(mensajes.nivel2);

    setTimeout(nextLevel, 2000);
    return;
  }

  draw();
  requestAnimationFrame(update);
}

function nextLevel() {
  currentLevel++;
  if (currentLevel > 3) {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('videoFinal').style.display = 'block';
    return;
  }

  if (currentLevel === 2) mostrarMensaje(mensajes.inicio2);
  if (currentLevel === 3) mostrarMensaje(mensajes.inicio3);

  obstacles = JSON.parse(JSON.stringify(levels[currentLevel]));
  obstaclesPassed = 0;
  player.x = 50;
  player.y = 300;
  player.velocityY = 0;
  setTimeout(update, 1000);
}

function resetLevel() {
  obstacles = JSON.parse(JSON.stringify(levels[currentLevel]));
  obstaclesPassed = 0;
  player.x = 50;
  player.y = 300;
  player.velocityY = 0;
  setTimeout(update, 1000);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Suelo
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  // Obstáculos con imágenes
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    const imgIndex = i % obstaculoImgs.length;
    ctx.drawImage(obstaculoImgs[imgIndex], ob.x, canvas.height - groundHeight - 30, 30, 30);
  }

  // Personaje
  ctx.drawImage(personaje, player.x, player.y, player.width, player.height);

  // Nivel
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Nivel: ' + currentLevel, 10, 30);
}
