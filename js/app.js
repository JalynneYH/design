/* =================================================
   옵션B: 1920 기준 캔버스 스케일
   - 창을 줄이면 전체가 비율대로 같이 줄어듭니다.
================================================= */
function applyCanvasScale() {
  const canvases = document.querySelectorAll(".canvas");
  canvases.forEach((canvas) => {
    const baseWidth = 1920;
    const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);

    // ✅ “잉크/컬러처럼” = 줄이면 같이 줄어듦
    // 확대도 원하시면: const scale = vw / baseWidth; 로 바꾸시면 됩니다.
    const scale = Math.min(1, vw / baseWidth);

    canvas.style.setProperty("--scale", scale);

    // ✅ 스케일된 높이만큼 canvas-stage에 높이 부여(푸터/스크롤 안정)
    const h = parseFloat(canvas.getAttribute("data-height")) || 0;
    const stage = canvas.closest(".canvas-stage");
    if (stage && h) stage.style.height = (h * scale) + "px";
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);

/* =================================================
   NAV ACTIVE AUTO
================================================= */
(function(){
  const nav = document.getElementById("topNav");
  if(!nav) return;

  const links = nav.querySelectorAll("a");
  const here = location.href.replace(/\/+$/,"");

  links.forEach(a => a.classList.remove("active"));
  links.forEach(a => {
    const href = a.href.replace(/\/+$/,"");
    if (here === href || (href !== a.origin + "/" && here.startsWith(href))) {
      a.classList.add("active");
    }
  });
})();

/* =================================================
   SCROLL TO TOP
================================================= */
(function(){
  const btn = document.getElementById("scrollTopBtn");
  if(!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* =================================================
   HERO SLIDER (메인에만 있을 때만 동작)
   - 자동재생 + 페이드 + 호버시 일시정지 + 화살표 클릭
================================================= */
(function(){
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero .slide");
  const prev = document.querySelector(".hero-control.prev");
  const next = document.querySelector(".hero-control.next");

  if(!slider || slides.length === 0) return;

  let index = 0;
  const INTERVAL = 4500;
  let timer = null;
  let paused = false;

  function show(i){
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide(){
    index = (index + 1) % slides.length;
    show(index);
  }

  function prevSlide(){
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(() => {
      if(!paused) nextSlide();
    }, INTERVAL);
  }

  start();

  if(next) next.addEventListener("click", () => { nextSlide(); start(); });
  if(prev) prev.addEventListener("click", () => { prevSlide(); start(); });

  slider.addEventListener("mouseenter", () => paused = true);
  slider.addEventListener("mouseleave", () => paused = false);
})();
