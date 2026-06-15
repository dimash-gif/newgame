## 📥 Installation & Local Execution

### Prerequisites

Before you begin, ensure your system meets the following requirements:
* **Python 3.x** installed locally.
* A modern web browser with **Web Audio API** support (Chrome, Edge, Firefox, or Safari).

### Deployment Steps

**1. Clone or download the repository**  
Extract or clone the project files into a directory with the following structural layout:

```text
├── index.html        # Main Structural Interface Template
├── style.css         # Neon-Arcade Cabinet Stylesheet
├── game.js           # Core Game State & Phaser Logic Engine
└── server.py         # Quiet Multi-threaded Local Host Server
```

**2. Launch the local development micro-server**

Open your terminal, navigate to the project folder, and run the following command:
```code
python server.py
```
Note: The server will automatically spawn your browser environment. If it does not open automatically, manually visit http://localhost:8888 in your web browser.
