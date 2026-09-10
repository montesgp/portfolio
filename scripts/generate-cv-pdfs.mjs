import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import { portfolioContent } from "../src/content/portfolio.ts";
import { cvPdfExportLanguages, getCvPdfExports } from "../src/utils/cvExports.ts";

const rootDirectory = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const outputDirectory = join(rootDirectory, "public", "downloads");
const localStandardPdfPath = join(rootDirectory, "CV-Montes-Patricio-Reducido.pdf");
const obsoletePdfAssets = [
  "patricio-montes-cv-modern.pdf",
  "patricio-montes-cv-ats.pdf",
  "patricio-montes-cv-modern-pt.pdf",
  "patricio-montes-cv-ats-pt.pdf"
];

const sectionLabels = {
  en: {
    coreSkills: "Core skills",
    experience: "Experience",
    selectedProjects: "Selected projects",
    educationTraining: "Education and training",
    professionalSummary: "Professional summary",
    skills: "Skills",
    professionalExperience: "Professional experience",
    projects: "Projects",
    education: "Education",
    technologies: "Technologies",
    reference: "Reference",
    demo: "Demo",
    sourceCode: "Source code"
  },
  es: {
    coreSkills: "Habilidades principales",
    experience: "Experiencia",
    selectedProjects: "Proyectos seleccionados",
    educationTraining: "Educación y formación",
    professionalSummary: "Resumen profesional",
    skills: "Habilidades",
    professionalExperience: "Experiencia profesional",
    projects: "Proyectos",
    education: "Educación",
    technologies: "Tecnologías",
    reference: "Referencia",
    demo: "Demo",
    sourceCode: "Código fuente"
  }
};

const roleChangeCompanies = new Set(["Codeicus", "Luxsys S.R.L", "UNX Digital / Grupo Prominente"]);

function localize(value, language) {
  return value[language];
}

function publicContactLines() {
  return [
    portfolioContent.profile.email,
    `WhatsApp: ${portfolioContent.profile.whatsapp}`,
    portfolioContent.profile.linkedin,
    portfolioContent.profile.github
  ];
}

function addModernPdfContactLines(doc) {
  const [email, whatsapp, linkedin, github] = publicContactLines();

  doc.fontSize(8.5).fillColor("#E2E8F0").text([email, whatsapp, linkedin].join("\n"), 365, 43, {
    width: 180,
    align: "right",
    lineGap: 2
  });
  doc.fontSize(8.5).fillColor("#93C5FD").text(github, 365, 86, {
    width: 180,
    align: "right",
    link: portfolioContent.profile.github,
    underline: true
  });
}

function addAtsPdfContactLines(doc) {
  const [email, whatsapp, linkedin, github] = publicContactLines();

  doc.fontSize(9).text(`${email} | ${whatsapp} | ${linkedin} | `, { width: 500, continued: true });
  doc.fillColor("#0000EE").text(github, {
    link: portfolioContent.profile.github,
    underline: true
  });
  doc.fillColor("#000000");
}

function addSectionTitle(doc, title, color = "#111827") {
  doc.moveDown(1.1).font("Helvetica-Bold").fontSize(13).fillColor(color).text(title.toUpperCase());
  doc.moveDown(0.35).strokeColor("#CBD5E1").lineWidth(0.75).moveTo(doc.x, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.55).fillColor("#111827");
}

function addBullet(doc, text, options = {}) {
  const startX = doc.x;
  const startY = doc.y;
  doc.circle(startX + 2.5, startY + 5.5, 1.8).fill(options.color ?? "#475569");
  doc.fillColor(options.textColor ?? "#111827").font("Helvetica").fontSize(options.size ?? 9.5).text(text, startX + 12, startY, {
    width: options.width ?? 470,
    lineGap: 1.5
  });
  doc.moveDown(0.25);
}

