/* =================================================
   NAV ACTIVE AUTO
================================================= */
(function(){
  const nav = document.getElementById("topNav");
  if(!nav) return;
  const links = nav.querySelectorAll("a");
  const here = location.href.replace(/\/+$/,"");

  links.forEach(a=>a.classList.remove("active"));
  links.forEach(a=>{
    const href = a.href.replace(/\/+$/,"");
    if(here === href) a.classList.add("active");
  });
})();

/* =================================================
   SCROLL TOP
================================================= */
(function(){
  const btn = document.getElementById("scrollTopBtn");
  if(!btn) return;
  btn.addEventListener("click", ()=>{
    window.scrollTo({top:0, behavior:"smooth"});
  });
})();

/* =================================================
   OPTION B: 1920 기준 캔버스 스케일 + Y 오프셋
   - data-height: 캔버스 원본 높이(px)
   - data-offset: Y 오프셋(px, 음수면 위로 당김)
================================================= */
function applyCanvasScale(){
  document.querySelectorAll(".canvas").forEach(canvas=>{
    const baseW = 1920;
    const scale = window.innerWidth / baseW;

    const h = parseFloat(canvas.dataset.height || "0");
    const offset = parseFloat(canvas.dataset.offset || "0");

    // ✅ 스케일 + 오프셋(같이 스케일)
    canvas.style.transform = `translateY(${offset * scale}px) scale(${scale})`;

    // ✅ 부모 높이를 “스케일 반영”으로 잡아서 스크롤/클릭 꼬임 방지
    const wrap = canvas.closest(".canvas-wrap");
    if(wrap && h){
      const visibleH = (h + offset) * scale; // offset이 음수면 줄어듦
      wrap.style.height = Math.max(0, visibleH) + "px";
    }
  });
}
window.addEventListener("resize", applyCanvasScale);
applyCanvasScale();

/* =================================================
   HERO SLIDER (메인에만 존재)
   - 자동재생
   - hover 시 일시정지
   - 좌우 클릭 가능
================================================= */
(function(){
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero .slide");
  const prev = document.querySelector(".hero-control.prev");
  const next = document.querySelector(".hero-control.next");
  if(!slider || slides.length === 0) return;

  let idx = 0;
  const INTERVAL = 4500;
  let timer = null;
  let paused = false;

  function show(i){
    slides.forEach(s=>s.classList.remove("active"));
    slides[i].classList.add("active");
  }
  function nextSlide(){
    idx = (idx + 1) % slides.length;
    show(idx);
  }
  function prevSlide(){
    idx = (idx - 1 + slides.length) % slides.length;
    show(idx);
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(()=>{ if(!paused) nextSlide(); }, INTERVAL);
  }
  start();

  if(next) next.addEventListener("click", ()=>{ nextSlide(); start(); });
  if(prev) prev.addEventListener("click", ()=>{ prevSlide(); start(); });

  slider.addEventListener("mouseenter", ()=> paused = true);
  slider.addEventListener("mouseleave", ()=> paused = false);
})();
