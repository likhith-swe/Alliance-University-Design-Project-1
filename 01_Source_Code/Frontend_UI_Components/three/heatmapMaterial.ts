import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

export const HEATMAP_MODES = ["thermal", "occupancy", "energy"] as const;
export type HeatmapMode = (typeof HEATMAP_MODES)[number];

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uMode;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uAccent;
  uniform float uHover;
  uniform float uSelected;
  uniform float uFloorSpan;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  vec3 thermalRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 cool = vec3(0.18, 0.22, 0.30);       // Deep Slate
    vec3 warm = vec3(0.90, 0.72, 0.53);       // Warm Champagne
    vec3 hot = vec3(0.82, 0.38, 0.30);        // Terracotta Red
    if (t < 0.5) return mix(cool, warm, t * 2.0);
    return mix(warm, hot, (t - 0.5) * 2.0);
  }

  vec3 occupancyRamp(float t) {
    vec3 sage = vec3(0.52, 0.64, 0.59);        // Botanical Sage
    vec3 champagne = vec3(0.90, 0.72, 0.53);   // Warm Champagne
    vec3 busy = vec3(0.85, 0.45, 0.35);        // Warm Terracotta
    if (t < 0.5) return mix(sage, champagne, t * 2.0);
    return mix(champagne, busy, (t - 0.5) * 2.0);
  }

  vec3 energyRamp(float t, float pulse) {
    vec3 baseDark = vec3(0.12, 0.14, 0.18);    // Deep Velvet Obsidian
    vec3 amber = vec3(0.88, 0.62, 0.35);       // Solar Amber
    vec3 gold = vec3(0.95, 0.78, 0.55);        // Radiant Champagne
    vec3 base = mix(baseDark, amber, t);
    return base + pulse * (gold * 0.4);
  }

  void main() {
    float t = clamp(uIntensity, 0.0, 1.0);
    vec3 dataColor;
    if (uMode < 0.5) {
      dataColor = thermalRamp(t);
    } else if (uMode < 1.5) {
      dataColor = occupancyRamp(t);
    } else {
      float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + vWorldPos.y * 1.4);
      dataColor = energyRamp(t, pulse * 0.6);
    }

    vec3 n = normalize(vNormal);
    float lambert = max(dot(n, normalize(vec3(0.4, 1.0, 0.35))), 0.15);
    float isTop = smoothstep(0.65, 0.95, n.y);

    // Architectural Slate Wall base
    vec3 wallColor = vec3(0.085, 0.105, 0.145) * (0.6 + 0.4 * lambert);

    // Window grid pattern (vertical mullions & floor divisions)
    float floors = max(uFloorSpan, 1.0);
    float floorFrac = fract(vUv.y * floors);
    float winY = step(0.20, floorFrac) * step(floorFrac, 0.82);
    float winX = step(0.32, fract(vUv.x * 14.0));
    float isWindow = winX * winY * (1.0 - isTop);

    // Glass reflection + interior telemetry illumination
    vec3 windowTint = vec3(0.05, 0.07, 0.11);
    float interiorPulse = 0.85 + 0.15 * sin(uTime * 1.8 + vWorldPos.x * 2.1 + vWorldPos.z * 1.5);
    vec3 windowGlow = mix(windowTint, dataColor, 0.55 + 0.45 * t) * interiorPulse;

    // Floor slab bands (horizontal structural lines)
    float slabLine = (step(0.92, floorFrac) + step(floorFrac, 0.08)) * (1.0 - isTop);
    vec3 slabColor = vec3(0.18, 0.22, 0.29) + uAccent * 0.08;

    // Compose facade
    vec3 surface = mix(wallColor, slabColor, slabLine * 0.6);
    surface = mix(surface, windowGlow, isWindow * 0.92);

    // Matte dark roof for top faces
    vec3 roofColor = vec3(0.07, 0.09, 0.12);
    surface = mix(surface, roofColor, isTop);

    // Subtle edge rim light for elegance
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
    surface += fres * (uAccent * 0.28 + vec3(0.08)) * (0.5 + uHover * 0.8 + uSelected * 0.6);

    // Active hover and selection feedback
    surface += uHover * uAccent * 0.12;
    surface += uSelected * uAccent * 0.22;

    gl_FragColor = vec4(surface, 1.0);
  }
`;

export const HeatmapMaterialImpl = shaderMaterial(
  {
    uMode: 0,
    uTime: 0,
    uIntensity: 0.4,
    uAccent: new THREE.Color("#e5b887"),
    uHover: 0,
    uSelected: 0,
    uFloorSpan: 1,
  },
  vertexShader,
  fragmentShader
);

extend({ HeatmapMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    heatmapMaterialImpl: ThreeElement<typeof HeatmapMaterialImpl>;
  }
}
