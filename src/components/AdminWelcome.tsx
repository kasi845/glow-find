import { useEffect, useRef } from "react";
import "./AdminWelcome.css";
import { useNavigate } from "react-router-dom";

const AdminWelcome = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Admin Welcome Mounted");
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas ref is null");
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Canvas context 2d failed");
            return;
        }

        // Force canvas size (sometimes innerHeight is wonky on load)
        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', handleResize);

        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            size: number;
            color: string;
            speedX: number;
            speedY: number;
            life: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.color = `hsl(${Math.random() * 360},100%,60%)`;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 6 - 3;
                this.life = 80;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const createFirework = () => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.6;
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle(x, y));
            }
        };

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                if (p.life <= 0) particles.splice(i, 1);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const blastInterval = setInterval(createFirework, 450);
        animate();

        const timeoutId = setTimeout(() => {
            clearInterval(blastInterval);
            navigate("/admin"); // Redirect to Dashboard
        }, 5000);

        return () => {
            clearInterval(blastInterval);
            clearTimeout(timeoutId);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [navigate]);

    return (
        <div className="admin-welcome" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'radial-gradient(circle at top, #0f2027, #000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }}></canvas>

            <div className="text-box" style={{ zIndex: 100000, color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem' }}>Welcome Back</h1>
                <h2 style={{ fontSize: '4rem', color: 'gold' }}>ADMIN 🚀</h2>
            </div>
        </div>
    );
};

export default AdminWelcome;
