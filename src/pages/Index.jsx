import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Zap, Users, Layers, RefreshCw, ChevronDown, Star, Package, Briefcase, Target, ArrowRight } from "lucide-react";

// ====== 滚动进入动画 Hook ======
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return [ref, isInView];
}

// ====== 数字滚动动画组件 ======
function CountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target);
    let start = 0;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>);

}

// ====== 滚动进度条 ======
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #FF6B35, #FFD700, #FF9F1C)",
        boxShadow: "0 0 8px #FF9F1C"
      }} />);


}

// ====== 鼠标跟踪光晕 ======
function MouseGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 25 });
  const springY = useSpring(y, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const handler = (e) => {x.set(e.clientX);y.set(e.clientY);};
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-30 rounded-full"
      style={{
        width: 400,
        height: 400,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
        filter: "blur(2px)"
      }} />);


}

// ====== 流光扫描线 ======
function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden opacity-[0.03]">
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF9F1C, transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
      
    </div>);

}

// ====== 3D 卡片悬浮 Hook ======
function use3DCard() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set((e.clientY - cy) / rect.height * -12);
    rotateY.set((e.clientX - cx) / rect.width * 12);
  }, [rotateX, rotateY]);

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { rotateX: springX, rotateY: springY, onMouseMove, onMouseLeave };
}

// ====== 打字机文本 ======
function TypewriterText({ text, className = "", delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, text, delay]);

  return <span ref={ref} className={className}>{displayed}<span className="animate-pulse">|</span></span>;
}

// ====== 浮动粒子背景 ======
function FloatingParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 1,
    delay: Math.random() * 6,
    duration: Math.random() * 10 + 8,
    xRange: (Math.random() - 0.5) * 60,
    yRange: -(Math.random() * 60 + 20),
    color: ["#FF6B35", "#FFD700", "#FF9F1C", "#ff4081", "#00e5ff", "#C084FC"][i % 6]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) =>
      <motion.div
        key={p.id}
        className="absolute rounded-full"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}88`
        }}
        animate={{
          y: [0, p.yRange, 0],
          x: [0, p.xRange, 0],
          opacity: [0, 0.7, 0.3, 0.7, 0],
          scale: [0.5, 1.6, 0.8, 1.4, 0.5]
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }} />

      )}
    </div>);

}

// ====== A: 流体噪声背景 ======
function FluidBackground({ blobs }) {
  const defaultBlobs = [
  { color: "#FF6B35", x: "15%", y: "20%", duration: 12, delay: 0 },
  { color: "#FFD700", x: "75%", y: "65%", duration: 15, delay: 2 },
  { color: "#FF9F1C", x: "50%", y: "40%", duration: 18, delay: 4 },
  { color: "#e040fb", x: "85%", y: "15%", duration: 14, delay: 1 },
  { color: "#00e5ff", x: "10%", y: "80%", duration: 16, delay: 3 }];

  const list = blobs || defaultBlobs;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {list.map((blob, i) =>
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 500 + i * 80,
          height: 500 + i * 80,
          left: blob.x,
          top: blob.y,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${blob.color}22 0%, transparent 65%)`,
          filter: "blur(60px)"
        }}
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, -60, 80, -40, 0],
          scale: [1, 1.2, 0.9, 1.1, 1]
        }}
        transition={{ duration: blob.duration, delay: blob.delay, repeat: Infinity, ease: "easeInOut" }} />

      )}
    </div>);

}

// ====== B: 文字打散飞入特效 ======
function ScatterText({ text, className = "", isInView, delay = 0 }) {
  const chars = text.split("");
  return (
    <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
      {chars.map((char, i) =>
      <motion.span
        key={i}
        initial={{
          opacity: 0,
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          rotate: (Math.random() - 0.5) * 60,
          scale: 0.3
        }}
        animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + i * 0.04, ease: [0.23, 1.0, 0.32, 1.0] }}
        style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}>
        
          {char === " " ? "\u00a0" : char}
        </motion.span>
      )}
    </span>);

}

// ====== D: 卡片展开 Hook ======
function useCardDeal(count, isInView) {
  return (index) => ({
    initial: { opacity: 0, scale: 0.6, rotate: (index % 3 - 1) * 15, y: 60, zIndex: count - index },
    animate: isInView ? { opacity: 1, scale: 1, rotate: 0, y: 0, zIndex: 1 } : {},
    transition: { duration: 0.55, delay: index * 0.07, ease: [0.23, 1.0, 0.32, 1.0] }
  });
}

