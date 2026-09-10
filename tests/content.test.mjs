import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent, themeKeys } from "../src/content/portfolio.ts";
import { cvPdfExportLanguages } from "../src/utils/cvExports.ts";

test("portfolio exposes the required language and theme options", () => {
  assert.deepEqual([...languageCodes], ["en", "es"]);
  assert.deepEqual([...cvPdfExportLanguages], [...languageCodes]);
  assert.deepEqual([...themeKeys], ["editorial", "vercel"]);

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code], `missing locale ${code}`);
    assert.ok(
      portfolioContent.languages.some((language) => language.code === code),
      `missing language selector option ${code}`
    );
  }

  assert.ok(portfolioContent.themes.some((theme) => theme.key === "editorial" && theme.label.en === "Editorial" && theme.label.es === "Editorial"));
  assert.ok(portfolioContent.themes.some((theme) => theme.key === "vercel" && theme.label.en === "Vercel" && theme.label.es === "Vercel"));
  assert.equal(portfolioContent.themes.length, 2);
  assert.equal(portfolioContent.languages.length, 2);
});

test("portfolio shell defaults to Spanish language and Vercel theme", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.match(shell, /useState<LanguageCode>\("es"\)/);
  assert.match(shell, /useState<ThemeKey>\("vercel"\)/);
  assert.match(shell, /vercel:/);
  assert.match(shell, /heroGrid:/);
  assert.match(shell, /heroTitle:/);
  assert.match(shell, /theme\.heroGradient \? \(/);
  assert.match(shell, /bg-\[#fafafa\]/);
  assert.match(shell, /shadow-\[0_0_0_1px_rgba\(0,0,0,0\.08\)\]/);
  assert.match(shell, /focus-visible:shadow-\[0_0_0_2px_#fff,0_0_0_4px_#0072f5\]/);
  assert.match(shell, /absolute right-6 top-6/);
  assert.match(shell, /min-h-8 pr-48/);
});

test("verified identity and contact facts are present without private CV data", () => {
  assert.equal(portfolioContent.profile.name, "Patricio Montes Güemez");
  assert.deepEqual(portfolioContent.profile.title, {
    en: "Software Engineer",
    es: "Ingeniero de Software"
  });
  assert.equal(portfolioContent.profile.email, "montesgpatricio@gmail.com");
  assert.equal(portfolioContent.profile.whatsapp, "https://wa.me/5491140518040");
  assert.equal(
    portfolioContent.profile.linkedin,
    "https://www.linkedin.com/in/patricio-montes-88212448/"
  );
  assert.deepEqual(Object.keys(portfolioContent.profile).sort(), [
    "email",
    "github",
    "linkedin",
    "name",
    "portfolio",
    "title",
    "whatsapp"
  ]);

  const publicText = JSON.stringify({
    profile: portfolioContent.profile,
    contact: Object.fromEntries(languageCodes.map((code) => [code, portfolioContent.locales[code].sections.contact]))
  });
  for (const forbidden of [
    /\bDNI\b/i,
    /\bCUIL\b/i,
    /\bbirth date\b/i,
    /\bhome address\b/i,
    /\bphone\b/i,
    /\+54\s+9\s+11/i,
    /4051\s+8040/
  ]) {
    assert.equal(forbidden.test(publicText), false, `forbidden public pattern found: ${forbidden}`);
  }

  for (const code of languageCodes) {
    const contact = portfolioContent.locales[code].sections.contact;
    assert.match(contact.whatsappLabel, /WhatsApp/i);
    assert.match(contact.emailLabel, /mail|email|correo/i);
    assert.match(contact.linkedinLabel, /LinkedIn/i);
    assert.match(contact.githubLabel, /GitHub/i);
    assert.match(contact.portfolioLabel, /portfolio/i);

    const exportCopy = portfolioContent.locales[code].exports;
    const publicExportText = JSON.stringify(exportCopy);
    assert.match(publicExportText, /Modern PDF|PDF moderno|PDF moderno/i);
    assert.match(publicExportText, /ATS PDF|PDF ATS/i);
    assert.doesNotMatch(publicExportText, /\bprint\b|imprimir|salvar|guardar/i);
    assert.doesNotMatch(publicExportText, /\.xls|excel/i);
  }
});

test("experience timeline keeps verified roles, dates, and localized copy", () => {
  const urbetrack = portfolioContent.experience.find((item) => item.company === "Urbetrack");
  assert.ok(urbetrack);
  assert.equal(urbetrack.role, "Sr .Net Developer");
  assert.equal(urbetrack.period.en, "July 2024 — April 2026");
  assert.ok(urbetrack.tech.includes(".NET"));
  assert.ok(urbetrack.tech.includes("CI/CD"));
  assert.match(urbetrack.highlights.en[1], /router for balanced LLM distribution/);
  assert.match(urbetrack.highlights.es[1], /router para distribución balanceada de LLMs/);

  const architect = portfolioContent.experience.find(
    (item) => item.company === "UNX Digital / Grupo Prominente" && item.role === "Software Architect"
  );
  assert.ok(architect);
  assert.ok(architect.tech.includes("Ocelot"));
  assert.ok(architect.highlights.en.join(" ").includes("OIDC"));

  for (const item of portfolioContent.experience) {
    for (const code of languageCodes) {
      assert.ok(item.period[code], `${item.company} missing ${code} period`);
      assert.ok(item.highlights[code].length > 0, `${item.company} missing ${code} highlights`);
    }
  }
});

test("hero focus chips use the requested professional positioning only", () => {
  for (const code of languageCodes) {
    assert.deepEqual(portfolioContent.locales[code].hero.focusAreas, [
      ".NET",
      "Angular",
      "Google Cloud",
      "Microsoft Azure",
      "Clean Code",
      "Clean Architecture"
    ]);
    assert.equal(portfolioContent.locales[code].hero.focusAreas.includes("AI-First"), false);
    assert.equal(portfolioContent.locales[code].hero.focusAreas.includes("Code review"), false);
  }
});

test("page profile summary is concise, human-directed, and excludes automation", () => {
  const expectedSummaries = {
    en: "Software Engineer with 10+ years creating scalable, maintainable solutions focused on architecture, design, Clean Code, Clean Architecture, DDD, SDD, and TDD. Currently following AI-agent workflows under human technical direction.",
    es: "Ingeniero de Software 10+ años creando soluciones escalables y mantenibles con foco en arquitectura, diseño, Clean Code, Clean Architecture, DDD, SDD, TDD. Respetando actualmente flujos de trabajo con agentes IA bajo dirección técnica humana."
  };

  for (const code of languageCodes) {
    const summary = portfolioContent.locales[code].hero.subtitle;

    assert.equal(summary, expectedSummaries[code]);
    assert.ok(summary.length <= 280, `${code} summary must stay suitable for PDF layout`);
    assert.match(summary, /10\+/);
    assert.match(summary, /architecture|arquitectura/i);
    assert.match(summary, /design|diseño/i);
    assert.match(summary, /Clean Code/);
    assert.match(summary, /Clean Architecture/);
    assert.match(summary, /DDD/);
    assert.match(summary, /SDD/);
    assert.match(summary, /TDD/);
    assert.match(summary, /AI-agent|agentes IA/i);
    assert.match(summary, /human technical|técnica humana/i);
    assert.match(summary, /scalable|escalables/i);
    assert.match(summary, /maintainable|mantenibles/i);
    assert.doesNotMatch(summary, /automation|automatización/i);
  }
});

test("experience ownership and same-company data preserve verified CV facts", () => {
  const codeicusItems = portfolioContent.experience.filter((item) => item.company === "Codeicus");

  assert.equal(codeicusItems.length, 2);
  assert.equal(codeicusItems[0].role, "Ssr .Net Developer");
  assert.equal(codeicusItems[0].period.en, "October 2019 — September 2021");
  assert.equal(codeicusItems[0].period.es, "Octubre 2019 — Septiembre 2021");
  assert.ok(codeicusItems[0].tech.includes("Gradle"));
  assert.ok(codeicusItems[0].tech.includes("Python"));
  assert.ok(codeicusItems[0].tech.includes("SonarQube"));
  assert.match(codeicusItems[0].highlights.en.join(" "), /Java DDD APIs/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /ERP full-stack components/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /Python backup assistant/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /financial app/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /insurance broker/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /Jira, Jenkins, GitLab, and SonarQube/i);
  assert.equal(codeicusItems[1].role, "Sr Software Developer");
  assert.equal(codeicusItems[1].period.en, "December 2020 — September 2021");
  assert.equal(codeicusItems[1].period.es, "Diciembre 2020 — Septiembre 2021");
  assert.ok(codeicusItems[1].tech.includes("Maven"));
  assert.ok(codeicusItems[1].tech.includes("JSF"));
  assert.ok(codeicusItems[1].tech.includes("Whimsical"));
  assert.ok(codeicusItems[1].tech.includes("React Native"));
  assert.ok(codeicusItems[1].tech.includes("C#"));
  assert.equal(codeicusItems[1].tech.includes("Ionic"), false);
  assert.match(codeicusItems[1].highlights.en.join(" "), /credit management web tools/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /construction ERP/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /supermarket shelf survey app/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /WCF communication module/i);

  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");
  assert.equal(luxsysItems.length, 2);
  assert.equal(luxsysItems[0].role, "IT Developer");
  assert.equal(luxsysItems[0].period.en, "October 2016 — December 2018");
  assert.equal(luxsysItems[0].period.es, "Octubre 2016 — Diciembre 2018");
  assert.equal(luxsysItems[1].role, "Technical Leader");
  assert.equal(luxsysItems[1].period.en, "December 2018 — October 2019");
  assert.equal(luxsysItems[1].period.es, "Diciembre 2018 — Octubre 2019");
  assert.equal(
    portfolioContent.experience.some(
      (item) => ["IT Developer", "Technical Leader"].includes(item.role) && item.company !== "Luxsys S.R.L"
    ),
    false,
    "Technical Leader and IT Developer must be owned by Luxsys S.R.L exactly"
  );

  const unxItems = portfolioContent.experience.filter((item) => item.company === "UNX Digital / Grupo Prominente");
  assert.equal(unxItems.length, 2);
  assert.deepEqual(
    unxItems.map((item) => item.role),
    ["Sr Software Developer", "Software Architect"],
    "source data remains chronological; rendering/PDF grouping presents latest role first"
  );
  assert.equal(unxItems[0].period.en, "September 2021 — April 2022");
  assert.equal(unxItems[0].period.es, "Septiembre 2021 — Abril 2022");
  assert.equal(unxItems[1].period.en, "April 2022 — November 2022");
  assert.equal(unxItems[1].period.es, "Abril 2022 — Noviembre 2022");

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [
    /ECIC Systems/,
    /Technical Support/,
    /Web Designer/,
    /Luxsys S\.R\.L \/ Freelance/,
    /March 2020 — December 2020/,
    /Marzo 2020 — Diciembre 2020/,
    /Sr Software Architect/
  ]) {
    assert.doesNotMatch(publicText, forbidden, `forbidden experience content found: ${forbidden}`);
  }
  assert.equal(
    unxItems.some((item) => item.role === "Ssr .Net Developer"),
    false,
    "UNX must not own Ssr .Net Developer"
  );
});

test("each public experience exposes a reference person with role and phone", () => {
  for (const item of portfolioContent.experience) {
    assert.notEqual(item.company, "ECIC Systems", "ECIC must not be added as a public experience");
    assert.ok(item.reference, `${item.company} ${item.role} is missing a reference person`);
    assert.equal(typeof item.reference.name, "string", `${item.company} ${item.role} reference needs a name`);
    assert.equal(typeof item.reference.role, "string", `${item.company} ${item.role} reference needs a role/title`);
    assert.equal(typeof item.reference.phone, "string", `${item.company} ${item.role} reference needs a phone`);
    assert.match(item.reference.name.trim(), /\S/, `${item.company} ${item.role} reference name cannot be blank`);
    assert.match(item.reference.role.trim(), /\S/, `${item.company} ${item.role} reference role/title cannot be blank`);
    assert.match(item.reference.phone.trim(), /\d/, `${item.company} ${item.role} reference phone must include digits`);
  }
});

test("Luxsys role technologies preserve the requested role-specific distinctions", () => {
  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");
  const itDeveloper = luxsysItems.find((item) => item.role === "IT Developer");
  const technicalLeader = luxsysItems.find((item) => item.role === "Technical Leader");

  assert.equal(luxsysItems.length, 2);
  assert.ok(itDeveloper, "missing Luxsys IT Developer role");
  assert.ok(technicalLeader, "missing Luxsys Technical Leader role");

  assert.ok(itDeveloper.tech.includes("SQL Server"));
  assert.ok(itDeveloper.tech.includes(".NET C#"));
  assert.ok(itDeveloper.tech.includes(".NET Framework 4.5"));
  assert.equal(itDeveloper.tech.includes("SQL"), false);
  assert.equal(itDeveloper.tech.includes("C#"), false);
  assert.equal(itDeveloper.tech.includes("Bejerman"), false);
  assert.match(itDeveloper.highlights.en.join(" "), /Bejerman/);
  assert.match(itDeveloper.highlights.es.join(" "), /Bejerman/);

  assert.ok(technicalLeader.tech.includes("C#"));
  assert.equal(technicalLeader.tech.includes(".NET Framework 4.5"), false);
});

test("education avoids unverified graduation or fluency claims", () => {
  const engineering = portfolioContent.education.find((item) =>
    item.institution.includes("Universidad Tecnológica Nacional")
  );
  assert.ok(engineering);
  assert.equal(engineering.period.en, "March 2008 — Present");
  assert.equal(engineering.period.es, "Marzo 2008 — Actualidad");
  assert.equal(engineering.details.en, "");
  assert.equal(engineering.details.es, "");

  const englishTraining = portfolioContent.education.filter((item) =>
    item.name.en.includes("English training")
  );
  assert.equal(englishTraining.length, 1);
  assert.equal(englishTraining[0].institution, "Education First");
  assert.equal(englishTraining[0].details.en, "Level 9/16, basic professional competence.");
  assert.equal(englishTraining[0].details.es, "Nivel 9/16, competencia básica profesional.");
  assert.doesNotMatch(JSON.stringify(portfolioContent), /Listed without adding unverified graduation or current-status claims\.|Se lista sin agregar egreso ni estado actual no verificado\./);
  assert.equal(JSON.stringify(portfolioContent).includes("Open English"), false);
});

test("education cards omit an empty details paragraph", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.match(shell, /\{localize\(item\.details, language\) \? \([\s\S]*<p className="mt-4 text-sm leading-7 opacity-85">\{localize\(item\.details, language\)\}<\/p>[\s\S]*: null\}/);
});

test("added skills and verified public projects are present", () => {
  const genericMaterialFramework = ["Material", "Design"].join(" ");
  const frameworks = portfolioContent.skills.find((group) => group.name.en === "Frameworks");
  assert.ok(frameworks, "missing Frameworks skill group");
  assert.ok(frameworks.items.includes("Angular Material"), "Frameworks must include Angular Material");
  for (const framework of ["Next.js", "React", "Vue"]) {
    assert.ok(frameworks.items.includes(framework), `Frameworks must include ${framework}`);
  }
  assert.equal(frameworks.items.includes(genericMaterialFramework), false, "must not add generic Material framework");

  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");
  assert.ok(sideas, "missing Sideas experience");
  assert.ok(sideas.tech.includes("Angular Material"), "Sideas tech must keep Angular Material");
  assert.ok(sideas.tech.includes("CI/CD"), "Sideas must include CI/CD");

  const codeicusRoles = portfolioContent.experience.filter((item) => item.company === "Codeicus");
  assert.ok(codeicusRoles.every((item) => item.tech.includes("CI/CD")), "Codeicus roles must include CI/CD");

  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  assert.ok(databases, "missing Databases skill group");
  assert.ok(databases.items.includes("Supabase"));
  assert.ok(databases.items.includes("MongoDB"));

  const designAndQa = portfolioContent.skills.find((group) => group.name.en === "Design and QA");
  assert.ok(designAndQa, "missing Design and QA skill group");
  for (const tool of ["Excalidraw", "Figma"]) {
    assert.ok(designAndQa.items.includes(tool), `missing ${tool}`);
  }

  const circuit = portfolioContent.projects.find((project) => project.link === "https://circuitoarredepadel.com/");
  assert.ok(circuit, "missing sports circuit project");
  assert.equal(circuit.name, "Gestión de circuito deportivo");
  assert.match(circuit.description.en, /tournaments/i);
  assert.match(circuit.description.es, /torneos/i);

  const incoders = portfolioContent.projects.find((project) => project.link === "https://www.incoders.com.ar/");
  assert.ok(incoders, "missing Incoders project");
  assert.match(incoders.description.en, /admin panel/i);
  assert.match(incoders.description.en, /financial dashboard/i);
});

test("portfolio content removes forbidden visible tools, replaces unit test wording, and adds Docker", () => {
  const forbiddenTools = [
    ["Post", "man"].join(""),
    ["Soap", "UI"].join(""),
    ["Obsid", "ian"].join("")
  ];
  const legacyUnitTestTool = ["J", "Unit"].join("");
  const publicText = JSON.stringify(portfolioContent);

  for (const forbiddenTool of forbiddenTools) {
    assert.doesNotMatch(publicText, new RegExp(`\\b${forbiddenTool}\\b`, "i"));
  }

  assert.doesNotMatch(publicText, new RegExp(`\\b${legacyUnitTestTool}\\b`, "i"));
  assert.match(publicText, /\bxUnit\b/);

  const designAndQa = portfolioContent.skills.find((group) => group.name.en === "Design and QA");
  assert.ok(designAndQa?.items.includes("xUnit"), "Design and QA must include xUnit");
  for (const forbiddenTool of forbiddenTools) {
    assert.equal(designAndQa?.items.includes(forbiddenTool), false);
  }

  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  assert.ok(platforms?.items.includes("Docker"), "Platforms must include Docker");
  assert.ok(platforms?.items.includes("AWS Rekognition"), "Platforms must include AWS Rekognition");

  const principles = portfolioContent.skills[0];
  assert.deepEqual(principles.items, ["SOLID", "KISS", "Scrum"]);
});

test("contact title copy matches requested bilingual bottom CTA", () => {
  assert.equal(
    portfolioContent.locales.es.sections.contact.title,
    "Hablemos sobre software, tecnología y soluciones preparadas para crecer."
  );
  assert.equal(
    portfolioContent.locales.en.sections.contact.title,
    "Let’s talk about software, technology, and solutions built to grow."
  );
});


test("skills move Redis from Platforms to Databases without duplicates", () => {
  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");

  assert.ok(databases, "missing Databases skill group");
  assert.ok(platforms, "missing Platforms skill group");
  assert.ok(databases.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms.items.includes("Redis"), false, "Platforms must not include Redis");

  const allSkillItems = portfolioContent.skills.flatMap((group) => group.items);
  assert.equal(allSkillItems.filter((item) => item === "Redis").length, 1, "Redis must not be duplicated");
});

test("project contexts use corrected company and institution associations", () => {
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");

  assert.ok(siegwerk);
  assert.equal(siegwerk.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(siegwerk.context.es, "Luxsys S.R.L — Junio 2018");
  assert.ok(utnRosario);
  assert.equal(utnRosario.context.en, "UTN FRRO — March 2012 to December 2012");
  assert.equal(utnRosario.context.es, "UTN FRRO — Marzo 2012 a Diciembre 2012");
});

test("hero card back exposes accessible bilingual professional descriptions", () => {
  assert.match(portfolioContent.locales.es.hero.cardBack, /Más de 10 años de experiencia/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /Clean Code y Clean Architecture/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /Domain-Driven Design/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /agentes de Inteligencia Artificial especializados/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /More than 10 years of experience/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /Clean Code and Clean Architecture/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /Domain-Driven Design/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /specialized Artificial Intelligence agents/);
  for (const code of languageCodes) {
    assert.match(portfolioContent.locales[code].hero.cardBack, /https:\/\/github\.com\/montesgp/);
    assert.doesNotMatch(portfolioContent.locales[code].hero.cardBack, /automation|automatización/i);
  }

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code].hero.flipToBackLabel);
    assert.ok(portfolioContent.locales[code].hero.flipToFrontLabel);
  }
});

test("project dependencies stay clean of heavy PDF and Excel packages", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {})
  ];

  assert.equal(
    dependencyNames.some((name) => /xlsx|exceljs|spreadsheet/i.test(name)),
    false,
    "Excel packages must not be added to package.json"
  );
});


