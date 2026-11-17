'use client';

import React, { useEffect, useRef, useState } from 'react';
import { weddingData } from '@/lib/weddingData';
import {
  valanceSVG,
  envSprigSVG,
  skylineSVG,
  mandalaSVG,
  sprigInner,
  lotus,
  sceneValley,
  ICONS,
  rosettePath
} from '@/lib/illustrations';
import { WeddingSynth } from '@/lib/audioSynth';

export default function WeddingInvitation() {
  const synthRef = useRef<WeddingSynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI state
  const [gateOpen, setGateOpen] = useState(false);
  const [gateParted, setGateParted] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [musicActive, setMusicActive] = useState(false);
  const [usingSynth, setUsingSynth] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Opening animation states
  const [openingGo, setOpeningGo] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showN1, setShowN1] = useState(false);
  const [showAmp, setShowAmp] = useState(false);
  const [showN2, setShowN2] = useState(false);
  const [showDeva, setShowDeva] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showReq, setShowReq] = useState(false);
  const [showSind, setShowSind] = useState(false);
  const [sindOff, setSindOff] = useState(false);

  // Story stack state
  const [storyCur, setStoryCur] = useState(0);
  const [storyOrder, setStoryOrder] = useState<number[]>(() => weddingData.story.map((_, i) => i));
  const [storyFlipping, setStoryFlipping] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const isSwiped = useRef(false);

  // Scratch card state
  const [scratchHintHidden, setScratchHintHidden] = useState(false);
  const [scratchDone, setScratchDone] = useState(false);
  const scratchDrawing = useRef(false);
  const scratchLastPos = useRef<{ x: number; y: number } | null>(null);
  const scratchMoves = useRef(0);

  // Events open state
  const [openEvents, setOpenEvents] = useState<Record<number, boolean>>({});
  const [filterSide, setFilterSide] = useState<'all' | 'groom' | 'bride'>('all');

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; mins: string }>({
    days: '00',
    hours: '00',
    mins: '00'
  });
  const [diyaLit, setDiyaLit] = useState(false);

  // Procedural SVGs
  const [valanceMarkup, setValanceMarkup] = useState('');
  const [envSprigMarkup, setEnvSprigMarkup] = useState('');
  const [valleyMarkup, setValleyMarkup] = useState('');
  const [skylineMarkup, setSkylineMarkup] = useState('');
  const [rosetteD, setRosetteD] = useState('');

  // Petal burst generator
  const triggerBurst = (x: number, y: number, n = 14, up = false) => {
    const PCOL = ['#FFFFFF', '#F9E6DF', '#EBCFC4', '#CBD5BF', '#F3E6C8', '#DCC48F'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      const s = 9 + Math.random() * 5;
      p.className = 'pt';
      p.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s * 1.35}px;background:${PCOL[i % 6]};position:fixed;pointer-events:none;z-index:9999;border-radius:50% 0 50% 50%`;
      document.body.appendChild(p);

      const a = (up ? -Math.PI / 2 : Math.random() * Math.PI * 2) + (Math.random() - 0.5) * (up ? 1.6 : 0);
      const v = 50 + Math.random() * 110;
      const dx = Math.cos(a) * v;
      const dy = Math.sin(a) * v;

      p.animate(
        [
          { transform: 'translate(0,0) rotate(0) scale(.4)', opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 300}deg) scale(1)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx * 1.2}px,${dy + 140}px) rotate(${Math.random() * 600}deg) scale(.8)`, opacity: 0 }
        ],
        { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)' }
      ).onfinish = () => p.remove();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Music handlers
  const fallbackSynth = () => {
    setUsingSynth(true);
    if (!synthRef.current) synthRef.current = new WeddingSynth();
    const ok = synthRef.current.start();
    setMusicActive(ok);
  };

  const startMusic = () => {
    if (!synthRef.current) synthRef.current = new WeddingSynth();
    synthRef.current.prime();

    if (audioRef.current) {
      const p = audioRef.current.play();
      if (p && p.then) {
        p.then(() => {
          setMusicActive(true);
        }).catch(err => {
          if (err && err.name === 'NotAllowedError') {
            setMusicActive(false);
          } else {
            fallbackSynth();
          }
        });
      } else {
        fallbackSynth();
      }
    } else {
      fallbackSynth();
    }
  };

  const toggleMusic = () => {
    if (usingSynth && synthRef.current) {
      if (synthRef.current.playing) {
        synthRef.current.stop();
        setMusicActive(false);
      } else {
        synthRef.current.start();
        setMusicActive(true);
      }
      return;
    }

    if (audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setMusicActive(false);
      } else {
        const p = audioRef.current.play();
        if (p && p.then) {
          p.then(() => setMusicActive(true)).catch(err => {
            if (err && err.name === 'NotAllowedError') {
              showToast('Tap again to play the music');
            } else {
              fallbackSynth();
            }
          });
        } else {
          fallbackSynth();
        }
      }
    }
  };

  // Open gate seal action
  const handleSealClick = () => {
    if (gateOpen) return;
    setGateOpen(true);
    startMusic();

    setTimeout(() => {
      triggerBurst(window.innerWidth / 2, window.innerHeight * 0.5, 24);
    }, 300);

    setTimeout(() => {
      setGateParted(true);
      runOpeningSequence();
    }, 1200);

    setTimeout(() => {
      setGateGone(true);
      document.body.classList.remove('locked');
    }, 2600);
  };

  // Run the staged text reveals in opening
  const runOpeningSequence = () => {
    setOpeningGo(true);
    const w = window.innerWidth > 480 ? 480 : window.innerWidth;
    const x0 = (window.innerWidth - w) / 2;

    setTimeout(() => setShowTop(true), 1800);
    setTimeout(() => setShowN1(true), 2400);
    setTimeout(() => {
      setShowAmp(true);
      triggerBurst(x0 + w / 2, window.innerHeight * 0.3, 8);
    }, 3700);
    setTimeout(() => setShowN2(true), 4400);
    setTimeout(() => setShowDeva(true), 5500);
    setTimeout(() => setShowDate(true), 6000);
    setTimeout(() => setShowReq(true), 6500);
    setTimeout(() => setShowSind(true), 7100);
  };

  // Story card flip
  const flipStory = () => {
    if (storyFlipping !== null) return;
    const topIdx = storyOrder[0];
    setStoryFlipping(topIdx);
    setStoryCur(prev => (prev + 1) % weddingData.story.length);

    setTimeout(() => {
      setStoryOrder(prev => {
        const next = [...prev];
        const first = next.shift()!;
        next.push(first);
        return next;
      });
      setStoryFlipping(null);
    }, 700);
  };

  // Scratch card canvas rendering
  const paintScratch = () => {
    const cv = canvasRef.current;
    if (!cv || scratchDone) return;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = cv.getBoundingClientRect();
    if (!b.width) return;
    const W = b.width;
    const H = b.height;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#C9CFB8');
    g.addColorStop(0.35, '#E6E2C6');
    g.addColorStop(0.55, '#BFC9AE');
    g.addColorStop(0.8, '#E1D9B8');
    g.addColorStop(1, '#B2BE9F');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineWidth = 1;
    const s = 26;

    for (let y = 0; y < H + s; y += s) {
      for (let x = 0; x < W + s; x += s) {
        ctx.beginPath();
        ctx.moveTo(x, y - s / 2);
        ctx.lineTo(x + s / 2, y);
        ctx.lineTo(x, y + s / 2);
        ctx.lineTo(x - s / 2, y);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, s / 5, 0, 7);
        ctx.stroke();
      }
    }

    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '70,80,55'},${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.2, 1.2);
    }

    ctx.strokeStyle = 'rgba(184,151,90,.9)';
    ctx.strokeRect(10, 10, W - 20, H - 20);
    ctx.strokeRect(14, 14, W - 28, H - 28);

    ctx.fillStyle = 'rgba(63,77,54,.85)';
    ctx.textAlign = 'center';
    ctx.font = `italic 500 ${W * 0.14}px 'Cormorant Garamond', Georgia, serif`;
    ctx.fillText('The Date', W / 2, H * 0.48);

    ctx.font = `400 ${W * 0.034}px 'Jost', sans-serif`;
    ctx.letterSpacing = '3px';
    ctx.fillText('SCRATCH TO REVEAL', W / 2, H * 0.48 + W * 0.1);
    ctx.letterSpacing = '0px';

    ctx.globalCompositeOperation = 'destination-out';
  };

  const checkScratchCoverage = () => {
    const cv = canvasRef.current;
    if (!cv) return 0;
    const w = 48, h = 64;
    const t = document.createElement('canvas');
    t.width = w;
    t.height = h;
    const ctx = t.getContext('2d');
    if (!ctx) return 0;
    ctx.drawImage(cv, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    let c = 0;
    for (let i = 3; i < d.length; i += 4) {
      if (d[i] < 40) c++;
    }
    return c / (w * h);
  };

  const finishScratch = () => {
    if (scratchDone) return;
    setScratchDone(true);
    if (typeof navigator !== 'undefined' && (navigator as any).vibrate) {
      (navigator as any).vibrate(30);
    }
    const cv = canvasRef.current;
    if (cv) {
      const b = cv.getBoundingClientRect();
      triggerBurst(b.left + b.width / 2, b.top + b.height / 2, 26);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (scratchDone) return;
    scratchDrawing.current = true;
    const cv = canvasRef.current;
    if (!cv) return;
    cv.setPointerCapture(e.pointerId);
    const b = cv.getBoundingClientRect();
    const pos = { x: e.clientX - b.left, y: e.clientY - b.top };
    scratchLastPos.current = pos;

    const ctx = cv.getContext('2d');
    if (ctx) {
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(28, b.width * 0.11);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setScratchHintHidden(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scratchDrawing.current || scratchDone) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const b = cv.getBoundingClientRect();
    const pos = { x: e.clientX - b.left, y: e.clientY - b.top };
    const ctx = cv.getContext('2d');
    if (ctx && scratchLastPos.current) {
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(28, b.width * 0.11);
      ctx.beginPath();
      ctx.moveTo(scratchLastPos.current.x, scratchLastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    scratchLastPos.current = pos;

    scratchMoves.current++;
    if (scratchMoves.current % 4 === 0) {
      // sparkle
      const s = document.createElement('i');
      s.style.cssText = `position:absolute;left:${pos.x}px;top:${pos.y}px;width:5px;height:5px;border-radius:50%;background:#fff;box-shadow:0 0 8px 2px #DCC48F;pointer-events:none;z-index:3;transition:all .8s;opacity:.9`;
      cv.parentElement?.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${(Math.random() - 0.5) * 30}px,${Math.random() * 24}px) scale(0)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 900);
    }

    if (scratchMoves.current % 10 === 0 && checkScratchCoverage() > 0.5) {
      finishScratch();
    }
  };

  const handlePointerUp = () => {
    scratchDrawing.current = false;
    if (!scratchDone && checkScratchCoverage() > 0.5) {
      finishScratch();
    }
  };

  // Toggle Diya
  const handleDiyaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !diyaLit;
    setDiyaLit(next);
    if (next) {
      const b = e.currentTarget.getBoundingClientRect();
      triggerBurst(b.left + b.width / 2, b.top + 10, 22, true);
    }
  };

  // Toggle calendar event expansion
  const toggleEvent = (idx: number) => {
    setOpenEvents(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Generate .ics download link
  const createIcsDataUri = (name: string, iso: string, note?: string) => {
    const end = String(+iso.slice(9, 11) + 3).padStart(2, '0') + iso.slice(11);
    const content = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${name}\nDTSTART:${iso}\nDTEND:${iso.slice(0, 9) + end}\nLOCATION:${note || weddingData.venue.name}\nEND:VEVENT\nEND:VCALENDAR`;
    return `data:text/calendar;charset=utf8,${encodeURIComponent(content)}`;
  };

  // Initial mount effects
  useEffect(() => {
    // Generate static procedural SVGs
    setValanceMarkup(valanceSVG());
    setEnvSprigMarkup(envSprigSVG());
    setValleyMarkup(sceneValley());
    setSkylineMarkup(skylineSVG());
    setRosetteD(rosettePath(18, 560, 32));

    document.body.classList.add('locked');

    // Countdown tick
    const updateCountdown = () => {
      const diff = Math.max(0, new Date(weddingData.date.start).getTime() - Date.now()) / 1000;
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0')
      });
    };
    updateCountdown();
    const cdTimer = setInterval(updateCountdown, 15000);

    // Scratch card paint when fonts ready
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(() => paintScratch());
    } else {
      setTimeout(paintScratch, 300);
    }

    const handleResize = () => {
      if (!scratchDone) paintScratch();
    };
    window.addEventListener('resize', handleResize);

    // Scroll reveal observer
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.rv').forEach(el => io.observe(el));

    // Scroll handler: progress bar, swipe indicator, venue parallax
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setSindOff(window.scrollY > 40);

        // Progress bar
        const progBar = document.querySelector('#prog i') as HTMLElement | null;
        if (progBar) {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
          progBar.style.transform = `scaleX(${window.scrollY / totalScroll})`;
        }

        // Venue sticky expand
        const vs = document.getElementById('venue');
        const vf = document.getElementById('vframe');
        const vtop = document.getElementById('v-top');
        const vtext = document.getElementById('v-text');
        if (vs && vf && vtop && vtext) {
          const r = vs.getBoundingClientRect();
          const total = vs.offsetHeight - window.innerHeight;
          const p = Math.min(1, Math.max(0, (-r.top / total) * 1.12));
          const q = Math.min(1, Math.max(0, (p - 0.5) / 0.5));
          vf.style.setProperty('--p', p.toFixed(3));
          vtext.style.opacity = String(q);
          vtext.style.transform = `translateY(${(1 - q) * 30}px)`;
          vtop.style.opacity = String(1 - Math.min(1, p * 2.5));
        }

        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Global click petal burst
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('#sc,#gate,#music,a,button,.evc,.pol')) return;
      triggerBurst(e.clientX, e.clientY, 12);
    };
    document.addEventListener('click', handleGlobalClick);

    // Visibility change (pause synth if hidden)
    const handleVisibility = () => {
      if (document.hidden && synthRef.current?.playing) {
        synthRef.current.stop();
        setMusicActive(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(cdTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('visibilitychange', handleVisibility);
      io.disconnect();
      document.body.classList.remove('locked');
      synthRef.current?.stop();
    };
  }, []);

  // Background decoration renderer
  const renderDecor = (idx: number) => {
    const COLS = ['#FFFFFF', '#F6DDD2', '#EBCFC4', '#CBD5BF', '#F3E6C8'];
    return (
      <div className="bg">
        <svg
          className="dc dc-sprig s1"
          viewBox="0 0 100 160"
          dangerouslySetInnerHTML={{ __html: sprigInner }}
        />
        <svg
          className="dc dc-sprig s2"
          viewBox="0 0 100 160"
          dangerouslySetInnerHTML={{ __html: sprigInner }}
        />
        <div
          className="dc dc-mandala"
          dangerouslySetInnerHTML={{ __html: mandalaSVG(0.8) }}
        />
        <div className="dc dc-jaali"></div>
        <div className="dc dc-blob b1"></div>
        <div className="dc dc-blob b2"></div>
        {[0, 1, 2, 3].map(k => (
          <i
            key={k}
            className="dc dc-petal"
            style={{
              left: `${10 + k * 24 + (idx % 3) * 4}%`,
              background: COLS[(idx + k) % 5],
              animationDuration: `${16 + k * 3}s`,
              animationDelay: `${-k * 5 - idx}s`
            }}
          />
        ))}
      </div>
    );
  };

  let globalEventCounter = 0;

  return (
    <>
      {/* Object bounding box arch clip */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="archClip" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.005,0.0033333)"
              d="M0 300V100A100 100 0 0 1 200 100V300Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Reading scroll progress bar */}
      <div id="prog">
        <i></i>
      </div>

      {/* Music equalizer toggle button */}
      <button
        id="music"
        className={`${gateParted ? 'show' : ''} ${musicActive ? 'on' : ''}`}
        aria-label="Toggle music"
        onClick={toggleMusic}
      >
        <b></b>
        <b></b>
        <b></b>
        <b></b>
      </button>

      {/* Toast notification */}
      <div id="toast" className={toastMessage ? 'show' : ''}>
        {toastMessage || 'Add your song at assets/music/wedding-song.mp3'}
      </div>

      {/* Audio element */}
      <audio ref={audioRef} id="aud" src={weddingData.music} loop preload="none" />

      {/* Royal Curtain Gatefold Opening (Luxury Mughal Gate Aesthetic) */}
      {!gateGone && (
        <div id="gate" className={`${gateOpen ? 'open' : ''} ${gateParted ? 'parted' : ''}`}>
          {/* Left Door Panel */}
          <div className="door door-left">
            <div className="door-pleats"></div>
            <div className="door-border"></div>
            <svg className="door-botanical" viewBox="0 0 240 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gold-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF4D4" />
                  <stop offset="40%" stopColor="#DFBF7A" />
                  <stop offset="100%" stopColor="#9C772F" />
                </linearGradient>
                <filter id="gold-emboss" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#42523c" floodOpacity="0.35" />
                </filter>
              </defs>
              <g filter="url(#gold-emboss)">
                <path d="M -15 40 Q 55 95, 90 180 T 120 310" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 32 75 C 18 58, 42 45, 54 64 C 45 76, 36 76, 32 75 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 48 108 C 66 90, 80 102, 70 118 C 58 118, 50 114, 48 108 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 70 152 C 54 138, 70 124, 84 138 C 80 152, 72 152, 70 152 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 90 198 C 112 182, 122 198, 110 212 C 98 212, 90 206, 90 198 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 105 252 C 90 238, 105 224, 120 238 C 116 252, 108 252, 105 252 Z" fill="url(#gold-leaf-grad)" />

                <path d="M 190 270 Q 155 285, 130 320" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 162 268 C 175 252, 188 262, 178 276 C 170 276, 164 272, 162 268 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 142 292 C 128 278, 144 266, 156 280 C 152 292, 144 292, 142 292 Z" fill="url(#gold-leaf-grad)" />

                <path d="M -15 580 Q 60 520, 95 435 T 120 320" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 38 545 C 24 528, 48 515, 60 532 C 50 545, 42 545, 38 545 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 66 496 C 85 478, 96 494, 85 508 C 74 508, 68 502, 66 496 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 90 448 C 75 432, 90 420, 104 434 C 100 448, 92 448, 90 448 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 110 392 C 128 375, 140 392, 126 406 C 115 406, 110 400, 110 392 Z" fill="url(#gold-leaf-grad)" />
              </g>
            </svg>
            <div className="door-edge"></div>
          </div>

          {/* Right Door Panel (Mirrored) */}
          <div className="door door-right">
            <div className="door-pleats"></div>
            <div className="door-border"></div>
            <svg className="door-botanical" viewBox="0 0 240 600" preserveAspectRatio="none">
              <g filter="url(#gold-emboss)" transform="scale(-1, 1) translate(-240, 0)">
                <path d="M -15 40 Q 55 95, 90 180 T 120 310" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 32 75 C 18 58, 42 45, 54 64 C 45 76, 36 76, 32 75 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 48 108 C 66 90, 80 102, 70 118 C 58 118, 50 114, 48 108 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 70 152 C 54 138, 70 124, 84 138 C 80 152, 72 152, 70 152 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 90 198 C 112 182, 122 198, 110 212 C 98 212, 90 206, 90 198 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 105 252 C 90 238, 105 224, 120 238 C 116 252, 108 252, 105 252 Z" fill="url(#gold-leaf-grad)" />

                <path d="M 190 270 Q 155 285, 130 320" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 162 268 C 175 252, 188 262, 178 276 C 170 276, 164 272, 162 268 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 142 292 C 128 278, 144 266, 156 280 C 152 292, 144 292, 142 292 Z" fill="url(#gold-leaf-grad)" />

                <path d="M -15 580 Q 60 520, 95 435 T 120 320" fill="none" stroke="url(#gold-leaf-grad)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 38 545 C 24 528, 48 515, 60 532 C 50 545, 42 545, 38 545 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 66 496 C 85 478, 96 494, 85 508 C 74 508, 68 502, 66 496 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 90 448 C 75 432, 90 420, 104 434 C 100 448, 92 448, 90 448 Z" fill="url(#gold-leaf-grad)" />
                <path d="M 110 392 C 128 375, 140 392, 126 406 C 115 406, 110 400, 110 392 Z" fill="url(#gold-leaf-grad)" />
              </g>
            </svg>
            <div className="door-edge"></div>
          </div>

          {/* Ornate Mughal Royal Plaque */}
          <div className="plaque-wrap">
            <button
              className="royal-plaque"
              id="seal"
              aria-label="Tap to open wedding invitation"
              onClick={handleSealClick}
            >
              <svg className="plaque-frame" viewBox="0 0 140 180" fill="none">
                <defs>
                  <radialGradient id="plq-gold" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#FFF3D6" />
                    <stop offset="35%" stopColor="#E4C482" />
                    <stop offset="70%" stopColor="#BF9B50" />
                    <stop offset="100%" stopColor="#8C6E2A" />
                  </radialGradient>
                  <filter id="plq-3d" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#182415" floodOpacity="0.55" />
                  </filter>
                </defs>
                <path
                  d="M 70 6 C 78 16, 92 18, 106 24 C 120 30, 126 42, 122 56 C 134 68, 136 80, 134 90 C 136 100, 134 112, 122 124 C 126 138, 120 150, 106 156 C 92 162, 78 164, 70 174 C 62 164, 48 162, 34 156 C 20 150, 14 138, 18 124 C 6 112, 4 100, 6 90 C 4 80, 6 68, 18 56 C 14 42, 20 30, 34 24 C 48 18, 62 16, 70 6 Z"
                  fill="url(#plq-gold)"
                  filter="url(#plq-3d)"
                  stroke="#FFEBBF"
                  strokeWidth="1.5"
                />
                <path
                  d="M 70.0 19.4 C 76.7 27.8, 88.5 29.5, 100.2 34.6 C 112.0 39.6, 117.0 49.7, 113.7 61.4 C 123.8 71.5, 125.4 81.6, 123.8 90.0 C 125.4 98.4, 123.8 108.5, 113.7 118.6 C 117.0 130.3, 112.0 140.4, 100.2 145.4 C 88.5 150.5, 76.7 152.2, 70.0 160.6 C 63.3 152.2, 51.5 150.5, 39.8 145.4 C 28.0 140.4, 23.0 130.3, 26.3 118.6 C 16.2 108.5, 14.6 98.4, 16.2 90.0 C 14.6 81.6, 16.2 71.5, 26.3 61.4 C 23.0 49.7, 28.0 39.6, 39.8 34.6 C 51.5 29.5, 63.3 27.8, 70.0 19.4 Z"
                  fill="none"
                  stroke="#7A5D20"
                  strokeWidth="1"
                  strokeDasharray="2.5 1.5"
                  opacity="0.6"
                />
              </svg>

              <div className="plaque-inner-text">
                <div className="plaque-ornament">✦ ❧ ✦</div>
                <div className="plaque-monogram">J &amp; S</div>
                <div className="plaque-tap">TAP TO OPEN</div>
                <div className="plaque-ornament-b">✦ ❧ ✦</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Single Page Application Content */}
      <main id="app">
        {/* OPENING HERO SECTION */}
        <section
          id="opening"
          className={`scene grain has-photo ${openingGo ? 'go' : ''}`}
        >
          <div
            className="o-bg"
            id="o-bg"
            dangerouslySetInnerHTML={{ __html: valleyMarkup }}
          />
          <img
            className="o-photo"
            id="o-photo"
            src={weddingData.openingPhoto}
            alt="Jainam & Siddhi"
          />
          <div className="o-scrim"></div>
          <div className="sweep"></div>

          {/* Drifting Motes */}
          <div id="motes">
            {[...Array(22)].map((_, i) => (
              <i
                key={i}
                className="mote"
                style={{
                  left: `${((i * 19 + 7) % 100)}%`,
                  animationDuration: `${9 + ((i * 7) % 9)}s`,
                  animationDelay: `${-((i * 5) % 14)}s`,
                  scale: `${0.6 + ((i * 3) % 13) * 0.1}`
                }}
              />
            ))}
          </div>

          {/* Drifting Petals */}
          <div id="petals">
            {['#FFFFFF', '#F6DDD2', '#EBCFC4', '#CBD5BF', '#F3E6C8'].flatMap((col, ci) =>
              [0, 1, 2, 3].map(k => (
                <i
                  key={`${ci}-${k}`}
                  className="petal"
                  style={{
                    left: `${((ci * 20 + k * 27 + 13) % 100)}%`,
                    background: col,
                    animationDuration: `${9 + ((k * 3 + ci) % 9)}s`,
                    animationDelay: `${-((k * 4 + ci * 3) % 16)}s`,
                    opacity: 0.65 + ((k + ci) % 4) * 0.08,
                    scale: `${0.7 + ((k * 5) % 10) * 0.09}`
                  }}
                />
              ))
            )}
          </div>

          <div className="o-wrap">
            <div className={`label o-fade ${showTop ? 'on' : ''}`} id="o-top">
              Together with their families
            </div>
            <div className="names">
              <div className={`nm ${showN1 ? 'on' : ''}`} id="n1">
                {weddingData.openingNames.groom.split('').map((char, i) => (
                  <span key={i} className="l" style={{ '--i': i } as React.CSSProperties}>
                    {char}
                  </span>
                ))}
              </div>
              <div className={`amp ${showAmp ? 'on' : ''}`} id="amp">
                &amp;
              </div>
              <div className={`nm ${showN2 ? 'on' : ''}`} id="n2">
                {weddingData.openingNames.bride.split('').map((char, i) => (
                  <span key={i} className="l" style={{ '--i': i } as React.CSSProperties}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <div className={`o-fade ${showDeva ? 'on' : ''}`} id="o-deva">
              <div className="o-deva">शुभ विवाह</div>
            </div>
            <div className={`o-date o-fade ${showDate ? 'on' : ''}`} id="o-date">
              <i></i>
              <span id="o-date-t">{weddingData.date.short}</span>
              <i></i>
            </div>
            <div className={`o-fade ${showReq ? 'on' : ''}`} id="o-req" style={{ marginTop: 8 }}>
              <div className="o-invite">
                joyfully invite you
                <br />
                to celebrate their wedding
              </div>
            </div>
          </div>

          <a
            className={`scroll-ind o-fade ${showSind ? 'on' : ''} ${sindOff ? 'off' : ''}`}
            id="sind"
            href="#story"
            aria-label="Swipe up to open the invitation"
            onClick={e => {
              e.preventDefault();
              document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Swipe up to open the invitation</span>
            <svg viewBox="0 0 24 24">
              <path d="M6 15l6-6 6 6" />
              <path d="M6 20l6-6 6 6" opacity=".55" />
            </svg>
          </a>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="grain">
          {renderDecor(0)}
          <div className="scene">
            <div className="label rv">A glimpse of our journey</div>
            <div className="big-quote rv d1">
              Somewhere between a first conversation and countless little moments,{' '}
              <em>a story began.</em>
            </div>
            <div className="gold-line rv d2" style={{ width: 120, margin: '12px auto 0' }}></div>

            <div
              className="stack rv d3"
              id="stack"
              onPointerDown={e => {
                swipeStartX.current = e.clientX;
                isSwiped.current = false;
              }}
              onPointerUp={e => {
                if (swipeStartX.current !== null && Math.abs(e.clientX - swipeStartX.current) > 40) {
                  isSwiped.current = true;
                  flipStory();
                }
                swipeStartX.current = null;
              }}
              onClick={() => {
                if (isSwiped.current) {
                  isSwiped.current = false;
                  return;
                }
                flipStory();
              }}
            >
              {storyOrder.map((storyIdx, posIndex) => {
                const s = weddingData.story[storyIdx];
                const isOut = storyFlipping === storyIdx;
                return (
                  <div
                    key={storyIdx}
                    className={`pol ${isOut ? 'out' : ''}`}
                    data-pos={Math.min(posIndex, 3)}
                    style={{ zIndex: storyOrder.length - posIndex }}
                  >
                    <div className="ph">
                      <img
                        className="phimg"
                        src={s.photo}
                        alt={s.title}
                        style={{ objectPosition: s.pos || '50% 40%' }}
                        loading="eager"
                        decoding="async"
                      />
                      <div className="chip">{s.chip}</div>
                    </div>
                    <div className="cap">
                      <h4>{s.title}</h4>
                      <p>{s.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="label flip-hint rv">
              Tap or swipe to flip · <span id="flipcount">{storyCur + 1} / {weddingData.story.length}</span>
            </div>
          </div>
        </section>

        {/* SCRATCH CARD SECTION */}
        <section id="scratch" className="scene grain">
          {renderDecor(1)}
          <div className="label rv">Save the date</div>
          <div className="sec-title rv d1">Scratch to reveal</div>
          <div className="scratch-box rv d2">
            <div className="scratch-under" id="sc-under">
              <div className="label" style={{ marginBottom: 14, fontSize: '8.5px' }}>
                The wedding of
              </div>
              <div className="d">
                11 <small>—</small> 12
              </div>
              <div className="m">DECEMBER</div>
              <div className="y">2026</div>
              <svg width="90" height="12" style={{ marginTop: 14 }}>
                <path d="M0 6H38M52 6H90" stroke="#B8975A" />
                <path d="M45 1L50 6L45 11L40 6Z" fill="#B8975A" />
              </svg>
            </div>
            <canvas
              ref={canvasRef}
              id="sc"
              className={scratchDone ? 'done' : ''}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            <div className={`sc-hint label ${scratchHintHidden ? 'hide' : ''}`} id="sc-hint">
              Scratch gently
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="events" className="grain">
          <div style={{ textAlign: 'center', padding: '0 26px 40px' }}>
            <div className="label rv">Join the celebration</div>
            <div className="sec-title rv d1">Celebration of Love</div>
            <div className="rv d2" style={{ font: '400 28px var(--script)', color: 'var(--gold)' }}>
              laughter, blessings &amp; cherished memories
            </div>
            <div className="side-filter rv d3">
              <button
                type="button"
                className={`filter-btn ${filterSide === 'all' ? 'active' : ''}`}
                onClick={() => setFilterSide('all')}
              >
                All Events
              </button>
              <button
                type="button"
                className={`filter-btn ${filterSide === 'groom' ? 'active' : ''}`}
                onClick={() => setFilterSide('groom')}
              >
                Groom&apos;s Side
              </button>
              <button
                type="button"
                className={`filter-btn ${filterSide === 'bride' ? 'active' : ''}`}
                onClick={() => setFilterSide('bride')}
              >
                Bride&apos;s Side
              </button>
            </div>
            <div className="label rv d4" style={{ marginTop: 14, fontSize: 9 }}>
              Tap an event to save it to your calendar
            </div>
          </div>

          <div id="ev-list">
            {weddingData.schedule.map((day, di) => {
              const filteredEvents = day.events.filter(e => {
                if (filterSide === 'all') return true;
                if (filterSide === 'groom') return e.side === 'groom' || e.side === 'joint';
                if (filterSide === 'bride') return e.side === 'bride' || e.side === 'joint';
                return true;
              });

              if (filteredEvents.length === 0) return null;

              return (
                <div key={di} className={`day d${di}`}>
                  {renderDecor(di + 2)}
                  <div className="day-head">
                    <div className="dnum">{day.n}</div>
                    <div className="dmeta">
                      <span className="label">{day.weekday}</span>
                      <span className="dmon">december 2026</span>
                      <em>{day.tag}</em>
                    </div>
                  </div>

                  <ol className="tl">
                    {filteredEvents.map((e, ei) => {
                      globalEventCounter++;
                      const currId = globalEventCounter;
                      const isOpen = !!openEvents[currId];
                      return (
                        <li key={ei} className="evr">
                          <span
                            className="dot"
                            dangerouslySetInnerHTML={{
                              __html: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[e.icon] || ICONS.flower}</svg>`
                            }}
                          />
                          <div
                            className={`evc ${isOpen ? 'open' : ''}`}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isOpen}
                            onClick={evt => {
                              if ((evt.target as HTMLElement).closest('a')) return;
                              toggleEvent(currId);
                            }}
                            onKeyDown={evt => {
                              if (evt.key === 'Enter' || evt.key === ' ') {
                                evt.preventDefault();
                                toggleEvent(currId);
                              }
                            }}
                          >
                            <div className="ev-top">
                              <time>{e.time}</time>
                              {e.sideLabel && (
                                <span className={`side-badge ${e.side || 'joint'}`}>
                                  {e.sideLabel}
                                </span>
                              )}
                            </div>
                            <h3>
                              {e.name.includes('दी') ? (
                                <>
                                  {e.name.split('दी')[0]}<span className="dv">दी</span>{e.name.split('दी')[1]}
                                </>
                              ) : (
                                e.name
                              )}
                            </h3>
                            {e.note && <p className="note">{e.note}</p>}
                            <div className="more">
                              <a
                                className="cal"
                                download={`event-${currId}.ics`}
                                href={createIcsDataUri(e.name, e.iso, e.note)}
                              >
                                + Add to calendar
                              </a>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* VENUE SECTION */}
        <section id="venue" className="scene grain">
          <div className="label rv">The venue</div>
          <h2 className="sec-title rv d1" style={{ maxWidth: 380, margin: '14px auto 8px' }}>
            {weddingData.venue.name}
          </h2>
          <p className="rv d2" style={{ font: '400 16px/1.6 var(--sans)', color: 'var(--olive)', letterSpacing: '.08em', marginBottom: 6 }}>
            {weddingData.venue.city}
          </p>
          <div className="gold-line rv d2" style={{ width: 120, margin: '14px auto 20px' }}></div>
          <div className="rv d3">
            <a
              className="btn"
              href={weddingData.venue.map}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps <span>&rarr;</span>
            </a>
          </div>
        </section>

        {/* FAMILIES SECTION */}
        <section id="families" className="scene grain alt">
          {renderDecor(5)}
          <div className="label rv">With the blessings of</div>
          <div className="sec-title rv d1">Our Families</div>
          <div className="fam" id="fam">
            {/* Groom side */}
            <div className="side rv">
              <div className="label">{weddingData.families.groom.label}</div>
              <div className="nm2">{weddingData.families.groom.name}</div>
              <div className="of">{weddingData.families.groom.of}</div>
              <div className="par">{weddingData.families.groom.parents}</div>
            </div>

            {/* Lotus Divider */}
            <div className="div rv">
              <i></i>
              <svg
                viewBox="-20 -24 40 30"
                dangerouslySetInnerHTML={{ __html: lotus(0, 4, 1.2) }}
              />
              <i></i>
            </div>

            {/* Bride side */}
            <div className="side rv">
              <div className="label">{weddingData.families.bride.label}</div>
              <div className="nm2">{weddingData.families.bride.name}</div>
              <div className="of">{weddingData.families.bride.of}</div>
              <div className="par">{weddingData.families.bride.parents}</div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN & DIYA SECTION */}
        <section id="count" className={`scene dk ${diyaLit ? 'lit' : ''}`}>
          {renderDecor(6)}
          <div className="label rv">Counting the moments</div>
          <h2 className="rv d1">The day is almost here</h2>

          <div className="cd rv d2" id="cd">
            <div className="row">
              <div className="n" id="cd0">
                {timeLeft.days}
              </div>
              <div className="u">DAYS</div>
            </div>
            <div className="row">
              <div className="n" id="cd1">
                {timeLeft.hours}
              </div>
              <div className="u">HOURS</div>
            </div>
            <div className="row">
              <div className="n" id="cd2">
                {timeLeft.mins}
              </div>
              <div className="u">MINUTES</div>
            </div>
          </div>

          <button
            className={`diya rv d3 ${diyaLit ? 'lit' : ''}`}
            id="diya"
            aria-label="Light the diya"
            onClick={handleDiyaClick}
          >
            <svg viewBox="0 0 84 56">
              <defs>
                <radialGradient id="gl">
                  <stop offset="0" stopColor="#ffe9a8" stopOpacity=".9" />
                  <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle className="glow" cx="42" cy="22" r="38" fill="url(#gl)" />
              <path d="M8 30h68q-4 22-34 22T8 30z" fill="#B8975A" />
              <path d="M8 30h68" stroke="#DCC48F" strokeWidth="2" />
              <ellipse cx="42" cy="30" rx="34" ry="3" fill="#8A6A3B" />
              <g className="flame">
                <path d="M42 28C32 20 40 12 42 2C44 12 52 20 42 28Z" fill="#F6B94C" />
                <path d="M42 27C37 22 41 17 42 11C43 17 47 22 42 27Z" fill="#FFF1B8" />
              </g>
            </svg>
            <span className="label" id="diya-t" style={{ color: 'var(--gold-l)', fontSize: 9 }}>
              {diyaLit ? 'Shubh Muhurat' : 'Tap to light the diya'}
            </span>
          </button>
        </section>

        {/* CLOSING SECTION */}
        <section id="closing" className="scene grain">
          {renderDecor(7)}
          <div className="sun"></div>
          <div className="line rv" id="c-line">
            {weddingData.closing.line}
          </div>

          {/* Couple Logo Medallion with 18-petal scalloped rosette outline */}
          <figure className="logo rv d2">
            <svg
              viewBox="40 40 1220 1220"
              role="img"
              aria-label="Jainam and Siddhi - My path only leads to you"
            >
              <defs>
                <clipPath id="lgc">
                  <path id="lgp" d={rosetteD} />
                </clipPath>
              </defs>
              <image
                id="c-logo"
                href={weddingData.logo}
                width="1254"
                height="1254"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#lgc)"
              />
              <path id="lgr" fill="none" stroke="#CDB071" strokeWidth="6" d={rosetteD} />
              <path
                id="lgr2"
                fill="none"
                stroke="#CDB071"
                strokeWidth="2.5"
                opacity=".8"
                transform="translate(650 650) scale(.945) translate(-650 -650)"
                d={rosetteD}
              />
            </svg>
          </figure>

          <div className="fin rv d4">
            <div className="deva">शुभ विवाह</div>
            <div className="label" id="c-fin" style={{ color: 'var(--olive)' }}>
              {weddingData.closing.fin}
            </div>
            <a
              className="btn top-btn"
              href="#opening"
              onClick={e => {
                e.preventDefault();
                document.getElementById('opening')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Back to top
            </a>
          </div>

          <svg
            className="skyline"
            id="sky"
            viewBox="0 0 480 120"
            preserveAspectRatio="xMidYMax slice"
            dangerouslySetInnerHTML={{ __html: skylineMarkup }}
          />
        </section>
      </main>
    </>
  );
}
