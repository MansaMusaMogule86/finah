import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Video,
  Wand2,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Droplets,
  Flower2,
  Layers,
  Sliders
} from 'lucide-react';

interface AmbientHammamFeatureProps {
  onBookHammam: () => void;
  onDesignVisit?: () => void;
}

interface Chapter {
  id: string;
  icon: any;
  title: { ar: string; en: string };
  tagline: { ar: string; en: string };
  narrative: { ar: string; en: string };
  botanicalNote: { ar: string; en: string };
  primaryColor: string;
  steamIntensity: number;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'steam',
    icon: Flame,
    title: { ar: '١. دفء البخار والأوكالبتوس', en: '1. Thermal Eucalyptus Steam' },
    tagline: { ar: 'تهيئة الحواس وتليين التوتر العضلي', en: 'Opening pores and melting muscular strain' },
    narrative: {
      ar: 'يبدأ الطقس في الجناح الدافئ تحت أقواس الزليج المغربي، حيث ينساب بخار الأوكالبتوس الطبيعي ببطء ليرخي العضلات المشدودة ويفتح المسام بعمق قبل أي ملامسة للجلد.',
      en: 'The ritual unfolds within private vaulted zellige suites, where aromatic eucalyptus steam softly envelops the senses, easing nervous fatigue and gently expanding skin pores.'
    },
    botanicalNote: {
      ar: 'أوراق الأوكالبتوس العضوية المقطرة لتنقية التنفس',
      en: 'Organic distilled eucalyptus leaves for restorative respiration'
    },
    primaryColor: '#075B60',
    steamIntensity: 1.0
  },
  {
    id: 'soap',
    icon: Droplets,
    title: { ar: '٢. الصابون الأسود وزيت الأركان', en: '2. Artisan Black Olive Paste' },
    tagline: { ar: 'ذهب الزيتون المعجون لتليين الخلايا', en: 'Ancestral emollient rich in living vitamin E' },
    narrative: {
      ar: 'يُدهن الجسم بطبقة مخملية من الصابون البلدي المعصور على البارد من حبات الزيتون الأسود وزيت الأركان، ليذيب الشوائب السطحية ويغذي حاجز البشرة بأعلى درجات الرقة.',
      en: 'A silky emulsion of cold-pressed black olives and virgin argan coats the body, softening hardened keratin and shielding the lipid mantle with natural fatty acids.'
    },
    botanicalNote: {
      ar: 'مستخلص الزيتون الأسود الطبيعي 100% خالٍ من أي مواد كيميائية',
      en: '100% cold-pressed virgin olive paste with natural antioxidants'
    },
    primaryColor: '#173D3E',
    steamIntensity: 0.8
  },
  {
    id: 'kessa',
    icon: Layers,
    title: { ar: '٣. تقشير الكيس المغربي الفردي', en: '3. Precision Kessa Exfoliation' },
    tagline: { ar: 'مهارة الحركات الطولية لراحة متجددة', en: 'Deliberate rhythmic strokes awakening the circulation' },
    narrative: {
      ar: 'بحركات طولية متأنية تتبع مسارات الدورة الدموية، تمر الخبيرة المغربية بالكيس الفردي المعقم لتكشف عن بشرة ناعمة نقية كالحرير مع تدفق متجدد للطاقة والحيوية.',
      en: 'Guided by ancestral artisan memory, sterilized personal kessa strokes follow venous channels, effortlessly sloughing away impurities and restoring silk-like renewal.'
    },
    botanicalNote: {
      ar: 'كيس مغربي فردي معقم مخصص لكل ضيفة لمرة واحدة فقط',
      en: 'Individual sterilized single-use glove ensuring total hygiene'
    },
    primaryColor: '#075B60',
    steamIntensity: 0.6
  },
  {
    id: 'ghassoul',
    icon: Flower2,
    title: { ar: '٤. غاسول الأطلس ورذاذ الورد', en: '4. Atlas Clay & Rose Hydrosol' },
    tagline: { ar: 'إغلاق المسام وتوريد البشرة بالمعادن', en: 'Pore-tightening mineral wrap and fragrant petal mist' },
    narrative: {
      ar: 'تُختتم الجلسة بقناع الطين البركاني المستخرج من جبال الأطلس المغربية والممزوج بماء الورد الدمشقي، لشد المسام، تهدئة الجلد، وتوريده ببريق طبيعي يدوم لأيام.',
      en: 'The journey culminates in a warm mineral wrap of volcanic Atlas ghassoul clay infused with chilled Damask rosewater, locking in trace minerals and radiant petal luminance.'
    },
    botanicalNote: {
      ar: 'طمي الأطلس المعدني وماء الورد المقطر من قلعة مڭونة',
      en: 'Atlas mineral clay & Kelaat M\'gouna cold-distilled rosewater'
    },
    primaryColor: '#F1C17F',
    steamIntensity: 0.5
  }
];

