(() => {
  /**
   * FAQ list — edit this array only.
   * - open: true → expanded by default
   * - a: answer HTML (links allowed; keep trusted/internal only)
   */
  const FAQS = [
    {
      q: "Bodol কি আমার টাকা নিয়ে পালিয়ে যেতে পারে?",
      a: "না — Bodol আপনার টাকা নিয়ে পালিয়ে যেতে পারে না। আমাদের টিম পাবলিক; যোগাযোগ, অ্যাপ্রোচ আর জবাবদিহিতা খোলামেলা। টাকা নিয়ে পালানোর সুযোগ এখানে নেই — ধরা পড়ার ঝুঁকিই সবচেয়ে বেশি। তাই আপনার টাকা নিরাপদ ফ্লোতেই থাকে।",
      open: true,
    },
    {
      q: "সেলার কখন টাকা পায়?",
      a: "অ্যাকাউন্ট ট্রান্সফারের পর বায়ার কনফার্ম করে, আর অ্যাডমিন সব ঠিক আছে বলে কমপ্লিট মার্ক করে — তখনই প্রোটেকশন পিরিয়ড শুরু হয়। সাধারণত এটা ২৪ ঘণ্টা। বায়ার এক্সট্রা প্রোটেকশন নিলে তা ৭ দিন পর্যন্ত হতে পারে। এই সময় কোনো সমস্যা হলে Bodol টিম বায়ারকে সাপোর্ট দেয়। পিরিয়ড শেষ হলে সেলার টাকা পায় এবং উইথড্র করতে পারে।",
    },
    {
      q: "Bodol-কে আমি কেন বিশ্বাস করব?",
      a: "শুধু আমরা বলছি বলে আপনাকে Bodol-কে বিশ্বাস করতে হবে না। আমাদের transaction process, policies, business information এবং support system আপনি নিজেই যাচাই করতে পারবেন। আমরা বিশ্বাস করি, কথা দিয়ে নয়—স্বচ্ছভাবে কাজ করার মাধ্যমেই দীর্ঘমেয়াদে বিশ্বাস অর্জন করা যায়।",
    },
    {
      q: "Bodol বন্ধ হয়ে গেলে আমার টাকা কী হবে?",
      a: "কোনো কারণে Bodol-এর service বন্ধ হওয়ার পরিস্থিতি তৈরি হলে pending transaction, user balance এবং অন্যান্য পাওনা আমাদের নির্ধারিত policy অনুযায়ী handle করা হবে।",
    },
    {
      q: "আমার টাকা আসলে কার কাছে থাকে?",
      a: "আপনি payment করার পর টাকা সরাসরি seller-এর কাছে চলে যায় না। Order সম্পূর্ণ হওয়ার আগ পর্যন্ত payment Bodol-এর নির্ধারিত transaction flow-এর অধীনে থাকে।",
    },
    {
      q: "Order করার পর কি আমাকে সরাসরি Bodol-কে টাকা দিতে হবে?",
      a: "হ্যাঁ, order-এর payment Bodol-এর নির্ধারিত payment system-এর মাধ্যমে করতে হয়। এতে transaction-এর payment এবং order status একই system-এর মধ্যে রেকর্ড থাকে।",
    },
    {
      q: "Seller account না দিলে আমার টাকা কী হবে?",
      a: "Seller নির্ধারিত সময়ের মধ্যে account transfer না করলে buyer dispute করতে পারবেন। বিষয়টি transaction-এর তথ্য ও প্রমাণের ভিত্তিতে যাচাই করে পরবর্তী সিদ্ধান্ত নেওয়া হবে।",
    },
    {
      q: "Seller ভুল account দিলে কী হবে?",
      a: "Seller ভুল বা listing-এর সঙ্গে অসঙ্গত account দিলে buyer বিষয়টি dispute করতে পারবেন। প্রয়োজনীয় তথ্য যাচাই করার পর transaction-এর পরবর্তী ব্যবস্থা নেওয়া হবে।",
    },
    {
      q: "Account নেওয়ার পর seller আবার account নিয়ে নিলে কী হবে?",
      a: "Account transfer-এর পর কোনো সমস্যা হলে buyer নির্ধারিত সময়ের মধ্যে dispute করতে পারবেন। বিষয়টি transaction-এর তথ্য ও প্রমাণের ভিত্তিতে যাচাই করা হবে।",
    },
    {
      q: "Buyer এবং seller-এর মধ্যে সমস্যা হলে Bodol কী করবে?",
      a: "সমস্যা হলে নির্ধারিত dispute process-এর মাধ্যমে বিষয়টি জানানো যাবে। আমরা order, payment এবং সংশ্লিষ্ট তথ্য পর্যালোচনা করে policy অনুযায়ী সিদ্ধান্ত নেওয়ার চেষ্টা করি।",
    },
    {
      q: "Bodol কি আমার টাকা আটকে রাখতে পারে?",
      a: "কোনো কারণ ছাড়া টাকা আটকে রাখার কথা নয়। তবে dispute, verification বা security-related কোনো সমস্যা থাকলে transaction সাময়িকভাবে pending থাকতে পারে।",
    },
    {
      q: "Transaction বাতিল হলে আমার টাকা কোথায় যাবে?",
      a: "Transaction কেন বাতিল হয়েছে তার ওপর নির্ভর করে payment-এর পরবর্তী ব্যবস্থা নেওয়া হয়। প্রযোজ্য ক্ষেত্রে নির্ধারিত refund বা balance adjustment process অনুসরণ করা হবে।",
    },
    {
      q: "আমি কীভাবে জানব Bodol আসলে scam নয়?",
      a: "কোনো website শুধু একটি FAQ লিখে নিজেকে scam-free প্রমাণ করতে পারে না। তাই আমাদের business information, policies, transaction process, support system এবং বাস্তব user activity আপনি নিজেই যাচাই করতে পারবেন।",
    },
    {
      q: "Bodol কি buyer বা seller-এর সঙ্গে প্রতারণা করতে পারে?",
      a: "Bodol-এর transaction system buyer ও seller-এর transaction process পরিচালনা করার জন্য তৈরি। প্রতিটি order-এর নির্দিষ্ট status ও transaction record থাকে এবং সমস্যা হলে নির্ধারিত dispute process অনুসরণ করা হয়।",
    },
    {
      q: "সমস্যা হলে আমি কোথায় অভিযোগ করব?",
      a: "কোনো transaction বা service নিয়ে সমস্যা হলে Bodol-এর support বা dispute system-এর মাধ্যমে অভিযোগ জানাতে পারবেন। বিষয়টি প্রয়োজনীয় তথ্যের ভিত্তিতে পর্যালোচনা করা হবে।",
    },
    {
      q: "Bodol-এর transaction-এর কোনো রেকর্ড থাকে কি?",
      a: "হ্যাঁ। Order, payment এবং transaction-এর গুরুত্বপূর্ণ তথ্য system-এ রেকর্ড থাকে, যাতে প্রয়োজনে transaction-এর বিষয়গুলো যাচাই করা যায়।",
    },
  ];
  const CHEVRON = `<svg class="faq-chevron size-5 shrink-0 text-white/45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>`;

  const list = document.querySelector("[data-faq-list]");
  if (!list) return;

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  list.innerHTML = FAQS.map((item) => {
    const openAttr = item.open ? " open" : "";
    return `<details class="faq-item group py-5"${openAttr}>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
        <span class="font-semibold text-white">${escapeHtml(item.q)}</span>
        ${CHEVRON}
      </summary>
      <p class="mt-3 text-sm leading-relaxed text-white/55">${item.a}</p>
    </details>`;
  }).join("");
})();
