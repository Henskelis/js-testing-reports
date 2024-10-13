import { setLocale, store } from "@henskelis/lib/i18n";
import type { ReactiveController, ReactiveControllerHost, ReactiveElement } from "lit";

class LocalizedController implements ReactiveController {
  #host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
  }

  #languageChangedHandler = () => {
    store.locale = setLocale({ fallback: store.locale });
    this.#host.requestUpdate();
  };

  hostConnected() {
    addEventListener("languagechange", this.#languageChangedHandler);
  }

  hostDisconnected() {
    removeEventListener("languagechange", this.#languageChangedHandler);
  }
}

export const attachLocalizedController = (host: ReactiveControllerHost) => {
  host.addController(new LocalizedController(host));
};

export const localized = () => (target: typeof ReactiveElement) => {
  target.addInitializer(attachLocalizedController);
};
