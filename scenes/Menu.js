class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Create placeholder for the menu background
        this.load.image('background', 'assets/menu_background.png');
    }

    create() {
        // Use a placeholder color if the image isn't available yet
        this.add.rectangle(400, 300, 800, 600, 0x8a5a3b).setAlpha(0.8);
        
        // Game title with steampunk style
        this.add.text(400, 150, 'TANGRAM TOWERS', {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Start button with hover effect
        const startButton = this.add.text(400, 300, 'START GAME', {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff',
            backgroundColor: '#4a2511',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        startButton.on('pointerover', () => {
            startButton.setStyle({ color: '#ffcc00' });
        });
        
        startButton.on('pointerout', () => {
            startButton.setStyle({ color: '#ffffff' });
        });
        
        startButton.on('pointerdown', () => {
            this.scene.start('MainGameScene');
        });
        
        // Game description
        this.add.text(400, 500, 'Tower Defense + Tangram + Merge Game', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#cccccc'
        }).setOrigin(0.5);
        
        // Steampunk decoration
        this.add.text(400, 550, '- A Steampunk Adventure -', {
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#aa8866'
        }).setOrigin(0.5);
    }
} 