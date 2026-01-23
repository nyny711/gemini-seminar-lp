import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("seminar.submitRegistration", () => {
  it("accepts valid registration data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.seminar.submitRegistration({
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "yamada@example.com",
      phone: "090-1234-5678",
      challenge: "提案準備に時間がかかる",
      selectedSeminars: ["vol1", "vol2"],
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  }, 10000);

  it("rejects empty company name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.seminar.submitRegistration({
        company: "",
        name: "山田太郎",
        position: "営業部長",
        email: "yamada@example.com",
        phone: "090-1234-5678",
        selectedSeminars: ["vol1"],
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("too_small");
    }
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.seminar.submitRegistration({
        company: "テスト株式会社",
        name: "山田太郎",
        position: "営業部長",
        email: "invalid-email",
        phone: "090-1234-5678",
        selectedSeminars: ["vol1"],
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("invalid_format");
    }
  });

  it("accepts optional challenge field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.seminar.submitRegistration({
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "yamada@example.com",
      phone: "090-1234-5678",
      selectedSeminars: ["vol1"],
    });

    expect(result.success).toBe(true);
  });
});
