export const P = {
  ivory: "#F8F3E8",
  sageL: "#CBD5BF",
  sage: "#A9B79C",
  sageD: "#6E7F62",
  olive: "#3F4D36",
  forest: "#2A3425",
  blush: "#EBCFC4",
  peach: "#EFD3B8",
  gold: "#B8975A",
  goldL: "#DCC48F",
  marigold: "#E7B25C",
  sand: "#E9DCC0"
};

export const marigold = (x: number, y: number, r = 7) =>
  `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${P.marigold}"/><circle r="${r * 0.62}" fill="#F1C77C"/><circle r="${r * 0.25}" fill="#C98A33"/></g>`;

export const garland = (w: number, y: number, n: number, drop = 18) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * w / n;
    const yy = y + Math.sin(i / (n - 1) * Math.PI) * drop;
    s += marigold(x, yy, 6);
  }
  return s;
};

export const leaf = (x: number, y: number, r = 0) =>
  `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0C-5 6 -5 14 0 20C5 14 5 6 0 0Z" fill="${P.sageD}"/>`;

export const stars = (w: number, h: number, n: number, seed = 3) => {
  let s = '', r = seed;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    s += `<circle cx="${rnd() * w}" cy="${rnd() * h}" r="${rnd() * 1.4 + 0.3}" fill="#fff" opacity="${0.3 + rnd() * 0.6}"/>`;
  }
  return s;
};

export const chhatri = (cx: number, base: number, w: number, h: number, c1: string, c2: string) =>
  `<g><rect x="${cx - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${c1}"/><path d="M${cx - w / 2 - 4} ${base - h} Q${cx} ${base - h - w * 0.8} ${cx + w / 2 + 4} ${base - h}Z" fill="${c2}"/><rect x="${cx - 1}" y="${base - h - w * 0.8 - 8}" width="2" height="9" fill="${P.gold}"/></g>`;

export const lotus = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${P.blush}" stroke="${P.gold}" stroke-width=".8"><path d="M0 0C-12 -2 -16 -9 -14 -14C-7 -12 -3 -7 0 0Z"/><path d="M0 0C12 -2 16 -9 14 -14C7 -12 3 -7 0 0Z"/><path d="M0 0C-7 -4 -7 -14 0 -20C7 -14 7 -4 0 0Z" fill="#F6DDD2"/></g>`;

export const sprigInner = `<g fill="none" stroke="currentColor" stroke-width="1"><path d="M10 160C30 110 50 70 60 10"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${14 + i * 8} ${140 - i * 22}q-18 -4 -22 -18q16 -2 22 18z" fill="currentColor" fill-opacity=".28"/><path d="M${18 + i * 8} ${130 - i * 22}q18 -6 22 -20q-18 0 -22 20z" fill="currentColor" fill-opacity=".28"/>`).join("")}</g>`;

export function mandalaSVG(sw = 0.6) {
  let s = '';
  for (let r = 0; r < 3; r++) {
    const n = [16, 24, 32][r], rad = [60, 40, 22][r];
    for (let i = 0; i < n; i++) {
      s += `<g transform="rotate(${i * 360 / n + r * 5} 150 150)"><path d="M150 ${150 - rad * 2.2}C${150 - rad * 0.3} ${150 - rad * 1.7} ${150 - rad * 0.3} ${150 - rad * 1.2} 150 ${150 - rad * 0.8}C${150 + rad * 0.3} ${150 - rad * 1.2} ${150 + rad * 0.3} ${150 - rad * 1.7} 150 ${150 - rad * 2.2}Z" fill="none" stroke="currentColor" stroke-width="${sw}"/></g>`;
    }
  }
  return `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="146" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="1 5"/>${s}<circle cx="150" cy="150" r="6" fill="${P.marigold}"/></svg>`;
}

export const skylineSVG = (tw = false) =>
  `<g fill="#A9B79C">${[40, 110, 190, 240, 290, 370, 440].map((x, i) => chhatri(x, 120, [28, 40, 60, 36, 60, 40, 28][i], [34, 50, 80, 44, 80, 50, 34][i], "#A9B79C", "#8EA283")).join("")}<rect y="108" width="480" height="12"/></g>` +
  (tw ? [...Array(16)].map((_, i) => `<circle class="tw" cx="${22 + i * 29}" cy="${112 + (i % 3) * 2}" r="1.6" fill="#FFE9A8"/>`).join('') : '');

export const rn = (seed: number) => {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};

const FL = ['#FFFFFF', '#FDF8F3', '#FBF1EC', '#F6DDD2', '#FFFFFF', '#F8E6D3'];

export const rose = (x: number, y: number, r: number, c: string, rd: () => number) =>
  `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rd() * 360).toFixed(0)})"><circle r="${r.toFixed(1)}" fill="${c}" stroke="rgba(150,110,100,.3)" stroke-width=".6"/><circle r="${(r * 0.7).toFixed(1)}" fill="#fff" opacity=".45"/><path d="M0 ${(-r * 0.5).toFixed(1)}a${(r * 0.5).toFixed(1)} ${(r * 0.5).toFixed(1)} 0 1 1 ${(-r * 0.15).toFixed(1)} ${(r * 0.1).toFixed(1)}M${(-r * 0.2).toFixed(1)} ${(-r * 0.1).toFixed(1)}a${(r * 0.28).toFixed(1)} ${(r * 0.28).toFixed(1)} 0 1 0 ${(r * 0.3).toFixed(1)} 0" fill="none" stroke="rgba(150,110,100,.42)" stroke-width=".8"/></g>`;

