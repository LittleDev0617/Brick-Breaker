// 게임 내 오브젝트 관련 클래스, 메서드
// 새로운 오브젝트 만들 때 여기서 만들기

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get size() { return Math.sqrt(this.x**2 + this.y**2); }
    scale(k) { this.x *= k; this.y *= k; }
    add(v) { this.x += v.x; this.y += v.y; }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;
    }
};

// 새로운 오브젝트 만들 때 게임오브젝트를 상속받기
// 게임오브젝트는 ObjectT를 상속받음. ObjectT: ui.js에 있음. 렌더링하기위한 기본적인 오브젝트 정보들
class GameObject extends ObjectT {
    constructor(name, x, y, width, height, pivotX = 0.5, pivotY = 0.5, sprite = null) {
        super(name, x, y, width, height, pivotX, pivotY);

        this.sprite = null;
        this.sprite = sprite;
    }

    update() {
        this.move();
        this.render();
    }

    render(context) {

    }
}


class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = -1;
        this.sceneList = [];
        this.callStack = [];
    }

    get playingScene() { return this.sceneIndex == -1 ? null : this.sceneList[this.sceneIndex]; }
    addScene(scene) { this.sceneList.push(scene); }

    play(sceneName) {
        if (this.playingScene != null)
            this.callStack.push(this.playingScene.name);

        this.sceneList.forEach((scene, i) => {
            scene.isActive = false;
            if (scene.name == sceneName) {
                scene.isActive = true;
                this.sceneIndex = i;
            }
        })

        console.log(`Scene ${sceneName} started`);
        this.playingScene.isEnd = false;
        this.playingScene.start();
        this.update();
    }

    update() {
        if (this.playingScene.isEnd) {
            this.sceneIndex = -1;
            let lastScene = this.callStack.pop();
            return this.play(lastScene);
        }
        this.playingScene.frame();
        requestAnimationFrame(() => { this.update(); });
    }
};

class Rigidbody {
    constructor(transform, mass) {
        this.transform = transform;
        this.mass = mass;
        transform.acceleration = new Vector2D(0, 0);
        this.transform.acceleration.y = this.mass * 0.008;
    }

    update() {
        // gravity
        this.transform.velocity.add(this.transform.acceleration);
    }
}

class Ball extends GameObject {
    static toolList = ["pickaxe", "axe", "shovel", "sword"];
    static toolLevelList = ["wood", "stone", "iron", "diamond"];
    static damageList = [1, 2, 4, 8];
    static toolImages = {};
    static {
        this.toolList.forEach(tool => {
            this.toolImages[tool] = [];
            this.toolLevelList.forEach(level => {
                let img = new Image();
                img.src = `assets/tools/${level}_${tool}.png`;

                this.toolImages[tool].push(img);
            });
        });
    }

    constructor(name, x, y, tool, level, velocity) {
        super(name, x, y, BLOCK_SIZE, BLOCK_SIZE, 0.5, 0.5, Ball.toolImages[tool][level]);
        this.transform.velocity = velocity;
        this.rigidbody = new Rigidbody(this.transform, 1);
        this.damage = Ball.damageList[level];
    }

    update() {
    }

    move() {
        this.transform.x += this.transform.velocity.x;
        this.transform.y += this.transform.velocity.y;

        let a = this.transform.getAbsolute();
        
        if (a.left <= 0) {
            this.transform.velocity.x = -this.transform.velocity.x;
            this.transform.x = this.transform.width * this.transform.pivotX;
        } else if (a.right >= CANVAS_WIDTH) {
            this.transform.velocity.x = -this.transform.velocity.x;
            this.transform.x = CANVAS_WIDTH - this.transform.width * this.transform.pivotX;
        }
        
        this.transform.radian += 0.02 * (this.transform.velocity.size * (Math.random() + 1));
    }

