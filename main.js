// 레벨 등 게임 전체적인 흐름 관리
// 게임 화면(Scene) 업데이트

class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = -1;
        this.sceneList = [];
    }

    addScene(scene) { this.sceneList.push(scene); }

    play(sceneName) {
        this.sceneList.forEach((scene, i) => {
            scene.isActive = false;
            if (scene.name == sceneName) {
                scene.isActive = true;
                this.sceneIndex = i;
            }
        })

        this.update();
    }

    update() {
        this.sceneList[this.sceneIndex].update();
        requestAnimationFrame(() => { this.update(); });
    }
};

let gameManager = new GameManager();

// 처음 로드
window.onload = () => {
    let scene1 = new Scene("lobby");
    scene1.addUI("test", new UIImage(0, 0, 50, 50, "assets/a.png"));
    scene1.addUI("titleText", new UIText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));

    scene1.addUI("playBtn", new UIButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
        // console.log("Play button clicked!");
        gameManager.play("sample")
    }));

    scene1.addUI("howBtn", new UIButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80, 400, 50, "How to play", () => {
        console.log("test!");
    }));

    for (i=0; i < 12; i++)
        for (j=0; j < 16; j++)
            scene1.addGameObject(`stone${i}_${j}`, new Block(j*(BLOCK_SIZE+1), i*(BLOCK_SIZE+1), "assets/blocks/stone.png"));

    gameManager.addScene(editorScene());

    gameManager.addScene(scene1);
    gameManager.addScene(sampleScene());

    gameManager.addScene(overWorldScene());

    gameManager.play("overWorld");
}