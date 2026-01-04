import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial } from "three";
import { useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Lightning from "./Lightning";
import Hologram from "./Hologram";
import { TextShader } from "./TextMorphShader";
import { playMusic } from "./useMusicSync";
import "./omnipotent.css";
import * as THREE from "three";
import { ErrorBoundary } from "../components/ErrorBoundary";

function MorphText() {
    const ref = useRef<ShaderMaterial>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.uniforms.time.value = clock.elapsedTime;
        }
    });

    return (
        <mesh position={[0, 1, 0]}>
            <planeGeometry args={[4, 1]} />
            <shaderMaterial ref={ref} {...TextShader} />
        </mesh>
    );
}

function Experience({ onComplete }: { onComplete: () => void }) {
    const { camera } = useThree();

    useEffect(() => {
        try {
            playMusic(() => {
                if (camera) camera.position.z -= 0.05;
            });
        } catch (e) {
            console.error("Music failed", e);
        }

        if (camera) {
            gsap.to(camera.position, {
                z: 3,
                duration: 6,
                ease: "power4.out"
            });
        }

        const timer = setTimeout(onComplete, 9500);
        return () => clearTimeout(timer);
    }, [camera, onComplete]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} />
            <MorphText />
            <Lightning />
            <Hologram />
        </>
    );
}

export default function OmnipotentAdmin() {
    const navigate = useNavigate();

    return (
        <ErrorBoundary>
            <div className="omni" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999 }}>
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <Suspense fallback={null}>
                        <Experience onComplete={() => navigate("/admin")} />
                    </Suspense>
                </Canvas>

                <div className="overlay" style={{ zIndex: 100000 }}>
                    <h1>WELCOME BACK</h1>
                    <h2>ADMIN</h2>
                </div>
            </div>
        </ErrorBoundary>
    );
}
