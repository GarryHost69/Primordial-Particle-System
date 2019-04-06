var alpha_ = 180, beta_ = 17;
var particles = [];
var blucol;
var grecol;
var yelcol;
var brocol;

function setup() {
	createCanvas(windowWidth, windowHeight);
	blucol = color(0, 0, 255);
	grecol = color(0, 255, 0);
	yelcol = color(255, 225, 0);
	brocol = color(165, 42, 42);
	for (let i = 20; i < windowWidth - 20; i += 40) {
		for (let j = 20; j < windowHeight - 20; j += 40) {
			particles.push(new Particle(i, j));
		}
	}
}

function draw() {
	background(0);
	particles.forEach(particle => {
		particle.draw();
	});
}

function mouseClicked() {
	particles.push(new Particle(mouseX, mouseY));
}

class Particle {
	constructor(x, y) {
		this.position = createVector(x, y);
		this.size = 7;
		this.radius = 80;
		this.velocity = 5.68;
		this.col = grecol;
		this.angle = random(0, 360);
	}
	draw() {
		fill(this.col);
		ellipse(this.position.x, this.position.y, this.size);
		var r = this.getRightNeighbors();
		var l = this.getLeftNeighbors();
		var n = l + r;
		var delta_phi = alpha_ + beta_ * n * Math.sign(r - l);
		let x = this.velocity * cos(radians(this.angle));
		let y = this.velocity * sin(radians(this.angle));
		let v = createVector(x, y);
		v.rotate(delta_phi);
		this.angle += delta_phi;
		this.position.add(v);
		if (n >= 13 && n <= 15) {
			this.col = brocol;
		}
		else
		if (n > 15 && n <= 35) {
			this.col = blucol;
		}
		else
		if (n > 35) {
			this.col = yelcol;
		}
		else {
			this.col = grecol;
		}
		this.position.x = constrain(this.position.x, 20, windowWidth - 20);
		this.position.y = constrain(this.position.y, 20, windowHeight - 20);
	}
	getRightNeighbors() {
		let count = 0;
		for (let i = 0; i < particles.length; i++) {
			if (particles[i] != this && this.position.dist(particles[i].position) <= this.radius) {
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
			if (particles[i] != this && this.position.dist(particles[i].position) <= this.radius) {
				if (this.isLeftNeighbor(particles[i].position)) {
					count++;
				}
			}
		}
		return count;
	}
	isLeftNeighbor(c) {
		let a = createVector(this.position.x + this.radius * cos(radians(90)),  this.position.y + this.radius * sin(radians(90)));
		let b = createVector(this.position.x + this.radius * cos(radians(270)),  this.position.y + this.radius * sin(radians(270)));
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;
	}
}