export const leafS = (x: number, y: number, r: number, a: number, c = '#8FA383') =>
  `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.38).toFixed(1)}" transform="rotate(${a.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}" opacity=".92"/>`;

export const gyp = (x: number, y: number, rd: () => number) => {
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += `<circle cx="${(x + (rd() - 0.5) * 12).toFixed(1)}" cy="${(y + (rd() - 0.5) * 12).toFixed(1)}" r="${(1.4 + rd() * 1.6).toFixed(1)}" fill="#fff"/>`;
  }
  return s;
};

export function floralPath(pts: { x: number; y: number; nx: number; ny: number }[], rd: () => number, spread = 17, sz = [10, 16]) {
  let lv = '', fl = '', gy = '';
  pts.forEach(p => {
    const o = (rd() - 0.5) * 2 * spread, x = p.x + p.nx * o, y = p.y + p.ny * o;
    lv += leafS(x + (rd() - 0.5) * 10, y + (rd() - 0.5) * 10, 9 + rd() * 6, rd() * 180);
    if (rd() < 0.72) fl += rose(x, y, sz[0] + rd() * (sz[1] - sz[0]), FL[Math.floor(rd() * FL.length)], rd);
    else gy += gyp(x, y, rd);
  });
  return lv + fl + gy;
}

export function valanceSVG() {
  const rd = rn(9);
  let d = 'M0 0H480V62';
  const fl: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const x0 = 480 - 80 * i, x1 = x0 - 80, cx = x0 - 40, cy = 62 + 52;
    d += `Q${cx} ${cy} ${x1} 62`;
    for (let t = 0; t <= 1.001; t += 0.2) {
      const u = 1 - t, x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * 62 + 2 * u * t * cy + t * t * 62;
      fl.push({ x, y: y - 2, nx: 0, ny: 1 });
    }
  }
  d += 'Z';
  return `<path class="vp" d="${d}" stroke="#CDB071" stroke-width="1.2"/>${floralPath(fl, rd, 7, [7, 11])}`;
}

export function envSprigSVG() {
  const rd = rn(5);
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    pts.push({ x: 14 + t * 100, y: 92 - Math.sin(t * Math.PI * 0.9) * 52, nx: 0, ny: 1 });
  }
  pts.push({ x: 70, y: 34, nx: 1, ny: 0 }, { x: 90, y: 50, nx: 1, ny: 0 });
  return floralPath(pts, rd, 9, [8, 13]);
}

export function rosettePath(N = 18, R0 = 560, A = 32) {
  const K = N * 36;
  let d = '';
  for (let k = 0; k <= K; k++) {
    const t = k / K * Math.PI * 2;
    const rr = R0 + A * Math.abs(Math.cos(N * t / 2));
    d += (k ? 'L' : 'M') + (650 + rr * Math.cos(t)).toFixed(1) + ' ' + (650 + rr * Math.sin(t)).toFixed(1);
  }
  d += 'Z';
  return d;
}

