// Tangram Towers - Main configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MenuScene, MainGameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        pixelArt: false,
        antialias: true
    },
    // Enable camera and world bounds
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Create game instance
const game = new Phaser.Game(config);

// Add game title to window
window.onload = function() {
    document.title = "Tangram Towers - A Steampunk Tower Defense";
}; 