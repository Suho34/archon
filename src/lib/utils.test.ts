import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("combines class names", () => {
    expect(cn("font-medium", "text-sm")).toBe("font-medium text-sm");
  });
});
