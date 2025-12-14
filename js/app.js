/* =================================================
   옵션B: 1920 기준 캔버스 스케일 + stage 높이 고정
================================================= */
function applyCanvasScale() {
  const canvases = document.querySelectorAll(".canvas");
  const baseWidth = 1920;
  const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
  const scale = Math.min(1, vw / baseWidth);

  canvases.forEach((canvas) => {
    canvas.style.setProperty("--scale", scale);

    const rawH = Number(canvas.dataset.height || 0);
    const rawOffset = Number(canvas.dataset.offset || 0);

    // ✅ offset이 있으면 위로 당겨서 빈 공간 제거 (메인만 사용)
    if (rawOffset > 0) {
      canvas.style.marginTop = (-rawOffset * scale) + "px";
    } else {
      canvas.style.marginTop = "0px";
    }

    // ✅ 캔버스가 차지해야 하는 "보이는 높이"
    const visibleH = Math.max(0, rawH - rawOffset) * scale;

    // ✅ footer가 위로 튀지 않도록 stage 높이를 확실히 잡음
    const stage = canvas.closest(".canvas-stage");
    if (stage && visibleH) stage.style.height = visibleH + "px";
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);

/* =================================================
   NAV ACTIVE AUTO (메인 '/' 오작동 수정 버전)
   - '/'(메인)은 오직 홈에서만 active
   - 나머지는 정확히 같은 폴더 경로로 매칭
================================================= */
(function () {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));

  // 현재 페이지의 pathname (끝 슬래시 정리)
  const herePath = location.pathname.replace(/\/+$/, "") || "/";

  // 모두 active 제거
  links.forEach(a => a.classList.remove("active"));

  // 링크들 중 현재 경로와 가장 잘 맞는 것 찾기
  // 규칙:
  // 1) 메인('/')은 herePath가 '/'일 때만 active
  // 2) 그 외는 "정확히 같은 경로"면 active
  // 3) (옵션) detail.html 같은 경우 type에 따라 상단 메뉴를 잡고 싶으면 아래 블록 참고
  let matched = null;

  for (const a of links) {
    const url = new URL(a.href, location.origin);
    const linkPath = url.pathname.replace(/\/+$/, "") || "/";

    if (linkPath === "/") {
      if (herePath === "/") matched = a;  // ✅ 홈에서만 MAIN active
      continue;
    }

    if (herePath === linkPath) {
      matched = a;
      break;
    }
  }

  // (옵션) detail.html에서 type 파라미터로 메뉴 활성화하고 싶을 때
  // - 원치 않으면 아래 블록은 그대로 둬도 문제 없습니다.
  if (!matched && herePath.endsWith("/detail.html")) {
    const type = new URLSearchParams(location.search).get("type");
    if (type === "design") matched = links.find(a => a.href.includes("/design/"));
    if (type === "color") matched = links.find(a => a.href.includes("/color-painting/"));
    if (type === "ink") matched = links.find(a => a.href.includes("/ink-painting/"));
    if (type === "main") matched = links.find(a => new URL(a.href).pathname === "/");
  }

  if (matched) matched.classList.add("active");
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
   HERO SLIDER (메인에만 있을 때만)
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
