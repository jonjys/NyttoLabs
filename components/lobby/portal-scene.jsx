'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PORTALS, PORTAL_Z, ROOM_Z, ROOM_SPREAD } from './portals'

const LOBBY_CAM = new THREE.Vector3(0, 1.75, 10)
const LOBBY_LOOK = new THREE.Vector3(0, 1.75, PORTAL_Z)
const FLIGHT_S = 2.3

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function bezier(out, a, c, b, t) {
  const k = 1 - t
  out.set(
    k * k * a.x + 2 * k * t * c.x + t * t * b.x,
    k * k * a.y + 2 * k * t * c.y + t * t * b.y,
    k * k * a.z + 2 * k * t * c.z + t * t * b.z,
  )
  return out
}

function glowTexture() {
  const s = 128
  const cv = document.createElement('canvas')
  cv.width = s
  cv.height = s
  const ctx = cv.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.22, 'rgba(255,255,255,0.4)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.09)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const t = new THREE.CanvasTexture(cv)
  t.needsUpdate = true
  return t
}

const PORTAL_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const PORTAL_FRAG = `
precision highp float;
uniform float uTime;
uniform float uHover;
uniform float uDim;
uniform vec3  uColor;
varying vec2  vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 p = vUv - 0.5;
  float r = length(p) * 2.0;
  float a = atan(p.y, p.x);

  // Chromatic dispersion: sample the swirl at slightly different radii per
  // colour channel, the way light splits crossing a glass edge. Subtle by
  // design - a rim fringe, not a rainbow.
  float disp = 0.035 + uHover * 0.02;
  float swirlR = noise(vec2(a * 2.2 + uTime * 0.5, (r - disp) * 3.0 - uTime * 1.1));
  float swirl  = noise(vec2(a * 2.2 + uTime * 0.5, r * 3.0 - uTime * 1.1));
  float swirlB = noise(vec2(a * 2.2 + uTime * 0.5, (r + disp) * 3.0 - uTime * 1.1));

  float rings = sin(r * 22.0 - uTime * 3.2) * 0.5 + 0.5;
  float core  = smoothstep(0.95, 0.0, r);
  float edge  = smoothstep(1.0, 0.72, r);
  float rim   = smoothstep(0.6, 0.98, r) * smoothstep(1.0, 0.85, r);

  vec3 c = uColor * (0.25 + swirl * 0.95 + rings * 0.3);
  c += vec3(1.0) * core * (0.3 + uHover * 0.35);
  c += vec3(swirlR, swirl, swirlB) * rim * (0.55 + uHover * 0.45);

  float alpha = edge * (0.42 + swirl * 0.5 + uHover * 0.2);
  gl_FragColor = vec4(c, alpha * uDim);
}
`

