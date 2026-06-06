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
        // 버그(Vector2D.rotate): x를 먼저 바꾸면 y 계산이 바뀐 x를 사용해서 회전값이 틀어짐.
        const x = this.x;
        const y = this.y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
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

    
    render(context) {
        if (!this.sprite) return;
        context.imageSmoothingEnabled = false;
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
    }
}


class GameManager {
    constructor() {
        this.level = 0;
        this.sceneIndex = -1;
        this.sceneList = [];
        this.callStack = [];
        this.isLoopRunning = false; // this.update 중복 호출 방지

        this.animationMap = {};
    }

    get playingScene() { return this.sceneIndex == -1 ? null : this.sceneList[this.sceneIndex]; }
    addScene(scene) { this.sceneList.push(scene); }

    resume(sceneName) {
        this.sceneList.forEach((scene, i) => {
            scene.isActive = false;
            if (scene.name == sceneName) {
                scene.isActive = true;
                this.sceneIndex = i;
            }
        });
    }

    play(sceneName, arg=null) {
        if (this.playingScene != null) {
            this.callStack.push(this.playingScene.name);
            this.playingScene.end();
        }

        this.resume(sceneName);

        this.playingScene.isEnd = false;

        this.playingScene.start(arg);

        this.playingScene.last = 0;
        let id = requestAnimationFrame((now) => {this.update(now)});
        this.animationMap[this.playingScene.name] = id;        
    }

    update(now) {
        this.playingScene.frame(now);
        let id = requestAnimationFrame((now) => {this.update(now)});
        this.animationMap[this.playingScene.name] = id;       
    }
};

class Rigidbody {
    constructor(transform, mass) {
        this.transform = transform;
        this.mass = mass;
        transform.acceleration = new Vector2D(0, 0);
        this.transform.acceleration.y = this.mass * 0.015;
    }

    update() {
        // gravity
        this.transform.velocity.add(this.transform.acceleration);
    }
}

class Ball extends GameObject {
    static toolList = ["pickaxe", "axe", "shovel", "sword"];
    static currentTool = 0;
    static toolLevelList = ["wood", "stone", "iron", "gold", "diamond"];
    static damageList = [1, 2, 4, 4, 8];
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

    static getCurrentTool = () => {
        return this.toolList[this.currentTool];
    };

    static nextTool = () => {
        this.currentTool = (this.currentTool + 1) % this.toolList.length;
    }

    constructor(name, x, y, tool, level, maxSpeed, velocity = new Vector2D(0, 0)) {
        super(name, x, y, BLOCK_SIZE, BLOCK_SIZE, 0.5, 0.5, Ball.toolImages[tool][level]);
        this.transform.velocity = velocity;
        
        // this.rigidbody = new Rigidbody(this.transform, 150);
        this.damage = Ball.damageList[level];

        this.maxSpeed = maxSpeed;
        this.minSpeed = 300;
        this.minYSpeed = 200;
    }

    update() {
    }

    move() {
        this.transform.x += this.transform.velocity.x * this.scene.deltaTime*2;
        this.transform.y += this.transform.velocity.y * this.scene.deltaTime*2;
        
        // 최대 속력 제한
        if (this.transform.velocity.size > this.maxSpeed) {
            let ratio = this.maxSpeed / this.transform.velocity.size;
            this.transform.velocity.scale(ratio);
        }

        // y속력 lower bound
        if (Math.abs(this.transform.velocity.y) < this.minYSpeed) {
            if (this.transform.velocity.y > 0) this.transform.velocity.y = this.minYSpeed;
            else                              this.transform.velocity.y = -this.minYSpeed;
        }

        if (this.transform.velocity.size < this.minSpeed) {
            let ratio = this.minSpeed / this.transform.velocity.size;
            this.transform.velocity.scale(ratio);
        }

        let a = this.transform.getAbsolute();
        
        if (a.left <= 0 && this.transform.velocity.x < 0) {
            this.transform.velocity.x = -this.transform.velocity.x;
            this.transform.x = this.transform.width * this.transform.pivotX;
        } else if (a.right >= CANVAS_WIDTH && this.transform.velocity.x > 0) {
            this.transform.velocity.x = -this.transform.velocity.x;
            this.transform.x = CANVAS_WIDTH - this.transform.width * this.transform.pivotX;
        } 

        if (a.top <= 0 && this.transform.velocity.y < 0) {
            this.transform.velocity.y = -this.transform.velocity.y;
            this.transform.y = this.transform.height * this.transform.pivotY;
        }
        
        this.transform.radian += 0.02 * (this.transform.velocity.size *this.scene.deltaTime*2 * (Math.random() + 1));
    }

