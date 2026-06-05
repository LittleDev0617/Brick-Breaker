const lobby = () => {
    let scene1 = new Scene("lobby");

    scene1.start = function() {
        document.body.className = 'lobby-bg';
        scene1.addUI(new UIText("titleText", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));
        scene1.addUI(new UIButton("playBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
            scoreManager.reset(); // 새 게임 시작 시 점수 초기화
            gameManager.play("game", [0, undefined]);
            soundManager.playClick();
        }));

        scene1.addUI(new UIButton("editorBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80, 400, 50, "Map Editor", () => {
            gameManager.play("editor");
            soundManager.playClick();
        }));

        scene1.addUI(new UIButton("settingsBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 160, 400, 50, "Settings", () => {
            gameManager.play("settings");
            soundManager.playClick();
        }));

        for (i = 0; i < 12; i++)
            for (j = 0; j < 16; j++)
                scene1.addGameObject(new Block(`stone${i}_${j}`, j * (BLOCK_SIZE + 1), i * (BLOCK_SIZE + 1), BLOCK_STONE));
    }

    
    return scene1;
}

const settingsScene = () => {
    let scene = new Scene("settings");

    scene.start = function() {
        document.body.className = 'lobby-bg';
        this.gameCanvas.objects = {};
        this.uiCanvas.objects = {};

        const cx = CANVAS_WIDTH / 2;
        const cy = CANVAS_HEIGHT / 2;

        this.addUI(new UIRect("bg", cx, cy, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(0,0,0,0.85)"));
        this.addUI(new UIText("title", cx, cy - 150, "Settings", 48, "white"));

        let musicSelectBtn = new UIButton("musicSelectBtn", cx, cy - 40, 400, 50, 
            soundManager.getBgm(), () => {
                soundManager.changeBgm();
                musicSelectBtnText.text = soundManager.getBgm();
                musicSelectBtn.text = soundManager.getBgm();
                soundManager.playClick();
            });
        let musicSelectBtnText = musicSelectBtn.child[0];
        this.addUI(musicSelectBtn);

        let bgmBtn = new UIButton("bgmBtn", cx, cy + 30, 400, 50,
            soundManager.bgmEnabled ? "BGM: ON" : "BGM: OFF", () => {
                soundManager.toggleBgm();
                bgmText.text = soundManager.bgmEnabled ? "BGM: ON" : "BGM: OFF";
                bgmText.color = soundManager.bgmEnabled ? "#22ee77" : "#ee5555";
                soundManager.playClick();
            });
        let bgmText = bgmBtn.child[0];
        bgmText.color = soundManager.bgmEnabled ? "#22ee77" : "#ee5555";
        this.addUI(bgmBtn);

        let sfxBtn = new UIButton("sfxBtn", cx, cy + 100, 400, 50,
            soundManager.sfxEnabled ? "Sound Effects: ON" : "Sound Effects: OFF", () => {
                soundManager.toggleSfx();
                sfxText.text = soundManager.sfxEnabled ? "Sound Effects: ON" : "Sound Effects: OFF";
                sfxText.color = soundManager.sfxEnabled ? "#22ee77" : "#ee5555";
                soundManager.playClick();
            });
        let sfxText = sfxBtn.child[0];
        sfxText.color = soundManager.sfxEnabled ? "#22ee77" : "#ee5555";
        this.addUI(sfxBtn);

        // 뒤로가기
        this.addUI(new UIButton("backBtn", cx, cy + 200, 400, 50, "Back", () => {
            gameManager.play("lobby");
        }));
    };

    return scene;
};

const gameScene = () => {
    let scene = new Scene("game");
    const backgroundImages = {
        level1: new Image(),
        level2: new Image(),
        level3: new Image()
    };

    backgroundImages.level1.src = "assets/background/level1.png";
    backgroundImages.level2.src = "assets/background/level2.png";
    backgroundImages.level3.src = "assets/background/level3.png";

    const STAGES = [
        {
            'map': 'level1',
            'isClear': () => {
                const player = scene.findGameObject('player');

                return player.getItem(ITEM_OBSIDIAN) >= 8;
            }
        },
        {
            'map': 'level2',
            'isClear': () => {
                const player = scene.findGameObject('player');

                return player.getItem(ITEM_BLAZE_ROD) >= 3 && player.getItem(ITEM_ENDER_PEARL) >= 3;
            }
        },
        {
            'map': 'level3',
            'isClear': () => {
                const player = scene.findGameObject('player');
                
                return scene.goal_crystal == 0;
            }
        },
    ]

    const BALL_SPAWN_POINT = new Vector2D(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
    const MAX_BALL_COUNT = 5;

    const createBall = (level) => {
        let randDx = Math.floor(Math.random()*8 - 4);
        let ball = new Ball('ball', BALL_SPAWN_POINT.x, BALL_SPAWN_POINT.y, "pickaxe", level, new Vector2D(randDx, -3));
        
        ball.transform.velocity.scale(120);
        
        scene.addGameObject(ball);
    }

    const loadMap = () => {        
        scene.findGameObjects('block').forEach(block => {
            scene.removeObject(block.name);
        });
        
        let map = maps.find(map => map.name == `level${scene.level+1}`);
        map.draw(scene);
    };

    scene.start = function (arg=null) {
        if (arg == null) return;

        const [level, inventory] = arg;
        
        this.level = level;
        this.stage = STAGES[level];
        ////////////////////////        UI / Map 생성       ///////////////////////////////
        let background = new UIImage(
            "background",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            backgroundImages[`level${level + 1}`]
        );
        background.isCollisionDisabled = true;
        background.isFixedToScreen = true;

        this.addGameObject(background);
        loadMap();


        // this.gameCanvas.objects = {};
        // this.uiCanvas.objects = {};
        

        this.goal_crystal = 4;

        const isRespawn = !!gameManager.respawning;
        gameManager.respawning = false;

        this.game_start = isRespawn;
        if (isRespawn) soundManager.playBGM();

        const gameStart = () => {
            start_button.isActive = false;
            this.game_start = true;

            soundManager.playBGM(); // 게임 시작 후 배경음악 재생
        };


        // 점수 배경 UI
        this.addUI(new UIRect("scoreBg", 5, 5, 350, 40, "rgba(0,0,0,0.55)", 0, 0));
        let scoreText = new UIText("scoreText", 15, 25, `Score: 0 | Best: ${scoreManager.getHighScore()}`, 22, "white", TEXT_ALIGN_LEFT, 0, 0);
        this.addUI(scoreText);
        scoreManager.setTextObject(scoreText);
        let dot = new UIRect("debug", 0, 0, 5, 5, 'red');
        this.addUI(dot);

        ////////////////////////        GameObject 생성       ///////////////////////////////

        let player_width = 512;
        let player_height = 64;
        let player_img = "assets/etc/hotbar.png";

        let player = new Player("player", CANVAS_WIDTH / 2, CANVAS_HEIGHT - player_height - 20, player_width, player_height, player_img);
        if (inventory)
            player.inventory = inventory;

        this.addGameObject(player);    

        this.camera = new Camera("camera");
        this.camera.transform.y -= 400;

        player.appendChild(this.camera);
        

        let start_button = new UIButton("start_button", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 50, "CLICK TO START", () => {
            gameStart;
            soundManager.playClick();
        });
        if (!isRespawn) this.addGameObject(start_button);

        createBall(LEVEL_WOOD);

        // 인게임 Settings 버튼
        const cx = CANVAS_WIDTH / 2;
        const cy = CANVAS_HEIGHT / 2;
        this.settingsPanelOpen = false;
        const settingsOverlay = [];
        const addToOverlay = (el) => { el.isActive = false; settingsOverlay.push(el); this.addUI(el); return el; };

        this.addUI(new UIButton("ow_settingsBtn", CANVAS_WIDTH - 65, 25, 110, 40, "Settings", () => {
            this.settingsPanelOpen = true;
            settingsOverlay.forEach(el => el.isActive = true);
            owBgmText.text = soundManager.bgmEnabled ? "BGM: ON" : "BGM: OFF";
            owBgmText.color = soundManager.bgmEnabled ? "#22ee77" : "#ee5555";
            owSfxText.text = soundManager.sfxEnabled ? "Sound Effects: ON" : "Sound Effects: OFF";
            owSfxText.color = soundManager.sfxEnabled ? "#22ee77" : "#ee5555";

            // 공 속도 저장 후 0으로 정지
            this.savedBallVelocities = this.findGameObjects('ball').map(ball => ({
                vx: ball.transform.velocity.x,
                vy: ball.transform.velocity.y,
                ay: ball.transform.acceleration.y
            }));
            this.findGameObjects('ball').forEach(ball => {
                ball.transform.velocity.x = 0;
                ball.transform.velocity.y = 0;
                ball.transform.acceleration.y = 0;
            });

            soundManager.playClick();
        }));

        addToOverlay(new UIRect("ow_bg", cx, cy, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(0,0,0,0.85)"));
        addToOverlay(new UIText("ow_title", cx, cy - 150, "Settings", 48, "white"));

        let owBgmBtn = new UIButton("ow_bgmBtn", cx, cy - 40, 300, 50, "BGM: ON", () => {
            soundManager.toggleBgm();
            owBgmText.text = soundManager.bgmEnabled ? "BGM: ON" : "BGM: OFF";
            owBgmText.color = soundManager.bgmEnabled ? "#22ee77" : "#ee5555";
            soundManager.playClick();
        });
        let owBgmText = owBgmBtn.child[0];
        owBgmText.color = "#22ee77";
        addToOverlay(owBgmBtn);

        let owSfxBtn = new UIButton("ow_sfxBtn", cx, cy + 30, 300, 50, "Sound Effects: ON", () => {
            soundManager.toggleSfx();
            owSfxText.text = soundManager.sfxEnabled ? "Sound Effects: ON" : "Sound Effects: OFF";
            owSfxText.color = soundManager.sfxEnabled ? "#22ee77" : "#ee5555";
            soundManager.playClick();
        });
        let owSfxText = owSfxBtn.child[0];
        owSfxText.color = "#22ee77";
        addToOverlay(owSfxBtn);

        addToOverlay(new UIButton("ow_resumeBtn", cx, cy + 130, 300, 50, "Resume", () => {
            this.settingsPanelOpen = false;
            settingsOverlay.forEach(el => el.isActive = false);

            // 공 속도 복원
            const balls = this.findGameObjects('ball');
            balls.forEach((ball, i) => {
                if (!this.savedBallVelocities || !this.savedBallVelocities[i]) return;
                ball.transform.velocity.x = this.savedBallVelocities[i].vx;
                ball.transform.velocity.y = this.savedBallVelocities[i].vy;
                ball.transform.acceleration.y = this.savedBallVelocities[i].ay;
            });
            this.savedBallVelocities = null;
            soundManager.playClick();
        }));

        let canCameraMove = false;
        this.isCameraMoving = false;
        this.camera.onMouseMove = e => {
            const { offsetX, offsetY } = e;

            let cntBlocksInMap = 0;
            this.findGameObjects('block_').forEach(block => {
                if (block.transform.y >= this.camera.transform.getAbsolute().y)
                    cntBlocksInMap++;
            });

            canCameraMove = cntBlocksInMap <= 5;
            this.isCameraMoving = canCameraMove && offsetY <= CANVAS_HEIGHT-200;
        }

        
        gameStart();
    }
    

    scene.update = function () {
        if (this.settingsPanelOpen) return;

        const player = this.findGameObject('player');
        const dot = this.findUIObject('debug');
        
        if (this.stage.isClear()) {
            gameManager.play("gameClear", [this.level, player.inventory]);
            return;
        }
        
        const balls = this.findGameObjects('ball');
        
        if (balls.length == 0) {
            scoreManager.reset();
            gameManager.play("gameOver", [this.level, player.inventory]);
            return;
        }

        this.findGameObjects('ball').forEach(ball => {
            ball.move();
            const [collisionSide, collisionObject] = ball.checkCollision();
            
            if (collisionSide == 'bottom' && collisionObject instanceof Player) {
                ball.transform.velocity.x +=  Math.min(collisionObject.transform.velocity.x * 5, 400);
                ball.transform.velocity.y +=  Math.min(collisionObject.transform.velocity.y * 5, 400);
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

            if (ball.transform.y > CANVAS_HEIGHT + 100) {
                this.removeObject(ball.name);
            }
        });

        const ITEM_COST = 3;
        const itemList = [ITEM_OAK_LOG, ITEM_COBBLESTONE, ITEM_IRON_INGOT, ITEM_GOLD_INGOT, ITEM_DIAMOND];

        player.inventory.forEach(slot => {
            if (slot.itemInfo == null) return;
            
            let itemLevel = itemList.indexOf(slot.itemInfo);

            let ballCounter = balls.length;
            if (itemLevel != -1 && slot.count >= ITEM_COST && ballCounter < MAX_BALL_COUNT) {
                createBall(itemLevel);
                slot.addCount(-ITEM_COST);                
            }
        });

        if (this.isCameraMoving) {
            this.camera.move(0, -2);
            this.isCameraMoving = false;
        }
        dot.transform.x = this.camera.transform.getAbsolute().x;
        dot.transform.y = this.camera.transform.getAbsolute().y;

    };

    return scene;
};

const endingScene = () => {
    let scene = new Scene("ending");

    scene.start = function() {
        //최고 점수 저장
        scoreManager.saveHighScore();

        this.gameCanvas.objects = {};
        this.uiCanvas.objects = {};

        // 갈색 배경
        this.addUI(new UIRect("overlay", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(214, 118, 59, 0.75)"));

        // "Game Ending!"
        this.addUI(new UIText("diedText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 120, "Game Clear!", 72, "#0ff0a1"));

        // 점수
        this.addUI(new UIText("scoreText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30, `Score: ${scoreManager.getScore()}`, 28, "white"));

        //최고 점수
        this.addUI(new UIText("highScoreText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 10, `Best Score: ${scoreManager.getHighScore()}`, 28, "#FFD700"));

        // Title Screen 버튼
        this.addUI(new UIButton("titleBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 145, 290, 50, "Title Screen", () => {
            gameManager.play("lobby");
            soundManager.playClick();
        }));
    };

    return scene;
}

const gameClearScene = () => {
    let scene = new Scene("gameClear");

    scene.start = function(info) {
        const [level, inventory]  = info;
        // 게임 클리어 시 최고 점수 저장
        scoreManager.saveHighScore();

        this.gameCanvas.objects = {};
        this.uiCanvas.objects = {};

        // 초록 배경
        this.addUI(new UIRect("overlay", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(59, 214, 105, 0.75)"));

        // "Game Clear!"
        this.addUI(new UIText("diedText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 120, "Game Clear!", 72, "#4023e0"));

        // 점수
        this.addUI(new UIText("scoreText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30, `Score: ${scoreManager.getScore()}`, 28, "white"));

        //최고 점수
        this.addUI(new UIText("highScoreText", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 10, `Best Score: ${scoreManager.getHighScore()}`, 28, "#FFD700"));

        // Next Level 버튼
        this.addUI(new UIButton("nextLevelBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60, 290, 50, "Next Level", () => {
            gameManager.play("game", [level+1, inventory]);
            soundManager.playClick();
        }));

        // Title Screen 버튼
        this.addUI(new UIButton("titleBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 145, 290, 50, "Title Screen", () => {
            gameManager.play("lobby");
            soundManager.playClick();
        }));
    };

    return scene;
};

const gameOverScene = () => {
    let scene = new Scene("gameOver");

    scene.start = function(info) {
        const [level, inventory]  = info;
        // 게임 오버 시 최고 점수 저장
        scoreManager.saveHighScore();
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

        //최고 점수
        this.addUI(new UIText("highScoreText",CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 10,`Best Score: ${scoreManager.getHighScore()}`,28,"#FFD700"));

        // Respawn 버튼
        this.addUI(new UIButton("respawnBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60, 290, 50, "Respawn", () => {
            gameManager.play("game", [level, undefined]);
            soundManager.playClick();
        }));

        // Title Screen 버튼
        this.addUI(new UIButton("titleBtn", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 145, 290, 50, "Title Screen", () => {
            gameManager.play("lobby");
            soundManager.playClick();
        }));
    };

    return scene;
};
