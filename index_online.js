const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: './img/background.png'
});

const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
});

let player, enemy, role;
const socket = new WebSocket('ws://localhost:8080');
const roomNumber = localStorage.getItem('roomNumber');

socket.onopen = () => {
  socket.send(JSON.stringify({ room: roomNumber }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.message === 'waiting') {
    document.getElementById('waitingMessage').style.display = 'block';
  } else if (data.start) {
    document.getElementById('waitingMessage').style.display = 'none';
    startGame(data.role);
  } else {
    updateGame(data);
  }
};

function startGame(role) {
  if (role === 'player') {
    player = new Fighter({
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
      scale: 2.5,
      offset: { x: 215, y: 157 },
      sprites: {
        idle: { imageSrc: './img/samuraiMack/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/samuraiMack/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/samuraiMack/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/samuraiMack/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/samuraiMack/Attack1.png', framesMax: 6 },
        takeHit: { imageSrc: './img/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
        death: { imageSrc: './img/samuraiMack/Death.png', framesMax: 6 }
      },
      attackBox: {
        offset: { x: 255, y: 50 },
        width: 175,
        height: 30
      }
    });

    enemy = new Fighter({
      position: { x: 400, y: 100 },
      velocity: { x: 0, y: 0 },
      color: 'blue',
      offset: { x: -50, y: 0 },
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
      scale: 2.5,
      offset: { x: 215, y: 167 },
      sprites: {
        idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
        run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
        takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
        death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
      },
      attackBox: {
        offset: { x: -115, y: 50 },
        width: 115,
        height: 30
      }
    });
  } else {
    enemy = new Fighter({
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
      scale: 2.5,
      offset: { x: 215, y: 157 },
      sprites: {
        idle: { imageSrc: './img/samuraiMack/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/samuraiMack/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/samuraiMack/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/samuraiMack/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/samuraiMack/Attack1.png', framesMax: 6 },
        takeHit: { imageSrc: './img/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
        death: { imageSrc: './img/samuraiMack/Death.png', framesMax: 6 }
      },
      attackBox: {
        offset: { x: 255, y: 50 },
        width: 175,
        height: 30
      }
    });

    player = new Fighter({
      position: { x: 400, y: 100 },
      velocity: { x: 0, y: 0 },
      color: 'blue',
      offset: { x: -50, y: 0 },
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
      scale: 2.5,
      offset: { x: 215, y: 167 },
      sprites: {
        idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
        run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
        jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
        attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
        takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
        death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
      },
      attackBox: {
        offset: { x: -115, y: 50 },
        width: 115,
        height: 30
      }
    });
  }

  animate();
}

function updateGame(data) {
  if (data.role === 'player') {
    player.position = data.position;
    player.velocity = data.velocity;
    player.health = data.health;
    player.attackBox.position = data.attackBox.position;
    player.framesCurrent = data.framesCurrent;
    player.isAttacking = data.isAttacking;
  } else {
    enemy.position = data.position;
    enemy.velocity = data.velocity;
    enemy.health = data.health;
    enemy.attackBox.position = data.attackBox.position;
    enemy.framesCurrent = data.framesCurrent;
    enemy.isAttacking = data.isAttacking;
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement with boundary checks
  if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0) {
    player.velocity.x = -3;
    player.mirrored = true;
    player.attackBox.offset.x = -player.attackBox.width - 20; // Adjust attack box to left
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x + player.width < canvas.width) {
    player.velocity.x = 3;
    player.mirrored = false;
    player.attackBox.offset.x = 20; // Adjust attack box to right
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // Jumping with boundary checks
  if (player.velocity.y < 0 && player.position.y > 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  } else if (player.position.y + player.height >= canvas.height) {
    player.velocity.y = 0;
    player.position.y = canvas.height - player.height;
  }

  // Enemy movement with boundary checks
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0) {
    enemy.velocity.x = -3.3;
    enemy.mirrored = false; // Enemy doesn't mirror when moving left
    enemy.attackBox.offset.x = -enemy.attackBox.width - 20; // Adjust attack box to left
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width < canvas.width) {
    enemy.velocity.x = 3.3;
    enemy.mirrored = true; // Enemy mirrors when moving right
    enemy.attackBox.offset.x = 20; // Adjust attack box to right
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  // Jumping with boundary checks
  if (enemy.velocity.y < 0 && enemy.position.y > 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  } else if (enemy.position.y + enemy.height >= canvas.height) {
    enemy.velocity.y = 0;
    enemy.position.y = canvas.height - enemy.height;
  }

  // Detect for collision & enemy gets hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit(4); // Adjust damage as needed
    player.isAttacking = false;

    gsap.to('#enemyHealth', { width: enemy.health + '%' });

    // Send state update to server
    socket.send(JSON.stringify({ role: 'player', position: player.position, velocity: player.velocity, health: player.health, attackBox: player.attackBox, framesCurrent: player.framesCurrent, isAttacking: player.isAttacking }));
  }

  // If player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // This is where our player gets hit
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit(7.5); // Adjust damage as needed
    enemy.isAttacking = false;

    gsap.to('#playerHealth', { width: player.health + '%' });

    // Send state update to server
    socket.send(JSON.stringify({ role: 'enemy', position: enemy.position, velocity: enemy.velocity, health: enemy.health, attackBox: enemy.attackBox, framesCurrent: enemy.framesCurrent, isAttacking: enemy.isAttacking }));
  }

  // If enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
    setTimeout(() => {
      window.location.href = 'snake.html';
    }, 3000); // Redirect back to solo mode after 3 seconds
  }
}

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false }
};

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        player.mirrored = false;
        player.attackBox.offset.x = 20; // Adjust attack box to right
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        player.mirrored = true;
        player.attackBox.offset.x = -player.attackBox.width - 20; // Adjust attack box to left
        break;
      case 'w':
        if (player.position.y > 0) {
          player.velocity.y = -15;
        }
        break;
      case 's':
        player.attack();
        break;
      case 'r':
        if (player.health < 100) {
          player.receiveHealth(100);
        }
        break;
    }

    // Send state update to server
    socket.send(JSON.stringify({ role: 'player', position: player.position, velocity: player.velocity, health: player.health, attackBox: player.attackBox, framesCurrent: player.framesCurrent, isAttacking: player.isAttacking }));
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        enemy.mirrored = true;
        enemy.attackBox.offset.x = 20; // Adjust attack box to right
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        enemy.mirrored = false;
        enemy.attackBox.offset.x = -enemy.attackBox.width - 20; // Adjust attack box to left
        break;
      case 'ArrowUp':
        if (enemy.position.y > 0) {
          enemy.velocity.y = -15;
        }
        break;
      case 'l':
        enemy.attack();
        break;
    }

    // Send state update to server
    socket.send(JSON.stringify({ role: 'enemy', position: enemy.position, velocity: enemy.velocity, health: enemy.health, attackBox: enemy.attackBox, framesCurrent: enemy.framesCurrent, isAttacking: enemy.isAttacking }));
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  // Enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
