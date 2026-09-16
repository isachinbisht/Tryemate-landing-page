'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useState } from 'react';

import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 res = max(uResolution, vec2(1.0, 1.0));
  vec2 uv = gl_FragCoord.xy / res;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  float alpha = clamp(auroraAlpha * intensity * 1.8, 0.0, 0.85);
  if (uLightMode > 0.5) {
    fragColor = vec4(rampColor, alpha * 0.75);
  } else {
    fragColor = vec4(rampColor, alpha);
  }
}
`;

export default function Aurora(props) {
  const { colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1.0, blend = 0.5, lightMode = false } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer;
    let gl;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        antialias: true
      });
      gl = renderer.gl;
      if (!gl) {
        setWebglFailed(true);
        return;
      }
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.pointerEvents = 'none';
    } catch (e) {
      console.warn('Aurora WebGL init failed, using fallback gradient:', e);
      setWebglFailed(true);
      return;
    }

    let program;

    function resize() {
      if (!ctn || !renderer || !program) return;
      try {
        const width = ctn.offsetWidth || ctn.clientWidth || window.innerWidth || 300;
        const height = ctn.offsetHeight || ctn.clientHeight || window.innerHeight || 300;
        renderer.setSize(width, height);
        if (program) {
          program.uniforms.uResolution.value = [width, height];
        }
      } catch (_) {}
    }

    let resizeObserver;
    try {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(ctn);
    } catch (_) {
      window.addEventListener('resize', resize);
    }

    let mesh;
    try {
      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      const parseColor = (hex) => {
        try {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        } catch (_) {
          return [0.2, 0.4, 0.9];
        }
      };

      const colorStopsArray = colorStops.map(parseColor);

      const initialWidth = ctn.offsetWidth || ctn.clientWidth || window.innerWidth || 300;
      const initialHeight = ctn.offsetHeight || ctn.clientHeight || window.innerHeight || 300;

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [initialWidth, initialHeight] },
          uBlend: { value: blend },
          uLightMode: { value: lightMode ? 1 : 0 }
        }
      });

      mesh = new Mesh(gl, { geometry, program });
      if (gl.canvas) {
        ctn.appendChild(gl.canvas);
      }
    } catch (e) {
      console.warn('Aurora mesh creation failed:', e);
      setWebglFailed(true);
      return;
    }

    let animateId = 0;
    const parseColor = (hex) => {
      try {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      } catch (_) {
        return [0.2, 0.4, 0.9];
      }
    };

    const update = t => {
      animateId = requestAnimationFrame(update);
      try {
        const { time = t * 0.01, speed = 1.0 } = propsRef.current;
        program.uniforms.uTime.value = time * speed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
        program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        program.uniforms.uLightMode.value = (propsRef.current.lightMode ?? lightMode) ? 1 : 0;
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map(parseColor);
        renderer.render({ scene: mesh });
      } catch (_) {}
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
      try {
        if (ctn && gl && gl.canvas && gl.canvas.parentNode === ctn) {
          ctn.removeChild(gl.canvas);
        }
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (_) {}
    };
  }, [amplitude, blend, lightMode]);

  if (webglFailed) {
    return (
      <div
        className="aurora-container"
        style={{
          background: lightMode
            ? 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.35), rgba(147, 197, 253, 0.15), transparent 70%)'
            : 'radial-gradient(ellipse at top, rgba(30, 96, 205, 0.5), rgba(0, 85, 255, 0.2), transparent 70%)',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />
    );
  }

  return <div ref={ctnDom} className="aurora-container" />;
}
