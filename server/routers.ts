import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createSeminarRegistration } from "./seminar";
import { sendEmail } from "./sendgrid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  seminar: router({
    submitRegistration: publicProcedure
      .input(z.object({
        company: z.string().min(1),
        name: z.string().min(1),
        position: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        challenge: z.string().optional(),
        selectedSeminars: z.array(z.string()).min(1),
      }))
      .mutation(async ({ input }) => {
        try {
          // セミナー情報のマッピング
          const seminarInfo: Record<string, { title: string; date: string; time: string }> = {
            vol1: { title: "VOL.1: 「商談時間」を最大化する", date: "2026年2月3日(火)", time: "14:00～15:00" },
            vol2: { title: "VOL.2: 「売上」を最大化する", date: "2026年2月10日(火)", time: "14:00～15:00" },
            vol3: { title: "VOL.3: 「売る」以外は、AIに任せる", date: "2026年2月17日(火)", time: "14:00～15:00" },
            vol4: { title: "VOL.4: AIと働く、次世代の営業組織", date: "2026年2月24日(火)", time: "14:00～15:00" },
          };

          // データベースに保存
          await createSeminarRegistration({
            companyName: input.company,
            name: input.name,
            position: input.position,
            email: input.email,
            phone: input.phone,
            challenge: input.challenge || null,
            selectedSeminars: JSON.stringify(input.selectedSeminars),
          });

          // 選択されたセミナーの詳細を生成
          const selectedSeminarDetails = input.selectedSeminars
            .map(id => {
              const info = seminarInfo[id];
              return info ? `  - ${info.title}\n    ${info.date} ${info.time}` : '';
            })
            .filter(Boolean)
            .join('\n');

          // 管理者向けメール送信
          const adminEmailText = `新しいセミナー登録がありました。

会社名: ${input.company}
氏名: ${input.name}
役職: ${input.position}
メールアドレス: ${input.email}
電話番号: ${input.phone}
課題: ${input.challenge || 'なし'}

参加希望セミナー:
${selectedSeminarDetails}`;

          const adminEmailHtml = `
<html>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">新しいセミナー登録がありました</h2>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold; width: 150px;">会社名</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.company}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold;">氏名</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold;">役職</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.position}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold;">メールアドレス</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.email}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold;">電話番号</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.phone}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f0f9ff; font-weight: bold;">課題</td>
      <td style="padding: 10px; background-color: #ffffff;">${input.challenge || 'なし'}</td>
    </tr>
  </table>

  <h3 style="color: #0891b2; margin-top: 30px;">参加希望セミナー</h3>
  <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0891b2; white-space: pre-line;">${selectedSeminarDetails}</div>
</body>
</html>`;

          await sendEmail({
            to: 'info@anyenv-inc.com',
            subject: '【Geminiセミナー】新規登録通知',
            text: adminEmailText,
            html: adminEmailHtml,
          });

          // 申込者向け自動返信メール
          const userEmailText = `${input.name} 様

この度は、anyenv株式会社主催「製造業DXウェビナー 営業改革シリーズ」にお申し込みいただき、認にありがとうございます。

以下の内容で登録を受け付けました。

【登録情報】
会社名: ${input.company}
お名前: ${input.name}
役職: ${input.position}
メールアドレス: ${input.email}
電話番号: ${input.phone}

【参加希望セミナー】
${selectedSeminarDetails}

セミナーの参加URL（Google Meetリンク）は、各セミナー開催日の前日までに、別途メールにてご連絡させていただきます。

何かご不明な点がございましたら、お気軽にお問い合わせください。

──────────────────────────────
anyenv株式会社
メール: info@anyenv-inc.com
Web: https://anyenv-inc.com
──────────────────────────────`;

          const userEmailHtml = `
<html>
<body style="font-family: sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">登録完了のお知らせ</h1>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff;">
    <p style="font-size: 16px;">${input.name} 様</p>
    
    <p>この度は、anyenv株式会社主催<br>
    <strong>「製造業DXウェビナー 営業改革シリーズ」</strong><br>
    にお申し込みいただき、認にありがとうございます。</p>
    
    <p>以下の内容で登録を受け付けました。</p>
    
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #0891b2; margin-top: 0;">登録情報</h3>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #666;">会社名:</td>
          <td style="padding: 8px 0; font-weight: bold;">${input.company}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">お名前:</td>
          <td style="padding: 8px 0; font-weight: bold;">${input.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">役職:</td>
          <td style="padding: 8px 0; font-weight: bold;">${input.position}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">メールアドレス:</td>
          <td style="padding: 8px 0; font-weight: bold;">${input.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">電話番号:</td>
          <td style="padding: 8px 0; font-weight: bold;">${input.phone}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #ecfeff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2;">
      <h3 style="color: #0891b2; margin-top: 0;">参加希望セミナー</h3>
      <div style="white-space: pre-line; line-height: 1.8;">${selectedSeminarDetails}</div>
    </div>
    
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ 重要なお知らせ</p>
      <p style="margin: 10px 0 0 0; color: #92400e;">セミナーの参加URL（Google Meetリンク）は、各セミナー開催日の<strong>前日までに、別途メールにてご連絡</strong>させていただきます。</p>
    </div>
    
    <p>何かご不明な点がございましたら、お気軽にお問い合わせください。</p>
  </div>
  
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
    <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>anyenv株式会社</strong></p>
    <p style="margin: 5px 0; color: #64748b; font-size: 14px;">メール: info@anyenv-inc.com</p>
    <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Web: https://anyenv-inc.com</p>
  </div>
</body>
</html>`;

          await sendEmail({
            to: input.email,
            subject: '【登録完了】Gemini活用セミナー 営業改革シリーズ',
            text: userEmailText,
            html: userEmailHtml,
          });

          console.log("Registration received:", input);
          return { success: true, message: "Registration completed" };
        } catch (error) {
          console.error("Registration error:", error);
          return { success: false, message: "Registration failed" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
