
let canvas, ctx, body;
const alpha = 180, beta = 17;
const particles = [];

window.onload = function() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 600;
    for (let i = 0; i < 600; i++) {
        particles.push(new Particle(random(20, canvas.width - 20), random(20, canvas.height - 20)));
    }
    ctx = canvas.getContext('2d');
    setInterval(draw, 16);
}

function draw() {
    background('black');
    particles.forEach(particle => {
		particle.draw();
	});
}

function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('mousedown', e => {
    particles.push(new Particle(e.clientX, e.clientY));
});

class Particle {
    static green = '#00FF00';
    static blue = '#0000FF';
    static yellow = '#FFE100';
    static brown = '#A52A2A';
    static size = 5;
    static velocity = 3.65;
    static radius = 45;
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.angle = random(0, 360);
    }
    draw() {
		let r = this.getRightNeighbors();
		let l = this.getLeftNeighbors();
        let n = l + r;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, Particle.size, 0, 2 * Math.PI);
        if (n >= 13 && n <= 15) {
			ctx.fillStyle = Particle.brown;
            ctx.fill();
		}
		else
		if (n > 15 && n <= 35) {
			ctx.fillStyle = Particle.blue;
            ctx.fill();
		}
		else
		if (n > 35) {
			ctx.fillStyle = Particle.yellow;
            ctx.fill();
		}
		else {
			ctx.fillStyle = Particle.green;
            ctx.fill();
        }
        ctx.stroke();
		let delta_phi = alpha + beta * n * Math.sign(r - l);
		let x = Particle.velocity * Math.cos(radians(this.angle));
		let y = Particle.velocity * Math.sin(radians(this.angle));
		let v = new Vector(x, y);
		v.rotate(delta_phi);
		this.angle += delta_phi;
		this.position.add(v);
		this.position.x = constrain(this.position.x, 20, canvas.width - 20);
		this.position.y = constrain(this.position.y, 20, canvas.height - 20);
    }
    getRightNeighbors() {
		let count = 0;
		for (let i = 0; i < particles.length; i++) {
			if (particles[i] != this && this.position.distance(particles[i].position) <= Particle.radius) {
				if (!this.isLeftNeighbor(particles[i].position)) {
					count++;
				}
			}
		}
		return count;
	}
	getLeftNeighbors() {
		let count = 0;
		for (let i = 0; i < particles.length; i++) {
			if (particles[i] != this && this.position.distance(particles[i].position) <= Particle.radius) {
				if (this.isLeftNeighbor(particles[i].position)) {
					count++;
				}
			}
		}
		return count;
	}
	isLeftNeighbor(vector) {
        let p1 = new Vector(this.position.x + Particle.radius * Math.cos(radians(this.angle)),  this.position.y + Particle.radius * Math.sin(radians(this.angle)));
		let p2 = new Vector(this.position.x + Particle.radius * Math.cos(radians(this.angle + 180)),  this.position.y + Particle.radius * Math.sin(radians(this.angle + 180)));
		return (p2.x - p1.x) * (vector.y - p1.y) - (p2.y - p1.y) * (vector.x - p1.x) < 0;
	}
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    } 
    rotate(angle) {
        let dx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let dy = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = dx;
        this.y = dy;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    distance(vector) {
        return Math.sqrt((Math.pow((this.x - vector.x), 2)) + (Math.pow((this.y - vector.y), 2)));
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function radians(deg) {
    return deg * (Math.PI / 180);
}

function constrain(x, low, high) {
    return Math.max(Math.min(x, high), low);
}