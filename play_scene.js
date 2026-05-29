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

    const BALL_SPAWN_POINT = new Vector2D(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);

    const createBall = (level) => {
        let ball = new Ball('ball', BALL_SPAWN_POINT.x, BALL_SPAWN_POINT.y, "pickaxe", level, new Vector2D(0, -1));
        
        ball.transform.velocity.rotate(Math.random() * (Math.PI/4)) - Math.PI/4;
        ball.transform.velocity.scale(1.2);
        
        scene.addGameObject(ball);
    }

    scene.start = function() {
        this.gameCanvas.objects = {};
        this.uiCanvas.objects = {};

        const isRespawn = !!gameManager.respawning;
        gameManager.respawning = false;

        this.game_start = isRespawn;
        if (isRespawn) soundManager.playBGM();

        const gameStart = () => {
            start_button.isActive = false;
            this.game_start = true;

            soundManager.playClick();//  시작 버튼 클릭 효과음
            soundManager.playBGM(); // 게임 시작 후 배경음악 재생
        };

        ////////////////////////        UI / Map 생성       ///////////////////////////////
        let map = maps.find(map => map.name == 'overworld');
        map.draw(this);


        // 점수 배경 UI
        this.addUI(new UIRect("scoreBg", 5, 5, 210, 40, "rgba(0,0,0,0.55)", 0, 0));
        let scoreText = new UIText("scoreText", 15, 25, "Score: 0", 22, "white", TEXT_ALIGN_LEFT, 0, 0);
        this.addUI(scoreText);
        scoreManager.setTextObject(scoreText);
        let dot = new UIRect("debug", 0, 0, 5, 5, 'red');
        this.addUI(dot);

        ////////////////////////        GameObject 생성       ///////////////////////////////

        let player_width = 512;
        let player_height = 64;
        let player_img = "assets/etc/hotbar.png";

        let player = new Player("player", CANVAS_WIDTH / 2, CANVAS_HEIGHT - player_height - 20, player_width, player_height, player_img);
        this.addGameObject(player);    

        this.camera = new Camera("camera");
        this.camera.transform.y -= 400;

        player.appendChild(this.camera);
        

        let start_button = new UIButton("start_button", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", gameStart);
        if (!isRespawn) this.addGameObject(start_button);

        createBall(LEVEL_WOOD);
        
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
    }


    scene.update = function () {
        if (!this.game_start) return;

        const player = this.findGameObject('player');
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

        const ITEM_COST = 3;
        const itemList = [ITEM_OAK_LOG, ITEM_COBBLESTONE, ITEM_IRON_INGOT, ITEM_DIAMOND];
        let newBalls = [];
        player.inventory.forEach(slot => {
            if (slot.itemInfo == null) return;
            
            let itemLevel = itemList.indexOf(slot.itemInfo);

            if (itemLevel != -1 && slot.count >= ITEM_COST) {
                createBall(itemLevel);
                slot.addCount(-ITEM_COST);                
            }
        });

        if (this.isCameraMoving) {
            this.camera.move(0, -1 * this.deltaTime);
            this.isCameraMoving = false;
        }
        dot.transform.x = this.camera.transform.getAbsolute().x;
        dot.transform.y = this.camera.transform.getAbsolute().y;

        const balls = this.findGameObjects('ball');
        if (balls.length > 0 && balls.every(ball => ball.transform.y > CANVAS_HEIGHT)) {
            gameManager.play("gameOver");
            return;
        }
    };

    return scene;
};

const gameOverScene = () => {
    let scene = new Scene("gameOver");

    scene.start = function() {
        this.gameCanvas.objects = {};
        this.uiCanvas.objects = {};

        // 어두운 배경
        this.addUI(new UIRect("overlay", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(0,0,0,0.75)"));
        // 붉은 틴트
        this.addUI(new UIRect("redOverlay", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(255,0,0,0.12)"));

        // "You Died!"
        this.addUI(new UIText("diedText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 120, "You Died!", 72, "#FF3333"));

        // 점수
        this.addUI(new UIText("scoreText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30, `Score: ${scoreManager.getScore()}`, 28, "white"));

        // Respawn 버튼
        this.addUI(new UIButton("respawnBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60, 290, 50, "Respawn", () => {
            scoreManager.reset();
            gameManager.respawning = true;
            gameManager.play("overWorld");
        }));

        // Title Screen 버튼
        this.addUI(new UIButton("titleBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 145, 290, 50, "Title Screen", () => {
            gameManager.play("lobby");
        }));
    };

    return scene;
};