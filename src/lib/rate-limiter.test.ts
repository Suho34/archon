import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, resetRateLimits } from "./rate-limiter";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useRealTimers();
  });

  it("allows up to 10 requests within a 60s window by default", () => {
    const key = "test-user-1";

    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit(key);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9 - i);
    }

    // 11th request should be blocked
    const blockedResult = checkRateLimit(key);
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.resetInSeconds).toBeGreaterThan(0);
  });

  it("supports custom limits and windows", () => {
    const key = "custom-user";
    const limit = 3;
    const windowMs = 10000;

    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);

    const fourth = checkRateLimit(key, limit, windowMs);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("isolates rate limits by key", () => {
    const keyA = "user-A";
    const keyB = "user-B";

    for (let i = 0; i < 10; i++) {
      checkRateLimit(keyA);
    }

    expect(checkRateLimit(keyA).allowed).toBe(false);
    expect(checkRateLimit(keyB).allowed).toBe(true);
  });
});
