class Effect extends ObjectT {

};

class Particle extends Effect {
    constructor(name, x, y, color, speed=1, scale=1, density=8, particleScale=1) {
        super(name, x, y, 50, 50);

        if (color == null)
            color = 'grey';
        
        const particleBoundary = scale * 64;
        const particleCount  = scale * density;
        const particleSize   = 5;
        
        this.count = particleCount;
        for (let i=0; i < particleCount; i++) {
            let _x = Math.random() * particleBoundary - particleBoundary;
            let _y = Math.random() * particleBoundary - particleBoundary;
            let size = particleScale * (Math.random() * particleSize + particleSize);            

            let particle = new UIRect(`${name}_particle`, _x, _y, size, size, color);
            particle.transform.radian = Math.random() * Math.PI * 2;
            particle.transform.velocity = new Vector2D(Math.random()*1 - 1, -4.5);

            particle.rigidbody = new Rigidbody(particle.transform, 9);
            particle.update = () => {
                particle.transform.y += particle.transform.velocity.y;
                particle.transform.x += particle.transform.velocity.x;
                if (particle.transform.getAbsolute().y > CANVAS_HEIGHT)
                    this.count--;
            }

            this.appendChild(particle);
        }
    }

    update() {
        if (this.count <= 0) {
            this.scene.removeObject(this.name);
        }
    }
}