export default function PortalScene({ target, transitioning, onSelect, onArrive }) {
  const mountRef = useRef(null)
  const labelRefs = useRef([])
  const propsRef = useRef({ target, transitioning, onSelect, onArrive })
  const [failed, setFailed] = useState(false)
  const [finePointer, setFinePointer] = useState(true)

  propsRef.current = { target, transitioning, onSelect, onArrive }

  useEffect(() => {
    setFinePointer(window.matchMedia?.('(pointer: fine)')?.matches ?? true)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    if (!renderer.getContext()) {
      setFailed(true)
      return
    }

    let w = mount.clientWidth || window.innerWidth
    let h = mount.clientHeight || window.innerHeight

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.NoToneMapping
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#03030c')
    scene.fog = new THREE.Fog('#03030c', 24, 118)

    const camera = new THREE.PerspectiveCamera(62, w / h, 0.1, 220)
    camera.position.copy(LOBBY_CAM)

    // Three.js fov is vertical, so a portrait viewport sees a far narrower
    // slice of the world. At 390px the outer portals sit entirely off screen,
    // so narrow viewports get a wider lens and a tighter, smaller portal rig.
    const computeLayout = () => {
      const aspect = w / h
      return {
        scale: THREE.MathUtils.clamp(aspect / 1.1, 0.5, 1),
        fov: aspect < 1 ? 78 : 62,
      }
    }
    let layout = computeLayout()

    const disposables = []
    const track = (o) => {
      disposables.push(o)
      return o
    }

    const glow = track(glowTexture())

    // ── Lights (atmosphere only; neon elements are self-lit) ────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    PORTALS.forEach((p) => {
      const l = new THREE.PointLight(new THREE.Color(p.color), 9, 24)
      l.position.set(p.x, 3, PORTAL_Z + 2)
      scene.add(l)
    })

    // ── Moving neon grids ──────────────────────────────────────────────────
    const mkGrid = (size, divisions, c1, c2, opacity) => {
      const g = new THREE.GridHelper(size, divisions, new THREE.Color(c1), new THREE.Color(c2))
      g.material.transparent = true
      g.material.opacity = opacity
      g.material.depthWrite = false
      track(g.geometry)
      track(g.material)
      return g
    }

    const floorFine = mkGrid(260, 260, '#1d4a63', '#13364a', 0.5)
    const floorBold = mkGrid(260, 26, '#00b4d8', '#0582a8', 0.75)
    const ceilFine = mkGrid(260, 130, '#262f58', '#1a2140', 0.3)
    ceilFine.position.y = 15
    floorBold.position.y = 0.01
    scene.add(floorFine, floorBold, ceilFine)

    // ── Particle swarm ─────────────────────────────────────────────────────
    const COUNT = w < 700 ? 1100 : 2600
    const pPos = new Float32Array(COUNT * 3)
    const pSpeed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 74
      pPos[i * 3 + 1] = Math.random() * 26 - 3
      pPos[i * 3 + 2] = -Math.random() * 88 + 18
      pSpeed[i] = Math.random() * 0.9 + 0.25
    }
    const pGeo = track(new THREE.BufferGeometry())
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    // A radial particle burst fires from the chosen portal's position the
    // instant it is selected - the "explosion into the scene" beat.
    const BURST_DURATION = 1.1
    const BURST_RADIUS = 16
    const BURST_STRENGTH = 34
    const burstOrigin = new THREE.Vector3(0, 999, 0)
    let burstStart = -Infinity
    const pMat = track(
      new THREE.PointsMaterial({
        size: 0.17,
        map: glow,
        color: new THREE.Color('#8fe9ff'),
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    const swarm = new THREE.Points(pGeo, pMat)
    scene.add(swarm)

    // ── Portals ────────────────────────────────────────────────────────────
    const portalMeshes = []
    const portals = PORTALS.map((data, i) => {
      const group = new THREE.Group()
      group.position.set(data.x, 2.3, PORTAL_Z)
      const color = new THREE.Color(data.color)

      const glowMat = track(
        new THREE.MeshBasicMaterial({
          map: glow,
          color,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      )
      const glowPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), glowMat)
      glowPlane.position.z = -0.6
      glowPlane.scale.setScalar(10)
      group.add(glowPlane)

      const uniforms = {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uDim: { value: 1 },
        uColor: { value: color.clone() },
      }
      const surfMat = track(
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: PORTAL_VERT,
          fragmentShader: PORTAL_FRAG,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      )
      const surface = new THREE.Mesh(track(new THREE.CircleGeometry(2.24, 72)), surfMat)
      surface.userData.portalIndex = i
      group.add(surface)
      portalMeshes.push(surface)

      const ringMat = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }))
      const ring = new THREE.Mesh(track(new THREE.TorusGeometry(2.3, 0.055, 12, 96)), ringMat)
      group.add(ring)

      const ring2Mat = track(
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 }),
      )
      const ring2 = new THREE.Mesh(track(new THREE.TorusGeometry(2.3, 0.016, 10, 96)), ring2Mat)
      group.add(ring2)

      const poolMat = track(
        new THREE.MeshBasicMaterial({
          map: glow,
          color,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      )
      const pool = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 7)), poolMat)
      pool.position.set(0, -2.29, 0.4)
      pool.rotation.x = -Math.PI / 2
      group.add(pool)

      // Invisible, generous hit disc — the visible portal is a small tap
      // target once the rig scales down on a phone.
      const hit = new THREE.Mesh(
        track(new THREE.CircleGeometry(3.2, 24)),
        track(new THREE.MeshBasicMaterial({ visible: false })),
      )
      hit.userData.portalIndex = i
      group.add(hit)
      portalMeshes.push(hit)

      scene.add(group)
      return { data, group, uniforms, ring, ring2, glowPlane, ringMat, ring2Mat, glowMat, poolMat }
    })

    // ── Floating holographic debris ────────────────────────────────────────
    const holoCols = ['#00f5ff', '#ff2bd1', '#00ff9d', '#8b5cf6', '#ff8a1e']
    const holoGeos = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.8, 0.22, 8, 20),
      new THREE.TetrahedronGeometry(1.1, 0),
    ]
    holoGeos.forEach(track)
    const holos = Array.from({ length: 14 }, (_, i) => {
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(holoCols[i % holoCols.length]),
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        }),
      )
      const m = new THREE.Mesh(holoGeos[i % 4], mat)
      const baseY = Math.random() * 11 + 1.5
      m.position.set((Math.random() - 0.5) * 44, baseY, -Math.random() * 44 - 2)
      m.scale.setScalar(Math.random() * 0.7 + 0.35)
      scene.add(m)
      return { mesh: m, baseY, spin: (Math.random() - 0.5) * 0.5, phase: Math.random() * Math.PI * 2 }
    })

    // ── Rooms behind each portal ───────────────────────────────────────────
    const roomGeos = [
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.BoxGeometry(1.4, 1.4, 1.4),
      new THREE.TorusKnotGeometry(0.8, 0.26, 96, 14),
    ]
    roomGeos.forEach(track)
    const rooms = PORTALS.map((data, i) => {
      const group = new THREE.Group()
      group.position.set(data.x * ROOM_SPREAD, 0, ROOM_Z)
      const color = new THREE.Color(data.color)

      const shapeMat = track(
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0 }),
      )
      const shape = new THREE.Mesh(roomGeos[i], shapeMat)
      shape.position.y = 3.4
      shape.scale.setScalar(2.5)
      group.add(shape)

      const archMat = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 }))
      const arch = new THREE.Mesh(track(new THREE.TorusGeometry(6.5, 0.05, 10, 110)), archMat)
      arch.position.set(0, 3.4, -5)
      group.add(arch)

      // Tunnel rings receding past the room — sells the sense of a space
      // you have arrived in rather than an object floating in the void.
      const tunnelMat = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 }))
      for (let k = 0; k < 6; k++) {
        const r = 7.5 + k * 1.7
        const ring = new THREE.Mesh(track(new THREE.TorusGeometry(r, 0.035, 8, 80)), tunnelMat)
        ring.position.set(0, 3.4, 9 - k * 7)
        group.add(ring)
      }

      const poolMat = track(
        new THREE.MeshBasicMaterial({
          map: glow,
          color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      )
      const pool = new THREE.Mesh(track(new THREE.PlaneGeometry(34, 34)), poolMat)
      pool.position.y = 0.02
      pool.rotation.x = -Math.PI / 2
      group.add(pool)

      scene.add(group)
      return { group, shape, arch, shapeMat, archMat, tunnelMat, poolMat }
    })

    // ── Interaction ────────────────────────────────────────────────────────
    // Only a real cursor gets hidden in favour of the custom reticle.
    const finePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? true
    const restCursor = finePointer ? 'none' : ''

    const pointer = new THREE.Vector2(0, 0) // normalised -1..1 for head-bob
    const ndc = new THREE.Vector2(-2, -2)
    const raycaster = new THREE.Raycaster()
    let hovered = -1

    const onPointerMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1)
      pointer.set(nx, ny)
      ndc.set(nx, ny)
    }
    // Touch never produces a hover pass, so the tap raycasts for itself rather
    // than trusting `hovered`. Movement is tracked so a look-around drag does
    // not release into a portal.
    const pick = (clientX, clientY) => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(
        ((clientX - r.left) / r.width) * 2 - 1,
        -(((clientY - r.top) / r.height) * 2 - 1),
      )
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(portalMeshes, false)
      return hits.length ? hits[0].object.userData.portalIndex : -1
    }

    let downAt = null
    const onPointerDown = (e) => {
      downAt = { x: e.clientX, y: e.clientY }
      pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    const onPointerUp = (e) => {
      const start = downAt
      downAt = null
      if (!start) return
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) return
      const p = propsRef.current
      if (p.target !== null || p.transitioning) return
      const idx = pick(e.clientX, e.clientY)
      if (idx >= 0 && p.onSelect) p.onSelect(idx)
    }

    window.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    const onResize = () => {
      w = mount.clientWidth || window.innerWidth
      h = mount.clientHeight || window.innerHeight
      camera.aspect = w / h
      renderer.setSize(w, h)
      layout = computeLayout()
      applyLayout()
    }
    window.addEventListener('resize', onResize)

    // ── Camera rig state ───────────────────────────────────────────────────
    const dests = [
      { cam: LOBBY_CAM.clone(), look: LOBBY_LOOK.clone() },
      ...PORTALS.map((p) => ({
        cam: new THREE.Vector3(p.x * ROOM_SPREAD, 1.75, ROOM_Z + 13),
        look: new THREE.Vector3(p.x * ROOM_SPREAD, 1.75, ROOM_Z),
      })),
    ]

    // Keeps the portal rig, the rooms and every camera destination in step
    // with the current viewport shape.
    function applyLayout() {
      const s = layout.scale
      camera.fov = layout.fov
      camera.updateProjectionMatrix()

      portals.forEach((p, i) => {
        p.group.position.x = PORTALS[i].x * s
        p.group.scale.setScalar(s)
      })
      rooms.forEach((r, i) => {
        r.group.position.x = PORTALS[i].x * ROOM_SPREAD * s
      })
      PORTALS.forEach((p, i) => {
        dests[i + 1].cam.x = p.x * ROOM_SPREAD * s
        dests[i + 1].look.x = p.x * ROOM_SPREAD * s
      })
    }

    applyLayout()

    const pos = LOBBY_CAM.clone()
    const look = LOBBY_LOOK.clone()
    const from = LOBBY_CAM.clone()
    const fromLook = LOBBY_LOOK.clone()
    const ctrl = new THREE.Vector3()
    const tmp = new THREE.Vector3()
    const proj = new THREE.Vector3()
    let prevTarget = propsRef.current.target
    let flightStart = 0
    let arrived = false
    let lastPortalX = 0

    const clock = new THREE.Clock()
    let prevT = 0
    let raf

    const frame = () => {
      // Clock.getElapsedTime() consumes the delta internally, so a following
      // getDelta() would return ~0. Derive delta from elapsed time instead.
      const t = clock.getElapsedTime()
      const delta = Math.min(Math.max(t - prevT, 0.0005), 0.05)
      prevT = t
      const { target: tgt, transitioning: flying, onArrive: arriveCb } = propsRef.current
      const inLobby = tgt === null

      // Grid scroll
      const drift = (t * 2.2) % 1
      floorFine.position.z = drift
      floorBold.position.z = (t * 2.2) % 10
      ceilFine.position.z = -((t * 2.2) % 2)

      // Particles
      const arr = pGeo.attributes.position.array
      const burstAge = t - burstStart
      const bursting = burstAge < BURST_DURATION
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3
        arr[ix + 1] += pSpeed[i] * delta * 0.55
        arr[ix] += Math.sin(t * 0.35 + i) * delta * 0.16
        if (bursting) {
          const dx = arr[ix] - burstOrigin.x
          const dy = arr[ix + 1] - burstOrigin.y
          const dz = arr[ix + 2] - burstOrigin.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001
          if (dist < BURST_RADIUS) {
            const falloff = (1 - burstAge / BURST_DURATION) * (1 - dist / BURST_RADIUS)
            const push = falloff * BURST_STRENGTH * delta
            arr[ix] += (dx / dist) * push
            arr[ix + 1] += (dy / dist) * push
            arr[ix + 2] += (dz / dist) * push
          }
        }
        if (arr[ix + 1] > 23) {
          arr[ix + 1] = -3
          arr[ix] = (Math.random() - 0.5) * 74
          arr[ix + 2] = -Math.random() * 88 + 18
        }
      }
      pGeo.attributes.position.needsUpdate = true
      swarm.rotation.y = Math.sin(t * 0.04) * 0.07

      // Holograms
      for (const h of holos) {
        h.mesh.rotation.x = t * h.spin * 0.6
        h.mesh.rotation.y = t * h.spin
        h.mesh.position.y = h.baseY + Math.sin(t * 0.6 + h.phase) * 0.6
      }

      // Hover raycast (lobby only)
      if (inLobby && !flying) {
        raycaster.setFromCamera(ndc, camera)
        const hits = raycaster.intersectObjects(portalMeshes, false)
        const next = hits.length ? hits[0].object.userData.portalIndex : -1
        if (next !== hovered) {
          hovered = next
          document.body.style.cursor = hovered >= 0 ? 'pointer' : restCursor
        }
      } else if (hovered !== -1) {
        hovered = -1
        document.body.style.cursor = restCursor
      }

      // Portal animation
      portals.forEach((p, i) => {
        const dim = inLobby ? 1 : 0.22
        const isHover = hovered === i
        p.uniforms.uTime.value = t
        p.uniforms.uDim.value = THREE.MathUtils.lerp(p.uniforms.uDim.value, dim, 1 - Math.pow(0.02, delta))
        p.uniforms.uHover.value = THREE.MathUtils.lerp(
          p.uniforms.uHover.value,
          isHover ? 1 : 0,
          1 - Math.pow(0.01, delta),
        )
        const pulse = 1 + Math.sin(t * 1.9 + i * 1.3) * 0.035
        const hs = isHover ? 1.08 : 1
        p.ring.scale.setScalar(pulse * hs)
        p.ring.rotation.z = t * 0.18
        p.ring2.scale.setScalar(pulse * hs * 1.12)
        p.ring2.rotation.z = -t * 0.11
        const gs = 10 + Math.sin(t * 1.9 + i * 1.3) * 0.7 + (isHover ? 1.6 : 0)
        p.glowPlane.scale.setScalar(gs)
        p.ringMat.opacity = THREE.MathUtils.lerp(p.ringMat.opacity, inLobby ? 1 : 0.25, 1 - Math.pow(0.02, delta))
        p.ring2Mat.opacity = THREE.MathUtils.lerp(p.ring2Mat.opacity, inLobby ? 0.45 : 0.08, 1 - Math.pow(0.02, delta))
        p.glowMat.opacity = THREE.MathUtils.lerp(p.glowMat.opacity, inLobby ? 0.4 : 0.12, 1 - Math.pow(0.02, delta))
        p.poolMat.opacity = THREE.MathUtils.lerp(p.poolMat.opacity, inLobby ? 0.22 : 0.05, 1 - Math.pow(0.02, delta))
      })

      // Rooms
      rooms.forEach((r, i) => {
        const active = tgt === i
        r.shape.rotation.y = t * 0.22
        r.shape.rotation.x = Math.sin(t * 0.3) * 0.25
        r.shape.position.y = 3.4 + Math.sin(t * 0.7) * 0.35
        r.arch.rotation.z = -t * 0.06
        const k = 1 - Math.pow(0.05, delta)
        // Only the room you are travelling to is ever lit; the others go dark
        // so no neighbouring room bleeds into frame.
        r.shapeMat.opacity = THREE.MathUtils.lerp(r.shapeMat.opacity, active ? 0.62 : 0, k)
        r.archMat.opacity = THREE.MathUtils.lerp(r.archMat.opacity, active ? 0.5 : 0, k)
        r.tunnelMat.opacity = THREE.MathUtils.lerp(r.tunnelMat.opacity, active ? 0.32 : 0, k)
        r.poolMat.opacity = THREE.MathUtils.lerp(r.poolMat.opacity, active ? 0.26 : 0, k)
      })

      // Target change → start a flight
      if (prevTarget !== tgt) {
        from.copy(pos)
        fromLook.copy(look)
        flightStart = t
        arrived = false
        // The lane we travel through: the portal we are entering, or the one we came from.
        lastPortalX = tgt === null ? lastPortalX : PORTALS[tgt].x
        if (tgt !== null) {
          burstOrigin.copy(portals[tgt].group.position)
          burstStart = t
        }
        prevTarget = tgt
      }

      const dest = dests[tgt === null ? 0 : tgt + 1]

      if (flying) {
        const prog = Math.min(1, (t - flightStart) / FLIGHT_S)
        const e = easeInOutCubic(prog)
        // Control point in the portal mouth, so the camera flies *through* the ring.
        ctrl.set(lastPortalX * layout.scale, 1.75, PORTAL_Z)
        bezier(tmp, from, ctrl, dest.cam, e)
        pos.copy(tmp)
        look.lerpVectors(fromLook, dest.look, e)
        if (prog >= 1 && !arrived) {
          arrived = true
          if (arriveCb) arriveCb()
        }
      } else {
        const k = 1 - Math.pow(0.001, delta)
        pos.lerp(dest.cam, k)
        look.lerp(dest.look, k)
      }

      // Head-bob / mouse sway
      const breathe = Math.sin(t * 1.4) * 0.045
      camera.position.set(pos.x + pointer.x * 1.1, pos.y + pointer.y * 0.55 + breathe, pos.z)
      camera.lookAt(look.x + pointer.x * 2.6, look.y + pointer.y * 1.3, look.z)

      // Project portal labels to screen space
      for (let i = 0; i < portals.length; i++) {
        const el = labelRefs.current[i]
        if (!el) continue
        // Sit just under the ring, which shrinks with the rig on narrow screens.
        proj.set(PORTALS[i].x * layout.scale, 2.3 - 2.3 * layout.scale - 0.5, PORTAL_Z)
        const dist = camera.position.distanceTo(proj)
        proj.project(camera)
        const behind = proj.z > 1
        const sx = (proj.x * 0.5 + 0.5) * w
        const sy = (-proj.y * 0.5 + 0.5) * h
        // Shrink with the rig too, or the labels collide once the portals
        // pull together on a narrow screen.
        const scale = THREE.MathUtils.clamp(16 / dist, 0.45, 1.5) * layout.scale
        el.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px) scale(${scale})`
        el.style.opacity = behind || !inLobby ? '0' : '1'
        el.dataset.hovered = hovered === i ? '1' : '0'
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      document.body.style.cursor = ''
      for (const d of disposables) d.dispose?.()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          WEBGL UNAVAILABLE
        </p>
      </div>
    )
  }

  return (
    <div ref={mountRef} className="relative h-full w-full">
      {PORTALS.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            labelRefs.current[i] = el
          }}
          className="pointer-events-none absolute left-0 top-0 text-center"
          style={{
            opacity: 0,
            transition: 'opacity 0.5s',
            whiteSpace: 'nowrap',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              fontSize: 15,
              letterSpacing: '0.34em',
              fontWeight: 700,
              color: p.color,
              textShadow: `0 0 14px ${p.color}`,
            }}
          >
            {p.label}
          </div>
          <div
            style={{
              marginTop: 5,
              fontSize: 8.5,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {finePointer ? 'CLICK TO ENTER' : 'TAP TO ENTER'}
          </div>
        </div>
      ))}
    </div>
  )
}
