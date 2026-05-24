// 클래스 사용법
// let scene = new Scene("name");           scene 생성
// scene.addUI("name", new [UI객체]());     scene에 UI 추가
// new UIText(x, y, text, fontSize, color);
// new UIButton(x, y, width, height, text, onclick);




class ObjectT {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.isActive = true;
        this.parent = null;
        this.child = [];
        this.transform = new Transform(x, y, width, height, pivotX, pivotY);
    }

    appendChild(child) {
        this.child.push(child);
        child.parent = this;
        child.transform.parent = this.transform;
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

class UIRect extends UI {
    constructor(x, y, width, height, color, pivotX=0.5, pivotY=0.5) {
        super(x, y, width, height, pivotX, pivotY);
        this.color = color;
    }

    render(context) {
        context.fillStyle = this.color;
        context.fillRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height)
    }
}

class UIImage extends UI {
    constructor(x, y, width, height, img, pivotX=0.5, pivotY=0.5) {
        super(x, y, width, height, pivotX, pivotY);

        if (typeof img === 'string') {
            this.sprite = new Image();
            this.sprite.src = img;
        } else if (img instanceof Image) {
            this.sprite = img;
        }

        this.opacity = 1;
    }

    render(context) {
        context.imageSmoothingEnabled = false;
        context.globalAlpha = this.opacity;
        context.drawImage(this.sprite, this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
        context.globalAlpha = 1;
    }
}

class UIButton extends UI {
    constructor(x, y, width, height, text, onclick) {
        super(x, y, width, height);
        
        this.hover = false;
        this.onClick = onclick;

        if (text) {
            let obj = new UIText(0, 0, text, height * 0.5, 'black');
            this.appendChild(obj);
        }
    }

    render(context) {
        context.fillStyle = this.hover ? '#C0C0C0' : '#B0B0B0';
        context.fillRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);

        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height);
    }
}

TEXT_ALIGN_LEFT = 0;
TEXT_ALIGN_CENTER = 1;
TEXT_ALIGN_RIGHT = 2;

class UIText extends UI {
    constructor(x, y, text, fontSize, color, align, pivotX=0.5, pivotY=0.5) {
        super(x, y, 0, 0, pivotX, pivotY);
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.align = ["left", "center", "right"][align];
    }

    render(context) {
        context.font = `400 ${this.fontSize}px Minecraft`;
        context.textAlign = this.align;
        context.textBaseline = 'middle';
        context.fillStyle = this.color;

        // this.transform.width = context.measureText(this.text).width;
        // this.transform.height = this.fontSize;


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
        const absolute = target.transform.getAbsolute();          

        return mx >= absolute.left && mx <= absolute.right && my >= absolute.top && my <= absolute.bottom;
    }

    tryClick(e, target) {
        const { offsetX, offsetY, button } = e;
        if (!this.isActive) return false;

        for (const objId in target) {
            let obj = target[objId];
            if (obj.onClick == undefined) {
                if (obj.child.length != 0) {
                    if (this.tryClick(e, obj.child))
                        return true;
                }
                continue;
            }

            if (this.isMouseOver(obj, offsetX, offsetY)) {
                if (button == 0)     // 좌클릭
                    obj.onClick(e);
                else if (button == 2)    // 우클릭
                    obj.onClick(e, true);
                return true;
            }
        }

        return false;
    }

    tryScroll(e, target) {
        const { offsetX, offsetY }  = e;
        e.preventDefault();
        if (!this.isActive) return false;

        for (const objId in target) {
            let obj = target[objId];
            
            if (obj.onScroll == undefined) continue;
            
            if (this.isMouseOver(obj, offsetX, offsetY)) {
                obj.onScroll(e);
                return true;
            }
        }

        return false;
    }

    updateHover(e, target) {
        const { offsetX, offsetY } = e;
        if (!this.isActive) return false;

        // TODO: 땜빵용 코드. hover 겹쳐있는 대상 어떻게 할지 고민. mouse out 이벤트를 만들긴 해야하는데.
        for (const objId in target) {
            let obj = target[objId];
            if (obj.hover == undefined) continue;
            obj.hover = false;
        }

        for (const objId in target) {
            let obj = target[objId];
            
            // if (!(obj instanceof UIButton)) continue;
            if (obj.hover == undefined) continue;

            if (this.isMouseOver(obj, offsetX, offsetY)) {
                obj.hover = true;
                if (obj.onHover != undefined)
                    obj?.onHover();
                return true;
            }
        }
        return false;
    }

