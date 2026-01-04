export const TextShader = {
    uniforms: {
        time: { value: 0 }
    },
    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(time + pos.x * 5.0) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
  `
};
