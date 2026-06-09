import { useState, useCallback } from "react";

// ─── DATOS ────────────────────────────────────────────────────

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
               "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const AREAS = [
  { id:"vial",       nombre:"Infraestructura Vial",  icono:"🛣️",  costo:12, img_op:8,  img_pr:3  },
  { id:"educacion",  nombre:"Educación",              icono:"📚",  costo:10, img_op:10, img_pr:5  },
  { id:"seguridad",  nombre:"Seguridad",              icono:"🚔",  costo:11, img_op:7,  img_pr:6  },
  { id:"salud",      nombre:"Salud",                  icono:"🏥",  costo:10, img_op:9,  img_pr:7  },
  { id:"vivienda",   nombre:"Vivienda Social",        icono:"🏘️",  costo:9,  img_op:8,  img_pr:4  },
  { id:"transporte", nombre:"Transporte AMBA",        icono:"🚆",  costo:8,  img_op:6,  img_pr:5  },
];

const ZONAS = [
  { id:"c_norte",   nombre:"Conurbano Norte",   base:58, intendente:"Jorge Medina",    partido:"propio",   prefers:["vial","seguridad"],       preferLabel:"rutas y seguridad"   },
  { id:"c_sur",     nombre:"Conurbano Sur",     base:54, intendente:"Patricia Vega",   partido:"propio",   prefers:["educacion","vivienda"],   preferLabel:"educación y vivienda" },
  { id:"c_oeste",   nombre:"Conurbano Oeste",   base:50, intendente:"Raúl Domínguez",  partido:"propio",   prefers:["vial","transporte"],      preferLabel:"vial y transporte"   },
  { id:"campo",     nombre:"Interior Campo",    base:33, intendente:"Carlos Ibáñez",   partido:"opositor", prefers:["vial","salud"],           preferLabel:"rutas y salud"       },
  { id:"costa",     nombre:"Interior Costa",    base:44, intendente:"Mónica Ferreyra", partido:"opositor", prefers:["transporte","turismo"],   preferLabel:"transporte"          },
  { id:"sierras",   nombre:"Interior Sierras",  base:40, intendente:"Diego Ponce",     partido:"propio",   prefers:["educacion","salud"],      preferLabel:"educación y salud"   },
  { id:"industria", nombre:"Interior Industria",base:51, intendente:"Laura Sosa",      partido:"propio",   prefers:["vial","seguridad"],       preferLabel:"vial e industria"    },
  { id:"caba",      nombre:"CABA",              base:28, intendente:"(Jefe de Gob.)",  partido:"opositor", prefers:["transporte","educacion"], preferLabel:"transporte y ed."    },
];

const EMPRESAS = [
  { nombre:"Grupo Clarín",        sector:"medios",       icono:"📺" },
  { nombre:"Techint",             sector:"industria",    icono:"🏭" },
  { nombre:"Farmacity",           sector:"salud",        icono:"💊" },
  { nombre:"AYSA",                sector:"agua",         icono:"💧" },
  { nombre:"Edenor",              sector:"energía",      icono:"⚡" },
  { nombre:"Coto / La Anónima",   sector:"retail",       icono:"🛒" },
  { nombre:"Constructora Loma",   sector:"vivienda",     icono:"🏗️" },
];

const EVENTOS_PRESIDENTE = [
  { id:"p_copa",   txt:"Nación retiene fondos de coparticipación.",                    efecto_conf:{ alto:{ presupuesto:-18, capital:-5 }, bajo:{ presupuesto:+12 } }, neutro:false },
  { id:"p_decreto",txt:"Decreto presidencial interfiere con competencias provinciales.",efecto_conf:{ alto:{ cohesion:-8, capital:-6 }, bajo:{ capital:-3 } }, neutro:false },
  { id:"p_obra",   txt:"Nación anuncia obra pública en tu territorio sin avisarte.",    efecto_conf:{ alto:{ imagen:-6 }, bajo:{ imagen:+4, presupuesto:+6 } }, neutro:false },
  { id:"p_media",  txt:"Medios nacionales te atacan. Se nota la mano del gobierno.",    efecto_conf:{ alto:{ imagen:-12 }, bajo:{ imagen:-4 } }, neutro:false },
  { id:"p_bono",   txt:"Nación ofrece bono extra de obra pública. Hay condiciones.",    efecto_conf:{ alto:{ presupuesto:+5, cohesion:-4 }, bajo:{ presupuesto:+18, imagen:+4 } }, neutro:false },
];

const NOTICIAS = [
  { id:"n1",  txt:"El índice de pobreza del Conurbano baja dos puntos.",          efecto:{ imagen:+6 },                   zona:null,       impacto:true  },
  { id:"n2",  txt:"Lluvia de críticas por el estado de las rutas provinciales.",  efecto:{ imagen:-7 },                   zona:null,       impacto:true  },
  { id:"n3",  txt:"Encuesta: tu gestión tiene 52% de aprobación.",                efecto:{ capital:+5 },                  zona:null,       impacto:true  },
  { id:"n4",  txt:"Escándalo con un secretario de estado. Piden su renuncia.",    efecto:{ imagen:-9, cohesion:-4 },      zona:null,       impacto:true  },
  { id:"n5",  txt:"Cosecha récord en la zona agrícola.",                          efecto:{ presupuesto:+8 },              zona:"campo",    impacto:true  },
  { id:"n6",  txt:"Inundaciones en el Conurbano Sur. Familias evacuadas.",        efecto:{ imagen:-5, presupuesto:-10 },  zona:"c_sur",    impacto:true  },
  { id:"n7",  txt:"Paro docente de 48 horas en escuelas públicas.",               efecto:{ imagen:-6, cohesion:-5 },      zona:null,       impacto:true  },
  { id:"n8",  txt:"El dólar blue sube. Tensión en los mercados.",                 efecto:{},                             zona:null,       impacto:false },
  { id:"n9",  txt:"Argentina juega las eliminatorias. El país se distrae.",       efecto:{},                             zona:null,       impacto:false },
  { id:"n10", txt:"El FMI aprueba desembolso al gobierno nacional.",              efecto:{},                             zona:null,       impacto:false },
  { id:"n11", txt:"Ola de calor en el AMBA. Cortes de luz en el Conurbano.",      efecto:{ imagen:-5 },                  zona:"c_norte",  impacto:true  },
  { id:"n12", txt:"Nuevo shopping inaugurado en zona norte.",                     efecto:{ imagen:+3 },                  zona:"c_norte",  impacto:true  },
  { id:"n13", txt:"Crisis carcelaria en La Plata. Motín en penales bonaerenses.", efecto:{ imagen:-8, capital:-4 },      zona:null,       impacto:true  },
  { id:"n14", txt:"Ranking: la provincia de Buenos Aires mejora en educación.",   efecto:{ imagen:+5 },                  zona:null,       impacto:true  },
  { id:"n15", txt:"Mes tranquilo. La agenda política nacional acapara la atención.",efecto:{},                           zona:null,       impacto:false },
];

