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

          // メール送信
          const emailText = `
新しいセミナー登録がありました。

会社名: ${input.company}
氏名: ${input.name}
役職: ${input.position}
メールアドレス: ${input.email}
電話番号: ${input.phone}
課題: ${input.challenge || 'なし'}

参加希望セミナー:
${selectedSeminarDetails}
          `.trim();

          await sendEmail({
            to: 'info@anyenv-inc.com',
            subject: '【Geminiセミナー】新規登録通知',
            text: emailText,
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
