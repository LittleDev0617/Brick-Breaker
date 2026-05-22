class Transform {
    constructor(x, y, width, height, pivotX=0.5, pivotY=0.5, velocity=0, radian=0) {        
        this.x = x;
        this.y = y;
        this.pivotX = pivotX;
        this.pivotY = pivotY;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.radian = radian;
        this.parent = null;
    }
    
    get left() { return this.x - this.width * this.pivotX };
    get top()  { return this.y - this.height * this.pivotY };
    get right() { return this.left + this.width };
    get bottom() { return this.top + this.height };
    get offsetX() { return -this.width * this.pivotX; }
    get offsetY() { return -this.height * this.pivotY; }

    copy() {
        let result = new Transform(
            this.x, this.y, this.width, this.height, this.pivotX, this.pivotY, this.velocity, this.radian
        );
        result.parent = this.parent;
        return result;
    }

    getAbsolute() {
        let result = this.copy();
        let transform = this;
        while (transform.parent != null) {
            transform = transform.parent;
            
            result.x += transform.x;
            result.y += transform.y;
        }

        return result;
    }

    translate() {}
    rotate() {

    }
}