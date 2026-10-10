'use client';

/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect, useEffect, useState } from 'react';
import { Color, Mesh } from 'three';

const normalizeHex = (hexOrName: string): string => {
  const lower = hexOrName.trim().toLowerCase().replace(/[\s-_]/g, '');
  if (lower === 'black') return '#000000';
  if (lower === 'white') return '#ffffff';
  if (lower === 'offwhite') return '#F4F1EA';
  if (!lower.startsWith('#')) return `#${lower}`;
  return lower;
};

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const cleanHex = normalizeHex(hex).replace('#', '');
  if (cleanHex.length === 3) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
      parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
      parseInt(cleanHex[2] + cleanHex[2], 16) / 255
    ];
  }
  return [
    parseInt(cleanHex.slice(0, 2), 16) / 255,
    parseInt(cleanHex.slice(2, 4), 16) / 255,
    parseInt(cleanHex.slice(4, 6), 16) / 255
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform vec3  uSheenColor;
uniform float uHasSheen;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

// Ultra-fast GPU friendly hash (no transcendentals)
float fastNoise(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = fastNoise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);

  if (uHasSheen > 0.5) {
    float fold = smoothstep(0.2, 0.95, pattern);
    float crest = pow(pattern, 2.5);
    float highlight = pow(pattern, 4.8);
    
    float colorLuma = dot(uColor, vec3(0.299, 0.587, 0.114));
    float sheenLuma = dot(uSheenColor, vec3(0.299, 0.587, 0.114));

    if (colorLuma <= sheenLuma) {
      // Dark / Equal base + Vibrant/Light Sheen (e.g. Black + Off-White or Black + Purple)
      vec3 baseCloth = uColor * (0.2 + 0.8 * fold);
      
      // When sheen is white/off-white (high luma), keep it delicate & tightly focused: "more black, very lil white"
      float isMonochromeLight = step(0.65, sheenLuma);
      
      // Delicate, sharp satin crests for white/off-white
      float sharpCrest = smoothstep(0.66, 0.98, pattern);
      float delicateRim = pow(smoothstep(0.42, 0.96, pattern), 3.2);
      vec3 lightSheen = uSheenColor * (delicateRim * 0.22 + sharpCrest * 0.42);
      vec3 lightGlint = vec3(1.0) * pow(smoothstep(0.74, 0.99, pattern), 5.2) * 0.3;
      
      // Rich full-body wash for colored sheens (e.g. Purple)
      vec3 coloredSheen = uSheenColor * (crest * 0.95 + highlight * 0.45);
      vec3 coloredGlint = mix(uSheenColor, vec3(1.0), 0.5) * pow(pattern, 7.5) * 0.6;
      
      vec3 sheenFolds = mix(coloredSheen, lightSheen, isMonochromeLight);
      vec3 specularGlint = mix(coloredGlint, lightGlint, isMonochromeLight);
      
      result = baseCloth + sheenFolds + specularGlint - vec3(grain);
    } else {
      // Light base + Dark Sheen (e.g. Off-White base + Black sheen)
      vec3 lightCloth = uColor * (0.85 + 0.15 * (1.0 - fold));
      vec3 darkSheen = mix(lightCloth, uSheenColor, crest * 0.88);
      vec3 shadowDepths = mix(darkSheen, uSheenColor, pow(1.0 - fold, 2.2) * 0.4);
      vec3 specularGlint = vec3(1.0) * pow(pattern, 6.0) * 0.28;
      result = shadowDepths + specularGlint - vec3(grain);
    }
  }

  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * 0.72;
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold);
    lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
    float fineNoise = fastNoise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = (rnd + fineNoise - 1.0);
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = lightBase + grainSignal * grainStrength;
  }
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

interface SilkPlaneProps {
  uniforms: any;
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref && 'current' in ref && ref.current) {
      const clampedDelta = Math.min(delta, 0.05);
      (ref.current.material as any).uniforms.uTime.value += 0.1 * clampedDelta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  sheenColor?: string;
  noiseIntensity?: number;
  rotation?: number;
  lightMode?: boolean;
}

const Silk: React.FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  sheenColor,
  noiseIntensity = 1.5,
  rotation = 0,
  lightMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<Mesh>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Performance: Pause rendering completely when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '120px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uSheenColor: { value: new Color(...hexToNormalizedRGB(sheenColor || color)) },
      uHasSheen: { value: sheenColor ? 1.0 : 0.0 },
      uRotation: { value: rotation },
      uLightMode: { value: lightMode ? 1 : 0 },
      uTime: { value: 0 }
    }),
    []
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color));
    uniforms.uSheenColor.value.setRGB(...hexToNormalizedRGB(sheenColor || color));
    uniforms.uHasSheen.value = sheenColor ? 1.0 : 0.0;
    uniforms.uRotation.value = rotation;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
  }, [speed, scale, noiseIntensity, color, sheenColor, rotation, lightMode, uniforms]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas
        dpr={1}
        frameloop={isVisible ? 'always' : 'never'}
        gl={{
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

export default Silk;
