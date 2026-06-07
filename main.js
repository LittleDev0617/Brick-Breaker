// 레벨 등 게임 전체적인 흐름 관리
// 게임 화면(Scene) 업데이트


let gameManager = new GameManager();

// 처음 로드
window.onload = () => {
    gameManager.addScene(gameScene());
    gameManager.addScene(editorScene());

    gameManager.addScene(lobby());
    gameManager.addScene(settingsScene());

    gameManager.addScene(endingScene());
    gameManager.addScene(gameClearScene());
    gameManager.addScene(gameOverScene());
    
    gameManager.addScene(bossScene());
    gameManager.addScene(levelEnding());
    gameManager.addScene(enderWorldEnterScene());

    gameManager.play("lobby");
}