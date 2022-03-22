var canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.append(canvas);
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.lerp = function (v1, v2, t) {
        var x = lerp(v1.x, v2.x, t);
        var y = lerp(v1.y, v2.y, t);
        return new Vector2(x, y);
    };
    return Vector2;
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
function lerp(v1, v2, t) {
    return v1 + (v2 - v1) * t;
}
function mapRange(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}
var start = new Vector2(40, 45);
var end = new Vector2(650, 220);
var width = 25;
function drawProjectile(start, end, current, width, t) {
    var path = new Vector2(end.x - start.x, end.y - start.y);
    var angle = Math.atan2(path.y, path.x);
    var widthOffset = new Vector2(Math.cos(angle + Math.PI / 2) * width, Math.sin(angle + Math.PI / 2) * width);
    ctx.beginPath();
    var lineGrad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    lineGrad.addColorStop(0, '#fff0');
    lineGrad.addColorStop(1, "hsl(".concat(t * 360, ",100%,50%)"));
    ctx.strokeStyle = lineGrad;
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    var leftStart = new Vector2(start.x - widthOffset.x, start.y - widthOffset.y);
    var leftEnd = new Vector2(end.x - widthOffset.x, end.y - widthOffset.y);
    var rightStart = new Vector2(start.x + widthOffset.x, start.y + widthOffset.y);
    var rightEnd = new Vector2(end.x + widthOffset.x, end.y + widthOffset.y);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftStart.x, leftStart.y);
    ctx.lineTo(leftEnd.x, leftEnd.y);
    ctx.lineTo(rightEnd.x, rightEnd.y);
    ctx.lineTo(rightStart.x, rightStart.y);
    ctx.stroke();
    ctx.beginPath();
    var projGrad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    projGrad.addColorStop(0, "hsl(".concat(50, ",100%,50%)"));
    projGrad.addColorStop(1, "hsl(".concat(35, ",100%,50%)"));
    ctx.strokeStyle = projGrad;
    ctx.lineWidth = Math.min(12, 20 * t);
    ctx.arc(current.x - Math.cos(angle) * width, current.y - Math.sin(angle) * width, width, angle - 1, angle + 1);
    ctx.stroke();
}
var t = 0;
var lastTimeStamp = null;
function loop(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dt = timeStamp - lastTimeStamp || 0;
    t += dt / 1000;
    if (t <= 1) {
        var current = Vector2.lerp(start, end, t);
        drawProjectile(start, end, current, width, t);
    }
    else {
        ctx.beginPath();
        ctx.arc(start.x, start.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    //CodeEND
    lastTimeStamp = timeStamp;
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    end.x = e.x;
    end.y = e.y;
    t = 0;
});
