const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.append(canvas)
const ctx = canvas.getContext('2d')

ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = 'high'

type int = number
type float = number

class Vector2 {
	public x: float
	public y: float

	constructor(x: float, y: float) {
		this.x = x
		this.y = y
	}

	public static lerp(v1: Vector2, v2: Vector2, t: number) {
		const x = lerp(v1.x, v2.x, t)
		const y = lerp(v1.y, v2.y, t)
		return new Vector2(x, y)
	}
}

class Color {
	public r: int
	public g: int
	public b: int
	constructor(r: int, g: int, b: int) {
		this.r = r
		this.g = g
		this.b = b
	}

	public toString() {
		return `rgb(${this.r},${this.g}, ${this.b})`
	}

	public static lerp(c1: Color, c2: Color, t: number) {
		const r = c1.r + (c2.r - c1.r) * t
		const g = c1.g + (c2.g - c1.g) * t
		const b = c1.b + (c2.b - c1.b) * t
		return new Color(r, g, b)
	}
}

function lerp(v1: number, v2: number, t: number): number {
	return v1 + (v2 - v1) * t
}

function clamp01(v: number): number {
	if (v > 1) return 1
	if (v < 0) return 0
	/*     */ return v
}

function mapRange(value: float, min1: float, max1: float, min2: float, max2: float): float {
	return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}

const center = new Vector2(innerWidth / 2, innerHeight / 2)
const radius = 150

function drawAoe(center: Vector2, radius: float, t: float): void {
	ctx.lineWidth = 1
	ctx.strokeStyle = '#fff3'
	ctx.beginPath()
	ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
	ctx.stroke()
	ctx.beginPath()
	ctx.arc(center.x, center.y, radius - 4, 0, Math.PI * 2)
	ctx.stroke()

	if (t <= 1) {
		ctx.beginPath()
		ctx.fillStyle = '#ffffff05'
		ctx.arc(center.x, center.y, radius * t, 0, Math.PI * 2)
		ctx.fill()
	}

	const step = (Math.PI * 2) / 720
	ctx.lineWidth = 4
	for (let angle = 0; angle < Math.PI * (clamp01(t) * 2); angle += step) {
		ctx.beginPath()
		ctx.moveTo(
			center.x + Math.cos(angle) * (radius - 2),
			center.y + Math.sin(angle) * (radius - 2)
		)
		ctx.lineTo(
			center.x + Math.cos(angle + step) * (radius - 2),
			center.y + Math.sin(angle + step) * (radius - 2)
		)

		ctx.strokeStyle = `hsl(${(angle / (Math.PI * 2)) * 360},100%, 50%)`
		if (t > 1) ctx.strokeStyle = `hsl(${(angle / (Math.PI * 2)) * 360 + t * 360},100%, 50%)`
		ctx.stroke()
	}
}

let t = 0
let lastTimeStamp = null
function loop(timeStamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	const dt = timeStamp - lastTimeStamp || 0
	t += dt / 700

	if (t <= 2) drawAoe(center, radius, t)

	//CodeEND
	lastTimeStamp = timeStamp
	requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('contextmenu', (e) => {
	e.preventDefault()
	center.x = e.x
	center.y = e.y
	t = 0
})
