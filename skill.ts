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

function mapRange(value: float, min1: float, max1: float, min2: float, max2: float): float {
	return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}

const start = new Vector2(40, 45)
const end = new Vector2(650, 220)
const width = 25

function drawProjectile(
	start: Vector2,
	end: Vector2,
	current: Vector2,
	width: float,
	t: float
): void {
	const path = new Vector2(end.x - start.x, end.y - start.y)
	const angle = Math.atan2(path.y, path.x)

	const widthOffset = new Vector2(
		Math.cos(angle + Math.PI / 2) * width,
		Math.sin(angle + Math.PI / 2) * width
	)

	ctx.beginPath()
	const lineGrad = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
	lineGrad.addColorStop(0, '#fff0')
	lineGrad.addColorStop(1, `hsl(${t * 360},100%,50%)`)
	ctx.strokeStyle = lineGrad
	ctx.lineCap = 'round'
	ctx.lineWidth = 5
	ctx.moveTo(start.x, start.y)
	ctx.lineTo(end.x, end.y)
	ctx.stroke()

	const leftStart = new Vector2(start.x - widthOffset.x, start.y - widthOffset.y)
	const leftEnd = new Vector2(end.x - widthOffset.x, end.y - widthOffset.y)
	const rightStart = new Vector2(start.x + widthOffset.x, start.y + widthOffset.y)
	const rightEnd = new Vector2(end.x + widthOffset.x, end.y + widthOffset.y)
	ctx.lineWidth = 2

	ctx.beginPath()
	ctx.moveTo(leftStart.x, leftStart.y)
	ctx.lineTo(leftEnd.x, leftEnd.y)
	ctx.lineTo(rightEnd.x, rightEnd.y)
	ctx.lineTo(rightStart.x, rightStart.y)
	ctx.stroke()

	ctx.beginPath()
	const projGrad = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
	projGrad.addColorStop(0, `hsl(${50},100%,50%)`)
	projGrad.addColorStop(1, `hsl(${35},100%,50%)`)
	ctx.strokeStyle = projGrad
	ctx.lineWidth = Math.min(12, 20 * t)
	ctx.arc(
		current.x - Math.cos(angle) * width,
		current.y - Math.sin(angle) * width,
		width,
		angle - 1,
		angle + 1
	)
	ctx.stroke()
}

let t = 0
let lastTimeStamp = null
function loop(timeStamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	const dt = timeStamp - lastTimeStamp || 0
	t += dt / 1000

	if (t <= 1) {
		const current = Vector2.lerp(start, end, t)
		drawProjectile(start, end, current, width, t)
	} else {
		ctx.beginPath()
		ctx.arc(start.x, start.y, 5, 0, Math.PI * 2)
		ctx.fill()

		ctx.beginPath()
		ctx.arc(end.x, end.y, 5, 0, Math.PI * 2)
		ctx.fill()
	}

	//CodeEND
	lastTimeStamp = timeStamp
	requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('contextmenu', (e) => {
	e.preventDefault()
	end.x = e.x
	end.y = e.y
	t = 0
})
