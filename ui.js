// 클래스 사용법
// let scene = new Scene("name");           scene 생성
// scene.addUI("name", new [UI객체]());     scene에 UI 추가
// new UIText(x, y, text, fontSize, color);
// new UIButton(x, y, width, height, text, onclick);




class ObjectT {
    constructor(name, x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.name = name;
        this.isActive = true;
        this.parent = null;
        this.child = [];
        this.scene = null;
        this.transform = new Transform(x, y, width, height, pivotX, pivotY);
    }

    appendChild(child) {
        this.child.push(child);
        child.parent = this;
        child.transform.parent = this.transform;
        child.scene = this.scene;
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
    constructor(name, x, y, width, height, pivotX=0.5, pivotY=0.5) {
        super(name, x, y, width, height, pivotX, pivotY);
    }
}

class UIRect extends UI {
    constructor(name, x, y, width, height, color, pivotX=0.5, pivotY=0.5) {
        super(name, x, y, width, height, pivotX, pivotY);
        this.color = color;
    }

    render(context) {
        context.fillStyle = this.color;
        context.fillRect(this.transform.offsetX, this.transform.offsetY, this.transform.width, this.transform.height)
    }
}

class UIImage extends UI {
    constructor(name, x, y, width, height, img, pivotX=0.5, pivotY=0.5) {
        super(name, x, y, width, height, pivotX, pivotY);

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
    constructor(name, x, y, width, height, text, onclick) {
        super(name, x, y, width, height);
        
        this.hover = false;
        this.onClick = onclick;

        if (text) {
            let obj = new UIText(`${name}_text`, 0, 0, text, height * 0.5, 'black');
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
    constructor(name, x, y, text, fontSize, color, align=TEXT_ALIGN_CENTER, pivotX=0.5, pivotY=0.5) {
        super(name, x, y, 0, 0, pivotX, pivotY);
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

        
        const dispatchTopDown = (e, handlerName) => {
            if (!this.isActive) return;

            for (let i=this.layer.length-1; i >= 0; i--) {
                let canvas = this.layer[i];
                if (canvas[handlerName](e, canvas.objects)) break;
            }
        }

        const dispatchAll = (e, handlerName) => {           
            if (!this.isActive) return;
            this.layer.forEach(canvas => {
                canvas[handlerName](e, canvas.objects);
            })
        }
    }
    
    isMouseOver(target, mx, my) {
        const absolute = target.transform.getAbsolute();          

        return mx >= absolute.left && mx <= absolute.right && my >= absolute.top && my <= absolute.bottom;
    }

    mouseEvent(e, event, target) {
        const { offsetX, offsetY } = e;
        e.preventDefault();

        if (event == EVENT_MOUSE_HOVER) {
            for (const objId of Object.keys(target).reverse()) {
                let obj = target[objId];
                if (obj.hover == undefined) continue;
                obj.hover = false;
            }
        }

        for (const objId of Object.keys(target).reverse()) {
            let obj = target[objId];
            if (!obj.isActive) continue;
            if (event != EVENT_MOUSE_HOVER && obj[event] == undefined) {
                if (obj.child.length != 0) {
                    if (this.mouseEvent(e, event, obj.child))
                        return true;
                }
                continue;
            }

            let isMosueOver = this.isMouseOver(obj, offsetX, offsetY);
            if (isMosueOver || event == EVENT_MOUSE_MOVE) {
                if (event == EVENT_MOUSE_HOVER && obj.hover != undefined) {
                    obj.hover = true;
                }
                if (obj[event] != undefined)
                    obj[event](e);
                return true;
            }
        }

        return false;
    }

    keyEvent(e, event, target) {
        for (const objId of Object.keys(target).reverse()) {
            let obj = target[objId];
            if (!obj.isActive) continue;
            if (obj[event] == undefined) continue;
            obj[event](e);
        }
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

    addObject(obj) { 
        let originalName = obj.name;
        let i = 1;
        
        while (this.objects[obj.name] != undefined)
            obj.name = `${originalName} (${i++})`;        
            
        this.objects[obj.name] = obj;
    }
}

class Scene {
    constructor(name) {
        this.name = name;
        this.isEnd = false;
        this.isActive = false;
        this.deltaTime = 0;
        this.last = 0;
        this.keys = {};

        this.uiCanvas = new Canvas("ui");
        this.gameCanvas = new Canvas("game");
        
        this.layer = [this.gameCanvas, this.uiCanvas];
        let topCanvas = this.layer[this.layer.length-1].canvas;

        topCanvas.addEventListener('contextmenu', e => e.preventDefault());

        const dispatchTopDown = (e, handlerName, event) => {
            if (!this.isActive) return;

            for (let i=this.layer.length-1; i >= 0; i--) {
                let canvas = this.layer[i];
                if (canvas[event](e, handlerName, canvas.objects)) break;
            }
        }

        const dispatchAll = (e, handlerName, event) => {
            if (!this.isActive) return;
            this.layer.forEach(canvas => {
                canvas[event](e, handlerName, canvas.objects);
            })
        }

        document.addEventListener("keydown", e => {
            this.keys[e.code] = true;
            dispatchAll(e, "onKeyDown", EVENT_KEY);
        });

        document.addEventListener("keyup", e => {
            this.keys[e.code] = false;
            dispatchAll(e, "onKeyUp", EVENT_KEY)
        });

        topCanvas.addEventListener("mousedown", e => dispatchTopDown(e, "onClick",     EVENT_MOUSE));
        topCanvas.addEventListener("wheel",     e => dispatchTopDown(e, "onScroll",    EVENT_MOUSE));
        topCanvas.addEventListener("mousemove", e => dispatchAll(e,     "onHover",     EVENT_MOUSE));
        topCanvas.addEventListener("mousemove", e => dispatchAll(e,     "onMouseMove", EVENT_MOUSE));

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

    addObject(obj, canvas) {
        canvas.addObject(obj);
        obj.scene = this;
    }

    addUI(uiObj) { this.addObject(uiObj, this.uiCanvas); }
    addGameObject(gameObject) { this.addObject(gameObject, this.gameCanvas); }

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

            if (otherObj !== obj && otherObj.isActive && !otherObj.isCollisionDisabled) {
                
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
                            return ["left", otherObj];
                        } else {
                            // obj: 오른쪽을 부딪힘
                            return ["right", otherObj];
                        }
                    } 
                    else {
                        if (diffY > 0) {
                            // obj: 위를 부딪힘
                            return ["top", otherObj];
                        } else {
                            // obj: 아래를 부딪힘
                            return ["bottom", otherObj];
                        }
                    }
                }
            }
        }
        return [null, null];
    }

    start(arg=null) {
        // 각자 Scene 객체에서 구현.
        // Scene이 play 될 때 Scene 초기화 기능.
    }

    frame(now) {
        if (this.last == 0) {
            this.last = now;
            return;
        }
        this.deltaTime = (now - this.last) / 1000;
        // this.deltaTime = Math.max(0, Math.min(this.deltaTime, 1 / 30)); 
        this.update();

        const updateForward = (objects) => {
            objects.forEach(obj => {
                if (obj.rigidbody)
                    obj.rigidbody.update();

                if (obj.update)
                    obj.update();

                if (obj.child)
                    updateForward(obj.child);                
            });
        };
        
        updateForward(Object.values(this.gameCanvas.objects));

        this.draw();

        this.last = now;
    }

    update() {
        // 각자 Scene 객체에서 구현
    }

    end() {
        this.layer.forEach(canvas => {
            canvas.objects = {};
        });
        cancelAnimationFrame(gameManager.animationMap[this.name]);
        // this.isEnd = true;
    }

    draw() {

        this.layer.forEach(canvas => {
            canvas.draw();
        })
    }
}
