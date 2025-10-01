export class Translator {
  constructor({
    translations,
    defaultLanguage,
    storageKey,
    toggleSelector = ".language-toggle button",
    attribute = "data-i18n",
    root = document,
  }) {
    this.translations = translations;
    this.defaultLanguage = defaultLanguage;
    this.storageKey = storageKey;
    this.toggleSelector = toggleSelector;
    this.attribute = attribute;
    this.root = root;
    this.currentLanguage = defaultLanguage;
  }

  init() {
    this.toggleButtons = Array.from(this.root.querySelectorAll(this.toggleSelector));
    this.translatableNodes = Array.from(
      this.root.querySelectorAll(`[${this.attribute}]`)
    );

    this.bindToggleEvents();

    const savedLanguage = this.readPersistedLanguage();
    this.setLanguage(savedLanguage || this.defaultLanguage);
  }

  bindToggleEvents() {
    this.toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetLanguage = button.dataset.lang;
        if (targetLanguage && targetLanguage !== this.currentLanguage) {
          this.setLanguage(targetLanguage);
        }
      });
    });
  }

  setLanguage(language) {
    if (!this.translations[language]) {
      return;
    }

    this.currentLanguage = language;
    this.updateDocumentLanguage(language);
    this.updateToggleState(language);
    this.updateNodes(language);
    this.persistLanguage(language);
  }

  updateNodes(language) {
    const dictionary = this.translations[language];
    this.translatableNodes.forEach((node) => {
      const key = node.getAttribute(this.attribute);
      const value = this.resolve(dictionary, key);
      if (typeof value === "string") {
        node.textContent = value;
      }
    });
  }

  updateToggleState(language) {
    this.toggleButtons.forEach((button) => {
      const isActive = button.dataset.lang === language;
      button.classList.toggle("active", isActive);
    });
  }

  updateDocumentLanguage(language) {
    if (this.root.documentElement) {
      this.root.documentElement.lang = language;
    }
  }

  resolve(dictionary, path) {
    if (!path) {
      return undefined;
    }

    return path.split(".").reduce((accumulator, key) => {
      if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, key)) {
        return accumulator[key];
      }
      return undefined;
    }, dictionary);
  }

  persistLanguage(language) {
    if (!this.storageKey) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, language);
    } catch (error) {
      // Storage may be unavailable (e.g., private mode). Fallback silently.
    }
  }

  readPersistedLanguage() {
    if (!this.storageKey) {
      return undefined;
    }

    try {
      return window.localStorage.getItem(this.storageKey) || undefined;
    } catch (error) {
      return undefined;
    }
  }
}
