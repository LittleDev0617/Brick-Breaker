class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(k) { this.x *= k; this.y *= k; }
    add(v) {  }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;        
    }
};

class GameObject {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5, sprite=null) {
        this.isActive = true;

        this.sprite = null;
        this.sprite = sprite;
        

        this.transform = new Transform(x, y, width, height, pivotX, pivotY);
    }

    update() {
        this.move(); 
        this.draw();
    }

    draw(context) {

    }
}


class Ball extends GameObject {
    static toolList = ["pickaxe", "axe", "shovel", "sword"];
    static toolLevelList = ["wood", "stone", "iron", "diamond"];
    static toolImages = {};
    static {
        this.toolList.forEach(tool => {
            this.toolImages[tool] = [];
            this.toolLevelList.forEach(level => {
                let img = new Image();
                img.src = `tools/${level}_${tool}.png`;

                this.toolImages[tool].push(img);
            });
        });
    }

    constructor(x, y, tool, level) {
        super(x, y, BLOCK_SIZE, BLOCK_SIZE, 0.5, 0.5, Ball.toolImages[tool][level]);

    }

    draw(context) {
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.width);
    }
}

const BLOCK_SIZE  = 64;
class Block extends GameObject {
    static destroyImages = [];
    static {
        for (let i=0; i<10; i++) {
            let img = new Image();
            img.src = `blocks/destroy/destroy_stage_${i}.png`;
            this.destroyImages.push(img);
        }
    }

    constructor(x, y, textureSrc, hp=10) {        
        let img = new Image();
        img.src = textureSrc;
        super(x, y, BLOCK_SIZE, BLOCK_SIZE, 0, 0, img);
        
        this.maxHp = hp;
        this.hp = hp;
        this.hover = false;
    }

    contains(mx, my) {
        return mx >= this.transform.x && mx <= this.transform.x + BLOCK_SIZE && my >= this.transform.y && my <= this.transform.y + BLOCK_SIZE;
    }

    click() {
        this.hp--;

        if (this.hp == 0) 
            this.isActive = false;
    }

    draw(context) {
        context.imageSmoothingEnabled = false;
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE, BLOCK_SIZE);

        if (this.hp < this.maxHp) {
            let index = Block.destroyImages.length - Math.floor((this.hp / this.maxHp) * 10) - 1;
            let texture = Block.destroyImages[index];
            context.drawImage(texture, this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE, BLOCK_SIZE);
        }

        if (this.hover) {
            context.fillStyle = "rgb(0, 0, 0, 0.2)";
            context.fillRect(this.transform.offsetX, this.transform.offsetY, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}