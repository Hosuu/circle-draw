var canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.append(canvas);
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
var vector2 = /** @class */ (function () {
    function vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    return vector2;
}());
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.prototype.toString = function () {
        return "rgb(".concat(this.r, ",").concat(this.g, ", ").concat(this.b, ")");
    };
    Color.lerp = function (c1, c2, t) {
        var r = c1.r + (c2.r - c1.r) * t;
        var g = c1.g + (c2.g - c1.g) * t;
        var b = c1.b + (c2.b - c1.b) * t;
        return new Color(r, g, b);
    };
    return Color;
}());
function mapRange(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}
var center = new vector2(innerWidth / 2, innerHeight / 2);
var radius = Math.min(innerHeight, innerWidth) / 2 - 50;
var c1 = new Color(255, 0, 255);
var c2 = new Color(0, 255, 255);
var gradientIterations = 4;
var drawingSteps = 360;
var rotationSpeed = 5;
var newTech = true;
console.log('%cEditable variables:', 'font-size: 1.5rem');
console.log('%cgradientIterations %c[int]', 'font-style: italic; font-size: 1.2em', 'color: orange');
console.log('%cdrawingSteps %c[int]', 'font-style: italic; font-size: 1.2em', 'color: orange');
console.log('%crotationSpeed %c[float]', 'font-style: italic; font-size: 1.2em', 'color: orange');
console.log('%cnewTech %c[bool]', 'font-style: italic; font-size: 1.2em', 'color: orange');
function drawCircle(center, radius, gradientIterations, color, color2, drawingSteps, rotationSpeed) {
    var PI2 = Math.PI * 2;
    var segments = gradientIterations * 2;
    var segmentSize = PI2 / segments;
    var segmentStepSize = PI2 / drawingSteps;
    var timeOffset = (Date.now() / 10000) * rotationSpeed;
    for (var seg = 0; seg < segments; seg++) {
        var segmentOffset = segmentSize * seg;
        for (var angle = 0; angle < segmentSize; angle += segmentStepSize) {
            var lineStart = new vector2(center.x + Math.cos(angle + segmentOffset + timeOffset) * radius, center.y + Math.sin(angle + segmentOffset + timeOffset) * radius);
            var lineEnd = new vector2(center.x + Math.cos(angle + segmentStepSize + segmentOffset + timeOffset) * radius, center.y + Math.sin(angle + segmentStepSize + segmentOffset + timeOffset) * radius);
            var colorT = newTech
                ? mapRange((angle * 2 + segmentStepSize) / 2, 0, segmentSize, 0, 1)
                : mapRange(angle, 0, segmentSize, 0, 1);
            var lineColor = seg % 2 == 0 ? Color.lerp(color, color2, colorT) : Color.lerp(color2, color, colorT);
            ctx.beginPath();
            ctx.lineWidth = 50;
            ctx.lineCap = 'round';
            ctx.strokeStyle = lineColor.toString();
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(lineEnd.x, lineEnd.y);
            ctx.stroke();
        }
    }
}
//rgb(3, 0, 31), rgb(115, 3, 192), rgb(236, 56, 188), rgb(253, 239, 249)
/*
        new Color(3, 0, 31),
        new Color(115, 3, 192),
        new Color(246, 56, 188),
        new Color(255, 0, 0),
        new Color(246, 56, 188),
        new Color(115, 3, 192),
        new Color(3, 0, 31),
*/
var circleOptions = {
    colors: [
        new Color(15, 09, 45),
        new Color(115, 3, 192),
        new Color(246, 56, 188),
        new Color(255, 0, 0),
        new Color(246, 56, 188),
        new Color(115, 3, 192),
        new Color(15, 9, 45),
    ],
    thickness: 35,
    rotationSpeed: 25,
    drawingSteps: 720
};
function getGradientAt(colors, t) {
    var startIndex = Math.floor(t);
    var endIndex = Math.min(colors.length - 1, startIndex + 1);
    return Color.lerp(colors[startIndex], colors[endIndex], t - startIndex);
}
function newDrawCircle(center, radius, options) {
    var PI2 = Math.PI * 2;
    var drawingStep = PI2 / options.drawingSteps;
    var timeOffset = (Date.now() / 10000) * options.rotationSpeed;
    for (var angle = 0; angle < PI2; angle += drawingStep) {
        var start_1 = new vector2(center.x + Math.cos(angle + timeOffset) * radius, center.y + Math.sin(angle + timeOffset) * radius);
        var end_1 = new vector2(center.x + Math.cos(angle + drawingStep + timeOffset) * radius, center.y + Math.sin(angle + drawingStep + timeOffset) * radius);
        var avgAngle = angle + drawingStep / 2;
        var gradientT = mapRange(avgAngle, 0, PI2, 0, options.colors.length - 1);
        ctx.beginPath();
        ctx.lineWidth = options.thickness + Math.cos(timeOffset) * 5;
        ctx.lineCap = 'square';
        // ctx.strokeStyle = getGradientAt(options.colors, gradientT).toString()
        ctx.strokeStyle = "hsl(".concat((angle / PI2) * 360, ",100%,50%)");
        ctx.moveTo(start_1.x, start_1.y);
        ctx.lineTo(end_1.x, end_1.y);
        ctx.stroke();
    }
}
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // drawCircle(center, radius, gradientIterations, c1, c2, drawingSteps, rotationSpeed)
    newDrawCircle(center, radius, circleOptions);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
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
