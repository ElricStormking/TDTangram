class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGameScene');
        this.tangramShapes = [];
        this.towers = [];
        this.enemies = [];
        this.robotDeck = [];
        this.steamCores = 100;
        this.waveNumber = 1;
        this.lastAttackTime = 0;
        this.robotSpeed = 30; // Speed of robot movement in pixels per second
        this.worldScrollSpeed = 30; // World scroll speed
        this.worldPosition = 0; // Track world position
        this.groundLevel = 450; // Y position of the ground
        this.robotLegs = []; // Store robot leg sprites
        this.legPhases = [0, 0.5, 0.25, 0.75]; // Different phases for leg animations
        this.worldElements = []; // Store scrollable world elements
        
        // Enhanced enemy spawning properties - Increased for more challenge
        this.enemySpawnRate = 800; // Time between enemy spawns in ms (reduced from 1000 to 800)
        this.enemySpawnTimer = 0; // Timer for spawning enemies
        this.waveDelay = 4000; // Time between waves in ms (reduced from 5000 to 4000)
        this.waveTimer = 0; // Timer for wave spawning
        this.enemiesPerWave = 15; // Starting number of enemies per wave (increased from 10 to 15)
        this.enemyTypes = ['normal', 'fast', 'heavy', 'swarm']; // Added new 'swarm' enemy type
        this.maxConcurrentEnemies = 40; // Maximum number of enemies on screen at once (increased from 30 to 40)
        this.spawnMultipleEnabled = true; // Enable spawning multiple enemies at once
    }

    preload() {
        // Load tangram shape assets
        this.createPlaceholderGraphics();
        
        // Load tower and enemy sprites
        this.load.image('robot-platform', 'assets/robot_platform.png');
        this.load.image('enemy', 'assets/enemy.png');
    }

    // Create placeholder graphics for development
    createPlaceholderGraphics() {
        // Create tangram shapes
        const graphics = this.make.graphics();
        
        // Large triangle (red)
        graphics.fillStyle(0xff0000);
        graphics.fillTriangle(0, 0, 40, 40, 0, 40);
        graphics.generateTexture('large-triangle', 40, 40);
        
        // Medium triangle (blue)
        graphics.clear();
        graphics.fillStyle(0x0000ff);
        graphics.fillTriangle(0, 0, 30, 30, 0, 30);
        graphics.generateTexture('medium-triangle', 30, 30);
        
        // Small triangle (green)
        graphics.clear();
        graphics.fillStyle(0x00ff00);
        graphics.fillTriangle(0, 0, 20, 20, 0, 20);
        graphics.generateTexture('small-triangle', 20, 20);
        
        // Square (yellow)
        graphics.clear();
        graphics.fillStyle(0xffff00);
        graphics.fillRect(0, 0, 30, 30);
        graphics.generateTexture('square', 30, 30);
        
        // Parallelogram (purple)
        graphics.clear();
        graphics.fillStyle(0x800080);
        graphics.beginPath();
        graphics.moveTo(10, 0);
        graphics.lineTo(40, 0);
        graphics.lineTo(30, 30);
        graphics.lineTo(0, 30);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('parallelogram', 40, 30);
        
        // Small square (orange)
        graphics.clear();
        graphics.fillStyle(0xffa500);
        graphics.fillRect(0, 0, 20, 20);
        graphics.generateTexture('small-square', 20, 20);
        
        // Trapezoid (cyan)
        graphics.clear();
        graphics.fillStyle(0x00ffff);
        graphics.beginPath();
        graphics.moveTo(5, 0);
        graphics.lineTo(35, 0);
        graphics.lineTo(40, 30);
        graphics.lineTo(0, 30);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('trapezoid', 40, 30);
        
        // Tower graphics
        graphics.clear();
        graphics.fillStyle(0xff0000);
        graphics.fillTriangle(0, 0, 40, 40, 0, 40);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeTriangle(0, 0, 40, 40, 0, 40);
        graphics.generateTexture('triangle-tower-1', 40, 40);
        
        graphics.clear();
        graphics.fillStyle(0xffff00);
        graphics.fillRect(0, 0, 30, 30);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(0, 0, 30, 30);
        graphics.generateTexture('square-tower-1', 30, 30);
        
        // Enemy
        graphics.clear();
        graphics.fillStyle(0xff0000);
        graphics.fillCircle(15, 15, 15);
        graphics.generateTexture('enemy', 30, 30);
        
        // Robot base and legs
        graphics.clear();
        graphics.fillStyle(0x8a5a3b);
        graphics.fillRect(0, 0, 250, 80); // Robot base body
        graphics.lineStyle(2, 0x654321);
        graphics.strokeRect(0, 0, 250, 80);
        graphics.fillStyle(0x555555);
        graphics.fillRect(20, 0, 210, 20); // Upper deck border
        graphics.generateTexture('robot-body', 250, 80);
        
        // Robot leg
        graphics.clear();
        graphics.fillStyle(0x555555);
        graphics.fillRect(0, 0, 15, 60);
        graphics.lineStyle(2, 0x333333);
        graphics.strokeRect(0, 0, 15, 60);
        graphics.generateTexture('robot-leg', 15, 60);
        
        // Robot foot
        graphics.clear();
        graphics.fillStyle(0x333333);
        graphics.fillRect(0, 0, 25, 10);
        graphics.lineStyle(1, 0x222222);
        graphics.strokeRect(0, 0, 25, 10);
        graphics.generateTexture('robot-foot', 25, 10);
        
        // Create ground tile
        graphics.clear();
        graphics.fillStyle(0x555555);
        graphics.fillRect(0, 0, 100, 30);
        graphics.lineStyle(1, 0x444444);
        graphics.strokeRect(0, 0, 100, 30);
        graphics.fillStyle(0x666666);
        graphics.fillRect(10, 5, 80, 20);
        graphics.generateTexture('ground-tile', 100, 30);
        
        // Robot Platform (deck)
        graphics.clear();
        graphics.fillStyle(0x8a5a3b);
        graphics.fillRect(0, 0, 250, 250);
        graphics.lineStyle(2, 0x654321);
        graphics.strokeRect(0, 0, 250, 250);
        graphics.generateTexture('robot-platform', 250, 250);
        
        // Bullet - enhance to make it more visible
        graphics.clear();
        graphics.fillStyle(0xffff00);
        graphics.fillCircle(8, 8, 8);
        // Add glow effect
        graphics.lineStyle(2, 0xffffaa);
        graphics.strokeCircle(8, 8, 8);
        // Generate a larger bullet texture
        graphics.generateTexture('bullet', 16, 16);
        
        // Large tangram (gold/laser tower - takes 4 squares)
        graphics.clear();
        graphics.fillStyle(0xffd700); // Gold color
        graphics.fillRect(0, 0, 60, 60);
        graphics.lineStyle(3, 0xffff00);
        graphics.strokeRect(0, 0, 60, 60);
        // Add some visual details to make it look special
        graphics.lineStyle(2, 0xffff00);
        graphics.beginPath();
        graphics.moveTo(10, 10);
        graphics.lineTo(50, 10);
        graphics.lineTo(50, 50);
        graphics.lineTo(10, 50);
        graphics.closePath();
        graphics.strokePath();
        graphics.generateTexture('large-square', 60, 60);
        
        // Laser tower
        graphics.clear();
        graphics.fillStyle(0xffd700);
        graphics.fillRect(0, 0, 60, 60);
        graphics.lineStyle(3, 0xffff00);
        graphics.strokeRect(0, 0, 60, 60);
        // Add center "lens" for laser
        graphics.fillStyle(0x00aaff);
        graphics.fillCircle(30, 30, 15);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeCircle(30, 30, 15);
        graphics.generateTexture('laser-tower-1', 60, 60);
        
        // Laser beam
        graphics.clear();
        graphics.fillStyle(0x00ffff);
        graphics.fillRect(0, 0, 800, 6);
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(0, 0, 800, 6);
        graphics.generateTexture('laser-beam', 800, 6);
    }

    create() {
        // Fixed camera, no need for bounds
        this.cameras.main.setBounds(0, 0, 800, 600);
        
        // Create scrolling background
        this.createScrollingBackground();
        
        // Create ground
        this.createGround();
        
        // Create robot with walking base
        this.createWalkingRobot();
        
        // Create UI elements
        this.createUI();
        
        // Add tangram shapes to inventory
        this.addTangramShapesToInventory();
        
        // Set up enemy spawning
        this.setupEnemySpawning();
        
        // Enable drag and drop for tangram shapes
        this.input.dragDistanceThreshold = 16;
        this.setupDragDropSystem();
    }

    createScrollingBackground() {
        // Parent container for all scrolling elements
        this.worldContainer = this.add.container(0, 0);
        
        // Simple background with parallax effect
        const background = this.add.rectangle(400, 300, 3000, 600, 0x444444);
        this.worldContainer.add(background);
        
        // Add some background elements for parallax effect
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(100, 2900);
            const y = Phaser.Math.Between(50, 200);
            const size = Phaser.Math.Between(20, 50);
            const circle = this.add.circle(x, y, size, 0x333333, 0.5);
            this.worldContainer.add(circle);
            this.worldElements.push({ sprite: circle, parallaxFactor: 0.8, initialX: x });
        }
    }
    
    createGround() {
        // Create ground tiles with more tiles to ensure smooth scrolling
        for (let x = -1000; x < 4000; x += 100) {
            const groundTile = this.add.sprite(x, this.groundLevel + 15, 'ground-tile');
            this.worldContainer.add(groundTile);
            this.worldElements.push({ sprite: groundTile, parallaxFactor: 1, initialX: x });
        }
    }
    
    createWalkingRobot() {
        // Center robot base position
        const robotX = 400; // Center of screen
        const robotY = this.groundLevel - 40; // Half the height of the robot body
        
        // Create robot body
        this.robotBody = this.add.sprite(robotX, robotY, 'robot-body');
        
        // Create 4 legs
        const legPositions = [
            { x: -100, y: 0 }, // Front left
            { x: -50, y: 0 },  // Front right
            { x: 50, y: 0 },   // Back left
            { x: 100, y: 0 }   // Back right
        ];
        
        for (let i = 0; i < 4; i++) {
            // Create leg
            const leg = this.add.sprite(
                this.robotBody.x + legPositions[i].x, 
                this.robotBody.y + 40, 
                'robot-leg'
            );
            leg.setOrigin(0.5, 0);
            
            // Create foot
            const foot = this.add.sprite(
                leg.x, 
                leg.y + 60, 
                'robot-foot'
            );
            foot.setOrigin(0.5, 0);
            
            // Store leg and foot references
            this.robotLegs.push({ leg, foot, phase: this.legPhases[i] });
        }
        
        // Create robot platform (deck) on top of the body
        this.robotDeckSprite = this.add.sprite(robotX, robotY - 125, 'robot-platform');
        this.robotDeckSprite.setAlpha(0.8);
        
        // Create 5x5 grid for robot deck relative to robot deck sprite
        this.createRobotDeck(robotX, robotY - 125);
    }

    createRobotDeck(deckX, deckY) {
        const cellSize = 40;
        
        // Create 5x5 grid for robot deck
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cellX = deckX - (cellSize * 2) + (col * cellSize);
                const cellY = deckY - (cellSize * 2) + (row * cellSize);
                
                const cell = this.add.rectangle(cellX, cellY, cellSize - 4, cellSize - 4, 0x555555, 0.5);
                cell.setStrokeStyle(1, 0x777777);
                cell.setData('gridPos', { row, col });
                cell.setData('occupied', false);
                
                this.robotDeck.push(cell);
            }
        }
    }
    
    createUI() {
        // Create UI container that stays fixed to camera
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setScrollFactor(0); // Fixed to camera
        
        // Steam cores display
        this.steamCoreText = this.add.text(50, 30, `Steam Cores: ${this.steamCores}`, {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff'
        });
        this.uiContainer.add(this.steamCoreText);
        
        // Wave number display
        this.waveText = this.add.text(50, 60, `Wave: ${this.waveNumber}`, {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff'
        });
        this.uiContainer.add(this.waveText);
        
        // Create inventory area (fixed to camera)
        const inventoryBg = this.add.rectangle(150, 500, 250, 100, 0x333333);
        inventoryBg.setAlpha(0.8);
        this.uiContainer.add(inventoryBg);
        
        const inventoryText = this.add.text(80, 460, 'Tangram Inventory:', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff'
        });
        this.uiContainer.add(inventoryText);
        
        // Instructions
        const instructions = this.add.text(400, 50, 'Drag tangrams to the robot deck\nMerge identical shapes to create towers', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this.uiContainer.add(instructions);
    }
    
    addTangramShapesToInventory() {
        const shapes = [
            { key: 'large-triangle', x: 80, y: 500, type: 'large-triangle' },
            { key: 'square', x: 130, y: 500, type: 'square' },
            { key: 'parallelogram', x: 180, y: 500, type: 'parallelogram' },
            { key: 'small-triangle', x: 230, y: 500, type: 'small-triangle' },
            { key: 'large-square', x: 280, y: 500, type: 'large-square', cost: 25 } // New large tangram
        ];
        
        shapes.forEach(shape => {
            const tangramSprite = this.add.sprite(shape.x, shape.y, shape.key)
                .setInteractive({ draggable: true })
                .setScale(0.8);
            
            tangramSprite.setData('type', shape.type);
            tangramSprite.setData('cost', shape.cost || 10);
            tangramSprite.setData('size', shape.type === 'large-square' ? 2 : 1); // Size in grid units
            tangramSprite.setScrollFactor(0); // Fixed to camera
            
            this.tangramShapes.push(tangramSprite);
            this.uiContainer.add(tangramSprite);
        });
        
        // Update inventory background to fit new shape
        this.uiContainer.getAt(0).setPosition(175, 500).setDisplaySize(300, 100);
    }

    setupDragDropSystem() {
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
            gameObject.setTint(0xaaaaaa);
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
            
            // Check if tangram is from inventory or already on deck
            const isFromInventory = this.tangramShapes.includes(gameObject);
            
            // Check if dropped on a valid deck cell
            const targetCell = this.findTargetCell(gameObject);
            if (targetCell && !targetCell.getData('occupied')) {
                if (isFromInventory) {
                    // Place tangram from inventory to deck
                    this.placeTangramOnDeck(gameObject, targetCell);
                } else {
                    // Move tangram already on deck to new position
                    this.moveTangramOnDeck(gameObject, targetCell);
                }
            } else {
                // Return to original position
                if (isFromInventory) {
                    this.returnToInventory(gameObject);
                } else {
                    // Return to original cell
                    const originalGridPos = gameObject.getData('gridPos');
                    const originalCell = this.getCellAt(originalGridPos.row, originalGridPos.col);
                    if (originalCell) {
                        gameObject.x = originalCell.x;
                        gameObject.y = originalCell.y;
                    }
                }
            }
        });
    }

    findTargetCell(gameObject) {
        for (const cell of this.robotDeck) {
            const cellBounds = cell.getBounds();
            const objectBounds = gameObject.getBounds();
            
            if (Phaser.Geom.Rectangle.Overlaps(cellBounds, objectBounds)) {
                return cell;
            }
        }
        return null;
    }

    placeTangramOnDeck(tangramObject, targetCell) {
        const type = tangramObject.getData('type');
        const cost = tangramObject.getData('cost');
        const size = tangramObject.getData('size') || 1;
        
        // For 2x2 tangrams, check if there's space available
        if (size > 1) {
            const targetPos = targetCell.getData('gridPos');
            const isSpaceAvailable = this.checkSpaceForLargeTangram(targetPos.row, targetPos.col, size);
            
            if (!isSpaceAvailable) {
                this.showMessage("Not enough space for large tangram!");
                this.returnToInventory(tangramObject);
                return;
            }
        }
        
        if (this.steamCores >= cost) {
            // Deduct cost
            this.steamCores -= cost;
            this.steamCoreText.setText(`Steam Cores: ${this.steamCores}`);
            
            // Place on deck
            const newTangram = this.add.sprite(targetCell.x, targetCell.y, tangramObject.texture.key)
                .setScale(size === 2 ? 1.4 : 0.7) // Larger scale for 2x2 tangram
                .setInteractive({ draggable: true });
            
            newTangram.setData('type', type);
            newTangram.setData('size', size);
            newTangram.setData('onDeck', true);
            newTangram.setData('gridPos', targetCell.getData('gridPos'));
            
            // Mark cells as occupied
            if (size === 1) {
                // Regular tangram
                targetCell.setData('occupied', true);
                targetCell.setData('occupiedBy', newTangram);
            } else {
                // Large tangram - occupy all 4 cells
                this.occupyCellsForLargeTangram(targetCell.getData('gridPos').row, targetCell.getData('gridPos').col, newTangram);
            }
            
            // Check for merges
            this.checkForMerges(newTangram, targetCell);
        } else {
            // Not enough resources
            this.showMessage("Not enough Steam Cores!");
            this.returnToInventory(tangramObject);
        }
    }

    checkSpaceForLargeTangram(row, col, size) {
        // For a 2x2 tangram, check all 4 cells
        for (let r = row; r < row + size; r++) {
            for (let c = col; c < col + size; c++) {
                const cell = this.getCellAt(r, c);
                if (!cell || cell.getData('occupied')) {
                    return false;
                }
            }
        }
        return true;
    }

    occupyCellsForLargeTangram(row, col, tangramSprite) {
        // For a 2x2 tangram, occupy all 4 cells
        for (let r = row; r < row + 2; r++) {
            for (let c = col; c < col + 2; c++) {
                const cell = this.getCellAt(r, c);
                if (cell) {
                    cell.setData('occupied', true);
                    cell.setData('occupiedBy', tangramSprite);
                    // Only the original cell is the "primary" cell
                    cell.setData('isPrimary', r === row && c === col);
                }
            }
        }
    }

    moveTangramOnDeck(tangramObject, targetCell) {
        const size = tangramObject.getData('size') || 1;
        
        // For large tangrams, check if there's space available
        if (size > 1) {
            const targetPos = targetCell.getData('gridPos');
            const isSpaceAvailable = this.checkSpaceForLargeTangram(targetPos.row, targetPos.col, size);
            
            if (!isSpaceAvailable) {
                this.showMessage("Not enough space for large tangram!");
                
                // Return to original position
                const originalGridPos = tangramObject.getData('gridPos');
                const originalCell = this.getCellAt(originalGridPos.row, originalGridPos.col);
                if (originalCell) {
                    tangramObject.x = originalCell.x;
                    tangramObject.y = originalCell.y;
                }
                return;
            }
        }
        
        // Get original cell and clear occupied status
        const originalGridPos = tangramObject.getData('gridPos');
        
        if (size === 1) {
            // For regular tangram, just clear one cell
            const originalCell = this.getCellAt(originalGridPos.row, originalGridPos.col);
            if (originalCell) {
                originalCell.setData('occupied', false);
                originalCell.setData('occupiedBy', null);
            }
        } else {
            // For large tangram, clear all occupied cells
            for (let r = originalGridPos.row; r < originalGridPos.row + size; r++) {
                for (let c = originalGridPos.col; c < originalGridPos.col + size; c++) {
                    const cell = this.getCellAt(r, c);
                    if (cell) {
                        cell.setData('occupied', false);
                        cell.setData('occupiedBy', null);
                        cell.setData('isPrimary', false);
                    }
                }
            }
        }
        
        // Update position
        tangramObject.x = targetCell.x;
        tangramObject.y = targetCell.y;
        tangramObject.setData('gridPos', targetCell.getData('gridPos'));
        
        // Update cell data for new position
        if (size === 1) {
            targetCell.setData('occupied', true);
            targetCell.setData('occupiedBy', tangramObject);
        } else {
            this.occupyCellsForLargeTangram(targetCell.getData('gridPos').row, targetCell.getData('gridPos').col, tangramObject);
        }
        
        // Check for merges
        this.checkForMerges(tangramObject, targetCell);
    }

    returnToInventory(gameObject) {
        const type = gameObject.getData('type');
        let targetX = 100;
        
        switch (type) {
            case 'large-triangle': targetX = 80; break;
            case 'square': targetX = 130; break;
            case 'parallelogram': targetX = 180; break;
            case 'small-triangle': targetX = 230; break;
            case 'large-square': targetX = 280; break;
            default: targetX = 80;
        }
        
        gameObject.x = targetX;
        gameObject.y = 500;
    }
    
    setupEnemySpawning() {
        // Start first wave immediately
        this.spawnEnemyWave();
        
        // Create a continuous spawning system with increasing difficulty
        this.time.addEvent({
            delay: 500, // Check every 500ms for spawning
            callback: this.manageEnemySpawning,
            callbackScope: this,
            loop: true
        });
        
        // Set up difficulty scaling over time
        this.time.addEvent({
            delay: 30000, // Every 30 seconds
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemyWave() {
        this.waveText.setText(`Wave: ${this.waveNumber}`);
        
        // Determine number of enemies for this wave - increased for more challenge
        const waveEnemyCount = this.enemiesPerWave + Math.floor(this.waveNumber * 2); // Increased multiplier from 1.5 to 2
        
        // Create batches of enemies with formation patterns
        const formations = ['line', 'cluster', 'zigzag'];
        const formation = formations[Math.floor(Math.random() * formations.length)];
        
        // Special treatment for milestone waves (every 5th wave)
        if (this.waveNumber % 5 === 0) {
            // Boss wave
            this.spawnBossWave(waveEnemyCount);
        } else {
            // Regular wave with selected formation
            this.spawnFormation(formation, waveEnemyCount);
        }
        
        // Show wave notification with enhanced visuals
        this.showEnhancedWaveNotification();
        
        // Award bonus steam cores for reaching a new wave
        this.steamCores += Math.floor(this.waveNumber * 1.5);
        this.steamCoreText.setText(`Steam Cores: ${this.steamCores}`);
    }

    // New method to spawn enemies in various formations
    spawnFormation(formationType, count) {
        switch (formationType) {
            case 'line':
                // Enemies in a horizontal line
                for (let i = 0; i < count; i++) {
                    this.time.delayedCall(i * 200, () => {
                        // Choose a random enemy type with weighted probabilities based on wave number
                        let enemyType = this.getRandomEnemyTypeForWave();
                        
                        // Spawn at same X position but varied Y positions
                        const x = 900 + Phaser.Math.Between(0, 100);
                        const y = 200 + (i * 400 / count);
                        this.spawnEnemyAt(enemyType, x, y);
                    });
                }
                break;
                
            case 'cluster':
                // Enemies in tight clusters
                const clusterCount = Math.min(3, Math.floor(count / 3));
                for (let c = 0; c < clusterCount; c++) {
                    const baseX = 900 + Phaser.Math.Between(0, 300);
                    const baseY = 200 + Phaser.Math.Between(0, 200);
                    
                    const enemiesPerCluster = Math.floor(count / clusterCount);
                    
                    for (let i = 0; i < enemiesPerCluster; i++) {
                        this.time.delayedCall(c * 500 + i * 100, () => {
                            let enemyType = this.getRandomEnemyTypeForWave();
                            const offsetX = Phaser.Math.Between(-30, 30);
                            const offsetY = Phaser.Math.Between(-30, 30);
                            this.spawnEnemyAt(enemyType, baseX + offsetX, baseY + offsetY);
                        });
                    }
                }
                break;
                
            case 'zigzag':
                // Enemies in a zigzag pattern
                for (let i = 0; i < count; i++) {
                    this.time.delayedCall(i * 200, () => {
                        let enemyType = this.getRandomEnemyTypeForWave();
                        const x = 900 + (i * 50);
                        const y = 300 + (Math.sin(i * 0.5) * 100);
                        this.spawnEnemyAt(enemyType, x, y);
                    });
                }
                break;
        }
    }

    // New method to spawn a boss wave
    spawnBossWave(count) {
        // Create a boss enemy (supersized heavy enemy)
        const bossX = 1000;
        const bossY = 300;
        const boss = this.add.sprite(bossX, bossY, 'enemy').setScale(2.0);
        
        // Set boss properties with much higher health
        boss.setTint(0xff0000);
        boss.setData('type', 'boss');
        boss.setData('health', 250 + (this.waveNumber * 20));
        boss.setData('maxHealth', 250 + (this.waveNumber * 20));
        boss.setData('speed', 30 + (this.waveNumber * 0.5));
        boss.setData('reward', 30);
        
        // Add boss health bar (wider than normal enemies)
        const width = 80;
        const height = 6;
        const healthBarBg = this.add.rectangle(boss.x, boss.y - 50, width, height, 0x000000);
        const healthBar = this.add.rectangle(boss.x - width/2, boss.y - 50, width, height, 0xff0000);
        healthBar.setOrigin(0, 0.5);
        
        boss.setData('healthBar', healthBar);
        boss.setData('healthBarBg', healthBarBg);
        
        // Add boss to world container
        this.worldContainer.add(boss);
        this.worldContainer.add(healthBarBg);
        this.worldContainer.add(healthBar);
        
        this.enemies.push(boss);
        
        // Show boss wave notification
        this.showBossWaveNotification();
        
        // Spawn minions around the boss
        const minionsCount = count - 1;
        for (let i = 0; i < minionsCount; i++) {
            this.time.delayedCall(1000 + i * 300, () => {
                // Choose appropriate minion type
                let minionType = 'fast'; // Default
                if (i % 3 === 0) minionType = 'swarm';
                else if (i % 3 === 1) minionType = 'heavy';
                
                const angle = (i / minionsCount) * Math.PI * 2;
                const radius = Phaser.Math.Between(100, 200);
                const x = bossX + Math.cos(angle) * radius;
                const y = bossY + Math.sin(angle) * radius;
                
                this.spawnEnemyAt(minionType, x, y);
            });
        }
    }

    // Helper method to get a random enemy type based on current wave
    getRandomEnemyTypeForWave() {
        const rand = Math.random();
        
        if (this.waveNumber >= 8) {
            // Late game - high chance of special enemies
            if (rand > 0.7) return 'swarm';
            else if (rand > 0.4) return 'fast';
            else if (rand > 0.1) return 'heavy';
            return 'normal';
        } else if (this.waveNumber >= 5) {
            if (rand > 0.8) return 'swarm';
            else if (rand > 0.5) return 'fast';
            else if (rand > 0.2) return 'heavy';
            return 'normal';
        } else if (this.waveNumber >= 3) {
            if (rand > 0.8) return 'fast';
            else if (rand > 0.6) return 'heavy';
            return 'normal';
        }
        
        return 'normal';
    }

    // Enhanced wave notification
    showEnhancedWaveNotification() {
        // Create wave notification text with more dramatic styling
        const notification = this.add.text(400, 100, `WAVE ${this.waveNumber}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        const subtext = this.add.text(400, 150, `INCOMING!`, {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        notification.setScrollFactor(0); // Fixed to camera
        subtext.setScrollFactor(0);
        
        // Animate the notification
        this.tweens.add({
            targets: notification,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.tweens.add({
                    targets: [notification, subtext],
                    alpha: 0,
                    y: '-=50',
                    duration: 800,
                    onComplete: () => {
                        notification.destroy();
                        subtext.destroy();
                    }
                });
            }
        });
        
        // Add screen shake effect
        this.cameras.main.shake(300, 0.005);
    }

    // Special notification for boss waves
    showBossWaveNotification() {
        // Play warning sound (would be added if we had audio)
        
        // Create boss wave notification with dramatic styling
        const notification = this.add.text(400, 100, `BOSS WAVE`, {
            fontFamily: 'Arial',
            fontSize: 64,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        
        const subtext = this.add.text(400, 170, `PREPARE FOR BATTLE!`, {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        notification.setScrollFactor(0);
        subtext.setScrollFactor(0);
        
        // Add dramatic flash
        const flash = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.3);
        flash.setScrollFactor(0);
        flash.setDepth(100);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 800
        });
        
        // Animate the notification
        this.tweens.add({
            targets: notification,
            scaleX: [0.8, 1.2, 1.0],
            scaleY: [0.8, 1.2, 1.0],
            duration: 800,
            onComplete: () => {
                // Pulsing effect
                this.tweens.add({
                    targets: notification,
                    alpha: 0.7,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 500,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        this.tweens.add({
                            targets: [notification, subtext, flash],
                            alpha: 0,
                            duration: 800,
                            onComplete: () => {
                                notification.destroy();
                                subtext.destroy();
                                flash.destroy();
                            }
                        });
                    }
                });
            }
        });
        
        // Add stronger screen shake effect
        this.cameras.main.shake(500, 0.01);
    }

    manageEnemySpawning() {
        // If we don't have too many enemies yet, spawn more
        if (this.enemies.length < this.maxConcurrentEnemies) {
            this.enemySpawnTimer += 500;
            
            if (this.enemySpawnTimer >= this.enemySpawnRate) {
                this.enemySpawnTimer = 0;
                
                // Spawn multiple enemies more frequently
                if (this.spawnMultipleEnabled && Math.random() < 0.5) { // Increased probability from 0.3 to 0.5
                    // Spawn 3-5 enemies at once (increased from 2-4)
                    const spawnCount = Phaser.Math.Between(3, 5);
                    for (let i = 0; i < spawnCount; i++) {
                        // Slightly delay each spawn
                        this.time.delayedCall(i * 100, () => {
                            if (this.enemies.length < this.maxConcurrentEnemies) {
                                // Choose enemy type with weighted probability
                                this.spawnRandomEnemy();
                            }
                        });
                    }
                } else {
                    this.spawnRandomEnemy();
                }
            }
            
            // Handle wave spawning
            this.waveTimer += 500;
            if (this.waveTimer >= this.waveDelay) {
                this.waveTimer = 0;
                this.waveNumber++;
                this.spawnEnemyWave();
            }
        }
    }

    spawnRandomEnemy() {
        // Choose enemy type with weighted probability
        const rand = Math.random();
        let enemyType = 'normal';
        
        if (this.waveNumber >= 5) {
            // Later waves have more varied enemy types
            if (rand > 0.85) enemyType = 'swarm';
            else if (rand > 0.6) enemyType = 'fast';
            else if (rand > 0.3) enemyType = 'heavy';
        } else if (this.waveNumber >= 3) {
            if (rand > 0.85) enemyType = 'swarm';
            else if (rand > 0.7) enemyType = 'fast';
            else if (rand > 0.5) enemyType = 'heavy';
        } else if (this.waveNumber >= 2) {
            if (rand > 0.8) enemyType = 'fast';
        }
        
        this.spawnEnemy(enemyType);
    }

    increaseDifficulty() {
        // Increase enemies per wave (up to 40)
        this.enemiesPerWave = Math.min(40, this.enemiesPerWave + 3); // Increased max and increment
        
        // Decrease spawn rate (faster spawning, down to 400ms)
        this.enemySpawnRate = Math.max(400, this.enemySpawnRate - 100); // Decreased minimum from 500 to 400
        
        // Decrease wave delay (more frequent waves, down to 2500ms)
        this.waveDelay = Math.max(2500, this.waveDelay - 500); // Decreased minimum from 3000 to 2500
        
        // Increase max concurrent enemies (up to 60)
        this.maxConcurrentEnemies = Math.min(60, this.maxConcurrentEnemies + 5); // Increased max from 50 to 60
        
        // Add visual feedback for difficulty increase
        this.showDifficultyIncreaseEffect();
        
        // Log difficulty increase to console
        console.log(`Difficulty increased! Wave: ${this.waveNumber}, Enemies per wave: ${this.enemiesPerWave}, Spawn rate: ${this.enemySpawnRate}ms`);
    }

    // Add a new method to show visual feedback for difficulty increase
    showDifficultyIncreaseEffect() {
        // Create a difficulty increase notification
        const notification = this.add.text(400, 150, `DIFFICULTY INCREASED!`, {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        notification.setScrollFactor(0); // Fixed to camera
        
        // Animate the notification
        this.tweens.add({
            targets: notification,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 200,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.tweens.add({
                    targets: notification,
                    alpha: 0,
                    y: 120,
                    duration: 600,
                    onComplete: () => {
                        notification.destroy();
                    }
                });
            }
        });
        
        // Add a brief screen flash effect
        const flash = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.2);
        flash.setScrollFactor(0);
        flash.setDepth(100);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    checkForMerges(newTangram, targetCell) {
        const type = newTangram.getData('type');
        const pos = targetCell.getData('gridPos');
        let matchFound = false;
        
        // Check adjacent cells for matching tangram types
        const adjacentPositions = [
            { row: pos.row - 1, col: pos.col }, // Up
            { row: pos.row + 1, col: pos.col }, // Down
            { row: pos.row, col: pos.col - 1 }, // Left
            { row: pos.row, col: pos.col + 1 }  // Right
        ];
        
        for (const adjacentPos of adjacentPositions) {
            const adjacentCell = this.getCellAt(adjacentPos.row, adjacentPos.col);
            
            if (adjacentCell && adjacentCell.getData('occupied')) {
                const occupyingObject = adjacentCell.getData('occupiedBy');
                
                if (occupyingObject && occupyingObject.getData('type') === type) {
                    // Found a match! Create a tower or upgrade existing tower
                    if (occupyingObject.getData('isTower')) {
                        // Upgrade tower if it's already a tower
                        this.upgradeTower(occupyingObject, newTangram, targetCell, adjacentCell);
                    } else {
                        // Create a new tower from two tangrams
                        this.mergeTangramsIntoTower(newTangram, occupyingObject, targetCell, adjacentCell);
                    }
                    matchFound = true;
                    break;
                }
            }
        }
        
        return matchFound;
    }

    getCellAt(row, col) {
        if (row < 0 || row >= 5 || col < 0 || col >= 5) return null;
        
        for (const cell of this.robotDeck) {
            const cellPos = cell.getData('gridPos');
            if (cellPos.row === row && cellPos.col === col) {
                return cell;
            }
        }
        
        return null;
    }

    mergeTangramsIntoTower(tangram1, tangram2, cell1, cell2) {
        const type = tangram1.getData('type');
        
        // Remove original tangrams
        tangram1.destroy();
        tangram2.destroy();
        
        // Clear occupied status
        cell1.setData('occupied', false);
        cell1.setData('occupiedBy', null);
        cell2.setData('occupied', false);
        cell2.setData('occupiedBy', null);
        
        // Clear additional cells for large tangram
        if (type === 'large-square') {
            const pos = cell1.getData('gridPos');
            for (let r = pos.row; r < pos.row + 2; r++) {
                for (let c = pos.col; c < pos.col + 2; c++) {
                    const additionalCell = this.getCellAt(r, c);
                    if (additionalCell && r !== pos.row && c !== pos.col) {
                        additionalCell.setData('occupied', false);
                        additionalCell.setData('occupiedBy', null);
                        additionalCell.setData('isPrimary', false);
                    }
                }
            }
        }
        
        // Create tower on first cell
        let towerType, damage, range, fireRate, isLaser = false;
        
        switch (type) {
            case 'large-square':
                towerType = 'laser-tower-1';
                damage = 40;
                range = 400;
                fireRate = 3000;
                isLaser = true;
                break;
            case 'large-triangle':
                towerType = 'triangle-tower-1';
                damage = 15;
                range = 180;
                fireRate = 1500;
                break;
            case 'square':
                towerType = 'square-tower-1';
                damage = 10;
                range = 120;
                fireRate = 1000;
                break;
            case 'parallelogram':
                towerType = 'parallelogram-tower-1';
                damage = 5;
                range = 100;
                fireRate = 800;
                break;
            case 'small-triangle':
                towerType = 'small-triangle-tower-1';
                damage = 8;
                range = 150;
                fireRate = 1200;
                break;
            default:
                towerType = 'triangle-tower-1';
                damage = 10;
                range = 150;
                fireRate = 1000;
        }
        
        const tower = this.add.sprite(cell1.x, cell1.y, towerType || type)
            .setScale(type === 'large-square' ? 1.4 : 0.8)
            .setInteractive({ draggable: true });
        
        tower.setData('type', type);
        tower.setData('level', 1);
        tower.setData('damage', damage);
        tower.setData('range', range);
        tower.setData('fireRate', fireRate);
        tower.setData('lastFired', 0);
        tower.setData('isTower', true);
        tower.setData('isLaser', isLaser);
        tower.setData('gridPos', cell1.getData('gridPos'));
        tower.setData('laserActive', false);
        
        // Mark cell as occupied
        cell1.setData('occupied', true);
        cell1.setData('occupiedBy', tower);
        
        // Add tower to tracking array
        this.towers.push(tower);
        
        // Show merge effect
        this.showMergeEffect(cell1.x, cell1.y);
        
        // Add level indicator
        this.addLevelIndicator(tower);
        
        return tower;
    }

    upgradeTower(tower, tangram, towerCell, tangramCell) {
        // Increase tower level
        const currentLevel = tower.getData('level');
        const newLevel = currentLevel + 1;
        
        if (newLevel <= 5) { // Max level 5
            // Remove the tangram
            tangram.destroy();
            tangramCell.setData('occupied', false);
            tangramCell.setData('occupiedBy', null);
            
            // Update tower stats
            tower.setData('level', newLevel);
            tower.setData('damage', tower.getData('damage') * 1.5);
            tower.setData('range', tower.getData('range') * 1.2);
            tower.setData('fireRate', tower.getData('fireRate') * 0.8);
            
            // Scale the tower to indicate higher level
            tower.setScale(0.8 + (newLevel * 0.05));
            
            // Update level indicator
            this.updateLevelIndicator(tower);
            
            // Show upgrade effect
            this.showUpgradeEffect(tower.x, tower.y);
            
            // Award some cores for upgrading
            this.steamCores += 5;
            this.steamCoreText.setText(`Steam Cores: ${this.steamCores}`);
        } else {
            this.showMessage("Tower already at max level!");
        }
    }

    addLevelIndicator(tower) {
        const level = tower.getData('level');
        const levelText = this.add.text(tower.x, tower.y + 20, `Lvl ${level}`, {
            fontFamily: 'Arial',
            fontSize: 10,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        tower.setData('levelIndicator', levelText);
    }

    updateLevelIndicator(tower) {
        const level = tower.getData('level');
        const levelIndicator = tower.getData('levelIndicator');
        
        if (levelIndicator) {
            levelIndicator.setText(`Lvl ${level}`);
        }
    }

    showMergeEffect(x, y) {
        const particles = this.add.particles('square');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            tint: 0xffaa00,
            lifespan: 500,
            quantity: 20
        });
        
        emitter.explode();
        
        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    showUpgradeEffect(x, y) {
        const particles = this.add.particles('square');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            tint: 0x00ffff,
            lifespan: 800,
            quantity: 30
        });
        
        emitter.explode();
        
        this.time.delayedCall(800, () => {
            particles.destroy();
        });
    }

    showMessage(text) {
        const message = this.add.text(400, 200, text, {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            message.destroy();
        });
    }

    update(time, delta) {
        // Scroll the world instead of moving robot
        this.scrollWorld(delta);
        
        // Animate robot legs (walking in place)
        this.animateRobotLegs(time);
        
        // Update enemy movement
        this.updateEnemies(delta);
        
        // Update tower targeting and attacks
        this.updateTowers(time);
        
        // Handle active lasers
        this.updateLasers();
    }
    
    scrollWorld(delta) {
        // Calculate scroll amount
        const scrollAmount = (this.worldScrollSpeed * delta) / 1000;
        
        // Update world position tracker
        this.worldPosition += scrollAmount;
        
        // Move all world elements
        this.worldContainer.x -= scrollAmount;
        
        // Apply different parallax factors to world elements
        for (const element of this.worldElements) {
            const parallaxOffset = scrollAmount * element.parallaxFactor;
            element.sprite.x -= parallaxOffset - scrollAmount; // Adjust for container movement
        }
        
        // Check if we need to spawn more ground tiles or remove far-away ones
        this.manageWorldTiles();
        
        // Cleanup enemies that are far behind
        this.cleanupOffscreenEnemies();
    }
    
    manageWorldTiles() {
        // Check if we need to spawn more ground tiles to the right
        const rightmostGroundX = 4000 + this.worldContainer.x;
        if (rightmostGroundX < 1200) {
            this.addMoreGroundTiles();
        }
        
        // Remove tiles that are far behind (optimization)
        for (let i = this.worldElements.length - 1; i >= 0; i--) {
            const element = this.worldElements[i];
            const worldX = element.sprite.x + this.worldContainer.x;
            
            if (worldX < -500) {
                element.sprite.destroy();
                this.worldElements.splice(i, 1);
            }
        }
    }
    
    addMoreGroundTiles() {
        // Add more ground tiles to the right
        for (let x = 4000; x < 5000; x += 100) {
            const groundTile = this.add.sprite(x, this.groundLevel + 15, 'ground-tile');
            this.worldContainer.add(groundTile);
            this.worldElements.push({ sprite: groundTile, parallaxFactor: 1, initialX: x });
        }
    }
    
    cleanupOffscreenEnemies() {
        // Remove enemies that are far off screen to the left
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const worldX = enemy.x + this.worldContainer.x;
            
            if (worldX < -200) {
                const healthBar = enemy.getData('healthBar');
                const healthBarBg = enemy.getData('healthBarBg');
                
                if (healthBar) healthBar.destroy();
                if (healthBarBg) healthBarBg.destroy();
                
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }
    
    animateRobotLegs(time) {
        // Time-based leg animation
        const timeSeconds = time / 1000;
        const stepFrequency = 1; // Steps per second
        
        // Add occasional steam puff
        if (Math.random() < 0.02) {
            this.createSteamPuff(
                this.robotBody.x + Phaser.Math.Between(-100, 100),
                this.robotBody.y + Phaser.Math.Between(-20, 40)
            );
        }
        
        for (let i = 0; i < this.robotLegs.length; i++) {
            const legObj = this.robotLegs[i];
            const phase = legObj.phase;
            
            // Calculate leg position in the walking cycle
            const cyclePosition = (timeSeconds * stepFrequency + phase) % 1;
            
            // Leg movement (up-down and forward-back)
            let footY = this.groundLevel;
            let legAngle = 0;
            
            if (cyclePosition < 0.5) {
                // Leg is in the air (moving forward)
                const liftFactor = Math.sin(cyclePosition * Math.PI);
                footY = this.groundLevel - 15 * liftFactor;
                legAngle = -0.2 + (0.4 * cyclePosition * 2); // Swing forward
                
                // Add dust effect when foot hits ground near end of forward swing
                if (cyclePosition > 0.4 && cyclePosition < 0.45) {
                    this.createDustEffect(legObj.foot.x, this.groundLevel);
                }
            } else {
                // Leg is on the ground (moving backward)
                legAngle = 0.2 - (0.4 * (cyclePosition - 0.5) * 2); // Swing backward
                
                // Add small bounce to robot body on step
                if (cyclePosition > 0.7 && cyclePosition < 0.75) {
                    this.robotBody.y = this.groundLevel - 40 - Math.sin((cyclePosition - 0.7) * 5 * Math.PI) * 2;
                    this.robotDeckSprite.y = this.robotBody.y - 125;
                } else if (cyclePosition > 0.9) {
                    // Reset body height
                    this.robotBody.y = this.groundLevel - 40;
                    this.robotDeckSprite.y = this.robotBody.y - 125;
                }
            }
            
            // Apply leg angle
            legObj.leg.setRotation(legAngle);
            
            // Calculate foot position based on leg angle
            const legLength = 60;
            const footOffsetX = Math.sin(legAngle) * legLength;
            const footOffsetY = Math.cos(legAngle) * legLength;
            
            // Set foot position
            legObj.foot.x = legObj.leg.x + footOffsetX;
            legObj.foot.y = footY;
        }
    }
    
    createSteamPuff(x, y) {
        const particles = this.add.particles('square');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 10, max: 50 },
            angle: { min: 270, max: 360 },
            scale: { start: 0.1, end: 0.5 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xffffff,
            lifespan: 1000,
            frequency: 50,
            quantity: 5
        });
        
        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }
    
    createDustEffect(x, y) {
        const particles = this.add.particles('square');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 5, max: 20 },
            angle: { min: 230, max: 310 },
            scale: { start: 0.1, end: 0 },
            tint: 0xaaaaaa,
            lifespan: 500,
            quantity: 5
        });
        
        this.time.delayedCall(300, () => {
            particles.destroy();
        });
    }
    
    updateEnemies(delta) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move enemy towards robot (relative movement now handled by world scrolling)
            // Just add additional enemy-specific movement
            enemy.x -= (enemy.getData('speed') * delta) / 1000;
            
            // Update health bar position
            const healthBar = enemy.getData('healthBar');
            const healthBarBg = enemy.getData('healthBarBg');
            if (healthBar && healthBarBg) {
                healthBarBg.x = enemy.x;
                healthBarBg.y = enemy.y - 20;
                
                healthBar.x = enemy.x - healthBar.width / 2;
                healthBar.y = enemy.y - 20;
                
                // Update health bar width
                const healthPercent = enemy.getData('health') / enemy.getData('maxHealth');
                healthBar.width = 30 * healthPercent;
                
                // Update health bar color based on percentage
                if (healthPercent < 0.3) {
                    healthBar.fillColor = 0xff0000; // Red when low health
                } else if (healthPercent < 0.6) {
                    healthBar.fillColor = 0xffff00; // Yellow when medium health
                }
            }
            
            // Check if enemy reached the robot
            if (enemy.x < this.robotBody.x - this.worldContainer.x) {
                // Destroy health bars
                if (healthBar) healthBar.destroy();
                if (healthBarBg) healthBarBg.destroy();
                
                // Destroy enemy
                enemy.destroy();
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Check if enemy is dead
            if (enemy.getData('health') <= 0) {
                // Award steam cores based on enemy type
                const reward = enemy.getData('reward') || 5;
                this.steamCores += reward;
                this.steamCoreText.setText(`Steam Cores: ${this.steamCores}`);
                
                // Show reward popup
                this.showRewardPopup(enemy.x + this.worldContainer.x, enemy.y, reward);
                
                // Create death effect based on enemy type
                this.createEnemyDeathEffect(enemy);
                
                // Destroy health bars
                if (healthBar) healthBar.destroy();
                if (healthBarBg) healthBarBg.destroy();
                
                // Destroy enemy
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    showRewardPopup(x, y, amount) {
        const text = this.add.text(x, y - 20, `+${amount}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                text.destroy();
            }
        });
    }

    createEnemyDeathEffect(enemy) {
        const enemyType = enemy.getData('type');
        let color, particleCount, explosionSize;
        
        switch(enemyType) {
            case 'fast':
                color = 0x00ffff;
                particleCount = 15;
                explosionSize = 0.8;
                break;
            case 'heavy':
                color = 0xff6600;
                particleCount = 25;
                explosionSize = 1.2;
                break;
            default: // normal
                color = 0xff0000;
                particleCount = 20;
                explosionSize = 1.0;
        }
        
        // Create explosion effect
        const particles = this.add.particles('square');
        const emitter = particles.createEmitter({
            x: enemy.x,
            y: enemy.y,
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4 * explosionSize, end: 0 },
            tint: color,
            lifespan: 600,
            quantity: particleCount,
            blendMode: 'ADD'
        });
        
        this.worldContainer.add(particles);
        emitter.explode();
        
        this.time.delayedCall(600, () => {
            particles.destroy();
        });
    }

    updateTowers(time) {
        for (const tower of this.towers) {
            // Find enemies in range
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of this.enemies) {
                const distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x + this.worldContainer.x, enemy.y);
                
                if (distance < tower.getData('range') && distance < closestDistance) {
                    closestEnemy = enemy;
                    closestDistance = distance;
                }
            }
            
            // Attack closest enemy
            if (closestEnemy) {
                const lastFired = tower.getData('lastFired');
                const fireRate = tower.getData('fireRate');
                
                if (time > lastFired + fireRate) {
                    this.attackEnemy(tower, closestEnemy, time);
                }
            }
        }
    }

    attackEnemy(tower, enemy, time) {
        // Update last fired time
        tower.setData('lastFired', time);
        
        // Add tower flash effect when firing
        this.showTowerFireEffect(tower);
        
        // Deal damage
        const damage = tower.getData('damage');
        const health = enemy.getData('health') - damage;
        enemy.setData('health', health);
        
        // Fire weapon based on tower type
        if (tower.getData('isLaser')) {
            this.fireLaser(tower, enemy, time);
        } else {
            // Regular bullet attack
            this.fireBullet(tower, enemy);
        }
    }

    showTowerFireEffect(tower) {
        // Flash the tower when firing
        this.tweens.add({
            targets: tower,
            alpha: 0.7,
            duration: 50,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                tower.alpha = 1;
            }
        });
        
        // Add muzzle flash effect
        const flash = this.add.sprite(tower.x, tower.y, 'bullet');
        flash.setScale(1.2);
        flash.setAlpha(0.8);
        flash.setTint(0xffffaa);
        flash.setBlendMode(Phaser.BlendModes.ADD);
        
        this.tweens.add({
            targets: flash,
            scale: 0.1,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    fireBullet(tower, enemy) {
        // Create bullet and add it to the scene outside of the world container
        const bullet = this.add.sprite(tower.x, tower.y, 'bullet');
        
        // Make the bullet larger and more visible
        bullet.setScale(1.5);
        
        // Add a glow effect
        bullet.setTint(0xffff00);
        
        // Set proper depth to ensure it appears above other elements
        bullet.setDepth(10);
        
        // Set bullet data
        const angle = Phaser.Math.Angle.Between(tower.x, tower.y, enemy.x + this.worldContainer.x, enemy.y);
        bullet.rotation = angle;
        
        // Calculate target position with world scrolling compensation
        const distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x + this.worldContainer.x, enemy.y);
        const duration = distance / 400; // Speed in pixels per millisecond
        
        // Account for world scrolling during bullet travel
        const scrollAmount = (this.worldScrollSpeed * duration);
        const targetX = enemy.x + this.worldContainer.x - scrollAmount * 0.5; // Compensate for scrolling
        
        // Add tracer effect
        const trail = this.add.particles('bullet');
        const emitter = trail.createEmitter({
            speed: 0,
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 200,
            blendMode: 'ADD'
        });
        
        // Make trail follow bullet
        emitter.startFollow(bullet);
        
        // Animate bullet with improved visual feedback
        this.tweens.add({
            targets: bullet,
            x: targetX,
            y: enemy.y,
            duration: duration * 1000, // Convert to milliseconds
            onUpdate: () => {
                // Keep the trail following the bullet
                trail.x = bullet.x;
                trail.y = bullet.y;
            },
            onComplete: () => {
                // Add impact effect
                this.createBulletImpact(targetX, enemy.y);
                // Clean up the bullet and trail
                trail.destroy();
                bullet.destroy();
            }
        });
    }

    createBulletImpact(x, y) {
        // Create impact particle effect
        const impact = this.add.particles('bullet');
        
        const emitter = impact.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            tint: 0xffff00,
            lifespan: 300,
            quantity: 10,
            blendMode: 'ADD'
        });
        
        emitter.explode();
        
        // Clean up after animation completes
        this.time.delayedCall(300, () => {
            impact.destroy();
        });
    }

    // Add method for laser attack
    fireLaser(tower, enemy, time) {
        // Calculate angle between tower and enemy
        const angle = Phaser.Math.Angle.Between(
            tower.x, 
            tower.y, 
            enemy.x + this.worldContainer.x, 
            enemy.y
        );
        
        // Set up laser beam
        const laserLength = 800;
        const laserBeam = this.add.sprite(tower.x, tower.y, 'laser-beam');
        laserBeam.setOrigin(0, 0.5);
        laserBeam.rotation = angle;
        laserBeam.alpha = 0;
        laserBeam.setDepth(20);
        
        // Add glow effect to laser
        laserBeam.setBlendMode(Phaser.BlendModes.ADD);
        
        // Store reference to current laser
        tower.setData('laser', laserBeam);
        tower.setData('laserActive', true);
        tower.setData('laserTarget', enemy);
        
        // Create laser animation sequence
        this.tweens.add({
            targets: laserBeam,
            alpha: 0.8,
            duration: 200,
            onComplete: () => {
                // Sustain laser for a moment
                this.time.delayedCall(600, () => {
                    this.tweens.add({
                        targets: laserBeam,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            laserBeam.destroy();
                            tower.setData('laserActive', false);
                        }
                    });
                });
            }
        });
        
        // Damage all enemies in the laser path
        this.damageEnemiesInLaserPath(tower, angle, tower.getData('damage') * 0.5);
    }

    // Add method to damage enemies in laser path
    damageEnemiesInLaserPath(tower, angle, damage) {
        const maxDistance = tower.getData('range');
        const towerX = tower.x;
        const towerY = tower.y;
        
        // Check each enemy to see if it's in the laser path
        for (const enemy of this.enemies) {
            const enemyX = enemy.x + this.worldContainer.x;
            const enemyY = enemy.y;
            
            // Calculate distance and angle to this enemy
            const distance = Phaser.Math.Distance.Between(towerX, towerY, enemyX, enemyY);
            const angleToEnemy = Phaser.Math.Angle.Between(towerX, towerY, enemyX, enemyY);
            
            // Check if enemy is within range
            if (distance <= maxDistance) {
                // Check if enemy is within a narrow angle of the laser beam
                // We use normalizeAngle to handle the -PI to PI wrapping
                const angleDiff = Math.abs(Phaser.Math.Angle.Normalize(angleToEnemy - angle));
                
                if (angleDiff < 0.08 || angleDiff > Math.PI * 2 - 0.08) { // About 5 degrees
                    // Enemy is in laser path - apply damage
                    const health = enemy.getData('health') - damage;
                    enemy.setData('health', health);
                    
                    // Add hit effect
                    this.createLaserHitEffect(enemyX, enemyY);
                }
            }
        }
    }

    // Add method for laser hit effect
    createLaserHitEffect(x, y) {
        const particles = this.add.particles('bullet');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 30, max: 80 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            tint: 0x00ffff,
            lifespan: 300,
            quantity: 8,
            blendMode: 'ADD'
        });
        
        emitter.explode();
        
        this.time.delayedCall(300, () => {
            particles.destroy();
        });
    }

    // Add method to update active lasers
    updateLasers() {
        for (const tower of this.towers) {
            if (tower.getData('isLaser') && tower.getData('laserActive')) {
                const laser = tower.getData('laser');
                const target = tower.getData('laserTarget');
                
                if (laser && target && target.active) {
                    // Update laser position and angle to track target
                    const targetX = target.x + this.worldContainer.x;
                    const targetY = target.y;
                    const angle = Phaser.Math.Angle.Between(tower.x, tower.y, targetX, targetY);
                    laser.rotation = angle;
                }
            }
        }
    }

    spawnEnemy(enemyType = 'normal') {
        // Spawn position randomization
        const spawnDistance = 900 + Phaser.Math.Between(0, 300);
        const heightVariation = Phaser.Math.Between(-100, 100);
        const enemyX = spawnDistance;
        const enemyY = 300 + heightVariation;
        
        this.spawnEnemyAt(enemyType, enemyX, enemyY);
    }

    spawnEnemyAt(enemyType, x, y) {
        // Create enemy based on type
        const enemy = this.add.sprite(x, y, 'enemy').setScale(0.8);
        
        // Set enemy properties based on type
        switch(enemyType) {
            case 'swarm':
                enemy.setTint(0xff00ff);
                enemy.setScale(0.5);
                enemy.setData('health', 15 + (this.waveNumber * 2));
                enemy.setData('speed', 100 + (this.waveNumber * 4));
                enemy.setData('reward', 2);
                break;
            case 'fast':
                enemy.setTint(0x00ffff);
                enemy.setScale(0.7);
                enemy.setData('health', 20 + (this.waveNumber * 3));
                enemy.setData('speed', 90 + (this.waveNumber * 3));
                enemy.setData('reward', 4);
                break;
            case 'heavy':
                enemy.setTint(0xff6600);
                enemy.setScale(1.0);
                enemy.setData('health', 60 + (this.waveNumber * 8));
                enemy.setData('speed', 40 + (this.waveNumber * 1));
                enemy.setData('reward', 8);
                break;
            case 'boss':
                enemy.setTint(0xff0000);
                enemy.setScale(2.0);
                enemy.setData('health', 250 + (this.waveNumber * 20));
                enemy.setData('speed', 30 + (this.waveNumber * 0.5));
                enemy.setData('reward', 30);
                break;
            default: // normal
                enemy.setData('health', 30 + (this.waveNumber * 5));
                enemy.setData('speed', 60 + (this.waveNumber * 2));
                enemy.setData('reward', 5);
        }
        
        enemy.setData('type', enemyType);
        enemy.setData('maxHealth', enemy.getData('health'));
        
        // Add health bar
        const width = enemy.getData('type') === 'boss' ? 80 : 30;
        const height = enemy.getData('type') === 'boss' ? 6 : 4;
        const yOffset = enemy.getData('type') === 'boss' ? -50 : -20;
        const barColor = enemy.getData('type') === 'boss' ? 0xff0000 : 0x00ff00;
        
        const healthBarBg = this.add.rectangle(enemy.x, enemy.y + yOffset, width, height, 0x000000);
        const healthBar = this.add.rectangle(enemy.x - width/2, enemy.y + yOffset, width, height, barColor);
        healthBar.setOrigin(0, 0.5);
        
        enemy.setData('healthBar', healthBar);
        enemy.setData('healthBarBg', healthBarBg);
        
        // Add enemy to world container for scrolling
        this.worldContainer.add(enemy);
        this.worldContainer.add(healthBarBg);
        this.worldContainer.add(healthBar);
        
        this.enemies.push(enemy);
    }
} 