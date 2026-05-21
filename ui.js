class ObjectT {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.isActive = true;
        this.child = [];
        this.transform = new Transform(x, y, width, height, pivotX, pivotY);
    }

    draw(context) {
        context.save();
        
        context.translate(this.transform.x, this.transform.y);
        context.rotate(this.transform.radian);
        
        this.render(context);

        this.child.forEach(cObject => {
            cObject.draw(context);
        });
        
        context.restore();
    }

    render(context) {}
}

class UI extends ObjectT {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        super(x, y, width, height, pivotX, pivotY);
    }
}

class UIImage extends UI {
    constructor(x, y, width, height, img, pivotX=0.5, pivotY=0.5) {
        super(x, y, width, height, pivotX, pivotY);

        if (typeof img === 'string') {
            this.img = new Image();
            this.img.src = img;
        } else if (img instanceof Image) {
            this.img = img;
        }
    }

    render(context) {
        context.imageSmoothingEnabled = false;
        context.drawImage(this.img, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
    }
}

class UIButton extends UI {
    constructor(x, y, width, height, text, onclick) {
        super(x, y, width, height);
        
        this.hover = false;
        this.onClick = onclick;

        if (text) {
            this.text = new UIText(x, y, text, height * 0.5, 'black');
        }
    }

    render(context) {
        context.fillStyle = this.hover ? '#C0C0C0' : '#B0B0B0';
        context.fillRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);

        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);

        if (this.text) {
            this.text.render(context);
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

    render(context) {
        context.font = `400 ${this.fontSize}px Minecraft`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = this.color;
        context.fillText(this.text, this.transform.offsetX, this.transform.offsetY);
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
    }
    
    isMouseOver(target, mx, my) {
        return mx >= target.transform.left && mx <= target.transform.right && my >= target.transform.top && my <= target.transform.bottom;
    }

    tryClick(e) {
        const { offsetX, offsetY } = e;
        if (!this.isActive) return false;

        for (const objId in this.objects) {
            let obj = this.objects[objId];
            
            if (obj.onClick == undefined) continue;

            if (this.isMouseOver(obj, offsetX, offsetY)) {
                obj.onClick();
                return true;
            }
        }

        return false;
    }

    tryScroll(e) {
        const { offsetX, offsetY, deltaY }  = e;
        if (!this.isActive) return false;

        for (const objId in this.objects) {
            let obj = this.objects[objId];
            
            if (obj.onScroll == undefined) continue;
            
            if (this.isMouseOver(obj, offsetX, offsetY)) {
                obj.onScroll(deltaY);
                return true;
            }
        }

        return false;
    }

    updateHover(e) {
        const { offsetX, offsetY } = e;
        if (!this.isActive) return false;

        for (const objId in this.objects) {
            let obj = this.objects[objId];
            
            // if (!(obj instanceof UIButton)) continue;
            if (obj.hover == undefined) continue;

            obj.hover = false;
            if (this.isMouseOver(obj, offsetX, offsetY)) {
                obj.hover = true;
            }
        }
        return false;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const objId in this.objects) {
            let obj = this.objects[objId];

            if (obj.isActive) {
                obj.draw(this.context);
            }
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

        this.uiCanvas.canvas.addEventListener("click", e => {
            if (!this.uiCanvas.tryClick(e))
                this.gameCanvas.tryClick(e);
        });

        this.uiCanvas.canvas.addEventListener("mousemove", e => {            
            this.uiCanvas.updateHover(e);
            this.gameCanvas.updateHover(e);
        });

        this.uiCanvas.canvas.addEventListener("wheel", e => {            
            if (!this.uiCanvas.tryScroll(e))
                this.gameCanvas.tryScroll(e);
        });
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

    update() {
        // 각자 Scene 객체에서 구현
        this.draw();
    }

    draw() {
        if (this.background) {
            this.background.draw();
        }

        this.gameCanvas.draw();
        this.uiCanvas.draw();
    }
}