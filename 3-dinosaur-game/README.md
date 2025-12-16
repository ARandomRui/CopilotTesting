# Chrome Dinosaur Game

A web-based replica of the iconic Google Chrome offline dinosaur game, built with Flask, HTML5 Canvas, and JavaScript.

## Features

- 🦖 Authentic Chrome Dino game mechanics
- 🎮 Sprite-based animations using the official Chrome Dino sprite sheet
- 🌵 Multiple obstacle types (cacti and pterodactyls)
- 🏃 Running, jumping, and ducking animations
- ☁️ Scrolling clouds and ground
- 📊 Score tracking with high score persistence
- 🎯 Progressive difficulty scaling
- 💥 Collision detection and game over state
- 🔄 Restart functionality

## Project Structure

```
3-dinosaur-game/
├── app.py              # Flask server
├── sprite.png          # Chrome Dino sprite sheet
├── templates/
│   └── index.html      # Game HTML template
├── static/
│   ├── script.js       # Game logic and canvas rendering
│   └── styles.css      # Game styling
└── README.md
```

## Setup & Installation

### Prerequisites
- Python 3.7+
- Flask

### Installation

1. Install dependencies:
```bash
pip install flask
```

2. Run the Flask server:
```bash
python app.py
```

3. Open your browser and navigate to:
```
http://localhost:5000
```

## How to Play

### Controls
- **Space** or **Arrow Up** - Jump
- **Arrow Down** - Duck (while running)
- **Click** - Restart after game over

### Gameplay
1. The dinosaur runs automatically
2. Avoid cacti by jumping over them
3. Avoid pterodactyls by ducking or jumping
4. Your score increases with distance traveled
5. Game speed increases as you progress
6. Try to beat your high score!

## Technical Details

### Game Engine
- HTML5 Canvas for rendering
- Sprite sheet atlas system for efficient rendering
- Physics-based jumping with gravity simulation
- Frame-independent game loop using `requestAnimationFrame`

### Features Implementation
- **Sprite Atlas**: Defines coordinates for all game assets (dinosaur, cacti, pterodactyls, clouds, ground)
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) collision system
- **Animation System**: Frame-based animations for running, blinking, and crashing
- **Parallax Scrolling**: Ground and clouds move at different speeds
- **Difficulty Scaling**: Game speed increases with distance

### Flask Server
Simple Flask application that:
- Serves the game template
- Provides static assets (CSS, JavaScript)
- Exposes the sprite sheet image

## Code Highlights

The game uses a modular class-based architecture:
- `Dino` - Player character with physics and animations
- `Obstacle` - Base class for cacti and pterodactyls
- `Cloud` - Background decoration
- `Ground` - Scrolling ground with pattern
- Game loop handles updates, rendering, and collision detection

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3

## License

This is a learning/demonstration project inspired by the Chrome offline game.

## Developer's own comment
Terrible implementation, all stuffs are misaligned, presummably due to lack of training data, as antigravity does much better in this task.
