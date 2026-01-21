import { describe, expect, it } from "vitest";
import { sendEmail } from "./sendgrid";

describe("SendGrid Email Sending", () => {
  it("should send email successfully with valid API key", async () => {
    // テスト用のメール送信
    // 実際のメールは送信されますが、テスト環境では受信先を確認してください
    const result = await sendEmail({
      to: "info@anyenv-inc.com",
      subject: "SendGrid Test Email",
      text: "This is a test email from the gemini-seminar-lp application.",
      html: "<p>This is a <strong>test email</strong> from the gemini-seminar-lp application.</p>",
    });

    // メール送信が成功したかを確認
    expect(result).toBe(true);
  }, 30000); // タイムアウトを30秒に設定
});
