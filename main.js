CANVAS_WIDTH  = 1024;
CANVAS_HEIGHT = 768;

class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = 0;
        this.sceneList = [];
    }

    addScene(scene) { this.sceneList.push(scene); }

    init() {
        let scene1 = new Scene("lobby");
        scene1.addUI("test", new UIImage(0, 0, 50, 50, "a.png"));
        scene1.addUI("titleText", new UIText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));

        scene1.addUI("playBtn", new UIButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
            // console.log("Play button clicked!");
            let obj = scene1.findUIObject("test");
            obj.isActive = !obj.isActive;
        }));

        scene1.addUI("howBtn", new UIButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80, 400, 50, "How to play", () => {
            console.log("test!");
        }));

        this.addScene(scene1);
        this.update();
    }

    update() {
        this.sceneList[this.sceneIndex].draw();
        requestAnimationFrame(() => { this.update(); });
    }
};

let gameManager = new GameManager();

window.onload = () => {
    gameManager.init();
}

class Ball extends GameObject {
    constructor(x, y, velocity) {
        super(x, y, velocity);

    }

    draw() {

    }
}

class Brick extends GameObject {
    constructor(x, y, velocity) {
        super(x, y, velocity);
        
    }

    draw() {
        
    }
}

