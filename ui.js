class UI {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.isActive = true;
        this.transform = new Transform(x, y, width, height);
    }

    contains(mx, my) {
        return mx >= this.transform.left && mx <= this.transform.right && my >= this.transform.top && my <= this.transform.bottom;
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
        context.drawImage(this.img, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
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
        context.fillRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);

        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);

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

    tryClick(x, y) {
        if (!this.isActive) return false;

        for (const objId in this.objects) {
            let obj = this.objects[objId];
            
            // if (!(obj instanceof UIButton)) continue;
            if (obj.contains == undefined) continue;
            if (obj.click == undefined) continue;

            if (obj.contains(x, y)) {
                obj.click();
                return true;
            }
        }

        return false;
    }

    updateHover(x, y) {
        if (!this.isActive) return false;

        for (const objId in this.objects) {
            let obj = this.objects[objId];
            
            // if (!(obj instanceof UIButton)) continue;
            if (obj.hover == undefined) continue;


            if (obj.contains == undefined) continue;
            obj.hover = false;
            if (obj.contains(x, y)) {
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
                this.context.save();
                
                this.context.translate(obj.transform.x, obj.transform.y);
                this.context.fillStyle = 'red'
                this.context.fillRect(0, 0, 5, 5);
                this.context.rotate(obj.transform.radian);
                

                obj.draw(this.context);
                
                this.context.restore();
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
            const [ x, y ] = [ e.offsetX, e.offsetY ];
            if (!this.uiCanvas.tryClick(x, y))
                this.gameCanvas.tryClick(x, y);
        });

        this.uiCanvas.canvas.addEventListener("mousemove", e => {
            const [ x, y ] = [ e.offsetX, e.offsetY ];
            
            this.uiCanvas.updateHover(x, y);
            this.gameCanvas.updateHover(x, y);
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