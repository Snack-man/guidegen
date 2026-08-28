import { useState, useRef, type ChangeEvent } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

/* ─── Types ────────────────────────────────── */

type ThemeCfg = {
  id: string; name: string; desc: string
  from: string; to: string; accent: string; light: string
}

type GuideStep = { id: string; title: string; desc: string }

type Form = {
  brandName: string; tagline: string
  guideName: string; guideSubtitle: string
  steps: GuideStep[]
  whatsapp: string; telegram: string; email: string
  logo: string | null
}

let stepUid = 0
const newStepId = () => `step-${Date.now()}-${stepUid++}`

/* ─── Data ─────────────────────────────────── */

const THEMES: ThemeCfg[] = [
  { id:"violet", name:"Violet",          desc:"Créatif",       from:"#4f35d2", to:"#B79AF5", accent:"#5B2EC9", light:"#ede9fe" },
  { id:"gold",   name:"Prestige",        desc:"Luxe",          from:"#12082e", to:"#2a1a6e", accent:"#e8af3c", light:"#fef3c7" },
  { id:"blue",   name:"Corporate",       desc:"Confiance",     from:"#0f2757", to:"#1a4fae", accent:"#3b82f6", light:"#dbeafe" },
  { id:"green",  name:"Nature",          desc:"Croissance",    from:"#0d3b1e", to:"#155e32", accent:"#22c55e", light:"#dcfce7" },
  { id:"teal",   name:"Nuit",            desc:"Innovation",    from:"#091526", to:"#0a5f7a", accent:"#06b6d4", light:"#cffafe" },
  { id:"rose",   name:"Passion",         desc:"Énergie",       from:"#3b0146", to:"#8b1260", accent:"#ec4899", light:"#fce7f3" },
  { id:"warm",   name:"Chaleureux",      desc:"Authentique",   from:"#6b2009", to:"#9c3a0a", accent:"#f97316", light:"#ffedd5" },
  { id:"slate",  name:"Minuit",          desc:"Premium",       from:"#0f172a", to:"#1e293b", accent:"#94a3b8", light:"#f1f5f9" },
]

