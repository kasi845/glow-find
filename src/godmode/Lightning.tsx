import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Lightning() {
    const ref = useRef<THREE.Line>(null);

    const points = [];
    for (let i = 0; i < 20; i++) {
        points.push(
            new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                i * -0.3,
                0
            )
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.z += 0.01;
            if (ref.current.material instanceof THREE.Material) {
                ref.current.material.opacity = Math.random();
                ref.current.material.transparent = true;
            }
        }
    });

    return (
        <line ref={ref} geometry={geometry}>
            <lineBasicMaterial color="#00ffff" linewidth={3} />
        </line>
    );
}
