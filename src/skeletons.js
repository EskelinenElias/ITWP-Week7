const NUMBER_OF_SKELETONS = 15; 

function createSkeletons() {
  // Create skeletons
  gameState.skeletons = this.physics.add.group({
    key: 'skeleton',       
    repeat: NUMBER_OF_SKELETONS, 
    setXY: { x: -100, y: -100 }, // Spawn the skeletons off screen
  });
  // Set skeleton properties
  gameState.skeletons.children.iterate((skeleton) => {
    skeleton.setBounce(0)
      .setGravityY(GRAVITY).setCollideWorldBounds(true)
      .setActive(false).setVisible(false);
  });
  // Add animations for skeletons
  createSkeletonAnimations.call(this); 
}

function spawnRandomSkeleton() {
  console.log("Spawning a spooky skeleton...")
  // Get a skeleton from the pool
  let skeleton = gameState.skeletons.getFirstDead();
  if (skeleton) {
    // Activate the skeleton and spawn to random position
    skeleton.enableBody(true).setActive(true).setVisible(true);
    skeleton.setPosition(Phaser.Math.Between(50, 550), 0);
    // Set skeleton's velocity and direction
    skeleton.setGravityY(GRAVITY).setBounceY(0).setCollideWorldBounds(true)
      .setScale(1.5).setFlipX(Phaser.Math.Between(0, 1) === 1);
    skeleton.anims.play("spookySkeletonDance", true);
    // Add collider between skeletons and platforms
    this.physics.add.collider(gameState.skeletons, gameState.platforms);
  }
}

// Random movement for skeletons
function handleSkeletonMovement() {
  gameState.skeletons.children.iterate((skeleton) => {
    if (!(skeleton.anims.currentAnim && skeleton.anims.currentAnim.key === "skeletonDeath")) {
      // Randomize movements
      if (Math.abs(skeleton.body.y - gameState.player.y) < 100) {
        console.log("Skeleton spotted the player...")
        if (skeleton.body.x < gameState.player.x) {
          skeleton.setFlipX(false);
          if (skeleton.body.onFloor()) { 
            skeleton.setVelocityX(50);
          }
        } else {
          skeleton.setFlipX(true);
          if (skeleton.body.onFloor()) { 
            skeleton.setVelocityX(-50); 
          }
        }
      } else if (Phaser.Math.Between(0, 100) > 99 && skeleton.body.onFloor()) {
        skeleton.setVelocityX(50);
        skeleton.setFlipX(false);
      } else if (Phaser.Math.Between(0, 100) > 99 && skeleton.body.onFloor()) {
        skeleton.setVelocityX(-50);
        skeleton.setFlipX(true);
      } else if (Phaser.Math.Between(0, 100) > 99 && skeleton.body.onFloor()) {
        skeleton.setVelocityX(0);
      } else if (Phaser.Math.Between(0, 100) > 99 && skeleton.body.onFloor()) {
        skeleton.setVelocity(100, -500);
      } else if (Phaser.Math.Between(0, 200) > 199 && skeleton.body.onFloor()) {
        skeleton.setVelocity(-100, -500);
      }
      // Play appropriate animations based on velocity
      if (skeleton.body.velocity.y !== 0) {
        skeleton.anims.play("spookySkeletonDance", true);
      } else if (skeleton.body.velocity.x > 0) {
        skeleton.anims.play("skeletonWalkRight", true);
      } else if (skeleton.body.velocity.x < 0) {
        skeleton.anims.play("skeletonWalkRight", true);
      } else {
        skeleton.anims.play("skeletonStanding", true);
      }
    }
  }); 
}

function hitSkeleton(bullet, skeleton) {
  if (skeleton.anims.currentAnim && skeleton.anims.currentAnim.key === "skeletonDeath") {
    return; 
    //} else if (gameState.gameOver) {
    //return; 
  }
  // Disable bullet
  bullet.disableBody(true, true);
  // Disable skeleton
  skeleton.setVelocityX(0);
  // Play death animation
  skeleton.anims.play("skeletonDeath", true);
  // Disable skeleton after animation
  skeleton.on("animationcomplete", function () {
    skeleton.disableBody(true, true).setActive(false).setVisible(false);
  });
  // Update score
  gameState.score += 20;
  gameState.scoreText.setText("Score: " + gameState.score);
}

function skeletonAttack(player, skeleton) {
  if (skeleton.anims.currentAnim && skeleton.anims.currentAnim.key === "skeletonDeath") {
    return; 
  } else if (!skeleton.active) {
    return; 
  }
  // Change player velocity
  player.setVelocityX(0); 
  player.setVelocityY(skeleton.body.velocity.y);
  // Change skeleton velocity
  skeleton.setVelocityX(0);
  skeleton.setFlipX(skeleton.body.x > player.x);
  // Game over
  gameState.gameOver = true;
  console.log("Game over.")
  // Animate the player
  player.anims.play("turn");
  // Animate the skeleton
  skeleton.anims.play("skeletonAttack", true);
  skeleton.on("animationcomplete", function () {
    // Turn player red
    player.setTint(0xff0000);
    // Make the skeletons do a spooky dance
    gameState.skeletons.children.iterate((skeleton) => {
      skeleton.setVelocityX(0);
      skeleton.anims.play("spookySkeletonDance", true); 
    });
  });
}

function createSkeletonAnimations() {
  this.anims.create({
    key: "skeletonWalkRight",
    frames: this.anims.generateFrameNumbers("skeleton", { start: 20, end: 29 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "skeletonDeath",
    frames: this.anims.generateFrameNumbers("skeleton", { start: 40, end: 49 }), // Last row, frames 40-49
    frameRate: 10,
    hideOnComplete: true,
  });
  this.anims.create({
    key: "skeletonStanding",
    frames: this.anims.generateFrameNumbers("skeleton", { start: 0, end: 9 }),
    frameRate: 10,
    repeat: -1, 
  });
  this.anims.create({
    key: "spookySkeletonDance",
    frames: this.anims.generateFrameNumbers("skeleton", { start: 10, end: 19 }),
    frameRate: 10,
    repeat: -1, 
  });
  this.anims.create({
    key: "skeletonAttack",
    frames: this.anims.generateFrameNumbers("skeleton", { start: 30, end: 39 }),
    frameRate: 10,
    repeat: 0,
  });
}