const LEYES = [
  { id:"l1", titulo:"Reforma Policial Bonaerense",    descripcion:"Modernización de la Policía. Alta expectativa pública, resistencia interna del cuerpo.",
    aprobar:{ imagen:+12, cohesion:-10, capital:+6 }, vetar:{ imagen:-10, cohesion:+6 }, abstenerse:{ cohesion:-4, imagen:-3 } },
  { id:"l2", titulo:"Ley de Alquileres Provincial",   descripcion:"Regulación de alquileres en el AMBA. Inquilinos a favor, propietarios en contra.",
    aprobar:{ imagen:+8, presupuesto:-5, cohesion:-4 }, vetar:{ imagen:-6, capital:+4 }, abstenerse:{ imagen:-2 } },
  { id:"l3", titulo:"Presupuesto Educativo +15%",     descripcion:"Aumento del gasto educativo. Docentes exigen, la Tesorería llora.",
    aprobar:{ imagen:+9, presupuesto:-15, cohesion:+5 }, vetar:{ imagen:-9, cohesion:-6 }, abstenerse:{ cohesion:-3, imagen:-4 } },
  { id:"l4", titulo:"Privatización de servicios de agua", descripcion:"Empresas privadas operarían el servicio de agua en algunos municipios.",
    aprobar:{ presupuesto:+20, imagen:-12, cohesion:-8 }, vetar:{ imagen:+8, presupuesto:-5 }, abstenerse:{ imagen:-3, cohesion:-2 } },
  { id:"l5", titulo:"Ley Antiminería",                descripcion:"Prohibición de minería a cielo abierto en sierras bonaerenses.",
    aprobar:{ imagen:+7, presupuesto:-8, cohesion:-3 }, vetar:{ imagen:-8, presupuesto:+6 }, abstenerse:{ imagen:-2 } },
  { id:"l6", titulo:"Fondo Especial de Seguridad",    descripcion:"Creación de fondo dedicado a equipamiento policial y cámaras.",
    aprobar:{ imagen:+6, presupuesto:-12, cohesion:+4 }, vetar:{ imagen:-5, capital:+2 }, abstenerse:{ cohesion:-2 } },
  { id:"l7", titulo:"Reforma Electoral Provincial",   descripcion:"Boleta única y cambio de fechas de elecciones municipales.",
    aprobar:{ imagen:+5, cohesion:-12, capital:+4 }, vetar:{ imagen:-6, cohesion:+5 }, abstenerse:{ cohesion:-5, imagen:-2 } },
  { id:"l8", titulo:"Impuesto Inmobiliario Rural",    descripcion:"Aumento de la carga impositiva sobre tierras rurales del Interior.",
    aprobar:{ presupuesto:+15, imagen:-6, cohesion:-5 }, vetar:{ imagen:+3, presupuesto:-5 }, abstenerse:{ imagen:-2, cohesion:-2 } },
];

const DEMANDAS_INTENDENTE = [
  { area:"vial",       txt:"necesita asfalto urgente en sus calles principales" },
  { area:"seguridad",  txt:"pide más patrulleros y cámaras para su distrito" },
  { area:"salud",      txt:"exige refuerzo en el hospital municipal" },
  { area:"educacion",  txt:"quiere escuelas nuevas antes de las elecciones" },
  { area:"vivienda",   txt:"reclama planes de vivienda para sectores vulnerables" },
  { area:"transporte", txt:"pide extensión de líneas de colectivos hacia su municipio" },
];

const DEMANDAS_LOBBY = [
  { empresa_idx:0, txt:"Quiere que vetes la ley de publicidad oficial.",             ley:"publicidad", area:null,       si:{ imagen:-8, presupuesto:+15 }, no:{ imagen:+6, presupuesto:-5 }  },
  { empresa_idx:1, txt:"Exige licitación de obra pública en zona industrial.",        ley:null,         area:"vial",     si:{ presupuesto:+10, imagen:-4 }, no:{ imagen:+4, presupuesto:-8 }  },
  { empresa_idx:2, txt:"Presiona para que apruebes subsidio al sector farmacéutico.", ley:null,         area:"salud",    si:{ presupuesto:-10, imagen:+5 }, no:{ imagen:-3, cohesion:+3 }      },
  { empresa_idx:3, txt:"Quiere privatización parcial de agua en municipios.",         ley:"agua",       area:null,       si:{ presupuesto:+18, imagen:-10 }, no:{ imagen:+5, presupuesto:-4 }  },
  { empresa_idx:4, txt:"Exige tarifas eléctricas más altas para financiarse.",        ley:"tarifas",    area:null,       si:{ presupuesto:+8, imagen:-12 }, no:{ imagen:+7, presupuesto:-3 }  },
  { empresa_idx:5, txt:"Pide que bloquees la ley de etiquetado de alimentos.",        ley:"etiquetado", area:null,       si:{ presupuesto:+12, imagen:-8 }, no:{ imagen:+6 }                   },
  { empresa_idx:6, txt:"Exige adjudicación directa de plan de vivienda.",             ley:null,         area:"vivienda", si:{ presupuesto:-5, imagen:+4 },  no:{ imagen:-2, cohesion:+2 }      },
];

// ─── HELPERS ──────────────────────────────────────────────────

const cl = (v, mn=0, mx=100) => Math.max(mn, Math.min(mx, Math.round(v)));

function mesAnio(t) {
  return { mes: MESES[(t-1)%12], anio: Math.ceil(t/12), mesNum: (t-1)%12+1 };
}

function calcVoto(zonas, cohesion, imagen, conf) {
  const lp = zonas.reduce((a,z)=>a+z.lealtad,0)/zonas.length;
  const cb = conf>=35&&conf<=65 ? 4 : 0;
  return cl(lp*0.55 + imagen*0.3 + cohesion*0.15 + cb, 15, 85);
}

function calcFuerza(imagen, presupuesto, conf) {
  const cs = conf>=35&&conf<=65 ? 100 : conf<35 ? 50+conf : 150-conf;
  return cl(imagen*0.4 + presupuesto*0.35 + cs*0.25, 10, 90);
}

