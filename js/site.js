(() => {
  const appUrl = "https://app.bodolbd.com/";

  document.querySelectorAll("[data-app-link]").forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      const path = el.getAttribute("data-app-link") || "";
      el.href = new URL(path, appUrl).href;
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
    setFlowFinalState();
  };

  const FLOW_STATUS = [
    "বায়ার অর্ডার করল",
    "পেমেন্ট রেকর্ড হলো",
    "টাকা Bodol-এ আটকে আছে",
    "অ্যাকাউন্ট হস্তান্তর হচ্ছে",
    "বায়ার কনফার্ম করল",
    "সেলার টাকা পেল — অর্ডার সম্পন্ন",
  ];

  function setFlowFinalState() {
    const stage = document.querySelector("[data-flow-stage]");
    if (!stage) return;
    const steps = stage.querySelectorAll("[data-flow-step]");
    const status = stage.querySelector("[data-flow-status]");
    const progress = stage.querySelector("[data-flow-progress]");
    const token = stage.querySelector("[data-flow-token]");
    const chip = stage.querySelector("[data-flow-chip]");

    steps.forEach((step) => {
      step.classList.remove("is-active", "is-holding");
      step.classList.add("is-done");
    });
    stage.classList.add("is-complete");
    if (status) {
      status.textContent = FLOW_STATUS[FLOW_STATUS.length - 1];
      status.classList.add("is-complete");
    }
    if (progress) {
      progress.style.transform = "";
      progress.classList.add("is-full");
    }
    if (token) token.style.opacity = "0";
    if (chip) chip.style.opacity = "0";
  }

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

  initFlowEscrow();

  function initFlowEscrow() {
    const stage = document.querySelector("[data-flow-stage]");
    const track = document.querySelector("[data-flow-track]");
    if (!stage || !track) return;

    const steps = gsap.utils.toArray("[data-flow-step]", track);
    const token = stage.querySelector("[data-flow-token]");
    const chip = stage.querySelector("[data-flow-chip]");
    const progress = stage.querySelector("[data-flow-progress]");
    const status = stage.querySelector("[data-flow-status]");
    if (!token || steps.length < 2) return;

    const isDesktop = () => window.matchMedia("(min-width: 900px)").matches;

    const anchorOf = (step) => {
      const num = step.querySelector(".step-num") || step;
      const trackRect = track.getBoundingClientRect();
      const numRect = num.getBoundingClientRect();
      return {
        x: numRect.left + numRect.width / 2 - trackRect.left,
        y: numRect.top + numRect.height / 2 - trackRect.top,
      };
    };

    const setProgress = (index, total) => {
      if (!progress) return;
      const t = index / Math.max(total - 1, 1);
      if (isDesktop()) {
        gsap.set(progress, { scaleX: t, scaleY: 1 });
      } else {
        gsap.set(progress, { scaleY: t, scaleX: 1 });
      }
    };

    const clearStepState = () => {
      steps.forEach((step) => {
        step.classList.remove("is-active", "is-done", "is-holding");
      });
      stage.classList.remove("is-complete");
      if (status) status.classList.remove("is-complete");
    };

    const activateStep = (index, { holding = false, doneBefore = true } = {}) => {
      steps.forEach((step, i) => {
        step.classList.remove("is-active", "is-holding");
        if (doneBefore && i < index) step.classList.add("is-done");
        else step.classList.remove("is-done");
      });
      const current = steps[index];
      if (!current) return;
      current.classList.add(holding ? "is-holding" : "is-active");
      if (status) {
        status.textContent = FLOW_STATUS[index] || "";
        status.classList.toggle("is-complete", index === steps.length - 1);
      }
    };

    const placeAt = (el, point, extras = {}) => {
      gsap.set(el, { x: point.x, y: point.y, ...extras });
    };

    let holdPulse;
    const stopHoldPulse = () => {
      if (holdPulse) {
        holdPulse.kill();
        holdPulse = null;
      }
      gsap.set(token, { scale: 1 });
    };

    const startHoldPulse = () => {
      stopHoldPulse();
      holdPulse = gsap.to(token, {
        scale: 1.12,
        duration: 0.65,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut",
      });
    };

    let finished = false;
    let timeline = null;

    const buildTimeline = () => {
      clearStepState();
      stopHoldPulse();
      gsap.set([token, chip].filter(Boolean), { opacity: 0, scale: 1 });
      if (progress) {
        gsap.set(progress, {
          scaleX: isDesktop() ? 0 : 1,
          scaleY: isDesktop() ? 1 : 0,
        });
      }

      const points = steps.map(anchorOf);
      placeAt(token, points[0]);
      if (chip) placeAt(chip, points[3] || points[0]);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          finished = true;
        },
      });

      // Step 0 — buyer
      tl.to(token, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
      tl.call(() => {
        activateStep(0);
        setProgress(0, steps.length);
      }, null, 0);

      // Move through payment → Bodol hold
      for (let i = 1; i <= 2; i += 1) {
        tl.to(token, {
          x: points[i].x,
          y: points[i].y,
          duration: 0.9,
        });
        tl.call(() => {
          activateStep(i, { holding: i === 2 });
          setProgress(i, steps.length);
          if (i === 2) startHoldPulse();
        });
        if (i === 2) tl.to({}, { duration: 1.35 }); // escrow pause
      }

      // Transfer + confirm while money stays held
      tl.call(() => {
        activateStep(3, { holding: false });
        steps[2].classList.add("is-holding");
        steps[2].classList.remove("is-done");
        setProgress(3, steps.length);
      });

      if (chip && points[3] && points[4]) {
        placeAt(chip, points[3], { opacity: 0, scale: 0.7 });
        tl.to(chip, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
        tl.to(chip, {
          x: points[4].x,
          y: points[4].y,
          duration: 0.9,
        });
        tl.call(() => {
          activateStep(4);
          steps[2].classList.add("is-holding");
          steps[2].classList.remove("is-done");
          setProgress(4, steps.length);
        });
        tl.to(chip, { opacity: 0, scale: 0.85, duration: 0.45 }, "+=0.3");
      } else {
        tl.call(() => {
          activateStep(4);
          steps[2].classList.add("is-holding");
          setProgress(4, steps.length);
        });
        tl.to({}, { duration: 0.7 });
      }

      // Release funds to seller
      tl.call(() => {
        stopHoldPulse();
        steps[2].classList.remove("is-holding");
        steps[2].classList.add("is-done");
      });
      tl.to(token, {
        x: points[5].x,
        y: points[5].y,
        duration: 1.1,
        ease: "power3.inOut",
      });
      tl.call(() => {
        activateStep(5);
        steps.forEach((step) => {
          step.classList.remove("is-active", "is-holding");
          step.classList.add("is-done");
        });
        steps[5].classList.add("is-active");
        setProgress(5, steps.length);
        stage.classList.add("is-complete");
      });
      tl.to(
        token,
        {
          scale: 1.18,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        "-=0.05"
      );
      tl.to(token, { opacity: 0.9, duration: 0.3 }, "-=0.1");

      return tl;
    };

    ScrollTrigger.create({
      trigger: stage,
      start: "top 72%",
      once: true,
      onEnter: () => {
        if (finished) return;
        timeline = buildTimeline();
      },
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (finished || (timeline && timeline.progress() === 1)) {
          finished = true;
          const points = steps.map(anchorOf);
          placeAt(token, points[points.length - 1]);
          setProgress(steps.length - 1, steps.length);
          ScrollTrigger.refresh();
          return;
        }
        if (timeline && timeline.isActive()) {
          timeline.kill();
          stopHoldPulse();
          timeline = buildTimeline();
        }
        ScrollTrigger.refresh();
      }, 150);
    });
  }
})();
