import { loadTranslations, translate } from "@henskelis/lib/i18n";
import { elementUpdated, fixture, fixtureCleanup } from "@open-wc/testing";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { attachLocalizedController, localized } from "../../src/controllers/index.js";

describe.concurrent("[ui] controllers/localized", () => {
  const languageGetter = vi.spyOn(navigator, "language", "get");

  const changeBrowserLanguage = (language: string) => {
    languageGetter.mockReturnValue(language);
    dispatchEvent(new Event("languagechange"));
  };

  const translations = {
    en: {
      function: "Some text",
      decorator: "Another text",
    },
    fr: {
      function: "Exemple de texte",
      decorator: "Un autre texte",
    },
  };

  class FunctionLocalized extends LitElement {
    constructor() {
      super();
      attachLocalizedController(this);
    }

    protected override render(): unknown {
      return html`
        <p>
          ${translate("function")}
        </p>
      `;
    }
  }

  customElements.define("function-localized", FunctionLocalized);

  @customElement("decorator-localized")
  @localized()
  // @ts-ignore
  class DecoratorLocalized extends LitElement {
    protected override render(): unknown {
      return html`
        <p>
          ${translate("decorator")}
        </p>
      `;
    }
  }

  let functionLocalized: HTMLElement;
  let decoratorLocalized: HTMLElement;

  const getComponentText = (component: HTMLElement) =>
    component.shadowRoot?.querySelector("p")?.textContent;

  beforeAll(async () => {
    loadTranslations(translations);

    functionLocalized = await fixture(html`<function-localized></function-localized>`);
    decoratorLocalized = await fixture(html`<decorator-localized></decorator-localized>`);
  });

  it("should update the rendered translated text when the browser language changes", async () => {
    // Default locale is english in JSDOM
    expect(getComponentText(functionLocalized)).toContain("Some text");
    expect(getComponentText(decoratorLocalized)).toContain("Another text");

    // Switch to french
    changeBrowserLanguage("fr");
    expect(navigator.language).toEqual("fr");

    // Wait for the components to update
    await elementUpdated(functionLocalized);
    await elementUpdated(decoratorLocalized);

    // Translations should now be in french
    expect(getComponentText(functionLocalized)).toContain("Exemple de texte");
    expect(getComponentText(decoratorLocalized)).toContain("Un autre texte");

    // Switch to german (not supported)
    changeBrowserLanguage("de");
    expect(navigator.language).toEqual("de");

    // Wait for the components to update
    await elementUpdated(functionLocalized);
    await elementUpdated(decoratorLocalized);

    // Translations should still be in french (last supported locale that was used)
    expect(getComponentText(functionLocalized)).toContain("Exemple de texte");
    expect(getComponentText(decoratorLocalized)).toContain("Un autre texte");

    // Switch back to english
    changeBrowserLanguage("en");
    expect(navigator.language).toEqual("en");

    // Wait for the components to update
    await elementUpdated(functionLocalized);
    await elementUpdated(decoratorLocalized);

    // Translations should now be in english again
    expect(getComponentText(functionLocalized)).toContain("Some text");
    expect(getComponentText(decoratorLocalized)).toContain("Another text");

    fixtureCleanup();
  });
});
