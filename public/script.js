/* =====================================================================
   Bulk Maroc — page produit (bon de commande « ticket »)
   Config : config.js · Textes FR/AR : i18n.js
   ===================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reduceMotion ? "auto" : "smooth";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const FLAVOR_KEYS = { vanilla: "flVanilla", mixedBerry: "flBerry", unflavored: "flPlain" };
  const SLIDE_INDEX = { vanilla: 0, mixedBerry: 1, unflavored: 2 };
  const hasFee = DELIVERY_FEE > 0;

  /* ---------- Langue ---------- */
  const store = {
    get() { try { return localStorage.getItem("bulk-lang"); } catch (_) { return null; } },
    set(v) { try { localStorage.setItem("bulk-lang", v); } catch (_) { /* stockage indisponible */ } }
  };
  let lang = I18N[store.get()] ? store.get() : DEFAULT_LANG;

  // Nombres entiers sans décimales (399), sinon 2 décimales (374,50)
  const fmtInt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const fmtDec = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt = { format: (n) => (Number.isInteger(n) ? fmtInt : fmtDec).format(n) };
  const t = (key, vars = {}) => {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.fr[key] || "";
    Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
    return s;
  };
  const money = (n) => `${fmt.format(n)} ${t("currency")}`;
  const feeText = () => (hasFee ? money(DELIVERY_FEE) : t("toConfirm"));
  const unitsText = (pack) => t(pack === "double" ? "unit2" : "unit1");

  /* ---------- Éléments ---------- */
  const form = $("#order-form");
  const orderArea = $("#order-area");
  const success = $("#success");
  const submitBtn = $("#submit-btn");
  const submitLabel = $(".btn-label", submitBtn);
  const sticky = $("#sticky-cta");
  const status = $("#form-status");
  const slides = $("#slides");

  const getChecked = (name) => { const el = $(`input[name="${name}"]:checked`, form); return el ? el.value : ""; };

  /* Mix : nombre de sachets par goût */
  const mix = { unflavored: 0, vanilla: 0, mixedBerry: 0 };
  const mixTotal = (m = mix) => Object.values(m).reduce((a, b) => a + b, 0);
  const subtotalFor = (pack, m = mix) => (pack === "mix" ? priceForQuantity(mixTotal(m)) : PRODUCTS[pack].price);
  const compareFor = (pack, m = mix) => (pack === "mix" ? compareForQuantity(mixTotal(m)) : PRODUCTS[pack].compareAt);
  const totalFor = (pack, m = mix) => subtotalFor(pack, m) + (hasFee ? DELIVERY_FEE : 0);
  // "Vanille ×3 + Unflavoured ×2"
  const mixText = (m = mix) => Object.keys(m).filter((k) => m[k] > 0)
    .map((k) => `${t(FLAVOR_KEYS[k])} ×${m[k]}`).join(" + ") || t("tkNoFlavor");

  /* ---------- Textes ---------- */
  function applyLang() {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    const vars = { fee: feeText() };
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n, vars); });
    // Contenus riches (sections d'information) : textes internes de i18n.js uniquement
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml, vars); });
    $$("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    $("#lang-btn").lang = lang === "ar" ? "fr" : "ar";
    $$("[data-price]").forEach((el) => { el.textContent = money(PRODUCTS[el.dataset.price].price); });
    const unit = PRODUCTS.double.price / 2;
    const save = PRODUCTS.single.price * 2 - PRODUCTS.double.price;
    $("#per-unit").textContent = t("perUnit", { unit: money(unit), save: money(save) });
    $$(".mix-row").forEach((row) => {
      const flavor = t(FLAVOR_KEYS[row.dataset.flavor]);
      $('[data-step="-1"]', row).setAttribute("aria-label", t("mixLess", { flavor }));
      $('[data-step="1"]', row).setAttribute("aria-label", t("mixMore", { flavor }));
    });
    $$("[data-error-for]").forEach((el) => { if (el.dataset.msg) el.textContent = t(el.dataset.msg); });
    if (status.dataset.msg) status.textContent = t(status.dataset.msg);
    if (submitBtn.classList.contains("is-loading")) submitLabel.textContent = t("loading");
    update();
  }

  /* Libellé de la ligne du ticket : 1 sachet, ou 2 sachets avec 1 ou 2 goûts */
  const flavorName = (k) => (k ? t(FLAVOR_KEYS[k]) : t("tkNoFlavor"));
  function itemText(pack, f1, f2, m = mix) {
    if (pack === "mix") return mixText(m);
    if (pack !== "double") return t("tkItem", { flavor: flavorName(f1), units: unitsText("single") });
    if (f1 && f2 && f1 === f2) return t("tkItem", { flavor: flavorName(f1), units: unitsText("double") });
    return t("tkItem2", { f1: flavorName(f1), f2: flavorName(f2) });
  }

  /* ---------- Ticket : lignes, total, couleur du bouton ---------- */
  let lastFlavor = "";
  function update() {
    const pack = getChecked("pack") || "single";
    const isDouble = pack === "double";
    const isMix = pack === "mix";
    const f1 = isMix ? "" : getChecked("flavor");
    const f2 = isDouble ? getChecked("flavor2") : "";

    // Format 1 kg : un goût par sachet
    $("#slot2").hidden = !isDouble;
    $("#slot1-label").hidden = !isDouble;
    $("#flavor-legend").textContent = t(isDouble ? "tkFlavors" : "tkFlavor");

    // Format Mix : compteurs par goût à la place du choix de goût
    $("#flavor-sec").hidden = isMix;
    $("#mix-sec").hidden = !isMix;
    $("#per-unit").textContent = isMix
      ? t("mixPerPair", { pair: money(PRODUCTS.double.price) })
      : t("perUnit", { unit: money(PRODUCTS.double.price / 2), save: money(PRODUCTS.single.price * 2 - PRODUCTS.double.price) });
    const n = mixTotal();
    $$(".mix-row").forEach((row) => {
      const k = row.dataset.flavor;
      $(".step-val", row).textContent = String(mix[k]);
      $('[data-step="-1"]', row).disabled = mix[k] === 0;
      $('[data-step="1"]', row).disabled = n >= MAX_QUANTITY;
      row.classList.toggle("is-on", mix[k] > 0);
    });
    const kg = String(n * 0.5).replace(".", ",");
    $("#mix-sum").textContent = n === 0 ? t("mixEmpty")
      : (n === 1 ? t("mixSum1", { price: money(subtotalFor("mix")) }) : t("mixSum", { n, kg, price: money(subtotalFor("mix")) }))
        + (n >= MAX_QUANTITY ? ` — ${t("mixMax", { max: MAX_QUANTITY })}` : "");

    const sub = isMix && n === 0 ? 0 : subtotalFor(pack);
    const cmp = isMix && n === 0 ? 0 : compareFor(pack);
    const total = sub + (hasFee ? DELIVERY_FEE : 0);
    $("#hero-price").textContent = money(isMix && n === 0 ? PRODUCTS.single.price : sub);
    $("#hero-compare").textContent = isMix && n === 0 ? money(PRODUCTS.single.compareAt) : (cmp ? money(cmp) : "");
    $("#tk-item").textContent = itemText(pack, f1, f2);
    $("#tk-sub").textContent = money(sub);
    $("#tk-fee").textContent = feeText();
    $("#tk-total").textContent = money(total);
    $("#sticky-price").textContent = money(total);

    // Noir au départ, puis couleur du dernier goût choisi
    if (isMix) { if (lastFlavor && !mix[lastFlavor]) lastFlavor = Object.keys(mix).filter((k) => mix[k]).pop() || ""; }
    else if (lastFlavor && lastFlavor !== f1 && lastFlavor !== f2) lastFlavor = f2 || f1;
    const color = lastFlavor || f1;
    [submitBtn, sticky].forEach((b) => {
      if (color) b.dataset.flavor = color; else delete b.dataset.flavor;
    });
  }

  form.addEventListener("change", (e) => {
    const name = e.target.name;
    if (name !== "flavor" && name !== "flavor2" && name !== "pack") return;
    showError(name, "");
    if (name === "pack") { showError("flavor2", ""); showError("mix", ""); showError("flavor", ""); lastFlavor = ""; }
    if (name === "flavor" || name === "flavor2") {
      lastFlavor = e.target.value;
      goSlide(SLIDE_INDEX[e.target.value]);
    }
    update();
  });

  // Compteurs du mix (− / +)
  $("#mix").addEventListener("click", (e) => {
    const btn = e.target.closest(".step-btn");
    if (!btn || btn.disabled) return;
    const k = btn.closest(".mix-row").dataset.flavor;
    const step = Number(btn.dataset.step);
    if (step > 0 && mixTotal() >= MAX_QUANTITY) return;
    mix[k] = Math.max(0, mix[k] + step);
    if (step > 0) { lastFlavor = k; goSlide(SLIDE_INDEX[k]); }
    showError("mix", "");
    update();
  });

  /* ---------- Galerie ---------- */
  const slideEls = $$(".slide", slides);
  const dots = $$(".dot");
  let currentSlide = 0;
  function goSlide(i) {
    i = (i + slideEls.length) % slideEls.length;
    slides.scrollTo({ left: slideEls[i].offsetLeft - slides.offsetLeft, behavior: scrollBehavior });
  }
  function markSlide(i) {
    currentSlide = i;
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
  }
  slides.addEventListener("scroll", () => {
    const i = Math.round(slides.scrollLeft / slides.clientWidth);
    if (i !== currentSlide) markSlide(Math.max(0, Math.min(slideEls.length - 1, i)));
  }, { passive: true });
  dots.forEach((d) => d.addEventListener("click", () => goSlide(Number(d.dataset.go))));
  $$(".arrow").forEach((a) => a.addEventListener("click", () => goSlide(currentSlide + Number(a.dataset.step))));
  slides.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") goSlide(currentSlide - 1);
  });
  markSlide(0);

  /* ---------- Validation ---------- */
  const PHONE_RE = /^(?:\+212|00212|0)[5-7]\d{8}$/;
  const cleanPhone = (v) => v.replace(/[\s.\-()]/g, "");
  const validators = {
    flavor: () => (getChecked("pack") === "mix" || getChecked("flavor") ? "" : "errFlavor"),
    mix: () => (getChecked("pack") !== "mix" || mixTotal() > 0 ? "" : "errMix"),
    flavor2: () => (getChecked("pack") !== "double" || getChecked("flavor2") ? "" : "errFlavor2"),
    pack: () => (getChecked("pack") ? "" : "errPack"),
    fullName: () => (form.full_name.value.trim().length >= 2 ? "" : "errName"),
    phone: () => {
      const v = cleanPhone(form.phone.value.trim());
      if (!v) return "errPhone";
      return PHONE_RE.test(v) ? "" : "errPhoneInvalid";
    },
    address: () => (form.address.value.trim().length >= 5 ? "" : "errAddress")
  };
  const fieldFor = {
    flavor: () => $("#flavors"),
    flavor2: () => $("#flavors2"),
    mix: () => $("#mix"),
    pack: () => $("#packs"),
    fullName: () => form.full_name,
    phone: () => form.phone,
    address: () => form.address
  };
  const CHOICES = ["flavor", "flavor2", "pack", "mix"];
  const ORDER = ["pack", "flavor", "flavor2", "mix", "fullName", "phone", "address"];

  function showError(name, msgKey) {
    const err = $(`[data-error-for="${name}"]`, form);
    if (err) { err.dataset.msg = msgKey || ""; err.textContent = msgKey ? t(msgKey) : ""; }
    const el = fieldFor[name] && fieldFor[name]();
    if (!el) return;
    if (CHOICES.includes(name)) el.classList.toggle("has-error", Boolean(msgKey));
    else { el.classList.toggle("is-invalid", Boolean(msgKey)); el.setAttribute("aria-invalid", msgKey ? "true" : "false"); }
  }
  const validate = (name) => { const m = validators[name](); showError(name, m); return !m; };

  let tried = false;
  [["full_name", "fullName"], ["phone", "phone"], ["address", "address"]].forEach(([field, key]) => {
    form[field].addEventListener("input", () => { if (tried) validate(key); });
    form[field].addEventListener("blur", () => { if (tried || form[field].value.trim()) validate(key); });
  });

  function focusField(name) {
    const choice = CHOICES.includes(name);
    const target = name === "mix" ? $('.step-btn[data-step="1"]', form)
      : choice ? $(`input[name="${name}"]`, form) : fieldFor[name]();
    (choice ? fieldFor[name]() : target).scrollIntoView({ behavior: scrollBehavior, block: "center" });
    target.focus({ preventScroll: true });
  }

  function setStatus(msgKey) {
    status.dataset.msg = msgKey || "";
    status.textContent = msgKey ? t(msgKey) : "";
    status.hidden = !msgKey;
  }

  /* ---------- Envoi ---------- */
  let sending = false;
  function setLoading(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.classList.toggle("is-loading", on);
    submitBtn.setAttribute("aria-busy", String(on));
    submitLabel.textContent = on ? t("loading") : t("orderBtn");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return; // pas de double envoi
    tried = true;
    setStatus("");
    const invalid = ORDER.filter((n) => !validate(n));
    if (invalid.length) return focusField(invalid[0]);

    // Le serveur recalcule le prix
    const payload = {
      fullName: form.full_name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      pack: getChecked("pack")
    };
    if (payload.pack === "mix") payload.mix = { ...mix };
    else payload.flavor = getChecked("flavor");
    if (payload.pack === "double") payload.flavor2 = getChecked("flavor2");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) return onSuccess(data, payload);

      if (res.status === 429) return setStatus("errTooMany");
      if (data && data.errors) {
        Object.keys(data.errors).forEach((k) => {
          if (validators[k]) showError(k, validators[k]() || (k === "phone" ? "errPhoneInvalid" : "errGeneric"));
        });
        const first = ORDER.find((k) => data.errors[k]);
        if (first) focusField(first);
      }
      setStatus("errGeneric");
    } catch (_) {
      setStatus("errNetwork");
    } finally {
      setLoading(false);
    }
  });

  function onSuccess(data, payload) {
    $("#ok-id").textContent = data.orderId ? `#${data.orderId}` : "—";
    $("#ok-item").textContent = itemText(payload.pack, payload.flavor, payload.flavor2, payload.mix);
    $("#ok-sub").textContent = money(subtotalFor(payload.pack, payload.mix));
    $("#ok-fee").textContent = feeText();
    $("#ok-total").textContent = money(data.total);
    orderArea.hidden = true;
    success.hidden = false;
    $("#commander").scrollIntoView({ behavior: scrollBehavior, block: "start" });
    success.focus({ preventScroll: true });
  }

  $("#new-order").addEventListener("click", () => {
    // Le formulaire n'est vidé qu'après une commande réussie
    form.reset();
    Object.keys(mix).forEach((k) => { mix[k] = 0; });
    lastFlavor = "";
    tried = false;
    ORDER.forEach((n) => showError(n, ""));
    setStatus("");
    success.hidden = true;
    orderArea.hidden = false;
    update();
    form.full_name.focus();
  });

  /* ---------- Bouton fixe : visible quand le bon de commande n'est pas à l'écran ---------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      const show = !entry.isIntersecting;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", String(!show));
      sticky.tabIndex = show ? 0 : -1;
    }, { threshold: 0 }).observe($("#commander"));
  }

  /* ---------- Accordéons ---------- */
  $$("button.acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  /* ---------- Langue ---------- */
  $("#lang-btn").addEventListener("click", () => {
    lang = lang === "fr" ? "ar" : "fr";
    store.set(lang);
    applyLang();
  });

  /* ---------- Partage ---------- */
  const toast = $("#toast");
  $("#share-btn").addEventListener("click", async () => {
    try {
      if (navigator.share) return await navigator.share({ title: document.title, url: location.href });
      await navigator.clipboard.writeText(location.href);
      toast.textContent = t("copied");
      toast.hidden = false;
      setTimeout(() => (toast.hidden = true), 1800);
    } catch (_) { /* partage annulé */ }
  });

  applyLang();
})();
