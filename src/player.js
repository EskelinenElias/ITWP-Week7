// Game constants
const PLAYER_VELOCITY_X = 300;
const PLAYER_JUMP_VELOCITY_Y = -500;
const BULLET_VELOCITY = 1000;

function createPlayer() {
  // Create the player
  gameState.player = this.physics.add.sprite(100, 450, "dude");
  gameState.player.setCollideWorldBounds(true);
  gameState.player.setGravityY(GRAVITY); // Use constant for gravity
  this.physics.add.collider(gameState.player, gameState.platforms);
  // Create animations
  createPlayerAnimations.call(this); 
  // Configure controls
  gameState.cursors = this.input.keyboard.createCursorKeys();
  gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  gameState.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X); // Assign X key for shooting
  // Create bullets
  gameState.bullets = this.physics.add.group({
    defaultKey: "projectile",
    maxSize: 10, // Limit the number of bullets
  });
}

function handlePlayerMovement() {
  const { player, cursors, spacebar } = gameState;
  // Handle horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-PLAYER_VELOCITY_X);
    player.anims.play("left", true);
    gameState.lastDirection = "left";
  } else if (cursors.right.isDown) {
    player.setVelocityX(PLAYER_VELOCITY_X);
    player.anims.play("right", true);
    gameState.lastDirection = "right";
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }
  // Handle jumping
  if ((cursors.up.isDown || spacebar.isDown) && player.body.onFloor()) {
    player.setVelocityY(PLAYER_JUMP_VELOCITY_Y);
  }
  // Handle shooting
  if (Phaser.Input.Keyboard.JustDown(gameState.shootKey)) {
    shootBullet.call(this);
  }
}

function shootBullet() {
  // Get a bullet from the pool
  const bullet = gameState.bullets.get(); 
  if (bullet) {
    bullet.setScale(0.5, 0.5).enableBody(true, gameState.player.x, gameState.player.y)
      .setActive(true).setVisible(true).setGravityY(0);
    // Animate the player
    if (gameState.lastDirection === "right") {
      bullet.setVelocity(BULLET_VELOCITY, 0);
      bullet.setFlipX(false);
      gameState.player.anims.play("shoot_right", true);
    } else {
      bullet.setVelocity(-BULLET_VELOCITY, 0);
      bullet.setFlipX(true);
      gameState.player.anims.play("shoot_left", true);
    }
  }
}

function recycleBullets() {
  gameState.bullets.children.iterate((bullet) => {
    if (bullet.active && (bullet.x < 0 || bullet.x > config.width)) {
      bullet.disableBody(true, true); 
    }
  });
}

function createPlayerAnimations() {
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "shoot_right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 6 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "shoot_left",
    frames: this.anims.generateFrameNumbers("dude", { start: 2, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
}