function ensureSpace(doc, requiredHeight = 120) {
  if (doc.y + requiredHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function groupExperience(items) {
  const groups = [];

  for (const item of items) {
    const previous = groups.at(-1);

    if (roleChangeCompanies.has(item.company) && previous?.company === item.company && previous.grouped) {
      previous.items.unshift(item);
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

function formatReference(item, labels) {
  return `${labels.reference}: ${item.role} — ${item.reference.name}, ${item.reference.role}, ${item.reference.phone}`;
}

function addProjectLinks(doc, project, labels, options = {}) {
  const links = [
    [labels.demo, project.link],
    [labels.sourceCode, project.sourceLink]
  ].filter(([, link]) => link);

  for (const [label, link] of links) {
    doc.font("Helvetica-Bold").fontSize(options.size ?? 8).fillColor(options.labelColor ?? "#334155").text(`${label}: `, {
      continued: true
    });
    doc.font("Helvetica").fontSize(options.size ?? 8).fillColor(options.linkColor ?? "#2563EB").text(link, {
      width: options.width ?? 500,
      link,
      underline: true
    });
  }
}

function addModernExperienceItem(doc, item, language, labels, options = {}) {
  const left = options.indent ? 62 : 48;
  const titleWidth = options.indent ? 300 : 335;
  const bulletWidth = options.indent ? 462 : 480;
  const title = options.grouped ? item.role : `${item.role} · ${item.company}`;
  const titleY = doc.y;

  doc.font("Helvetica-Bold").fontSize(10.7).fillColor("#111827").text(title, left, titleY, {
    width: titleWidth,
    lineGap: 1
  });
  doc.font("Helvetica").fontSize(8.3).fillColor("#64748B").text(localize(item.period, language), 392, titleY, {
    width: 153,
    align: "right",
    lineGap: 1
  });
  doc.x = left;
  doc.moveDown(0.25);

  for (const highlight of localize(item.highlights, language).slice(0, 2)) {
    doc.x = left;
    addBullet(doc, highlight, { size: 8.8, width: bulletWidth });
  }

  doc.x = left;
  doc.font("Helvetica").fontSize(8).fillColor("#475569").text(`${labels.technologies}: ${item.tech.join(" · ")}`, {
    width: bulletWidth + 20,
    lineGap: 1
  });
  if (options.includeReference !== false) {
    doc.moveDown(0.12);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(formatReference(item, labels), {
      width: bulletWidth + 20,
      lineGap: 1
    });
  }
  doc.moveDown(0.35);
  doc.x = 48;
}

function addAtsExperienceItem(doc, item, language, labels, options = {}) {
  const left = options.indent ? 58 : 48;
  const width = options.indent ? 460 : 500;
  const title = options.grouped ? `${item.role} | ${localize(item.period, language)}` : `${item.role} | ${item.company} | ${localize(item.period, language)}`;

  doc.x = left;
  doc.font("Helvetica-Bold").fontSize(10).text(title, { width, lineGap: 1 });
  for (const highlight of localize(item.highlights, language)) {
    doc.x = left;
    addBullet(doc, highlight, { color: "#000000", textColor: "#000000", size: 8.7, width: width - 20 });
  }
  doc.x = left;
  doc.font("Helvetica").fontSize(8.5).text(`${labels.technologies}: ${item.tech.join(", ")}`, { width });
  if (options.includeReference !== false) {
    doc.x = left;
    doc.font("Helvetica").fontSize(8.5).text(formatReference(item, labels), { width });
  }
  doc.moveDown(0.35);
  doc.x = 48;
}

async function writePdf(outputPath, render, title) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 48,
    compress: false,
    info: {
      Title: title,
      Author: portfolioContent.profile.name,
      Subject: "Public portfolio CV export"
    }
  });
  const output = createWriteStream(outputPath);

  doc.pipe(output);
  render(doc);
  doc.end();

  await finished(output);
}

function renderModernCv(doc, language) {
  const copy = portfolioContent.locales[language];
  const labels = sectionLabels[language];

  doc.rect(0, 0, doc.page.width, 145).fill("#111827");
  doc.fillColor("#F8FAFC").font("Helvetica-Bold").fontSize(25).text(portfolioContent.profile.name, 48, 42, {
    width: 330
  });
  doc.font("Helvetica").fontSize(12).fillColor("#CBD5E1").text(localize(portfolioContent.profile.title, language), 48, 76);
  addModernPdfContactLines(doc);

  doc.x = 48;
  doc.y = 172;
  doc.fillColor("#111827").font("Helvetica").fontSize(10.5).text(copy.hero.subtitle, {
    width: 500,
    lineGap: 2
  });

  addSectionTitle(doc, labels.coreSkills, "#0F172A");
  const skills = portfolioContent.skills
    .map((group) => `${localize(group.name, language)}: ${group.items.join(", ")}`)
    .join("  •  ");
  doc.font("Helvetica").fontSize(9.2).fillColor("#334155").text(skills, { width: 500, lineGap: 2 });

  addSectionTitle(doc, labels.experience, "#0F172A");
  for (const group of groupExperience(portfolioContent.experience)) {
    ensureSpace(doc, group.grouped ? 46 + group.items.length * 76 : 92);

    if (group.grouped && group.items.length > 1) {
      doc.font("Helvetica-Bold").fontSize(10.7).fillColor("#111827").text(group.company, 48, doc.y, {
        width: 497,
        lineGap: 1
      });
      doc.moveDown(0.25);
      for (const item of group.items) {
        ensureSpace(doc, 76);
        addModernExperienceItem(doc, item, language, labels, { grouped: true, indent: true, includeReference: false });
      }
      for (const item of group.items) {
        doc.x = 62;
        doc.font("Helvetica").fontSize(8).fillColor("#475569").text(formatReference(item, labels), {
          width: 482,
          lineGap: 1
        });
      }
      doc.moveDown(0.35);
      continue;
    }

    addModernExperienceItem(doc, group.items[0], language, labels);
  }

  addSectionTitle(doc, labels.selectedProjects, "#0F172A");
  for (const project of portfolioContent.projects) {
    ensureSpace(doc, 92);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(`${project.name} | ${localize(project.context, language)}`);
    doc.font("Helvetica").fontSize(8.7).fillColor("#334155").text(localize(project.description, language), { width: 500, lineGap: 1.5 });
    addProjectLinks(doc, project, labels);
    doc.moveDown(0.45);
  }

  addSectionTitle(doc, labels.educationTraining, "#0F172A");
  for (const item of portfolioContent.education.slice(0, 5)) {
    ensureSpace(doc, 42);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#111827").text(localize(item.name, language), { continued: true });
    doc.font("Helvetica").fontSize(8).fillColor("#64748B").text(` · ${item.institution}`);
  }
}

function renderAtsCv(doc, language) {
  const copy = portfolioContent.locales[language];
  const labels = sectionLabels[language];

  doc.font("Helvetica-Bold").fontSize(18).fillColor("#000000").text(portfolioContent.profile.name);
  doc.font("Helvetica").fontSize(10).text(localize(portfolioContent.profile.title, language));
  doc.moveDown(0.35);
  addAtsPdfContactLines(doc);

  addSectionTitle(doc, labels.professionalSummary, "#000000");
  doc.font("Helvetica").fontSize(10).fillColor("#000000").text(copy.hero.subtitle, { width: 500, lineGap: 2 });

  addSectionTitle(doc, labels.skills, "#000000");
  for (const group of portfolioContent.skills) {
    doc.font("Helvetica-Bold").fontSize(9.5).text(`${localize(group.name, language)}: `, { continued: true });
    doc.font("Helvetica").fontSize(9.5).text(group.items.join(", "), { width: 500 });
  }

  addSectionTitle(doc, labels.professionalExperience, "#000000");
  for (const group of groupExperience(portfolioContent.experience)) {
    ensureSpace(doc, group.grouped ? 42 + group.items.length * 78 : 85);

    if (group.grouped && group.items.length > 1) {
      doc.font("Helvetica-Bold").fontSize(10).text(group.company, 48, doc.y, {
        width: 500,
        lineGap: 1
      });
      doc.moveDown(0.2);
      for (const item of group.items) {
        ensureSpace(doc, 78);
        addAtsExperienceItem(doc, item, language, labels, { grouped: true, indent: true, includeReference: false });
      }
      for (const item of group.items) {
        doc.x = 58;
        doc.font("Helvetica").fontSize(8.5).text(formatReference(item, labels), { width: 460 });
      }
      doc.moveDown(0.35);
      continue;
    }

    addAtsExperienceItem(doc, group.items[0], language, labels);
  }

  addSectionTitle(doc, labels.projects, "#000000");
  for (const project of portfolioContent.projects) {
    ensureSpace(doc, 82);
    doc.font("Helvetica-Bold").fontSize(9.5).text(`${project.name} | ${localize(project.context, language)}`);
    doc.font("Helvetica").fontSize(8.7).text(localize(project.description, language), {
      width: 500,
      lineGap: 1.5
    });
    addProjectLinks(doc, project, labels, { labelColor: "#000000", linkColor: "#0000EE" });
    doc.moveDown(0.35);
  }

  addSectionTitle(doc, labels.education, "#000000");
  for (const item of portfolioContent.education) {
    ensureSpace(doc, 36);
    doc.font("Helvetica-Bold").fontSize(9).text(`${localize(item.name, language)} | ${item.institution}`);
    doc.font("Helvetica").fontSize(8.5).text(`${localize(item.period, language)} | ${localize(item.details, language)}`, { width: 500 });
  }
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(obsoletePdfAssets.map((fileName) => rm(join(outputDirectory, fileName), { force: true })));

for (const language of cvPdfExportLanguages) {
  const exportsForLanguage = getCvPdfExports(language);

  await writePdf(
    join(outputDirectory, exportsForLanguage.modern.fileName),
    (doc) => renderModernCv(doc, language),
    `Patricio Montes Güemez - Modern CV (${language.toUpperCase()})`
  );
  await writePdf(
    join(outputDirectory, exportsForLanguage.ats.fileName),
    (doc) => renderAtsCv(doc, language),
    `Patricio Montes Güemez - ATS CV (${language.toUpperCase()})`
  );
}

await writePdf(
  localStandardPdfPath,
  (doc) => renderAtsCv(doc, "es"),
  "Patricio Montes Güemez - Standard local CV"
);
