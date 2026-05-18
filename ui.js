class UI {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.isActive = true;
        this.x = x;
        this.y = y;
        this.pivotX = pivotX;
        this.pivotY = pivotY;
        this.width = width;
        this.height = height;
    }

    get left() { return this.x - this.width * this.pivotX };
    get top()  { return this.y - this.height * this.pivotY };
    get right() { return this.left + this.width };
    get bottom() { return this.top + this.height };

    contains(mx, my) {
        return mx >= this.left && mx <= this.right && my >= this.top && my <= this.bottom;
    }
    draw(context) {}
}

class UIImage extends UI {
    constructor(x, y, width, height, src) {
        super(x, y, width, height);
        this.img = new Image();
        this.img.src = src;
    }

    draw(context) {
        context.drawImage(this.img, this.left, this.top, this.width, this.height);
    }
}

class UIButton extends UI {
    constructor(x, y, width, height, text, onclick) {
        super(x, y, width, height);
        
        this.hover = false;
        this.click = onclick;
        if (text) {
            this.text = new UIText(x, y, text, height * 0.5, 'black');
        }
    }

    draw(context) {
        context.fillStyle = this.hover ? '#C0C0C0' : '#B0B0B0';
        context.fillRect(this.left, this.top, this.width, this.height);

        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.left, this.top, this.width, this.height);

        if (this.text) {
            this.text.draw(context);
        }
    }
}

class UIText extends UI {
    constructor(x, y, text, fontSize, color) {
        super(x, y, 0, 0);
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
    }

    draw(context) {
        context.font = `400 ${this.fontSize}px Minecraft`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = this.color;
        context.fillText(this.text, this.left, this.top);
    }
}

class Canvas {
    constructor(id) {
        let canvas = document.querySelector(`#${id}`);
        if (!canvas) {
            console.log(`ERROR: Cannot found a canvas #${id}`);
            return null;
        }

        this.isActive = true;
        this.canvas = canvas;        
        this.context = canvas.getContext("2d");
        this.objects = {};

        canvas.addEventListener("click", e => {
            if (!this.isActive) return;

            for (const objId in this.objects) {
                let obj = this.objects[objId];
                if (!(obj instanceof UIButton)) continue;

                if (obj.contains(e.offsetX, e.offsetY))
                    obj.click();
            }
        });
        
        canvas.addEventListener("mousemove", e => {
            if (!this.isActive) return;

            for (const objId in this.objects) {
                let obj = this.objects[objId];
                
                if (!(obj instanceof UIButton)) continue;
                
                obj.hover = false;
                if (obj.contains(e.offsetX, e.offsetY))
                    obj.hover = true;
            }
        });
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const objId in this.objects) {
            let obj = this.objects[objId];

            if (obj.isActive)
                obj.draw(this.context);
        }
    }

    addObject(name, obj) { 
        this.objects[name] = obj;
    }
}

class Scene {
    constructor(name) {
        this.name = name;

        this.uiCanvas = new Canvas("ui");
        this.gameCanvas = new Canvas("game");
    }

    addObject(name, obj, canvas) {
        canvas.addObject(name, obj);
    }

    addUI(name, uiObj) { this.addObject(name, uiObj, this.uiCanvas); }
    addGameObject(name, gameObject) { this.addObject(name, gameObject, this.gameCanvas); }

    findUIObject(name) {
        for (const objId in this.uiCanvas.objects) {
            if (objId == name) return this.uiCanvas.objects[name];
        }
    }
    
    findGameObject(name) {
        for (const objId in this.gameCanvas.objects) {
            if (objId == name) return this.gameCanvas.objects[name];
        }
    }

    draw() {
        if (this.background) {
            this.background.draw();
        }

        this.gameCanvas.draw();
        this.uiCanvas.draw();
    }
}