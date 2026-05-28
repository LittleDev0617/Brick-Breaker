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
            scene1.addGameObject(new Block(`stone${i}_${j}`, j * (BLOCK_SIZE + 1), i * (BLOCK_SIZE + 1), BLOCK_STONE));

    return scene1;
}

const overWorldScene = () => {
    let scene = new Scene("overWorld");

    scene.start = function() {
        // 점수 배경 UI
        this.addUI(new UIRect("scoreBg", 5, 5, 210, 40, "rgba(0,0,0,0.55)", 0, 0));

        // 점수 텍스트 UI
        let scoreText = new UIText("scoreText", 15, 25, "Score: 0", 22, "white", TEXT_ALIGN_LEFT, 0, 0);

        this.addUI(scoreText);

        // scoreManager가 이 scoreText를 갱신하도록 연결
        scoreManager.setTextObject(scoreText);

        let map = maps.find(map => map.name == 'overworld');
        map.draw(this);

        let player_width = 512;
        let player_height = 64;
        let player_img = "assets/etc/hotbar.png";

        let player = new Player("player", CANVAS_WIDTH / 2, CANVAS_HEIGHT - player_height - 20, player_width, player_height, player_img);
        this.addGameObject(player);    

        this.camera = new Camera("camera");
        this.camera.transform.y -= 400;

        player.appendChild(this.camera);
        

        this.game_start = false;
        const gameStart = () => {
            start_button.isActive = false;
            this.game_start = true;

            soundManager.playClick();//  시작 버튼 클릭 효과음
            soundManager.playBGM(); // 게임 시작 후 배경음악 재생
        };

        let start_button = new UIButton("start_button", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", gameStart);
        this.addGameObject(start_button);

        let ball = new Ball('ball', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, "pickaxe", LEVEL_WOOD, new Vector2D(0, -1));
        
        ball.transform.velocity.rotate(Math.random() * (Math.PI/4)) - Math.PI/4;
        ball.transform.velocity.scale(1.2);
        
        this.addGameObject(ball);

        let canCameraMove = false;
        this.isCameraMoving = false;
        this.camera.onMouseMove = e => {
            const { offsetX, offsetY } = e;

            console.log(offsetY, 700)
            let cntBlocksInMap = 0;
            this.findGameObjects('block_').forEach(block => {
                if (block.transform.y >= this.camera.transform.getAbsolute().y)
                    cntBlocksInMap++;
            });

            canCameraMove = cntBlocksInMap <= 5;
            this.isCameraMoving = canCameraMove && offsetY <= CANVAS_HEIGHT-200;
        }


        let dot = new UIRect("debug", 0, 0, 5, 5, 'red');
        this.addUI(dot);
    }


    scene.update = function () {
        if (!this.game_start) return;
        const dot = this.findUIObject('debug');

        this.findGameObjects('ball').forEach(ball => {
            ball.move();
            const [collisionSide, collisionObject] = ball.checkCollision();
            
            if (collisionSide == 'bottom' && collisionObject instanceof Player) {
                // ball.transform.velocity.scale(0.8);
                ball.transform.velocity.x +=  Math.min(collisionObject.transform.velocity.x, 1);
                ball.transform.velocity.y +=  Math.min(collisionObject.transform.velocity.y, 1);
            }
            
            if (collisionObject instanceof Block && collisionObject.isActive) {
                collisionObject.hit(ball.damage);

                if (collisionObject.isActive) {
                    soundManager.playBlockHit();
                } else {
                    soundManager.playBlockBreak();
                    this.removeObject(collisionObject.name);
                    scoreManager.addByBlock(collisionObject);
                }
            }
        });

        this.findGameObjects('item').forEach(item => {
            item.transform.y += item.transform.velocity.y;
            
            const [collisionSide, collisionObject] = this.checkCollision(item);
            
            if (collisionSide == 'bottom' && collisionObject instanceof Player) {
                collisionObject.addItem(item.itemInfo);
                this.removeObject(item.name);
            }
        });

        if (this.isCameraMoving) {
            this.camera.move(0, -1 * this.deltaTime);
            this.isCameraMoving = false;
        }
        dot.transform.x = this.camera.transform.getAbsolute().x;
        dot.transform.y = this.camera.transform.getAbsolute().y;        
    };

    return scene;
};