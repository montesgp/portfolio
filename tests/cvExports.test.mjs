import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent } from "../src/content/portfolio.ts";
import { cvPdfExports, cvPdfExportLanguages, cvPdfVariants, getCvPdfExports } from "../src/utils/cvExports.ts";

function extractPdfText(pdf) {
  return [...pdf.toString("latin1").matchAll(/<([0-9A-Fa-f]+)>/g)]
    .map((match) => Buffer.from(match[1], "hex").toString("latin1"))
    .join("")
    .replace(/\x97/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function textBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`);
  const endIndex = text.indexOf(end, startIndex + start.length);

  return endIndex === -1 ? text.slice(startIndex) : text.slice(startIndex, endIndex);
}

function textThrough(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`);
  const endIndex = text.indexOf(end, startIndex + start.length);

  return endIndex === -1 ? text.slice(startIndex) : text.slice(startIndex, endIndex + end.length);
}

test("CV exports expose downloadable Modern and ATS PDF assets", async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  assert.deepEqual([...cvPdfVariants], ["modern", "ats"]);

  assert.deepEqual(getCvPdfExports("en").modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern-en.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern-en.pdf`
  });
  assert.deepEqual(getCvPdfExports("en").ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats-en.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats-en.pdf`
  });

  for (const variant of cvPdfVariants) {
    const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports("en")[variant].fileName}`, import.meta.url));

    assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
    assert.ok(pdf.byteLength > 1_000, `${variant} PDF should contain generated CV content`);
  }
});

test("CV exports do not use legacy unsuffixed English PDF assets", () => {
  for (const variant of cvPdfVariants) {
    const exportItem = getCvPdfExports("en")[variant];

    assert.match(exportItem.fileName, /-en\.pdf$/);
    assert.match(exportItem.href, /-en\.pdf$/);
    assert.notEqual(exportItem.fileName, `patricio-montes-cv-${variant}.pdf`);
    assert.doesNotMatch(exportItem.href, new RegExp(`/downloads/patricio-montes-cv-${variant}\\.pdf$`));
  }
});

test("generated Modern and ATS PDFs include localized Receipt Risk Detector content and clickable links", async () => {
  const receiptRiskDetector = portfolioContent.projects.find((project) => project.name === "Receipt Risk Detector");
  assert.ok(receiptRiskDetector, "missing Receipt Risk Detector project content");

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const rawPdf = pdf.toString("latin1");
      const pdfText = extractPdfText(pdf);

      assert.match(pdfText, /Receipt Risk Detector/);
      assert.match(pdfText, new RegExp(receiptRiskDetector.context[language].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(pdfText, new RegExp(receiptRiskDetector.description[language].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(pdfText, /https:\/\/receipt-risk-detector-web-production\.up\.railway\.app\//);
      assert.match(pdfText, /https:\/\/github\.com\/montesgp\/receipt-risk-detector/);
      assert.match(rawPdf, /\/URI \(https:\/\/receipt-risk-detector-web-production\.up\.railway\.app\//);
      assert.match(rawPdf, /\/URI \(https:\/\/github\.com\/montesgp\/receipt-risk-detector\)/);

      if (language === "en") {
        assert.match(pdfText, /Demo: https:\/\/receipt-risk-detector-web-production\.up\.railway\.app\//);
        assert.match(pdfText, /Source code: https:\/\/github\.com\/montesgp\/receipt-risk-detector/);
      } else {
        assert.match(pdfText, /Demo: https:\/\/receipt-risk-detector-web-production\.up\.railway\.app\//);
        assert.match(pdfText, /Código fuente: https:\/\/github\.com\/montesgp\/receipt-risk-detector/);
      }
    }
  }
});

test("CV exports resolve localized downloadable assets by active language", async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  assert.deepEqual([...cvPdfExportLanguages], ["en", "es"]);

  assert.deepEqual(getCvPdfExports("en"), cvPdfExports.en);
  assert.deepEqual(getCvPdfExports("es").modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern-es.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern-es.pdf`
  });
  assert.deepEqual(getCvPdfExports("es").ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats-es.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats-es.pdf`
  });
  assert.equal("pt" in cvPdfExports, false);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));

      assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
      assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
      assert.ok(pdf.byteLength > 1_000, `${language} ${variant} PDF should contain generated CV content`);
    }
  }
});

test("CV export assets are EN/ES only with no Portuguese PDFs remaining", async () => {

  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");
  assert.ok(databases?.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms?.items.includes("Redis"), false);
  assert.ok(platforms?.items.includes("AWS Rekognition"));
  assert.equal(siegwerk?.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(utnRosario?.context.en, "UTN FRRO — March 2012 to December 2012");

  const files = (await readdir(new URL("../public/downloads/", import.meta.url))).filter((file) =>
    /^patricio-montes-cv-(modern|ats)-.+\.pdf$/.test(file)
  );

  assert.deepEqual(files.sort(), [
    "patricio-montes-cv-ats-en.pdf",
    "patricio-montes-cv-ats-es.pdf",
    "patricio-montes-cv-modern-en.pdf",
    "patricio-montes-cv-modern-es.pdf"
  ]);
  assert.equal(files.some((file) => /-pt\.pdf$/i.test(file)), false);
});

test("generated PDF assets keep public contact privacy constraints", async () => {
  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdfText = (
        await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url))
      ).toString("latin1");

      assert.doesNotMatch(pdfText, /\bPhone\b/i);
      assert.doesNotMatch(pdfText, /\+54\s+9\s+11/i);
      assert.doesNotMatch(pdfText, /4051\s+8040/);
    }
  }
});

test("generated PDF summaries mirror the concise page summary", async () => {
  for (const language of languageCodes) {
    const expectedSummary = portfolioContent.locales[language].hero.subtitle;

    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.match(pdfText, new RegExp(expectedSummary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      if (language === "en") {
        assert.match(pdfText, /Software Engineer with 10\+/);
        assert.match(pdfText, /Software Engineer/);
        assert.doesNotMatch(pdfText, /Software Developer with 10\+/i);
        assert.doesNotMatch(pdfText, /automation/i);
      }
      if (language === "es") {
        assert.match(pdfText, /Ingeniero de Software 10\+/);
        assert.match(pdfText, /Ingeniero de Software/);
        assert.doesNotMatch(pdfText, /Desarrollador de Software con 10\+/i);
        assert.doesNotMatch(pdfText, /automatización/i);
      }
    }
  }
});

test("generated PDF CVs mirror corrected page data", async () => {
  const genericMaterialFramework = ["Material", "Design"].join(" ");
  const forbiddenTools = [
    ["Post", "man"].join(""),
    ["Soap", "UI"].join(""),
    ["Obsid", "ian"].join("")
  ];
  const legacyUnitTestTool = ["J", "Unit"].join("");
  const pageText = JSON.stringify(portfolioContent);
  const frameworks = portfolioContent.skills.find((group) => group.name.en === "Frameworks");
  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");
  const unxItems = portfolioContent.experience.filter((item) => item.company === "UNX Digital / Grupo Prominente");
  const codeicusItems = portfolioContent.experience.filter((item) => item.company === "Codeicus");
  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");

  assert.deepEqual([...languageCodes], ["en", "es"]);
  assert.deepEqual([...cvPdfExportLanguages], ["en", "es"]);
  assert.ok(frameworks?.items.includes("Angular Material"), "Frameworks must include Angular Material");
  for (const framework of ["Next.js", "React", "Vue"]) {
    assert.ok(frameworks?.items.includes(framework), `Frameworks must include ${framework}`);
  }
  assert.equal(frameworks?.items.includes(genericMaterialFramework), false);
  assert.ok(sideas?.tech.includes("Angular Material"), "Sideas tech must keep Angular Material");
  assert.doesNotMatch(pageText, /\bPortuguese\b|\bPortugués\b|\bPortuguês\b|\bPT\b|\bpt\b/);
  assert.match(pageText, /Whimsical/);
  assert.match(pageText, /JSF/);
  assert.doesNotMatch(pageText, /Ionic/);
  assert.match(pageText, /DDD/);
  assert.match(pageText, /Gradle/);
  assert.match(pageText, /SonarQube/);
  assert.match(pageText, /\bxUnit\b/);
  assert.match(pageText, /\bDocker\b/);
  assert.doesNotMatch(pageText, new RegExp(`\\b${legacyUnitTestTool}\\b`, "i"));
  for (const forbiddenTool of forbiddenTools) {
    assert.doesNotMatch(pageText, new RegExp(`\\b${forbiddenTool}\\b`, "i"));
  }
  assert.match(pageText, /supermarket shelf survey app/i);
  assert.match(pageText, /WCF communication module/i);
  assert.match(pageText, /Codeicus/);
  assert.match(pageText, /Luxsys S\.R\.L/);
  assert.doesNotMatch(pageText, /ECIC Systems|Technical Support|Web Designer|Luxsys S\.R\.L \/ Freelance/);
  assert.deepEqual(
    unxItems.map((item) => `${item.role} | ${item.period.en}`),
    ["Sr Software Developer | September 2021 — April 2022", "Software Architect | April 2022 — November 2022"]
  );
  assert.equal(unxItems.some((item) => item.role === "Ssr .Net Developer"), false);
  assert.deepEqual(
    codeicusItems.map((item) => `${item.role} | ${item.period.en}`),
    ["Ssr .Net Developer | October 2019 — September 2021", "Sr Software Developer | December 2020 — September 2021"]
  );
  assert.deepEqual(
    luxsysItems.map((item) => `${item.role} | ${item.period.en}`),
    ["IT Developer | October 2016 — December 2018", "Technical Leader | December 2018 — October 2019"]
  );


  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");
  assert.ok(databases?.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms?.items.includes("Redis"), false);
  assert.ok(platforms?.items.includes("AWS Rekognition"));
  assert.equal(siegwerk?.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(utnRosario?.context.en, "UTN FRRO — March 2012 to December 2012");

  const files = (await readdir(new URL("../public/downloads/", import.meta.url))).filter((file) =>
    /^patricio-montes-cv-(modern|ats)-.+\.pdf$/.test(file)
  );
  assert.equal(files.some((file) => /-pt\.pdf$/i.test(file)), false);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.doesNotMatch(pdfText, /\bPortuguese\b|\bPortugués\b|\bPortuguês\b|\bPT\b|\bpt\b/);
      assert.match(pdfText, /Whimsical/);
      assert.match(pdfText, /JSF/);
      assert.doesNotMatch(pdfText, new RegExp(genericMaterialFramework));
      assert.match(pdfText, /Frameworks: [^\n]*Angular Material/);
      assert.match(pdfText, /Frameworks: [^\n]*Next\.js, React, Vue/);
      assert.match(pdfText, /Sideas[\s\S]*Angular Material/);
      assert.match(pdfText, /Codeicus/);
      assert.match(pdfText, /Luxsys S\.R\.L/);
      assert.doesNotMatch(pdfText, /ECIC Systems|Technical Support|Web Designer|Luxsys S\.R\.L \/ Freelance/);
      assert.doesNotMatch(pdfText, /March 2020 — December 2020|Marzo 2020 — Diciembre 2020/);
      const skillStart = language === "en" ? (variant === "modern" ? "CORE SKILLS" : "SKILLS") : (variant === "modern" ? "HABILIDADES PRINCIPALES" : "HABILIDADES");
      const experienceStart = language === "en" ? (variant === "modern" ? "EXPERIENCE" : "PROFESSIONAL EXPERIENCE") : (variant === "modern" ? "EXPERIENCIA" : "EXPERIENCIA PROFESIONAL");
      const skillsText = textBetween(
        pdfText,
        skillStart,
        experienceStart
      );
      assert.doesNotMatch(skillsText, /Platforms: [\s\S]*Redis|Plataformas: [\s\S]*Redis/);
      assert.match(skillsText, /Databases: [\s\S]*Redis|Bases de datos: [\s\S]*Redis/);
      assert.match(pdfText, /Siegwerk São Paulo implementation \| Luxsys S\.R\.L — June 2018|Siegwerk São Paulo implementation \| Luxsys S\.R\.L — Junio 2018/);
      assert.match(pdfText, /UTN FRRO research project \| UTN FRRO — March 2012 to December 2012|UTN FRRO research project \| UTN FRRO — Marzo 2012 a Diciembre 2012/);
      const unxText = textBetween(pdfText, "UNX Digital / Grupo Prominente", "Codeicus");
      const codeicusText = textBetween(pdfText, "Codeicus", "Luxsys S.R.L");
      const luxsysText = textBetween(pdfText, "Luxsys S.R.L", variant === "modern" ? "SELECTED PROJECTS" : "PROJECTS");

      assert.doesNotMatch(unxText, /Ssr \.Net Developer/);
      assert.doesNotMatch(pdfText, /Sr Software Architect/);
      assert.match(unxText, /Software Architect[\s\S]*Sr Software Developer/, "UNX PDF group must show final role before earlier role");
      assert.match(codeicusText, /Sr Software Developer[\s\S]*Ssr \.Net Developer/, "Codeicus PDF group must show final role before earlier role");
      assert.match(luxsysText, /Technical Leader[\s\S]*IT Developer/, "Luxsys PDF group must show final role before earlier role");
      assert.match(pdfText, /Sr Software Developer/);
      assert.match(pdfText, /Technical Leader/);
      assert.match(pdfText, /IT Developer/);
      assert.doesNotMatch(pdfText, /Ionic/);
      assert.match(pdfText, /DDD/);
      assert.match(pdfText, /Gradle/);
      assert.match(pdfText, /SonarQube/);
      assert.match(pdfText, /\bxUnit\b/);
      assert.match(skillsText, /Platforms: [\s\S]*AWS Rekognition|Plataformas: [\s\S]*AWS Rekognition/);
      assert.match(skillsText, /Platforms: [\s\S]*Docker|Plataformas: [\s\S]*Docker/);
      assert.match(pdfText, /https:\/\/github\.com\/montesgp/);
      assert.doesNotMatch(pdfText, /automation|automatización/i);
      assert.doesNotMatch(pdfText, new RegExp(`\\b${legacyUnitTestTool}\\b`, "i"));
      for (const forbiddenTool of forbiddenTools) {
        assert.doesNotMatch(pdfText, new RegExp(`\\b${forbiddenTool}\\b`, "i"));
      }
      assert.match(pdfText, /supermarket shelf survey app|app de relevamiento de góndolas/i);
      assert.match(pdfText, /WCF communication module|módulo de comunicación WCF/i);
      if (language === "en") {
        assert.match(pdfText, /router for balanced LLM distribution/);
      } else {
        assert.match(pdfText, /router para distribución balanceada de LLMs/);
      }
    }
  }
});

test("generated Modern and ATS PDFs include references for every public experience", async () => {
  for (const item of portfolioContent.experience) {
    assert.ok(item.reference, `${item.company} ${item.role} is missing a reference person`);
    assert.match(item.reference.name.trim(), /\S/, `${item.company} ${item.role} reference name cannot be blank`);
    assert.match(item.reference.role.trim(), /\S/, `${item.company} ${item.role} reference role/title cannot be blank`);
    assert.match(item.reference.phone.trim(), /\d/, `${item.company} ${item.role} reference phone must include digits`);
  }

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      for (const item of portfolioContent.experience) {
        const experienceText = textThrough(pdfText, item.company, item.reference.phone);

        assert.match(experienceText, new RegExp(item.role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
        assert.match(experienceText, new RegExp(item.reference.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
        assert.match(experienceText, new RegExp(item.reference.role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
        assert.match(experienceText, new RegExp(item.reference.phone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      }
    }
  }
});

test("generated Modern and ATS PDFs preserve the requested Luxsys role-specific technologies", async () => {
  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");
  const itDeveloper = luxsysItems.find((item) => item.role === "IT Developer");
  const technicalLeader = luxsysItems.find((item) => item.role === "Technical Leader");

  assert.equal(luxsysItems.length, 2);
  assert.ok(itDeveloper);
  assert.ok(technicalLeader);
  assert.deepEqual(itDeveloper.tech, ["BPM", "REST APIs", "SQL Server", "Softland", ".NET C#", ".NET Framework 4.5"]);
  assert.deepEqual(technicalLeader.tech, ["BPM", "Technical leadership", "Estimation", "Project follow-up", "C#"]);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);
      const luxsysText = textBetween(pdfText, "Luxsys S.R.L", variant === "modern" ? "SELECTED PROJECTS" : "PROJECTS");

      for (const role of ["Technical Leader", "IT Developer"]) {
        const roleText = textBetween(luxsysText, role, role === "Technical Leader" ? "IT Developer" : "SELECTED PROJECTS");

        if (role === "IT Developer") {
          assert.match(roleText, /SQL Server/);
          assert.match(roleText, /\.NET C#/);
          assert.match(roleText, /\.NET Framework 4\.5/);
          assert.doesNotMatch(roleText, /Technologies: [^\n]*Bejerman|Tecnologías: [^\n]*Bejerman/);
          continue;
        }

        assert.match(roleText, /C#/);
        assert.doesNotMatch(roleText, /\.NET Framework 4\.5/);
      }
    }
  }
});

test("web content and generated CVs use Microsoft Azure terminology", async () => {
  const urbetrack = portfolioContent.experience.find((item) => item.company === "Urbetrack");
  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  const webContent = JSON.stringify(portfolioContent);

  assert.ok(urbetrack?.tech.includes("Microsoft Azure"));
  assert.ok(sideas?.tech.includes("Microsoft Azure"));
  assert.equal(sideas?.tech.includes("Azure"), false);
  assert.ok(platforms?.items.includes("Microsoft Azure"));
  assert.doesNotMatch(webContent, /Azure Platform/);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.match(pdfText, /Microsoft Azure/);
      assert.doesNotMatch(pdfText, /Azure Platform/);
    }
  }
});

test("generated CVs include CI/CD for Urbetrack, Sideas, and Codeicus roles", async () => {
  const companies = ["Urbetrack", "Sideas", "Codeicus"];

  for (const company of companies) {
    const roles = portfolioContent.experience.filter((item) => item.company === company);
    assert.ok(roles.length > 0, `${company} roles must be present`);
    assert.ok(roles.every((item) => item.tech.includes("CI/CD")), `${company} roles must include CI/CD`);
  }

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      for (const company of companies) {
        assert.match(pdfText, new RegExp(`${company}[\\s\\S]*CI/CD`));
      }
    }
  }
});

test("root standard local PDF includes references and updated Luxsys technologies", async () => {
  const pdf = await readFile(new URL("../CV-Montes-Patricio-Reducido.pdf", import.meta.url));
  const pdfText = extractPdfText(pdf);

  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.match(pdf.toString("latin1"), /%%EOF\s*$/);

  for (const expectedText of [
    "Enrique Candia",
    "Mariano Filipoff",
    "Adrian Gonzales",
    "Ricardo Ángel Siciliano",
    "Emanuel Gutierrez",
    "(011) 6244-0404",
    "(011) 6533-1716",
    "(351) 304-7426",
    "(221) 314-3602",
    "(011) 3684-2464"
  ]) {
    assert.match(pdfText, new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(pdfText, /Luxsys S\.R\.L/);

  const technicalLeaderText = textBetween(pdfText, "Technical Leader", "IT Developer");
  const itDeveloperText = textBetween(pdfText, "IT Developer", "PROJECTS");

  assert.match(technicalLeaderText, /C#/);
  assert.doesNotMatch(technicalLeaderText, /\.NET Framework 4\.5/);
  assert.match(itDeveloperText, /SQL Server/);
  assert.match(itDeveloperText, /\.NET C#/);
  assert.match(itDeveloperText, /\.NET Framework 4\.5/);
  assert.doesNotMatch(itDeveloperText, /Tecnologías: [^\n]*Bejerman/);
});
