class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = 0;
        this.sceneList = [];
    }

    addScene(scene) { this.sceneList.push(scene); }

    init() {
        let scene1 = new Scene("lobby");
        scene1.addUI(new UIImage(0, 0, 50, 50, "a.png"));

        this.addScene(scene1);
        this.update();
    }

    update() {
        this.sceneList[this.sceneIndex].draw();
        requestAnimationFrame(() => { this.update(); });
    }
};

let gameManager = new GameManager();

document.addEventListener("DOMContentLoaded", () => {
    gameManager.init();
});

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

