// Respaldo inicial. El CMS guarda la versión editable en public/content/site.json.
export const defaultContent = {
  "preview": true,
  "contact": {
    "email": "",
    "phone": "",
    "whatsapp": "",
    "facebook": "",
    "instagram": "",
    "tiktok": ""
  },
  "plannedSocials": [
    "Facebook",
    "Instagram",
    "TikTok"
  ],
  "officialPlanUrl": "/documents/plan-de-trabajo.html",
  "planProvided": true,
  "planDownloadLabel": "Consultar documento del plan",
  "photos": [
    {
      "src": "/images/octavio-quebrada.webp",
      "alt": "Vegetación y quebrada en la parroquia rural Octavio Cordero Palacios",
      "title": "Una mirada al territorio",
      "caption": "Quebrada · Octavio Cordero Palacios",
      "author": "Martín Vasco",
      "source": "https://commons.wikimedia.org/wiki/File:Quebrada_en_la_parroquia_rural_Octavio_Cordero_Palacios.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "creditNote": "Imagen reducida y convertida a WebP; recorte visual con CSS.",
      "location": "Octavio Cordero Palacios"
    },
    {
      "src": "/images/octavio-casas.webp",
      "alt": "Casas antiguas del centro de Octavio Cordero Palacios",
      "title": "Los lugares que compartimos",
      "caption": "Casas · Octavio Cordero Palacios",
      "author": "Martín Vasco",
      "source": "https://commons.wikimedia.org/wiki/File:Casas_antiguas_en_el_centro_urbano_de_la_parroquia_Octavio_Cordero_Palacios.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "creditNote": "Imagen reducida y convertida a WebP; recorte visual con CSS.",
      "location": "Octavio Cordero Palacios"
    }
  ],
  "members": [
    {
      "name": "Sandra Jackeline Lema Chalco",
      "role": "Presidenta",
      "photo": "",
      "confirmed": true,
      "bio": "Sandra Jackeline Lema Chalco forma parte del equipo con el rol de presidenta. Su trayectoria y experiencia se publicarán cuando estén confirmadas."
    },
    {
      "name": "Claudio Milton Chuqui",
      "role": "Vicepresidente",
      "photo": "",
      "confirmed": true,
      "bio": "Claudio Milton Chuqui forma parte del equipo con el rol de vicepresidente. Su trayectoria y experiencia se publicarán cuando estén confirmadas."
    },
    {
      "name": "Delia Isabel Pineda Tenen",
      "role": "Tesorera",
      "photo": "",
      "confirmed": true,
      "bio": "Delia Isabel Pineda Tenen forma parte del equipo con el rol de tesorera. Su trayectoria y experiencia se publicarán cuando estén confirmadas."
    },
    {
      "name": "Sandra Estefania Puma Cantos",
      "role": "Secretaria",
      "photo": "",
      "confirmed": true,
      "bio": "Sandra Estefania Puma Cantos forma parte del equipo con el rol de secretaria. Su trayectoria y experiencia se publicarán cuando estén confirmadas."
    }
  ],
  "plan": [
    {
      "id": "vialidad",
      "title": "Vías y conectividad",
      "icon": "road",
      "description": "El documento prioriza la conexión de las 16 comunidades con sus lugares de producción, escuelas y servicios de salud.",
      "items": [
        {
          "title": "Prioridades decididas en comunidad",
          "text": "Levantar un inventario vial y aprobar un Plan Vial Participativo en asamblea. Priorizar las intervenciones según riesgo, población beneficiada, importancia productiva, acceso a servicios y viabilidad."
        },
        {
          "title": "Mantenimiento de los caminos",
          "text": "Plantear una intervención vial priorizada por cada comunidad y dos campañas anuales de mantenimiento preventivo en las vías priorizadas, con limpieza de cunetas y alcantarillas, lastrado y coordinación mediante convenios y mingas."
        },
        {
          "title": "Vía de la Producción",
          "text": "Gestionar estudios, convenios y financiamiento para rehabilitar por tramos el eje que conecta Santa Rosa, las comunidades y Ricaurte. La ejecución correspondería a la Prefectura o al Municipio, según el tramo; el GAD parroquial coordinaría y daría seguimiento."
        },
        {
          "title": "Movilidad y seguridad vial",
          "text": "Gestionar señalización e iluminación en sectores poblados, atender puntos críticos de riesgo y coordinar mejoras en los horarios del transporte público rural."
        }
      ]
    },
    {
      "id": "produccion",
      "title": "Producción local",
      "icon": "leaf",
      "description": "Agricultura, ganadería, emprendimientos y turismo rural forman parte del desarrollo económico planteado en el plan.",
      "items": [
        {
          "title": "Acceso para la producción",
          "text": "Priorizar con los productores la adecuación de caminos utilizados para fincas, pastoreo y acopio, mediante coordinación con la Prefectura, el Ministerio de Agricultura y las organizaciones locales."
        },
        {
          "title": "Capacitación agropecuaria",
          "text": "Gestionar capacitación y asistencia técnica para agricultores y ganaderos con el Ministerio de Agricultura, la Prefectura y las universidades."
        },
        {
          "title": "Ferias y emprendimientos",
          "text": "Organizar ferias productivas para facilitar la venta directa al consumidor y la participación de emprendedores, en coordinación con instituciones y asociaciones de productores."
        }
      ]
    },
    {
      "id": "inclusion",
      "title": "Inclusión y cultura",
      "icon": "community",
      "description": "El plan contempla salud preventiva, atención a grupos prioritarios y espacios de cultura y deporte.",
      "items": [
        {
          "title": "Salud y atención comunitaria",
          "text": "Gestionar brigadas de salud preventiva, actualizar el registro de adultos mayores y personas con discapacidad, y coordinar un programa anual de atención con las instituciones competentes."
        },
        {
          "title": "Cultura, deporte y formación",
          "text": "Poner en funcionamiento una escuela deportiva y una cultural, realizar un torneo parroquial anual y talleres de emprendimiento juvenil, con coordinación institucional."
        },
        {
          "title": "Identidad y saberes de la parroquia",
          "text": "Desarrollar una agenda cultural anual y proyectos de recuperación de conocimientos ancestrales y diálogo de saberes junto con las organizaciones comunitarias."
        }
      ]
    },
    {
      "id": "seguridad",
      "title": "Seguridad y convivencia",
      "icon": "shield",
      "description": "Las propuestas combinan organización comunitaria, prevención y coordinación con las entidades responsables de seguridad.",
      "items": [
        {
          "title": "Organización y coordinación",
          "text": "Conformar comités de seguridad en las 16 comunidades y coordinar acciones y patrullaje con la Policía Nacional, la Guardia Ciudadana y el Consejo de Seguridad."
        },
        {
          "title": "Alarmas e iluminación",
          "text": "Gestionar alarmas comunitarias y cámaras en puntos estratégicos. Levantar un inventario de puntos oscuros y coordinar mejoras de iluminación con CENTROSUR y el Municipio."
        },
        {
          "title": "Prevención y convivencia",
          "text": "Realizar campañas de prevención de violencia intrafamiliar y consumo de sustancias en colegios y comunidades, junto con las instituciones de salud, seguridad y protección de derechos."
        }
      ]
    },
    {
      "id": "ambiente",
      "title": "Ambiente y agua",
      "icon": "droplet",
      "description": "Proteger las fuentes de agua, cuidar el territorio y organizar la prevención de riesgos son objetivos del documento.",
      "items": [
        {
          "title": "Fuentes de agua y sistemas comunitarios",
          "text": "Proteger y reforestar fuentes de agua y quebradas. Diagnosticar el estado de los sistemas de agua de las comunidades y gestionar mejoras o ampliaciones con ETAPA y el Municipio."
        },
        {
          "title": "Mingas y manejo de residuos",
          "text": "Realizar una minga de limpieza anual en cada comunidad y campañas de manejo de residuos con la EMAC, con participación comunitaria."
        },
        {
          "title": "Prevención de riesgos",
          "text": "Elaborar un mapa comunitario de riesgos y un plan de contingencia parroquial, coordinados con las entidades competentes. El diagnóstico también contempla kits de emergencia para comunidades en zonas de riesgo."
        }
      ]
    },
    {
      "id": "gestion",
      "title": "Gestión y participación",
      "icon": "document",
      "description": "Asambleas, información pública y seguimiento de metas permiten consultar cómo se plantea la gestión del plan.",
      "items": [
        {
          "title": "Decisiones con las comunidades",
          "text": "Realizar una asamblea anual de priorización en cada comunidad y dos asambleas parroquiales por año. Recibir necesidades y propuestas e impulsar formación en liderazgo comunitario."
        },
        {
          "title": "Metas que se pueden consultar",
          "text": "Publicar un tablero de metas actualizado cada trimestre en carteleras y redes. Revisar los proyectos mensualmente y evaluar los indicadores de forma semestral."
        },
        {
          "title": "Rendición de cuentas",
          "text": "Presentar cada año los resultados, la ejecución presupuestaria y los convenios. Publicar los informes y facilitar el acceso a información y el control social mediante participación y veedurías ciudadanas."
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "¿Qué información encontraré en esta página?",
      "answer": "Información sobre Renovación 63, su equipo de cuatro personas, el plan de trabajo y los canales de contacto. Los datos que aún no se han confirmado se señalan expresamente."
    },
    {
      "question": "¿Dónde puedo consultar el plan de trabajo?",
      "answer": "La sección «Plan de trabajo» presenta un resumen por temas del documento facilitado por el equipo para el período 2027-2031. El botón «Consultar documento del plan» abre sus objetivos, propuestas, metas y programación en una versión de lectura sin las nóminas ni los números de cédula. Puedes imprimirla o guardarla en PDF desde el navegador."
    },
    {
      "question": "¿Cómo puedo contactar al movimiento?",
      "answer": "El equipo prevé trabajar con Facebook, Instagram y TikTok. Las cuentas todavía no se han creado; sus enlaces oficiales aparecerán en la sección de contacto cuando estén disponibles. Esta versión no envía mensajes ni guarda los datos del formulario."
    },
    {
      "question": "¿Esta página pertenece al GAD parroquial?",
      "answer": "Esta página es un espacio informativo del movimiento. El equipo aspira a integrar el GAD parroquial; el sitio no se presenta como un canal institucional del GAD."
    }
  ],
  "version": 1,
  "brand": {
    "name": "Renovación 63",
    "number": "63",
    "label": "MOVIMIENTO\nRENOVACIÓN",
    "slogan": "Se siente amor por Octavio Cordero Palacios",
    "wordmark": "/brand/campaign-wordmark-light.webp",
    "accent": "#ff5d15"
  },
  "seo": {
    "title": "Renovación 63 · Octavio Cordero Palacios",
    "description": "Conoce a Renovación 63 de Octavio Cordero Palacios, Cuenca, Azuay. Equipo, información y plan de trabajo."
  },
  "navigation": [
    {
      "id": "movimiento",
      "label": "El movimiento"
    },
    {
      "id": "plan",
      "label": "Plan de trabajo"
    },
    {
      "id": "equipo",
      "label": "El equipo"
    },
    {
      "id": "parroquia",
      "label": "La parroquia"
    },
    {
      "id": "contacto",
      "label": "Contacto"
    }
  ],
  "sections": [
    {
      "id": "movimiento",
      "enabled": true
    },
    {
      "id": "plan",
      "enabled": true
    },
    {
      "id": "equipo",
      "enabled": true
    },
    {
      "id": "parroquia",
      "enabled": true
    },
    {
      "id": "contacto",
      "enabled": true
    },
    {
      "id": "preguntas",
      "enabled": true
    }
  ],
  "copy": {
    "preview": "Vista previa",
    "previewNote": "Fotografías y canales de contacto pendientes",
    "heroDescription": "Conoce el movimiento, su equipo y el plan de trabajo para nuestra parroquia.",
    "heroPrimary": "Explorar el plan",
    "heroSecondary": "Conocer al equipo",
    "heroLocation": "Cuenca, Azuay · Ecuador",
    "guideIntro": "La información, a tu alcance.",
    "guideTeam": "Nuestro equipo",
    "guidePlan": "Plan de trabajo",
    "guideContact": "Canales de contacto",
    "movementTitle": "Un espacio para\nconocer",
    "movementLead": "Renovación 63 reúne a un equipo de cuatro personas que aspiran a integrar el GAD parroquial de Octavio Cordero Palacios.",
    "movementBody": "Este espacio reúne la información del movimiento: quiénes lo integran, qué propuestas presentan y cómo contactar al equipo.",
    "movementNote": "Estamos preparando el contenido oficial. Las fotografías del equipo, las biografías y los canales pendientes se identifican en cada sección.",
    "movementLink": "Consultar el plan",
    "discoveryTitle": "Explora los temas del plan",
    "discoveryText": "Elige un tema para conocer sus propuestas.",
    "planTitle": "El plan, punto por punto",
    "planDescription": "Un lugar para consultar propuestas, acciones y plazos.",
    "planPeriod": "Plan de trabajo 2027-2031",
    "planNote": "Resumen del documento facilitado por el equipo.",
    "planFootnote": "Las acciones que requieren coordinación con otras instituciones conservan ese alcance. Consulta los objetivos, las metas y la programación en el documento del plan.",
    "planPrint": "Imprimir resumen",
    "planSearch": "Buscar en el plan",
    "teamTitle": "Conoce al equipo",
    "teamDescription": "Cuatro personas. Sus nombres y roles, en un solo lugar.",
    "teamNote": "Fotografías y trayectorias pendientes de incorporar.",
    "profileButton": "Ver perfil",
    "portraitPending": "Fotografía pendiente",
    "profilePending": "Fotografía y trayectoria pendientes",
    "galleryTitle": "Nuestra parroquia,\nen imágenes",
    "galleryDescription": "Una mirada a los lugares de Octavio Cordero Palacios.",
    "galleryFootnote": "Abre una fotografía para verla en detalle.",
    "creditsButton": "Ver créditos",
    "contactTitle": "La información\nempieza con\nuna conversación",
    "contactDescription": "Consulta información sobre el movimiento, el equipo o el plan de trabajo.",
    "contactPending": "Estamos preparando nuestros canales oficiales.",
    "socialPending": "Próximamente",
    "contactLocation": "Octavio Cordero Palacios",
    "contactRegion": "Cuenca · Azuay · Ecuador",
    "formTitle": "Prepara tu consulta",
    "formDescription": "Formulario de muestra. El correo oficial está pendiente.",
    "nameLabel": "Nombre",
    "emailLabel": "Correo electrónico",
    "topicLabel": "Tema de tu consulta",
    "messageLabel": "Mensaje",
    "formPrivacy": "Esta web no guarda ni envía los datos del formulario. Con el correo configurado, podrás abrir un borrador en tu aplicación de correo.",
    "formButton": "Preparar mensaje",
    "faqTitle": "Información\nútil",
    "footerText": "Octavio Cordero Palacios.\nUn espacio para informarnos.",
    "footerTop": "Volver arriba",
    "footerNote": "Sitio informativo en preparación",
    "privacyButton": "Privacidad",
    "privacyText": "La página pública no utiliza analítica, seguimiento ni cookies publicitarias. El panel privado de edición utiliza una cookie de sesión segura que vence a las 8 horas. El formulario prepara un borrador de correo solo cuando se configura el canal oficial. Los enlaces externos pueden aplicar sus propias políticas. Las fotografías y fuentes se sirven desde el propio sitio."
  }
};
