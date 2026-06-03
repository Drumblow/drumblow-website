import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { getAllProjects } from "@/lib/projetos/loader"
import {
  Smartphone,
  Globe,
  Brain,
  Puzzle,
  Rocket,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  PenTool,
  Code2,
} from "lucide-react"

function PhoneMockup({ variant = "left" }: { variant?: "left" | "right" }) {
  const isLeft = variant === "left"
  return (
    <div
      className={`relative w-[220px] md:w-[260px] shrink-0 rounded-[2.2rem] border border-gray-200 bg-white p-2 shadow-xl ${
        isLeft ? "rotate-[-6deg] translate-y-4" : "rotate-[6deg] -translate-y-2"
      }`}
    >
      <div className="rounded-[1.8rem] overflow-hidden bg-gray-50 border border-gray-100">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-20 h-5 bg-gray-900 rounded-full" />
        </div>
        <div className="px-3 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500" />
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500">Hello, Lucas</div>
            <div className="text-xs font-semibold text-gray-900 mt-0.5">Overview</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 border border-orange-100">
            <div className="text-[9px] text-gray-500">Revenue</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5">$ 48,750.00</div>
            <div className="mt-2 h-8 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-orange-400/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {["Payment received", "Pro Subscription", "Sale completed"].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
                <div className="text-[9px] text-gray-700">{item}</div>
                <div className="ml-auto text-[9px] text-gray-400">$ {(i + 1) * 250}.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  const t = await getTranslations("Home")
  const projects = await getAllProjects()
  const featured = projects.slice(0, 3)

  const services = [
    { icon: Smartphone, title: t("service_mobile"), description: t("service_mobile_desc") },
    { icon: Globe, title: t("service_web"), description: t("service_web_desc") },
    { icon: Brain, title: t("service_ai"), description: t("service_ai_desc") },
    { icon: Puzzle, title: t("service_integrations"), description: t("service_integrations_desc") },
    { icon: Rocket, title: t("service_mvp"), description: t("service_mvp_desc") },
  ]

  const processSteps = [
    { num: "1", icon: Lightbulb, title: t("process_1_title"), description: t("process_1_desc") },
    { num: "2", icon: PenTool, title: t("process_2_title"), description: t("process_2_desc") },
    { num: "3", icon: Code2, title: t("process_3_title"), description: t("process_3_desc") },
    { num: "4", icon: Rocket, title: t("process_4_title"), description: t("process_4_desc") },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="container relative pt-16 md:pt-24 pb-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>
                {t("hero_badge")}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-gray-900">
                {t("hero_title_line1")}<br />
                {t("hero_title_line2")}{" "}
                <span className="gradient-text">{t("hero_title_highlight")}</span>
              </h1>

              <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                {t("hero_description")}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
                >
                  {t("cta_meeting")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projetos"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t("cta_projects")}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="text-gray-900 font-semibold">+30</span> {t("clients_stats")}<br />{t("clients_location")}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center gap-4 relative">
              <PhoneMockup variant="left" />
              <PhoneMockup variant="right" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 400" fill="none">
                <path d="M50 200 Q 150 100 200 200 T 350 200" stroke="url(#waveGrad)" strokeWidth="2" fill="none"/>
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#fb923c" />
                    <stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="relative py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">{t("services_label")}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {t("services_title_line1")}<br />
              <span className="gradient-text">{t("services_title_highlight")}</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-100 transition-colors">
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="relative py-24 bg-white border-t border-gray-100">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">{t("projects_label")}</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {t("projects_title_line1")}<br />
                <span className="gradient-text">{t("projects_title_highlight")}</span>
              </h2>
            </div>
            <Link
              href="/projetos"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t("projects_view_all")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((project) => (
              <Link
                key={project.slug}
                href={`/projetos/${project.slug}`}
                className="group relative rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-orange-50 to-orange-100/30 border-b border-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-500 mb-2">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{project.domains?.[0] || t("projects_label")}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {project.title}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      project.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {project.status === 'Ativo' ? t("project_status_active") : t("project_status_archived")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stacks?.slice(0, 3).map((stack) => (
                      <span key={stack} className="text-[10px] font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-100">
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t("projects_view_all")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="processo" className="relative py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">{t("process_label")}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {t("process_title_line1")}<br />
              <span className="gradient-text">{t("process_title_highlight")}</span>
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step) => (
                <div key={step.num} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-orange-200 bg-orange-50 text-orange-500 mb-5 relative z-10">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-orange-500 mb-2">{step.num}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[220px] mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-white border-t border-gray-100 overflow-hidden">
        <div className="container relative">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              {t("cta_title_line1")}<br />
              {t("cta_title_line2")}
            </h2>
            <p className="text-orange-100 mb-8 max-w-md mx-auto">
              {t("cta_description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors shadow-lg"
              >
                {t("cta_button")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-orange-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("cta_response")}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
