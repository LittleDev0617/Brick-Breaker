const overWorldScene = () => {
    let scene = new Scene("overWorld");

    for (i = 0; i < 5; i++)
        for (j = 0; j < 16; j++)
            scene.addGameObject(`stone${i}_${j}`, new Block(j * (BLOCK_SIZE + 1), i * (BLOCK_SIZE + 1), "assets/blocks/stone.png"));

    let player_width = 256;
    let player_height = 32;
    let player_img = "assets/etc/hotbar.png";

    let player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - player_height - 20, player_width, player_height, player_img);
    scene.addGameObject("player", player);

    let game_start = false;
    const gameStart = () => {
        start_button.isActive = false;
        game_start = true;

        soundManager.playClick();//  시작 버튼 클릭 효과음
        soundManager.playBGM(); // 게임 시작 후 배경음악 재생
    };

    let start_button = new UIButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", gameStart);
    scene.addGameObject("start_button", start_button);

    let balls = []
    for (let i = 0; i < 10; i++) {
        let level = Math.floor(Math.random() * 4);
        let velocity = Math.floor(10 + Math.random() * 15);
        let dx = Math.floor(5 + Math.random() * 5);
        let dy = Math.floor(5 + Math.random() * 5);
        let ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, "pickaxe", level, velocity, dx, dy);
        balls.push(ball);
        scene.addGameObject(`ball${i}`, ball);
    }

    scene.update = function () {

        if (game_start) {
            balls.forEach(ball => {
                ball.move();
                const [collisionSide, collisionObject] = scene.checkCollision(ball);
                if (collisionObject instanceof Block && collisionObject.isActive) {
                    collisionObject.onClick();

                    if (collisionObject.isActive) {
                        soundManager.playBlockHit();
                    } else {
                        soundManager.playBlockBreak();
                    }
                }
            });
        }

        scene.draw();
    };

    return scene;
};