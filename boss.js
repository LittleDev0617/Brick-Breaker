const bossScene = () => {
    let scene = new Scene("bossScene");

    scene.start = function(arg) {
        let enderDragon = new EnderDragon('enderDragon', CANVAS_WIDTH/2+50, CANVAS_HEIGHT/2-50);

        this.background = [[], []];

        const DUST_COUNT = 32;
        for (let i=0; i < DUST_COUNT; i++) {
            let layer = i < DUST_COUNT / 3 * 2 ? 0 : 1;

            let x = Math.random() * CANVAS_WIDTH - 500;
            let y = Math.random() * (CANVAS_HEIGHT + 800) - 200;
            let size = Math.random() * 5 + (layer ? 10 : 5);
            let opacity = Math.max(Math.random() + (layer ? 0.3 : 0.1));
            let color = `rgba(255, 255, 255, ${opacity})`;
            
            let velocity = new Vector2D(0, -1);
            velocity.rotate(Math.PI / 4);
            velocity.scale(layer ? 6 : 4);

            let dust = new UIRect('dust', x, y, size, size, color);
            dust.transform.velocity = velocity;

            dust.update = function() {
                this.transform.x += this.transform.velocity.x;
                this.transform.y += this.transform.velocity.y;

                if (this.transform.left >= CANVAS_WIDTH || this.transform.botto <= 0) {
                    this.transform.x = Math.random() * -500;
                    this.transform.y = Math.random() * 1100 + 700;
                }
            }

            this.background[layer].push(dust);
        }

        this.background[0].forEach(dust => this.addGameObject(dust));
        this.addGameObject(enderDragon);
        this.background[1].forEach(dust => this.addGameObject(dust));
    }

    scene.update = function() {

    };

    return scene;
};