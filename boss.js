const bossScene = () => {
    let scene = new Scene("bossScene");

    scene.start = function(arg) {
        this.arg = arg;
        const background = new UIRect("background", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#01030d", 0, 0);
        const enderDragon = new EnderDragon('enderDragon', CANVAS_WIDTH/2+150, CANVAS_HEIGHT/2-150);
        // const enderDragon = new EnderDragon('enderDragon', CANVAS_WIDTH/2+150, -2000);
        const player = new UIRect("player", 0, 0, 16, 16, "red");

        player.onMouseMove = (e) => {
            const { offsetX, offsetY } = e;

            player.transform.x = offsetX;
            player.transform.y = offsetY;            
        };

        this.background = [[], []];

        const DUST_COUNT = 32;
        for (let i=0; i < DUST_COUNT; i++) {
            let layer = i < DUST_COUNT / 3 * 2 ? 0 : 1;

            let x = Math.random() * CANVAS_WIDTH - 500;
            let y = Math.random() * (CANVAS_HEIGHT + 800) - 200;
            let size = Math.random() * 5 + (layer ? 10 : 5);
            let opacity = Math.max(Math.random() + (layer ? 0.3 : 0.1));
            let color = `rgba(255, 255, 255, ${opacity})`;
            let speedScale = layer ? 700 : 350;

            let dust = new UIRect('dust', x, y, size, size, color);
            dust.speed = speedScale;

            let velocity = new Vector2D(0, -1);
            velocity.rotate(Math.PI / 4);
            velocity.scale(speedScale);
            dust.transform.velocity = velocity;

            dust.update = function() {
                const target = new Vector2D(CANVAS_WIDTH, 0);
                // const target = new Vector2D(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                // let direction = new Vector2D(target.x - player.transform.x, target.y - player.transform.y);
                
                let direction = new Vector2D(0, 1);
                // if (enderDragon.transform.y >= CANVAS_HEIGHT/2)
                    direction.rotate(Math.PI + Math.PI/4);

                direction.normalize();
                direction.scale(this.speed);

                this.transform.x += direction.x * this.scene.deltaTime*2;
                this.transform.y += direction.y * this.scene.deltaTime*2;

                if (this.transform.left >= CANVAS_WIDTH || this.transform.bottom <= 0 || this.transform.top >= CANVAS_HEIGHT || this.transform.right <= 0) {
                    let r = Math.random() >= 0.5;

                    this.transform.x = r ? 0 : (Math.random() * CANVAS_WIDTH);
                    this.transform.y = r ? (Math.random() * CANVAS_HEIGHT) : CANVAS_HEIGHT;
                }
            }

            this.background[layer].push(dust);
        }

        this.addGameObject(background);
        this.background[0].forEach(dust => this.addGameObject(dust));

        // this.addGameObject(player);
        this.addGameObject(enderDragon);

        this.background[1].forEach(dust => this.addGameObject(dust));

        const createItem = () => {
            let itemIndex = Math.floor(Math.random() * ITEM_LIST.length);
            let x = Math.random() * CANVAS_WIDTH;
            let y = Math.random() * CANVAS_HEIGHT;
            const itemInfo = ITEM_LIST[itemIndex];

            const item = new Item('item', 0, 0, itemInfo);
        }
        this.createItemInterval = setInterval(createItem, 500);

        this.time = 0;
    }

    scene.update = function() {
        const enderDragon = this.findGameObject('enderDragon');

        if (this.time >= 5)
            gameManager.play('game', [this.arg[0], this.arg[1], 'go']);
        
        this.time += this.deltaTime;
        // if (enderDragon.transform.y <= CANVAS_HEIGHT/2) {
        //     enderDragon.transform.y += 300 * this.deltaTime*2;
        // }
    };

    return scene;
};