// ====== F: 鼠标拖尾粒子 ======
function MouseTrail() {
  const [trail, setTrail] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handler = (e) => {
      const id = idRef.current++;
      const particle = {
        id,
        x: e.clientX,
        y: e.clientY,
        color: ["#FF6B35", "#FFD700", "#FF9F1C", "#ff4081", "#00e5ff"][id % 5],
        size: Math.random() * 6 + 3
      };
      setTrail((prev) => [...prev.slice(-18), particle]);
      setTimeout(() => setTrail((prev) => prev.filter((p) => p.id !== id)), 800);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {trail.map((p, i) =>
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: p.x, top: p.y, translateX: "-50%", translateY: "-50%", background: p.color }}
          initial={{ width: p.size, height: p.size, opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -20 + Math.random() * 10 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }} />

        )}
      </AnimatePresence>
    </div>);

}

// ====== 龙虾装饰 ======
function LobsterDecor({ className = "", size = "text-4xl", delay = 0 }) {
  return (
    <motion.span
      className={`select-none inline-block ${size} ${className}`}
      animate={{
        rotate: [-5, 5, -5],
        y: [0, -8, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
      
      🦞
    </motion.span>);

}

// ====== Hero 区 ======
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const stats = [
  { num: "99", suffix: "+", label: "精选 Skill" },
  { num: "10", suffix: "+", label: "大应用场景" },
  { num: "∞", suffix: "", label: "持续上架中", isStatic: true }];


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 深色渐变背景 */}
      <div
        className="absolute inset-0"
        style={{
          background:
          "radial-gradient(ellipse at 20% 30%, #1a0a00 0%, #0d0d0d 40%, #0a0a14 100%)"
        }} />

      {/* 流体噪声背景 */}
      <FluidBackground />
      
      {/* 脉冲光晕 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #FF6B35 0%, transparent 70%)" }}
        animate={{ opacity: [0.12, 0.4, 0.18, 0.4, 0.12], scale: [1, 1.3, 0.9, 1.2, 1], x: [0, 40, -20, 30, 0], y: [0, -30, 20, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }}
        animate={{ opacity: [0.08, 0.3, 0.12, 0.28, 0.08], scale: [1, 1.2, 1.4, 0.95, 1], x: [0, -50, 30, -20, 0], y: [0, 40, -30, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #FF9F1C 0%, transparent 70%)" }}
        animate={{ opacity: [0.06, 0.22, 0.08, 0.2, 0.06], scale: [1, 1.4, 0.85, 1.3, 1], x: [0, 30, -40, 20, 0], y: [0, -40, 30, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }} />

      {/* 新增：品红光晕 */}
      <motion.div
        className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #e040fb 0%, transparent 70%)" }}
        animate={{ opacity: [0, 0.18, 0, 0.15, 0], scale: [0.8, 1.3, 0.9, 1.2, 0.8], x: [0, -30, 50, -20, 0], y: [0, 30, -50, 20, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

      {/* 新增：青蓝光晕 */}
      <motion.div
        className="absolute top-1/3 right-1/5 w-60 h-60 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #00e5ff 0%, transparent 70%)" }}
        animate={{ opacity: [0, 0.12, 0, 0.1, 0], scale: [0.7, 1.2, 1.0, 1.3, 0.7], x: [0, 40, -30, 10, 0], y: [0, -20, 40, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 7 }} />
      
      
      

      <FloatingParticles />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* 顶部标签 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-sm mb-8">
          
          <Zap size={14} />
          <span>木先生的AI盗木空间</span>
          <Zap size={14} />
        </motion.div>

        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-4 mb-6">
          
          <LobsterDecor size="text-5xl md:text-7xl" delay={0.2} />
          <motion.h1
            className="text-5xl md:text-7xl font-black tracking-tight"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 30%, #FF9F1C 60%, #FF6B35 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "300% auto"
            }}
            animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>

龙虾Skill大宝库
</motion.h1>
          <LobsterDecor size="text-5xl md:text-7xl" delay={0.5} />
        </motion.div>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">
          
          <TypewriterText text="Skill Everything" delay={800} />
        </motion.p>

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }} className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">每一个Skill，都是一次对工作方式的重新定义！



        </motion.p>

        {/* 数字亮点 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14">
          
          {stats.map((s, i) =>
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, y: -4 }}
            className="flex flex-col items-center px-10 py-5 rounded-2xl border border-orange-500/30"
            style={{
              background: "rgba(255,107,53,0.08)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(255,107,53,0.1)"
            }}>
            
              <span
              className="text-4xl font-black"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
              
                {s.isStatic ? s.num : <CountUp target={s.num} suffix={s.suffix} />}
              </span>
              <span className="text-gray-400 text-sm mt-1 whitespace-nowrap">{s.label}</span>
            </motion.div>
          )}
        </motion.div>

        {/* 滚动提示 */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500">
          
          <span className="text-xs tracking-widest uppercase">向下探索 × AI盗木空间</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>);

}

