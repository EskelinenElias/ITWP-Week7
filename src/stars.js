function createStars() {
  // Create start
  gameState.stars = this.physics.add.group();
  // Set up collider between stars and platforms
  this.physics.add.collider(gameState.stars, gameState.platforms);
}

function spawnRandomStar() {
  // Find a random position for the star
  let validPosition = false; 
  let x, y; 
  while (!validPosition) {
    x = Phaser.Math.Between(50, 750); 
    y = Phaser.Math.Between(50, 550); 
    validPosition = !isOverlappingWithPlatforms.call(this, x, y, 32, 32);
  }
  // Spawn the star at the valid random position
  const star = gameState.stars.create(x, y, "star");
  if (star) { star.setGravityY(GRAVITY); }
}

function collectStar(player, star) {
  // Disable the star
  star.disableBody(true, true);
  gameState.score += 10;
  gameState.scoreText.setText("Score: " + gameState.score);
  // Spawn a new star and a new skeleton
  spawnRandomStar.call(this);
  spawnRandomSkeleton.call(this); 
}