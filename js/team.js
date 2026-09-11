(() => {
  /**
   * Team roster — edit this array only.
   * - image: path under assets/team/ (falls back to initials if missing)
   * - socials: omit or leave "" to hide a network
   */
  const TEAM = [
    {
      name: "সিয়াম শেখ",
      role: "ফাউন্ডার ও ডেভেলপার",
      bio: "প্রোডাক্ট ও মার্কেটপ্লেস এক্সপেরিয়েন্স — অর্ডার থেকে পেমেন্ট পর্যন্ত পুরো ফ্লো কেমন লাগে, সেটাই ডিজাইন করি।",
      initials: "SS",
      image: "assets/team/siam.webp",
      socials: {
        github: "https://github.com/SiamShekh/",
        x: "https://x.com/SyntaxSiam",
        telegram: "https://t.me/Siam_shekh_n",
        facebook: "https://www.facebook.com/siamm.sheikh",
      },
    },
    {
      name: "নাহিদ খান",
      role: "মার্কেটিং",
      bio: "গ্রোথ, ক্যাম্পেইন আর কাস্টমার সাপোর্ট — মানুষ যাতে Bodol খুঁজে পায় এবং সমস্যায় সাহায্য পায়।",
      initials: "NK",
      image: "assets/team/nahid.webp",
      socials: {
        telegram: "https://t.me/nahidkhan01",
        facebook: "",
        x: "",
        github: "",
      },
    },
  ];

  const SOCIAL_META = {
    github: { label: "GitHub" },
    x: { label: "X" },
    telegram: { label: "Telegram" },
    facebook: { label: "Facebook" },
  };

  const BN_INDEX = ["০১", "০২", "০৩", "০৪", "০৫", "০৬", "০৭", "০৮", "০৯", "১০"];

  const list = document.querySelector("[data-team-list]");
  if (!list) return;

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const socialLinks = (socials = {}) => {
    const links = Object.entries(SOCIAL_META)
      .map(([key, meta]) => {
        const href = socials[key];
        if (!href) return "";
        return `<a class="team-social" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(meta.label)}</a>`;
      })
      .filter(Boolean);

    if (!links.length) {
      return `<p class="team-socials-empty">প্রোফাইল লিংক শীঘ্রই যোগ হবে</p>`;
    }

    return `<nav class="team-socials" aria-label="সোশ্যাল প্রোফাইল">${links.join('<span class="team-social-sep" aria-hidden="true">/</span>')}</nav>`;
  };

  list.innerHTML = TEAM.map((member, index) => {
    const name = escapeHtml(member.name);
    const role = escapeHtml(member.role);
    const bio = escapeHtml(member.bio);
    const initials = escapeHtml(member.initials || "?");
    const image = member.image ? escapeHtml(member.image) : "";
    const idx = BN_INDEX[index] || String(index + 1).padStart(2, "0");
    const flip = index % 2 === 1 ? " is-flip" : "";

    const photo = image
      ? `<img class="team-photo-img" src="${image}" alt="${name}" width="480" height="600" loading="lazy" data-team-photo />`
      : "";

    return `<li class="team-person${flip}">
      <div class="team-photo">
        <span class="team-index" aria-hidden="true">${idx}</span>
        <div class="team-photo-frame">
          <span class="team-initials" aria-hidden="true">${initials}</span>
          ${photo}
        </div>
      </div>
      <div class="team-meta">
        <p class="team-role">${role}</p>
        <h2 class="team-name">${name}</h2>
        <p class="team-bio">${bio}</p>
        ${socialLinks(member.socials)}
      </div>
    </li>`;
  }).join("");

  list.querySelectorAll("[data-team-photo]").forEach((img) => {
    img.addEventListener("error", () => {
      img.remove();
    });
  });

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced && typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".team-person").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      });
    });
  }
})();