// ====== 模块2：什么可以Skill化 ======
function SkillableSection() {
  const [ref, isInView] = useScrollReveal(0.1);

  const fastRows = [
  {
    letter: "F",
    principle: "Fixed",
    question: "规则是否可固定？",
    agent: { icon: "⚡", label: "明确", desc: "规则明确、输入输出可定义的事" },
    human: { icon: "🌫️", label: "模糊", desc: "信息不完整、需要在模糊中做决断" }
  },
  {
    letter: "A",
    principle: "Automatable",
    question: "流程是否可自动化？",
    agent: { icon: "⚙️", label: "程序", desc: "搬运和组织信息、显性知识、程序化" },
    human: { icon: "💡", label: "洞察", desc: "隐性知识挖掘、价值判断、复杂决策" }
  },
  {
    letter: "S",
    principle: "Standardized",
    question: "任务是否可标准化？",
    agent: { icon: "📦", label: "批量", desc: "可复制、标准化、规模化——量的问题" },
    human: { icon: "🌟", label: "独特", desc: "微妙、不可标准化、因人而异——质的问题" }
  },
  {
    letter: "T",
    principle: "Testable",
    question: "交付物是否可验收？",
    agent: { icon: "✅", label: "事务", desc: "事务性工作、把事做完、把活交付" },
    human: { icon: "🤝", label: "人际", desc: "建立信任和共识、经营关系、情感纽带" }
  }];



  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a14 0%, #0f0a00 50%, #140a00 100%)"
      }}>
      {/* 顶部过渡遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, #080810, transparent)" }} />
      {/* 底部过渡遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to top, #0e0800, transparent)" }} />
      
      {/* 流体光影 */}
      <FluidBackground blobs={[
      { color: "#FFD700", x: "20%", y: "30%", duration: 14, delay: 0 },
      { color: "#FF6B35", x: "80%", y: "60%", duration: 17, delay: 2 },
      { color: "#AADF2E", x: "55%", y: "80%", duration: 20, delay: 5 },
      { color: "#FF9F1C", x: "10%", y: "70%", duration: 13, delay: 1 }]
      } />

      <div ref={ref} className="max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">
          
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-5"
            animate={{ boxShadow: ["0 0 0px rgba(255,107,53,0)", "0 0 12px rgba(255,107,53,0.3)", "0 0 0px rgba(255,107,53,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            
            <Zap size={13} />
            <span>Skill适配性 • 木氏FAST判断原则</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            <motion.span
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 30%, #FF9F1C 60%, #FF6B35 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% auto",
                display: "inline-block",
                fontFamily: "'Noto Sans SC', sans-serif"
              }}
              animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <ScatterText text="什么工作可以Skill化？" isInView={isInView} delay={0.1} />
            </motion.span>
          </h2>
          <p className="text-gray-400 text-lg">一个简单的检验标准：拿到任何一件事，先问自己："能不能写成SOP？"</p>
        </motion.div>

        {/* 对比表头 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-[1fr_130px_1fr] gap-0 mb-4 px-1">
<div className="flex items-center gap-2 justify-end py-2 pr-3">
<span className="text-orange-400 font-bold text-sm">适合 Agent / 可Skill化</span>
<motion.span
              style={{ display: "inline-block", fontSize: "1.125rem" }}
              animate={{ rotate: [0, -15, 15, -12, 12, -8, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.0 }}>🦞</motion.span>
</div>
<div />
<div className="flex items-center gap-2 justify-start py-2 pl-3">
<motion.span
              style={{ display: "inline-block", fontSize: "1.125rem" }}
              animate={{ rotate: [0, 12, -12, 10, -10, 6, -6, 0], y: [0, -2, 0, -2, 0] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}>🧠</motion.span>
<span className="font-bold text-sm" style={{ color: "#50B4FF" }}>适合人类 / 难以Skill化</span>
</div>
        </motion.div>

        {/* 对比行 */}
        <div className="flex flex-col gap-3 mb-14">
          {fastRows.map((row, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
            className="grid grid-cols-[1fr_130px_1fr] items-stretch gap-0">

              {/* Agent 侧（文字在左，图标在右紧贴中轴） */}
              <motion.div
              whileHover={{ scale: 1.02, x: -3 }}
              className="flex items-center gap-3 p-4 cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,159,28,0.06) 100%)",
                border: "1px solid rgba(255,107,53,0.25)",
                borderRight: "none",
                borderRadius: "16px 0 0 16px"
              }}>
                <div className="flex-1 flex items-baseline justify-end gap-2 flex-wrap">
                  <span className="text-gray-500 text-sm leading-relaxed text-right">{row.agent.desc}</span>
                  <span className="font-bold text-lg whitespace-nowrap text-orange-400">{row.agent.label}</span>
                </div>
                <span className="text-2xl flex-shrink-0">{row.agent.icon}</span>
              </motion.div>

              {/* 中间：FAST字母 + 原则 + 问题 */}
              <div className="flex flex-col items-center justify-center px-2 py-3 gap-0.5">
                <span className="font-black text-3xl leading-none" style={{ color: "#ffffff" }}>
                  {row.letter}
                </span>
                <span className="font-semibold text-xs leading-none" style={{ color: "#ffffff" }}>{row.principle}</span>
                <span className="text-xs text-center leading-snug mt-1 text-gray-400">{row.question}</span>
              </div>

              {/* 人类侧（图标靠左紧贴中轴，文字在右 — 镜像） */}
              <motion.div
              whileHover={{ scale: 1.02, x: 3 }}
              className="flex items-center gap-3 p-4 cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(80,100,200,0.12) 0%, rgba(60,80,180,0.06) 100%)",
                border: "1px solid rgba(80,180,255,0.25)",
                borderLeft: "none",
                borderRadius: "0 16px 16px 0"
              }}>
                <span className="text-2xl flex-shrink-0">{row.human.icon}</span>
                <div className="flex-1 flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-lg whitespace-nowrap" style={{ color: "#50B4FF" }}>{row.human.label}</span>
                  <span className="text-gray-500 text-sm leading-relaxed">{row.human.desc}</span>
                </div>
              </motion.div>

            </motion.div>
          )}
        </div>

                {/* 金句 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-10">
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            能写成SOP就能Skill化，写不清楚的背后，<br className="hidden md:block" />
            往往是<span className="font-semibold text-white">关系、权衡、品格、审美</span>——这四样东西没有标准答案。
          </p>
          <p className="text-gray-500 text-sm md:text-base mt-4">
            教程详见《
            <a
              href="https://mp.weixin.qq.com/s/YqEZYfS0ixcHeCvATtxmDA"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-orange-500/50 hover:decoration-orange-400 text-orange-400 hover:text-orange-300 transition-colors">
              小白图解AI系列② 一张图学会Agent Skill创作
            </a>
            》
          </p>
        </motion.div>
      </div>
    </section>);

}

// ====== 模块3：三大类别 ======
const categories = [
{
  id: "office",
  icon: Briefcase,
  emoji: "💼",
  title: "办公通用",
  subtitle: "Office Productivity",
  count: 14,
  desc: "不分岗位、不分专业——打工人都需要的通用技能！从PPT设计、Excel数据分析、文档写作、去AI味……全面覆盖日常高频的办公场景！",
  tags: ["PPT设计", "Excel数据分析", "写作润色", "会议管理", "头脑风暴", "更多 \u2192"],
  gradient: "linear-gradient(135deg, #1a0800 0%, #2d1200 100%)",
  borderColor: "rgba(255,107,53,0.4)",
  tagBg: "rgba(255,107,53,0.15)",
  tagColor: "#FF9F1C",
  accentColor: "#FF6B35",
  glowColor: "rgba(255,107,53,0.2)",
  badgeBg: "rgba(255,107,53,0.2)",
  badgeColor: "#FF6B35"
},
{
  id: "professional",
  icon: Target,
  emoji: "🎯",
  title: "专业细分",
  subtitle: "Specialist Skills",
  count: 0,
  desc: "按岗位、专业、职位深度定制的专项Skill！覆盖团队管理、HR专业、设计、自媒体等专业细分场景……这也是创建Sub Agent的关键能力库！",
  tags: ["团队管理", "HR技能", "设计工具", "微信文章", "小红书图文", "更多 \u2192"],
  gradient: "linear-gradient(135deg, #0a0f00 0%, #1a2000 100%)",
  borderColor: "rgba(180,220,60,0.35)",
  tagBg: "rgba(150,200,50,0.12)",
  tagColor: "#AADF2E",
  accentColor: "#B4DC3C",
  glowColor: "rgba(180,220,60,0.15)",
  badgeBg: "rgba(150,200,50,0.2)",
  badgeColor: "#AADF2E"
},
{
  id: "essential",
  icon: Package,
  emoji: "🔧",
  title: "装机必备",
  subtitle: "Essential Skills",
  count: 9,
  desc: "就像电脑装机必备软件，是AI工作流的基础能力包——自我进化、Token管理、垃圾清理、Skill搜索与创建……让你的龙虾小助手从零到满状态！",
  tags: ["自我进化", "Token管理", "垃圾清理", "Skill创建", "安全防护", "更多 \u2192"],
  gradient: "linear-gradient(135deg, #000a1a 0%, #001228 100%)",
  borderColor: "rgba(80,180,255,0.35)",
  tagBg: "rgba(60,160,255,0.12)",
  tagColor: "#5BC8FF",
  accentColor: "#50B4FF",
  glowColor: "rgba(80,180,255,0.15)",
  badgeBg: "rgba(60,160,255,0.2)",
  badgeColor: "#50B4FF"
}];


function CategoryCard({ cat, index, isInView }) {
  const IconComponent = cat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-3xl overflow-hidden flex flex-col cursor-default group"
      style={{
        background: cat.gradient,
        border: `1px solid ${cat.borderColor}`,
        boxShadow: `0 0 40px ${cat.glowColor}`
      }}>
      
      {/* 顶部光晕 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${cat.accentColor}, transparent)` }} />
      

      <div className="p-8 flex-1">
        {/* 图标+标题行 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}>
              
              {cat.emoji}
            </motion.span>
            <div>
              <h3 className="text-xl font-black text-white">{cat.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{cat.subtitle}</p>
            </div>
          </div>
          {/* Skill数量徽章 */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: cat.badgeBg, color: cat.badgeColor }}>
            
            <Star size={12} fill="currentColor" />
            <span>{(allSkills[cat.id] || []).filter((s) => !s.isMoreLink).length || cat.count} Skills</span>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{cat.desc}</p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {cat.tags.map((tag, i) =>
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: cat.tagBg, color: cat.tagColor, border: `1px solid ${cat.tagColor}30` }}>
            
              {tag}
            </span>
          )}
          <div />




          
        </div>
      </div>

      {/* 底部计数装饰 */}
      <div
        className="px-8 py-4 flex items-center justify-between"
        style={{ borderTop: `1px solid ${cat.borderColor}50` }}>
        
        <a
          href="https://github.com/muippt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs no-underline transition-colors duration-200"
          style={{ color: cat.accentColor + "99" }}
          onMouseEnter={(e) => e.currentTarget.style.color = cat.accentColor}
          onMouseLeave={(e) => e.currentTarget.style.color = cat.accentColor + "99"}>
          
          <IconComponent size={13} />
          <span>AI盗木空间 • 持续上架中</span>
        </a>
        <div className="flex gap-1">
          {Array.from({ length: Math.min((allSkills[cat.id] || []).filter((s) => !s.isMoreLink).length || cat.count, 5) }).map((_, i) =>
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.accentColor, opacity: 0.5 + i * 0.1 }} />

          )}
        </div>
      </div>
    </motion.div>);

}