function generarEvento(turno, confrontacion, presidentePropio, usados) {
  const anio = Math.ceil(turno/12);
  const roll = Math.random();

  if (roll < 0.20) return { tipo:"tranquilo", data:null };
  if (roll < 0.50) {
    return { tipo:"noticia", data: NOTICIAS[Math.floor(Math.random()*NOTICIAS.length)] };
  }
  if (roll < 0.70 && anio<=4) {
    const ev = EVENTOS_PRESIDENTE[Math.floor(Math.random()*EVENTOS_PRESIDENTE.length)];
    return { tipo:"presidente", data: ev };
  }
  if (roll < 0.85) {
    const disponibles = LEYES.filter(l=>!usados.leyes.includes(l.id));
    if (disponibles.length > 0) {
      return { tipo:"legislatura", data: disponibles[Math.floor(Math.random()*disponibles.length)] };
    }
  }
  if (roll < 0.93) {
    const zona = ZONAS[Math.floor(Math.random()*ZONAS.length)];
    const demanda = DEMANDAS_INTENDENTE[Math.floor(Math.random()*DEMANDAS_INTENDENTE.length)];
    return { tipo:"intendente", data:{ zona, demanda } };
  }
  const disponiblesL = DEMANDAS_LOBBY.filter((_,i)=>!usados.lobby.includes(i));
  if (disponiblesL.length > 0) {
    const idx = Math.floor(Math.random()*disponiblesL.length);
    return { tipo:"lobby", data:{ demanda: disponiblesL[idx], empresa: EMPRESAS[disponiblesL[idx].empresa_idx] } };
  }
  return { tipo:"tranquilo", data:null };
}

function initState() {
  return {
    turno: 1,
    r: { presupuesto:60, capital:65, imagen:52, cohesion:72 },
    zonas: ZONAS.map(z=>({...z, lealtad:z.base})),
    conf: 20,
    inversiones: Object.fromEntries(AREAS.map(a=>[a.id, 0])),
    log: ["Asumiste como Gobernador de la Provincia de Buenos Aires."],
    evento: null,
    eventoResuelto: false,
    inversionHecha: false,
    usados: { leyes:[], lobby:[] },
    fase: "evento",
    presidentePropio: false,
    fuerzaCandidato: 0,
    juegoTerminado: false,
    victoria: false,
    mensajeFinal: "",
    campania: false,
  };
}

// ─── DESIGN TOKENS ────────────────────────────────────────────

const C = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  teal: "#00897b",
  tealLight: "#e0f2f1",
  tealDark: "#00695c",
  red: "#e53935",
  redLight: "#ffebee",
  amber: "#f9a825",
  amberLight: "#fff8e1",
  blue: "#1565c0",
  blueLight: "#e3f2fd",
  purple: "#6a1b9a",
  purpleLight: "#f3e5f5",
  text: "#1a1a2e",
  textSub: "#546e7a",
  textMuted: "#90a4ae",
  border: "#e0e0e0",
  shadow: "0 2px 8px rgba(0,0,0,0.10)",
  shadowMd: "0 4px 20px rgba(0,0,0,0.14)",
};

// ─── COMPONENTES ──────────────────────────────────────────────

function StatBar({ label, value, color, icon }) {
  const pct = cl(value);
  const barColor = pct < 25 ? C.red : pct > 65 ? C.teal : C.amber;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:13, color:C.textSub, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:16 }}>{icon}</span>{label}
        </span>
        <span style={{ fontSize:14, fontWeight:700, color:barColor }}>{pct}%</span>
      </div>
      <div style={{ background:"#e0e0e0", borderRadius:6, height:8, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, background:barColor, height:8, borderRadius:6, transition:"width 0.35s ease" }}/>
      </div>
    </div>
  );
}

function ConfBar({ valor }) {
  const inZone = valor >= 35 && valor <= 65;
  const barColor = valor < 30 ? C.teal : valor < 65 ? C.amber : C.red;
  const label = valor < 30 ? "Bajo perfil" : valor < 65 ? "Equilibrio" : "Alta confrontación";
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:13, color:C.textSub, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:16 }}>⚡</span>Confrontación con Nación
        </span>
        <span style={{ fontSize:13, fontWeight:700, color:barColor }}>{label} ({valor}%)</span>
      </div>
      <div style={{ background:"#e0e0e0", borderRadius:6, height:8, overflow:"hidden", position:"relative" }}>
        <div style={{ width:`${valor}%`, background:barColor, height:8, borderRadius:6, transition:"width 0.35s ease" }}/>
        <div style={{ position:"absolute", left:"35%", top:0, width:2, height:8, background:"#fff8" }}/>
        <div style={{ position:"absolute", left:"65%", top:0, width:2, height:8, background:"#fff8" }}/>
      </div>
      <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>
        Zona óptima: 35–65% {inZone ? "✓" : ""}
      </div>
    </div>
  );
}

function AreaCard({ area, nivel, onClick }) {
  const colors = {
    1: { bg: C.tealLight, border: C.teal, badge: C.teal, label: "Invertido" },
    "-1": { bg: C.redLight, border: C.red, badge: C.red, label: "Recortado" },
    0: { bg: C.surface, border: C.border, badge: C.textMuted, label: "Sin asignar" },
  };
  const s = colors[nivel] || colors[0];
  return (
    <div onClick={onClick} style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14,
      padding: "14px 16px", marginBottom: 10, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: C.shadow, transition: "transform 0.1s",
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: C.surface,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", flexShrink: 0,
      }}>{area.icono}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{area.nombre}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
          Img +{area.img_op} · Costo {area.costo}%
        </div>
      </div>
      <span style={{
        background: s.badge, color: "#fff", borderRadius: 20,
        padding: "3px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>{s.label}</span>
    </div>
  );
}

function ZonaCard({ zona, onInvertir }) {
  const leal = Math.round(zona.lealtad);
  const color = leal >= 55 ? C.teal : leal >= 40 ? C.amber : C.red;
  const statusLabel = leal >= 55 ? "Zona segura" : leal >= 40 ? "En disputa" : "Zona hostil";
  const esCaba = zona.id === "caba";
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: "14px 16px", marginBottom: 10, boxShadow: C.shadow,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 6, borderRadius: 3, alignSelf: "stretch",
        background: color, flexShrink: 0, minHeight: 40,
      }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{zona.nombre}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
          {esCaba ? "Jurisdicción externa · Gobierno autónomo" : `${zona.intendente} · ${zona.partido === "propio" ? "Aliado" : "Opositor"}`}
        </div>
        <div style={{ fontSize: 11, color:"#9b5de5", marginTop:2 }}>
          {esCaba ? "🤝 Coord.: seguridad, transporte" : `⭐ ${zona.preferLabel}`}
        </div>
        <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{statusLabel}</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color }}>{leal}%</span>
        {!esCaba && (
          <button onClick={onInvertir} style={{
            background: C.tealLight, color: C.tealDark, border: `1px solid ${C.teal}40`,
            borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600,
          }}>-8 cap → +7 leal</button>
        )}
        {esCaba && (
          <button onClick={onInvertir} style={{
            background: C.blueLight, color: C.blue, border: `1px solid ${C.blue}40`,
            borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600,
          }}>🤝 Coordinar</button>
        )}
      </div>
    </div>
  );
}

