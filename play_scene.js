const lobby = () => {
    let scene1 = new Scene("lobby");

    scene1.addUI(new UIText("titleText", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));
    scene1.addUI(new UIButton("playBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
        // console.log("Play button clicked!");
        scoreManager.reset(); // 새 게임 시작 시 점수 초기화
        gameManager.play("overWorld");
    }));

    scene1.addUI(new UIButton("editorBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80, 400, 50, "Map Editor", () => {
        gameManager.play("editor");
    }));

    for (i = 0; i < 12; i++)
        for (j = 0; j < 16; j++)
            scene1.addGameObject(new Block(`stone${i}_${j}`, j * (BLOCK_SIZE + 1), i * (BLOCK_SIZE + 1), "assets/blocks/stone.png"));

    return scene1;
}

const overWorldScene = () => {
    let scene = new Scene("overWorld");

    // 점수 배경 UI
    scene.addUI(new UIRect(
        "scoreBg",
        5,
        5,
        210,
        40,
        "rgba(0,0,0,0.55)",
        0,
        0
    ));

    // 점수 텍스트 UI
    let scoreText = new UIText(
        "scoreText",
        15,
        25,
        "Score: 0",
        22,
        "white",
        TEXT_ALIGN_LEFT,
        0,
        0
    );

    scene.addUI(scoreText);

    // scoreManager가 이 scoreText를 갱신하도록 연결
    scoreManager.setTextObject(scoreText);

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

    let camera = new Camera("camera");
    camera.transform.y -= 500;

    player.appendChild(camera);
    

    let game_start = false;
    const gameStart = () => {
        start_button.isActive = false;
        game_start = true;

        soundManager.playClick();//  시작 버튼 클릭 효과음
        soundManager.playBGM(); // 게임 시작 후 배경음악 재생
    };

    let start_button = new UIButton("start_button", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", gameStart);
    scene.addGameObject(start_button);

    let balls = [];
    const NUM_BALLS = 5;
    for (let i = 0; i < NUM_BALLS; i++) {
        let level = Math.floor(Math.random() * 4);
        let velocity = new Vector2D(1, 1);
        velocity.rotate(Math.random() * (Math.PI/4 * 3) + Math.PI/4);
        velocity.scale(1.2);

        let ball = new Ball(`ball${i}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, "pickaxe", level, velocity);
        ball.transform.velocity.rotate(Math.random() * Math.PI);

        balls.push(ball);
        scene.addGameObject(ball);
    }


    let canCameraMove = false;
    let isCameraMoving = false;
    camera.onMouseMove = function(e) {
        const { offsetX, offsetY } = e;

        console.log(offsetY + player.transform.y , 800)
        let cntBlocksInMap = 0;
        this.scene.findGameObjects('block_').forEach(block => {
            if (block.transform.y >= camera.transform.getAbsolute().y)
                cntBlocksInMap++;
        });

        canCameraMove = cntBlocksInMap <= 10;
        console.log(cntBlocksInMap)
        isCameraMoving = canCameraMove && offsetY + player.transform.y <= 800;
    }


    let dot = new UIRect("debug", 0, 0, 5, 5, 'red');
    scene.addUI(dot);
    scene.update = function () {

        if (game_start) {
            balls.forEach(ball => {
                ball.rigidbody.update();
                ball.move();
                const [collisionSide, collisionObject] = ball.checkCollision();
                
                if (collisionSide == 'bottom' && collisionObject instanceof Player) {
                    // ball.transform.velocity.scale(0.8);                        
                    ball.transform.velocity.x +=  Math.min(collisionObject.transform.velocity.x, 1);
                    ball.transform.velocity.y +=  Math.min(collisionObject.transform.velocity.y, 1);
                }
                
                if (collisionObject instanceof Block && collisionObject.isActive) {
                    collisionObject.hit();

                    if (collisionObject.isActive) {
                        soundManager.playBlockHit();
                    } else {
                        soundManager.playBlockBreak();
                        this.removeObject(collisionObject.name);
                        scoreManager.addByBlock(collisionObject);
                    }
                }
            });

            if (isCameraMoving) {
                camera.move(0, -1 * this.deltaTime);
                player.transform.y -= 1 * this.deltaTime;
            }
            dot.transform.x = camera.transform.getAbsolute().x;
            dot.transform.y = camera.transform.getAbsolute().y;
        }

        scene.draw();
    };

    return scene;
};