export const ICONS: Record<string, string> = {
  kalash: '<path d="M10 13h12l-1 3c3 2 4 5 3 8-1 3-4 4-8 4s-7-1-8-4c-1-3 0-6 3-8z"/><path d="M13 13c-1-2 0-4 3-4s4 2 3 4"/><circle cx="16" cy="6.5" r="2"/><path d="M12 10c-3-2-5-1-6 0 2 2 4 2 6 0zM20 10c3-2 5-1 6 0-2 2-4 2-6 0z"/>',
  flower: [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="16" cy="9" rx="3" ry="6" transform="rotate(${a} 16 16)"/>`).join('') + '<circle cx="16" cy="16" r="2"/>',
  bangles: '<circle cx="11" cy="17" r="7"/><circle cx="21" cy="17" r="7"/><circle cx="16" cy="11" r="7"/>',
  sparkle: '<path d="M16 3l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"/>',
  music: '<path d="M12 24V8l12-3v16"/><circle cx="9" cy="24" r="3"/><circle cx="21" cy="21" r="3"/>',
  dhol: '<path d="M7 13h18l-2 10H9z"/><ellipse cx="16" cy="13" rx="9" ry="3"/><path d="M10 15l3 8M16 16v8M22 15l-3 8"/><path d="M24 5l-4 6M28 8l-4 5"/>',
  garland: '<path d="M5 7c3 15 19 15 22 0"/><circle cx="6" cy="13" r="2"/><circle cx="10" cy="19" r="2"/><circle cx="16" cy="22" r="2"/><circle cx="22" cy="19" r="2"/><circle cx="26" cy="13" r="2"/>',
  flame: '<path d="M16 4c4 5 7 8 7 13a7 7 0 0 1-14 0c0-3 2-5 4-7 0 3 1 4 3 4 0-4-2-6 0-10z"/>',
  mic: '<rect x="12" y="4" width="8" height="15" rx="4"/><path d="M8 15a8 8 0 0 0 16 0M16 23v5M11 28h10"/>',
  rings: '<circle cx="12" cy="20" r="7"/><circle cx="20" cy="20" r="7"/><path d="M13 9l3-5 3 5-3 4z"/>'
};

export function sceneValley() {
  const rd = rn(512), H = 500;
  const RDEFS = `
<filter id="rock" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".018 .04" numOctaves="5" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="12" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".07 .05" numOctaves="4" seed="9" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 .05  0 0 0 0 .08  0 0 0 0 .12  0 0 0 -.8 .5" result="ta"/><feComposite in="ta" in2="d" operator="in" result="tx"/><feMerge><feMergeNode in="d"/><feMergeNode in="tx"/></feMerge></filter>
<filter id="rock2" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".03 .06" numOctaves="4" seed="12" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>
<filter id="cld" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".007 .017" numOctaves="4" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -.98"/><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="ripple" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".005 .15" numOctaves="3" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.6 -1.3"/></filter>
<filter id="refl" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".006 .12" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/><feGaussianBlur stdDeviation=".9"/></filter>
<filter id="stone" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .55 -.14" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>
<filter id="bl05"><feGaussianBlur stdDeviation=".6"/></filter><filter id="bl1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="bl2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter><filter id="bl8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
<radialGradient id="rg1"><stop offset="0" stop-color="#FCE0E4"/><stop offset=".6" stop-color="#EE9DB0"/><stop offset="1" stop-color="#C96B84"/></radialGradient>
<radialGradient id="rg2"><stop offset="0" stop-color="#FFF1F0"/><stop offset=".6" stop-color="#F7BFC8"/><stop offset="1" stop-color="#DD8CA0"/></radialGradient>
<radialGradient id="rg3"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F6DDD7"/><stop offset="1" stop-color="#E3B1AE"/></radialGradient>
<linearGradient id="bal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F6EEDF"/><stop offset=".5" stop-color="#DCD0B7"/><stop offset="1" stop-color="#A09479"/></linearGradient>
<linearGradient id="balt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAF4E7"/><stop offset="1" stop-color="#CFC2A6"/></linearGradient>
<linearGradient id="balb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDD1B8"/><stop offset="1" stop-color="#A89C80"/></linearGradient>
<linearGradient id="shg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#92AB88"/><stop offset="1" stop-color="#6C8664"/></linearGradient>
<linearGradient id="rayg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  
  const cloudLayer = (hVal: number, id = 'cm1') =>
    `<mask id="${id}"><rect width="400" height="${hVal}" fill="url(#cmg)"/></mask><linearGradient id="cmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;

  const ridgeD = (pts: number[][], hVal: number) => `M${pts[0][0]} ${hVal}` + pts.map(p => `L${p[0]} ${p[1]}`).join(' ') + `L${pts[pts.length - 1][0]} ${hVal}Z`;

  const wisteria = (rFn: () => number, n = 30, reach = 110) => {
    let w = '';
    for (let k = 0; k < n; k++) {
      const x = k * (400 / n) + (rFn() - 0.5) * 8, L = 50 + rFn() * reach, m = Math.floor(L / 7.5);
      let s = `<line x1="${x}" y1="0" x2="${x}" y2="${L}" stroke="#7E9577" stroke-width="1"/>`;
      for (let i = 0; i < m; i++) {
        const y = 14 + i * (L - 18) / m;
        s += `<circle cx="${(x + (rFn() - 0.5) * 8).toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.6 + rFn() * 2.6).toFixed(1)}" fill="${i % 3 ? '#fff' : '#FBF1EC'}" opacity=".96"/>` + (i % 4 == 0 ? leafS(x + (rFn() < 0.5 ? -7 : 7), y, 7, rFn() * 60 - 30) : '');
      }
      w += `<g class="wst" style="animation-delay:${(-rFn() * 5).toFixed(1)}s;animation-duration:${(4 + rFn() * 3).toFixed(1)}s">${s}</g>`;
    }
    return `<g opacity=".95" filter="url(#bl05)">${w}</g>`;
  };

  const roseBush = (cx: number, cy: number, rx: number, ry: number, n: number, rFn: () => number, blur?: string) => {
    let lv = '', fl = '';
    for (let i = 0; i < n * 1.4; i++) {
      const a = rFn() * 6.283, r = Math.sqrt(rFn()), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
      lv += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(9 + rFn() * 8).toFixed(1)}" ry="${(4 + rFn() * 3).toFixed(1)}" transform="rotate(${(rFn() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${rFn() < 0.5 ? '#3F5E3C' : '#56784E'}"/>`;
    }
    for (let i = 0; i < n; i++) {
      const a = rFn() * 6.283, r = Math.sqrt(rFn()), x = cx + Math.cos(a) * rx * r * 0.9, y = cy - ry * 0.1 + Math.sin(a) * ry * r * 0.8, s = 7 + rFn() * 8;
      fl += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rFn() * 360).toFixed(0)})"><circle r="${s.toFixed(1)}" fill="url(#rg${i % 3 + 1})"/><path d="M0 ${(-s * 0.5).toFixed(1)}a${(s * 0.5).toFixed(1)} ${(s * 0.5).toFixed(1)} 0 1 1 ${(-s * 0.2).toFixed(1)} ${(s * 0.1).toFixed(1)}M${(-s * 0.25).toFixed(1)} ${(-s * 0.1).toFixed(1)}a${(s * 0.3).toFixed(1)} ${(s * 0.3).toFixed(1)} 0 1 0 ${(s * 0.4).toFixed(1)} 0" fill="none" stroke="rgba(120,40,60,.35)" stroke-width=".7"/></g>`;
    }
    return `<g ${blur ? `filter="url(#${blur})"` : ''}>${lv}${fl}</g>`;
  };

  const coupleSil = (x: number, y: number, s: number) => {
    const k = '#2b3236', d = '#262d31';
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#bl05)"><ellipse cx="-16" cy="4" rx="70" ry="8" fill="rgba(40,35,20,.3)" transform="skewX(-26)"/><g class="couple2"><g class="bobber" style="filter:drop-shadow(0 0 2px rgba(255,226,170,.9))">
      <g class="lg1"><path d="M7 -92h11V-12h-11z" fill="${d}"/></g><g class="lg2"><path d="M20 -92h11V-12H20z" fill="${d}"/></g>
      <path d="M3 -150Q19 -158 34 -150L36 -90H1Z" fill="${k}"/><rect x="13" y="-160" width="10" height="9" fill="${k}"/><circle cx="18" cy="-166" r="10" fill="${k}"/>
      <path d="M32 -146Q42 -124 38 -92" fill="none" stroke="${k}" stroke-width="9" stroke-linecap="round"/><path d="M6 -146Q-2 -122 -4 -96" fill="none" stroke="${k}" stroke-width="9" stroke-linecap="round"/>
      <g transform="translate(-34 0)"><g class="lg1" style="animation-delay:-.4s"><path d="M-6 -50h8V-4h-8z" fill="${k}"/></g><g class="lg2" style="animation-delay:-1.1s"><path d="M8 -50h8V-4H8z" fill="${k}"/></g>
      <path d="M-12 -138Q2 -146 16 -138L30 -44Q5 -34 -22 -44Z" fill="${k}"/><path d="M-10 -148Q-12 -176 2 -178Q16 -176 14 -148Q12 -120 6 -104Q0 -118 -10 -148Z" fill="#1a1a1a"/><circle cx="2" cy="-162" r="9" fill="${k}"/>
      <path d="M-12 -134Q-20 -112 -18 -90" fill="none" stroke="${k}" stroke-width="6.5" stroke-linecap="round"/><path d="M16 -134Q28 -112 32 -88" fill="none" stroke="${k}" stroke-width="6.5" stroke-linecap="round"/></g>
    </g></g></g>`;
  };

  const peaks = [
    [-20, H - 40], [10, H - 110], [28, H - 92], [52, H - 170], [70, H - 130],
    [96, H - 150], [120, H - 100], [150, H - 176], [170, H - 140], [198, H - 190],
    [222, H - 120], [252, H - 168], [280, H - 112], [310, H - 150], [336, H - 102],
    [368, H - 140], [420, H - 90]
  ];

  const forest = [
    [-20, H - 14], [50, H - 58], [110, H - 34], [170, H - 70],
    [240, H - 40], [300, H - 76], [360, H - 44], [420, H - 60]
  ];

  let pines = '';
  forest.forEach(p => {
    for (let k = 0; k < 7; k++) {
      const x = p[0] + rd() * 60 - 10, y = p[1] + 10 + rd() * 50, h = 10 + rd() * 12;
      pines += `<path d="M${x - h * 0.3} ${y}L${x} ${y - h}L${x + h * 0.3} ${y}Z" fill="${rd() < 0.5 ? '#2E4A38' : '#3B5C45'}"/>`;
    }
  });

  const xc = (y: number) => 200 + ((y - H) / 300) * 95 * Math.sin((y - H) / 78);
  const wr = (y: number) => 3 + ((y - H) / 300) * 68;
  const L: number[][] = [], R: number[][] = [], PL: number[][] = [], PR: number[][] = [];
  for (let y = H + 14; y <= 815; y += 10) {
    const c = xc(y), w = wr(y);
    L.push([c - w, y]);
    R.push([c + w, y]);
    PL.push([c + w + 5, y]);
    PR.push([c + w + 5 + 8 + ((y - H) / 300) * 46, y]);
  }
  const poly = (a: number[][], b: number[][]) => [...a, ...b.slice().reverse()].map(p => p[0].toFixed(1) + ',' + p[1]).join(' ');

  const yy = 730, cx = xc(yy) + wr(yy) + 5 + (8 + ((yy - H) / 300) * 46) / 2;
  let flw = '';
  for (let i = 0; i < 120; i++) {
    const y = H + 30 + Math.pow(rd(), 1.25) * 280, x = rd() * 400;
    if (Math.abs(x - xc(y)) < wr(y) + 14) continue;
    flw += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.8 + ((y - H) / 300) * 2.4).toFixed(1)}" fill="${rd() < 0.6 ? '#fff' : '#F4D24A'}" opacity=".85"/>`;
  }
  let rocks = '';
  for (let i = 0; i < 46; i++) {
    const y = H + 40 + rd() * 270, side = rd() < 0.5 ? -1 : 1, x = xc(y) + side * (wr(y) + 2 + rd() * 6);
    rocks += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(1.5 + ((y - H) / 300) * 5).toFixed(1)}" ry="${(1 + ((y - H) / 300) * 3).toFixed(1)}" fill="${rd() < 0.5 ? '#CFC6B0' : '#A9A290'}"/>`;
  }
  const bigPine = (x: number, y: number, s: number) => {
    let t = '';
    for (let i = 0; i < 7; i++) {
      t += `<path d="M${-34 + i * 3} ${-i * 38}L0 ${-i * 38 - 52}L${34 - i * 3} ${-i * 38}Z" fill="${i % 2 ? '#2A4533' : '#35573F'}"/>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#bl2)">${t}<rect x="-4" y="0" width="8" height="30" fill="#4a3a2a"/></g>`;
  };

  return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"><defs>${RDEFS}${cloudLayer(H - 40)}
    <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FAEDB"/><stop offset=".55" stop-color="#CFE2EE"/><stop offset="1" stop-color="#F6EEDC"/></linearGradient>
    <linearGradient id="limest" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA0AA"/><stop offset=".6" stop-color="#D9D1C4"/><stop offset="1" stop-color="#F0E6D2"/></linearGradient>
    <linearGradient id="snow" gradientUnits="userSpaceOnUse" x1="0" y1="${H - 200}" x2="0" y2="${H - 130}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="mead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9CB8E"/><stop offset="1" stop-color="#7B9855"/></linearGradient>
    <linearGradient id="rivg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED4D6"/><stop offset=".5" stop-color="#4FA3B5"/><stop offset="1" stop-color="#2E7F98"/></linearGradient>
    <linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6F3E8" stop-opacity="0"/><stop offset="1" stop-color="#F6F3E8" stop-opacity=".75"/></linearGradient>
    <radialGradient id="sunc" cx="22%" cy="34%" r="48%"><stop offset="0" stop-color="#FFF1CC" stop-opacity=".95"/><stop offset="1" stop-color="#FFF1CC" stop-opacity="0"/></radialGradient>
    <clipPath id="rivc"><polygon points="${poly(L, R)}"/></clipPath></defs>
  <rect width="400" height="${H + 20}" fill="url(#sk)"/><rect width="400" height="${H}" fill="url(#sunc)"/>
  <g mask="url(#cm1)"><rect x="-60" y="0" width="520" height="${H - 40}" filter="url(#cld)" opacity=".9"/></g>
  <g class="dol" style="--ds:1.03;transform-origin:200px ${H}px">
   <path d="${ridgeD(peaks, H)}" fill="url(#limest)" filter="url(#rock)"/><path d="${ridgeD(peaks, H)}" fill="url(#snow)" filter="url(#rock2)"/>
   <path d="${ridgeD(forest, H)}" fill="#355B44" filter="url(#bl05)"/><g filter="url(#bl05)">${pines}</g><rect y="${H - 80}" width="400" height="86" fill="url(#hz)"/></g>
  <g class="dol" style="--ds:1.1;transform-origin:200px ${H}px">
   <path d="M-20 ${H} L420 ${H} L420 820 L-20 820Z" fill="url(#mead)"/>${flw}
   <polygon points="${poly(L.map(p => [p[0] - 6, p[1]]), R.map(p => [p[0] + 6, p[1]]))}" fill="#D2C9B2" opacity=".9"/>
   <polygon points="${poly(L, R)}" fill="url(#rivg)"/><g clip-path="url(#rivc)"><rect x="0" y="${H}" width="400" height="320" filter="url(#ripple)" opacity=".6"/><rect x="0" y="${H}" width="400" height="320" fill="url(#hz)" opacity=".3"/></g>
   <polygon points="${poly(PL, PR)}" fill="#CDBA93" opacity=".95"/>${rocks}</g>
  <g opacity=".6"><rect y="${H - 20}" width="400" height="60" fill="url(#hz)"/></g>
  ${coupleSil(cx, yy + 36, 0.58)}
  ${bigPine(18, 830, 1.5)}${bigPine(388, 840, 1.7)}${wisteria(rd, 22, 60)}
  ${roseBush(30, 818, 60, 28, 12, rd, 'bl2')}${roseBush(380, 822, 60, 28, 12, rd, 'bl2')}
  <g style="mix-blend-mode:screen"><polygon points="60,0 110,0 250,560 150,560" fill="url(#rayg)" opacity=".4"/><polygon points="0,0 40,0 150,520 90,520" fill="url(#rayg)" opacity=".3"/></g></svg>`;
}

