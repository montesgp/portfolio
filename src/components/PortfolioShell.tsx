"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  LanguageCode,
  LocalizedList,
  PortfolioContent,
  ThemeKey
} from "@/content/portfolio";
import { getCvPdfExports } from "@/utils/cvExports";

type PortfolioShellProps = {
  content: PortfolioContent;
};

type ExperienceItem = PortfolioContent["experience"][number];
type ExperienceGroup = {
  company: string;
  grouped: boolean;
  items: readonly ExperienceItem[];
};

type ThemeStyle = {
  shell: string;
  header: string;
  heroGradient: string;
  heroSection: string;
  heroGrid: string;
  heroTitle: string;
  heroAside: string;
  card: string;
  cardMuted: string;
  chip: string;
  accent: string;
  primaryButton: string;
  secondaryButton: string;
  selectorActive: string;
  selectorInactive: string;
  ring: string;
  timelineDot: string;
};

const themeStyles: Record<ThemeKey, ThemeStyle> = {
  editorial: {
    shell: "bg-[#f6f1e8] text-[#211b16]",
    header: "border-[#d7c7ad] bg-[#f6f1e8]/90",
    heroGradient: "from-[#c9a66b]/30 via-[#eadcc3]/50 to-transparent",
    heroSection: "relative px-5 py-20 sm:px-8 sm:py-28 lg:px-10",
    heroGrid: "mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
    heroTitle: "mt-5 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-6xl",
    heroAside: "rounded-[2rem] border p-6",
    card: "border-[#d7c7ad] bg-[#fffaf1] shadow-xl shadow-[#d7c7ad]/35",
    cardMuted: "border-[#d7c7ad] bg-[#fffaf1]/75",
    chip: "border-[#a98d61]/50 bg-[#f3e5ca] text-[#3a2f24]",
    accent: "text-[#6d5532]",
    primaryButton: "bg-[#2d241c] text-[#fffaf1] hover:bg-[#46382b]",
    secondaryButton: "border-[#a98d61]/60 bg-[#fffaf1] text-[#2d241c] hover:bg-[#f3e5ca]",
    selectorActive: "border-[#2d241c] bg-[#2d241c] text-[#fffaf1]",
    selectorInactive: "border-[#a98d61]/60 bg-[#fffaf1] text-[#2d241c] hover:bg-[#f3e5ca]",
    ring: "focus-visible:outline-[#6d5532]",
    timelineDot: "bg-[#6d5532]"
  },
  vercel: {
    shell: "bg-[#fafafa] text-[#171717]",
    header: "border-transparent bg-[#fafafa] shadow-[0_1px_0_0_rgba(0,0,0,0.1)]",
    heroGradient: "",
    heroSection: "relative px-5 py-20 sm:px-8 sm:py-28 lg:px-10",
    heroGrid: "mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.6fr)] lg:items-start",
    heroTitle: "mt-5 max-w-4xl text-5xl font-semibold leading-none tracking-[-0.0475em] text-balance sm:text-7xl",
    heroAside: "rounded-xl border p-6",
    card: "border-transparent bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
    cardMuted: "border-transparent bg-transparent shadow-none",
    chip: "border-transparent bg-transparent text-[#4d4d4d] shadow-none",
    accent: "text-[#171717]",
    primaryButton: "bg-[#171717] text-white hover:bg-[#2e2e2e]",
    secondaryButton: "border-transparent bg-transparent text-[#4d4d4d] shadow-none hover:bg-[#ebebeb] hover:text-[#171717]",
    selectorActive: "border-transparent bg-[#171717] text-white shadow-none",
    selectorInactive: "border-transparent bg-transparent text-[#4d4d4d] shadow-none hover:bg-[#ebebeb] hover:text-[#171717]",
    ring: "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#0072f5]",
    timelineDot: "bg-[#171717]"
  }
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function localize<T>(value: Readonly<Record<LanguageCode, T>>, language: LanguageCode): T {
  return value[language];
}

const roleChangeCompanies = new Set(["Codeicus", "Luxsys S.R.L", "UNX Digital / Grupo Prominente"]);
const experienceFlipLabels = {
  en: {
    showDetails: "Show role details and reference",
    showHighlights: "Show experience highlights",
    reference: "Reference",
    phone: "Phone"
  },
  es: {
    showDetails: "Ver detalle del puesto y referencia",
    showHighlights: "Ver destacados de experiencia",
    reference: "Referencia",
    phone: "Teléfono"
  }
} as const;

function groupExperience(items: readonly ExperienceItem[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];

  for (const item of items) {
    const previous = groups.at(-1);

    if (roleChangeCompanies.has(item.company) && previous?.company === item.company && previous.grouped) {
      groups[groups.length - 1] = {
        ...previous,
        items: [item, ...previous.items]
      };
      continue;
    }

    groups.push({
      company: item.company,
      grouped: roleChangeCompanies.has(item.company),
      items: [item]
    });
  }

  return groups;
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  theme
}: {
  eyebrow: string;
  title: string;
  intro: string;
  id: string;
  theme: ThemeStyle;
}) {
  return (
    <div className="max-w-3xl">
      <p className={cx("text-sm font-bold uppercase tracking-[0.35em]", theme.accent)}>{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 opacity-80">{intro}</p>
    </div>
  );
}

export default function PortfolioShell({ content }: PortfolioShellProps) {
  const [language, setLanguage] = useState<LanguageCode>("es");
  const [theme, setTheme] = useState<ThemeKey>("vercel");

  const copy = content.locales[language];
  const themeStyle = themeStyles[theme];
  const currentThemeIndex = content.themes.findIndex((option) => option.key === theme);
  const nextThemeOption = content.themes[(currentThemeIndex + 1) % content.themes.length] ?? content.themes[0];
  const navItems = useMemo(
    () =>
      [
        ["about", copy.nav.about],
        ["experience", copy.nav.experience],
        ["skills", copy.nav.skills],
        ["projects", copy.nav.projects],
        ["education", copy.nav.education],
        ["contact", copy.nav.contact]
      ] as const,
    [copy]
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
  }, [language, theme]);

  return (
    <div className={cx("min-h-screen", themeStyle.shell)}>
      <a
        href="#main-content"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:font-semibold",
          themeStyle.primaryButton,
          themeStyle.ring
        )}
      >
        {copy.skipToContent}
      </a>

      <header className={cx("sticky top-0 z-40 border-b backdrop-blur-xl", themeStyle.header)}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="#main-content"
            className={cx("w-fit rounded-full text-sm font-semibold tracking-wide outline-none", themeStyle.ring)}
          >
            {content.profile.name}
          </a>

          <nav aria-label="Primary navigation" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={cx("rounded-full px-2 py-1 opacity-80 outline-none transition hover:opacity-100", themeStyle.ring)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap gap-3">
            <ControlGroup label={copy.controls.languageLabel}>
              {content.languages.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  aria-pressed={language === option.code}
                  aria-label={`${copy.controls.languageLabel}: ${localize(option.label, language)}`}
                  onClick={() => setLanguage(option.code)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-xs font-bold outline-none transition",
                    themeStyle.ring,
                    language === option.code ? themeStyle.selectorActive : themeStyle.selectorInactive
                  )}
                >
                  {option.shortLabel}
                </button>
              ))}
            </ControlGroup>

            <ControlGroup label={copy.controls.themeLabel}>
              <button
                type="button"
                aria-label={`${copy.controls.themeLabel}: ${localize(nextThemeOption.label, language)}`}
                onClick={() => setTheme(nextThemeOption.key)}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-xs font-bold outline-none transition",
                  themeStyle.ring,
                  themeStyle.selectorInactive
                )}
              >
                {localize(nextThemeOption.label, language)}
              </button>
            </ControlGroup>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative overflow-hidden">
        <Hero content={content} language={language} theme={themeStyle} />
        <About copy={copy.sections.about} theme={themeStyle} />
        <Experience content={content} copy={copy.sections.experience} language={language} theme={themeStyle} />
        <Skills content={content} copy={copy.sections.skills} language={language} theme={themeStyle} />
        <Projects content={content} copy={copy.sections.projects} language={language} theme={themeStyle} />
        <Education content={content} copy={copy.sections.education} language={language} theme={themeStyle} />
        <Contact content={content} copy={copy.sections.contact} theme={themeStyle} />
      </main>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">{label}</legend>
      {children}
    </fieldset>
  );
}

