/* Concept B interactions — vanilla JavaScript / no external libraries */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s),
    $$ = (s, root = document) => [...root.querySelectorAll(s)],
    clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyOff = false;
  const isOff = () => reduced.matches || manuallyOff;
  const menu = $(".menu-button"),
    nav = $("#nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute(
        "aria-label",
        open ? "メニューを閉じる" : "メニューを開く",
      );
    });
    $$("a", nav).forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      }),
    );
  }
  const motion = $("#motion-toggle");
  function syncMotion() {
    document.documentElement.classList.toggle("motion-off", isOff());
    if (motion) {
      motion.textContent = isOff() ? "動き OFF" : "動き ON";
      motion.setAttribute("aria-pressed", String(isOff()));
    }
    if (isOff()) $$(".reveal").forEach((el) => el.classList.add("visible"));
  }
  if (motion)
    motion.addEventListener("click", () => {
      manuallyOff = !manuallyOff;
      syncMotion();
    });
  reduced.addEventListener?.("change", syncMotion);
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".reveal").forEach((el) => observer.observe(el));
  syncMotion();
  // Home-page scent flow: calculate the path only on layout changes, never on every scroll.
  const scentFlow = document.body.dataset.page === "home" ? $(".b-scent-flow") : null;
  let scentLayoutFrame = 0,
    scentIntroStarted = false,
    scentIntroRunning = false,
    scentIntroTimer = 0;
  function scentDrawProgress() {
    if (!scentFlow) return 0;
    const height = Math.max(1, scentFlow.parentElement.scrollHeight);
    return clamp((window.scrollY + window.innerHeight * 0.94) / height);
  }
  function updateScentDraw(force = false) {
    if (!scentFlow || (scentIntroRunning && !force)) return;
    const progress = isOff() ? 1 : scentDrawProgress();
    $$(".b-scent-path", scentFlow).forEach((path) => {
      const length = Number(path.dataset.flowLength || 0);
      if (length) path.style.strokeDashoffset = String(length * (1 - progress));
    });
  }
  function finishScentIntro() {
    if (!scentFlow) return;
    window.clearTimeout(scentIntroTimer);
    scentIntroRunning = false;
    $$(".b-scent-path", scentFlow).forEach((path) => {
      path.style.transition = "none";
    });
    updateScentDraw(true);
  }
  function layoutScentFlow() {
    scentLayoutFrame = 0;
    if (!scentFlow) return;
    const main = scentFlow.parentElement,
      width = main.clientWidth,
      height = main.scrollHeight,
      bounds = (selector) => {
        const el = $(selector, main);
        return el
          ? { top: el.offsetTop, height: el.offsetHeight, bottom: el.offsetTop + el.offsetHeight }
          : { top: 0, height: 0, bottom: 0 };
      },
      heroBox = bounds(".b-hero"),
      storyBox = bounds(".story"),
      ownBox = bounds(".own-showcase"),
      productsBox = bounds(".products-feature"),
      techBox = bounds(".tech-story"),
      contactBox = bounds(".end-contact"),
      n = (value) => Math.round(value * 10) / 10;
    const primary = [
      `M ${n(width * 0.82)} -24`,
      `C ${n(width * 0.91)} ${n(heroBox.top + heroBox.height * 0.18)}, ${n(width * 0.69)} ${n(heroBox.top + heroBox.height * 0.58)}, ${n(width * 0.92)} ${n(heroBox.bottom)}`,
      `C ${n(width * 0.98)} ${n(storyBox.top + storyBox.height * 0.18)}, ${n(width * 0.79)} ${n(storyBox.top + storyBox.height * 0.64)}, ${n(width * 0.94)} ${n(storyBox.bottom)}`,
      `C ${n(width * 0.88)} ${n(ownBox.top + ownBox.height * 0.12)}, ${n(width * 0.49)} ${n(ownBox.top + ownBox.height * 0.43)}, ${n(width * 0.05)} ${n(ownBox.bottom)}`,
      `C ${n(width * 0.04)} ${n(productsBox.top + productsBox.height * 0.22)}, ${n(width * 0.03)} ${n(productsBox.top + productsBox.height * 0.66)}, ${n(width * 0.04)} ${n(productsBox.bottom)}`,
      `C ${n(width * 0.47)} ${n(techBox.top + techBox.height * 0.24)}, ${n(width * 0.56)} ${n(techBox.top + techBox.height * 0.7)}, ${n(width * 0.5)} ${n(techBox.bottom)}`,
      `C ${n(width * 0.34)} ${n(contactBox.top + contactBox.height * 0.22)}, ${n(width * 0.12)} ${n(contactBox.top + contactBox.height * 0.52)}, ${n(width * 0.2)} ${n(contactBox.bottom + 30)}`,
    ].join(" ");
    const secondary = [
      `M ${n(width * 1.04)} ${n(heroBox.top + heroBox.height * 0.12)}`,
      `C ${n(width * 0.91)} ${n(heroBox.top + heroBox.height * 0.36)}, ${n(width * 0.7)} ${n(heroBox.top + heroBox.height * 0.7)}, ${n(width * 0.74)} ${n(heroBox.bottom)}`,
      `C ${n(width * 0.63)} ${n(storyBox.top + storyBox.height * 0.25)}, ${n(width * 0.07)} ${n(storyBox.top + storyBox.height * 0.53)}, ${n(width * 0.08)} ${n(storyBox.bottom)}`,
      `C ${n(width * 0.06)} ${n(ownBox.top + ownBox.height * 0.25)}, ${n(width * 0.18)} ${n(ownBox.top + ownBox.height * 0.72)}, ${n(width * 0.96)} ${n(ownBox.bottom)}`,
      `C ${n(width * 0.97)} ${n(productsBox.top + productsBox.height * 0.16)}, ${n(width * 0.97)} ${n(productsBox.top + productsBox.height * 0.56)}, ${n(width * 0.96)} ${n(productsBox.bottom)}`,
      `C ${n(width * 0.97)} ${n(techBox.top + techBox.height * 0.28)}, ${n(width * 0.94)} ${n(techBox.top + techBox.height * 0.7)}, ${n(width * 0.92)} ${n(techBox.bottom)}`,
      `C ${n(width * 0.9)} ${n(contactBox.top + contactBox.height * 0.28)}, ${n(width * 0.84)} ${n(contactBox.top + contactBox.height * 0.64)}, ${n(width * 0.72)} ${n(contactBox.bottom + 30)}`,
    ].join(" ");
    scentFlow.setAttribute("viewBox", `0 0 ${width} ${height}`);
    scentFlow.querySelector("linearGradient").setAttribute("y2", String(height));
    [["primary", primary], ["secondary", secondary]].forEach(([name, d]) => {
      const paths = $$(`[data-flow="${name}"]`, scentFlow);
      paths.forEach((path) => path.setAttribute("d", d));
      const length = Math.ceil(paths[0].getTotalLength());
      paths.forEach((path) => {
        path.style.setProperty("--flow-length", String(length));
        path.dataset.flowLength = String(length);
      });
    });
    requestAnimationFrame(() => scentFlow.classList.add("is-ready"));
    if (isOff()) {
      $$(".b-scent-path", scentFlow).forEach((path) => {
        path.style.transition = "none";
        path.style.strokeDashoffset = "0";
      });
    } else if (!scentIntroStarted && window.scrollY < 8) {
      scentIntroStarted = true;
      scentIntroRunning = true;
      const paths = $$(".b-scent-path", scentFlow);
      paths.forEach((path) => {
        path.style.transition = "none";
        path.style.strokeDashoffset = path.dataset.flowLength;
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const progress = scentDrawProgress();
          paths.forEach((path, index) => {
            const length = Number(path.dataset.flowLength || 0);
            path.style.transition = `stroke-dashoffset ${index < 2 ? 2200 : 2450}ms cubic-bezier(.2,.72,.22,1)`;
            path.style.strokeDashoffset = String(length * (1 - progress));
          });
        }),
      );
      scentIntroTimer = window.setTimeout(finishScentIntro, 2550);
    } else if (!scentIntroRunning) {
      scentIntroStarted = true;
      updateScentDraw(true);
    }
  }
  function scheduleScentLayout() {
    if (!scentFlow || scentLayoutFrame) return;
    scentLayoutFrame = requestAnimationFrame(layoutScentFlow);
  }
  if (scentFlow) {
    scheduleScentLayout();
    window.addEventListener("load", scheduleScentLayout, { once: true });
    window.addEventListener("resize", scheduleScentLayout, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(scheduleScentLayout).observe(scentFlow.parentElement);
  }
  // Fragrance lineup carousel controls make the off-screen items explicit on desktop and mobile.
  const lineupRail = $("#lineup-rail"),
    lineupPrev = $(".lineup-prev"),
    lineupNext = $(".lineup-next"),
    lineupCurrent = $("#lineup-current");
  if (lineupRail && lineupPrev && lineupNext && lineupCurrent) {
    const lineupItems = $$(".lineup-item", lineupRail);
    let lineupFrame = 0;
    const lineupStep = () => {
      const first = lineupItems[0],
        styles = getComputedStyle(lineupRail);
      return first ? first.getBoundingClientRect().width + (parseFloat(styles.columnGap) || 0) : lineupRail.clientWidth;
    };
    function updateLineupControls() {
      lineupFrame = 0;
      const max = Math.max(0, lineupRail.scrollWidth - lineupRail.clientWidth),
        step = Math.max(1, lineupStep()),
        index = Math.min(lineupItems.length, Math.round(lineupRail.scrollLeft / step) + 1);
      lineupPrev.disabled = lineupRail.scrollLeft <= 2;
      lineupNext.disabled = lineupRail.scrollLeft >= max - 2;
      lineupCurrent.textContent = String(index).padStart(2, "0");
    }
    function scheduleLineupUpdate() {
      if (lineupFrame) return;
      lineupFrame = requestAnimationFrame(updateLineupControls);
    }
    lineupPrev.addEventListener("click", () =>
      lineupRail.scrollBy({ left: -lineupStep(), behavior: isOff() ? "auto" : "smooth" }),
    );
    lineupNext.addEventListener("click", () =>
      lineupRail.scrollBy({ left: lineupStep(), behavior: isOff() ? "auto" : "smooth" }),
    );
    lineupRail.addEventListener("scroll", scheduleLineupUpdate, { passive: true });
    window.addEventListener("resize", scheduleLineupUpdate, { passive: true });
    updateLineupControls();
  }
  // Scroll driven cinematic motion: use compositor-friendly transforms, no scroll jacking or pinning.
  const hero = $(".hero-photo-main img"),
    small = $(".hero-photo-small"),
    tech = $(".tech-visual img");
  let scheduled = false;
  function onFrame() {
    scheduled = false;
    if (isOff()) return;
    const y = window.scrollY,
      vh = window.innerHeight;
    if (scentFlow) {
      if (scentIntroRunning && y > 8) finishScentIntro();
      updateScentDraw();
      const max = Math.max(1, document.documentElement.scrollHeight - vh),
        progress = Math.max(0, Math.min(1, y / max));
      scentFlow.style.setProperty("--flow-scroll", `${((progress - 0.5) * 10).toFixed(2)}px`);
    }
    if (hero && y < vh * 1.7) {
      hero.style.transform = `scale(${(1.12 + Math.min(0.15, (y / vh) * 0.12)).toFixed(3)}) translateY(${(y * 0.055).toFixed(1)}px)`;
      if (small) small.style.translate = `0 ${(-y * 0.09).toFixed(1)}px`;
    }
    if (tech) {
      const r = tech.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = Math.max(
          -1,
          Math.min(1, (vh / 2 - r.top - r.height / 2) / vh),
        );
        tech.style.transform = `scale(1.09) translateY(${(p * 15).toFixed(1)}px)`;
      }
    }
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(onFrame);
      }
    },
    { passive: true },
  );
  if (document.body.dataset.page === "products") {
    const cards = $$(".finder-card"),
      buttons = $$(".filter-button"),
      status = $("#results-count");
    const valid = buttons.map((b) => b.dataset.filter);
    let current = new URLSearchParams(location.search).get("category") || "all";
    if (!valid.includes(current)) current = "all";
    function filter(cat, updateUrl) {
      current = cat;
      buttons.forEach((b) => {
        const active = b.dataset.filter === cat;
        b.classList.toggle("selected", active);
        b.setAttribute("aria-pressed", String(active));
      });
      let count = 0;
      cards.forEach((card) => {
        const show = cat === "all" || card.dataset.category === cat;
        card.hidden = !show;
        if (show) {
          count++;
          card.classList.add("visible");
        }
      });
      status.textContent = `${count}カテゴリーを表示しています。`;
      if (updateUrl) {
        const url = new URL(location.href);
        if (cat === "all") url.searchParams.delete("category");
        else url.searchParams.set("category", cat);
        history.replaceState(null, "", url);
      }
    }
    buttons.forEach((b) =>
      b.addEventListener("click", () => filter(b.dataset.filter, true)),
    );
    filter(current, false);
  }
  if (document.body.dataset.page === "detail") {
    const data = {
      sticker: {
        title: "マスクに貼る<br>アロマ",
        plain: "マスクに貼るアロマ",
        number: "ORIGINAL PRODUCTS / 01",
        gallery: "4 SCENTS / 12 STICKERS",
        lead: "香りを、そっと身につける。<br>植物由来の天然アロマを使った、マスクに貼るアロマシールです。",
        type: "アロマシール",
        size: "全4種 / 各12枚入り",
        scentsLabel: "ベルガモット、柚子、ペパーミント、クールミント",
        featureHeading: "毎日のマスクに、<br>香りという小さな選択を。",
        features: [
          [
            "天然アロマオイル",
            "植物から抽出した100%天然アロマオイルを使用しています。",
          ],
          ["4種類の香り", "気分や季節に合わせて、4つの香りから選べます。"],
          [
            "貼るだけの手軽さ",
            "イラスト入りのシールをマスクの外側に貼って楽しめます。",
          ],
        ],
        usage:
          "使用前に、商品パッケージと公式ページに記載された使用方法・注意事項をご確認ください。",
        image: "assets/official-mask-sticker.jpg",
        imageAlt: "マスクに貼るアロマ4種の公式商品画像",
        url: "https://www.ypcyy.co.jp/product/category/own-product-mask-sticker/",
        other: "マスクに吹くアロマを見る ↗",
        otherType: "spray",
        steps: [
          ["お好みのシールを選ぶ", "4種類の香りから、使いたいものを選びます。"],
          ["マスクに貼る", "マスクの外側に貼ってお使いください。"],
          ["香りを楽しむ", "ふんわり漂う香りを楽しめます。"],
        ],
        stepImage: "assets/howto-sticker-triptych.webp",
        stepAlts: [
          "アロマシールを選ぶ提案用イメージ",
          "マスクの外側にアロマシールを貼る提案用イメージ",
          "アロマシールを貼ったマスクの提案用イメージ",
        ],
        scents: [
          [
            "ベルガモット",
            "#edc687",
            "アールグレイの香りにも使われる、明るい柑橘系の香り。",
            "✦",
            "assets/scent-sticker-bergamot.jpg",
            "Citrus bergamia",
          ],
          [
            "柚子",
            "#e9d88b",
            "日本人にもなじみ深い、爽やかな柚子の香り。",
            "◌",
            "assets/scent-sticker-yuzu.jpg",
            "Citrus junos",
          ],
          [
            "ペパーミント",
            "#a8d0b4",
            "すっきりとした印象の、清涼感のある香り。",
            "✳",
            "assets/scent-sticker-peppermint.jpg",
            "Mentha piperita",
          ],
          [
            "クールミント",
            "#a8cddd",
            "ミントらしい涼やかさが特徴の香り。",
            "❋",
            "assets/scent-sticker-coolmint.jpg",
            "Mentha arvensis",
          ],
        ],
      },
      spray: {
        title: "マスクに吹く<br>アロマ",
        plain: "マスクに吹くアロマ",
        number: "ORIGINAL PRODUCTS / 02",
        gallery: "6 SCENTS / 25 mL",
        lead: "香りを、気軽にひと吹き。<br>持ち歩きやすいスリムボトルのマスク用アロマスプレーです。",
        type: "マスク用スプレー",
        size: "全6種 / 各25ml入り",
        scentsLabel:
          "ベルガモット、柚子、ラベンダー、ひのき、ペパーミント、クールミント",
        featureHeading: "好きな香りを、<br>気軽に持ち歩く。",
        features: [
          [
            "天然精油を厳選",
            "香りの専門メーカーが選んだ天然精油を使ったラインアップです。",
          ],
          ["6種類の香り", "柑橘、ハーブ、ウッディなど6つの香りから選べます。"],
          [
            "携帯しやすい25ml",
            "胸ポケットにも収まりやすい、スリムなスプレーボトルです。",
          ],
        ],
        usage:
          "マスクへ使用する際は、商品パッケージと公式ページに記載された使用方法・注意事項をご確認ください。",
        image: "assets/official-mask-spray.jpg",
        imageAlt: "マスクに吹くアロマ6種の公式商品画像",
        url: "https://www.ypcyy.co.jp/product/category/own-product-mask-spray/",
        other: "マスクに貼るアロマを見る ↗",
        otherType: "sticker",
        steps: [
          ["香りを選ぶ", "6種類の香りから、その日の気分で選びます。"],
          [
            "マスクにスプレー",
            "製品の注意事項と使用方法を確認してお使いください。",
          ],
          ["香りを楽しむ", "お気に入りの香りでマスク時間を過ごします。"],
        ],
        stepImage: "assets/howto-spray-triptych.webp",
        stepAlts: [
          "マスク用アロマスプレーを選ぶ提案用イメージ",
          "マスクの外側へアロマをスプレーする提案用イメージ",
          "マスクとアロマスプレーを並べた提案用イメージ",
        ],
        scents: [
          [
            "ベルガモット",
            "#edc687",
            "爽やかさとやわらかさを感じる柑橘系の香り。",
            "✦",
            "assets/scent-spray-bergamot.jpg",
            "Citrus bergamia",
          ],
          [
            "柚子",
            "#e9d88b",
            "親しみやすく清々しい柚子の香り。",
            "◌",
            "assets/scent-spray-yuzu.jpg",
            "Citrus junos",
          ],
          [
            "ラベンダー",
            "#bcb3d9",
            "やさしく落ち着いたフローラルの香り。",
            "✿",
            "assets/scent-spray-lavender.jpg",
            "Lavandula angustifolia",
          ],
          [
            "ひのき",
            "#98bca1",
            "森林のようなウッディな香り。",
            "♣",
            "assets/scent-spray-hinoki.jpg",
            "Chamaecyparis obtusa",
          ],
          [
            "ペパーミント",
            "#a8d0b4",
            "すっきりとしたハーブの香り。",
            "✳",
            "assets/scent-spray-peppermint.jpg",
            "Mentha piperita",
          ],
          [
            "クールミント",
            "#a8cddd",
            "ひんやりとした印象の清涼感ある香り。",
            "❋",
            "assets/scent-spray-coolmint.jpg",
            "Mentha arvensis",
          ],
        ],
      },
    };
    let kind = "sticker",
      scentIdx = 0;
    const safe = (id) => document.getElementById(id);
    function chooseScent(i) {
      scentIdx = i;
      const s = data[kind].scents[i];
      $$(".scent-choice").forEach((el, n) => {
        el.classList.toggle("active", n === i);
        el.setAttribute("aria-pressed", String(n === i));
      });
      safe("selected-scent-name").textContent = s[0];
      safe("selected-scent-description").textContent = s[2];
      safe("selected-scent-latin").textContent = s[5];
      safe("selected-scent-image").src = s[4];
      safe("selected-scent-image").alt = `${data[kind].plain} ${s[0]}の公式商品画像`;
    }
    function renderKind(next, updateURL) {
      kind = next;
      scentIdx = 0;
      const d = data[kind];
      safe("crumb-title").textContent = d.plain;
      safe("product-number").textContent = d.number;
      safe("gallery-count").textContent = d.gallery;
      safe("detail-title").innerHTML = d.title;
      safe("detail-lead").innerHTML = d.lead;
      safe("detail-type").textContent = d.type;
      safe("detail-size").textContent = d.size;
      safe("detail-scents").textContent = d.scentsLabel;
      safe("feature-heading").innerHTML = d.featureHeading;
      d.features.forEach((feature, i) => {
        safe(`feature${i + 1}-title`).textContent = feature[0];
        safe(`feature${i + 1}-desc`).textContent = feature[1];
      });
      safe("usage-note").textContent = d.usage;
      safe("detail-product-image").src = d.image;
      safe("detail-product-image").alt = d.imageAlt;
      safe("official-link").href = d.url;
      safe("purchase-link").href = d.url;
      safe("switch-product").textContent = d.other;
      safe("switch-product").href = "self-product.html?type=" + d.otherType;
      $(".detail-product-visual").classList.toggle(
        "spray-mode",
        kind === "spray",
      );
      $$(".kind-tab").forEach((b) => {
        const selected = b.dataset.kind === kind;
        b.classList.toggle("active", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
      d.steps.forEach((step, i) => {
        safe(`step${i + 1}-title`).textContent = step[0];
        safe(`step${i + 1}-desc`).textContent = step[1];
        safe(`step${i + 1}-image`).src = d.stepImage;
        safe(`step${i + 1}-image`).alt = d.stepAlts[i];
      });
      const container = safe("scent-options");
      container.replaceChildren();
      d.scents.forEach((s, i) => {
        const b = document.createElement("button");
        b.className = "scent-choice";
        b.type = "button";
        b.innerHTML = '<span class="scent-thumb"><img alt=""></span><b></b><small></small>';
        b.querySelector("img").src = s[4];
        b.querySelector("img").loading = "lazy";
        b.querySelector("img").decoding = "async";
        b.querySelector("b").textContent = s[0];
        b.querySelector("small").textContent = s[5];
        b.setAttribute("aria-label", `${s[0]}の香りを表示`);
        b.addEventListener("click", () => chooseScent(i));
        container.append(b);
      });
      chooseScent(0);
      if (updateURL) {
        const url = new URL(location.href);
        url.searchParams.set("type", kind);
        history.replaceState(null, "", url);
      }
    }
    $$(".kind-tab").forEach((b) =>
      b.addEventListener("click", () => renderKind(b.dataset.kind, true)),
    );
    const query = new URLSearchParams(location.search).get("type");
    renderKind(query === "spray" ? "spray" : "sticker", false);
  }
})();
