// 레벨 등 게임 전체적인 흐름 관리
// 게임 화면(Scene) 업데이트

class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = -1;
        this.sceneList = [];
        this.callStack = [];
    }

    get playingScene() { return this.sceneIndex == -1 ? null : this.sceneList[this.sceneIndex]; }
    addScene(scene) { this.sceneList.push(scene); }

    play(sceneName) {        
        if (this.playingScene != null)
            this.callStack.push(this.playingScene.name);

        this.sceneList.forEach((scene, i) => {
            scene.isActive = false;
            if (scene.name == sceneName) {
                scene.isActive = true;
                this.sceneIndex = i;
            }
        })
        
        console.log(`Scene ${sceneName} started`);
        this.playingScene.isEnd = false;
        this.playingScene.start();
        this.update();
    }

    update() {
        if (this.playingScene.isEnd) {
            this.sceneIndex = -1;
            let lastScene = this.callStack.pop();
            return this.play(lastScene);
        }
        this.playingScene.update();
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

    gameManager.play("lobby");
}