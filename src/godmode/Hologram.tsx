import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import * as THREE from 'three';

export default function Hologram() {
    const ref = useRef<Mesh>(null);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.005;
            if (ref.current.material instanceof THREE.Material) {
                // Pulse opacity
                ref.current.material.opacity = 0.5 + Math.sin(Date.now() * 0.002) * 0.2;
                ref.current.material.transparent = true;
                ref.current.material.side = THREE.DoubleSide; // Visible from both sides
            }
        }
    });

    return (
        <mesh ref={ref} position={[0, -1, 0]}>
            <planeGeometry args={[2, 2]} />
            {/* Replaced Texture with simple wireframe/color for stability */}
            <meshBasicMaterial
                color="#00ffff"
                wireframe={true}
                transparent
            />
        </mesh>
    );
}
