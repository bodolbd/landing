(() => {
  const appUrl = "https://app.bodol.com";

  document.querySelectorAll("[data-app-link]").forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      el.href = appUrl;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });

  const header = document.querySelector("[data-site-header]");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showStatic = () => {
    document.querySelectorAll(".reveal, .hero-animate").forEach((el) => {
      el.style.visibility = "visible";
    });
  };

  if (reduced || typeof gsap === "undefined") {
    showStatic();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroItems = gsap.utils.toArray(".hero-animate");
  if (heroItems.length) {
    gsap.set(heroItems, { visibility: "visible" });
    gsap.from(heroItems, {
      y: 28,
      opacity: 0,
      duration: 0.85,
      stagger: 0.09,
      ease: "power3.out",
      clearProps: "transform",
    });
  }

  const heroPanel = document.querySelector(".hero-stage");
  if (heroPanel) {
    gsap.from(heroPanel, {
      y: 36,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });
  }

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.set(el, { visibility: "visible" });
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      y: 36,
      opacity: 0,
      duration: 0.75,
      ease: "power2.out",
      clearProps: "transform",
    });
  });

  const flowSteps = gsap.utils.toArray(".flow-step");
  if (flowSteps.length) {
    gsap.from(flowSteps, {
      scrollTrigger: {
        trigger: ".flow-track",
        start: "top 80%",
      },
      y: 20,
      opacity: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "power2.out",
    });
  }

  const networkPaths = document.querySelectorAll(".network-lines path");
  if (networkPaths.length) {
    networkPaths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 200;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".network-stage",
          start: "top 75%",
        },
      });
    });
  }

  const networkNodes = gsap.utils.toArray(".network-node");
  if (networkNodes.length) {
    gsap.from(networkNodes, {
      scrollTrigger: {
        trigger: ".network-stage",
        start: "top 75%",
      },
      scale: 0.85,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
    });
  }
})();
