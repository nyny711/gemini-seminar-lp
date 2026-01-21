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

// セミナー情報の定義
const seminars = [
  {
    id: "vol1",
    title: "「商談時間」を最大化する",
    subtitle: "～非コア業務をAIで自動化し、顧客に向き合う～",
    date: "2026年2月3日(火)",
    time: "14:00～15:00",
    image: "/seminar-vol1.png",
    description: "日報・見積・技術照会...その事務作業、AIなら一瞬です。営業マンを「本来の仕事」に集中させる具体的メソッドを解説！"
  },
  {
    id: "vol2",
    title: "「売上」を最大化する",
    subtitle: "～売上改善に直結するAI活用方法～",
    date: "2026年2月10日(火)",
    time: "14:00～15:00",
    image: "/seminar-vol2.png",
    description: "帳社後の日報入力や図面確認の手順を削減。最新AIツールを活用して、製造業の思惑い営業スタイルを変革しましょう！"
  },
  {
    id: "vol3",
    title: "「売る」以外は、AIに任せる",
    subtitle: "～営業工数の6割を占める「事務作業」ゼロ化計画～",
    date: "2026年2月17日(火)",
    time: "14:00～15:00",
    image: "/seminar-vol3.png",
    description: "帳社後の日報入力や図面確認の手順を削減。最新AIツールを活用して、製造業の営業スタイルを変革しましょう！"
  },
  {
    id: "vol4",
    title: "AIと働く、次世代の営業組織",
    subtitle: "～生成AIによる自動化から、売上拡大戦略まで～",
    date: "2026年2月24日(火)",
    time: "14:00～15:00",
    image: "/seminar-vol4.png",
    description: "非コア業務はAIが自動処理し、人間は高付加価値な接客へ。成功企業が実践している「製造業特化」のAI活用術を公開！"
  }
];

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
    selectedSeminars: [] as string[], // 複数選択対応
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

  const handleSeminarToggle = (seminarId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedSeminars.includes(seminarId);
      const newSelected = isSelected
        ? prev.selectedSeminars.filter(id => id !== seminarId)
        : [...prev.selectedSeminars, seminarId];
      return { ...prev, selectedSeminars: newSelected };
    });
    if (formErrors.selectedSeminars) {
      setFormErrors(prev => ({ ...prev, selectedSeminars: "" }));
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
    if (formData.selectedSeminars.length === 0) errors.selectedSeminars = "少なくとも1つのセミナーを選択してください";
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
        selectedSeminars: formData.selectedSeminars,
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
          selectedSeminars: [],
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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 px-4 py-1 text-sm font-mono tracking-wider bg-cyan-950/30 backdrop-blur-sm">
                anyenv株式会社主催ウェビナー
              </Badge>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mb-4">
              <p className="text-cyan-400 text-sm font-medium">製造業DXウェビナー 営業改革シリーズ 全4回</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mb-8 flex items-center justify-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-transparent to-cyan-400" />
              <span className="text-cyan-400 font-bold text-3xl">全回参加無料</span>
              <div className="h-1 w-8 bg-gradient-to-l from-transparent to-cyan-400" />
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
              製造業の営業を<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AIで変革する</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              日報・見積・技術照会などの非コア業務をAIで自動化し、<br />
              営業マンを「本来の仕事」に集中させる具体的メソッドを全4回で解説！
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-6 text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-105" onClick={() => document.getElementById('seminars')?.scrollIntoView({ behavior: 'smooth' })}>
                セミナー詳細を見る <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Seminars Section */}
      <section id="seminars" className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">セミナーラインナップ</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              全4回のシリーズで、製造業の営業DXを段階的に学べます。<br />
              気になる回だけの参加も、全回参加も大歓迎です。
            </p>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {seminars.map((seminar, index) => (
              <motion.div
                key={seminar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-sm hover:shadow-lg h-full">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={seminar.image} 
                      alt={seminar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-cyan-600 text-white font-bold">
                        {seminar.id.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{seminar.title}</h3>
                    <p className="text-sm text-cyan-600 font-medium mb-4">{seminar.subtitle}</p>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{seminar.description}</p>
                    <div className="flex items-center gap-2 text-slate-700 text-sm mb-2">
                      <Clock className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium">{seminar.date} {seminar.time}</span>
                    </div>
                    <p className="text-xs text-slate-500">オンライン開催（途中参加&退出OK）</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-6 text-lg" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
              今すぐ申し込む（無料） <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
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
              <Card className="border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-sm hover:shadow-lg h-full">
                <CardHeader className="bg-gradient-to-br from-cyan-50 to-blue-50 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-cyan-600 text-white rounded-lg p-3">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-slate-900">専門知識の整理・要約</CardTitle>
                      <p className="text-sm text-slate-600 font-normal">膨大な技術資料を瞬時に検索・要約</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    製品仕様書、過去の提案資料、技術マニュアルなど、社内に散在する情報を一元管理し、
                    必要な情報を瞬時に引き出す方法を学びます。
                  </p>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>顧客からの技術的な質問に即座に対応できるようになります</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: 提案資料の自動生成 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative"
            >
              <Card className="border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-sm hover:shadow-lg h-full">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-lg p-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-slate-900">提案資料の自動生成</CardTitle>
                      <p className="text-sm text-slate-600 font-normal">顧客ごとにカスタマイズされた提案書を短時間で作成</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    顧客情報と製品データを組み合わせて、説得力のある提案資料を自動生成。
                    営業担当者は戦略立案に集中できます。
                  </p>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>提案準備時間を70%削減し、商談数を増やせます</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: 競合分析の自動化 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative"
            >
              <Card className="border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-sm hover:shadow-lg h-full">
                <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-indigo-600 text-white rounded-lg p-3">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-slate-900">競合分析の自動化</CardTitle>
                      <p className="text-sm text-slate-600 font-normal">市場動向と競合情報を常に最新の状態で把握</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    競合他社の製品情報、価格動向、市場シェアなどを自動収集・分析。
                    営業戦略の立案に必要なインサイトを提供します。
                  </p>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>データに基づいた戦略的な営業活動が可能になります</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 4: 顧客対応の高度化 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative"
            >
              <Card className="border-2 border-slate-200 hover:border-cyan-500 transition-all shadow-sm hover:shadow-lg h-full">
                <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-purple-600 text-white rounded-lg p-3">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-slate-900">顧客対応の高度化</CardTitle>
                      <p className="text-sm text-slate-600 font-normal">AIアシスタントで24時間体制の顧客サポートを実現</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    よくある質問への自動応答、問い合わせ内容の分類・優先順位付けなど、
                    顧客対応業務を効率化します。
                  </p>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>顧客満足度向上と営業工数削減を同時に実現できます</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">よくある質問</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white border-2 border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                AIの知識がなくても参加できますか？
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                はい、問題ありません。本セミナーは、AI初心者の方でも理解できるよう、
                基礎から丁寧に解説します。専門用語も分かりやすく説明しますので、安心してご参加ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border-2 border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                途中参加・途中退出は可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                はい、可能です。業務の都合で全時間参加できない場合でも、
                途中参加・途中退出は自由です。お気軽にご参加ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border-2 border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                資料は配布されますか？
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                はい、セミナー終了後に参加者の皆様へ資料をメールでお送りします。
                復習や社内共有にご活用ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border-2 border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                複数名での参加は可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                はい、可能です。複数名でご参加いただく場合は、お手数ですが
                お一人ずつ申し込みフォームからご登録ください。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border-2 border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                録画視聴は可能ですか？
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                申し訳ございませんが、本セミナーは録画配信の予定はございません。
                リアルタイムでのご参加をお願いいたします。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                <p className="text-slate-600">毎週火曜日 14:00～15:00<br />約60分（全4回）</p>
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
                <p className="text-slate-600 font-bold text-lg">無料（全回）</p>
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
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300 block">参加希望セミナー <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {seminars.map((seminar) => (
                      <label 
                        key={seminar.id}
                        className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-600 rounded-md cursor-pointer hover:bg-slate-800/70 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedSeminars.includes(seminar.id)}
                          onChange={() => handleSeminarToggle(seminar.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-0 bg-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm">{seminar.id.toUpperCase()}: {seminar.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{seminar.date} {seminar.time}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formErrors.selectedSeminars && <p className="text-red-400 text-xs">{formErrors.selectedSeminars}</p>}
                </div>

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
