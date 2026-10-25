// Engraved / stippled ink look: black ground, white stipple driven by light,
// angular "bark" engraving lines, bright rim edges, and screen-space white outlines.
const HEAD = `
uniform float uPx; uniform float uGain; uniform float uGamma; uniform float uLines; uniform float uRim; uniform float uGround; uniform float uInv; uniform float uInvBase;
varying vec3 vWPe;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
`;
export function material(THREE, mat, o = {}) {
  const u = {
    uPx: { value: o.dot ?? 1.0 },
    uGain: { value: o.gain ?? 0.5 }, uGamma: { value: o.gamma ?? 1.6 },
    uLines: { value: o.lines === false ? 0 : (o.lineDensity ?? 72) },
    uRim: { value: o.rim === false ? 0 : 1 }, uGround: { value: o.ground ?? 0 }, uInv: { value: o.invert ? 1 : 0 }, uInvBase: { value: o.invBase ?? 0.38 },
  };
  mat.userData.engrave = u;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = 'varying vec3 vWPe;\n' + sh.vertexShader.replace('#include <project_vertex>',
      '#include <project_vertex>\n vWPe = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = HEAD + sh.fragmentShader.replace('#include <opaque_fragment>', `
      float lum = dot(outgoingLight, vec3(0.299, 0.587, 0.114));
      float tone = clamp(pow(lum * uGain, uGamma), 0.0, 1.0);
      if (uInv > 0.5) tone = mix(uInvBase, 0.97, clamp(1.0 - pow(clamp(lum * uGain * 1.6, 0.0, 1.0), 0.55), 0.0, 1.0));
      vec2 cell = floor(gl_FragCoord.xy / uPx);
      float dots = step(h21(cell), tone) * (uInv > 0.5 ? 0.78 : 0.62);
      float ink = 0.0;
      if (uLines > 0.0) {
        float x = atan(vWPe.z + 0.05, vWPe.x) * uLines / 6.2831853 + vWPe.y * 0.35;
        float w = fwidth(x);
        float g = abs(fract(x) - 0.5);
        float ln = 1.0 - smoothstep(0.04, 0.04 + w * 1.5, g);
        ln *= 1.0 - smoothstep(0.2, 0.45, w);
        ink = max(ink, ln * (0.18 + 0.82 * smoothstep(0.0, 0.3, tone)) * 0.85);
      }
      if (uRim > 0.0) {
        float rimF = 1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
        ink = max(ink, smoothstep(0.72, 0.9, rimF) * (0.55 + 0.45 * smoothstep(0.0, 0.2, tone)));
      }
      float alpha = diffuseColor.a;
      if (uGround > 0.0) alpha *= 1.0 - smoothstep(uGround * 0.45, uGround, length(vWPe.xz));
      float v = max(dots, ink);
      vec3 col = uInv > 0.5 ? mix(vec3(0.965, 0.96, 0.95), vec3(0.09, 0.09, 0.09), v) : vec3(v) * vec3(0.93, 0.92, 0.89);
      gl_FragColor = vec4(col, alpha);`);
  };
  mat.customProgramCacheKey = () => 'engrave' + (o.invert ? 'i' : '') + (o.ground ? 'g' : '') + (o.lines === false ? 'n' : '') + (o.rim === false ? 'r' : '');
  return mat;
}

export function outlines(THREE, group, widthPx = 0.75, color = 0xbdbab3) {
  const res = new THREE.Vector2();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { uRes: { value: res }, uW: { value: widthPx }, uCol: { value: new THREE.Color(color) } },
    vertexShader: `uniform vec2 uRes; uniform float uW;
      void main(){
        vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec3 vn = normalize(normalMatrix * normal);
        vec2 n = normalize((projectionMatrix * vec4(vn, 0.0)).xy + 1e-6);
        c.xy += n * uW * 2.0 / uRes * c.w;
        gl_Position = c;
      }`,
    fragmentShader: `uniform vec3 uCol; void main(){ gl_FragColor = vec4(uCol, 1.0); }`,
  });
  const out = new THREE.Group(); out.name = 'outlines';
  group.updateMatrixWorld(true);
  group.traverse((m) => {
    if (!m.isMesh) return;
    const o = new THREE.Mesh(m.geometry, mat);
    o.matrixAutoUpdate = false; o.matrix.copy(m.matrixWorld);
    o.onBeforeRender = (r) => { r.getDrawingBufferSize(res); const pr = r.getPixelRatio(); mat.uniforms.uW.value = widthPx * pr; };
    o.frustumCulled = false;
    out.add(o);
  });
  return out;
}
