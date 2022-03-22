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
function clamp01(v) {
    if (v > 1)
        return 1;
    if (v < 0)
        return 0;
    /*     */ return v;
}
function mapRange(value, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}
var center = new Vector2(innerWidth / 2, innerHeight / 2);
var radius = 150;
function drawAoe(center, radius, t) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fff3';
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius - 4, 0, Math.PI * 2);
    ctx.stroke();
    if (t <= 1) {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff05';
        ctx.arc(center.x, center.y, radius * t, 0, Math.PI * 2);
        ctx.fill();
    }
    var step = (Math.PI * 2) / 720;
    ctx.lineWidth = 4;
    for (var angle = 0; angle < Math.PI * (clamp01(t) * 2); angle += step) {
        ctx.beginPath();
        ctx.moveTo(center.x + Math.cos(angle) * (radius - 2), center.y + Math.sin(angle) * (radius - 2));
        ctx.lineTo(center.x + Math.cos(angle + step) * (radius - 2), center.y + Math.sin(angle + step) * (radius - 2));
        ctx.strokeStyle = "hsl(".concat((angle / (Math.PI * 2)) * 360, ",100%, 50%)");
        if (t > 1)
            ctx.strokeStyle = "hsl(".concat((angle / (Math.PI * 2)) * 360 + t * 360, ",100%, 50%)");
        ctx.stroke();
    }
}
var t = 0;
var lastTimeStamp = null;
function loop(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dt = timeStamp - lastTimeStamp || 0;
    t += dt / 700;
    if (t <= 2)
        drawAoe(center, radius, t);
    //CodeEND
    lastTimeStamp = timeStamp;
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    center.x = e.x;
    center.y = e.y;
    t = 0;
});
