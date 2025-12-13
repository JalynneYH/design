/* =================================================
   NAV ACTIVE AUTO
   - MAIN(/)은 진짜 메인 페이지에서만 active
   - 디자인/컬러/잉크에서는 해당 메뉴만 active
================================================= */
(function () {
  const nav = document.getElementById("topNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");

  // 현재 경로 (뒤 슬래시 제거)
  const currentPath =
    location.pathname.replace(/\/+$/, "") || "/";

  links.forEach((link) => link.classList.remove("active"));

  links.forEach((link) => {
    const linkPath =
      new URL(link.href).pathname.replace(/\/+$/, "") || "/";

    // ✅ MAIN은 루트('/')일 때만 active
    if (linkPath === "/") {
      if (currentPath === "/") {
        link.classList.add("active");
      }
      return;
    }

    // ✅ 그 외 페이지들
    if (
      currentPath === linkPath ||
      currentPath.startsWith(linkPath + "/")
    ) {
      link.classList.add("active");
    }
  });
})();

/* =================================================
   SCROLL TO TOP
================================================= */
(function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* =================================================
   OPTION B : CANVAS SCALE (축소만 허용)
   - 창 줄이면 비율 유지하며 같이 줄어듦
   - 창 키워도 확대되지 않음
================================================= */
function applyCanvasScale() {
  const canvases = document.querySelectorAll(".canvas");

  canvases.forEach((canvas) => {
    const BASE_WIDTH = 1920;
    const vw = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    // ✅ 핵심: 1보다 커지지 않게
    const scale = Math.min(1, vw / BASE_WIDTH);
    canvas.style.setProperty("--scale", scale);

    // 스크롤/푸터 안정용 높이 계산
    const h =
      parseFloat(canvas.getAttribute("data-height")) ||
      canvas.offsetHeight ||
      0;

    const stage = canvas.closest(".canvas-stage");
    if (stage && h) {
      stage.style.height = h * scale + "px";
    }
  });
}

window.addEventListener("load", applyCanvasScale);
window.addEventListener("resize", applyCanvasScale);
applyCanvasScale();
