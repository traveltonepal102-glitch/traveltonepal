import { describe, expect, it } from "vitest";

import { buildContactMessage, checkContactForm, contactEmailSubject } from "./contactMessage";

const filled = { name: "Anna Weber", email: "anna@example.com", phone: "+49 170 1234567", country: "Germany", trek: "Manaslu Circuit Trek", startDate: "2027-04-12", group: "2 people", message: "Is it OK for a first trek?" };

describe("the contact form", () => {
  it("accepts a filled-in form and trims it", () => {
    expect(checkContactForm({ ...filled, name: "  Anna Weber  " }).values?.name).toBe("Anna Weber");
  });

  it("only needs a name, an email and a message", () => {
    expect(checkContactForm({ ...filled, phone: "", country: "", trek: "", startDate: "", group: "" }).errors).toBeUndefined();
  });

  it("says what is wrong with each field", () => {
    const { errors } = checkContactForm({ ...filled, name: "", email: "not-an-email", message: "Hi" });
    expect(errors?.name).toBe("Bitte geben Sie Ihren Namen ein.");
    expect(errors?.email).toContain("gültige E-Mail-Adresse");
    expect(errors?.message).toContain("mindestens 10");
    expect(errors?.phone).toBeUndefined();
  });

  it("refuses a phone number with letters and a message that is too long", () => {
    expect(checkContactForm({ ...filled, phone: "call me" }).errors?.phone).toBeTruthy();
    expect(checkContactForm({ ...filled, message: "a".repeat(1001) }).errors?.message).toBeTruthy();
  });
});

describe("the message", () => {
  it("has everything filled in, in words", () => {
    expect(buildContactMessage(filled)).toBe(
      "Hallo! Ich habe eine Frage zu einem Trek.\n\nName: Anna Weber\nE-Mail: anna@example.com\nTelefon: +49 170 1234567\nLand: Germany\nTrek: Manaslu Circuit Trek\nGewünschtes Startdatum: 12. Apr. 2027\nGruppe: 2 people\n\nIs it OK for a first trek?",
    );
  });

  it("leaves out what is blank", () => {
    const message = buildContactMessage({ ...filled, phone: "", country: "", trek: "", startDate: "", group: "" });
    expect(message).not.toContain("Telefon:");
    expect(message).not.toContain("Gewünschtes Startdatum:");
    expect(message).toContain("E-Mail: anna@example.com");
  });

  it("names the person and the trek in the email's subject", () => {
    expect(contactEmailSubject(filled)).toBe("Trek-Anfrage von Anna Weber: Manaslu Circuit Trek");
    expect(contactEmailSubject({ name: "Anna", trek: "" })).toBe("Trek-Anfrage von Anna");
  });
});
