const DEFAULT_SELECTORS = [
  ".hero-copy > *",
  ".hero-media",
  ".clients-strip .logo-tile",
  ".metrics-grid .metric-card",
  ".steps .step-card",
  ".stories-grid .story-card",
  ".wall-grid .wall-card",
  ".cta-section",
];

const STAGGER_STEP = 120;

function prepareTargets(selectors) {
  const nodes = selectors
    .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
    .filter((node, index, array) => array.indexOf(node) === index);

  nodes.sort((a, b) => {
    if (a === b) {
      return 0;
    }
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }
    return 0;
  });

  return nodes;
}

function applyRevealClass(targets) {
  targets.forEach((element) => {
    if (!element.classList.contains("reveal-up")) {
      element.classList.add("reveal-up");
    }
  });
}

function applyStagger(targets) {
  const groups = new Map();
  targets.forEach((element) => {
    const parent = element.parentElement;
    if (!parent) {
      return;
    }
    if (!groups.has(parent)) {
      groups.set(parent, []);
    }
    groups.get(parent).push(element);
  });

  groups.forEach((group) => {
    group.forEach((element, index) => {
      const delay = index * STAGGER_STEP;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  });
}

function observeTargets(targets) {
  if (!("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  targets.forEach((element) => observer.observe(element));
}

export function initRevealAnimations({ selectors = DEFAULT_SELECTORS } = {}) {
  const targets = prepareTargets(selectors);
  if (!targets.length) {
    return;
  }

  applyRevealClass(targets);
  applyStagger(targets);
  observeTargets(targets);
}
