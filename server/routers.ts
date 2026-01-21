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
      }))
      .mutation(async ({ input }) => {
        try {
          // データベースに保存
          await createSeminarRegistration({
            companyName: input.company,
            name: input.name,
            email: input.email,
            phone: input.phone,
            message: `役職: ${input.position}\n課題: ${input.challenge || 'なし'}`,
          });

          // メール送信
          const emailText = `
新しいセミナー登録がありました。

会社名: ${input.company}
氏名: ${input.name}
役職: ${input.position}
メールアドレス: ${input.email}
電話番号: ${input.phone}
課題: ${input.challenge || 'なし'}
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
