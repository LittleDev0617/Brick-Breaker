class UI {
    constructor(x, y, width, height) {
        this.top  = y;
        this.left = x;
        this.width = width;
        this.height = height;
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
        context.drawImage(this.img, this.top, this.left);
    }
}

class UIButton extends UIImage {
    constructor(x, y, width, height, img, onclick) {
        super(x, y, width, height, img);
    }

    draw(context) {
        super.draw(context);
    }
}

class UIText extends UI {
    constructor(x, y, width, height, text) {
        super(x, y, width, height);
        this.text = text;
    }

    draw(context) {

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
        this.context = canvas.getContext("2d");
        this.objects = [];

        canvas.addEventListener("click", () => {
            if (!this.isActive) return;

            let x, y;
            // TODO: calculate x, y position in canvas
            this.objects.forEach(obj => {
                if (!(obj instanceof UIButton)) return;

                // TODO: 버튼 클릭되었는지 체크
                let isClicked = false;
                if (isClicked)
                    obj.click();
            })
        });
    }

    draw() {
        this.objects.forEach(obj => {
            obj.draw(this.context);
        });
    }

    addObject(obj) { 
        this.objects.push(obj);
    }
}

class Scene {
    constructor(name) {
        this.name = name;

        this.uiCanvas = new Canvas("ui");
        this.gameCanvas = new Canvas("game");
    }

    addObject(obj, canvas) {
        canvas.addObject(obj);
    }

    addUI(uiObj) { this.addObject(uiObj, this.uiCanvas); }
    addGameObject(gameObject) { this.addObject(uiObj, this.uiCanvas); }

    draw() {
        if (this.background) {
            this.background.draw();
        }

        this.gameCanvas.draw();
        this.uiCanvas.draw();
    }
}