const STEPS = [
  { label: "Modèle",      icon: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm3 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" },
  { label: "Informations",icon: "M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" },
  { label: "Contacts",    icon: "M3 8l9-5 9 5v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zm9 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Génération",  icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
]

const DEFAULT: Form = {
  brandName: "Académie Pro",
  tagline: "Votre succès, notre mission",
  guideName: "Guide de Démarrage Rapide",
  guideSubtitle: "Commencez votre parcours en 3 étapes simples",
  steps: [
    { id: "step-default-1", title: "Accédez à votre espace", desc: "Connectez-vous et découvrez l'ensemble de vos formations disponibles en un seul endroit." },
    { id: "step-default-2", title: "Suivez votre programme", desc: "Progressez à votre rythme avec des modules interactifs pensés pour maximiser votre apprentissage." },
    { id: "step-default-3", title: "Obtenez votre certificat", desc: "Validez vos acquis et téléchargez un certificat reconnu par les professionnels du secteur." },
  ],
  whatsapp: "+33 6 12 34 56 78",
  telegram: "@academie_pro",
  email: "bonjour@academie-pro.fr",
  logo: null,
}

/* ─── Sidebar ──────────────────────────────── */

function Sidebar({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  return (
    <aside
      className="hidden lg:flex flex-col h-full select-none flex-shrink-0"
      style={{ width: 228, background: "#0d0b1a", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Branding */}
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#5B2EC9,#B79AF5)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 10.5L5 4l3.5 5L11 6l1.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">GuideGen</p>
            <p className="text-white/30 text-[10px] mt-0.5">Outil interne</p>
          </div>
        </div>
      </div>

      {/* Steps nav */}
      <nav className="px-3 flex-1">
        <p className="text-white/20 text-[9px] font-semibold tracking-[0.2em] uppercase px-3 mb-3">Étapes</p>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[22px] top-4 w-px"
            style={{ height: "calc(100% - 28px)", background: "rgba(255,255,255,0.06)" }}
          />
          {/* Progress line */}
          <div
            className="absolute left-[22px] top-4 w-px transition-all duration-500"
            style={{
              height: `${(step / (STEPS.length - 1)) * (100 - 28 / STEPS.length)}%`,
              background: "linear-gradient(180deg,#5B2EC9,#B79AF5)",
            }}
          />

          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <button
                key={i}
                onClick={() => onStep(i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group relative"
                style={active ? { background: "rgba(91,46,201,0.15)" } : {}}
              >
                {/* Step indicator */}
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold transition-all duration-200 relative z-10"
                  style={
                    done
                      ? { background: "#5B2EC9", color: "white" }
                      : active
                      ? { background: "linear-gradient(135deg,#5B2EC9,#B79AF5)", color: "white", boxShadow: "0 0 0 3px rgba(91,46,201,0.25)" }
                      : { background: "#1e1a30", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {done ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className="text-[13px] font-medium transition-colors duration-150"
                  style={active ? { color: "white" } : done ? { color: "rgba(255,255,255,0.5)" } : { color: "rgba(255,255,255,0.3)" }}
                >
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-[9px] font-bold">
            V
          </div>
          <div>
            <p className="text-white/50 text-[11px] font-medium leading-none">Vendeur</p>
            <p className="text-white/20 text-[10px] mt-0.5">Compte pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ─── Mobile top bar (branding + steps) ────── */

function MobileTopBar({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  return (
    <div className="flex lg:hidden flex-col select-none flex-shrink-0" style={{ background: "#0d0b1a" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#5B2EC9,#B79AF5)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 10.5L5 4l3.5 5L11 6l1.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-white text-[13px] font-semibold leading-none">GuideGen</p>
        </div>
        <p className="text-white/30 text-[10px] flex-shrink-0">Étape {step + 1}/{STEPS.length}</p>
      </div>
      <div className="flex gap-1.5 px-3 pb-3 scroll-x" style={{ scrollPaddingRight: 12 }}>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <button
              key={i}
              onClick={() => onStep(i)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full flex-shrink-0 transition-all duration-150"
              style={active ? { background: "rgba(91,46,201,0.18)" } : {}}
            >
              <div
                className="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-bold"
                style={
                  done
                    ? { background: "#5B2EC9", color: "white" }
                    : active
                    ? { background: "linear-gradient(135deg,#5B2EC9,#B79AF5)", color: "white" }
                    : { background: "#1e1a30", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {done ? (
                  <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="text-[11px] font-medium whitespace-nowrap"
                style={active ? { color: "white" } : done ? { color: "rgba(255,255,255,0.5)" } : { color: "rgba(255,255,255,0.3)" }}
              >
                {s.label}
              </span>
            </button>
          )
        })}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
      </div>
    </div>
  )
}

/* ─── Field ────────────────────────────────── */

function Field({
  label, value, onChange, placeholder, multiline, valid, touched, hint,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; multiline?: boolean
  valid?: boolean; touched?: boolean; hint?: string
}) {
  const [focused, setFocused] = useState(false)
  const showVal = touched && value.length > 0
  const borderColor = focused
    ? "#5B2EC9"
    : showVal
    ? valid ? "#22c55e" : "#ef4444"
    : "#e4e4e7"
  const shadowColor = focused ? "rgba(91,46,201,0.1)" : "transparent"

  const cls = `w-full text-[13.5px] font-medium text-gray-900 placeholder-gray-300 outline-none transition-all duration-150 resize-none bg-white rounded-lg px-3.5 py-2.5`

  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div
        className="rounded-lg transition-all duration-150"
        style={{ border: `1px solid ${borderColor}`, boxShadow: `0 0 0 3px ${shadowColor}` }}
      >
        {multiline ? (
          <textarea
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cls}
          />
        ) : (
          <div className="flex items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`${cls} pr-10`}
            />
            {showVal && (
              <div className="mr-3 flex-shrink-0">
                {valid ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#22c55e" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#ef4444" />
                    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

/* ─── Step 0: Theme Gallery ────────────────── */

function StepTheme({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Étape 1"
        title="Choisissez un thème"
        sub="La palette de couleurs détermine l'identité visuelle complète de votre guide PDF."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-6">
        {THEMES.map((t) => {
          const sel = t.id === selected
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="group rounded-xl overflow-hidden text-left transition-all duration-150 focus:outline-none"
              style={{
                border: sel ? `2px solid #5B2EC9` : "2px solid #f0f0f0",
                boxShadow: sel ? "0 0 0 3px rgba(91,46,201,0.12)" : "none",
              }}
            >
              <div
                className="h-[52px] relative"
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              >
                {/* Decorative orb */}
                <div className="absolute right-0 top-0 w-10 h-10 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
                {sel && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#5B2EC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-2.5 py-2 bg-white">
                <p className="text-[12px] font-semibold text-gray-800">{t.name}</p>
                <p className="text-[10px] text-gray-400">{t.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Step 1: Info Form ────────────────────── */

function StepInfo({ form, update, touched }: { form: Form; update: (p: Partial<Form>) => void; touched: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = (ev) => update({ logo: ev.target?.result as string })
    r.readAsDataURL(f)
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Étape 2"
        title="Identité de marque"
        sub="Ces informations apparaîtront dans l'en-tête et le titre de votre guide."
      />

      {/* Logo */}
      <div className="mt-6 mb-5">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Logo</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 cursor-pointer transition-all duration-150"
        >
          {form.logo ? (
            <img src={form.logo} alt="Logo" className="h-9 w-9 rounded-lg object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-[13px] font-medium text-gray-700">
              {form.logo ? "Logo importé · cliquer pour changer" : "Importer un logo"}
            </p>
            <p className="text-[11px] text-gray-400">PNG, JPG, SVG</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nom de marque" value={form.brandName} onChange={(v) => update({ brandName: v })} placeholder="Académie Pro" valid={form.brandName.trim().length >= 2} touched={touched} />
          <Field label="Accroche" value={form.tagline} onChange={(v) => update({ tagline: v })} placeholder="Votre succès…" valid={form.tagline.trim().length >= 2} touched={touched} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Titre du guide" value={form.guideName} onChange={(v) => update({ guideName: v })} placeholder="Guide de démarrage" valid={form.guideName.trim().length >= 2} touched={touched} />
          <Field label="Sous-titre" value={form.guideSubtitle} onChange={(v) => update({ guideSubtitle: v })} placeholder="En 3 étapes simples" valid={form.guideSubtitle.trim().length >= 2} touched={touched} />
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Contenu des étapes</p>
          <span className="text-[11px] text-gray-300">{form.steps.length} étape{form.steps.length > 1 ? "s" : ""}</span>
        </div>
        <div className="space-y-4">
          {form.steps.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-violet-500">Étape {i + 1}</span>
                {form.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => update({ steps: form.steps.filter((_, idx) => idx !== i) })}
                    className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors duration-150"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    Supprimer
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Field
                  label="Titre"
                  value={s.title}
                  onChange={(v) => update({ steps: form.steps.map((st, idx) => idx === i ? { ...st, title: v } : st) })}
                  valid={s.title.trim().length >= 4}
                  touched={touched}
                />
                <Field
                  label="Description"
                  value={s.desc}
                  onChange={(v) => update({ steps: form.steps.map((st, idx) => idx === i ? { ...st, desc: v } : st) })}
                  multiline
                  valid={s.desc.trim().length >= 4}
                  touched={touched}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => update({ steps: [...form.steps, { id: newStepId(), title: "", desc: "" }] })}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-gray-300 text-[13px] font-medium text-violet-600 hover:border-violet-300 hover:bg-violet-50/40 transition-all duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Ajouter une étape
        </button>
      </div>
    </div>
  )
}

/* ─── Step 2: Contacts ─────────────────────── */

function StepContacts({ form, update, touched }: { form: Form; update: (p: Partial<Form>) => void; touched: boolean }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Étape 3"
        title="Coordonnées"
        sub="Vos liens de contact apparaîtront dans le pied de page du guide sous forme de badges."
      />
      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/40">
          <div className="w-8 h-8 rounded-lg bg-[#25d366]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.12.55 4.18 1.6 6L0 24l6.16-1.61A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12a11.93 11.93 0 0 0-3.48-8.52zM12 22c-1.79 0-3.53-.48-5.06-1.38l-.36-.22-3.73.98.99-3.66-.24-.38A9.9 9.9 0 0 1 2 12C2 6.49 6.49 2 12 2a9.9 9.9 0 0 1 7.05 2.95A9.9 9.9 0 0 1 22 12c0 5.51-4.49 10-10 10zm5.46-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07a8.14 8.14 0 0 1-2.4-1.48 9.03 9.03 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.2 3.06c.15.2 2.08 3.17 5.04 4.44.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.11.56-.08 1.73-.71 1.97-1.39.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.57-.35z" />
            </svg>
          </div>
          <div className="flex-1">
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => update({ whatsapp: v })} placeholder="+33 6 00 00 00 00" valid={form.whatsapp.trim().length >= 8} touched={touched} />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/40">
          <div className="w-8 h-8 rounded-lg bg-[#229ed9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#229ed9">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19l-2.02 9.5c-.15.67-.54.83-1.09.52l-3-2.21-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.06 5.52-4.98c.24-.21-.05-.33-.37-.12L6.03 13.9 3.1 13c-.66-.2-.67-.66.14-.98l11.65-4.49c.55-.2 1.03.13.85.96z" />
            </svg>
          </div>
          <div className="flex-1">
            <Field label="Telegram" value={form.telegram} onChange={(v) => update({ telegram: v })} placeholder="@votre_pseudo" valid={form.telegram.trim().length >= 2} touched={touched} />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/40">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5B2EC9" strokeWidth="1.5">
              <rect x="1" y="3" width="14" height="10" rx="1.5" />
              <path d="m1 4.5 7 5 7-5" />
            </svg>
          </div>
          <div className="flex-1">
            <Field label="Email" value={form.email} onChange={(v) => update({ email: v })} placeholder="vous@domaine.fr" valid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())} touched={touched} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 3: Generation ───────────────────── */

function StepGeneration({ theme, stepCount, onDownload, status }: { theme: ThemeCfg; stepCount: number; onDownload: () => void; status: "idle" | "generating" | "done" | "error" }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Étape 4"
        title="Générer le PDF"
        sub="Vérifiez l'aperçu dans le panneau de droite, puis téléchargez votre guide finalisé."
      />
      <div className="mt-8 space-y-4">
        {/* Summary card */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Récapitulatif</p>
          <div className="space-y-2">
            {[
              ["Thème", theme.name],
              ["Format", "PDF A4 · Portrait"],
              ["Étapes", `${stepCount} étape${stepCount > 1 ? "s" : ""} incluse${stepCount > 1 ? "s" : ""}`],
              ["Contacts", "WhatsApp · Telegram · Email"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[12.5px] text-gray-500">{k}</span>
                <span className="text-[12.5px] font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Contenu inclus</p>
          <div className="space-y-2">
            {[
              "En-tête dégradé avec logo et badge",
              "Bandeau de confirmation d'accès",
              "3 étapes avec timeline numérotée",
              "Simulation de plateforme",
              "Encart conseil",
              "Bloc CTA centré",
              "Pied de page avec contacts",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill="#5B2EC9" fillOpacity="0.12" />
                  <path d="M4 7l2 2 4-4" stroke="#5B2EC9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12.5px] text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={onDownload}
          disabled={status === "generating"}
          className="w-full py-3.5 rounded-xl font-semibold text-[14px] text-white transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-70"
          style={
            status === "done"
              ? { background: "#16a34a", boxShadow: "0 4px 16px rgba(22,163,74,0.3)" }
              : status === "error"
              ? { background: "#dc2626", boxShadow: "0 4px 16px rgba(220,38,38,0.3)" }
              : { background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, boxShadow: `0 4px 20px ${theme.accent}40` }
          }
        >
          {status === "done" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Guide généré avec succès
            </>
          ) : status === "generating" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
                <circle cx="8" cy="8" r="6.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              Génération en cours…
            </>
          ) : status === "error" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 5v4M8 11.5v.01" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.4" fill="none" />
              </svg>
              Échec — réessayer
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v9M4 8l4 4 4-4M2 13h12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Télécharger le PDF
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/* ─── Section Header ───────────────────────── */

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div>
      <span className="text-[11px] font-semibold text-violet-500 tracking-[0.16em] uppercase">{eyebrow}</span>
      <h2 className="text-[22px] font-bold text-gray-900 mt-1 tracking-tight">{title}</h2>
      <p className="text-[13.5px] text-gray-400 mt-1 leading-relaxed">{sub}</p>
    </div>
  )
}

/* ─── PDF Preview ──────────────────────────── */

function PDFPreview({ form, theme }: { form: Form; theme: ThemeCfg }) {
  const items = form.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.title, d: s.desc }))

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)",
        fontSize: 12,
      }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${theme.from} 0%, ${theme.to} 100%)`,
          padding: "28px 28px 48px",
        }}
      >
        <div className="absolute" style={{ width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -60, right: -50 }} />
        <div className="absolute" style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -20, left: -20 }} />

        <div className="relative flex items-center justify-between mb-8">
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {form.brandName}
          </span>
          {form.logo ? (
            <img src={form.logo} alt="" style={{ height: 24, objectFit: "contain", opacity: 0.9, borderRadius: 4 }} />
          ) : (
            <div style={{ padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em" }}>
              LOGO
            </div>
          )}
        </div>

        <div className="relative">
          <h1 style={{ color: "white", fontWeight: 800, fontSize: 24, lineHeight: 1.2, marginBottom: 8 }}>{form.guideName}</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 16 }}>{form.guideSubtitle}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 600 }}>{form.tagline}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "white", padding: "0 28px 28px" }}>
        {/* Confirmation card */}
        <div style={{ marginTop: -24, background: "white", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)", position: "relative", zIndex: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: theme.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "#111", fontSize: 12 }}>Votre accès est confirmé</p>
            <p style={{ color: "#6b7280", fontSize: 10.5, marginTop: 2, lineHeight: 1.5 }}>
              Suivez les étapes ci-dessous pour commencer immédiatement.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d1d5db", marginBottom: 14 }}>
            Étapes de démarrage
          </p>
          {items.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 800, background: `linear-gradient(135deg,${theme.from},${theme.to})`, flexShrink: 0 }}>
                  {s.n}
                </div>
                {i < items.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: theme.light, margin: "4px 0", minHeight: 16 }} />
                )}
              </div>
              <div style={{ paddingBottom: 16 }}>
                <p style={{ fontWeight: 700, color: "#111", fontSize: 12 }}>{s.t}</p>
                <p style={{ color: "#6b7280", fontSize: 10.5, marginTop: 3, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fake UI */}
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", background: "#0f172a", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["#ef4444", "#eab308", "#22c55e"].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
            <div style={{ marginLeft: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "2px 20px", color: "rgba(255,255,255,0.2)", fontSize: 9 }}>
              plateforme.fr
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "14px 16px" }}>
            <div style={{ width: 80, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {["Tableau de bord", "Formations", "Progression", "Certificats"].map((item, i) => (
                <div key={item} style={{ padding: "4px 6px", borderRadius: 5, fontSize: 9, fontWeight: 500, color: i === 1 ? theme.accent : "rgba(255,255,255,0.3)", background: i === 1 ? `${theme.accent}20` : "transparent" }}>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, width: "70%" }} />
              <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
              <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "80%" }} />
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <div style={{ padding: "5px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700, color: "white", background: `linear-gradient(135deg,${theme.from},${theme.to})` }}>
                  Continuer
                </div>
                <div style={{ padding: "5px 10px", borderRadius: 6, fontSize: 9, color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Aperçu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div style={{ marginTop: 14, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start", background: theme.light, border: `1px solid ${theme.accent}18` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${theme.accent}20` }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1a3.5 3.5 0 0 1 1.3 6.76V9H4.7V7.76A3.5 3.5 0 0 1 6 1zm-1 10h2m-1 .5v1" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 10.5, color: theme.accent }}>Conseil</p>
            <p style={{ fontSize: 10, color: "#4b5563", marginTop: 2, lineHeight: 1.5 }}>
              30 minutes par jour suffisent pour transformer votre parcours. La régularité prime sur l'intensité.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 14, borderRadius: 14, padding: "22px 20px", textAlign: "center", background: `linear-gradient(140deg, ${theme.from}, ${theme.to})` }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Prêt à commencer ?</p>
          <h3 style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1.25, marginBottom: 14 }}>
            Accédez à votre espace<br />dès maintenant
          </h3>
          <div style={{ display: "inline-block", padding: "9px 22px", background: "white", borderRadius: 8, fontSize: 11, fontWeight: 700, color: theme.from, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
            Se connecter →
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d1d5db", textAlign: "center", marginBottom: 10 }}>
            Nous contacter
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
            {[
              { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="#25d366"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.12.55 4.18 1.6 6L0 24l6.16-1.61A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12a11.93 11.93 0 0 0-3.48-8.52z" /></svg>, label: form.whatsapp },
              { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="#229ed9"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19l-2.02 9.5c-.15.67-.54.83-1.09.52l-3-2.21-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.06 5.52-4.98c.24-.21-.05-.33-.37-.12L6.03 13.9 3.1 13c-.66-.2-.67-.66.14-.98l11.65-4.49c.55-.2 1.03.13.85.96z" /></svg>, label: form.telegram },
              { icon: <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#5B2EC9" strokeWidth="1.5"><rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="m1 4.5 7 5 7-5" /></svg>, label: form.email },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, border: "1px solid #f0f0f0", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {icon}
                <span style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── App ──────────────────────────────────── */

export default function App() {
  const [step, setStep] = useState(0)
  const [themeId, setThemeId] = useState("violet")
  const [form, setForm] = useState<Form>(DEFAULT)
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle")
  const [mobileView, setMobileView] = useState<"form" | "preview">("form")
  const exportRef = useRef<HTMLDivElement>(null)

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]
  const update = (p: Partial<Form>) => setForm((f) => ({ ...f, ...p }))

  const next = () => {
    setTouched(true)
    setTimeout(() => { setStep((s) => Math.min(STEPS.length - 1, s + 1)); setTouched(false) }, 80)
  }
  const back = () => { setStep((s) => Math.max(0, s - 1)); setTouched(false) }

  const download = async () => {
    if (status === "generating" || !exportRef.current) return
    setStatus("generating")
    try {
      // Laisse le DOM se peindre avant la capture
      await new Promise((r) => setTimeout(r, 50))

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.95)
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = `${form.guideName || "guide"}.pdf`.trim().replace(/\s+/g, "-").toLowerCase()
      pdf.save(filename)

      setStatus("done")
      setTimeout(() => setStatus("idle"), 3500)
    } catch (err) {
      console.error("Échec de la génération du PDF :", err)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3500)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full" style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f8fa" }}>

      {/* ── Sidebar (desktop only) ── */}
      <Sidebar step={step} onStep={setStep} />

      {/* ── Mobile top bar (branding + steps) ── */}
      <MobileTopBar step={step} onStep={setStep} />

      {/* ── Mobile Formulaire / Aperçu switcher ── */}
      <div className="flex lg:hidden items-center gap-2 px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: "#ebebef", background: "white" }}>
        {(["form", "preview"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-150"
            style={
              mobileView === v
                ? { background: "linear-gradient(135deg,#5B2EC9,#B79AF5)", color: "white" }
                : { background: "#f4f4f6", color: "#6b7280" }
            }
          >
            {v === "form" ? "Formulaire" : "Aperçu"}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── Form panel ── */}
        <div
          className={`${mobileView === "preview" ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-[520px] min-h-0 lg:flex-shrink-0`}
          style={{ borderRight: "1px solid #ebebef", background: "white" }}
        >
          {/* Header bar */}
          <div className="hidden lg:flex items-center justify-between px-4 sm:px-8 py-4 border-b flex-shrink-0" style={{ borderColor: "#ebebef" }}>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">Générateur de guide</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Étape {step + 1} sur {STEPS.length} · {STEPS[step].label}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    background: i < step ? "#5B2EC9" : i === step ? "#5B2EC9" : "#e4e4e7",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 scroll-y px-4 sm:px-8 py-6 sm:py-7">
            {step === 0 && <StepTheme selected={themeId} onSelect={setThemeId} />}
            {step === 1 && <StepInfo form={form} update={update} touched={touched} />}
            {step === 2 && <StepContacts form={form} update={update} touched={touched} />}
            {step === 3 && <StepGeneration theme={theme} stepCount={form.steps.length} onDownload={download} status={status} />}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-t flex-shrink-0" style={{ borderColor: "#ebebef" }}>
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Précédent
            </button>

            {step < STEPS.length - 1 && (
              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg,#5B2EC9,#B79AF5)", boxShadow: "0 2px 12px rgba(91,46,201,0.35)" }}
              >
                Suivant
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Preview panel ── */}
        <div className={`${mobileView === "form" ? "hidden" : "flex"} lg:flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden`}>
          {/* Preview header */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 sm:px-7 py-4 border-b flex-shrink-0" style={{ borderColor: "#ebebef", background: "#fafafa" }}>
            <div className="flex items-center gap-2.5 flex-wrap">
              <p className="text-[13px] font-semibold text-gray-700">Aperçu du guide</p>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                En direct
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 border border-gray-200 bg-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="#a1a1aa" strokeWidth="1.2" />
                <path d="M1 4.5h10" stroke="#a1a1aa" strokeWidth="1.2" />
              </svg>
              Format A4
            </div>
          </div>

          {/* Scrollable preview */}
          <div className="flex-1 min-h-0 scroll-y p-4 sm:p-7" style={{ background: "#f3f3f7" }}>
            <PDFPreview form={form} theme={theme} />
            <div className="h-8" />
          </div>
        </div>
      </div>

      {/* Rendu hors-écran utilisé pour la capture du PDF (toujours monté, même si l'aperçu visible est masqué) */}
      <div style={{ position: "fixed", top: 0, left: -99999, width: 794, pointerEvents: "none" }} aria-hidden="true">
        <div ref={exportRef} style={{ width: 794 }}>
          <PDFPreview form={form} theme={theme} />
        </div>
      </div>
    </div>
  )
}
