function createGameWorld() {
  // Create and configure background
  const layerKeys = [
    'backgroundLayer1',
    'backgroundLayer2',
    'backgroundLayer3',
    'backgroundLayer4',
  ];
  layerKeys.forEach((key, index) => {
    let layer = this.add.image(400, 300, key); 
    layer.setScale(
      this.sys.game.config.width / layer.width,
      this.sys.game.config.height / layer.height
    ).setDepth(index - 3);
  })
  // Add score text
  gameState.scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#000",
    backgroundColor: "#FFF"
  });
  // Create platforms
  gameState.platforms = this.physics.add.staticGroup();
  gameState.platforms.create(400, 570, "ground").setScale(2).refreshBody();
  gameState.platforms.create(550, 400, "ground");
  gameState.platforms.create(60, 260, "ground");
  gameState.platforms.create(725, 220, "ground");
}

function isOverlappingWithPlatforms(x, y, sizeX, sizeY) {
  const starBounds = new Phaser.Geom.Rectangle(x-sizeX/2, y-sizeY/2, sizeX, sizeY);
  gameState.platforms.children.iterate((platform) => {
    const platformBounds = platform.getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(starBounds, platformBounds)) {
      return true; 
    }
  });
  return false; 
}