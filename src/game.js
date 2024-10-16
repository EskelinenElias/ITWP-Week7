// Constants for game config
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 500;

// Phaser game configuration
var config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Create game
const game = new Phaser.Game(config);

// This object is used for storing the state of the game
const gameState = {
  score: 0,
  gameOver: false, 
  lastDirection: "right",
  star: null,
  player: null,
  cursors: null,
  spacebar: null,
  shootKey: null,
  platforms: null,
  stars: null,
  bullets: null,
  skeletons: null,
  scoreText: null,
  gravity: 500
};

// Preload assets
function preload() {
  // Load background layers
  const backgroundLayers = [
    'assets/layers/parallax-forest-back-trees.png',
    'assets/layers/parallax-forest-middle-trees.png',
    'assets/layers/parallax-forest-lights.png',
    'assets/layers/parallax-forest-front-trees.png',
  ];
  backgroundLayers.forEach((layer, index) => {
    this.load.image(`backgroundLayer${index + 1}`, layer);
  });
  // Load platforms and ground 
  this.load.image("ground", "assets/platform.png");
  // Load player
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  // Load skeleton
  this.load.spritesheet(
    "skeleton",
    "assets/skeleton spritesheet calciumtrice.png",
    { frameWidth: 32, frameHeight: 32 },
  );
  // Load star and bullet
  this.load.image("star", "assets/star.png");
  this.load.image("projectile", "assets/laserBullet.png");
}

function create() {
  // Create the game world and entities
  createGameWorld.call(this); 
  createPlayer.call(this); 
  createStars.call(this);
  createSkeletons.call(this);
  // Add colliders and overlaps
  this.physics.add.overlap(gameState.player, gameState.stars, collectStar, null, this);
  this.physics.add.overlap(gameState.bullets, gameState.skeletons, hitSkeleton, null, this);
  this.physics.add.overlap(gameState.player, gameState.skeletons, skeletonAttack, null, this);
  // Spawn first skeleton and star
  spawnRandomSkeleton.call(this); 
  spawnRandomStar.call(this); 
}

// Game update loop
function update() {
  // Check if game over and all entities are on ground
  if (gameState.gameOver && checkIfAllStopped.call(this)) {
    let allDown = checkIfAllStopped()
    if (allDown) {  
      //this.physics.pause();
      return;
    }
  }

  // Check if bullets are out of bounds
  recycleBullets.call(this); 

  // Player movement and shooting
  handlePlayerMovement.call(this);

  // Maybe spawn a new skeleton
  if (Phaser.Math.Between(0, 100) > 99) { spawnRandomSkeleton.call(this); }
  
  // Very intelligent Skeleton AI
  handleSkeletonMovement.call(this); 
}


function checkIfAllStopped() {
  if (!gameState.player.body.onFloor()) {
    return false; 
  } 
  gameState.skeletons.children.iterate((skeleton) => {
    if (skeleton.body.velocity.y !== 0) {
      return false; 
    }
  });
  return true;
}
