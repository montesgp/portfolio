export const languageCodes = ["en", "es"] as const;
export const themeKeys = ["editorial", "vercel"] as const;

export type LanguageCode = (typeof languageCodes)[number];
export type ThemeKey = (typeof themeKeys)[number];
export type LocalizedText = Record<LanguageCode, string>;
export type LocalizedList = Record<LanguageCode, readonly string[]>;

export const portfolioContent = {
  profile: {
    name: "Patricio Montes Güemez",
    title: {
      en: "Software Engineer",
      es: "Ingeniero de Software"
    },
    email: "montesgpatricio@gmail.com",
    whatsapp: "https://wa.me/5491140518040",
    linkedin: "https://www.linkedin.com/in/patricio-montes-88212448/",
    github: "https://github.com/montesgp",
    portfolio: "https://montesgp.github.io/portfolio/"
  },
  languages: [
    {
      code: "en",
      shortLabel: "EN",
      label: {
        en: "English",
        es: "Inglés"
      }
    },
    {
      code: "es",
      shortLabel: "ES",
      label: {
        en: "Spanish",
        es: "Español"
      }
    }
  ],
  themes: [
    {
      key: "editorial",
      label: {
        en: "Editorial",
        es: "Editorial"
      }
    },
    {
      key: "vercel",
      label: {
        en: "Vercel",
        es: "Vercel"
      }
    }
  ],
  locales: {
    en: {
      skipToContent: "Skip to content",
      nav: {
        about: "Profile",
        experience: "Experience",
        skills: "Skills",
        projects: "Impact",
        education: "Training",
        contact: "Contact"
      },
      controls: {
        languageLabel: "Choose language",
        themeLabel: "Change visual theme"
      },
      exports: {
        modernPdfLabel: "Download Modern PDF CV",
        atsPdfLabel: "Download ATS PDF CV",
        pdfHint: "Both files are generated with PDFKit and served as static portfolio assets.",
        downloadsLabel: "Download CV PDFs"
      },
      hero: {
        eyebrow: "Software Engineer",
        title: "Backend, cloud, and product delivery with a practical engineering mindset.",
        subtitle: "Software Engineer with 10+ years creating scalable, maintainable solutions focused on architecture, design, Clean Code, Clean Architecture, DDD, SDD, and TDD. Currently following AI-agent workflows under human technical direction.",
        primaryCta: "Contact me",
        secondaryCta: "View experience",
        availability: "Available for software development, architecture support, and integration work.",
        flipToBackLabel: "Read professional description",
        flipToFrontLabel: "Back to highlights",
        cardBack: `More than 10 years of experience developing solutions for companies across different sectors.

My approach combines software architecture, design, and good development practices to build maintainable, scalable, high-quality products. I believe good design reduces costs, facilitates product evolution, and minimizes long-term risks.

I work following the principles of Robert C. Martin (Clean Code and Clean Architecture) and Eric Evans (Domain-Driven Design), applying design patterns, industry standards, and methodologies such as Spec-Driven Development (SDD) and Test-Driven Development (TDD) to deliver robust, testable, easy-to-maintain solutions.

I currently enhance my work through an ecosystem of specialized Artificial Intelligence agents that collaborate on analysis, design, development, and validation tasks. Every architecture, quality, and design decision remains under my direction and technical judgment, using AI as a tool to increase productivity without compromising quality.

I stay continuously up to date with technology with the aim of transforming business needs into reliable, scalable solutions prepared to grow. My projects and professional networks are centralized on GitHub: https://github.com/montesgp.`,
        focusAreas: [".NET", "Angular", "Google Cloud", "Microsoft Azure", "Clean Code", "Clean Architecture"]
      },
      stats: [
        {
          value: "10+",
          label: "years across software delivery",
          detail: "From BPM integrations to senior development and architecture decisions."
        },
        {
          value: "3",
          label: "cloud ecosystems in verified work",
          detail: "Microsoft Azure, Google Cloud Platform, and Google App Engine-backed architecture."
        },
        {
          value: "EN / ES",
          label: "portfolio languages",
          detail: "Content is available in English and Spanish without server-only features."
        }
      ],
      sections: {
        about: {
          eyebrow: "Profile",
          title: "A delivery-focused developer who connects business process, backend architecture, and team execution.",
          intro: "Patricio Montes Güemez is a Software Engineer with verified experience in .NET, Java, TypeScript, Python, Node, databases, cloud platforms, and integrations.",
          details: ["Recent work includes RESTful APIs for real-time fleet control, an AI multi-agent ecosystem with local memory and TDD plus SDD harnesses, microservice boilerplates, cloud deployments, API Gateway architecture, and administrative support tooling.", "This public portfolio intentionally uses only verified professional facts and omits sensitive personal data that is not appropriate for a static public site."]
        },
        experience: {
          eyebrow: "Experience",
          title: "Verified professional timeline",
          intro: "The roles below are based on supplied CV facts and are presented without inventing private client claims or unverified metrics."
        },
        skills: {
          eyebrow: "Skills",
          title: "Technology map",
          intro: "Grouped from the verified CV technology categories."
        },
        projects: {
          eyebrow: "Projects and impact",
          title: "Selected verified work",
          intro: "Examples below use only project facts supplied from the CV.",
          linkLabel: "Open verified link",
          demoLinkLabel: "Open demo",
          sourceLinkLabel: "View source code"
        },
        education: {
          eyebrow: "Education and training",
          title: "Formal education, languages, and courses",
          intro: "Education and training are phrased conservatively where the CV lists status as ongoing."
        },
        contact: {
          eyebrow: "Contact",
          title: "Let’s talk about software, technology, and solutions built to grow.",
          intro: "Choose the channel that fits the conversation: WhatsApp for direct coordination, email for detailed context, or LinkedIn for professional networking. You can also explore my work in the GitHub portfolio.",
          whatsappLabel: "Message on WhatsApp",
          emailLabel: "Email Patricio",
          linkedinLabel: "Open LinkedIn profile",
          githubLabel: "Open GitHub profile",
          portfolioLabel: "Visit portfolio",
          whatsappDescription: "Best for quick coordination.",
          emailDescription: "Best for project context and attachments.",
          linkedinDescription: "Best for professional networking.",
          githubDescription: "Projects and professional networks in one place.",
          portfolioDescription: "Explore the complete portfolio.",
          copyEmailLabel: "Email"
        }
      }
    },
    es: {
      skipToContent: "Saltar al contenido",
      nav: {
        about: "Perfil",
        experience: "Experiencia",
        skills: "Habilidades",
        projects: "Impacto",
        education: "Formación",
        contact: "Contacto"
      },
      controls: {
        languageLabel: "Elegir idioma",
        themeLabel: "Cambiar tema visual"
      },
      exports: {
        modernPdfLabel: "Descargar CV PDF moderno",
        atsPdfLabel: "Descargar CV PDF ATS",
        pdfHint: "Ambos archivos se generan con PDFKit y se sirven como assets estáticos del portfolio.",
        downloadsLabel: "Descargar CVs PDF"
      },
      hero: {
        eyebrow: "Ingeniero de Software",
        title: "Backend, cloud y entrega de producto con criterio práctico de ingeniería.",
        subtitle: "Ingeniero de Software 10+ años creando soluciones escalables y mantenibles con foco en arquitectura, diseño, Clean Code, Clean Architecture, DDD, SDD, TDD. Respetando actualmente flujos de trabajo con agentes IA bajo dirección técnica humana.",
        primaryCta: "Contactarme",
        secondaryCta: "Ver experiencia",
        availability: "Disponible para desarrollo de software, soporte de arquitectura e integraciones.",
        flipToBackLabel: "Leer descripción profesional",
        flipToFrontLabel: "Volver a destacados",
        cardBack: `Más de 10 años de experiencia desarrollando soluciones para empresas de distintos sectores.

Mi enfoque combina arquitectura de software, diseño y buenas prácticas de desarrollo para construir productos mantenibles, escalables y de alta calidad. Creo que un buen diseño reduce costos, facilita la evolución del producto y minimiza riesgos a largo plazo.

Trabajo siguiendo los principios de Robert C. Martin (Clean Code y Clean Architecture) y Eric Evans (Domain-Driven Design), aplicando patrones de diseño, estándares de la industria y metodologías como Spec-Driven Development (SDD) y Test-Driven Development (TDD) para entregar soluciones robustas, testeables y fáciles de mantener.

Actualmente potencio mi trabajo mediante un ecosistema de agentes de Inteligencia Artificial especializados que colaboran en tareas de análisis, diseño, desarrollo y validación. Todas las decisiones de arquitectura, calidad y diseño permanecen bajo mi dirección y criterio técnico, utilizando la IA como una herramienta para aumentar la productividad sin comprometer la calidad.

Me mantengo en constante actualización tecnológica con objetivo en transformar necesidades de negocio en soluciones confiables, escalables y preparadas para crecer. Mis proyectos y redes profesionales están centralizados en GitHub: https://github.com/montesgp.`,
        focusAreas: [".NET", "Angular", "Google Cloud", "Microsoft Azure", "Clean Code", "Clean Architecture"]
      },
      stats: [
        {
          value: "10+",
          label: "años en entrega de software",
          detail: "Desde integraciones BPM hasta desarrollo senior y decisiones de arquitectura."
        },
        {
          value: "3",
          label: "ecosistemas cloud en trabajos verificados",
          detail: "Microsoft Azure, Google Cloud Platform y arquitectura sobre Google App Engine."
        },
        {
          value: "EN / ES",
          label: "idiomas del portfolio",
          detail: "El contenido está disponible en inglés y español sin depender de funciones de servidor."
        }
      ],
      sections: {
        about: {
          eyebrow: "Perfil",
          title: "Un desarrollador enfocado en entrega que conecta procesos de negocio, arquitectura backend y ejecución de equipo.",
          intro: "Patricio Montes Güemez es Ingeniero de Software con experiencia verificada en .NET, Java, TypeScript, Python, Node, bases de datos, plataformas cloud e integraciones.",
          details: ["Su trabajo reciente incluye APIs RESTful para control de flota en tiempo real, un ecosistema multiagente con IA, memoria local y arneses TDD más SDD, boilerplates de microservicios, despliegues cloud, arquitectura de API Gateway y herramientas administrativas de soporte.", "El portfolio público usa únicamente datos profesionales verificados y omite información personal sensible que no corresponde publicar en un sitio estático."]
        },
        experience: {
          eyebrow: "Experiencia",
          title: "Línea de tiempo profesional verificada",
          intro: "Los roles se basan en los datos provistos del CV y se presentan sin inventar clientes privados ni métricas no verificadas."
        },
        skills: {
          eyebrow: "Habilidades",
          title: "Mapa tecnológico",
          intro: "Agrupado desde las categorías tecnológicas verificadas del CV."
        },
        projects: {
          eyebrow: "Proyectos e impacto",
          title: "Trabajo verificado seleccionado",
          intro: "Los ejemplos usan únicamente datos de proyecto provistos por el CV.",
          linkLabel: "Abrir enlace verificado",
          demoLinkLabel: "Abrir demo",
          sourceLinkLabel: "Ver código fuente"
        },
        education: {
          eyebrow: "Educación y formación",
          title: "Educación formal, idiomas y cursos",
          intro: "La formación se redacta de manera conservadora cuando el CV lista el estado como actual."
        },
        contact: {
          eyebrow: "Contacto",
          title: "Hablemos sobre software, tecnología y soluciones preparadas para crecer.",
          intro: "Elegí el canal que mejor se ajuste a la conversación: WhatsApp para coordinación directa, email para contexto detallado o LinkedIn para contacto profesional. También podés explorar mi trabajo en el portfolio de GitHub.",
          whatsappLabel: "Escribir por WhatsApp",
          emailLabel: "Enviar email a Patricio",
          linkedinLabel: "Abrir perfil de LinkedIn",
          githubLabel: "Abrir perfil de GitHub",
          portfolioLabel: "Visitar portfolio",
          whatsappDescription: "Ideal para coordinación rápida.",
          emailDescription: "Ideal para contexto de proyecto y adjuntos.",
          linkedinDescription: "Ideal para networking profesional.",
          githubDescription: "Proyectos y redes profesionales en un solo lugar.",
          portfolioDescription: "Explorá el portfolio completo.",
          copyEmailLabel: "Email"
        }
      }
    }
  },
  experience: [
    {
      company: "Urbetrack",
      role: "Sr .Net Developer",
      period: {
        en: "July 2024 — April 2026",
        es: "Julio 2024 — Abril 2026"
      },
      highlights: {
        en: ["Developed RESTful APIs for a real-time fleet-control application covering GPS positioning, fuel, and maintenance workflows.", "Built an AI multi-agent ecosystem with local memory, a router for balanced LLM distribution, and TDD plus SDD harnesses.", "Created administrative ASPX tools for help desk operations, participated in code review, and managed deployments."],
        es: ["Desarrolló APIs RESTful para control de flotas en tiempo real con GPS, combustible y mantenimiento.", "Construyó un ecosistema multiagente con IA, memoria local, un router para distribución balanceada de LLMs y arneses TDD más SDD.", "Creó herramientas ASPX para mesa de ayuda, participó en code review y gestionó despliegues."]
      },
      reference: {
        name: "Enrique Candia",
        role: "Technical Leader",
        phone: "(011) 6244-0404"
      },
      tech: [".NET", "REST APIs", "ASPX", "Microsoft Azure", "TDD", "SDD", "CI/CD"]
    },
    {
      company: "Digbang",
      role: "Sr .Net Developer",
      period: {
        en: "July 2023 — January 2024",
        es: "Julio 2023 — Enero 2024"
      },
      highlights: {
        en: ["Created a .NET 7 microservice boilerplate serving a React Native web/backoffice and Android/iOS mobile apps for commercial-center discounts.", "Ran horizontal-scaling experiments for interconnected .NET and Node.js social-messaging apps and detected memory and synchronization problems.", "Supported documentation, estimates, development, tests, and implementation."],
        es: ["Creó un boilerplate .NET 7 para microservicios que servían una web/backoffice React Native y apps Android/iOS de descuentos.", "Experimentó con escalado horizontal de aplicaciones .NET y Node.js interconectadas y detectó problemas de memoria y sincronización.", "Acompañó documentación, estimaciones, desarrollo, pruebas e implementación."]
      },
      reference: {
        name: "Mariano Filipoff",
        role: "Arq. Software",
        phone: "(011) 6533-1716"
      },
      tech: ["Envoyer", ".NET 7", "Microsoft Azure", "Redis", "Azure Service Bus", "Node.js"]
    },
    {
      company: "Sideas",
      role: "Sr Full Stack Developer",
      period: {
        en: "November 2022 — July 2023",
        es: "Noviembre 2022 — Julio 2023"
      },
      highlights: {
        en: ["Worked on a survey personalization app for a client in the Netherlands with Argentina offices.", "Supported requirements understanding, documentation, feature development, and Azure deployments."],
        es: ["Trabajó en una app de personalización de encuestas para un cliente de Países Bajos con oficinas en Argentina.", "Acompañó requerimientos, documentación, desarrollo de funcionalidades y despliegues en Azure."]
      },
      reference: {
        name: "Marcos Vodanovich",
        role: "PL",
        phone: "(011) 5616-8329"
      },
      tech: ["Microsoft Azure", ".NET Core", "Angular", "Angular Material", "CI/CD"]
    },
    {
      company: "UNX Digital / Grupo Prominente",
      role: "Sr Software Developer",
      period: {
        en: "September 2021 — April 2022",
        es: "Septiembre 2021 — Abril 2022"
      },
      highlights: {
        en: ["Worked on Apex America modernization.", "Developed .NET Core 5 APIs and services for cross-application business needs."],
        es: ["Trabajó en la modernización de Apex America.", "Desarrolló APIs y servicios .NET Core 5 para necesidades de negocio entre aplicaciones."]
      },
      reference: {
        name: "Adrian Gonzales",
        role: "CTO",
        phone: "(351) 304-7426"
      },
      tech: ["Google Cloud Platform", ".NET Core 5", "C#", "APIs"]
    },
    {
      company: "UNX Digital / Grupo Prominente",
      role: "Software Architect",
      period: {
        en: "April 2022 — November 2022",
        es: "Abril 2022 — Noviembre 2022"
      },
      highlights: {
        en: ["Defined architecture decisions for communication between applications.", "Implemented a .NET Core API Gateway with Ocelot on Google App Engine.", "Integrated OIDC tokens from GCP to solve authentication; the architecture was validated by Google Argentina DevOps, and he trained other teams."],
        es: ["Definió arquitectura para comunicación entre aplicaciones e implementó un API Gateway .NET Core con Ocelot en Google App Engine.", "Integró tokens OIDC desde GCP para resolver autenticación; la arquitectura fue validada por Google Argentina DevOps y capacitó a otros equipos."]
      },
      reference: {
        name: "Adrian Gonzales",
        role: "CTO",
        phone: "(351) 304-7426"
      },
      tech: ["Google Cloud Platform", "Google App Engine", ".NET Core", "Ocelot", "OIDC"]
    },
    {
      company: "Codeicus",
      role: "Ssr .Net Developer",
      period: {
        en: "October 2019 — September 2021",
        es: "Octubre 2019 — Septiembre 2021"
      },
      highlights: {
        en: ["Built Java DDD APIs with Gradle, ERP full-stack components with Angular, Java, and xUnit, plus a Python backup assistant.", "Maintained and evolved C#/Java financial app features, insurance broker components with C#/Java/HTML/CSS/JavaScript, and Java + Gradle backend integrations with Jira, Jenkins, GitLab, and SonarQube."],
        es: ["Construyó APIs Java con DDD y Gradle, componentes ERP full-stack con Angular, Java y xUnit, más un asistente de backup en Python.", "Mantuvo y evolucionó funcionalidades de aplicaciones financieras C#/Java, componentes para productores de seguros con C#/Java/HTML/CSS/JavaScript e integraciones backend Java + Gradle con Jira, Jenkins, GitLab y SonarQube."]
      },
      reference: {
        name: "Ricardo Ángel Siciliano",
        role: "PL",
        phone: "(221) 314-3602"
      },
      tech: ["Java", "Gradle", "Angular", "xUnit", "Python", "C#", "JavaScript", "Jira", "Jenkins", "GitLab", "SonarQube", "DDD", "CI/CD"]
    },
    {
      company: "Codeicus",
      role: "Sr Software Developer",
      period: {
        en: "December 2020 — September 2021",
        es: "Diciembre 2020 — Septiembre 2021"
      },
      highlights: {
        en: ["Built internal credit management web tools with Java, Maven, and JSF, and collaborated on construction ERP domains using Draw.io and Whimsical.", "Maintained Android/iOS supermarket shelf survey app releases in React Native with minor fixes, and reviewed a C# .NET WCF communication module."],
        es: ["Construyó herramientas web internas de gestión crediticia con Java, Maven y JSF, y colaboró en dominios de ERP para construcción usando Draw.io y Whimsical.", "Mantuvo releases Android/iOS de una app de relevamiento de góndolas de supermercado en React Native con ajustes menores, y revisó un módulo de comunicación WCF en C# .NET."]
      },
      reference: {
        name: "Ricardo Ángel Siciliano",
        role: "PL",
        phone: "(221) 314-3602"
      },
      tech: ["Java", "Maven", "JSF", "Draw.io", "Whimsical", "React Native", "C#", "CI/CD"]
    },
    {
      company: "Luxsys S.R.L",
      role: "IT Developer",
      period: {
        en: "October 2016 — December 2018",
        es: "Octubre 2016 — Diciembre 2018"
      },
      highlights: {
        en: ["Developed back-end support for BPM-managed business processes, integrated BPM with REST APIs for e-commerce and messaging, linked SQL databases with Softland and Bejerman ERPs, and supported business consulting."],
        es: ["Desarrolló back-end para procesos BPM, integró BPM con APIs REST para e-commerce y mensajería, vinculó bases SQL con ERPs Softland y Bejerman, y acompañó consultoría."]
      },
      reference: {
        name: "Emanuel Gutierrez",
        role: "PL",
        phone: "(011) 3684-2464"
      },
      tech: ["BPM", "REST APIs", "SQL Server", "Softland", ".NET C#", ".NET Framework 4.5"]
    },
    {
      company: "Luxsys S.R.L",
      role: "Technical Leader",
      period: {
        en: "December 2018 — October 2019",
        es: "Diciembre 2018 — Octubre 2019"
      },
      highlights: {
        en: ["Designed BPM solutions with the development team and estimated incidents with technical resolution details, delegation, and project follow-up."],
        es: ["Diseñó soluciones BPM con el equipo y estimó incidentes con detalles técnicos de resolución, delegación y seguimiento de proyectos."]
      },
      reference: {
        name: "Emanuel Gutierrez",
        role: "PL",
        phone: "(011) 3684-2464"
      },
      tech: ["BPM", "Technical leadership", "Estimation", "Project follow-up", "C#"]
    }
  ],
  skills: [
    {
      name: {
        en: "Principles and ways of working",
        es: "Principios y formas de trabajo"
      },
      items: ["SOLID", "KISS", "Scrum"]
    },
    {
      name: {
        en: "Programming",
        es: "Programación"
      },
      items: ["C#", "Java", "TypeScript", "Python", "Node"]
    },
    {
      name: {
        en: "Web",
        es: "Web"
      },
      items: ["HTML", "CSS", "SASS", "Bootstrap", "MDB"]
    },
    {
      name: {
        en: "Frameworks",
        es: "Frameworks"
      },
      items: [".NET", "Spring Boot", "Entity Framework", "Angular", "Angular Material", "Next.js", "React", "Vue"]
    },
    {
      name: {
        en: "Databases",
        es: "Bases de datos"
      },
      items: ["SQL Server", "PostgreSQL", "MySQL", "Supabase", "MongoDB", "Redis"]
    },
    {
      name: {
        en: "Platforms",
        es: "Plataformas"
      },
      items: ["Microsoft Azure", "Google Cloud Platform", "Azure Service Bus", "AWS Rekognition", "Docker"]
    },
    {
      name: {
        en: "Delivery tools",
        es: "Herramientas de entrega"
      },
      items: ["Git", "GitLab", "GitHub", "Bamboo", "Jenkins", "Jira", "SonarQube"]
    },
    {
      name: {
        en: "Design and QA",
        es: "Diseño y QA"
      },
      items: ["Design Patterns", "xUnit", "Draw.io", "Excalidraw", "Figma", "Report Builder"]
    }
  ],
  projects: [
    {
      name: "Receipt Risk Detector",
      context: {
        en: "Open-source POC — 2026",
        es: "POC open source — 2026"
      },
      description: {
        en: "Open-source POC that analyzes images of Argentine bank-transfer receipts and returns an explainable fraud-risk assessment to support manual reconciliation. It combines local OCR, metadata/C2PA inspection, deterministic financial rules, and visual analysis; it does not certify payment or authenticity.",
        es: "POC open source que analiza imágenes de comprobantes de transferencias bancarias argentinas y devuelve una evaluación explicable del riesgo de fraude para apoyar la conciliación manual. Combina OCR local, inspección de metadatos/C2PA, reglas financieras determinísticas y análisis visual; no certifica el pago ni la autenticidad."
      },
      link: "https://receipt-risk-detector-web-production.up.railway.app/",
      sourceLink: "https://github.com/montesgp/receipt-risk-detector"
    },
    {
      name: "Gestión de circuito deportivo",
      context: {
        en: "Verified public platform",
        es: "Plataforma pública verificada"
      },
      description: {
        en: "Centralized, fully responsive platform for managing sports circuits, tournaments, players, news, rankings, and related operations.",
        es: "Plataforma centralizada y completamente responsive para gestionar circuitos deportivos, torneos, jugadores, noticias, rankings y operaciones relacionadas."
      },
      link: "https://circuitoarredepadel.com/"
    },
    {
      name: "Incoders corporate site and admin platform",
      context: {
        en: "Verified public corporate site",
        es: "Sitio corporativo público verificado"
      },
      description: {
        en: "Corporate site with an admin panel for estimates and budgets, automatic invoicing, product builder workflows, CRM operations, and a financial dashboard.",
        es: "Sitio corporativo con panel administrativo para estimaciones y presupuestos, facturación automática, flujos de product builder, operaciones CRM y dashboard financiero."
      },
      link: "https://www.incoders.com.ar/"
    },
    {
      name: "Olympus",
      context: {
        en: "Codeicus — July 2020 to September 2020",
        es: "Codeicus — Julio 2020 a Septiembre 2020"
      },
      description: {
        en: "Internal project-management software developed with DDD, Java, and Angular; integrated with Jira, Jenkins, and GitLab APIs and included an xUnit unit test suite.",
        es: "Software interno de gestión de proyectos desarrollado con DDD, Java y Angular; integrado con APIs de Jira, Jenkins y GitLab, e incluyó tests unitarios xUnit."
      },
      link: ""
    },
    {
      name: "Infocovid",
      context: {
        en: "Codeicus — March 2020 to April 2020",
        es: "Codeicus — Marzo 2020 a Abril 2020"
      },
      description: {
        en: "Hotfix participation on a paisanos.io MVP for finding scarce products in nearby stores and supermarkets during COVID-19.",
        es: "Participación en hotfixes de un MVP de paisanos.io para encontrar productos escasos en comercios y supermercados cercanos durante COVID-19."
      },
      link: "https://infocovid.online/"
    },
    {
      name: "Siegwerk São Paulo implementation",
      context: {
        en: "Luxsys S.R.L — June 2018",
        es: "Luxsys S.R.L — Junio 2018"
      },
      description: {
        en: "Productive integration between Softland ERP and LuxEvent BPM at the Diadema plant.",
        es: "Integración productiva entre Softland ERP y LuxEvent BPM en la planta de Diadema."
      },
      link: ""
    },
    {
      name: "GDS Balancer final project",
      context: {
        en: "UTN FRBA — March 2018 to July 2018",
        es: "UTN FRBA — Marzo 2018 a Julio 2018"
      },
      description: {
        en: "Rules engine for GDS for Almundo.com travel agency, covering analysis through design.",
        es: "Motor de reglas para GDS de la agencia de viajes Almundo.com, cubriendo desde análisis hasta diseño."
      },
      link: ""
    },
    {
      name: "UX/UI course final web project",
      context: {
        en: "Comunidad IT / Accenture Rosario — May 2016 to July 2016",
        es: "Comunidad IT / Accenture Rosario — Mayo 2016 a Julio 2016"
      },
      description: {
        en: "Web system for sports-court rentals created as the course final project.",
        es: "Sistema web para alquiler de canchas deportivas creado como proyecto final del curso."
      },
      link: ""
    },
    {
      name: "UTN FRRO research project",
      context: {
        en: "UTN FRRO — March 2012 to December 2012",
        es: "UTN FRRO — Marzo 2012 a Diciembre 2012"
      },
      description: {
        en: "Administration resources chair project focused on improving faculty processes.",
        es: "Proyecto de la cátedra Administración de Recursos orientado a mejorar procesos de la facultad."
      },
      link: ""
    }
  ],
  education: [
    {
      name: {
        en: "Information Systems Engineering",
        es: "Ingeniería en Sistemas de Información"
      },
      institution: "Universidad Tecnológica Nacional, Facultad Regional Rosario",
      period: {
        en: "March 2008 — Present",
        es: "Marzo 2008 — Actualidad"
      },
      details: {
        en: "",
        es: ""
      }
    },
    {
      name: {
        en: "Bachiller y Técnico Electromecánico",
        es: "Bachiller y Técnico Electromecánico"
      },
      institution: "E.E.T. N°1 \"Fray Luis Beltrán\"",
      period: {
        en: "March 2004 — December 2006",
        es: "Marzo 2004 — Diciembre 2006"
      },
      details: {
        en: "Secondary technical education.",
        es: "Educación técnica secundaria."
      }
    },
    {
      name: {
        en: "English training",
        es: "Formación en inglés"
      },
      institution: "Education First",
      period: {
        en: "July 2016 — July 2017",
        es: "Julio 2016 — Julio 2017"
      },
      details: {
        en: "Level 9/16, basic professional competence.",
        es: "Nivel 9/16, competencia básica profesional."
      }
    },
    {
      name: {
        en: "Angular 11",
        es: "Angular 11"
      },
      institution: "Educación IT",
      period: {
        en: "March 2021 — April 2021",
        es: "Marzo 2021 — Abril 2021"
      },
      details: {
        en: "Course listed in verified training.",
        es: "Curso listado en la formación verificada."
      }
    },
    {
      name: {
        en: "UX/UI Design",
        es: "Diseño UX/UI"
      },
      institution: "Comunidad IT",
      period: {
        en: "May 2016 — July 2016",
        es: "Mayo 2016 — Julio 2016"
      },
      details: {
        en: "Course listed in verified training.",
        es: "Curso listado en la formación verificada."
      }
    },
    {
      name: {
        en: "Reporting Services SSRS and Basic Accounting",
        es: "Reporting Services SSRS y Contabilidad básica"
      },
      institution: "Educación IT",
      period: {
        en: "April 2017 — February 2019",
        es: "Abril 2017 — Febrero 2019"
      },
      details: {
        en: "Reporting Services SSRS was completed April-May 2017; Basic Accounting was completed January-February 2019.",
        es: "Reporting Services SSRS fue realizado en abril-mayo 2017; Contabilidad básica en enero-febrero 2019."
      }
    }
  ]
} as const;

export type PortfolioContent = typeof portfolioContent;
