// ============================================================
// BUILD.OS — script principal
// ============================================================
(function () {
  "use strict";

  const STORAGE_KEY = "buildos_checked_v1";

  const getChecked = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  };
  const setChecked = (obj) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch (e) { /* modo privado / sem storage — segue sem persistir */ }
  };

  let checkedState = getChecked();

  // ---------------- background circuit board ----------------
  function buildBoardBackground() {
    const svg = document.getElementById("boardBg");
    const w = 1600, h = 1200;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const ns = "http://www.w3.org/2000/svg";
    const paths = [];
    const rows = 9;
    for (let i = 0; i < rows; i++) {
      const y = (h / rows) * i + 40;
      const seg = 4 + Math.floor(Math.random() * 3);
      let d = `M 0 ${y}`;
      let x = 0;
      for (let s = 0; s < seg; s++) {
        x += w / seg;
        const jitter = (Math.random() - 0.5) * 60;
        d += ` L ${Math.min(x, w)} ${y + jitter}`;
      }
      paths.push(d);
    }
    paths.forEach((d, i) => {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", i % 3 === 0 ? "#c17a45" : "#25392f");
      path.setAttribute("stroke-width", i % 3 === 0 ? "1.4" : "1");
      path.setAttribute("fill", "none");
      path.setAttribute("opacity", i % 3 === 0 ? "0.35" : "0.5");
      svg.appendChild(path);

      // "solder pad" dots along accent traces
      if (i % 3 === 0) {
        for (let p = 0; p < 5; p++) {
          const dot = document.createElementNS(ns, "circle");
          dot.setAttribute("cx", (w / 5) * p + 60);
          dot.setAttribute("cy", (h / rows) * i + 40);
          dot.setAttribute("r", "3");
          dot.setAttribute("fill", "#e29a5f");
          dot.setAttribute("opacity", "0.5");
          svg.appendChild(dot);
        }
      }
    });
  }

  // ---------------- boot text typewriter ----------------
  function typewriter() {
    const el = document.getElementById("bootText");
    const full = "CARRETA DIGITAL PCGAMER.OS v1.0 — carregando checklist de hardware...";
    let i = 0;
    (function step() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(step, 18);
      }
    })();
  }

  // ---------------- LED status strip ----------------
  function renderLeds() {
    const strip = document.getElementById("ledStrip");
    strip.innerHTML = "";
    COMPONENTS.forEach((c) => {
      const led = document.createElement("button");
      led.className = "led";
      led.type = "button";
      led.setAttribute("data-on", String(!!checkedState[c.id]));
      led.setAttribute("aria-label", `${c.name} — ${checkedState[c.id] ? "revisado" : "pendente"}`);
      led.title = c.name;
      led.addEventListener("click", () => {
        document.getElementById(`card-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      strip.appendChild(led);
    });
    updateProgressLabel();
  }

  function updateProgressLabel() {
    const total = COMPONENTS.length;
    const done = COMPONENTS.filter((c) => checkedState[c.id]).length;
    document.getElementById("progressLabel").textContent = `${done}/${total} componentes revisados`;
  }

  function refreshLeds() {
    document.querySelectorAll("#ledStrip .led").forEach((led, idx) => {
      led.setAttribute("data-on", String(!!checkedState[COMPONENTS[idx].id]));
    });
    updateProgressLabel();
  }

  // ---------------- rail (mini nav) ----------------
  function renderRail() {
    const rail = document.getElementById("rail");
    rail.innerHTML = "";
    COMPONENTS.forEach((c) => {
      const pill = document.createElement("a");
      pill.className = "rail__pill";
      pill.href = `#card-${c.id}`;
      pill.textContent = `${c.number} ${c.name}`;
      pill.dataset.target = `card-${c.id}`;
      rail.appendChild(pill);
    });
  }

  function setupRailScrollSpy() {
    const pills = Array.from(document.querySelectorAll(".rail__pill"));
    if (!pills.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pill = pills.find((p) => p.dataset.target === entry.target.id);
          if (!pill) return;
          if (entry.isIntersecting) {
            pills.forEach((p) => p.classList.remove("is-active"));
            pill.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    document.querySelectorAll(".card").forEach((card) => observer.observe(card));
  }

  // ---------------- cards ----------------
  function specRow(spec) {
    return `
      <li class="spec-row">
        <span class="spec-row__pin"></span>
        <div>
          <div class="spec-row__label">${spec.group ? `<span class="spec-row__group">${spec.group}</span>` : ""}${spec.label}</div>
          <div class="spec-row__detail">${spec.detail}</div>
        </div>
      </li>`;
  }

  function renderSpecs(c) {
    if (c.id !== "cables") {
      return `<ul class="spec-list">${c.specs.map(specRow).join("")}</ul>`;
    }
    // agrupa cabos por categoria (Fonte / FANs / Externos)
    const groups = {};
    c.specs.forEach((s) => {
      groups[s.group] = groups[s.group] || [];
      groups[s.group].push(s);
    });
    return `<div class="spec-groups">${Object.entries(groups)
      .map(
        ([group, items]) => `
          <div>
            <div class="spec-group__title">${group}</div>
            <ul class="spec-list">${items.map((s) => specRow({ ...s, group: null })).join("")}</ul>
          </div>`
      )
      .join("")}</div>`;
  }

  function renderCards() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = COMPONENTS.map((c) => `
      <article class="card" id="card-${c.id}" data-accent="${c.accent}">
        <button class="card__header" data-toggle="${c.id}" aria-expanded="false">
          <span class="card__number">${c.number}</span>
          <span class="card__icon"><i class="fa-solid ${c.icon}"></i></span>
          <span class="card__titles">
            <span class="card__name">${c.name}</span>
            ${c.tagline ? `<span class="card__tagline">${c.tagline}</span>` : ""}
          </span>
          <span class="card__toggle-led" data-led="${c.id}" data-on="${!!checkedState[c.id]}" title="Revisado"></span>
          <i class="fa-solid fa-chevron-down card__chevron"></i>
        </button>
        <div class="card__body">
          <div class="card__body-inner">
            ${renderSpecs(c)}
            ${c.dica ? `
              <div class="card__dica">
                <i class="fa-solid fa-lightbulb"></i>
                <span>${c.dica}</span>
              </div>` : ""}
            <button class="card__toggle-btn" data-check="${c.id}" data-on="${!!checkedState[c.id]}">
              <i class="fa-solid fa-check"></i>
              <span>${checkedState[c.id] ? "Revisado" : "Marcar como revisado"}</span>
            </button>
          </div>
        </div>
      </article>
    `).join("");

    // accordion open/close
    container.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const body = card.querySelector(".card__body");
        const isOpen = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
        body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0px";
      });
    });

    // check / uncheck
    container.querySelectorAll("[data-check]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-check");
        checkedState[id] = !checkedState[id];
        setChecked(checkedState);
        btn.setAttribute("data-on", String(checkedState[id]));
        btn.querySelector("span").textContent = checkedState[id] ? "Revisado" : "Marcar como revisado";
        const led = container.querySelector(`[data-led="${id}"]`);
        if (led) led.setAttribute("data-on", String(checkedState[id]));
        refreshLeds();
      });
    });
  }

  // ---------------- mermaid ----------------
  function initMermaid() {
    if (typeof mermaid === "undefined") return;
    mermaid.initialize({
      startOnLoad: true,
      theme: "base",
      securityLevel: "loose",
      fontFamily: "Space Mono, monospace",
      themeVariables: {
        background: "#0f1815",
        primaryColor: "#182620",
        primaryTextColor: "#eef5f0",
        primaryBorderColor: "#c17a45",
        lineColor: "#c17a45",
        secondaryColor: "#20342a",
        tertiaryColor: "#241a17",
        fontSize: "14px"
      }
    });

    // após renderizar, torna os nós clicáveis (rolagem até o card correspondente)
    setTimeout(() => {
      const map = {
        "01": "cpu", "02": "ram", "03": "storage", "04": "gpu", "05": "motherboard",
        "06": "psu", "07": "cooling", "08": "monitor", "09": "keyboard", "10": "cables"
      };
      document.querySelectorAll("#mermaidDiagram .node, #mermaidDiagram g.node").forEach((node) => {
        const text = node.textContent || "";
        const match = text.match(/^(\d{2})/);
        if (!match) return;
        const targetId = map[match[1]];
        if (!targetId) return;
        node.style.cursor = "pointer";
        node.addEventListener("click", () => {
          document.getElementById(`card-${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          const card = document.getElementById(`card-${targetId}`);
          if (card && !card.classList.contains("is-open")) {
            card.querySelector("[data-toggle]").click();
          }
        });
      });
    }, 400);
  }

  // ---------------- init ----------------
  document.addEventListener("DOMContentLoaded", () => {
    buildBoardBackground();
    typewriter();
    renderRail();
    renderCards();
    renderLeds();
    setupRailScrollSpy();
    initMermaid();
  });
})();