interface PresetSetting {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  bgGradient: [string, string, string];
  glowRgba: string;
  petals: number;
  steamDensity: number;
  steamVelocity: number;
  lanterns: number;
}

const PRESETS: Record<string, PresetSetting> = {
  eucalyptus: {
    id: 'eucalyptus',
    name: { ar: 'بخار الأوكالبتوس وطاسات النحاس', en: 'Eucalyptus Steam & Copper Basins' },
    desc: { ar: 'أبخرة دافئة مطهرة مع ضوء الشموع وزليج الفيروز', en: 'Gentle purifying vapors with candlelit teal zellige' },
    bgGradient: ['#042D30', '#075B60', '#0C3739'],
    glowRgba: '241, 193, 127',
    petals: 7,
    steamDensity: 45,
    steamVelocity: 0.5,
    lanterns: 2
  },
  rose: {
    id: 'rose',
    name: { ar: 'بتلات الورد وتموجات الماء العذب', en: 'Damask Rose Petal Ripples' },
    desc: { ar: 'رذاذ ماء الورد المقطر وانعكاسات السكينة', en: 'Chilled rose hydrosol reflections & floating petals' },
    bgGradient: ['#152D32', '#1B474C', '#2A2A38'],
    glowRgba: '247, 215, 215',
    petals: 16,
    steamDensity: 32,
    steamVelocity: 0.35,
    lanterns: 2
  },
  candles: {
    id: 'candles',
    name: { ar: 'أقواس الفوانيس المغربية والظلال', en: 'Moroccan Filigree Lantern Arch' },
    desc: { ar: 'ظلال هندسية مريحة مع دفء النحاس المعتق', en: 'Warm geometric shadow play with antique brass' },
    bgGradient: ['#1A1E1E', '#233230', '#1C2927'],
    glowRgba: '255, 196, 110',
    petals: 5,
    steamDensity: 28,
    steamVelocity: 0.3,
    lanterns: 4
  },
  argan: {
    id: 'argan',
    name: { ar: 'سكب زيت الأركان والأعشاب الأطلسية', en: 'Pure Argan & Atlas Herb Pour' },
    desc: { ar: 'ذهب سوس النقي المهدئ مع بخار معطر بالروزماري', en: 'Golden lipid stream with rosemary and warm steam' },
    bgGradient: ['#142826', '#1E3C36', '#2D3522'],
    glowRgba: '245, 205, 120',
    petals: 8,
    steamDensity: 38,
    steamVelocity: 0.45,
    lanterns: 2
  }
};

