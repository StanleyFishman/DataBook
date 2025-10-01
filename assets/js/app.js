import { DEFAULT_LANGUAGE, STORAGE_KEY, translations } from "./translations.js";
import { initRevealAnimations } from "./modules/reveal.js";
import { Translator } from "./modules/translator.js";

document.addEventListener("DOMContentLoaded", () => {
  const translator = new Translator({
    translations,
    defaultLanguage: DEFAULT_LANGUAGE,
    storageKey: STORAGE_KEY,
  });

  translator.init();
  initRevealAnimations();
});