function Hero({
  content,
  language,
  theme
}: {
  content: PortfolioContent;
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  const copy = content.locales[language];
  const [isHeroCardFlipped, setIsHeroCardFlipped] = useState(false);
  const heroCardButtonLabel = isHeroCardFlipped ? copy.hero.flipToFrontLabel : copy.hero.flipToBackLabel;

  return (
    <section className={theme.heroSection} aria-labelledby="hero-title">
      {theme.heroGradient ? (
        <div className={cx("absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-to-br blur-3xl", theme.heroGradient)} />
      ) : null}
      <div className={theme.heroGrid}>
        <div>
          <p className={cx("text-sm font-bold uppercase tracking-[0.4em]", theme.accent)}>{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className={theme.heroTitle}>
            {copy.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 opacity-85 sm:text-xl">{copy.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className={cx(
                "rounded-full px-5 py-3 text-sm font-bold outline-none transition",
                theme.primaryButton,
                theme.ring
              )}
            >
              {copy.hero.primaryCta}
            </a>
            <a
              href="#experience"
              className={cx(
                "rounded-full border px-5 py-3 text-sm font-bold outline-none transition",
                theme.secondaryButton,
                theme.ring
              )}
            >
              {copy.hero.secondaryCta}
            </a>
          </div>

          <ExportActions copy={copy.exports} language={language} theme={theme} />

          <p className="mt-6 text-sm leading-6 opacity-70">{copy.hero.availability}</p>
        </div>

        <aside className={cx(theme.heroAside, theme.card)} aria-label="Portfolio highlights">
          <div className="flex justify-end">
            <button
              type="button"
              aria-pressed={isHeroCardFlipped}
              onClick={() => setIsHeroCardFlipped((current) => !current)}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-bold outline-none transition",
                theme.ring,
                theme.selectorInactive
              )}
            >
              {heroCardButtonLabel}
            </button>
          </div>

          {isHeroCardFlipped ? (
            <div className="mt-5">
              <p className="text-sm font-semibold opacity-70">{localize(content.profile.title, language)}</p>
              <p className="mt-2 text-3xl font-black">{content.profile.name}</p>
              <p className="mt-5 max-h-[34rem] overflow-y-auto pr-1 text-sm leading-7 opacity-85">
                {copy.hero.cardBack}
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-sm font-semibold opacity-70">{localize(content.profile.title, language)}</p>
                <p className="mt-2 text-3xl font-black">{content.profile.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {copy.hero.focusAreas.map((area) => (
                  <span key={area} className={cx("rounded-full border px-3 py-1 text-sm font-medium", theme.chip)}>
                    {area}
                  </span>
                ))}
              </div>
              <div className="grid gap-3">
                {copy.stats.map((stat) => (
                  <article key={stat.label} className={cx("rounded-3xl border p-4", theme.cardMuted)}>
                    <p className={cx("text-3xl font-black", theme.accent)}>{stat.value}</p>
                    <h2 className="mt-1 font-bold">{stat.label}</h2>
                    <p className="mt-1 text-sm leading-6 opacity-75">{stat.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ExportActions({
  copy,
  language,
  theme
}: {
  copy: PortfolioContent["locales"][LanguageCode]["exports"];
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  const cvExports = getCvPdfExports(language);

  return (
    <div className="no-print mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <details>
        <summary className={cx("cursor-pointer rounded-full px-4 py-2 text-sm font-bold outline-none transition", theme.primaryButton, theme.ring)}>
          {copy.downloadsLabel}
        </summary>
        <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={cvExports.modern.href}
          download={cvExports.modern.fileName}
          className={cx("rounded-full border px-4 py-2 text-sm font-bold outline-none transition", theme.secondaryButton, theme.ring)}
        >
          {copy.modernPdfLabel}
        </a>
        <a
          href={cvExports.ats.href}
          download={cvExports.ats.fileName}
          className={cx("rounded-full border px-4 py-2 text-sm font-bold outline-none transition", theme.secondaryButton, theme.ring)}
        >
          {copy.atsPdfLabel}
        </a>
        </div>
      </details>
      <p className="mt-3 text-sm leading-6 opacity-75">
        {copy.pdfHint}
      </p>
    </div>
  );
}

function About({
  copy,
  theme
}: {
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["about"];
  theme: ThemeStyle;
}) {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="about" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {copy.details.map((paragraph) => (
            <p key={paragraph} className={cx("rounded-3xl border p-6 text-base leading-8 opacity-85", theme.cardMuted)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({
  content,
  copy,
  language,
  theme
}: {
  content: PortfolioContent;
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["experience"];
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  const experienceGroups = groupExperience(content.experience);

  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="experience" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <ol className="mt-10 space-y-5">
          {experienceGroups.map((group) => (
            <ExperienceGroupCard key={`${group.company}-${group.items[0].period.en}`} group={group} language={language} theme={theme} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ExperienceGroupCard({
  group,
  language,
  theme
}: {
  group: ExperienceGroup;
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  const isGrouped = group.grouped && group.items.length > 1;
  const [isFlipped, setIsFlipped] = useState(false);
  const labels = experienceFlipLabels[language];
  const flipLabel = isFlipped ? labels.showHighlights : labels.showDetails;

  return (
    <li className={cx("relative rounded-[1.75rem] border p-6", theme.card)}>
      <div className="min-h-8 pr-48">
        {isGrouped ? <h3 className="text-2xl font-black">{group.company}</h3> : <h3 className="sr-only">{group.company}</h3>}
        <button
          type="button"
          aria-pressed={isFlipped}
          aria-label={`${flipLabel}: ${group.company}`}
          onClick={() => setIsFlipped((current) => !current)}
          className={cx(
            "absolute right-6 top-6 rounded-full border px-3 py-1.5 text-xs font-bold outline-none transition",
            theme.ring,
            theme.selectorInactive
          )}
        >
          {flipLabel}
        </button>
      </div>

      {isFlipped ? (
        <div className={cx("mt-5", isGrouped && "space-y-6")}>
          {group.items.map((item) => (
            <article key={`${item.company}-${item.role}-${item.period.en}-reference`} className={cx("rounded-3xl border p-4", theme.cardMuted)}>
              <p className={cx("text-sm font-bold uppercase tracking-[0.25em]", theme.accent)}>
                {localize(item.period, language)}
              </p>
              <h4 className="mt-2 text-xl font-black">{item.role}</h4>
              {isGrouped ? null : <p className="mt-1 font-semibold opacity-80">{item.company}</p>}
              <div className="mt-4 grid gap-3 text-sm leading-7 opacity-85">
                {localize(item.highlights as LocalizedList, language).map((highlight) => (
                  <p key={highlight}>{highlight}</p>
                ))}
              </div>
              <dl className="mt-5 grid gap-1 text-sm">
                <dt className={cx("font-bold", theme.accent)}>{labels.reference}</dt>
                <dd className="font-semibold">{item.reference.name}</dd>
                <dd className="opacity-80">{item.reference.role}</dd>
                <dd className="opacity-80">
                  <span className="font-semibold">{labels.phone}: </span>
                  {item.reference.phone}
                </dd>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <div className={cx(isGrouped && "mt-5 space-y-6", !isGrouped && "mt-5")}>
          {group.items.map((item) => (
            <article key={`${item.company}-${item.role}-${item.period.en}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={cx("h-3 w-3 rounded-full", theme.timelineDot)} aria-hidden="true" />
                    <p className={cx("text-sm font-bold uppercase tracking-[0.25em]", theme.accent)}>
                      {localize(item.period, language)}
                    </p>
                  </div>
                  <h4 className="mt-3 text-2xl font-black">{item.role}</h4>
                  {isGrouped ? null : <p className="mt-1 font-semibold opacity-80">{item.company}</p>}
                </div>
                <div className="flex max-w-xl flex-wrap gap-2 lg:justify-end">
                  {item.tech.map((tech) => (
                    <span key={tech} className={cx("rounded-full border px-3 py-1 text-xs font-semibold", theme.chip)}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-7 opacity-85">
                {localize(item.highlights as LocalizedList, language).map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className={cx("mt-3 h-1.5 w-1.5 flex-none rounded-full", theme.timelineDot)} aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </li>
  );
}

function Skills({
  content,
  copy,
  language,
  theme
}: {
  content: PortfolioContent;
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["skills"];
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="skills" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.skills.map((group) => (
            <article key={group.name.en} className={cx("rounded-[1.75rem] border p-6", theme.cardMuted)}>
              <h3 className="text-xl font-black">{localize(group.name, language)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className={cx("rounded-full border px-3 py-1 text-sm font-medium", theme.chip)}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({
  content,
  copy,
  language,
  theme
}: {
  content: PortfolioContent;
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["projects"];
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="projects" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {content.projects.map((project) => {
            const sourceLink = "sourceLink" in project && typeof project.sourceLink === "string" ? project.sourceLink : undefined;

            return (
            <article key={project.name} className={cx("rounded-[1.75rem] border p-6", theme.card)}>
              <p className={cx("text-sm font-bold", theme.accent)}>{localize(project.context, language)}</p>
              <h3 className="mt-2 text-2xl font-black">{project.name}</h3>
              <p className="mt-4 text-sm leading-7 opacity-85">{localize(project.description, language)}</p>
              {project.link || sourceLink ? (
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className={cx("inline-flex rounded-full text-sm font-bold underline-offset-4 outline-none hover:underline", theme.accent, theme.ring)}
                    >
                      {sourceLink ? copy.demoLinkLabel : copy.linkLabel}
                    </a>
                  ) : null}
                  {sourceLink ? (
                    <a
                      href={sourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className={cx("inline-flex rounded-full text-sm font-bold underline-offset-4 outline-none hover:underline", theme.accent, theme.ring)}
                    >
                      {copy.sourceLinkLabel}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Education({
  content,
  copy,
  language,
  theme
}: {
  content: PortfolioContent;
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["education"];
  language: LanguageCode;
  theme: ThemeStyle;
}) {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="education" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {content.education.map((item) => (
            <article key={`${item.institution}-${localize(item.name, language)}`} className={cx("rounded-[1.75rem] border p-6", theme.cardMuted)}>
              <p className={cx("text-sm font-bold", theme.accent)}>{localize(item.period, language)}</p>
              <h3 className="mt-2 text-xl font-black">{localize(item.name, language)}</h3>
              <p className="mt-1 font-semibold opacity-80">{item.institution}</p>
              <p className="mt-4 text-sm leading-7 opacity-85">{localize(item.details, language)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({
  content,
  copy,
  theme
}: {
  content: PortfolioContent;
  copy: PortfolioContent["locales"][LanguageCode]["sections"]["contact"];
  theme: ThemeStyle;
}) {
  const contactOptions = [
    {
      label: copy.whatsappLabel,
      description: copy.whatsappDescription,
      href: content.profile.whatsapp,
      external: true,
      style: theme.primaryButton
    },
    {
      label: copy.emailLabel,
      description: copy.emailDescription,
      href: `mailto:${content.profile.email}`,
      external: false,
      style: theme.secondaryButton
    },
    {
      label: copy.linkedinLabel,
      description: copy.linkedinDescription,
      href: content.profile.linkedin,
      external: true,
      style: theme.secondaryButton
    },
    {
      label: copy.githubLabel,
      description: copy.githubDescription,
      href: content.profile.github,
      external: true,
      style: theme.secondaryButton
    }
  ] as const;

  return (
    <footer id="contact" aria-labelledby="contact-title" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10">
      <div className={cx("mx-auto max-w-7xl rounded-[2rem] border p-8 sm:p-10", theme.card)}>
        <SectionHeading id="contact" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} theme={theme} />
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {contactOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noreferrer" : undefined}
              className={cx("rounded-[1.25rem] border px-5 py-4 outline-none transition", option.style, theme.ring)}
            >
              <span className="block text-sm font-black">{option.label}</span>
              <span className="mt-1 block text-xs font-medium opacity-75">{option.description}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