test("website contact intros invite visitors to the GitHub portfolio without entering PDF exports", async () => {
  assert.equal(
    portfolioContent.locales.en.sections.contact.intro,
    "Choose the channel that fits the conversation: WhatsApp for direct coordination, email for detailed context, or LinkedIn for professional networking. You can also explore my work in the GitHub portfolio."
  );
  assert.equal(
    portfolioContent.locales.es.sections.contact.intro,
    "Eleg\u00ed el canal que mejor se ajuste a la conversaci\u00f3n: WhatsApp para coordinaci\u00f3n directa, email para contexto detallado o LinkedIn para contacto profesional. Tambi\u00e9n pod\u00e9s explorar mi trabajo en el portfolio de GitHub."
  );

  const pdfGenerator = await readFile(new URL("../scripts/generate-cv-pdfs.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(pdfGenerator, /sections\.contact\.intro/);
});

test("Receipt Risk Detector is the newest shipped project with localized demo and source links", () => {
  const receiptRiskDetector = portfolioContent.projects.find((project) => project.name === "Receipt Risk Detector");

  assert.ok(receiptRiskDetector, "missing Receipt Risk Detector shipped project");
  assert.equal(portfolioContent.projects[0], receiptRiskDetector, "newest shipped project must lead the visual project list");
  assert.deepEqual(receiptRiskDetector.context, {
    en: "Open-source POC — 2026",
    es: "POC open source — 2026"
  });
  assert.deepEqual(receiptRiskDetector.description, {
    en: "Open-source POC that analyzes images of Argentine bank-transfer receipts and returns an explainable fraud-risk assessment to support manual reconciliation. It combines local OCR, metadata/C2PA inspection, deterministic financial rules, and visual analysis; it does not certify payment or authenticity.",
    es: "POC open source que analiza imágenes de comprobantes de transferencias bancarias argentinas y devuelve una evaluación explicable del riesgo de fraude para apoyar la conciliación manual. Combina OCR local, inspección de metadatos/C2PA, reglas financieras determinísticas y análisis visual; no certifica el pago ni la autenticidad."
  });
  assert.equal(receiptRiskDetector.link, "https://receipt-risk-detector-web-production.up.railway.app/");
  assert.equal(receiptRiskDetector.sourceLink, "https://github.com/montesgp/receipt-risk-detector");

  assert.equal(portfolioContent.locales.en.sections.projects.demoLinkLabel, "Open demo");
  assert.equal(portfolioContent.locales.en.sections.projects.sourceLinkLabel, "View source code");
  assert.equal(portfolioContent.locales.es.sections.projects.demoLinkLabel, "Abrir demo");
  assert.equal(portfolioContent.locales.es.sections.projects.sourceLinkLabel, "Ver código fuente");
});
