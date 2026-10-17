import { describe, expect, it } from "vitest";

import { googleMapLinks } from "./routeMap";

describe("googleMapLinks", () => {
  it("centres a keyless map on the place when there is no My Maps id", () => {
    const links = googleMapLinks({ place: "Kyanjin Gompa, Langtang, Nepal" });
    expect(links.hasTrailLine).toBe(false);
    expect(links.embedUrl).toBe("https://maps.google.com/maps?q=Kyanjin+Gompa%2C+Langtang%2C+Nepal&z=11&output=embed");
    expect(links.openUrl).toBe("https://www.google.com/maps/search/?api=1&query=Kyanjin+Gompa%2C+Langtang%2C+Nepal");
  });

  it("embeds the My Maps map, with its trail line, when an id is set", () => {
    const links = googleMapLinks({ place: "Kyanjin Gompa", myMapsId: "1AbC-dEf_GhIjKlMn" });
    expect(links.hasTrailLine).toBe(true);
    expect(links.embedUrl).toBe("https://www.google.com/maps/d/embed?mid=1AbC-dEf_GhIjKlMn");
    expect(links.openUrl).toBe("https://www.google.com/maps/d/viewer?mid=1AbC-dEf_GhIjKlMn");
  });

  it("rejects an id that is not a plain My Maps id", () => {
    expect(() => googleMapLinks({ place: "x", myMapsId: "abc&evil=1#" })).toThrow("Invalid Google My Maps id");
    expect(() => googleMapLinks({ place: "x", myMapsId: "short" })).toThrow();
  });
});