function EventCard({ titulo, subtitulo, icono, color, children }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 14, padding: "16px",
      marginBottom: 12, boxShadow: C.shadow, border: `1px solid ${color}30`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: color + "18",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
        }}>{icono}</div>
        <div>
          <div style={{ fontSize: 12, color, fontWeight: 700, textTransform:"uppercase", letterSpacing:1 }}>{titulo}</div>
          <div style={{ fontSize: 14, color: C.text, fontWeight: 600, marginTop: 1 }}>{subtitulo}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function ActionBtn({ onClick, label, color=C.teal, outline=false, disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "13px 16px", borderRadius: 10, cursor: disabled?"not-allowed":"pointer",
      background: disabled ? "#e0e0e0" : outline ? "transparent" : color,
      color: disabled ? C.textMuted : outline ? color : "#fff",
      border: outline ? `2px solid ${color}` : "none",
      fontSize: 14, fontWeight: 700, marginBottom: 8,
      opacity: disabled ? 0.6 : 1,
      transition: "opacity 0.2s, transform 0.1s",
      letterSpacing: 0.3,
    }}>{label}</button>
  );
}

function EffectTags({ efecto }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:5, margin:"8px 0" }}>
      {Object.entries(efecto).map(([k,v]) => (
        <span key={k} style={{
          background: v > 0 ? C.tealLight : C.redLight,
          color: v > 0 ? C.tealDark : C.red,
          borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700,
        }}>{k} {v > 0 ? "+" : ""}{v}</span>
      ))}
    </div>
  );
}

