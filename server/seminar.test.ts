import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// SendGridとデータベースをモック
vi.mock("./sendgrid", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock("./seminar", () => ({
  createSeminarRegistration: vi.fn().mockResolvedValue({ insertId: 1 }),
}));

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("seminar.submitRegistration", () => {
  it("should successfully register a seminar participant", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "test@example.com",
      phone: "03-1234-5678",
      challenge: "営業プロセスの効率化",
      selectedSeminars: ["vol1", "vol2"],
    };

    const result = await caller.seminar.submitRegistration(input);

    expect(result).toEqual({
      success: true,
      message: "Registration completed",
    });
  });

  it("should handle registration with minimal required fields", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      company: "テスト株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "test@example.com",
      phone: "03-1234-5678",
      selectedSeminars: ["vol1"],
    };

    const result = await caller.seminar.submitRegistration(input);

    expect(result).toEqual({
      success: true,
      message: "Registration completed",
    });
  });
});
