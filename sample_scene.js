
const sampleScene = () => {
    let sampleScene = new Scene("sample");
    sampleScene.addUI(new UIText("titleText", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150, "Brick Breaker", 54, "black"));

    sampleScene.addUI(new UIButton("playBtn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 400, 50, "Play", () => {
        // console.log("Play button clicked!");
        // let obj = sampleScene.findUIObject("titleText");
        // obj.isActive = !obj.isActive;
    }));


    for (i=0; i < 12; i++)
        for (j=0; j < 16; j++)
            sampleScene.addGameObject(new Block(`stone${i}_${j}`, j*(BLOCK_SIZE+1), i*(BLOCK_SIZE+1), "assets/blocks/stone.png"));

    let ball = new Ball("ball_0", CANVAS_WIDTH / 2, CANVAS_HEIGHT-50, "pickaxe", 0);
    ball.transform.velocity = new Vector2D(0, 0);

    sampleScene.addGameObject(ball);
    sampleScene.balls = [ball];
    sampleScene.update = function() {
        let title = sampleScene.findUIObject("titleText");
        let playBtn = sampleScene.findUIObject("playBtn");

        title.color = `rgb(${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256})`;
        title.transform.radian += 0.15;

        console.log(0.154 * (sampleScene.balls.length/50)^10)
        playBtn.transform.radian += 0.154 * (sampleScene.balls.length/50)**10;
        
        sampleScene.balls.forEach(ball => {
            ball.transform.x += ball.transform.velocity.x;
            ball.transform.y += ball.transform.velocity.y;

            if (ball.transform.right >= CANVAS_WIDTH || ball.transform.left <= 0) {
                ball.transform.velocity.x *= -1;
                ball.transform.x += ball.transform.velocity.x > 0 ? 5 : -5;
                ball.transform.velocity.y *= (Math.random() + 0.1) * (Math.random() > 0.5 ? -1 : 1);

                if (Math.random() >= 0.5 && sampleScene.balls.length <= 50) {
                    let toolIndex = Math.floor(Math.random() * Ball.toolList.length);
                    let levelIndex = Math.floor(Math.random() * Ball.toolLevelList.length);
                    
                    let _ball = new Ball(`ball_${sampleScene.balls.length}`, ball.transform.x, ball.transform.y, Ball.toolList[toolIndex], levelIndex);
                    _ball.transform.velocity = new Vector2D(ball.transform.velocity.x, ball.transform.velocity.y);
                    _ball.transform.velocity.rotate(Math.PI / 3);
                    sampleScene.addGameObject(_ball);
                    sampleScene.balls.push(_ball);
                }
            }

            if (ball.transform.top <= 0 || ball.transform.bottom >= CANVAS_HEIGHT) {
                ball.transform.velocity.y *= -1;
                ball.transform.y += ball.transform.velocity.y > 0 ? 5 : -5;
                ball.transform.velocity.x *= (Math.random() + 0.1) * (Math.random() > 0.5 ? -1 : 1);
                
                if (Math.random() >= 0.5 && sampleScene.balls.length <= 50) {
                    let toolIndex = Math.floor(Math.random() * Ball.toolList.length);
                    let levelIndex = Math.floor(Math.random() * Ball.toolLevelList.length);
                    
                    let _ball = new Ball(`ball_${sampleScene.balls.length}`, ball.transform.x, ball.transform.y, Ball.toolList[toolIndex], levelIndex);
                    _ball.transform.velocity = new Vector2D(ball.transform.velocity.x, ball.transform.velocity.y);
                    _ball.transform.velocity.rotate(Math.PI / 3);
                    sampleScene.addGameObject(_ball);
                    sampleScene.balls.push(_ball);
                }
            }

            ball.transform.velocity.x += 0.005 * (ball.transform.velocity.x > 0 ? 1 : -1);
            ball.transform.velocity.y += 0.005 * (ball.transform.velocity.y > 0 ? 1 : -1);

            ball.transform.velocity.x = Math.min(ball.transform.velocity.x, 8);
            ball.transform.velocity.y = Math.min(ball.transform.velocity.y, 8);

            ball.transform.radian += 0.05 * ball.transform.velocity.x;
        });
        
        this.draw();
    }
    return sampleScene;
};