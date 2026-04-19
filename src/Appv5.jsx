import { useState, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   SMART MOBILITY v5 — AXA Group Operations
   Light/warm-grey theme · Persona-first auth · Full working buttons
   Graphical career paths · Linked Interview → Gap → Plan → Training
   ═══════════════════════════════════════════════════════════════ */

// ── Design Tokens: Light/Warm Grey (Claude-like) ──
const C = {
  bg: "#F5F5F0",       bgSoft: "#EDEDE8",    bgCard: "#FFFFFF",
  bgHover: "#FAFAF7",  bgMuted: "#F0F0EB",
  border: "#E0DED8",   borderLight: "#E8E6E0",
  text: "#1A1A18",     textSec: "#5A5A55",   textMuted: "#8A8A82",
  textDim: "#B0AEA5",
  // AXA brand
  blue: "#00008F",     blueLight: "#2A2AB0",  bluePale: "#EEEEFF",
  // Accents
  teal: "#0D9B7A",     tealLight: "#E6F7F2",  tealDark: "#0A7E63",
  red: "#D4350C",      redPale: "#FEF0EC",
  orange: "#D97706",   orangePale: "#FEF7E6",
  violet: "#6D5BD0",   violetPale: "#F0EDFF",
  ocean: "#0284A8",    oceanPale: "#E6F6FA",
  // Status
  success: "#0D9B7A",  warning: "#D97706", error: "#D4350C", info: "#0284A8",
  white: "#FFFFFF",
};

const FONT = "'DM Sans', 'Helvetica Neue', sans-serif";
const FONT_HEAD = "'Instrument Serif', Georgia, serif";

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:${C.bgSoft}}
::-webkit-scrollbar-thumb{background:${C.borderLight};border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:${C.textDim}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop{0%{transform:scale(.95);opacity:0}100%{transform:scale(1);opacity:1}}
button{cursor:pointer;font-family:${FONT}}
input,select,textarea{font-family:${FONT}}
`;

// ── Shared Styles ──
const S = {
  card: {background:C.bgCard,borderRadius:12,border:`1px solid ${C.border}`,padding:20,marginBottom:14,animation:"fadeUp .4s ease",boxShadow:"0 1px 3px rgba(0,0,0,.04)"},
  btn: {background:C.blue,color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,fontSize:12,display:"inline-flex",alignItems:"center",gap:6,transition:"all .15s",letterSpacing:.2},
  btnSm: {padding:"6px 14px",fontSize:11},
  btnO: {background:"transparent",border:`1.5px solid ${C.blue}`,color:C.blue},
  btnTeal: {background:C.teal},
  btnG: {background:`linear-gradient(135deg,${C.teal},${C.ocean})`},
  btnDanger: {background:C.red},
  badge: {display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:600,letterSpacing:.3},
  input: {background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:12,width:"100%",outline:"none",boxSizing:"border-box",transition:"border-color .2s"},
  select: {background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:12,outline:"none"},
  label: {fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6},
  flex: {display:"flex",alignItems:"center",gap:10},
  between: {display:"flex",justifyContent:"space-between",alignItems:"center"},
  grid2: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:14},
  grid3: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14},
  grid4: {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12},
  tag: {background:C.tealLight,color:C.teal,padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:600,display:"inline-block"},
  h1: {fontFamily:FONT_HEAD,fontSize:26,fontWeight:700,color:C.text},
  h2: {fontFamily:FONT_HEAD,fontSize:20,fontWeight:700,color:C.text},
  h3: {fontSize:15,fontWeight:700,color:C.text},
  sub: {fontSize:12,color:C.textMuted,marginTop:3},
};

// ── Status Badge ──
const Badge = ({status,custom}) => {
  const m={active:C.teal,training:C.orange,idle:C.textMuted,completed:C.teal,"in progress":C.ocean,"not started":C.textDim,planned:C.violet,registered:C.orange,achieved:C.teal,Senior:C.teal,Mid:C.ocean,Junior:C.orange,Lead:C.violet,High:C.red,Medium:C.orange,Low:C.textMuted,"Advanced / expert":C.teal,"Autonomous in daily work":C.ocean,"Able to use tools with guidance":C.orange,"Basic awareness":C.orange,"No knowledge":C.textMuted};
  const c = custom || m[status] || m[status?.toLowerCase()] || C.textMuted;
  return <span style={{...S.badge,background:`${c}15`,color:c,border:`1px solid ${c}22`}}>{status}</span>;
};

// ── Progress Bar ──
const Bar = ({pct,color=C.teal,h=6}) => (
  <div style={{height:h,borderRadius:h/2,background:C.bgSoft,width:"100%",overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h/2,transition:"width .6s ease"}}/>
  </div>
);

// ── Multi-select Chips ──
const Chips = ({options,selected,onToggle,max=24}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
    {options.slice(0,max).map(o=>(
      <span key={o} onClick={()=>onToggle(o)} style={{...S.badge,cursor:"pointer",background:selected.includes(o)?C.tealLight:C.bgSoft,color:selected.includes(o)?C.teal:C.textMuted,border:`1px solid ${selected.includes(o)?C.teal:"transparent"}`,transition:"all .15s"}}>{o}</span>
    ))}
  </div>
);

// ── AXA Logo ──
const Logo = ({size=28}) => (
  <div style={{width:size,height:size,borderRadius:6,background:C.blue,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <span style={{color:"#fff",fontSize:size*.38,fontWeight:800,letterSpacing:-.5}}>AXA</span>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════
const SKILLS = ["Python","JavaScript","React","Azure","AWS","Machine Learning","Deep Learning","NLP","Data Engineering","SQL","Power BI","Tableau","Agile","Scrum","DevOps","CI/CD","Kubernetes","Docker","Terraform","Project Management","Change Management","Stakeholder Management","Risk Analysis","Financial Modeling","UX Design","UI Development","API Design","Microservices","Cloud Architecture","Cybersecurity","Data Privacy","GDPR Compliance","Communication","Leadership","Strategic Thinking","Problem Solving","Prompt Engineering","Agentic AI","RPA","Process Automation","Business Analysis","Product Management","GenAI Applications","LLM Fine-tuning","RAG Architecture","MLOps","Data Governance","Insurance Domain","Negotiation","Presentation Skills"];

const PERSONAS = [
  {id:"admin",label:"Platform Admin",icon:"⚙️",desc:"Full platform access — configuration, users, AI agents, all modules",color:C.red,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports"]},
  {id:"hr",label:"HR / Talent Lead",icon:"👥",desc:"Talent marketplace, career interviews, action plans, skills & reporting",color:C.teal,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports"]},
  {id:"manager",label:"Manager",icon:"📋",desc:"Team management, career interviews, action plans, workflows",color:C.ocean,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows"]},
  {id:"employee",label:"Employee",icon:"👤",desc:"Self-service — your career path, skill profile, interview participation",color:C.violet,access:["dashboard","charter","marketplace","careers","skills"]},
];

const EMPLOYEES = [
  {id:1,name:"Sophie Laurent",role:"Data Scientist",dept:"Data & AI",skills:["Python","Machine Learning","SQL","Deep Learning"],level:"Senior",avatar:"SL",aiLevel:"Advanced / expert"},
  {id:2,name:"Marc Dubois",role:"DevOps Engineer",dept:"Technology",skills:["Kubernetes","Docker","CI/CD","Terraform"],level:"Mid",avatar:"MD",aiLevel:"Autonomous in daily work"},
  {id:3,name:"Amina Benali",role:"Product Manager",dept:"Product",skills:["Product Management","Agile","UX Design","Stakeholder Management"],level:"Senior",avatar:"AB",aiLevel:"Able to use tools with guidance"},
  {id:4,name:"Thomas Moreau",role:"Financial Analyst",dept:"Finance",skills:["Financial Modeling","Power BI","SQL","Risk Analysis"],level:"Junior",avatar:"TM",aiLevel:"Basic awareness"},
  {id:5,name:"Elena Rossi",role:"HR Business Partner",dept:"HR & Talent",skills:["Change Management","Stakeholder Management","Communication","Leadership"],level:"Mid",avatar:"ER",aiLevel:"Able to use tools with guidance"},
  {id:6,name:"Karim Hassan",role:"Cloud Architect",dept:"Technology",skills:["Azure","AWS","Cloud Architecture","Microservices","Cybersecurity"],level:"Lead",avatar:"KH",aiLevel:"Advanced / expert"},
  {id:7,name:"Claire Martin",role:"UX Designer",dept:"Product",skills:["UX Design","UI Development","Communication","Problem Solving"],level:"Senior",avatar:"CM",aiLevel:"Autonomous in daily work"},
  {id:8,name:"Yuki Tanaka",role:"ML Engineer",dept:"Data & AI",skills:["Python","Deep Learning","MLOps","LLM Fine-tuning","RAG Architecture"],level:"Senior",avatar:"YT",aiLevel:"Advanced / expert"},
];

const AI_AGENTS = [
  {id:"ai-1",name:"AXA-SkillMatch",role:"Skills Matching",skills:["NLP","Recommendation Engine","Skills Taxonomy"],status:"active",desc:"Matches employee skills to open positions via semantic analysis.",accuracy:94,tasks:127},
  {id:"ai-2",name:"AXA-CareerPath",role:"Career Advisor",skills:["Career Modeling","Gap Analysis","Predictive Analytics"],status:"active",desc:"Generates personalized career trajectories based on skills & market demand.",accuracy:91,tasks:84},
  {id:"ai-3",name:"AXA-LearnRec",role:"Learning Recommender",skills:["Content Curation","Learning Analytics","Certification Mapping"],status:"training",desc:"Suggests training programs & certifications aligned with development plans.",accuracy:87,tasks:0},
  {id:"ai-4",name:"AXA-WorkforceAI",role:"Workforce Planning",skills:["Demand Forecasting","Supply Modeling","Scenario Analysis"],status:"active",desc:"Forecasts talent demand/supply across business units.",accuracy:92,tasks:56},
  {id:"ai-5",name:"AXA-InterviewBot",role:"Interview Copilot",skills:["Conversation AI","Sentiment Analysis","Competency Assessment"],status:"idle",desc:"Assists during career interviews with real-time suggestions.",accuracy:85,tasks:0},
];

const INTERVIEW_QUESTIONS = [
  {id:1,text:"What are your overall long-term career aspirations?",type:"single",options:["Grow as an expert in my current field","Move into a different functional area","Move into people management","Move into a strategic / transversal role","Explore international or cross-entity opportunities","I am not sure yet"]},
  {id:2,text:"What are your short to medium-term aspirations within AXA? (3-5 years)",type:"single",options:["Progress in my current role","Take on a different role at a similar level","Take on a higher-responsibility role","Participate in short-term missions / projects"]},
  {id:3,text:"Which aspirations align most with AXA's job opportunities?",type:"text",options:[],note:"Interviewer provides future job samples (e.g. Agentic AI roles)"},
  {id:4,text:"What are your current skills and strengths?",type:"multi",options:SKILLS.slice(0,20)},
  {id:5,text:"What is your current level of AI skills and competency?",type:"single",options:["No knowledge","Basic awareness","Able to use tools with guidance","Autonomous in daily work","Advanced / expert"]},
  {id:6,text:"What skills are you most eager to develop toward your career aspiration?",type:"multi",options:SKILLS.slice(10,30)},
  {id:7,text:"Are you interested in exploring a job change in the short term?",type:"single",options:["Yes","No"],conditional:true},
  {id:"7a",text:"What are the reasons for not exploring mobility at this time?",type:"single",options:["I feel comfortable in my current role","Skill gaps to address first","No visible opportunities"],conditionOn:7,conditionValue:"No"},
  {id:8,text:"When would you be open to making a job change?",type:"single",options:["Within 6 months","6–12 months","1–2 years","More than 2 years","I don't foresee a move"]},
  {id:9,text:"Would you consider geographic mobility?",type:"single",options:["Yes, internationally","Yes, within my country","Yes, remote only","No"]},
  {id:10,text:"What training or development activities do you need to pursue?",type:"multi",options:["Formal training","On-the-job learning","Mentoring / coaching","Short-term mission (Be In My Shoes)","Certification","No specific action needed"]},
  {id:11,text:"Are there specific opportunities you want to explore?",type:"text",options:[]},
];

const CHARTER_SECTIONS = [
  {title:"The Smart Mobility Ecosystem",icon:"🌐",subs:[{t:"Today → Tomorrow",c:"Transition from Human-Only to Hybrid Human+Agent teams. AI: Automate, Analyse, Recommend. Human: Decide, Validate, Contextualise, Accountable.",hl:"Human always stays accountable for every outcome"},{t:"AXA Entities Integration",c:"AXA entities provide Business Roadmap & Skills Needs → Central Matching Engine connects Talents & Agentics to Roles/Positions."},{t:"Roles & Positions",c:"Orchestration (Strategy · Direction · Judgment), Execution (Delivery · Operations · Analysis), Hybrid (Human + Agent · Extended Capacity)."}]},
  {title:"Guiding Principles",icon:"📐",subs:[{t:"01 – Hybrid Teams",c:"AI enablement & convergence"},{t:"02 – Scope Definition",c:"Define scope for org change & impacted resources"},{t:"03 – Urgency Varies",c:"Mobility urgency varies by function & stakeholder"},{t:"04 – SLA/KPIs",c:"Managers mandated to support with objective metrics"},{t:"05 – Business-Need Driven",c:"Short & long-term goals"},{t:"06 – Internal First",c:"Internal mobility always prioritized over external"},{t:"07 – Industry Standard",c:"Short-term: reach industry mobility standard"},{t:"08 – Business-Critical",c:"Framework shaped by business-critical priorities"}]},
  {title:"Business Case",icon:"📊",subs:[{t:"Time to Productivity",c:"Internal: Weeks | External: 6–12 months"},{t:"Cost",c:"Internal: Low/Zero | External: 1–2× salary"},{t:"Cultural Fit",c:"Internal: Embedded | External: Risk"},{t:"Knowledge Retention",c:"Internal: 100% retained | External: Lost & rebuilt"},{t:"Compounding Returns",c:"Internal: Yes — grows | External: No — resets"}]},
];

const DOMAINS = ["Technology","Data & AI","Operations","Finance","HR & Talent","Risk & Compliance","Product","Strategy"];
const TYPES = ["Expert","Management","Hybrid"];

const genPaths = () => {
  const t=[
    {d:"Technology",p:["Junior Dev → Senior Dev → Tech Lead → Staff Engineer → Principal Architect","Support Analyst → Platform Engineer → SRE Lead → VP Infrastructure","QA Engineer → QA Lead → Test Architect → Quality Director","Frontend Dev → UI Engineer → Design System Lead → UX Director","Backend Dev → API Architect → Platform Lead → CTO Track","Mobile Dev → Mobile Lead → Cross-Platform Architect","Security Analyst → Security Engineer → CISO Track","DevOps Engineer → Platform Lead → Cloud Director","Network Engineer → Network Architect → Infra VP","Data Engineer → Data Platform Lead → CDO Track","IT Support → Systems Admin → IT Manager → IT Director","Release Manager → Engineering Manager → VP Engineering","Integration Dev → ESB Architect → Enterprise Architect"]},
    {d:"Data & AI",p:["Data Analyst → Senior Analyst → Analytics Manager → Head of Analytics","ML Engineer → Senior ML → ML Lead → AI Director","Data Scientist → Lead Scientist → Head of DS → Chief Data Scientist","BI Analyst → BI Developer → BI Manager → Analytics VP","AI Researcher → Applied AI Lead → AI Strategy Director","NLP Engineer → Conversational AI Lead → AI Product Director","MLOps Engineer → ML Platform Lead → AI Infra Director","CV Engineer → CV Lead → Applied AI VP","Data Governance Analyst → DG Manager → Chief Data Officer","Prompt Engineer → AI Solutions Architect → GenAI Director","AI Ethics Analyst → Responsible AI Lead → AI Policy Director","Statistician → Lead Statistician → Quantitative Director","Knowledge Engineer → Ontology Lead → KG Director"]},
    {d:"Operations",p:["Ops Analyst → Ops Manager → Head of Operations → COO Track","Process Analyst → Process Lead → Process Excellence Director","Service Desk → Service Manager → IT Service Director","Claims Handler → Claims Lead → Claims Ops Director","Underwriting Asst → Underwriter → Chief Underwriter","Supply Chain Analyst → SC Manager → VP Supply Chain","Quality Analyst → Quality Manager → VP Quality","Logistics Coord → Logistics Manager → VP Logistics","Facilities Coord → Facilities Manager → VP Real Estate","BPO Analyst → BPO Manager → Outsourcing Director","Procurement Analyst → Procurement Manager → CPO Track","Vendor Manager → Strategic Sourcing Lead → VP Procurement","Ops Research → OR Lead → Decision Science Director"]},
    {d:"Finance",p:["Financial Analyst → Senior FA → Finance Manager → CFO Track","Accountant → Senior Accountant → Controller → VP Finance","Actuary → Senior Actuary → Chief Actuary","Internal Auditor → Audit Manager → Chief Audit Executive","Tax Analyst → Tax Manager → VP Tax","Treasury Analyst → Treasury Manager → VP Treasury","FP&A Analyst → FP&A Manager → VP Financial Planning","Investment Analyst → Portfolio Manager → CIO Track","Compliance Analyst → Compliance Manager → CCO","Revenue Analyst → Revenue Manager → VP Revenue Ops","Cost Analyst → Cost Manager → VP Cost Optimization","Billing Specialist → Billing Manager → Revenue Cycle Dir","Credit Analyst → Credit Manager → Chief Credit Officer"]},
    {d:"HR & Talent",p:["HR Coordinator → HRBP → HR Manager → HR Director → CHRO","Recruiter → Senior Recruiter → TA Lead → VP TA","L&D Specialist → L&D Manager → Chief Learning Officer","Comp & Ben Analyst → C&B Manager → Total Rewards Dir","HRIS Analyst → HRIS Manager → HR Technology Director","Employee Relations → ER Manager → VP Employee Experience","Workforce Planner → WFP Manager → VP Workforce Strategy","DE&I Coordinator → DE&I Manager → Chief Diversity Officer","TM Specialist → TM Lead → VP Talent","OD Consultant → OD Manager → VP Org Development","Career Coach → Career Dev Lead → VP Mobility","Change Manager → Change Lead → VP Transformation","People Analytics → PA Manager → VP People Insights"]},
    {d:"Risk & Compliance",p:["Risk Analyst → Risk Manager → CRO Track","Compliance Officer → Senior Compliance → VP Compliance","Fraud Analyst → Fraud Manager → VP Fraud Prevention","AML Analyst → AML Manager → VP Financial Crime","Regulatory Affairs → Reg Manager → VP Regulatory","Info Security Analyst → CISO Track","Privacy Analyst → DPO Track","OpRisk Analyst → OpRisk Manager → VP Operational Risk","Market Risk → Market Risk Lead → VP Market Risk","Credit Risk → Credit Risk Manager → VP Credit Risk","Model Risk → Model Validation Lead → VP Model Risk","Business Continuity → BC Manager → VP Resilience","Third Party Risk → TPRM Lead → VP Vendor Risk"]},
    {d:"Product",p:["Product Analyst → PM → Senior PM → VP Product","UX Researcher → UX Lead → Head of Design","Product Designer → Design Lead → Chief Design Officer","Growth Analyst → Growth Manager → VP Growth","Product Owner → Senior PO → Head of Product","Technical Writer → Doc Lead → VP Content Strategy","Product Marketing → PMM Lead → VP Product Marketing","Customer Success → CS Manager → VP Customer Success","Solutions Architect → Solutions Dir → VP Solutions","Product Ops → ProdOps Lead → VP Product Operations","API PM → Platform PM → VP Platform","Digital Product → Digital Lead → Chief Digital Officer","Innovation Analyst → Innovation Lead → VP Innovation"]},
    {d:"Strategy",p:["Strategy Analyst → Strategy Manager → VP Strategy → CSO","M&A Analyst → M&A Manager → VP Corporate Dev","Business Dev → BD Manager → VP Business Dev","Market Research → Insights Manager → VP Market Intel","Partnerships → Partnership Lead → VP Alliances","Transformation Lead → VP Transformation → CTO","Corp Planning → Planning Dir → VP Corporate Strategy","Competitive Intel → CI Manager → VP Strategic Intel","Digital Strategy → DT Lead → CDO","ESG Analyst → ESG Manager → Chief Sustainability Officer","Innovation Strategy → Innovation Dir → VP Innovation","Portfolio Strategy → Portfolio Dir → VP Portfolio Mgmt","New Ventures → Ventures Lead → VP New Business"]},
  ];
  let id=1;const paths=[];
  t.forEach(g=>g.p.forEach((p,i)=>{const steps=p.split(" → ");paths.push({id:id++,domain:g.d,type:TYPES[i%3],name:steps[steps.length-1],steps:steps.map((s,si)=>({title:s,level:si+1,skills:SKILLS.slice((id+si*3)%30,(id+si*3)%30+3)}))});}));
  return paths;
};

const WF_STEPS = ["Scheduled","Interview","Gap Analysis","Action Plan","Training","Assessment","Completed"];

// ══════════════════════════════════════════════════════════════════
// AUTH SCREEN — Persona FIRST, then SSO
// ══════════════════════════════════════════════════════════════════
const AuthScreen = ({onLogin}) => {
  const [step,setStep] = useState("persona"); // persona → sso → done
  const [persona,setPersona] = useState(null);
  const [email,setEmail] = useState("yassir.abdelfettah@axa.com");
  const [loading,setLoading] = useState(false);

  const pickPersona = (p) => { setPersona(p); setStep("sso"); };
  const doSSO = () => {
    if(!email.includes("@")) return;
    setLoading(true);
    setTimeout(()=>{setLoading(false);onLogin(persona);},1500);
  };

  if(step==="persona") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <style>{css}</style>
      <div style={{maxWidth:740,width:"100%",padding:40,animation:"fadeUp .6s ease"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <Logo size={44}/>
          <h1 style={{...S.h1,fontSize:32,marginTop:16}}>SMART <span style={{color:C.teal}}>Mobility</span></h1>
          <p style={{...S.sub,fontSize:14,marginTop:6}}>AXA Group Operations — Select your role to continue</p>
          <div style={{display:"inline-flex",gap:6,marginTop:12}}>
            <Badge status="v5.0" custom={C.blue}/><Badge status="Enterprise" custom={C.teal}/><Badge status="AI-Powered" custom={C.violet}/>
          </div>
        </div>
        <div style={S.grid2}>
          {PERSONAS.map(p=>(
            <div key={p.id} onClick={()=>pickPersona(p)} style={{...S.card,cursor:"pointer",transition:"all .2s",border:`2px solid ${C.border}`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.boxShadow=`0 4px 20px ${p.color}18`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.04)";}}>
              <div style={S.flex}>
                <div style={{width:44,height:44,borderRadius:12,background:`${p.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{p.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>{p.label}</div>
                  <div style={{fontSize:11,color:C.textMuted,marginTop:2,lineHeight:1.4}}>{p.desc}</div>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:12}}>
                {p.access.slice(0,6).map(a=><span key={a} style={{...S.badge,background:`${p.color}08`,color:p.color,fontSize:9,border:`1px solid ${p.color}15`}}>{a}</span>)}
                {p.access.length>6&&<span style={{...S.badge,background:C.bgSoft,color:C.textMuted,fontSize:9}}>+{p.access.length-6}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // SSO step
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <style>{css}</style>
      <div style={{width:420,background:C.bgCard,borderRadius:16,border:`1px solid ${C.border}`,padding:40,boxShadow:"0 8px 40px rgba(0,0,0,.06)",animation:"fadeUp .4s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size={40}/>
          <h2 style={{...S.h2,marginTop:14}}>AXA SSO Authentication</h2>
          <p style={{...S.sub}}>Signing in as <strong style={{color:persona.color}}>{persona.label}</strong></p>
        </div>
        <div style={{marginBottom:16}}>
          <label style={S.label}>Corporate Email</label>
          <input style={{...S.input,borderColor:email.includes("@")?C.teal:C.border}} value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" defaultValue="••••••••••"/>
        </div>
        <button onClick={doSSO} disabled={loading} style={{...S.btn,width:"100%",justifyContent:"center",padding:12,fontSize:14,opacity:loading?.7:1}}>
          {loading?"⏳ Authenticating via Azure AD...":"🔐 Sign In"}
        </button>
        <div style={{marginTop:14,padding:12,background:C.bluePale,borderRadius:8,border:`1px solid ${C.blue}15`}}>
          <div style={{fontSize:10,color:C.blue,fontWeight:700}}>🔒 SECURITY</div>
          <div style={{fontSize:10,color:C.textMuted,lineHeight:1.5,marginTop:3}}>MFA via Microsoft Authenticator · JWT RS256 · 8h session · Audit logging</div>
        </div>
        <button onClick={()=>{setStep("persona");setPersona(null);}} style={{...S.btn,...S.btnO,...S.btnSm,width:"100%",justifyContent:"center",marginTop:10}}>← Choose different role</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════
const NAV = [
  {k:"dashboard",l:"Dashboard",e:"📊"},{k:"charter",l:"Smart Charter",e:"📜"},{k:"marketplace",l:"Marketplace",e:"🏪"},
  {k:"team",l:"My Team",e:"👥"},{k:"interviews",l:"Career Interviews",e:"🎯"},{k:"careers",l:"Career Paths",e:"🚀"},
  {k:"skills",l:"Skills Repository",e:"💡"},{k:"workflows",l:"Workflows",e:"⚙️"},{k:"reports",l:"Reports",e:"📈"},
];

const Sidebar = ({active,setActive,persona,onLogout}) => (
  <div style={{width:220,background:C.bgCard,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
    <div style={{padding:"16px 18px 14px",borderBottom:`1px solid ${C.border}`}}>
      <div style={S.flex}><Logo size={26}/><div><div style={{fontFamily:FONT_HEAD,fontSize:14,fontWeight:700,color:C.text}}>SMART <span style={{color:C.teal}}>Mobility</span></div><div style={{fontSize:9,color:C.textMuted,letterSpacing:1.2,textTransform:"uppercase"}}>AXA Group Ops</div></div></div>
    </div>
    <div style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
      {NAV.filter(n=>(persona?.access||[]).includes(n.k)).map(n=>(
        <div key={n.k} onClick={()=>setActive(n.k)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",cursor:"pointer",background:active===n.k?C.tealLight:"transparent",borderLeft:active===n.k?`3px solid ${C.teal}`:"3px solid transparent",color:active===n.k?C.teal:C.textSec,fontSize:13,fontWeight:active===n.k?600:400,transition:"all .12s"}}>
          <span style={{fontSize:14}}>{n.e}</span>{n.l}
        </div>
      ))}
    </div>
    <div style={{padding:14,borderTop:`1px solid ${C.border}`}}>
      <div style={S.flex}>
        <div style={{width:32,height:32,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>YA</div>
        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>Yassir A.</div><div style={{fontSize:10,color:persona?.color}}>{persona?.label}</div></div>
      </div>
      <button onClick={onLogout} style={{...S.btn,...S.btnO,...S.btnSm,width:"100%",justifyContent:"center",marginTop:8,fontSize:10}}>Sign Out</button>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════

// ── DASHBOARD ──
const Pg_Dash = ({go}) => (
  <div>
    <div style={S.grid4}>
      {[{l:"Employees",v:247,d:"+12",e:"👥",c:C.teal,p:"team"},{l:"AI Agents",v:5,d:"+2",e:"🤖",c:C.violet,p:"team"},{l:"Open Positions",v:34,d:"-3",e:"📋",c:C.ocean,p:"marketplace"},{l:"Interviews",v:18,d:"+5",e:"🎯",c:C.orange,p:"interviews"}].map(s=>(
        <div key={s.l} onClick={()=>go(s.p)} style={{...S.card,cursor:"pointer"}}>
          <div style={S.between}><span style={{fontSize:22}}>{s.e}</span><span style={{fontSize:10,fontWeight:700,color:s.d.startsWith("+")?C.teal:C.red}}>{s.d}</span></div>
          <div style={{fontSize:28,fontWeight:800,fontFamily:FONT_HEAD,color:C.text,marginTop:8}}>{s.v}</div>
          <div style={{fontSize:11,color:C.textMuted}}>{s.l}</div>
        </div>
      ))}
    </div>
    <div style={S.grid2}>
      <div style={S.card}>
        <h3 style={S.h3}>Mobility Pipeline</h3>
        <div style={{marginTop:14}}>{["Interview Scheduled","In Progress","Action Plan","Training","Completed"].map((s,i)=>(<div key={s} style={{...S.flex,marginBottom:10}}><span style={{fontSize:11,color:C.textMuted,width:130}}>{s}</span><div style={{flex:1}}><Bar pct={[25,45,60,35,80][i]} color={[C.ocean,C.orange,C.teal,C.violet,C.success][i]}/></div><span style={{fontSize:11,fontWeight:600,width:28,textAlign:"right"}}>{[12,18,24,9,31][i]}</span></div>))}</div>
      </div>
      <div style={S.card}>
        <h3 style={S.h3}>AI Agent Status</h3>
        <div style={{marginTop:14}}>{AI_AGENTS.slice(0,4).map(a=>(<div key={a.id} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{width:28,height:28,borderRadius:7,background:C.violetPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🤖</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,color:C.textMuted}}>{a.tasks} tasks</div></div><Badge status={a.status}/></div>))}</div>
      </div>
    </div>
    <div style={S.card}>
      <h3 style={{...S.h3,marginBottom:12}}>Quick Actions</h3>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[{l:"Schedule Interview",p:"interviews"},{l:"Browse Marketplace",p:"marketplace"},{l:"Career Paths",p:"careers"},{l:"Smart Charter",p:"charter"},{l:"Skills Repository",p:"skills"}].map(a=>(<button key={a.l} onClick={()=>go(a.p)} style={{...S.btn,...S.btnO}}>{a.l}</button>))}
      </div>
    </div>
  </div>
);

// ── CHARTER ──
const Pg_Charter = () => {
  const [exp,setExp]=useState({});
  return (<div>
    <div style={{...S.card,background:`linear-gradient(135deg,${C.bluePale},${C.bgCard})`,border:`1.5px solid ${C.blue}22`}}>
      <div style={S.flex}><span style={{fontSize:20}}>⭐</span><span style={{fontSize:14,fontWeight:700,color:C.blue}}>CORE PRINCIPLE</span><Badge status="Active"/></div>
      <p style={{fontFamily:FONT_HEAD,fontSize:20,color:C.text,margin:"12px 0 0",lineHeight:1.5,fontStyle:"italic"}}>"Human always stays accountable for every outcome"</p>
      <p style={{fontSize:12,color:C.textMuted,marginTop:6}}>From Human-Only → Hybrid Human+Agent. AI enables, Humans decide.</p>
    </div>
    <div style={S.grid3}>
      {[{t:"AI Responsibilities",items:["Automate","Analyse","Recommend"],c:C.violet,e:"🤖"},{t:"Human Responsibilities",items:["Decide","Validate","Contextualise","Accountable"],c:C.teal,e:"👤"},{t:"Role Categories",items:["Orchestration: Strategy · Direction","Execution: Delivery · Operations","Hybrid: Human + Agent"],c:C.ocean,e:"🏗️"}].map(r=>(
        <div key={r.t} style={S.card}><div style={S.flex}><span style={{fontSize:16}}>{r.e}</span><h4 style={{fontSize:13,fontWeight:700}}>{r.t}</h4></div><div style={{marginTop:10}}>{r.items.map(i=><div key={i} style={{fontSize:12,color:C.textSec,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>• {i}</div>)}</div></div>
      ))}
    </div>
    {CHARTER_SECTIONS.map((sec,si)=>(<div key={si} style={S.card}>
      <div style={{...S.between,cursor:"pointer"}} onClick={()=>setExp(p=>({...p,[si]:!p[si]}))}>
        <div style={S.flex}><span style={{fontSize:16}}>{sec.icon}</span><h3 style={S.h3}>{sec.title}</h3><Badge status={`${sec.subs.length} items`} custom={C.teal}/></div>
        <span style={{color:C.textMuted,transition:"transform .2s",transform:exp[si]?"rotate(90deg)":"none",display:"inline-block"}}>▶</span>
      </div>
      {exp[si]&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
        {sec.subs.map((sub,i)=>(<div key={i} style={{padding:"10px 14px",background:i%2?C.bgMuted:"transparent",borderRadius:8,marginBottom:3}}>
          <div style={{fontSize:12,fontWeight:600,color:C.teal}}>{sub.t}</div>
          <div style={{fontSize:12,color:C.textSec,lineHeight:1.6,marginTop:3}}>{sub.c}</div>
          {sub.hl&&<div style={{marginTop:6,padding:"6px 12px",background:C.orangePale,borderLeft:`3px solid ${C.orange}`,borderRadius:4,fontSize:11,color:C.orange,fontWeight:600}}>{sub.hl}</div>}
        </div>))}
      </div>}
    </div>))}
    <div style={S.card}>
      <h3 style={{...S.h3,marginBottom:12}}>Business Case: Internal vs External</h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{borderBottom:`2px solid ${C.border}`}}><th style={{textAlign:"left",padding:"10px 14px",color:C.textMuted}}>Factor</th><th style={{textAlign:"center",padding:"10px 14px",color:C.teal,fontWeight:700}}>Internal ✓</th><th style={{textAlign:"center",padding:"10px 14px",color:C.textMuted}}>External</th></tr></thead>
        <tbody>{[["Time to Productivity","Weeks","6–12 months"],["Cost","Low / Zero","1–2× salary"],["Cultural Fit","Embedded","Risk"],["Knowledge Retention","100% retained","Lost & rebuilt"],["Compounding Returns","Yes — grows","No — resets"]].map(([f,i,e],x)=>(
          <tr key={x} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 14px",fontWeight:500}}>{f}</td><td style={{textAlign:"center",padding:"10px 14px"}}><Badge status={i} custom={C.teal}/></td><td style={{textAlign:"center",padding:"10px 14px",color:C.textMuted}}>{e}</td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>);
};

// ── MARKETPLACE ──
const Pg_Market = () => {
  const [sf,setSf]=useState([]);const [df,setDf]=useState("All");const [lf,setLf]=useState("All");const [q,setQ]=useState("");
  const pos=[
    {id:1,t:"Senior ML Engineer",d:"Data & AI",l:"Senior",sk:["Python","Machine Learning","MLOps","Deep Learning"],loc:"Paris",tp:"Hybrid",u:"High"},
    {id:2,t:"Cloud Solutions Architect",d:"Technology",l:"Lead",sk:["Azure","Cloud Architecture","Microservices","Kubernetes"],loc:"London",tp:"Remote",u:"Medium"},
    {id:3,t:"Product Owner — AI Platform",d:"Product",l:"Senior",sk:["Product Management","Agile","GenAI Applications"],loc:"Paris",tp:"On-site",u:"High"},
    {id:4,t:"Data Governance Manager",d:"Data & AI",l:"Mid",sk:["Data Governance","GDPR Compliance","SQL"],loc:"Brussels",tp:"Hybrid",u:"Low"},
    {id:5,t:"DevSecOps Engineer",d:"Technology",l:"Mid",sk:["DevOps","CI/CD","Cybersecurity","Docker"],loc:"Paris",tp:"On-site",u:"Medium"},
    {id:6,t:"Change Management Lead",d:"HR & Talent",l:"Lead",sk:["Change Management","Communication","Leadership"],loc:"Paris",tp:"Hybrid",u:"High"},
    {id:7,t:"Agentic AI Developer",d:"Data & AI",l:"Senior",sk:["Agentic AI","Python","LLM Fine-tuning","RAG Architecture"],loc:"Remote",tp:"Remote",u:"High"},
    {id:8,t:"RPA Analyst",d:"Operations",l:"Junior",sk:["RPA","Process Automation","Business Analysis"],loc:"Cologne",tp:"On-site",u:"Medium"},
  ];
  const fil=pos.filter(p=>(df==="All"||p.d===df)&&(lf==="All"||p.l===lf)&&(sf.length===0||sf.some(s=>p.sk.includes(s)))&&(!q||p.t.toLowerCase().includes(q.toLowerCase())));
  return (<div>
    <div style={{...S.card,padding:16}}>
      <div style={{...S.flex,marginBottom:10}}><span>🔍</span><span style={{fontSize:12,fontWeight:600,color:C.teal}}>Filters</span>{(sf.length||df!=="All"||lf!=="All")&&<button onClick={()=>{setSf([]);setDf("All");setLf("All");setQ("");}} style={{...S.btn,...S.btnSm,...S.btnO,marginLeft:"auto"}}>Clear</button>}</div>
      <div style={{...S.flex,gap:10,marginBottom:10}}>
        <input style={{...S.input,maxWidth:240}} placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select style={S.select} value={df} onChange={e=>setDf(e.target.value)}><option value="All">All Domains</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select>
        <select style={S.select} value={lf} onChange={e=>setLf(e.target.value)}><option value="All">All Levels</option>{["Junior","Mid","Senior","Lead"].map(l=><option key={l}>{l}</option>)}</select>
      </div>
      <div style={S.label}>Skills</div>
      <Chips options={SKILLS.slice(0,20)} selected={sf} onToggle={s=>setSf(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}/>
    </div>
    <div style={{fontSize:11,color:C.textMuted,margin:"8px 0"}}>{fil.length} positions</div>
    <div style={S.grid2}>{fil.map(p=>(<div key={p.id} style={S.card}>
      <div style={S.between}><h4 style={{fontSize:14,fontWeight:700,margin:0}}>{p.t}</h4><Badge status={p.u}/></div>
      <div style={{...S.flex,marginTop:6,fontSize:11,color:C.textMuted}}>{p.d} · {p.l} · {p.loc} · {p.tp}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:10}}>{p.sk.map(sk=><span key={sk} style={{...S.tag,background:sf.includes(sk)?C.tealLight:C.bgSoft,color:sf.includes(sk)?C.teal:C.textMuted}}>{sk}</span>)}</div>
      <button style={{...S.btn,...S.btnSm,marginTop:12}}>Apply</button>
    </div>))}</div>
  </div>);
};

// ── TEAM ──
const Pg_Team = () => (<div>
  <h3 style={{...S.h3,marginBottom:14}}>👤 Human Team</h3>
  <div style={S.grid2}>{EMPLOYEES.map(e=>(<div key={e.id} style={S.card}>
    <div style={S.flex}>
      <div style={{width:36,height:36,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{e.avatar}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:C.textMuted}}>{e.role} — {e.dept}</div></div>
      <Badge status={e.level}/>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:10}}>{e.skills.map(sk=><span key={sk} style={S.tag}>{sk}</span>)}</div>
    <div style={{...S.flex,marginTop:8,fontSize:10,color:C.textMuted}}>AI: <Badge status={e.aiLevel}/></div>
  </div>))}</div>
  <div style={{marginTop:28,paddingTop:20,borderTop:`2px solid ${C.violet}22`}}>
    <div style={S.flex}><span style={{fontSize:20}}>🤖</span><h3 style={{...S.h3,margin:0}}>AI Agent Team</h3><Badge status={`${AI_AGENTS.length} agents`} custom={C.violet}/></div>
    <p style={{fontSize:11,color:C.textMuted,margin:"8px 0 14px"}}>Hybrid Human+Agent workforce model</p>
    <div style={S.grid3}>{AI_AGENTS.map(a=>(<div key={a.id} style={{...S.card,borderLeft:`3px solid ${a.status==="active"?C.violet:a.status==="training"?C.orange:C.textDim}`}}>
      <div style={S.between}><div style={S.flex}><div style={{width:32,height:32,borderRadius:8,background:C.violetPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🤖</div><div><div style={{fontSize:12,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:C.textMuted}}>{a.role}</div></div></div><Badge status={a.status}/></div>
      <p style={{fontSize:11,color:C.textMuted,margin:"8px 0",lineHeight:1.5}}>{a.desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{a.skills.map(sk=><span key={sk} style={{...S.tag,background:C.violetPale,color:C.violet}}>{sk}</span>)}</div>
      <div style={S.flex}><span style={{fontSize:10,color:C.textMuted}}>Accuracy</span><div style={{flex:1}}><Bar pct={a.accuracy} color={C.violet}/></div><span style={{fontSize:10,fontWeight:700,color:C.violet}}>{a.accuracy}%</span></div>
    </div>))}</div>
  </div>
</div>);

// ══════════════════════════════════════════════════════════════════
// CAREER INTERVIEWS — Full linked flow
// Interview → Skills Gap → Action Plan → Training → Certification → Assessment
// ══════════════════════════════════════════════════════════════════
const Pg_Interviews = ({persona,goSkills}) => {
  const [interviews,setInterviews] = useState([
    {id:1,emp:EMPLOYEES[0],date:"2026-04-25",status:"Scheduled",wfStep:0,answers:{},plan:null},
    {id:2,emp:EMPLOYEES[1],date:"2026-04-22",status:"In Progress",wfStep:1,answers:{1:"Move into a strategic / transversal role"},plan:null},
    {id:3,emp:EMPLOYEES[2],date:"2026-04-10",status:"Completed",wfStep:6,answers:{1:"Move into people management",4:"Product Management, Agile, UX Design"},plan:{target:"VP Product",completion:65,currentSkills:EMPLOYEES[2].skills,reqSkills:["Strategic Thinking","Financial Modeling","Leadership","Data Governance","Communication"],gaps:[{sk:"Strategic Thinking",cur:2,req:5,pri:"High"},{sk:"Financial Modeling",cur:1,req:4,pri:"High"},{sk:"Leadership",cur:3,req:5,pri:"Medium"},{sk:"Data Governance",cur:0,req:3,pri:"Medium"},{sk:"Communication",cur:3,req:4,pri:"Low"}],trainings:[{n:"Product Leadership Masterclass",prov:"AXA University",dur:"10w",stat:"In progress",type:"Internal"},{n:"Executive Strategy",prov:"INSEAD",dur:"6w",stat:"Completed",type:"External"},{n:"Finance for Product Leaders",prov:"Coursera",dur:"4w",stat:"Not started",type:"External"}],certs:[{n:"Certified Product Manager",prov:"AIPMM",stat:"Achieved",dt:"2026-03"},{n:"AI Strategy Certificate",prov:"MIT",stat:"Registered",dt:"2026-09"},{n:"Agile Leadership",prov:"ICAgile",stat:"Planned",dt:"2027-01"}],assessments:[{n:"Strategic Thinking Assessment",stat:"Completed",score:78},{n:"Leadership 360 Review",stat:"In Progress",score:null},{n:"Product Vision Presentation",stat:"Planned",score:null}],milestones:[{t:"Gap assessment",dt:"2026-02",s:"Completed"},{t:"Training start",dt:"2026-03",s:"Completed"},{t:"Mid-review",dt:"2026-06",s:"In Progress"},{t:"Certifications complete",dt:"2026-12",s:"Planned"},{t:"Final evaluation",dt:"2027-03",s:"Planned"}]}},
    {id:4,emp:EMPLOYEES[3],date:"2026-04-28",status:"Scheduled",wfStep:0,answers:{},plan:null},
    {id:5,emp:EMPLOYEES[4],date:"2026-04-18",status:"Action Plan",wfStep:3,answers:{1:"Move into people management"},plan:{target:"HR Director",completion:25,currentSkills:EMPLOYEES[4].skills,reqSkills:["Strategic Thinking","Financial Modeling","Data Governance","Python","Power BI"],gaps:[{sk:"Strategic Thinking",cur:2,req:5,pri:"High"},{sk:"Financial Modeling",cur:0,req:4,pri:"High"},{sk:"Data Governance",cur:1,req:3,pri:"Medium"},{sk:"Python",cur:0,req:2,pri:"Low"},{sk:"Power BI",cur:1,req:3,pri:"Medium"}],trainings:[{n:"HR Strategy Masterclass",prov:"AXA University",dur:"12w",stat:"Not started",type:"Internal"},{n:"People Analytics",prov:"Coursera",dur:"8w",stat:"Not started",type:"External"},{n:"Finance for HR",prov:"AXA Academy",dur:"4w",stat:"Not started",type:"Internal"}],certs:[{n:"SHRM-SCP",prov:"SHRM",stat:"Planned",dt:"2026-12"},{n:"Change Management Pro",prov:"ACMP",stat:"Planned",dt:"2027-03"}],assessments:[{n:"Leadership Assessment",stat:"Planned",score:null},{n:"Strategic HR Case Study",stat:"Planned",score:null}],milestones:[{t:"Gap assessment",dt:"2026-05",s:"In Progress"},{t:"Start training",dt:"2026-06",s:"Planned"},{t:"Mid-review",dt:"2026-09",s:"Planned"},{t:"Certifications",dt:"2027-03",s:"Planned"},{t:"Role transition",dt:"2027-06",s:"Planned"}]}},
  ]);

  const [view,setView] = useState("list"); // list | interview | plan
  const [activeIV,setActiveIV] = useState(null);
  const [curQ,setCurQ] = useState(0);
  const [answers,setAnswers] = useState({});
  const [freeTexts,setFreeTexts] = useState({});
  const [multiAns,setMultiAns] = useState({});
  const [planView,setPlanView] = useState(null);
  const [planTab,setPlanTab] = useState("gap"); // gap | training | certs | assess | milestones | form

  // ── Start / Resume Interview ──
  const startIV = (iv) => {setActiveIV(iv);setAnswers(iv.answers||{});setFreeTexts({});setMultiAns({});setCurQ(0);setView("interview");};

  const saveProgress = () => {
    const all={...answers,...Object.fromEntries(Object.entries(multiAns).map(([k,v])=>[k,v.join(", ")])),...freeTexts};
    setInterviews(p=>p.map(i=>i.id===activeIV.id?{...i,status:"In Progress",wfStep:1,answers:all}:i));
  };

  const genPlan = (emp,ans) => {
    const asp=ans[1]||"Career Growth";
    const roles={"Grow as an expert in my current field":`Senior ${emp.role}`,"Move into a different functional area":"Cross-Functional Lead","Move into people management":`${emp.dept} Manager`,"Move into a strategic / transversal role":`${emp.dept} Director`,"Explore international or cross-entity opportunities":"International Ops Lead"};
    const target=roles[asp]||`Senior ${emp.role}`;
    const currentSkills=ans[4]?ans[4].split(", "):emp.skills;
    const desiredSkills=ans[6]?ans[6].split(", "):SKILLS.slice(0,5);
    const reqSkills=[...desiredSkills.filter(s=>!currentSkills.includes(s)),"Strategic Thinking","Leadership"].slice(0,6);
    return {
      target,completion:10,currentSkills,reqSkills,
      gaps:reqSkills.map(sk=>({sk,cur:Math.floor(Math.random()*2),req:3+Math.floor(Math.random()*3),pri:["High","Medium","Low"][Math.floor(Math.random()*3)]})),
      trainings:[
        {n:"Leadership Fundamentals",prov:"AXA University",dur:"12w",stat:"Not started",type:"Internal"},
        {n:"AI for Business Leaders",prov:"MIT xPRO",dur:"8w",stat:"Not started",type:"External"},
        {n:"Strategic Decision Making",prov:"INSEAD",dur:"6w",stat:"Not started",type:"External"},
        {n:"Change Management",prov:"AXA Academy",dur:"4w",stat:"Not started",type:"Internal"},
      ],
      certs:[
        {n:"AWS Solutions Architect",prov:"AWS",stat:"Planned",dt:"2026-09"},
        {n:"PMP Certification",prov:"PMI",stat:"Planned",dt:"2026-12"},
        {n:"AI Ethics Certificate",prov:"AXA Academy",stat:"Planned",dt:"2026-07"},
      ],
      assessments:[
        {n:"Skills Baseline Assessment",stat:"Planned",score:null},
        {n:"Mid-Point Competency Review",stat:"Planned",score:null},
        {n:"Final Readiness Evaluation",stat:"Planned",score:null},
      ],
      milestones:[
        {t:"Complete gap assessment",dt:"2026-05-15",s:"In Progress"},
        {t:"Start first training",dt:"2026-06-01",s:"Planned"},
        {t:"Mid-point review",dt:"2026-08-01",s:"Planned"},
        {t:"Complete certifications",dt:"2026-12-31",s:"Planned"},
        {t:"Final evaluation & transition",dt:"2027-03-31",s:"Planned"},
      ],
    };
  };

  const completeIV = () => {
    const all={...answers,...Object.fromEntries(Object.entries(multiAns).map(([k,v])=>[k,v.join(", ")])),...freeTexts};
    const plan=genPlan(activeIV.emp,all);
    setInterviews(p=>p.map(i=>i.id===activeIV.id?{...i,status:"Gap Analysis",wfStep:2,answers:all,plan}:i));
    setActiveIV(null);setView("list");
  };

  const openPlan = (iv) => {setPlanView(iv);setPlanTab("gap");setView("plan");};

  // ── Workflow Stepper ──
  const WFStepper = ({step}) => (
    <div style={{display:"flex",alignItems:"center",gap:0,margin:"14px 0"}}>
      {WF_STEPS.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,
              background:i<step?C.teal:i===step?C.tealLight:C.bgSoft,color:i<step?"#fff":i===step?C.teal:C.textDim,border:i===step?`2px solid ${C.teal}`:`2px solid transparent`,transition:"all .3s"}}>
              {i<step?"✓":i+1}
            </div>
            <div style={{fontSize:8,color:i<=step?C.text:C.textDim,marginTop:3,textAlign:"center",maxWidth:60,lineHeight:1.2,fontWeight:i===step?600:400}}>{s}</div>
          </div>
          {i<WF_STEPS.length-1&&<div style={{flex:1,height:2,background:i<step?C.teal:C.bgSoft,margin:"0 3px",marginBottom:18}}/>}
        </div>
      ))}
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // ACTION PLAN VIEW — Tabbed: Gap | Training | Certs | Assess | Milestones | Form
  // ════════════════════════════════════════════════════════════════
  if(view==="plan"&&planView) {
    const p=planView.plan; const emp=planView.emp;
    const tabs=[{k:"gap",l:"🔬 Skills Gap",c:C.red},{k:"training",l:"📚 Training",c:C.ocean},{k:"certs",l:"🏅 Certifications",c:C.orange},{k:"assess",l:"📝 Assessments",c:C.violet},{k:"milestones",l:"📅 Milestones",c:C.teal},{k:"form",l:"📋 Action Form",c:C.blue}];

    return (<div>
      <button onClick={()=>setView("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:14}}>← Back to Interviews</button>
      <div style={S.between}>
        <div><h2 style={S.h2}>Action Plan: {emp.name}</h2><p style={S.sub}>Current: <strong>{emp.role}</strong> → Target: <strong style={{color:C.teal}}>{p.target}</strong></p></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:34,fontWeight:800,fontFamily:FONT_HEAD,color:C.teal}}>{p.completion}%</div><div style={{fontSize:10,color:C.textMuted}}>Overall Progress</div></div>
      </div>

      {/* Linked Flow Diagram */}
      <div style={{...S.card,marginTop:14,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:10,letterSpacing:1}}>LINKED PROCESS FLOW</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0}}>
          {[{l:"Interview",e:"🎯",c:C.blue,done:planView.wfStep>=1},{l:"Gap Analysis",e:"🔬",c:C.red,done:planView.wfStep>=2},{l:"Action Plan",e:"📋",c:C.teal,done:planView.wfStep>=3},{l:"Training",e:"📚",c:C.ocean,done:planView.wfStep>=4},{l:"Certification",e:"🏅",c:C.orange,done:planView.wfStep>=5},{l:"Assessment",e:"📝",c:C.violet,done:planView.wfStep>=6},{l:"Complete",e:"✅",c:C.success,done:planView.wfStep>=7}].map((s,i,a)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>s.l==="Gap Analysis"?setPlanTab("gap"):s.l==="Training"?setPlanTab("training"):s.l==="Certification"?setPlanTab("certs"):s.l==="Assessment"?setPlanTab("assess"):null}>
                <div style={{width:36,height:36,borderRadius:"50%",background:s.done?`${s.c}15`:C.bgSoft,border:`2px solid ${s.done?s.c:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,transition:"all .3s"}}>{s.e}</div>
                <div style={{fontSize:9,color:s.done?C.text:C.textDim,marginTop:4,fontWeight:s.done?600:400,maxWidth:60}}>{s.l}</div>
              </div>
              {i<a.length-1&&<div style={{width:30,height:2,background:s.done?s.c:C.bgSoft,margin:"0 2px",marginBottom:18}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div style={{...S.card,background:`linear-gradient(135deg,${C.violetPale},${C.bgCard})`,border:`1px solid ${C.violet}22`}}>
        <div style={S.flex}><span style={{fontSize:14}}>🤖</span><span style={{fontSize:12,fontWeight:700,color:C.violet}}>AI Recommendations — AXA-CareerPath Agent</span></div>
        <div style={{fontSize:12,color:C.textSec,lineHeight:1.7,marginTop:8}}>Based on {emp.name}'s gap analysis, prioritize <strong style={{color:C.text}}>Strategic Thinking</strong> and <strong style={{color:C.text}}>Financial Modeling</strong>. The {p.target} role shows 34% YoY demand growth. Recommended path: complete gap assessment → MIT AI Strategy cert → INSEAD leadership module → final 360 assessment.</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginTop:14,marginBottom:14,flexWrap:"wrap"}}>
        {tabs.map(tb=>(<button key={tb.k} onClick={()=>setPlanTab(tb.k)} style={{...S.btn,...S.btnSm,background:planTab===tb.k?`${tb.c}`:C.bgSoft,color:planTab===tb.k?"#fff":C.textSec,border:`1px solid ${planTab===tb.k?tb.c:C.border}`}}>{tb.l}</button>))}
      </div>

      {/* TAB: Gap Analysis */}
      {planTab==="gap"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Skills Gap Analysis</h3>
        <div style={S.grid2}>
          <div><div style={S.label}>Current Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{p.currentSkills.map(s=><span key={s} style={S.tag}>{s}</span>)}</div></div>
          <div><div style={S.label}>Required Skills (Gap)</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{p.reqSkills.map(s=><span key={s} style={{...S.tag,background:C.redPale,color:C.red}}>{s}</span>)}</div></div>
        </div>
        <div style={{marginTop:16}}>
          {p.gaps.map((g,i)=>(<div key={i} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:12,fontWeight:600,width:160}}>{g.sk}</span>
            <div style={{flex:1,...S.flex}}>
              <span style={{fontSize:10,color:C.textMuted,width:40}}>Lv {g.cur}</span>
              <div style={{flex:1}}><Bar pct={(g.cur/g.req)*100} color={g.cur>=g.req?C.teal:g.cur>=g.req/2?C.orange:C.red}/></div>
              <span style={{fontSize:10,color:C.textMuted,width:50}}>→ Lv {g.req}</span>
            </div>
            <Badge status={g.pri}/>
            <button onClick={()=>setPlanTab("training")} style={{...S.btn,...S.btnSm,...S.btnO,padding:"3px 8px",fontSize:9}}>→ Train</button>
          </div>))}
        </div>
        <button onClick={()=>setPlanTab("training")} style={{...S.btn,...S.btnG,marginTop:14}}>Proceed to Training Plan →</button>
      </div>}

      {/* TAB: Training */}
      {planTab==="training"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Training Phase</h3>
        {p.trainings.map((t,i)=>(<div key={i} style={{...S.card,margin:"0 0 8px",padding:14,background:C.bgMuted}}>
          <div style={S.between}>
            <div style={S.flex}><span style={{fontSize:14}}>📖</span><div><div style={{fontSize:13,fontWeight:600}}>{t.n}</div><div style={{fontSize:11,color:C.textMuted}}>{t.prov} · {t.dur} · {t.type}</div></div></div>
            <Badge status={t.stat}/>
          </div>
          <div style={{marginTop:8}}><Bar pct={t.stat==="Completed"?100:t.stat==="In progress"?50:0} color={C.ocean}/></div>
        </div>))}
        <div style={{...S.flex,marginTop:12}}>
          <button onClick={()=>setPlanTab("gap")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Gap Analysis</button>
          <button onClick={()=>setPlanTab("certs")} style={{...S.btn,...S.btnSm,...S.btnG}}>Certifications →</button>
        </div>
      </div>}

      {/* TAB: Certifications */}
      {planTab==="certs"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Certification Phase</h3>
        {p.certs.map((c,i)=>(<div key={i} style={{...S.flex,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:16}}>🎓</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{c.n}</div><div style={{fontSize:11,color:C.textMuted}}>{c.prov} · Target: {c.dt}</div></div>
          <Badge status={c.stat}/>
        </div>))}
        <div style={{...S.flex,marginTop:12}}>
          <button onClick={()=>setPlanTab("training")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Training</button>
          <button onClick={()=>setPlanTab("assess")} style={{...S.btn,...S.btnSm,...S.btnG}}>Assessments →</button>
        </div>
      </div>}

      {/* TAB: Assessments */}
      {planTab==="assess"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Continuous Assessment</h3>
        {p.assessments.map((a,i)=>(<div key={i} style={{...S.card,margin:"0 0 8px",padding:14,background:C.bgMuted}}>
          <div style={S.between}>
            <div style={S.flex}><span style={{fontSize:14}}>📝</span><div><div style={{fontSize:13,fontWeight:600}}>{a.n}</div></div></div>
            <div style={S.flex}>{a.score!==null&&<span style={{fontSize:14,fontWeight:700,color:a.score>=70?C.teal:C.orange}}>{a.score}%</span>}<Badge status={a.stat}/></div>
          </div>
          {a.score!==null&&<div style={{marginTop:8}}><Bar pct={a.score} color={a.score>=70?C.teal:C.orange}/></div>}
        </div>))}
        <div style={{...S.flex,marginTop:12}}>
          <button onClick={()=>setPlanTab("certs")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Certifications</button>
          <button onClick={()=>setPlanTab("milestones")} style={{...S.btn,...S.btnSm,...S.btnG}}>Milestones →</button>
        </div>
      </div>}

      {/* TAB: Milestones */}
      {planTab==="milestones"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Execution Timeline</h3>
        {p.milestones.map((m,i)=>(<div key={i} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:m.s==="Completed"?C.teal:m.s==="In Progress"?C.tealLight:C.bgSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:m.s==="Completed"?"#fff":m.s==="In Progress"?C.teal:C.textDim,border:m.s==="In Progress"?`2px solid ${C.teal}`:"none"}}>{m.s==="Completed"?"✓":i+1}</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{m.t}</div><div style={{fontSize:10,color:C.textMuted}}>Target: {m.dt}</div></div>
          <Badge status={m.s}/>
        </div>))}
        <button onClick={()=>setPlanTab("form")} style={{...S.btn,...S.btnG,marginTop:14}}>📋 Complete Action Plan Form →</button>
      </div>}

      {/* TAB: Action Plan Form */}
      {planTab==="form"&&<div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>📋 Action Plan Completion Form</h3>
        <p style={{fontSize:12,color:C.textMuted,marginBottom:16}}>Complete this form to finalize the action plan and link it to the upskilling process.</p>
        <div style={{marginBottom:16}}><label style={S.label}>Target Role / Career Aspiration</label><input style={S.input} defaultValue={p.target}/></div>
        <div style={{marginBottom:16}}><label style={S.label}>Manager's Assessment of Readiness (1-5)</label><select style={{...S.select,width:"100%"}} defaultValue="3"><option>1 — Not Ready</option><option>2 — Early Stage</option><option value="3">3 — Developing</option><option>4 — Near Ready</option><option>5 — Ready</option></select></div>
        <div style={{marginBottom:16}}><label style={S.label}>Priority Skills to Develop (from gap analysis)</label><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{p.reqSkills.map(s=><span key={s} style={{...S.tag,background:C.redPale,color:C.red}}>{s}</span>)}</div></div>
        <div style={{marginBottom:16}}><label style={S.label}>Agreed Training Timeline</label><select style={{...S.select,width:"100%"}} defaultValue="6-12"><option value="3-6">3–6 months</option><option value="6-12">6–12 months</option><option value="12-18">12–18 months</option><option value="18+">18+ months</option></select></div>
        <div style={{marginBottom:16}}><label style={S.label}>Manager Comments & Commitments</label><textarea style={{...S.input,minHeight:80}} placeholder="Document agreed actions, support commitments, review schedule..."/></div>
        <div style={{marginBottom:16}}><label style={S.label}>Employee Comments & Commitments</label><textarea style={{...S.input,minHeight:80}} placeholder="Employee's agreement, personal goals, questions..."/></div>
        <div style={{marginBottom:16}}><label style={S.label}>Next Review Date</label><input style={S.input} type="date" defaultValue="2026-08-01"/></div>
        <div style={S.flex}><button style={{...S.btn}}>💾 Save Draft</button><button style={{...S.btn,...S.btnG}}>✅ Finalize & Link to Upskilling</button></div>
      </div>}
    </div>);
  }

  // ════════════════════════════════════════════════════════════════
  // INTERVIEW FORM
  // ════════════════════════════════════════════════════════════════
  if(view==="interview"&&activeIV) {
    const q=INTERVIEW_QUESTIONS[curQ];
    const show=!q.conditionOn||answers[q.conditionOn]===q.conditionValue;
    return (<div>
      <button onClick={()=>setView("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:14}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h2}>Career Interview: {activeIV.emp.name}</h2><p style={S.sub}>{activeIV.emp.role} — {activeIV.emp.dept}</p></div>
        <button onClick={saveProgress} style={{...S.btn,...S.btnO,...S.btnSm}}>💾 Save</button>
      </div>
      <div style={{margin:"12px 0"}}><Bar pct={((curQ+1)/INTERVIEW_QUESTIONS.length)*100}/><div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Question {curQ+1} / {INTERVIEW_QUESTIONS.length}</div></div>
      <div style={{...S.flex,marginBottom:12}}>
        <Badge status={`Manager: ${persona?.label}`} custom={C.blue}/>
        <Badge status={`Employee: ${activeIV.emp.name}`} custom={C.ocean}/>
      </div>
      {show?(<div style={{...S.card,padding:24}}>
        <div style={{fontSize:11,color:C.teal,fontWeight:700,marginBottom:6,letterSpacing:1}}>Q{String(q.id)}</div>
        <h3 style={{fontFamily:FONT_HEAD,fontSize:18,fontWeight:700,color:C.text,margin:"0 0 16px",lineHeight:1.4}}>{q.text}</h3>
        {q.note&&<div style={{fontSize:11,color:C.orange,marginBottom:12}}>ℹ️ {q.note}</div>}
        {q.type==="single"&&q.options.map(opt=>(
          <div key={opt} onClick={()=>setAnswers(p=>({...p,[q.id]:opt}))} style={{padding:"11px 16px",margin:"5px 0",borderRadius:8,cursor:"pointer",border:`1.5px solid ${answers[q.id]===opt?C.teal:C.border}`,background:answers[q.id]===opt?C.tealLight:"transparent",transition:"all .15s"}}>
            <div style={S.flex}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${answers[q.id]===opt?C.teal:C.textDim}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{answers[q.id]===opt&&<div style={{width:8,height:8,borderRadius:"50%",background:C.teal}}/>}</div>
              <span style={{fontSize:13,color:answers[q.id]===opt?C.text:C.textSec}}>{opt}</span>
            </div>
          </div>
        ))}
        {q.type==="multi"&&<Chips options={q.options} selected={multiAns[q.id]||[]} onToggle={v=>setMultiAns(p=>{const c=p[q.id]||[];return{...p,[q.id]:c.includes(v)?c.filter(x=>x!==v):[...c,v]};})} max={q.options.length}/>}
        {q.type==="text"&&<textarea style={{...S.input,minHeight:80}} placeholder="Enter response..." value={freeTexts[q.id]||""} onChange={e=>setFreeTexts(p=>({...p,[q.id]:e.target.value}))}/>}
        {q.type!=="text"&&<div style={{marginTop:12}}><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Additional comments</div><textarea style={{...S.input,minHeight:50}} placeholder="Optional notes..." value={freeTexts[`${q.id}_n`]||""} onChange={e=>setFreeTexts(p=>({...p,[`${q.id}_n`]:e.target.value}))}/></div>}
      </div>):(<div style={{...S.card,padding:24,textAlign:"center",color:C.textMuted}}>⏭️ Skipped based on previous answer.</div>)}
      <div style={{...S.between,marginTop:14}}>
        <button onClick={()=>setCurQ(p=>Math.max(0,p-1))} disabled={curQ===0} style={{...S.btn,...S.btnO}}>← Previous</button>
        {curQ<INTERVIEW_QUESTIONS.length-1
          ?<button onClick={()=>setCurQ(p=>p+1)} style={S.btn}>Next →</button>
          :<button onClick={completeIV} style={{...S.btn,...S.btnG}}>✅ Complete → Generate Gap Analysis</button>
        }
      </div>
    </div>);
  }

  // ════════════════════════════════════════════════════════════════
  // INTERVIEW LIST
  // ════════════════════════════════════════════════════════════════
  return (<div>
    <div style={S.between}><div/><button onClick={()=>{}} style={S.btn}>+ Schedule Interview</button></div>
    {/* Linked Process Overview */}
    <div style={{...S.card,marginTop:14,padding:16}}>
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:8,letterSpacing:1}}>END-TO-END CAREER DEVELOPMENT PROCESS</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0}}>
        {[{l:"Career Interview",e:"🎯",c:C.blue},{l:"Skills Gap Analysis",e:"🔬",c:C.red},{l:"Action Plan",e:"📋",c:C.teal},{l:"Training",e:"📚",c:C.ocean},{l:"Certification",e:"🏅",c:C.orange},{l:"Assessment",e:"📝",c:C.violet},{l:"Target Role",e:"🎯",c:C.success}].map((s,i,a)=>(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:`${s.c}10`,border:`2px solid ${s.c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{s.e}</div>
              <div style={{fontSize:9,color:C.text,marginTop:4,fontWeight:600,maxWidth:65}}>{s.l}</div>
            </div>
            {i<a.length-1&&<div style={{display:"flex",alignItems:"center",margin:"0 4px",marginBottom:18}}><div style={{width:24,height:0,borderTop:`2px dashed ${C.border}`}}/><span style={{fontSize:8,color:C.textMuted}}>→</span></div>}
          </div>
        ))}
      </div>
    </div>

    {interviews.map(iv=>(<div key={iv.id} style={S.card}>
      <div style={S.between}>
        <div style={S.flex}>
          <div style={{width:38,height:38,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{iv.emp.avatar}</div>
          <div><div style={{fontSize:13,fontWeight:600}}>{iv.emp.name}</div><div style={{fontSize:11,color:C.textMuted}}>{iv.emp.role} — {iv.emp.dept}</div></div>
        </div>
        <div style={S.flex}><span style={{fontSize:11,color:C.textMuted}}>{iv.date}</span><Badge status={iv.status}/></div>
      </div>
      <WFStepper step={iv.wfStep}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {iv.status==="Scheduled"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>▶ Start Interview</button>}
        {iv.status==="In Progress"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>↺ Resume Interview</button>}
        {iv.plan&&<button onClick={()=>openPlan(iv)} style={{...S.btn,...S.btnSm,...S.btnG}}>📋 View Action Plan</button>}
        {iv.plan&&<button onClick={()=>{openPlan(iv);setPlanTab("gap");}} style={{...S.btn,...S.btnSm,background:C.red,color:"#fff"}}>🔬 Skills Gap</button>}
        {iv.plan&&<button onClick={()=>{openPlan(iv);setPlanTab("training");}} style={{...S.btn,...S.btnSm,background:C.ocean,color:"#fff"}}>📚 Training</button>}
      </div>
    </div>))}
  </div>);
};

// ── CAREER PATHS — Graphical ──
const Pg_Careers = () => {
  const all=useMemo(()=>genPaths(),[]);
  const [df,setDf]=useState("All");const [tf,setTf]=useState("All");const [q,setQ]=useState("");const [exp,setExp]=useState(null);const [pg,setPg]=useState(0);
  const pp=12;const fil=all.filter(p=>(df==="All"||p.domain===df)&&(tf==="All"||p.type===tf)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.steps.some(s=>s.title.toLowerCase().includes(q.toLowerCase()))));
  const paged=fil.slice(pg*pp,(pg+1)*pp);const tp=Math.ceil(fil.length/pp);

  // Graphical workflow for expanded path
  const PathGraph = ({steps}) => (
    <div style={{padding:"16px 0",overflowX:"auto"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:0,minWidth:steps.length*130}}>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={{textAlign:"center",width:110}}>
              <div style={{width:44,height:44,borderRadius:12,background:i===0?C.tealLight:i===steps.length-1?`${C.blue}12`:C.bgSoft,border:`2px solid ${i===0?C.teal:i===steps.length-1?C.blue:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:12,fontWeight:700,color:i===0?C.teal:i===steps.length-1?C.blue:C.textSec,transition:"all .3s"}}>L{s.level}</div>
              <div style={{fontSize:11,fontWeight:600,color:C.text,marginTop:6,lineHeight:1.3}}>{s.title}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center",marginTop:4}}>
                {s.skills.map(sk=><span key={sk} style={{fontSize:8,background:C.tealLight,color:C.teal,padding:"1px 5px",borderRadius:3}}>{sk}</span>)}
              </div>
            </div>
            {i<steps.length-1&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"0 -4px",paddingBottom:40}}>
                <svg width="24" height="20" viewBox="0 0 24 20"><path d="M4 10h16m-4-4l4 4-4 4" stroke={C.teal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (<div>
    <div style={S.between}><p style={S.sub}>{all.length} AI-driven career paths across {DOMAINS.length} domains</p><Badge status="AI-Powered" custom={C.violet}/></div>
    <div style={{...S.card,marginTop:14,padding:14}}>
      <div style={{...S.flex,gap:10}}>
        <input style={{...S.input,maxWidth:220}} placeholder="Search..." value={q} onChange={e=>{setQ(e.target.value);setPg(0);}}/>
        <select style={S.select} value={df} onChange={e=>{setDf(e.target.value);setPg(0);}}><option value="All">All Domains</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select>
        <select style={S.select} value={tf} onChange={e=>{setTf(e.target.value);setPg(0);}}><option value="All">All Types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <span style={{fontSize:11,color:C.textMuted,marginLeft:"auto"}}>{fil.length} paths</span>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"10px 0"}}>
      {DOMAINS.map(d=><span key={d} onClick={()=>{setDf(df===d?"All":d);setPg(0);}} style={{...S.badge,cursor:"pointer",background:df===d?C.tealLight:C.bgSoft,color:df===d?C.teal:C.textMuted,border:`1px solid ${df===d?C.teal:"transparent"}`}}>{d} ({all.filter(p=>p.domain===d).length})</span>)}
    </div>
    <div style={S.grid3}>{paged.map(p=>(
      <div key={p.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setExp(exp===p.id?null:p.id)}>
        <div style={S.between}><Badge status={p.domain} custom={C.teal}/><Badge status={p.type} custom={C.violet}/></div>
        <h4 style={{fontSize:13,fontWeight:700,margin:"10px 0 4px"}}>{p.name}</h4>
        <div style={{fontSize:10,color:C.textMuted}}>{p.steps.length} steps</div>
        {/* Mini graph */}
        <div style={{display:"flex",alignItems:"center",gap:0,margin:"10px 0"}}>
          {p.steps.map((_,i)=><div key={i} style={{flex:1,display:"flex",alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:i===0?C.teal:i===p.steps.length-1?C.blue:C.border,flexShrink:0,border:`1.5px solid ${i===0?C.teal:i===p.steps.length-1?C.blue:C.border}`}}/>{i<p.steps.length-1&&<div style={{flex:1,height:1.5,background:C.border}}/>}</div>)}
        </div>
        {exp===p.id&&<PathGraph steps={p.steps}/>}
      </div>
    ))}</div>
    <div style={{...S.flex,justifyContent:"center",marginTop:14,gap:8}}>
      <button disabled={pg===0} onClick={()=>setPg(p=>p-1)} style={{...S.btn,...S.btnSm,...S.btnO}}>← Prev</button>
      <span style={{fontSize:11,color:C.textMuted}}>Page {pg+1}/{tp}</span>
      <button disabled={pg>=tp-1} onClick={()=>setPg(p=>p+1)} style={{...S.btn,...S.btnSm,...S.btnO}}>Next →</button>
    </div>
  </div>);
};

// ── SKILLS ──
const Pg_Skills = () => {
  const [q,setQ]=useState("");
  const cats={"Technical":["Python","JavaScript","React","SQL","Docker","Kubernetes","Terraform","CI/CD","API Design","Microservices"],"AI & Data":["Machine Learning","Deep Learning","NLP","Data Engineering","GenAI Applications","LLM Fine-tuning","RAG Architecture","MLOps","Prompt Engineering","Agentic AI"],"Cloud":["Azure","AWS","Cloud Architecture","DevOps","Cybersecurity"],"Business":["Project Management","Change Management","Stakeholder Management","Business Analysis","Product Management","Financial Modeling","Risk Analysis"],"Soft Skills":["Communication","Leadership","Strategic Thinking","Problem Solving","Negotiation","Presentation Skills"],"Compliance":["Data Privacy","GDPR Compliance","Data Governance","Insurance Domain"]};
  return (<div>
    <input style={{...S.input,maxWidth:350,marginBottom:14}} placeholder="Search skills..." value={q} onChange={e=>setQ(e.target.value)}/>
    {Object.entries(cats).map(([cat,sks])=>{const f=sks.filter(s=>SKILLS.includes(s)&&(!q||s.toLowerCase().includes(q.toLowerCase())));if(!f.length)return null;return <div key={cat} style={S.card}><h3 style={{...S.h3,marginBottom:10}}>{cat}</h3><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{f.map(s=>(<div key={s} style={{background:C.bgMuted,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",display:"inline-flex",alignItems:"center",gap:8}}><span style={{fontSize:12}}>{s}</span><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(l=><div key={l} style={{width:6,height:6,borderRadius:2,background:l<=3?C.teal:C.bgSoft,border:`1px solid ${l<=3?C.teal:C.border}`}}/>)}</div></div>))}</div></div>;})}
  </div>);
};

// ── WORKFLOWS ──
const Pg_WF = () => {
  const [exp,setExp]=useState(null);
  const wfs=[
    {id:1,n:"Career Interview — Sophie Laurent",tp:"Career Interview",st:4,tot:7,stat:"In Progress",d:"2026-04-10",h:["Scheduled (Apr 10)","Interview Started (Apr 12)","Gap Analysis Generated (Apr 13)","Action Plan Created (Apr 15)","Training Assignment In Progress..."]},
    {id:2,n:"AI Agent Onboarding — AXA-LearnRec",tp:"Agent Deployment",st:3,tot:5,stat:"In Progress",d:"2026-04-08",h:["Configuration (Apr 8)","Data Upload (Apr 9)","Model Training (Apr 10)","Validation..."]},
    {id:3,n:"Career Interview — Marc Dubois",tp:"Career Interview",st:2,tot:7,stat:"In Progress",d:"2026-04-15",h:["Scheduled (Apr 15)","Interview Started (Apr 18)","In Progress..."]},
    {id:4,n:"Skill Assessment — Q2 Batch",tp:"Assessment",st:5,tot:5,stat:"Completed",d:"2026-03-20",h:["Initiated (Mar 20)","Self-Assessment (Mar 25)","Manager Review (Apr 1)","Calibration (Apr 5)","Completed (Apr 8)"]},
  ];
  return (<div>{wfs.map(wf=>(<div key={wf.id} style={S.card}>
    <div style={S.between}><div><h4 style={{fontSize:14,fontWeight:700,margin:0}}>{wf.n}</h4><div style={{...S.flex,marginTop:4}}><Badge status={wf.tp} custom={C.ocean}/><span style={{fontSize:10,color:C.textMuted}}>Started: {wf.d}</span></div></div>
    <div style={S.flex}><Badge status={wf.stat}/>{wf.stat==="In Progress"&&<button style={{...S.btn,...S.btnSm}}>↺ Resume</button>}</div></div>
    <div style={{margin:"10px 0"}}><div style={S.between}><span style={{fontSize:10,color:C.textMuted}}>Step {wf.st}/{wf.tot}</span><span style={{fontSize:10,fontWeight:700,color:C.teal}}>{Math.round(wf.st/wf.tot*100)}%</span></div><Bar pct={wf.st/wf.tot*100}/></div>
    <div style={{cursor:"pointer",fontSize:11,color:C.teal,fontWeight:500}} onClick={()=>setExp(exp===wf.id?null:wf.id)}>{exp===wf.id?"▼ Hide":"▶ Show"} History</div>
    {exp===wf.id&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`}}>{wf.h.map((h,i)=><div key={i} style={{...S.flex,padding:"5px 0"}}><div style={{width:8,height:8,borderRadius:"50%",background:i<wf.st?C.teal:i===wf.st?C.orange:C.bgSoft}}/><span style={{fontSize:11,color:i<wf.st?C.text:C.textMuted}}>{h}</span>{i<wf.st&&<span style={{color:C.teal,fontSize:10}}>✓</span>}</div>)}</div>}
  </div>))}</div>);
};

// ── REPORTS ──
const Pg_Reports = () => (<div>
  <div style={S.grid4}>{[{l:"Mobility Rate",v:"23%",t:"30%",p:77,c:C.teal},{l:"Time to Fill",v:"18d",t:"<30d",p:90,c:C.success},{l:"Skills Coverage",v:"72%",t:"85%",p:85,c:C.ocean},{l:"Action Plans",v:"42",t:"60",p:70,c:C.violet}].map(m=>(<div key={m.l} style={S.card}><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>{m.l}</div><div style={{fontSize:28,fontWeight:800,fontFamily:FONT_HEAD,color:m.c,margin:"6px 0"}}>{m.v}</div><div style={{fontSize:10,color:C.textMuted,marginBottom:6}}>Target: {m.t}</div><Bar pct={m.p} color={m.c}/></div>))}</div>
  <div style={S.grid2}>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:12}}>By Domain</h3>{DOMAINS.slice(0,6).map((d,i)=>(<div key={d} style={{...S.flex,marginBottom:8}}><span style={{fontSize:11,color:C.textMuted,width:120}}>{d}</span><div style={{flex:1}}><Bar pct={[65,82,45,58,73,91][i]} color={[C.teal,C.success,C.orange,C.ocean,C.violet,C.teal][i]}/></div><span style={{fontSize:11,fontWeight:600,width:30,textAlign:"right"}}>{[65,82,45,58,73,91][i]}%</span></div>))}</div>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:12}}>AI Performance</h3>{AI_AGENTS.map(a=>(<div key={a.id} style={{...S.flex,marginBottom:8}}><span style={{fontSize:12}}>🤖</span><span style={{fontSize:11,width:100}}>{a.name}</span><div style={{flex:1}}><Bar pct={a.accuracy} color={C.violet}/></div><span style={{fontSize:11,fontWeight:700,color:C.violet,width:30,textAlign:"right"}}>{a.accuracy}%</span></div>))}</div>
  </div>
  <div style={S.card}><h3 style={{...S.h3,marginBottom:12}}>Pipeline</h3><div style={S.grid3}>{[{l:"Trainings Active",v:67,e:"📚",c:C.ocean},{l:"Certs Achieved",v:23,e:"🏅",c:C.teal},{l:"Plans Complete",v:31,e:"🎯",c:C.violet}].map(s=>(<div key={s.l} style={{textAlign:"center",padding:16}}><span style={{fontSize:28}}>{s.e}</span><div style={{fontSize:30,fontWeight:800,fontFamily:FONT_HEAD,marginTop:6,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{s.l}</div></div>))}</div></div>
</div>);

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function App(){
  const [authed,setAuthed]=useState(false);
  const [persona,setPersona]=useState(null);
  const [page,setPage]=useState("dashboard");

  if(!authed) return <AuthScreen onLogin={p=>{setPersona(p);setAuthed(true);}}/>;

  const titles={dashboard:"Dashboard",charter:"Smart Mobility Charter",marketplace:"Talent Marketplace",team:"My Team",interviews:"Career Interviews",careers:"Career Paths",skills:"Skills Repository",workflows:"Workflows",reports:"Reports & Analytics"};

  const pages={
    dashboard:<Pg_Dash go={setPage}/>,charter:<Pg_Charter/>,marketplace:<Pg_Market/>,team:<Pg_Team/>,
    interviews:<Pg_Interviews persona={persona} goSkills={()=>setPage("skills")}/>,
    careers:<Pg_Careers/>,skills:<Pg_Skills/>,workflows:<Pg_WF/>,reports:<Pg_Reports/>,
  };

  return (
    <div style={{fontFamily:FONT,background:C.bg,color:C.text,minHeight:"100vh",display:"flex",overflow:"hidden",height:"100vh",fontSize:13}}>
      <style>{css}</style>
      <Sidebar active={page} setActive={setPage} persona={persona} onLogout={()=>{setAuthed(false);setPersona(null);setPage("dashboard");}}/>
      <div style={{flex:1,overflow:"auto",padding:"0 28px 28px"}}>
        {/* Top Bar */}
        <div style={{...S.between,padding:"14px 0 16px",borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
          <div><h1 style={S.h1}>{titles[page]}</h1><p style={S.sub}>Mobility by Design · AXA Group Operations</p></div>
          <div style={S.flex}><Badge status={persona?.label} custom={persona?.color}/><Badge status="RBAC" custom={C.teal}/></div>
        </div>
        {pages[page]}
      </div>
    </div>
  );
}