    checkCollision() {
        const [collisionSide, collisionObject] = this.scene.checkCollision(this);

        if (!(collisionObject instanceof Ball)) {
            if (collisionObject instanceof Block) {
                this.transform.velocity.scale(0.9);

            }
            switch (collisionSide) {
                case "left":
                    this.transform.velocity.x = Math.abs(this.transform.velocity.x);
                    this.transform.x = collisionObject.transform.right + Math.abs(this.transform.offsetX);
                    break;
                case "right":
                    this.transform.velocity.x = -Math.abs(this.transform.velocity.x);
                    this.transform.x = collisionObject.transform.left - (this.transform.width + this.transform.offsetX);
                    break;
                case "top":
                    this.transform.velocity.y = Math.abs(this.transform.velocity.y);
                    this.transform.y = collisionObject.transform.bottom + -this.transform.offsetY;
                    break;
                case "bottom":
                    this.transform.velocity.y = -Math.abs(this.transform.velocity.y);
                    this.transform.y = collisionObject.transform.top - (this.transform.height + this.transform.offsetY);                    
                    break;
            }
        }
        return [collisionSide, collisionObject];

    }

    render(context) {
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
    }
}

class Block extends GameObject {
    static destroyImages = [];
    static {
        for (let i = 0; i < 10; i++) {
            let img = new Image();
            img.src = `assets/blocks/destroy/destroy_stage_${i}.png`;
            this.destroyImages.push(img);
        }
    }

    constructor(name, x, y, textureSrc, hp = 10) {
        let img = textureSrc;
        if (typeof textureSrc === 'string') {
            img = new Image();
            img.src = textureSrc;
        }
        super(name, x, y, BLOCK_SIZE, BLOCK_SIZE, 0, 0, img);

        this.maxHp = hp;
        this.hp = hp;
        this.hover = false;
    }

    onClick() {
        this.hit(1);
    }

    hit(dmg) {
        this.hp -= dmg;

        if (this.hp == 0) {
            this.isActive = false;
            this.scene.removeObject(this.name);
        }
    }

    render(context) {
        context.imageSmoothingEnabled = false;
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE + 1, BLOCK_SIZE + 1);

        if (this.hp < this.maxHp) {
            let index = Block.destroyImages.length - Math.floor((this.hp / this.maxHp) * 10) - 1;
            let texture = Block.destroyImages[index];
            context.drawImage(texture, this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
        }

        if (this.hover) {
            context.fillStyle = "rgb(0, 0, 0, 0.2)";
            context.fillRect(this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
        }
    }
}

class Player extends GameObject {
    constructor(name, x, y, width, height, textureSrc) {
        let img = new Image();
        img.src = textureSrc;
        super(name, x, y, width, height, 0.5, 0, img);

        this.prevX = 0;
        this.prevY = 0;
    }

    onMouseMove(e) {
        this.transform.x = Math.min(CANVAS_WIDTH-this.transform.width / 2, Math.max(e.offsetX, this.transform.width/2));
        this.transform.y = Math.min(CANVAS_HEIGHT-50, Math.max(e.offsetY, CANVAS_HEIGHT-200));

        this.transform.velocity.x = (this.transform.x - this.prevX) * this.scene.deltaTime;
        this.transform.velocity.y = (this.transform.y - this.prevY) * this.scene.deltaTime;        

        this.prevX = this.transform.x;
        this.prevY = this.transform.y;
    }

    render(context) {
        context.imageSmoothingEnabled = false;
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
    }
}

class Camera extends GameObject {
    constructor(name) {
        super(name, 0, 0, 0, 0);
    }

    move(dx, dy) {
        this.scene.findGameObjects("").forEach(obj => {
            // Camera 자신이면 리턴
            if (obj == this || obj == this.parent || obj instanceof Player) return;
            obj.transform.x -= dx;
            obj.transform.y -= dy;
        });
        // this.transform.x += dx;
        // this.transform.y += dy;
    }
}