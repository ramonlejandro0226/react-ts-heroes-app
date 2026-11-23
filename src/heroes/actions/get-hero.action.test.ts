import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";

describe("get-hero.action", () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  test("should fetch hero data and return with complete  imagen URL", async () => {
    const hero = await getHeroAction("1");

    expect(hero.image).toBe(`${BASE_URL}/images/${hero.id}.jpeg`);
  });

  test("should throw an error if hero is not found  ", async () => {
    await getHeroAction("16363").catch((error) => {
      expect(error).toBeDefined();
      expect(error.message).toBe("Request failed with status code 404");
    });
  });
});
