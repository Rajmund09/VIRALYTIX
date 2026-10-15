'use client';

import React, { useEffect, useRef } from 'react';
import './Beams.css';

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uBeamWidth;
uniform float uWaveLength;
uniform float uRotation;
uniform float uSharpness;
uniform float uDepth;
uniform float uTwist;
uniform float uFillLight;
uniform float uGlow;
uniform float uBrightness;
uniform float uGrain;
uniform float uVariation;
uniform float uFade;
uniform float uOpacity;
uniform vec3  uColor;
uniform vec4  uPointer; // x, y, reach, radius
uniform float uMouseInteraction;

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  // Screen centered coordinates
  vec2 centered = gl_FragCoord.xy - uResolution * 0.5;

  // Rotate to specified rotation angle (e.g. 28 degrees)
  float rad = uRotation * 3.141592653589793 / 180.0;
  float cosA = cos(rad);
  float sinA = sin(rad);
  vec2 rot = vec2(cosA * centered.x - sinA * centered.y, sinA * centered.x + cosA * centered.y);

  // Discrete beam lane indexing
  float beamPos = rot.x / max(uBeamWidth, 10.0);
  float lane = floor(beamPos);
  float uInLane = fract(beamPos); // 0.0 to 1.0 across single beam

  // Dark grooves between beams (matching reference screenshot)
  float seamDist = min(uInLane, 1.0 - uInLane);
  float beamChannel = smoothstep(0.015, 0.09, seamDist);

  // Procedural wave ripple along each beam with wavelength & variation
  float waveK = 6.283185307 / max(uWaveLength, 20.0);
  float waveCoord = rot.y * waveK + lane * uVariation * 1.25 - uTime * uSpeed * 1.8;
  
  // Wave displacement & slope derivative
  float wave = sin(waveCoord) * 0.55 + sin(waveCoord * 2.15 + 1.2) * 0.25;
  float waveSlope = (cos(waveCoord) * 0.55 + 2.15 * cos(waveCoord * 2.15 + 1.2) * 0.25);
  waveSlope *= uDepth * 0.45;

  // Surface normal with twist
  float tilt = sin(uTime * 2.1 + lane * 0.5) * 0.2 * uTwist;
  vec3 normal = normalize(vec3(tilt, -waveSlope, 1.0));

  // Consistent directional light across parallel beams
  vec3 lightDir = normalize(vec3(0.15, 0.75, 0.9));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  float NdotH = max(dot(normal, halfDir), 0.0);
  float NdotL = max(dot(normal, lightDir), 0.0);

  // Sharpness controls specular concentration (0.0 soft satin to 1.0 glossy mirror)
  float shininess = mix(12.0, 90.0, clamp(uSharpness, 0.0, 1.0));
  float spec = pow(NdotH, shininess) * NdotL;

  // Secondary fill light from opposite side
  vec3 fillDir = normalize(vec3(-0.1, -0.6, 0.7));
  vec3 fillHalf = normalize(fillDir + viewDir);
  float fillSpec = pow(max(dot(normal, fillHalf), 0.0), shininess * 0.6) * uFillLight;

  // Soft metallic satin body
  float body = pow(max(dot(normal, vec3(0.0, 0.35, 0.95)), 0.0), 3.2) * 0.32;

  // Total luminance
  float beamLuma = (body + spec * 2.5 + fillSpec * 1.2) * beamChannel;

  // Deep pitch black contrast cutoff: wave valleys and seams drop to 0.0
  beamLuma = pow(max(beamLuma - 0.035, 0.0) / 0.965, 1.6);

  // Optional mouse interaction
  if (uMouseInteraction > 0.5) {
    vec2 toMouse = gl_FragCoord.xy - uPointer.xy;
    float dist = length(toMouse);
    float mouseGlow = exp(-dist * dist / max(2.0 * uPointer.w * uPointer.w, 1.0)) * uPointer.z;
    beamLuma *= (1.0 + mouseGlow * 1.2);
  }

  // Soft glow spread
  float softGlow = pow(max(body, 0.0), 1.8) * uGlow * 0.65;
  beamLuma += softGlow * beamChannel;

  // Color grading
  vec3 lightColor = uColor * beamLuma * uBrightness;
  // Glossy white specular peak
  lightColor += vec3(1.0) * pow(spec, 3.8) * 1.6 * beamChannel * uBrightness;

  // Film grain (proportional to illuminated beam surface so background stays pitch black)
  float grainNoise = (hash(gl_FragCoord.xy + fract(uTime * 0.05)) - 0.5) * uGrain * 0.08;
  vec3 finalColor = clamp(lightColor + grainNoise * min(beamLuma * 3.0, 1.0), 0.0, 1.0);

  // Fade edges if fade > 0
  if (uFade > 0.0) {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float edge = uFade * 0.5;
    float mask = smoothstep(0.0, edge, uv.x) * smoothstep(1.0, 1.0 - edge, uv.x) *
                 smoothstep(0.0, edge, uv.y) * smoothstep(1.0, 1.0 - edge, uv.y);
    finalColor *= mask;
  }

  finalColor *= uOpacity;
  outColor = vec4(finalColor, 1.0);
}
`;

const parseHexOrColor = (value: string): [number, number, number] => {
  if (value.startsWith('#')) {
    let hex = value.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      const r = ((num >> 16) & 255) / 255;
      const g = ((num >> 8) & 255) / 255;
      const b = (num & 255) / 255;
      return [r, g, b];
    }
  }
  return [1, 1, 1];
};

export interface BeamsProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  beamWidth?: number;
  rotation?: number;
  speed?: number;
  waveLength?: number;
  depth?: number;
  sharpness?: number;
  twist?: number;
  fillLight?: number;
  brightness?: number;
  glow?: number;
  grain?: number;
  variation?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  backgroundColor?: string;
  quality?: number;
  paused?: boolean;
  dpr?: number;
  className?: string;
}

export const Beams: React.FC<BeamsProps> = ({
  color = '#ffffff',
  beamWidth = 140,
  rotation = 28,
  speed = 1,
  waveLength = 233,
  depth = 1,
  sharpness = 0.6,
  twist = 0,
  fillLight = 0.3,
  brightness = 1.6,
  glow = 0.6,
  grain = 0.35,
  variation = 0,
  mouseInteraction = false,
  mouseStrength = 1,
  intro = false,
  fade = 0,
  opacity = 1,
  backgroundColor = '#000000',
  paused = false,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const propsRef = useRef({
    color,
    beamWidth,
    rotation,
    speed,
    waveLength,
    depth,
    sharpness,
    twist,
    fillLight,
    brightness,
    glow,
    grain,
    variation,
    mouseInteraction,
    mouseStrength,
    intro,
    fade,
    opacity,
    paused
  });
  propsRef.current = {
    color,
    beamWidth,
    rotation,
    speed,
    waveLength,
    depth,
    sharpness,
    twist,
    fillLight,
    brightness,
    glow,
    grain,
    variation,
    mouseInteraction,
    mouseStrength,
    intro,
    fade,
    opacity,
    paused
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s);
        console.error("SHADER_ERROR:", type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT", log);
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uSpeed = gl.getUniformLocation(program, 'uSpeed');
    const uBeamWidth = gl.getUniformLocation(program, 'uBeamWidth');
    const uWaveLength = gl.getUniformLocation(program, 'uWaveLength');
    const uRot = gl.getUniformLocation(program, 'uRotation');
    const uSharp = gl.getUniformLocation(program, 'uSharpness');
    const uDepth = gl.getUniformLocation(program, 'uDepth');
    const uTwist = gl.getUniformLocation(program, 'uTwist');
    const uFillLight = gl.getUniformLocation(program, 'uFillLight');
    const uGlow = gl.getUniformLocation(program, 'uGlow');
    const uBright = gl.getUniformLocation(program, 'uBrightness');
    const uGrain = gl.getUniformLocation(program, 'uGrain');
    const uVariation = gl.getUniformLocation(program, 'uVariation');
    const uFade = gl.getUniformLocation(program, 'uFade');
    const uOpacity = gl.getUniformLocation(program, 'uOpacity');
    const uColor = gl.getUniformLocation(program, 'uColor');
    const uPointer = gl.getUniformLocation(program, 'uPointer');
    const uMouseInter = gl.getUniformLocation(program, 'uMouseInteraction');

    // Full screen triangle
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let rafId = 0;
    let clock = 0;
    let lastTime = performance.now();
    let isVisible = true;

    const mouse = { x: 0, y: 0, reach: 0, targetReach: 0 };

    const resize = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!propsRef.current.mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        mouse.x = x * dpr;
        mouse.y = (rect.height - y) * dpr;
        mouse.targetReach = 1;
      } else {
        mouse.targetReach = 0;
      }
    };

    const onPointerLeave = () => {
      mouse.targetReach = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    resize();

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const p = propsRef.current;
      if (!p.paused) {
        clock += dt * p.speed;
      }

      mouse.reach += (mouse.targetReach - mouse.reach) * 0.1;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uSpeed, p.speed);
      gl.uniform1f(uBeamWidth, p.beamWidth * Math.min(window.devicePixelRatio || 1, 1.5));
      gl.uniform1f(uWaveLength, p.waveLength * Math.min(window.devicePixelRatio || 1, 1.5));
      gl.uniform1f(uRot, p.rotation);
      gl.uniform1f(uSharp, p.sharpness);
      gl.uniform1f(uDepth, p.depth);
      gl.uniform1f(uTwist, p.twist);
      gl.uniform1f(uFillLight, p.fillLight);
      gl.uniform1f(uGlow, p.glow);
      gl.uniform1f(uBright, p.brightness);
      gl.uniform1f(uGrain, p.grain);
      gl.uniform1f(uVariation, p.variation);
      gl.uniform1f(uFade, p.fade);
      gl.uniform1f(uOpacity, p.opacity);

      const rgb = parseHexOrColor(p.color);
      gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);

      const reachVal = p.mouseInteraction ? mouse.reach * p.mouseStrength : 0;
      gl.uniform4f(uPointer, mouse.x, mouse.y, reachVal, Math.max(canvas.width, canvas.height) * 0.22);
      gl.uniform1f(uMouseInter, p.mouseInteraction ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`beams-container${className ? ` ${className}` : ''}`}
      style={{ backgroundColor: backgroundColor || '#000000', ...style }}
      {...rest}
    >
      <canvas ref={canvasRef} className="beams-canvas" aria-hidden="true" />
    </div>
  );
};

export default Beams;
