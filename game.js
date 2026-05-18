class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(k) { this.x *= k; this.y *= k; }
    add(v) {  }
};

class GameObject {
    constructor(x, y, velocity) {
        this.isActive = true;
        this.x = x;
        this.y = y;
        this.v = velocity;
    }

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