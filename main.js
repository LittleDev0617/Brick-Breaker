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
    gameManager.addScene(editorScene());

    gameManager.addScene(lobby());
    gameManager.addScene(sampleScene());

    gameManager.addScene(overWorldScene());

    gameManager.play("editor");
}