import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, BarChart3, Search, FileText, MessageSquare, BrainCircuit, Users, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [formData, setFormData] = useState({
    company: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    challenge: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRegistration = trpc.seminar.submitRegistration.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.company.trim()) errors.company = "会社名は必須です";
    if (!formData.name.trim()) errors.name = "名前は必須です";
    if (!formData.position.trim()) errors.position = "役職は必須です";
    if (!formData.email.trim()) errors.email = "メールアドレスは必須です";
    if (!formData.email.includes("@")) errors.email = "有効なメールアドレスを入力してください";
    if (!formData.phone.trim()) errors.phone = "電話番号は必須です";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitRegistration.mutateAsync({
        company: formData.company,
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        challenge: formData.challenge,
      });

      if (result.success) {
        toast.success("申し込みが完了しました。確認メールをご確認ください。");
        setFormData({
          company: "",
          name: "",
          position: "",
          email: "",
          phone: "",
          challenge: "",
        });
      } else {
        toast.error("申し込み処理中にエラーが発生しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("申し込み処理中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Manufacturing Control Room" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          
          {/* Animated Tech Lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-3/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-cyan-500/50" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-cyan-500/50" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 px-4 py-1 text-sm font-mono tracking-wider bg-cyan-950/30 backdrop-blur-sm">
                anyenv株式会社主催ウェビナー
              </Badge>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mb-4">
              <p className="text-cyan-400 text-sm font-medium">製造業DXウェビナー 営業改革シリーズ VOL.1</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mb-8 flex items-center justify-start gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-transparent to-cyan-400" />
              <span className="text-cyan-400 font-bold text-3xl">参加無料</span>
              <div className="h-1 w-8 bg-gradient-to-l from-transparent to-cyan-400" />
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              「商談時間」を<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">最大化する</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-300 mb-8 font-light leading-relaxed border-l-4 border-cyan-500 pl-6">
              ～非コア業務をAIで自動化し、顧客に向き合う～<br />
              日報・見積・技術照会...その事務作業、AIなら一瞬です。<br />
              営業マンを<span className="text-white font-medium">「本来の仕事」</span>に集中させる具体的メソッドを解説！
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 items-start">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-6 text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-105" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
                無料で参加する <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-300 text-base px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-700">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <span className="font-medium">2026年2月1日(木) 14:00～15:00</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-700">
                  <span>オンライン開催（途中参加&退出OK）</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">こんなお悩みありませんか？</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto" />
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { icon: MessageSquare, title: "技術的な問い合わせに即答できない", desc: "打合せの準備や、顧客とのコミュニケーション、CRMの登録などに時間がかかりすぎている" },
              { icon: Users, title: "商品知識や営業ノウハウが属人化している", desc: "ベテランのやり方に頼り、チーム全体での標準化が進まない" },
              { icon: Target, title: "DXを進めたいが、具体策が見えない", desc: "何から始めたら良いのか、どうやって効率化するのか不明確" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-cyan-500 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-100 text-cyan-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-900 text-white px-8 py-4 rounded-lg shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-slate-900"></div>
              <p className="text-xl font-bold">その課題、<span className="text-cyan-400">Gemini</span>で解決できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Learn Section */}
      <section className="py-20 bg-white relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">本セミナーで学べること</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              製造業の営業現場で実際に使える、4つの実践スキルを習得できます。
            </p>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: 専門知識の整理・要約 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full border-2 border-slate-200 hover:border-cyan-500 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-4 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-slate-200 group-hover:text-cyan-500 transition-colors">01</div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">専門知識の整理・要約をAIでサポート</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    製品仕様や技術情報を、わかりやすく整理・要約する方法を紹介。営業担当でも「その場で答えられる」状態を作ります。
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-slate-700">
                    ✓ 技術仕様を顧客向けに粗い描描に変換
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: 営業事務作業の効率化 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full border-2 border-slate-200 hover:border-purple-500 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-purple-100 p-4 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-slate-200 group-hover:text-purple-500 transition-colors">02</div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">営業事務作業の効率化</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    議事録作成、メール文作成、報告書・CRM入力の下書がGeminiで自動化される具体例を解説します。
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded text-sm text-slate-700">
                    ✓ 打合せ記録を瞬時に自動化
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: 知識の見える化・標準化 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full border-2 border-slate-200 hover:border-emerald-500 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Search className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-slate-200 group-hover:text-emerald-500 transition-colors">03</div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">知識の見える化・標準化</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    ベテランのノウハウをAIに整理させ、チームで共有できる形にする方法を学びます。
                  </p>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-sm text-slate-700">
                    ✓ 属人化を解消し、チーム全体の力を引き出す
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 4: 小さく始める業務改善 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative h-full border-2 border-slate-200 hover:border-orange-500 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-orange-100 p-4 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-slate-200 group-hover:text-orange-500 transition-colors">04</div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">小さく始める業務改善のヒント</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    いきなり大規模なDXではなく、営業業務の一部から始める現実的な改善例を紹介します。
                  </p>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded text-sm text-slate-700">
                    ✓ 今日から実践できる具体的な例
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 text-lg mb-6">
              これら4つのスキルを組み合わせることで、営業プロセス全体の効率化が実現します。
            </p>
            <div className="inline-block bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 px-8 py-4 rounded-xl">
              <p className="text-slate-900 font-bold text-lg">
                セミナーでは、実際のプロンプト例と使用例を<br className="md:hidden" />
                <span className="text-cyan-600">デモンストレーション</span>します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Focus Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Industry Focus</Badge>
            <h2 className="text-3xl font-bold text-slate-900">製造業営業に特化した活用ポイント</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              「汎用的なAI研修」ではありません。製造業ならではの課題に対応した、実践的な活用例をご紹介します。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-50 border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  技術説明の言語化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  複雑な技術仕様や製品スペックを、非技術者の顧客にも伝わるわかりやすい言葉に自動変換。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  専門用語の噛み砕き
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  業界特有の専門用語を、提案先の業界や職種に合わせて適切な表現に調整した提案文を作成。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  現場視点のヒアリング
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  製造現場の課題を深掘りするための、具体的で鋭いヒアリング項目リストを瞬時に生成。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50 border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  業界特化の競合分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  ニッチな市場や特定の技術領域における競合製品の比較表や差別化ポイントを整理。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-20 bg-slate-100">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">セミナー内容（アジェンダ）</h2>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {[
                { time: "Part 1", title: "営業プロセス別の活用例", desc: "調査・準備・提案・フォローの各フェーズでのGemini実演" },
                { time: "Part 2", title: "製造業営業での活用ポイント", desc: "業界特有の課題解決に向けたプロンプト活用術" },
                { time: "Part 3", title: "質疑応答", desc: "皆様の疑問にその場でお答えします" }
              ].map((item, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-cyan-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">{item.title}</div>
                    </div>
                    <div className="text-slate-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-slate-600 font-medium">実務にすぐ活かせる内容のみを厳選しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">登壇者</h2>
          
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  佐藤
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">佐藤 正徳</h3>
                <p className="text-cyan-600 font-medium mb-4">AI活用コーディネーター</p>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>
                    製造業の営業現場でのAI活用を専門とするコンサルタント。
                    多数の製造業企業におけるAI導入支援の実績を持ち、
                    特に営業プロセスの効率化と生産性向上において高い評価を得ている。
                  </p>
                  <p>
                    「実務ですぐに使える」をモットーに、
                    現場視点での具体的な活用方法をわかりやすく解説するスタイルが特徴。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">なぜ"無料"で実施するのか</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            私たちは、AIを活用することで業務改善が実際に進むということを、<br className="hidden md:block" />
            まずは体感していただきたいと考えています。
          </p>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            単なる知識提供ではなく、<br />
            「自社の業務にどう活かせるのか」「どこが効率化できそうか」を<br />
            具体的にイメージしていただくことが目的です。
          </p>
          <p className="text-xl font-bold text-cyan-400">
            まずは60分、"成果につながるAI活用"を体験してください。
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">参加概要</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">対象</h3>
                <p className="text-slate-600">製造業の営業担当者<br />営業企画・管理職の方</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">日時・所要時間</h3>
                <p className="text-slate-600">2026年2月1日(木) 14:00～15:00<br />約60分</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">開催形式</h3>
                <p className="text-slate-600">オンライン（Google Meet）<br />※全国どこからでも参加可能</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">参加費</h3>
                <p className="text-slate-600 font-bold text-lg">無料</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            営業のやり方、<br className="md:hidden" />そろそろアップデートしませんか？
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Geminiで変わる"次世代の製造業営業"を体験してください。
          </p>
          
          <Card className="max-w-md mx-auto bg-white/5 backdrop-blur-md border-white/10 text-left">
            <CardHeader>
              <CardTitle className="text-white text-center">今すぐ申し込む（無料）</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-slate-300">会社名 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="company" 
                    placeholder="〇〇製造株式会社" 
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {formErrors.company && <p className="text-red-400 text-xs">{formErrors.company}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">名前 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="山田太郎" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {formErrors.name && <p className="text-red-400 text-xs">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium text-slate-300">役職 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="position" 
                    placeholder="営業部長" 
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {formErrors.position && <p className="text-red-400 text-xs">{formErrors.position}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">メールアドレス <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="name@company.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {formErrors.email && <p className="text-red-400 text-xs">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-300">電話番号 <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="090-1234-5678" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs">{formErrors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="challenge" className="text-sm font-medium text-slate-300">課題に感じていること</label>
                  <textarea 
                    id="challenge" 
                    placeholder="例：提案準備に時間がかかる、競合調査が属人化している..." 
                    rows={3}
                    value={formData.challenge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 text-lg shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "送信中..." : "無料で参加登録する"}
                </Button>
                <div className="space-y-3 mt-4 text-xs text-slate-400 text-center">
                  <p>
                    ※ 研修に関して、事前にご連絡させていただく場合がございます。
                  </p>
                  <p>
                    ※ 同業他社様のご参加はお断りする場合がございます。
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-800">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="font-bold text-white mb-4">会社概要</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">会社名：</span><span className="text-slate-300">anyenv株式会社</span></p>
                <p><span className="text-slate-400">代表取締役：</span><span className="text-slate-300">四宮 浩二</span></p>
                <p><span className="text-slate-400">住所：</span><span className="text-slate-300">東京都渋谷区道玄坂2-25-12<br className="hidden md:block" />道玄坂通5F</span></p>
                <p className="pt-2 text-slate-400 text-xs leading-relaxed">
                  anyenv株式会社は、エージェントグループ（証券コード：7098）のDX・AXの専門組織です。
                </p>
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-bold text-white mb-4">お問い合わせ</h3>
              <p className="text-sm text-slate-300 break-all">
                <a href="mailto:info@anyenv-inc.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  info@anyenv-inc.com
                </a>
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="font-bold text-white mb-4">その他</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.anyenv-inc.com/privacypolicy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    プライバシーポリシー
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
            <p>&copy; 2026 anyenv Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
