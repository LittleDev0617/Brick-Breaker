class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(k) { this.x *= k; this.y *= k; }
    add(v) {  }
};

class GameObject {
    constructor(x, y, width, height) {
        this.isActive = true;
        this.transform = new Transform(x, y, width, height);
    }

    get left() { return this.transform.left };
    get top()  { return this.transform.top };
    get right() { return this.transform.right };
    get bottom() { return this.transform.bottom };
    get width() { return this.transform.width };
    get height() { return this.transform.height };
    get x() { return this.transform.x };
    get y() { return this.transform.y };

    update() {
        this.move(); 
        this.draw();
    }

    draw(context) {

    }

    translate(dx, dy) {

    }

    move() {

    }
}