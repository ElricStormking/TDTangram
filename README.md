# Tangram Towers

A classic Tangram puzzle game built with Phaser 3, where players arrange geometric shapes to form various patterns and designs.

## About

Tangram Towers is a digital implementation of the ancient Chinese puzzle game Tangram. Players use seven geometric pieces (called tans) to create shapes and patterns. The game features an intuitive drag-and-drop interface and multiple puzzle challenges.

## Features

- **Interactive Gameplay**: Drag and drop tangram pieces to solve puzzles
- **Built with Phaser 3**: Modern HTML5 game framework for smooth performance
- **Responsive Design**: Playable on desktop and mobile devices
- **Multiple Scenes**: Menu system and main game scene

## Technologies Used

- **Phaser 3.55.2**: HTML5 game framework
- **JavaScript**: Game logic and interactions
- **HTML5 Canvas**: Rendering and graphics
- **CSS3**: Styling and layout

## Getting Started

### Prerequisites

- A modern web browser with HTML5 support
- No additional installations required - runs directly in the browser

### Running the Game

1. Clone this repository:
   ```bash
   git clone https://github.com/ElricStormking/TDTangram.git
   ```

2. Navigate to the project directory:
   ```bash
   cd TDTangram
   ```

3. Open `index.html` in your web browser, or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

4. Navigate to `http://localhost:8000` in your browser

## Project Structure

```
TDTangram/
├── index.html          # Main HTML file
├── game.js            # Game configuration and initialization
├── scenes/
│   ├── Menu.js        # Menu scene
│   └── MainGame.js    # Main game scene with puzzle logic
├── assets/            # Game assets (images, sounds, etc.)
└── README.md          # This file
```

## Game Controls

- **Mouse/Touch**: Click and drag tangram pieces to move them
- **Rotation**: Use designated controls to rotate pieces
- **Menu Navigation**: Click to navigate between game screens

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the traditional Chinese Tangram puzzle
- Built with the excellent [Phaser 3](https://phaser.io/) game framework
- Thanks to the open source community for tools and inspiration

## Contact

Project Link: [https://github.com/ElricStormking/TDTangram](https://github.com/ElricStormking/TDTangram) 