function CategoriesSection() {
  const [ref, isInView] = useScrollReveal(0.05);

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #140a00 0%, #0a0010 50%, #000814 100%)"
      }}>
      {/* 顶部过渡遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, #0e0800, transparent)" }} />
      {/* 底部过渡遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to top, #000810, transparent)" }} />

      {/* 流体光影 */}
      <FluidBackground blobs={[
      { color: "#50B4FF", x: "75%", y: "20%", duration: 16, delay: 0 },
      { color: "#AADF2E", x: "15%", y: "55%", duration: 13, delay: 3 },
      { color: "#e040fb", x: "50%", y: "85%", duration: 18, delay: 1 },
      { color: "#FF6B35", x: "85%", y: "70%", duration: 15, delay: 4 }]
      } />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-5">
            <Layers size={13} />
            <span>三大技能分类</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            <motion.span
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 30%, #FF9F1C 60%, #FF6B35 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% auto",
                display: "inline-block",
                fontFamily: "'Noto Sans SC', sans-serif"
              }}
              animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <ScatterText text="找到属于你的 Skill 宝箱" isInView={isInView} delay={0.1} />
            </motion.span>
          </h2>
          <p className="text-gray-400 text-lg">把知识+流程+工具封装成可复用的AI能力单元，技术小白也能玩转AI工作流！</p>
        </motion.div>

        {/* 三栏卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) =>
          <CategoryCard key={cat.id} cat={cat} index={i} isInView={isInView} />
          )}
        </div>
      </div>
    </section>);

}

// ====== 所有 Skill 数据 ======
const allSkills = {
  essential: [
  {
name: "🔧Skill创作发明家",
desc: "一个 Skill 搞定从创作到质量门控的自建Skill全流程——3大设计决策 · 32条反模式 · 10层审计模型 · 自动化脚本。",
    link: "https://muippt.github.io/mu-skill-creator/",
    stars: 5,
tag: "Skill管理"
},
{
  name: "🧬Agent自我反思与进化器",
  desc: "AI Agent 持续进化系统 — 每日经验沉淀+每周错误反思，正向提炼与负向纠偏合一，让你的 Agent 越用越聪明。",
  link: "https://github.com/muippt/mu-self-evolve",
  stars: 5,
  tag: "Agent工具"
}],

  office: [
  {
    name: "🎨PPT智能设计师",
    desc: "AI 像设计师一样创作真正可编辑的专业PPT：🎨 14 种设计哲学流派｜📊 119 种图表类型｜🏛️ 40 套咨询模板｜🖼️ 6,732 个矢量图标｜🎨 26 套配色｜📏 8 种画布",
    link: "https://muippt.github.io/mu-ippt/",
    stars: 5,
    tag: "办公Office"
  },
  {
    name: "📊 Excel全能工具箱",
    desc: "一句话搞定合并、拆分、关联、图表、透视表、函数公式等22项Excel操作，告别重复劳动，再也不用手写公式和VBA。",
    link: "https://muippt.github.io/mu-excel-toolbox/",
    stars: 5,
    tag: "办公Office"
  },
  {
    name: "🔄 PDF文件转换器",
    desc: "高保真PDF格式转换工具 — 四层叠加解析、三引擎表格提取、外文自动翻译，将 PDF 转为完全可编辑的 PowerPoint、Word、Excel 和图片。",
    link: "https://muippt.github.io/mu-pdf-converter/",
    stars: 5,
    tag: "办公Office"
  }],

  professional: [
  {
    name: "📋Q12敬业度调研助手",
    desc: "基于盖洛普Q12的AI敬业度调研工具 — 从问卷设计、交互式测评、结果解读到90天改进计划，一站式提升团队敬业度。",
    link: "https://muippt.github.io/mu-q12-survey/",
    stars: 5,
    tag: "HR工具"
  }],

};

const tabConfig = [
{
key: "office",
label: "💼 办公通用",
color: "#FF6B35",
borderColor: "rgba(255,107,53,0.4)",
bg: "rgba(255,107,53,0.08)",
tagBg: "rgba(255,107,53,0.15)",
tagColor: "#FF9F1C",
cardBorder: "rgba(255,107,53,0.2)",
cardBg: "linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(255,159,28,0.03) 100%)",
linkColor: "#FF9F1C"
},
{
key: "professional",
label: "🎯 专业细分",
color: "#AADF2E",
borderColor: "rgba(180,220,60,0.35)",
bg: "rgba(150,200,50,0.08)",
tagBg: "rgba(150,200,50,0.15)",
tagColor: "#AADF2E",
cardBorder: "rgba(150,200,50,0.2)",
cardBg: "linear-gradient(135deg, rgba(150,200,50,0.06) 0%, rgba(120,180,30,0.03) 100%)",
linkColor: "#AADF2E"
},
{
  key: "essential",
  label: "🔧 装机必备",
  color: "#50B4FF",
  borderColor: "rgba(80,180,255,0.35)",
  bg: "rgba(60,160,255,0.08)",
  tagBg: "rgba(60,160,255,0.15)",
  tagColor: "#5BC8FF",
  cardBorder: "rgba(80,180,255,0.2)",
  cardBg: "linear-gradient(135deg, rgba(80,180,255,0.06) 0%, rgba(50,130,220,0.03) 100%)",
  linkColor: "#5BC8FF"
}];


// ====== 单个 Skill 卡片 ======
function SkillCard({ skill, tab, index, isInView }) {
  const { rotateX, rotateY, onMouseMove, onMouseLeave: on3DLeave } = use3DCard();

  // 特殊"更多"跳转卡片
  if (skill.isMoreLink) {
    return (
      <motion.a
        href={skill.link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.6, y: 60 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.9), ease: [0.23, 1.0, 0.32, 1.0] }}
        className="relative rounded-2xl flex flex-col p-5 group cursor-pointer no-underline overflow-hidden"
        style={{
          background: tab.cardBg,
          border: `1px dashed ${tab.borderColor}`,
          minHeight: "160px",
          transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = tab.bg;
          e.currentTarget.style.boxShadow = `0 12px 40px ${tab.bg}, 0 0 0 1px ${tab.borderColor}`;
          e.currentTarget.style.borderStyle = "solid";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = tab.cardBg;
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderStyle = "dashed";
        }}>
        {/* 背景装饰光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <motion.div
            className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full"
            style={{ background: `radial-gradient(circle, ${tab.borderColor} 0%, transparent 70%)`, filter: "blur(20px)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          
          <motion.div
            className="absolute -top-4 -left-4 w-20 h-20 rounded-full"
            style={{ background: `radial-gradient(circle, ${tab.borderColor} 0%, transparent 70%)`, filter: "blur(16px)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          
        </div>

        {/* 居中内容区 */}
        <div className="flex flex-col items-center justify-center flex-1 gap-3 relative z-10 text-center">
          {/* 主标题 */}
          <h4 className="font-bold leading-snug" style={{ fontSize: "24px", color: tab.color }}>
            美团管理主干Skill大全
          </h4>

          {/* 副标题 */}
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            覆盖业务管理 & 组织人才全链路
          </p>

          {/* 数字统计 */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black" style={{ color: tab.color }}>30+</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>AI Skill</span>
            </div>
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black" style={{ color: tab.color }}>10+</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>核心模块</span>
            </div>
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black" style={{ color: tab.color }}>∞</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>持续迭代</span>
            </div>
          </div>
        </div>
      </motion.a>);

  }

  return (
    <motion.a
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6, rotate: (index % 3 - 1) * 12, y: 60 }}
      animate={isInView ? { opacity: 1, scale: 1, rotate: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.9), ease: [0.23, 1.0, 0.32, 1.0] }}
      className="relative rounded-2xl flex flex-col p-5 group cursor-pointer no-underline overflow-hidden"
      style={{
        background: tab.cardBg,
        border: `1px solid ${tab.cardBorder}`,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transition: "box-shadow 0.2s, border-color 0.2s"
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 40px ${tab.bg}, 0 0 0 1px ${tab.borderColor}`;
        e.currentTarget.style.borderColor = tab.borderColor;
      }}
      onMouseLeave={(e) => {
        on3DLeave(e);
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = tab.cardBorder;
      }}>
      {/* 卡片内发光扫光效果 */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
        style={{
          background: `linear-gradient(225deg, ${tab.tagBg} 0%, transparent 60%)`,
          transition: "opacity 0.3s"
        }} />
      
      
      {/* 标签（PM专区卡片不显示） */}
      {!skill.isPM &&
      <div className="flex items-start justify-between mb-3 gap-2">
          <span
          className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
          style={{ background: tab.tagBg, color: tab.tagColor }}>
            {skill.tag}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: skill.stars }).map((_, i) =>
          <Star key={i} size={9} fill={tab.color} color={tab.color} />
          )}
          </div>
        </div>
      }

      {/* 标题行（PM卡片序号在右上角） */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold leading-snug flex-1" style={{ fontSize: "23px", color: skill.isPM ? tab.color : "white" }}>
          {skill.name}
        </h4>
        {skill.isPM &&
        <span className="font-mono font-bold tabular-nums flex-shrink-0"
        style={{ fontSize: "11px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        }
      </div>

      {/* 描述 */}
      <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-3 text-gray-500 group-hover:text-white transition-colors duration-300">
        {skill.desc}
      </p>

      {/* 底部链接 + 序号（非PM卡片） */}
      {!skill.isPM &&
      <div
        className="flex items-center justify-between gap-1.5 text-xs font-medium mt-auto"
        style={{ color: "rgba(255,255,255,0.55)" }}>
          <div className="flex items-center gap-1.5">
            <Zap size={11} />
            <span>点击查阅详情/下载安装包</span>
          </div>
          <span
          className="font-mono font-bold tabular-nums"
          style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      }
    </motion.a>);

}

// ====== 模块4：真实 Skill 卡片矩阵 ======
function SkillMatrixSection() {
  const [ref, isInView] = useScrollReveal(0.05);
  const [activeTab, setActiveTab] = useState("office");

  const currentTab = tabConfig.find((t) => t.key === activeTab);
  const currentSkills = allSkills[activeTab] || [];

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #000814 0%, #070710 50%, #0a0a0a 100%)"
      }}>
      {/* 顶部过渡遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, #000810, transparent)" }} />
      {/* 底部过渡遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to top, #090908, transparent)" }} />

      {/* 流体光影 */}
      <FluidBackground blobs={[
      { color: "#FF6B35", x: "10%", y: "25%", duration: 15, delay: 0 },
      { color: "#50B4FF", x: "80%", y: "40%", duration: 12, delay: 2 },
      { color: "#C084FC", x: "45%", y: "75%", duration: 19, delay: 1 },
      { color: "#AADF2E", x: "70%", y: "85%", duration: 16, delay: 3 }]
      } />
      
            <div ref={ref} className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-5">
            <Star size={13} fill="#FF9F1C" color="#FF9F1C" />
            <span>精选 Skill 全览</span>
          </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
              <a
              href="https://github.com/muippt"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{ cursor: "pointer" }}>
                <motion.span
                style={{
                  background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 30%, #FF9F1C 60%, #FF6B35 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "300% auto",
                  display: "inline-block",
                  fontFamily: "'Noto Sans SC', sans-serif"
                }}
                animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  Skill宝库一键安装 ↗
                </motion.span>
              </a>
            </h2>
<p className="text-gray-400 text-lg">点击卡片，直达Github主页，即刻使用</p>
        </motion.div>

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10">
          
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = (allSkills[tab.key] || []).filter((s) => !s.isMoreLink).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                isActive ?
                {
                  background: tab.bg,
                  border: `1px solid ${tab.borderColor}`,
                  color: tab.color,
                  boxShadow: `0 0 20px ${tab.bg}`
                } :
                {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#666"
                }
                }>
                
                <span>{tab.label}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={
                  isActive ?
                  { background: tab.tagBg, color: tab.tagColor } :
                  { background: "rgba(255,255,255,0.06)", color: "#555" }
                  }>
                  
                  {count}
                </span>
              </button>);

          })}
        </motion.div>

        {/* Skill 卡片网格 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSkills.map((skill, i) =>
            <SkillCard key={skill.name} skill={skill} tab={currentTab} index={i} isInView={isInView} />
            )}
            {currentSkills.length === 0 &&
            <div
              className="col-span-1 sm:col-span-2 rounded-2xl border border-dashed py-16 text-center text-sm"
              style={{ borderColor: currentTab.borderColor, color: "rgba(255,255,255,0.4)" }}>
              暂无 Skill，敬请期待上架 🦞
            </div>}
            </motion.div>
        </AnimatePresence>

      </div>
    </section>);

}

// ====== 结尾区 ======
function FooterSection() {
  const [ref, isInView] = useScrollReveal(0.2);

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0500 50%, #1a0800 100%)"
      }}>
      {/* 顶部过渡遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, #090908, transparent)" }} />

      {/* 流体光影 */}
      <FluidBackground blobs={[
      { color: "#FF6B35", x: "25%", y: "40%", duration: 18, delay: 0 },
      { color: "#FFD700", x: "70%", y: "25%", duration: 14, delay: 2 },
      { color: "#FF9F1C", x: "55%", y: "70%", duration: 16, delay: 4 },
      { color: "#e040fb", x: "10%", y: "80%", duration: 20, delay: 1 }]
      } />

      {/* 背景光晕 */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />
      

      <div ref={ref} className="max-w-4xl mx-auto text-center relative z-10">
        {/* 龙虾装饰 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="flex justify-center gap-6 mb-10">
          
          <LobsterDecor size="text-5xl" delay={0} />
          <LobsterDecor size="text-6xl" delay={0.3} />
          <LobsterDecor size="text-5xl" delay={0.6} />
        </motion.div>

        {/* 金句 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}>
          
          <div />
          <h2 className="text-3xl md:text-5xl font-black mb-6"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            background: "linear-gradient(135deg, #FFD700 0%, #FF9F1C 50%, #FF6B35 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: "1.5"
          }}>
            君子之治，始于不足见。
            <br />
            AI变革，始于小小Skill。
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }} className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">每一个Skill，都是一次对工作方式的重新定义。



          </motion.p>

          {/* AI盗木空间链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-10">
            
            <a
              href="https://github.com/muippt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm no-underline transition-all duration-200"
              style={{
                background: "rgba(255,107,53,0.06)",
                border: "1px solid rgba(255,107,53,0.2)",
                color: "#ffffff",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,107,53,0.14)";
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255,107,53,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,107,53,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}>

              <Zap size={13} style={{ color: "#FF9F1C" }} />
              <span style={{ color: "#FF9F1C" }}>更多Skill持续创作中，详见AI盗木空间</span>
              <Zap size={13} style={{ color: "#FF9F1C" }} />
            </a>
          </motion.div>
        </motion.div>

        {/* 底部标记 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3">
          
          <a
            href="https://mp.weixin.qq.com/s/v1JSZvlN5fvbOOHvkvXEtA"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", lineHeight: 0 }}>
            <img
              src="https://img.shields.io/badge/%E6%9C%A8%E5%85%88%E7%94%9FiPPT-07C160?logo=wechat&logoColor=white"
              alt="微信公众号 木先生iPPT"
              style={{ height: 20, borderRadius: 4 }} />
          </a>
          <a
            href="https://xhslink.com/m/ESxtgUNMdl"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", lineHeight: 0 }}>
            <img
              src="https://img.shields.io/badge/%E6%9C%A8%E5%85%88%E7%94%9FiPPT-FF2442?logo=xiaohongshu&logoColor=white"
              alt="小红书 木先生iPPT"
              style={{ height: 20, borderRadius: 4 }} />
          </a>
          <a
            href="https://item.m.jd.com/product/14547345.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", lineHeight: 0 }}>
            <img
              src="https://img.shields.io/badge/%E8%91%97%E4%BD%9C-%E3%80%8A%E5%9B%BE%E8%A7%A3%E5%9B%A2%E9%98%9F%E7%AE%A1%E7%90%86%E3%80%8B-BBDDE5?logo=bookstack&logoColor=white"
              alt="著作 《图解团队管理》"
              style={{ height: 20, borderRadius: 4 }} />
          </a>
          <a
            href="https://github.com/muippt"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", lineHeight: 0 }}>
            <img
              src="https://img.shields.io/badge/muippt-181717?logo=github&logoColor=white"
              alt="GitHub muippt"
              style={{ height: 20, borderRadius: 4 }} />
          </a>
        </motion.div>
      </div>
    </section>);

}

// ====== 主页面 ======
const Index = () => {
  return (
    <div
      className="w-full min-h-screen"
      style={{ background: "#0a0a0a", color: "#fff" }}>
      
      <ScrollProgressBar />
      <MouseGlow />
      <ScanLine />
      <MouseTrail />
      <HeroSection />
      <SkillableSection />
      <CategoriesSection />
      <SkillMatrixSection />
      <FooterSection />
    </div>);

};

export default Index;