    checkCollision() {
        const [collisionSide, collisionObject] = this.scene.checkCollision(this);

        if (collisionObject instanceof Block || collisionObject instanceof Player) {
            if (collisionObject instanceof Block) {
                // this.transform.velocity.scale(0.8);

                if (this.damage >= collisionObject.hp)
                    return [collisionSide, collisionObject];
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

    constructor(name, x, y, blockInfo) {
        super(name, x, y, BLOCK_SIZE, BLOCK_SIZE, 0, 0, blockInfo.sprite);

        this.blockInfo = blockInfo;
        this.maxHp = blockInfo.hp;
        this.hp = blockInfo.hp;
        this.hover = false;
    }

    onClick() {
        // this.hit(1);
    }

    hit(dmg) {
        this.hp -= dmg;

        if (this.hp <= 0) {
            this.isActive = false;

            if (this.blockInfo == BLOCK_END_CRYSTAL && typeof this.scene.goal_crystal == "number") {
                this.scene.goal_crystal = Math.max(0, this.scene.goal_crystal - 1);
            }
            
            if (this.blockInfo.itemInfo) {
                let randItemCount = Math.floor(Math.random()*this.blockInfo.itemCount + 1);
                for (let i = 0; i < randItemCount; i++) {
                    let item = new Item('item', this.transform.x + Math.random()*BLOCK_SIZE, this.transform.y + Math.random() * 10 - 10, this.blockInfo.itemInfo);
                    this.scene.addGameObject(item);
                }
            }

            this.scene.addGameObject(new Particle(`destroy`, this.transform.x+BLOCK_SIZE, this.transform.y+BLOCK_SIZE, this.blockInfo.color))
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

class Item extends GameObject {
    constructor(name, x, y, itemInfo) {
        super(name, x, y, 32, 32);
        this.itemInfo = itemInfo;
        this.sprite = itemInfo.sprite;
        this.rigidbody = new Rigidbody(this.transform, Math.random()*30 + 150);
    }

    update() {    
        this.transform.y += this.transform.velocity.y * this.scene.deltaTime*2;
        
        const [collisionSide, collisionObject] = this.scene.checkCollision(this);
        
        if (collisionSide == 'bottom' && collisionObject instanceof Player) {
            collisionObject.addItem(this.itemInfo);
            this.scene.removeObject(this.name);
        }
    }
}

class ItemSlot extends GameObject {
    constructor(name, x, y) {
        super(name, x, y, 40, 40);
        
        let countText = new UIText(`slot_count`, 16, 16, '', 16, 'white');
        this.appendChild(countText);
        this.itemInfo = null;
        this.count = 0;
    }

    update() {
        this.child[0].text = `${this.count}`;
        if (this.count <= 0) {
            this.itemInfo = null;
            this.child[0].text = '';
            this.sprite = null;
            return;
        }
        this.child[0].text = `${this.count}`;
        this.sprite = this.itemInfo.sprite;
    }

    addCount(amount) {
        this.count += amount;
        this.update();
    }

    setItem(itemInfo, count) {
        this.itemInfo = itemInfo;
        this.count = count;
        this.update();  
    }
}

class Player extends GameObject {
    
    constructor(name, x, y, width, height, textureSrc) {
        let img = new Image();
        img.src = textureSrc;
        super(name, x, y, width, height, 0.5, 0, img);

        this.inventory = [];
        for (let i=0; i < SLOT_COUNT; i++) {
            let slot = new ItemSlot('slot', -width/2 + 32 + i*56, height/2);
            // slot.count++;
            // slot.setItem(ITEM_COBBLESTONE);

            this.appendChild(slot);
            this.inventory.push(slot);
        }

        this.prevX = this.transform.x;
        this.prevY = this.transform.y;
    }

    addItem(itemInfo) {    
        soundManager.playGetItem();    
        let isExist = false;

        let targetSlot = this.inventory.find(slot => slot.itemInfo == itemInfo);
        if (targetSlot == undefined)
            targetSlot = this.inventory.find(slot => slot.itemInfo == undefined);

        // 버그(Player.addItem): 인벤토리가 꽉 찬 상태에서 새 아이템을 먹으면 targetSlot이 없어 오류가 남.
        if (targetSlot == undefined) return;

        targetSlot.setItem(itemInfo, targetSlot.count+1);

        this.inventory.forEach(slot => {
            if (!slot.itemInfo) return;
        });
    }

    getItem(itemInfo) {
        let sum = 0;
        this.inventory.forEach(slot => {
            if (slot.itemInfo == itemInfo)
                sum += slot.count;
        });
        return sum;
    }

    onMouseMove(e) {
        this.transform.x = Math.min(CANVAS_WIDTH-this.transform.width / 2, Math.max(e.offsetX, this.transform.width/2));
        this.transform.y = Math.min(CANVAS_HEIGHT-50, Math.max(e.offsetY, CANVAS_HEIGHT-200));

        this.transform.velocity.x = this.transform.x - this.prevX;
        this.transform.velocity.y = this.transform.y - this.prevY;

        this.prevX = this.transform.x;
        this.prevY = this.transform.y;
    }
}

class Camera extends GameObject {
    constructor(name) {
        super(name, 0, 0, 0, 0);
    }

    move(dx, dy) {
        this.scene.findGameObjects("").forEach(obj => {
            // Camera 자신이면 리턴
            if (obj == this || obj == this.parent || obj instanceof Player || obj.isFixedToScreen) return;
            obj.transform.x -= dx;
            obj.transform.y -= dy;
        });
        this.transform.x += dx;
        this.transform.y += dy;  
    }
}
