import { describe, expect, it } from "vitest";
import {
  addParamsToUrl,
  getFormIdFromUrl,
  getFormSlugFromUrl,
  getHostPathFromUrl,
  getPrefixedParamsFromUrl,
} from "../../src/utils";

describe.concurrent("[lib] utils/url", () => {
  const formIdUrl = "https://www.website.com/player/fid/5b759aaa441eec5fb400002d?&f=3&gid=123";
  const formSlugUrl = "https://www.website.com/fpl/some-form-slug?&f=3&gid=123";

  it("should add params to the url", () => {
    const url = "https://www.website.com/some-page?f=3&gid=123";

    const params = {
      gid: "132",
      utm_source: "google",
      utm_campaign: "newsletter",
    };

    expect(addParamsToUrl(url, params)).toEqual(
      "https://www.website.com/some-page?f=3&gid=132&utm_source=google&utm_campaign=newsletter",
    );

    expect(addParamsToUrl(url, params, { override: false })).toEqual(
      "https://www.website.com/some-page?gid=123&utm_source=google&utm_campaign=newsletter&f=3",
    );
  });

  it("should extract the form id from the url", () => {
    expect(getFormIdFromUrl(formIdUrl)).toEqual("5b759aaa441eec5fb400002d");
    expect(getFormIdFromUrl(formSlugUrl)).toBeUndefined();
  });

  it("should extract the form slug from the url", () => {
    expect(getFormSlugFromUrl(formSlugUrl)).toEqual("some-form-slug");
    expect(getFormSlugFromUrl(formIdUrl)).toBeUndefined();
  });

  it("should extract the host and the path from the url", () => {
    expect(getHostPathFromUrl("https://www.website.com/some-path/some-page?f=3&gid=123")).toEqual(
      "www.website.com/some-path/some-page",
    );

    expect(getHostPathFromUrl("https://www.website.com")).toEqual("www.website.com");
    expect(getHostPathFromUrl("https://www.website.com?f=3&gid=123")).toEqual("www.website.com");
    expect(getHostPathFromUrl("https://www.website.com/")).toEqual("www.website.com");
    expect(getHostPathFromUrl("https://www.website.com/?f=3&gid=123")).toEqual("www.website.com");
  });

  it("should get the prefixed params from the url", () => {
    const url =
      "https://www.website.com/some-page?hc_track=1&f=4&utm_source=google&utm_campaign=newsletter";

    expect(getPrefixedParamsFromUrl(url, "gid_")).toEqual({});

    expect(getPrefixedParamsFromUrl(url, "hc_", "utm_")).toEqual({
      hc_track: "1",
      utm_source: "google",
      utm_campaign: "newsletter",
    });
  });
});
