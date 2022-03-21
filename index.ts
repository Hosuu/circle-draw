const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.append(canvas)
const ctx = canvas.getContext('2d')

type int = number
type float = number

class vector2 {
	public x: float
	public y: float

	constructor(x: float, y: float) {
		this.x = x
		this.y = y
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

function mapRange(value: float, min1: float, max1: float, min2: float, max2: float): float {
	return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}

const center = new vector2(innerWidth / 2, innerHeight / 2)
const radius = Math.min(innerHeight, innerWidth) / 2 - 10
const c1 = new Color(255, 0, 255)
const c2 = new Color(0, 255, 255)
let gradientIterations = 4
let drawingSteps = 180
let rotationSpeed = 5
let newTech = true

console.log('%cEditable variables:', 'font-size: 1.5rem')
console.log('%cgradientIterations %c[int]', 'font-style: italic; font-size: 1.2em', 'color: orange')
console.log('%cdrawingSteps %c[int]', 'font-style: italic; font-size: 1.2em', 'color: orange')
console.log('%crotationSpeed %c[float]', 'font-style: italic; font-size: 1.2em', 'color: orange')
console.log('%cnewTech %c[bool]', 'font-style: italic; font-size: 1.2em', 'color: orange')

function drawCircle(
	center: vector2,
	radius: float,
	gradientIterations: int,
	color: Color,
	color2: Color,
	drawingSteps: int,
	rotationSpeed: float
): void {
	const PI2: float = Math.PI * 2

	const segments = gradientIterations * 2
	const segmentSize: float = PI2 / segments
	const segmentStepSize: float = PI2 / drawingSteps

	const timeOffset: float = (Date.now() / 10000) * rotationSpeed

	for (let seg: int = 0; seg < segments; seg++) {
		const segmentOffset: float = segmentSize * seg

		for (let angle: float = 0; angle < segmentSize; angle += segmentStepSize) {
			const lineStart = new vector2(
				center.x + Math.cos(angle + segmentOffset + timeOffset) * radius,
				center.y + Math.sin(angle + segmentOffset + timeOffset) * radius
			)
			const lineEnd = new vector2(
				center.x + Math.cos(angle + segmentStepSize + segmentOffset + timeOffset) * radius,
				center.y + Math.sin(angle + segmentStepSize + segmentOffset + timeOffset) * radius
			)

			const colorT = newTech
				? mapRange((angle * 2 + segmentStepSize) / 2, 0, segmentSize, 0, 1)
				: mapRange(angle, 0, segmentSize, 0, 1)

			const lineColor =
				seg % 2 == 0 ? Color.lerp(color, color2, colorT) : Color.lerp(color2, color, colorT)

			ctx.beginPath()
			ctx.lineWidth = 5
			ctx.strokeStyle = lineColor.toString()
			ctx.moveTo(lineStart.x, lineStart.y)
			ctx.lineTo(lineEnd.x, lineEnd.y)
			ctx.stroke()
		}
	}
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawCircle(center, radius, gradientIterations, c1, c2, drawingSteps, rotationSpeed)
	requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

/*
void Drawings::DrawCircle3DGradient(Vector3 center, float radius, int numOfGradients, Vector3 color, Vector3 color2, int drawingSteps, float rotationSpeed)
{
  const static float PI2 = 3.14159265f * 2.f;

  int circleSegmentSize = (PI2 / (numOfGradients * 2));
  int segmentDrawingStepSize = (PI2 / drawingSteps) / (numOfGradients * 2);

  float angleOffset = ((1.f / 10000.f * Utils::GetGameTime() ) - (floorf(1.f / 10000.f * Utils::GetGameTime())))
  float currentOffset = angleOffset * rotationSpeed;

  for (int seg = 0; seg < numOfGradients * 2; seg++) {
    for (float angle = 0; angle <= circleSegmentSize - segmentDrawingStepSize; angle += segmentDrawingStepSize) {

      Vector3 vStart(center.X + cosf(angle + circleSegmentSize * seg + currentOffset ) * radius, center.Y, center.Z + sinf(angle + circleSegmentSize * seg + currentOffset) * radius);
      Vector3 vEnd(center.X + cosf(angle + precision + circleSegmentSize * seg + currentOffset) * radius, center.Y, center.Z + sinf(angle + precision + circleSegmentSize * seg + currentOffset) * radius);
      Vector2 lineStart = Utils::WorldToScreen(vStart);
      Vector2 lineEnd = Utils::WorldToScreen(vEnd);

      float colorT = mapRange(angle, 0, circleSegmentSize, 0, 1);
      ImColor colorOg = seg % 2 == 0 ? GetGradientColor(color, color2, colorT) : GetGradientColor(color2, color, colorT);

      ImGui::GetWindowDrawList()->AddLine(ImVec2(lineStart.X, lineStart.Y), ImVec2(lineEnd.X, lineEnd.Y), colorOg);
    }
  }
}

*/

// function drawCircle(center: vector2, radius: float, thickness, gradient, rotationSpeed): void {}