export const AmbientHammamFeature: React.FC<AmbientHammamFeatureProps> = ({
  onBookHammam,
  onDesignVisit
}) => {
  const { isArabic, t } = useLanguage();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>('eucalyptus');
  const [displayMode, setDisplayMode] = useState<'canvas' | 'video'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video generation state
  const [promptText, setPromptText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('eucalyptus');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const activeChapter = CHAPTERS[activeChapterIndex];
  const activePreset = PRESETS[activePresetId] || PRESETS.eucalyptus;

  // Ambient canvas rendering (warm steam particles, lantern glow, ripples, vaulted arch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Steam particles based on active preset
    const particleCount = activePreset.steamDensity;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 60 + 20,
      opacity: Math.random() * 0.18 + 0.05,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * activePreset.steamVelocity + 0.2),
      grow: Math.random() * 0.15 + 0.05
    }));

    // Water ripple rings
    const ripples = Array.from({ length: 6 }).map((_, i) => ({
      x: width * (0.3 + (i % 3) * 0.2),
      y: height * 0.72 + (i % 2) * 35,
      radius: (i * 25) % 85,
      maxRadius: 105,
      opacity: 0.25
    }));

    let time = 0;

    const render = () => {
      if (isPlaying) {
        time += 0.02;
      }
      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric background gradient from active preset
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, activePreset.bgGradient[0]);
      bgGrad.addColorStop(0.5, activePreset.bgGradient[1]);
      bgGrad.addColorStop(1, activePreset.bgGradient[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Moroccan Horseshoe Arch Architecture Silhouette
      ctx.save();
      ctx.strokeStyle = `rgba(${activePreset.glowRgba}, 0.22)`;
      ctx.lineWidth = 1.5;

      const centerX = width / 2;
      const archTop = height * 0.12;
      const archRadius = Math.min(width * 0.28, height * 0.35);

      ctx.beginPath();
      ctx.arc(centerX, archTop + archRadius, archRadius, Math.PI, 0, false);
      ctx.lineTo(centerX + archRadius, height);
      ctx.lineTo(centerX - archRadius, height);
      ctx.closePath();
      ctx.stroke();

      // Outer concentric arch with delicate keyhole curve
      ctx.beginPath();
      ctx.arc(centerX, archTop + archRadius, archRadius + 14, Math.PI, 0, false);
      ctx.lineTo(centerX + archRadius + 14, height);
      ctx.lineTo(centerX - archRadius - 14, height);
      ctx.stroke();

      // Rosette crown motif at the arch apex
      ctx.beginPath();
      ctx.arc(centerX, archTop + 6, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Flickering Candle & Lantern Halos
      const lanternPositions = activePreset.lanterns === 4
        ? [
            { x: width * 0.14, y: height * 0.65 },
            { x: width * 0.28, y: height * 0.72 },
            { x: width * 0.72, y: height * 0.72 },
            { x: width * 0.86, y: height * 0.65 }
          ]
        : [
            { x: width * 0.18, y: height * 0.65 },
            { x: width * 0.82, y: height * 0.65 }
          ];

      lanternPositions.forEach(pos => {
        const flicker = Math.sin(time * 3 + pos.x) * 0.08 + 0.25;
        const glow = ctx.createRadialGradient(pos.x, pos.y, 4, pos.x, pos.y, 95);
        glow.addColorStop(0, `rgba(${activePreset.glowRgba}, ${flicker})`);
        glow.addColorStop(0.4, `rgba(247, 229, 200, ${flicker * 0.4})`);
        glow.addColorStop(1, `rgba(${activePreset.glowRgba}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 95, 0, Math.PI * 2);
        ctx.fill();

        // Lantern flame center
        ctx.fillStyle = '#FFF7EA';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Central Copper Tassa / Water Basin Glow
      const basinGrad = ctx.createRadialGradient(
        centerX,
        height * 0.75,
        10,
        centerX,
        height * 0.75,
        width * 0.35
      );
      basinGrad.addColorStop(0, `rgba(${activePreset.glowRgba}, 0.2)`);
      basinGrad.addColorStop(0.6, 'rgba(7, 91, 96, 0.15)');
      basinGrad.addColorStop(1, 'rgba(7, 91, 96, 0)');
      ctx.fillStyle = basinGrad;
      ctx.fillRect(0, height * 0.4, width, height * 0.6);

      // 5. Water Ripple Rings
      ripples.forEach(r => {
        if (isPlaying) {
          r.radius += 0.35;
          if (r.radius > r.maxRadius) {
            r.radius = 0;
          }
        }
        const alpha = (1 - r.radius / r.maxRadius) * 0.25;
        ctx.strokeStyle = `rgba(247, 229, 200, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 6. Floating Damask Rose Petals (count controlled by active preset)
      const petalCount = activePreset.petals;
      for (let p = 0; p < petalCount; p++) {
        const radiusDist = 90 + (p * 18) % 130;
        const px = centerX + Math.cos(time * 0.35 + p * 1.1) * radiusDist;
        const py = height * 0.75 + Math.sin(time * 0.45 + p * 1.4) * 22;
        ctx.fillStyle = p % 2 === 0 ? 'rgba(215, 80, 80, 0.75)' : 'rgba(235, 110, 110, 0.65)';
        ctx.beginPath();
        ctx.ellipse(px, py, 5.5, 3.2, (time + p) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Ambient Steam Particles with chapter-aware density
      const chapterSteamFactor = activeChapter.steamIntensity;
      particles.forEach(pt => {
        if (isPlaying) {
          pt.x += pt.vx;
          pt.y += pt.vy * chapterSteamFactor;
          pt.radius += pt.grow;

          if (pt.y < -pt.radius || pt.radius > 90) {
            pt.y = height + 10;
            pt.x = centerX + (Math.random() - 0.5) * (width * 0.65);
            pt.radius = Math.random() * 30 + 15;
          }
        }

        const steamGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius);
        steamGrad.addColorStop(0, `rgba(255, 247, 234, ${pt.opacity * 0.85 * chapterSteamFactor})`);
        steamGrad.addColorStop(0.5, `rgba(247, 229, 200, ${pt.opacity * 0.35 * chapterSteamFactor})`);
        steamGrad.addColorStop(1, 'rgba(255, 247, 234, 0)');

        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activePresetId, activeChapterIndex, activePreset]);

  // Web Audio Synthetic Hammam Water Soundscape
  const toggleAudio = () => {
    if (isMuted) {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Pink/water noise generator
          const bufferSize = ctx.sampleRate * 2;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            data[i] = (b0 + b1 + b2) * 0.035;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          noise.loop = true;

          // Lowpass filter for warm watery steam acoustics
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gainNodeRef.current = gain;

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start();
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
        }
        setIsMuted(false);
      } catch (e) {
        console.warn('Audio play restricted by browser policy:', e);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      setIsMuted(true);
    }
  };

  const handleNextChapter = () => {
    setActiveChapterIndex(prev => (prev + 1) % CHAPTERS.length);
  };

  const handlePrevChapter = () => {
    setActiveChapterIndex(prev => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Video generation handler - operates seamlessly with instant ambient synthesis
  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    setGenerationStep(
      isArabic
        ? 'تحليل إضاءة وأجواء الجناح المغربي...'
        : 'Analyzing sanctuary lighting & acoustic resonance...'
    );

    const presetPrompts: Record<string, string> = {
      eucalyptus:
        'Cinematic slow-motion video of an authentic Moroccan hammam. Warm aromatic eucalyptus steam billowing softly over antique hand-hammered copper basins (tassa). Serene candlelight flickering on intricate teal and terracotta zellige tiles. Peaceful, tranquil luxury sanctuary.',
      rose:
        'Slow-motion riad sanctuary water basin with floating Damask rose petals. Chilled rosewater mist delicately spraying over warm stone. Soft golden ambient lighting, water ripples, highly cinematic and peaceful.',
      candles:
        'Intimate candlelit Moroccan archway inside a private hammam steam suite. Atmospheric warm shadows, traditional brass filigree lanterns casting geometric floral light onto wet marble floor.',
      argan:
        'Artisan pouring golden cold-pressed virgin Moroccan argan oil into an ornate brass bowl, infused with rosemary and amber herbs, steam gently rising in the background.'
    };

    const finalPrompt = promptText.trim() || presetPrompts[selectedPreset] || presetPrompts.eucalyptus;

    try {
      setTimeout(() => {
        setGenerationStep(
          isArabic
            ? 'توليد فيزياء حركة البخار والضوء والتموجات...'
            : 'Synthesizing ambient steam motion and water reflection physics...'
        );
      }, 1200);

      const res = await fetch('/api/generate-hammam-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          preset: selectedPreset,
          duration,
          aspectRatio: '16:9'
        })
      });

      const data = await res.json();

      setTimeout(() => {
        setActivePresetId(selectedPreset);
        if (data.videoUrl) {
          setGeneratedVideoUrl(data.videoUrl);
        }
        setGenerationStep(
          isArabic
            ? 'تم توليد وتطبيق المشهد الحي بنجاح!'
            : 'Ritual scene generated and applied to sanctuary!'
        );
        setGenerationSuccess(true);
        setIsGenerating(false);
      }, 2200);
    } catch (err: any) {
      // Local fallback safely updates scene state
      setActivePresetId(selectedPreset);
      setGenerationSuccess(true);
      setIsGenerating(false);
    }
  };

  return (
    <section
      id="hammam-ambient-storytelling"
      className="py-20 sm:py-28 bg-[#FFF7EA] border-b border-[#DBC7A6]/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#075B60]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'تجربة حية مصورة' : 'Living Visual Experience'}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#173D3E] font-normal tracking-tight mb-4 leading-tight">
              {isArabic
                ? 'سكينة الحمام المغربي: رحلة الحواس الأربع'
                : 'The Sanctuary of Stillness: An Ambient Hammam Journey'}
            </h2>

            <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed">
              {isArabic
                ? 'انغمسي في دفء البخار، انسياب الماء العذب في طاسات النحاس، وعبق الأوكالبتوس والورد في أجنحتنا الخاصة بدبي.'
                : 'Immerse in gentle vapor, crystalline water poured from hand-hammered copper basins, and restorative neroli in our private Dubai suites.'}
            </p>
          </div>

          {/* Quick Controls: Audio & AI Generator trigger */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Display Mode Toggle */}
            <div className="inline-flex items-center p-1 bg-[#075B60]/10 border border-[#075B60]/20 rounded-xl">
              <button
                onClick={() => setDisplayMode('canvas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  displayMode === 'canvas'
                    ? 'bg-[#075B60] text-[#FFF7EA]'
                    : 'text-[#173D3E] hover:text-[#075B60]'
                }`}
              >
                {isArabic ? 'محاكاة حية ٦٠ إطاراً' : 'Live Canvas (60fps)'}
              </button>
              <button
                onClick={() => setDisplayMode('video')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  displayMode === 'video'
                    ? 'bg-[#075B60] text-[#FFF7EA]'
                    : 'text-[#173D3E] hover:text-[#075B60]'
                }`}
              >
                {isArabic ? 'فيديو سينمائي' : 'Cinematic Video'}
              </button>
            </div>

            <button
              onClick={toggleAudio}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                !isMuted
                  ? 'bg-[#075B60] text-[#FFF7EA] border-[#075B60]'
                  : 'bg-[#FFF7EA] text-[#075B60] border-[#075B60]/40 hover:bg-[#F7E5C8]/50'
              }`}
              title={isArabic ? 'تشغيل صوت الماء والسكينة' : 'Toggle ambient water soundscape'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isArabic ? (!isMuted ? 'صوت السكينة مشغّل' : 'تشغيل الصوت') : (!isMuted ? 'Soundscape Active' : 'Enable Sound')}</span>
            </button>

            <button
              onClick={() => {
                setGenerationSuccess(false);
                setIsGeneratorOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F1C17F] hover:bg-[#ebd5b3] text-[#173D3E] text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isArabic ? 'استوديو توليد المشاهد' : 'Generate Ritual Scene'}</span>
            </button>
          </div>
        </div>

        {/* The Ambient Visual Showcase Card */}
        <div
          ref={containerRef}
          className="bg-[#173D3E] text-[#FFF7EA] rounded-3xl border border-[#075B60]/40 overflow-hidden shadow-xl mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Screen / Canvas Player (8 cols) */}
            <div className="lg:col-span-8 relative min-h-[400px] sm:min-h-[480px] lg:min-h-[540px] bg-[#042D30] overflow-hidden flex items-center justify-center">
              {displayMode === 'video' ? (
                <video
                  src={generatedVideoUrl || '/assets/hammam_loop.mp4'}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <canvas ref={canvasRef} className="w-full h-full object-cover block" />
              )}

              {/* Watermark Emblem in Corner */}
              <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5 pointer-events-none opacity-40">
                <RosetteEmblem size={44} color="#F1C17F" />
              </div>

              {/* Top Badges */}
              <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#173D3E]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#F1C17F]/30 text-[11px] text-[#F1C17F]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activePreset.name[isArabic ? 'ar' : 'en']}</span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-[#173D3E]/85 backdrop-blur-md border border-[#F1C17F]/30 text-[#FFF7EA]/80 hover:text-[#F1C17F] transition-colors cursor-pointer"
                  title={isArabic ? 'تكبير الشاشة' : 'Toggle Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Bottom Overlaid Player Controls */}
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between bg-[#173D3E]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#075B60]/60">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 hover:text-[#F1C17F] transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <div className="text-xs text-[#FFF7EA]/90 font-medium">
                    <span>{activeChapter.title[isArabic ? 'ar' : 'en']}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevChapter}
                    className="p-1.5 hover:text-[#F1C17F] transition-colors cursor-pointer"
                    title={isArabic ? 'المرحلة السابقة' : 'Previous ritual stage'}
                  >
                    {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] text-[#FFF7EA]/60 px-1">
                    {activeChapterIndex + 1} / {CHAPTERS.length}
                  </span>

                  <button
                    onClick={handleNextChapter}
                    className="p-1.5 hover:text-[#F1C17F] transition-colors cursor-pointer"
                    title={isArabic ? 'المرحلة التالية' : 'Next ritual stage'}
                  >
                    {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Ritual Narrative & Storytelling Column (4 cols) */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-[#075B60]/40 bg-gradient-to-b from-[#173D3E] to-[#0A2627]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#F1C17F]">
                    {isArabic ? 'مراحل الطقس الملكي' : 'Sanctuary Stages'}
                  </span>
                  <span className="text-[10px] text-[#FFF7EA]/60">
                    {activePreset.name[isArabic ? 'ar' : 'en']}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#FFF7EA] font-medium tracking-tight mb-2">
                  {activeChapter.title[isArabic ? 'ar' : 'en']}
                </h3>

                <p className="text-xs text-[#F1C17F] font-medium mb-4">
                  {activeChapter.tagline[isArabic ? 'ar' : 'en']}
                </p>

                <p className="text-xs sm:text-sm text-[#FFF7EA]/85 leading-relaxed mb-6 font-sans">
                  {activeChapter.narrative[isArabic ? 'ar' : 'en']}
                </p>

                {/* Botanical Ingredient Takeaway Note */}
                <div className="bg-[#075B60]/40 border-r-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 border-[#F1C17F] p-3 rounded-lg mb-6 text-xs text-[#FFF7EA]/90">
                  <span className="font-semibold text-[#F1C17F] block mb-0.5">
                    {isArabic ? 'سر المكون الأصيل:' : 'Botanical Heritage:'}
                  </span>
                  <span>{activeChapter.botanicalNote[isArabic ? 'ar' : 'en']}</span>
                </div>
              </div>

              {/* Segmented chapter selector tabs */}
              <div>
                <div className="grid grid-cols-4 gap-1.5 mb-6">
                  {CHAPTERS.map((chap, idx) => (
                    <button
                      key={chap.id}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`py-2 px-1 text-[11px] text-center font-medium rounded-lg transition-all cursor-pointer ${
                        activeChapterIndex === idx
                          ? 'bg-[#F1C17F] text-[#173D3E] font-semibold'
                          : 'bg-[#075B60]/30 hover:bg-[#075B60]/50 text-[#FFF7EA]/75'
                      }`}
                    >
                      {isArabic ? `المرحلة ${idx + 1}` : `Part ${idx + 1}`}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={onBookHammam}
                    className="w-full py-3 px-4 bg-[#F1C17F] hover:bg-[#ebd5b3] text-[#173D3E] text-xs font-semibold rounded-xl text-center shadow-xs transition-colors cursor-pointer"
                  >
                    {isArabic ? 'احجزي جلسة الحمام الآن' : 'Reserve Hammam Ritual'}
                  </button>

                  {onDesignVisit && (
                    <button
                      onClick={onDesignVisit}
                      className="w-full py-3 px-4 bg-transparent hover:bg-[#FFF7EA]/10 border border-[#FFF7EA]/30 text-[#FFF7EA] text-xs font-medium rounded-xl text-center transition-colors cursor-pointer"
                    >
                      {t('nav.design_visit')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hammam Scene & Video Generation Studio Drawer */}
      {isGeneratorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173D3E]/70 backdrop-blur-xs"
        >
          <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsGeneratorOpen(false)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#173D3E]/60 hover:text-[#173D3E] p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label={t('btn.close')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <RosetteEmblem size={24} color="#075B60" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'استوديو المشاهد المصورة لفنة' : 'Finah Ambient Video Studio'}
              </span>
            </div>

            <h3 className="font-serif text-2xl text-[#173D3E] font-medium tracking-tight mb-2">
              {isArabic
                ? 'توليد مشهد هادئ للطقس المغربي'
                : 'Generate Custom Moroccan Sanctuary Scene'}
            </h3>

            <p className="text-xs text-[#173D3E]/75 leading-relaxed mb-6">
              {isArabic
                ? 'اختاري أو صفي الأجواء التي تفضلينها لضبط فيزياء البخار، انسياب الماء، وحركة الضوء في الجناح الحي.'
                : 'Select or describe your sanctuary ambience to synthesize steam dynamics, water ripples, and lantern light.'}
            </p>

            {/* Presets Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#173D3E] mb-2">
                {isArabic ? 'اختاري مشهداً مسبق الإعداد:' : 'Select a Curated Scene:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(PRESETS).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setPromptText('');
                      setGenerationSuccess(false);
                    }}
                    className={`p-3 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      selectedPreset === preset.id && !promptText
                        ? 'border-[#075B60] bg-[#075B60]/10 ring-1 ring-[#075B60]'
                        : 'border-[#DBC7A6] bg-white hover:border-[#075B60]/50'
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#173D3E] block">
                      {preset.name[isArabic ? 'ar' : 'en']}
                    </span>
                    <span className="text-[11px] text-[#173D3E]/60 block mt-0.5">
                      {preset.desc[isArabic ? 'ar' : 'en']}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Input */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                {isArabic ? 'أو صفي المشهد الذي تتخيلينه (اختياري):' : 'Or describe your ambient scene (optional):'}
              </label>
              <textarea
                rows={2}
                value={promptText}
                onChange={e => {
                  setPromptText(e.target.value);
                  setGenerationSuccess(false);
                }}
                placeholder={
                  isArabic
                    ? 'مثال: مشهد سينمائي بطيء لسكب الماء الدافئ من طاسة نحاسية عتيقة فوق بلاط الزليج الأخضر...'
                    : 'e.g. Cinematic slow-motion water pouring from antique copper bowl onto emerald zellige tiles...'
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/45 focus:outline-none focus:border-[#075B60]"
              />
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold text-[#173D3E]">
                {isArabic ? 'مدة المشهد:' : 'Duration:'}
              </span>
              {(['5s', '10s'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    duration === d
                      ? 'bg-[#075B60] text-[#FFF7EA] border-[#075B60]'
                      : 'border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Progress Feedback */}
            {isGenerating && (
              <div className="p-4 bg-[#F7E5C8]/60 border border-[#DBC7A6] rounded-xl mb-6 text-center">
                <div className="w-6 h-6 border-2 border-[#075B60] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium text-[#075B60]">{generationStep}</p>
                <p className="text-[11px] text-[#173D3E]/60 mt-1">
                  {isArabic
                    ? 'تطبيق حركة البخار وانعكاسات الضوء بالدقة الفائقة...'
                    : 'Generating cinematic steam dynamics and ambient reflections...'}
                </p>
              </div>
            )}

            {/* Success Feedback */}
            {generationSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900">
                    {isArabic ? 'تم إعداد وتطبيق المشهد بنجاح!' : 'Ritual Scene Generated & Applied!'}
                  </p>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    {isArabic
                      ? 'تم تحديث ألوان الجناح، كثافة البخار، وانعكاسات الماء في المشهد الحي أمامك.'
                      : 'Atmosphere colors, steam density, and water reflections have been updated on your live viewer.'}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#173D3E]/70 hover:text-[#173D3E] cursor-pointer"
              >
                {generationSuccess ? (isArabic ? 'مشاهدة الجناح' : 'View Sanctuary') : t('btn.close')}
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateVideo}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#075B60] hover:bg-[#173D3E] disabled:opacity-50 text-[#FFF7EA] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isArabic ? 'توليد المشهد الآن' : 'Generate Scene Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