function Modal({ titulo, icono, color=C.teal, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      zIndex:200, padding:"0",
    }}>
      <div style={{
        background: C.surface, borderRadius:"20px 20px 0 0",
        padding: "8px 20px 32px", width:"100%", maxWidth:520,
        maxHeight:"88vh", overflowY:"auto", boxShadow: "0 -4px 30px rgba(0,0,0,0.18)",
      }}>
        <div style={{
          width:40, height:4, background:"#ddd", borderRadius:2,
          margin:"0 auto 18px",
        }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          {icono && <span style={{
            width:40, height:40, borderRadius:10, background:color+"18",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
          }}>{icono}</span>}
          <div style={{ fontSize:17, fontWeight:800, color:C.text }}>{titulo}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────

export default function Gobernador() {
  const [st, setSt] = useState(initState());
  const [tab, setTab] = useState("tablero");
  const [invModal, setInvModal] = useState(false);
  const [invArea, setInvArea] = useState(null);
  const [invAccion, setInvAccion] = useState(null);

  const patch = useCallback((fn) => setSt(s => {
    const next = fn(s);
    if (!next.juegoTerminado) {
      if (next.r.cohesion < 7)    return {...next, juegoTerminado:true, mensajeFinal:"Tu bloque legislativo implosionó. Sin Legislatura no gobernás."};
      if (next.r.imagen < 5)      return {...next, juegoTerminado:true, mensajeFinal:"Tu imagen colapsó. Nadie te escucha."};
      if (next.r.presupuesto < 3) return {...next, juegoTerminado:true, mensajeFinal:"La provincia entró en default."};
      if (next.r.capital < 3)     return {...next, juegoTerminado:true, mensajeFinal:"Perdiste toda capacidad política de maniobra."};
    }
    return next;
  }), []);

  const applyR = (s, efecto, zonaId=null, dLealtad=0, dConf=0) => {
    const r = {...s.r};
    Object.entries(efecto).forEach(([k,v])=>{ if(r[k]!==undefined) r[k]=cl(r[k]+v); });
    const zonas = s.zonas.map(z=>z.id===zonaId?{...z,lealtad:cl(z.lealtad+dLealtad,8,92)}:z);
    const conf = cl(s.conf+dConf, 0, 100);
    return {...s, r, zonas, conf};
  };

  const iniciarMes = () => {
    patch(s => {
      const { mes, anio } = mesAnio(s.turno);

      // Mes 33 (Sep, Año 3): campaña presidencial
      if (s.turno === 33) {
        return {...s, campania:true, eventoResuelto:true, evento:{tipo:"tranquilo",data:null},
          log:[`${mes}, Año ${anio}: Es momento de lanzar tu candidato presidencial.`,...s.log].slice(0,30)};
      }
      // Mes 36 (Dic, Año 3): elecciones — resultado de la campaña
      if (s.turno === 36) {
        const voto = calcVoto(s.zonas, s.r.cohesion, s.r.imagen, s.conf);
        if (voto < 55) return {...s, juegoTerminado:true, victoria:false,
          mensajeFinal:`Perdiste la reelección con ${voto}%. Necesitabas el 55%.`};
        return {...s, eventoResuelto:true, evento:{tipo:"tranquilo",data:null},
          log:[`${mes}, Año ${anio}: ¡Reelecto con ${voto}%! Segundo mandato.`,...s.log].slice(0,30)};
      }
      if (s.turno === 97) {
        const voto = calcVoto(s.zonas, s.r.cohesion, s.r.imagen, s.conf);
        return {...s, juegoTerminado:true, victoria:voto>=55,
          mensajeFinal:voto>=55
            ?`Completaste 8 años. ${voto}% de aprobación. Gobernador histórico.`
            :`Terminaste el mandato con ${voto}% de aprobación.`};
      }

      let ns = {...s};
      ns.r = {...ns.r,
        imagen: cl(ns.r.imagen-1.5),
        cohesion: cl(ns.r.cohesion-0.8),
        capital: cl(ns.r.capital+1.5),
        presupuesto: cl(ns.r.presupuesto+4),
      };
      if (!ns.presidentePropio) {
        if (ns.conf>65) ns.r = {...ns.r, presupuesto: cl(ns.r.presupuesto-9)};
        else if (ns.conf<30) ns.r = {...ns.r, presupuesto: cl(ns.r.presupuesto+5)};
      } else {
        ns.r = {...ns.r, presupuesto: cl(ns.r.presupuesto + (Math.random()>0.4?3:-2))};
      }
      ns.zonas = ns.zonas.map(z=>({...z, lealtad:cl(z.lealtad+(Math.random()>0.55?1:-1),8,92)}));

      const evento = generarEvento(ns.turno, ns.conf, ns.presidentePropio, ns.usados);
      const prefijo = `${mes}, Año ${anio}: `;
      let logMsg = "";
      if (evento.tipo==="tranquilo")     logMsg = prefijo+"Mes tranquilo. Gestión ordinaria.";
      else if (evento.tipo==="noticia")  logMsg = prefijo+evento.data.txt;
      else if (evento.tipo==="presidente") logMsg = prefijo+evento.data.txt;
      else if (evento.tipo==="legislatura") logMsg = prefijo+"Legislatura: "+evento.data.titulo;
      else if (evento.tipo==="intendente") logMsg = prefijo+`${evento.data.zona.intendente} (${evento.data.zona.nombre}): ${evento.data.demanda.txt}`;
      else if (evento.tipo==="lobby")    logMsg = prefijo+`${evento.data.empresa.nombre}: ${evento.data.demanda.txt}`;

      return {...ns, evento, eventoResuelto:evento.tipo==="tranquilo", inversionHecha:false,
        fase:"evento", log:[logMsg,...ns.log].slice(0,30)};
    });
  };

  const resolverNoticia = () => {
    patch(s => {
      const ev = s.evento.data;
      let ns = applyR(s, ev.efecto||{}, ev.zona, ev.zona?4:0, 0);
      return {...ns, eventoResuelto:true};
    });
  };

  const resolverPresidente = (nivel) => {
    patch(s => {
      const ev = s.evento.data;
      const alto = s.conf > 50;
      const efecto = ev.efecto_conf[alto?"alto":"bajo"];
      const dConf = nivel==="resistir" ? +10 : -8;
      let ns = applyR(s, efecto, null, 0, dConf);
      const msg = nivel==="resistir"
        ? "Resististe la presión de Nación. Confrontación sube."
        : "Cediste ante Nación. Confrontación baja.";
      return {...ns, eventoResuelto:true, log:[msg,...ns.log].slice(0,30)};
    });
  };

  const resolverLegislatura = (opcion) => {
    patch(s => {
      const ley = s.evento.data;
      const efecto = ley[opcion];
      let ns = applyR(s, efecto, null, 0, 0);
      const labels = {aprobar:"Aprobaste",vetar:"Vetaste",abstenerse:"Te abstuviste en"};
      return {...ns, eventoResuelto:true,
        usados:{...ns.usados, leyes:[...ns.usados.leyes, ley.id]},
        log:[`${labels[opcion]} la ley: ${ley.titulo}.`,...ns.log].slice(0,30)};
    });
  };

  const resolverIntendente = (aceptar) => {
    patch(s => {
      const { zona, demanda } = s.evento.data;
      const area = AREAS.find(a=>a.id===demanda.area);
      const zonaData = ZONAS.find(z=>z.id===zona.id);
      const esPreferida = zonaData?.prefers?.includes(demanda.area);
      if (aceptar) {
        const bonusLealtad = esPreferida ? 14 : 8;
        const efecto = { presupuesto: -(area.costo), imagen: Math.round(area.img_op*0.5+area.img_pr*0.5) };
        let ns = applyR(s, efecto, zona.id, bonusLealtad, 0);
        const extra = esPreferida ? " ⭐ ¡Era lo que necesitaban! Bonus de lealtad." : "";
        return {...ns, eventoResuelto:true,
          log:[`Invertiste en ${area.nombre} para ${zona.intendente}.${extra}`,...ns.log].slice(0,30)};
      } else {
        const malus = esPreferida ? -10 : -6;
        let ns = applyR(s, {cohesion:-6, capital:-3}, zona.id, malus, 0);
        const extra = esPreferida ? " Era su prioridad — la zona queda muy resentida." : "";
        return {...ns, eventoResuelto:true,
          log:[`Rechazaste la demanda de ${zona.intendente}.${extra}`,...ns.log].slice(0,30)};
      }
    });
  };

  const resolverLobby = (aceptar) => {
    patch(s => {
      const { demanda, empresa } = s.evento.data;
      const efecto = aceptar ? demanda.si : demanda.no;
      const dConf = aceptar ? -5 : 0;
      const lobbyIdx = DEMANDAS_LOBBY.indexOf(demanda);
      let ns = applyR(s, efecto, null, 0, dConf);
      const msg = aceptar
        ? `Accediste a la demanda de ${empresa.nombre}.`
        : `Rechazaste la demanda de ${empresa.nombre}.`;
      return {...ns, eventoResuelto:true,
        usados:{...ns.usados, lobby:[...ns.usados.lobby, lobbyIdx]},
        log:[msg,...ns.log].slice(0,30)};
    });
  };

  const confirmarInversion = () => {
    if (!invArea || !invAccion) return;
    patch(s => {
      const area = AREAS.find(a=>a.id===invArea);
      const nivelActual = s.inversiones[invArea];
      let efecto = {}, nuevoNivel = nivelActual, msg = "";
      if (invAccion==="invertir") {
        if (nivelActual >= 1) return s;
        efecto = { presupuesto: -(area.costo), imagen: Math.round(area.img_op*0.5+area.img_pr*0.5) };
        nuevoNivel = 1;
        msg = `Invertiste en ${area.nombre}. Imagen +${efecto.imagen}, Presupuesto ${efecto.presupuesto}.`;
      } else {
        if (nivelActual <= 0) return s;
        efecto = { presupuesto: +Math.round(area.costo*0.7), imagen: -(Math.round(area.img_op*0.3)) };
        nuevoNivel = -1;
        msg = `Recortaste ${area.nombre}. Recuperás presupuesto, imagen baja.`;
      }
      let ns = applyR(s, efecto, null, 0, 0);
      return {...ns, inversiones:{...ns.inversiones,[invArea]:nuevoNivel},
        inversionHecha:true, log:[msg,...ns.log].slice(0,30)};
    });
    setInvModal(false); setInvArea(null); setInvAccion(null);
  };

  const cerrarMes = () => {
    patch(s => ({...s, turno: s.turno+1, evento:null, eventoResuelto:false, inversionHecha:false}));
    iniciarMes();
  };

  const lanzarCandidato = () => {
    patch(s => {
      const fuerza = calcFuerza(s.r.imagen, s.r.presupuesto, s.conf);
      const gana = fuerza >= 52;
      let ns = applyR(s, {capital:-15}, null, 0, 0);
      return {...ns, campania:false, presidentePropio:gana, fuerzaCandidato:fuerza,
        eventoResuelto:true, evento:{tipo:"tranquilo",data:null},
        log:[gana
          ? `🏆 Tu candidato ganó la presidencia (fuerza ${fuerza}/100). Tenés presidente propio.`
          : `💀 Tu candidato perdió (fuerza ${fuerza}/100). Seguís con presidente opositor.`
        ,...ns.log].slice(0,30)};
    });
  };

  const reunionDeBloque = () => {
    patch(s => {
      if (s.r.capital < 12) return s;
      let ns = applyR(s, {capital:-12, cohesion:+14}, null, 0, 0);
      return {...ns, log:["🤝 Reunión de bloque. Cohesión sube, usaste capital político.",...ns.log].slice(0,30)};
    });
  };

  // ─── RENDER ───────────────────────────────────────────────

  const { turno, r, zonas, conf, log, evento, eventoResuelto, inversionHecha,
    inversiones, juegoTerminado, victoria, mensajeFinal, presidentePropio,
    fuerzaCandidato, campania } = st;

  const { mes, anio } = mesAnio(turno);
  const votoActual = calcVoto(zonas, r.cohesion, r.imagen, conf);
  const fzCand = calcFuerza(r.imagen, r.presupuesto, conf);
  const anioJ = Math.ceil(turno/12);
  const esOpositor = !presidentePropio && anioJ <= 4;
  const mesIniciado = !!evento;
  // Botón avanzar solo aparece cuando el evento está resuelto
  const puedeAvanzar = eventoResuelto;
  // Hay evento pendiente sin resolver
  const tieneEventoPendiente = evento && !eventoResuelto;

  const TABS = [
    { id:"tablero", label:"Tablero", icon:"📊" },
    { id:"zonas",   label:"Territorios", icon:"🗺️" },
    { id:"areas",   label:"Políticas", icon:"⚙️" },
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text,
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", paddingBottom:80 }}>

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${C.tealDark}, ${C.teal})`,
        padding: "16px 18px 14px", color:"#fff",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      }}>
        <div>
          <div style={{ fontSize:10, opacity:0.7, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>
            Provincia de Buenos Aires
          </div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:0.5 }}>GOBERNADOR</div>
          <div style={{ fontSize:12, opacity:0.8, marginTop:2 }}>{mes} · Año {anio} de 8</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{
            background: esOpositor ? "rgba(229,57,53,0.25)" : "rgba(255,255,255,0.2)",
            borderRadius:20, padding:"4px 12px", fontSize:11,
            border: esOpositor ? "1px solid rgba(229,57,53,0.5)" : "1px solid rgba(255,255,255,0.4)",
          }}>
            {esOpositor ? "🏛️ Pdte. Opositor" : "🤝 Pdte. Propio"}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", background:C.surface, borderBottom:`1px solid ${C.border}`,
        position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"12px 0 10px", background:"none", border:"none",
            borderBottom: tab===t.id ? `3px solid ${C.teal}` : "3px solid transparent",
            color: tab===t.id ? C.teal : C.textMuted,
            cursor:"pointer", fontSize:12, fontWeight:600, display:"flex",
            flexDirection:"column", alignItems:"center", gap:2, transition:"color 0.2s",
          }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"14px 16px", maxWidth:540, margin:"0 auto" }}>

        {/* ── TAB TABLERO ── */}
        {tab==="tablero" && <>

          {/* Stats card */}
          <div style={{ background:C.surface, borderRadius:16, padding:16, marginBottom:12, boxShadow:C.shadow }}>
            <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:14 }}>Recursos</div>
            <StatBar label="Presupuesto"      value={r.presupuesto} color={C.amber}  icon="💰"/>
            <StatBar label="Capital Político" value={r.capital}     color={C.red}    icon="🃏"/>
            <StatBar label="Imagen Pública"   value={r.imagen}      color={C.teal}   icon="📰"/>
            <StatBar label="Cohesión del Bloque" value={r.cohesion} color={C.purple} icon="🏛️"/>
            <ConfBar valor={conf}/>
          </div>


          {/* Evento pendiente banner */}
          {tieneEventoPendiente && (
            <div style={{
              background: C.amberLight, border:`1px solid ${C.amber}60`,
              borderRadius:14, padding:"12px 16px", marginBottom:12,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <span style={{ fontSize:22 }}>⚠️</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.amber }}>Evento pendiente</div>
                <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>
                  Tenés que resolver el evento del mes antes de avanzar
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          {!juegoTerminado && !campania && (
            <div style={{ background:C.surface, borderRadius:16, padding:16, boxShadow:C.shadow }}>
              <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, letterSpacing:1.5,
                textTransform:"uppercase", marginBottom:14 }}>Acciones del mes</div>

              {!mesIniciado && (
                <ActionBtn onClick={iniciarMes} label={`Iniciar ${mes}, Año ${anio} →`} color={C.teal}/>
              )}

              {mesIniciado && (
                <>
                  <ActionBtn
                    onClick={()=>setInvModal(true)}
                    label={inversionHecha ? "✅ Inversión realizada" : "💰 Gestionar presupuesto"}
                    color={inversionHecha ? C.teal : C.blue}
                    outline={inversionHecha}
                  />
                  <ActionBtn
                    onClick={reunionDeBloque}
                    label={`🤝 Reunión de bloque (-12 capital, +14 cohesión)`}
                    color={C.purple}
                    outline
                    disabled={r.capital < 12}
                  />
                  {/* Solo muestra "Cerrar mes" cuando el evento está resuelto */}
                  {puedeAvanzar && (
                    <ActionBtn onClick={cerrarMes} label="Cerrar mes y avanzar →" color={C.teal}/>
                  )}
                </>
              )}
            </div>
          )}

          {/* Log */}
          <div style={{ background:C.surface, borderRadius:16, padding:16, marginTop:12, boxShadow:C.shadow }}>
            <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:10 }}>Registro</div>
            <div style={{ maxHeight:160, overflowY:"auto" }}>
              {log.map((l,i)=>(
                <div key={i} style={{
                  fontSize:12, color:i===0?C.text:C.textMuted, marginBottom:7, lineHeight:1.5,
                  paddingBottom:7, borderBottom:i<log.length-1?`1px solid ${C.border}`:"none",
                }}>{l}</div>
              ))}
            </div>
          </div>
        </>}

        {/* ── TAB ZONAS ── */}
        {tab==="zonas" && (
          <>
            <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:12 }}>Territorios ({zonas.length})</div>
            {zonas.map(z=>(
              <ZonaCard key={z.id} zona={z} onInvertir={()=>{
                patch(s=>{
                  let ns = applyR(s,{capital:-8,imagen:+3},z.id,+7,0);
                  return {...ns, log:[`Capital político volcado en ${z.nombre}.`,...ns.log].slice(0,30)};
                });
              }}/>
            ))}
          </>
        )}

        {/* ── TAB ÁREAS ── */}
        {tab==="areas" && (
          <>
            <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:4 }}>Áreas de Inversión</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>
              Invertir sube imagen. Recortar recupera presupuesto pero daña imagen.
            </div>
            {AREAS.map(a=>(
              <AreaCard key={a.id} area={a} nivel={inversiones[a.id]}
                onClick={()=>{ setInvArea(a.id); setInvAccion(null); setInvModal(true); }}/>
            ))}
          </>
        )}
      </div>

      {/* ── BOTTOM STATS BAR ── */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:C.surface, borderTop:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-around", alignItems:"center",
        padding:"10px 0 12px", boxShadow:"0 -2px 12px rgba(0,0,0,0.08)", zIndex:20,
      }}>
        {[
          { icon:"💰", val:`${r.presupuesto}%`, label:"Presupuesto", warn:r.presupuesto<25 },
          { icon:"📰", val:`${r.imagen}%`,      label:"Imagen",      warn:r.imagen<25 },
          { icon:"🗳️", val:`${votoActual}%`,   label:"Encuestas",   warn:votoActual<50 },
          { icon:"📅", val:`A${anio}M${(turno-1)%12+1}`, label:"Período", warn:false },
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:s.warn?C.red:C.text, fontWeight:700 }}>
              {s.icon} {s.val}
            </div>
            <div style={{ fontSize:9, color:C.textMuted, marginTop:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── MODAL INVERSIÓN ── */}
      {invModal && !juegoTerminado && (
        <Modal titulo="Gestión Presupuestaria" icono="💰" color={C.blue}>
          <div style={{ fontSize:13, color:C.textSub, marginBottom:14 }}>
            Presupuesto disponible: <strong style={{color:C.amber}}>{r.presupuesto}%</strong>
          </div>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:8, fontWeight:600 }}>¿Qué área?</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {AREAS.map(a=>(
              <button key={a.id} onClick={()=>setInvArea(a.id)} style={{
                background: invArea===a.id ? C.blueLight : C.bg,
                border: `2px solid ${invArea===a.id ? C.blue : C.border}`,
                color: C.text, borderRadius:12, padding:"12px 10px",
                cursor:"pointer", fontSize:13, textAlign:"left",
              }}>
                <div style={{fontSize:20,marginBottom:4}}>{a.icono}</div>
                <div style={{fontSize:12,fontWeight:600}}>{a.nombre}</div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>
                  {inversiones[a.id]===1?"✅ invertido":inversiones[a.id]===-1?"✂️ recortado":"—"}
                </div>
              </button>
            ))}
          </div>
          {invArea && (
            <>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:8, fontWeight:600 }}>¿Qué hacés?</div>
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <button onClick={()=>setInvAccion("invertir")} style={{
                  flex:1, background: invAccion==="invertir"?C.tealLight:C.bg,
                  border:`2px solid ${invAccion==="invertir"?C.teal:C.border}`,
                  color:C.text, borderRadius:12, padding:12, cursor:"pointer",
                  opacity:inversiones[invArea]===1?0.4:1,
                }}>
                  <div style={{fontSize:18}}>⬆️</div>
                  <div style={{fontSize:12,fontWeight:600,marginTop:4}}>Invertir</div>
                  <div style={{fontSize:10,color:C.textMuted}}>-{AREAS.find(a=>a.id===invArea)?.costo}% presup.</div>
                </button>
                <button onClick={()=>setInvAccion("desinvertir")} style={{
                  flex:1, background: invAccion==="desinvertir"?C.redLight:C.bg,
                  border:`2px solid ${invAccion==="desinvertir"?C.red:C.border}`,
                  color:C.text, borderRadius:12, padding:12, cursor:"pointer",
                  opacity:inversiones[invArea]<=0?0.4:1,
                }}>
                  <div style={{fontSize:18}}>⬇️</div>
                  <div style={{fontSize:12,fontWeight:600,marginTop:4}}>Recortar</div>
                  <div style={{fontSize:10,color:C.textMuted}}>+{Math.round((AREAS.find(a=>a.id===invArea)?.costo||0)*0.7)}% presup.</div>
                </button>
              </div>
            </>
          )}
          <ActionBtn onClick={confirmarInversion} label="Confirmar →" color={C.blue} disabled={!invArea||!invAccion}/>
          <ActionBtn onClick={()=>{setInvModal(false);setInvArea(null);setInvAccion(null);}}
            label="Cancelar" color={C.textMuted} outline/>
        </Modal>
      )}

      {/* ── MODAL EVENTOS ── */}
      {evento && !eventoResuelto && !juegoTerminado && (()=>{
        const { tipo, data } = evento;

        if (tipo==="noticia") return (
          <Modal titulo="Noticia del mes" icono="📰" color={C.teal}>
            <p style={{fontSize:15,color:C.text,fontWeight:600,marginBottom:10,lineHeight:1.5}}>{data.txt}</p>
            {Object.keys(data.efecto).length>0 && <EffectTags efecto={data.efecto}/>}
            {!data.impacto && <p style={{fontSize:12,color:C.textMuted,margin:"8px 0 12px"}}>Esta noticia no afecta directamente tu gestión.</p>}
            <ActionBtn onClick={resolverNoticia} label={data.impacto?"Gestionar →":"Entendido →"} color={C.teal}/>
          </Modal>
        );

        if (tipo==="presidente") return (
          <Modal titulo="Conflicto con Nación" icono="🏛️" color={C.red}>
            <p style={{fontSize:15,color:C.text,fontWeight:600,marginBottom:10,lineHeight:1.5}}>{data.txt}</p>
            <div style={{
              background:C.bg, borderRadius:10, padding:12, marginBottom:14,
              fontSize:13, color:C.textSub,
            }}>
              Confrontación actual: <strong style={{color:conf>65?C.red:conf>35?C.amber:C.teal}}>{conf}%</strong>
              {" "}— los efectos dependen de tu nivel.
            </div>
            <ActionBtn onClick={()=>resolverPresidente("resistir")} label="⚡ Resistir (+10 confrontación)" color={C.red}/>
            <ActionBtn onClick={()=>resolverPresidente("ceder")}    label="🤝 Ceder (-8 confrontación)"    color={C.teal} outline/>
          </Modal>
        );

        if (tipo==="legislatura") return (
          <Modal titulo="El Parlamento votó" icono="📜" color={C.purple}>
            <p style={{fontSize:15,color:C.text,fontWeight:600,marginBottom:6,lineHeight:1.5}}>{data.titulo}</p>
            <p style={{fontSize:13,color:C.textSub,marginBottom:14,lineHeight:1.5}}>{data.descripcion}</p>
            {["aprobar","vetar","abstenerse"].map(op=>(
              <button key={op} onClick={()=>resolverLegislatura(op)} style={{
                width:"100%", background:C.bg, border:`1px solid ${C.border}`,
                color:C.text, borderRadius:12, padding:"14px 16px", cursor:"pointer",
                marginBottom:8, textAlign:"left",
              }}>
                <div style={{fontSize:14,fontWeight:700,textTransform:"capitalize",marginBottom:6}}>
                  {op==="aprobar"?"✅ Aprobar":op==="vetar"?"🚫 Vetar":"⏸️ Abstenerse"}
                </div>
                <EffectTags efecto={data[op]}/>
              </button>
            ))}
          </Modal>
        );

        if (tipo==="intendente") {
          const area = AREAS.find(a=>a.id===data.demanda.area);
          const zonaData = ZONAS.find(z=>z.id===data.zona.id);
          const esPreferida = zonaData?.prefers?.includes(data.demanda.area);
          // data.zona viene de la constante ZONAS (sin lealtad), buscamos en el estado
          const lealtadActual = Math.round(zonas.find(z=>z.id===data.zona.id)?.lealtad ?? data.zona.base);
          return (
            <Modal titulo={data.zona.intendente} icono="👥" color={C.blue}>
              <p style={{fontSize:14,color:C.textSub,marginBottom:6}}>{data.zona.nombre}</p>
              <p style={{fontSize:15,color:C.text,fontWeight:600,marginBottom:12,lineHeight:1.5,textTransform:"capitalize"}}>
                {data.demanda.txt}
              </p>
              {esPreferida && (
                <div style={{background:"#f3e5f5",borderRadius:10,padding:10,marginBottom:12,
                  fontSize:12,color:"#6a1b9a",fontWeight:600}}>
                  ⭐ Esta es la prioridad histórica de la zona. Aceptar da +14 lealtad (vs +8 normal).
                </div>
              )}
              <div style={{
                background:C.bg, borderRadius:10, padding:12, marginBottom:14,
                display:"flex", justifyContent:"space-between", fontSize:13,
              }}>
                <span style={{color:C.textSub}}>Lealtad de zona</span>
                <strong style={{color:lealtadActual>=55?C.teal:C.red}}>{lealtadActual}%</strong>
              </div>
              <ActionBtn
                onClick={()=>resolverIntendente(true)}
                label={`✅ Aceptar — ${area?.icono} ${area?.nombre} (-${area?.costo}% presup, +${esPreferida?14:8} lealtad)`}
                color={C.teal}
              />
              <ActionBtn onClick={()=>resolverIntendente(false)} label={`❌ Rechazar (-6 cohesión, ${esPreferida?"-10":"-6"} lealtad)`} color={C.red} outline/>
            </Modal>
          );
        }

        if (tipo==="lobby") return (
          <Modal titulo={data.empresa.nombre} icono={data.empresa.icono} color={C.amber}>
            <p style={{fontSize:15,color:C.text,fontWeight:600,marginBottom:14,lineHeight:1.5}}>{data.demanda.txt}</p>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,background:C.tealLight,borderRadius:10,padding:12}}>
                <div style={{fontSize:11,color:C.tealDark,fontWeight:700,marginBottom:6}}>SI ACEPTÁS</div>
                <EffectTags efecto={data.demanda.si}/>
              </div>
              <div style={{flex:1,background:C.redLight,borderRadius:10,padding:12}}>
                <div style={{fontSize:11,color:C.red,fontWeight:700,marginBottom:6}}>SI RECHAZÁS</div>
                <EffectTags efecto={data.demanda.no}/>
              </div>
            </div>
            <ActionBtn onClick={()=>resolverLobby(true)}  label="✅ Aceptar" color={C.amber}/>
            <ActionBtn onClick={()=>resolverLobby(false)} label="🚫 Rechazar" color={C.teal} outline/>
          </Modal>
        );

        return null;
      })()}

      {/* ── MODAL CAMPAÑA ── */}
      {campania && !juegoTerminado && (
        <Modal titulo="Campaña Presidencial" icono="📣" color={C.teal}>
          <p style={{fontSize:13,color:C.textSub,marginBottom:14,lineHeight:1.5}}>
            Es el momento. La fuerza de tu candidato depende del equilibrio entre imagen, presupuesto y confrontación.
          </p>
          <div style={{background:C.bg,borderRadius:12,padding:14,marginBottom:14}}>
            {[["📰 Imagen",r.imagen,C.teal],["💰 Presupuesto",r.presupuesto,C.amber]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:C.textSub}}>{l}</span>
                <span style={{fontSize:13,color:c,fontWeight:700}}>{v}%</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,color:C.textSub}}>⚡ Confrontación (óptimo 35-65%)</span>
              <span style={{fontSize:13,color:conf>=35&&conf<=65?C.teal:C.red,fontWeight:700}}>{conf}%</span>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,marginTop:10,paddingTop:12,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,color:C.text,fontWeight:700}}>Fuerza del candidato</span>
              <span style={{fontSize:20,fontWeight:900,color:fzCand>=52?C.teal:C.red}}>
                {fzCand}/100 {fzCand>=52?"✅":"⚠️"}
              </span>
            </div>
          </div>
          <ActionBtn
            onClick={lanzarCandidato}
            label={`Lanzar candidato (-15 capital político) →`}
            color={fzCand>=52?C.teal:C.red}
          />
        </Modal>
      )}

      {/* ── MODAL FIN ── */}
      {juegoTerminado && (
        <Modal titulo={victoria?"Gobernador Histórico":"Fin de la Gestión"} icono={victoria?"🏆":"💀"} color={victoria?C.teal:C.red}>
          <p style={{fontSize:16,color:victoria?C.teal:C.red,fontWeight:700,marginBottom:16,lineHeight:1.5}}>
            {mensajeFinal}
          </p>
          <div style={{background:C.bg,borderRadius:12,padding:14,marginBottom:16}}>
            {[
              ["🗳️ Intención de voto", `${votoActual}%`],
              ["💰 Presupuesto",       `${r.presupuesto}%`],
              ["📰 Imagen",            `${r.imagen}%`],
              ["🏛️ Cohesión",          `${r.cohesion}%`],
              ["⚡ Confrontación",      `${conf}%`],
              ...(fuerzaCandidato>0?[["🎯 Fuerza candidato",`${fuerzaCandidato}/100`]]:[]),
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
                <span style={{color:C.textSub}}>{l}</span>
                <strong style={{color:C.text}}>{v}</strong>
              </div>
            ))}
          </div>
          <ActionBtn onClick={()=>setSt(initState())} label="Volver a asumir →" color={C.teal}/>
        </Modal>
      )}
    </div>
  );
}
