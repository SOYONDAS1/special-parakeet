const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particles.forEach(p => {

        p.angle += p.speed;

        const dx = mouse.x - cx;
        const dy = mouse.y - cy;

        const mx = dx * 0.08;
        const my = dy * 0.08;

        const r = p.radius + Math.sin(p.angle * 4) * 25;

        const x = cx + mx + Math.cos(p.angle) * r;
        const y = cy + my + Math.sin(p.angle * 2) * r * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        const color = `hsl(${(p.angle * 180 / Math.PI) % 360},100%,70%)`;

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fill();

    });

    requestAnimationFrame(draw);
}

draw();
