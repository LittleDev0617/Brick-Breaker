const lobby = () => {
    let scene1 = new Scene("lobby");
    
    scene1.addUI(new UIText("titleText", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));
    scene1.addUI(new UIButton("playBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
        // console.log("Play button clicked!");
        gameManager.play("overWorld");
    }));

    scene1.addUI(new UIButton("editorBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80, 400, 50, "Map Editor", () => {
        gameManager.play("editor");
    }));

    for (i=0; i < 12; i++)
        for (j=0; j < 16; j++)
            scene1.addGameObject(new Block(`stone${i}_${j}`, j*(BLOCK_SIZE+1), i*(BLOCK_SIZE+1), "assets/blocks/stone.png"));

    return scene1;
}

const overWorldScene = () => {
    let scene = new Scene("overWorld");

    // for (i = 0; i < 5; i++)
    //     for (j = 0; j < 16; j++)
    //         scene.addGameObject(new Block(`stone${i}_${j}`, j * (BLOCK_SIZE + 1), i * (BLOCK_SIZE + 1), "assets/blocks/stone.png"));


    let map = maps.find(map => map.name == 'overworld');
    map.draw(scene);

    let player_width = 512;
    let player_height = 64;
    let player_img = "assets/etc/hotbar.png";

    let player = new Player("player", CANVAS_WIDTH / 2, CANVAS_HEIGHT - player_height - 20, player_width, player_height, player_img);
    scene.addGameObject(player);

    let game_start = false;
    const gameStart = () => {
        start_button.isActive = false;
        game_start = true;

        soundManager.playClick();//  시작 버튼 클릭 효과음
        soundManager.playBGM(); // 게임 시작 후 배경음악 재생
    };

    let start_button = new UIButton("start_button", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", gameStart);
    scene.addGameObject(start_button);

    let balls = []
    for (let i = 0; i < 10; i++) {
        let level = Math.floor(Math.random() * 4);
        let velocity = new Vector2D(1, 1);
        velocity.rotate(Math.random() * (Math.PI/4 * 3) + Math.PI/4);
        velocity.scale(0.2);

        let ball = new Ball(`ball${i}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, "pickaxe", level, velocity);
        ball.transform.velocity.rotate(Math.random() * Math.PI);

        balls.push(ball);
        scene.addGameObject(ball);
    }

    scene.update = function () {

        if (game_start) {
            balls.forEach(ball => {
                ball.update();
                
            });
        }

        scene.draw();
    };

    return scene;
};