    mouseMove(e, target) {        
        if (!this.isActive) return false;
        for (const objId in target) {
            let obj = target[objId];
            
            if (obj.onMouseMove == undefined) continue;
            obj.onMouseMove(e);
        }
    }

    keyDown() {
        
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
        let originalName = name;
        let i = 1;
        
        while (this.objects[name] != undefined)
            name = `${originalName} (${i++})`;        
            
        this.objects[name] = obj;
    }
}

class Scene {
    constructor(name) {
        this.name = name;
        this.isActive = false;
        this.uiCanvas = new Canvas("ui");
        this.gameCanvas = new Canvas("game");
        
        this.layer = [this.uiCanvas, this.gameCanvas];
        let topCanvas = this.layer[this.layer.length-1].canvas;

        topCanvas.addEventListener('contextmenu', e => e.preventDefault());

        const dispatchTopDown = (e, handlerName) => {
            e.preventDefault();
            if (!this.isActive) return;

            for (let i=this.layer.length-1; i >= 0; i--) {
                let canvas = this.layer[i];
                if (canvas[handlerName](e, canvas.objects)) break;
            }
        }

        const dispatchAll = (e, handlerName) => {           
            e.preventDefault();
            if (!this.isActive) return;
            this.layer.forEach(canvas => {
                canvas.updateHover(e, canvas.objects);
            })
        }

        topCanvas.addEventListener("keydown", e => dispatchAll(e, "keyDown"))
        topCanvas.addEventListener("mouseup", e => dispatchTopDown(e, "tryClick"));
        topCanvas.addEventListener("wheel", e => dispatchTopDown(e, "tryScroll"));
        topCanvas.addEventListener("mousemove", e => dispatchAll(e, "updateHover"));
        topCanvas.addEventListener("mousemove", e => dispatchAll(e, "mouseMove"));

    }

    removeObject(name) {
        let gameObject = this.findGameObject(name);
        let uiObject = this.findUIObject(name);

        if (gameObject) {
            delete this.gameCanvas.objects[name];
        }

        if (uiObject) {
            delete this.uiCanvas.objects[name];
        }

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

    findGameObjects(name) {
        let result = [];
        for (const objId in this.gameCanvas.objects) {
            if (objId.indexOf(name) != -1) 
                result.push(this.gameCanvas.objects[objId]);
        }
        return result;
    }

    checkCollision(obj) {

        for (const objID in this.gameCanvas.objects) {
            let otherObj = this.gameCanvas.objects[objID];

            if (otherObj !== obj && otherObj.isActive && !(otherObj instanceof Ball)) {
                
                const a = obj.transform.getAbsolute();
                const b = otherObj.transform.getAbsolute();

                const aCenterX = a.left + (a.width / 2);
                const aCenterY = a.top + (a.height / 2);
                const bCenterX = b.left + (b.width / 2);
                const bCenterY = b.top + (b.height / 2);

                const diffX = aCenterX - bCenterX;
                const diffY = aCenterY - bCenterY;

                const minWidth = (a.width / 2) + (b.width / 2);
                const minHeight = (a.height / 2) + (b.height / 2);

                if (Math.abs(diffX) < minWidth && Math.abs(diffY) < minHeight) {
                    
                    const overlapX = minWidth - Math.abs(diffX);
                    const overlapY = minHeight - Math.abs(diffY);

                    // 충돌 면 판정 및 위치 보정(끼임 방지)
                    if (overlapX < overlapY) {
                        if (diffX > 0) {
                            // obj: 왼쪽을 부딪힘
                            obj.dx = Math.abs(obj.dx);
                            obj.transform.x = b.right + (obj.transform.width * obj.transform.pivotX);
                            return ["left", otherObj];
                        } else {
                            // obj: 오른쪽을 부딪힘
                            obj.dx = -Math.abs(obj.dx);
                            obj.transform.x = b.left - (obj.transform.width * (1 - obj.transform.pivotX));
                            return ["right", otherObj];
                        }
                    } 
                    else {
                        if (diffY > 0) {
                            // obj: 위를 부딪힘
                            obj.dy = Math.abs(obj.dy);
                            obj.transform.y = b.bottom + (obj.transform.height * obj.transform.pivotY);
                            return ["top", otherObj];
                        } else {
                            // obj: 아래를 부딪힘
                            obj.dy = -Math.abs(obj.dy);
                            obj.transform.y = b.top - (obj.transform.height * (1 - obj.transform.pivotY));
                            return ["bottom", otherObj];
                        }
                    }
                }
            }
        }
        return [null, null];
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