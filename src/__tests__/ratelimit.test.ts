import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to mock environment variables before importing the module
const originalEnv = process.env;

vi.mock("@/lib/env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: "https://mock.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "mock-token",
  },
}));

vi.mock("@upstash/redis", () => {
  return {
    Redis: class {
      constructor() {}
    },
  };
});

vi.mock("@upstash/ratelimit", () => {
  return {
    Ratelimit: class {
      static slidingWindow = vi.fn();
      limit = vi.fn().mockResolvedValue({
        success: true,
        limit: 5,
        remaining: 4,
        reset: 12345,
      });
      constructor() {}
    },
  };
});

import { ratelimit, shouldBypassRateLimit } from "@/lib/ratelimit";

describe("ratelimit", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("ratelimit initialization", () => {
    it("should initialize ratelimit when env vars are present", () => {
      expect(ratelimit).not.toBeNull();
    });
  });

  describe("shouldBypassRateLimit", () => {
    it("should return true when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";
      expect(shouldBypassRateLimit()).toBe(true);
    });

    it("should return false when NODE_ENV is not test", () => {
      process.env.NODE_ENV = "production";
      expect(shouldBypassRateLimit()).toBe(false);
    });
  });
});
