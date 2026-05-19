class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(k) { this.x *= k; this.y *= k; }
    add(v) {  }
};

class GameObject {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5) {
        this.isActive = true;
        this.transform = new Transform(x, y, width, height, pivotX, pivotY);
    }

    update() {
        this.move(); 
        this.draw();
    }

    draw(context) {

    }
}