import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SMART MOBILITY PLATFORM v6.0 — STABILIZATION RELEASE
   AXA Group Operations · Enterprise HR/Talent/AI Workforce
   
   REGRESSIONS FIXED:
   ✓ Persona selection BEFORE SSO authentication
   ✓ All buttons fully functional (no dead clicks)
   ✓ AXA blue nav + white/grey backgrounds
   ✓ Marketplace restored: mobility intent, skills tags, filtering
   ✓ Schedule Interview form working end-to-end
   ✓ Workforce ID Card on employee selection
   
   ENHANCEMENTS:
   ✓ Skills Gap Process (assessment → validation → visualization)
   ✓ Skills Repository: add skill, duplicates, AI matching
   ✓ Graphical career path workflows (SVG arrows)
   ✓ Linked flow: Interview → Gap → Plan → Training → Cert → Assessment
   ✓ Action Plan completion form with manager/employee sections
   ✓ Realistic sample data throughout
   ═══════════════════════════════════════════════════════════════ */

// ── Design Tokens ──
const T = {
  // AXA Brand
  axaBlue: "#00008F", axaNavy: "#000062", axaMid: "#3032C1",
  axaRed: "#FF1721", axaRedDark: "#C91432",
  // Light theme (Claude-like warm grey)
  bg: "#F4F4F0", bgSoft: "#ECEEE8", bgCard: "#FFFFFF", bgMuted: "#F8F8F5",
  border: "#DDD9D0", borderFocus: "#00008F",
  // Text
  ink: "#1B1B18", inkSec: "#555550", inkMuted: "#8A8A80", inkDim: "#B5B5AA",
  // Functional
  teal: "#0C8C6E", tealBg: "#E8F5F0",
  red: "#CC2200", redBg: "#FFF0EC",
  orange: "#CC7A00", orangeBg: "#FFF5E6",
  violet: "#5B47C0", violetBg: "#F0EDFF",
  ocean: "#0070A8", oceanBg: "#EAF5FA",
  green: "#0C8C6E", greenBg: "#E8F5F0",
  white: "#FFFFFF",
};
const FT = "'Satoshi', 'DM Sans', -apple-system, sans-serif";
const FH = "'Newsreader', 'Instrument Serif', Georgia, serif";

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
button{cursor:pointer;font-family:${FT}}
input,select,textarea{font-family:${FT}}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:${T.bgSoft}}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(.96);opacity:0}100%{transform:scale(1);opacity:1}}
`;

// ── Styles ──
const S = {
  card:{background:T.bgCard,borderRadius:10,border:`1px solid ${T.border}`,padding:18,marginBottom:12,animation:"fadeUp .3s ease",boxShadow:"0 1px 3px rgba(0,0,0,.03)"},
  btn:{background:T.axaBlue,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontWeight:600,fontSize:12,display:"inline-flex",alignItems:"center",gap:5,transition:"all .15s"},
  btnSm:{padding:"5px 12px",fontSize:11},
  btnO:{background:"transparent",border:`1.5px solid ${T.axaBlue}`,color:T.axaBlue},
  btnTeal:{background:T.teal},
  btnRed:{background:T.axaRed},
  btnG:{background:`linear-gradient(135deg,${T.teal},${T.ocean})`},
  badge:{display:"inline-block",padding:"2px 9px",borderRadius:16,fontSize:10,fontWeight:600},
  input:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,width:"100%",outline:"none",boxSizing:"border-box"},
  select:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,outline:"none"},
  label:{fontSize:10,color:T.inkMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5,display:"block"},
  tag:{background:T.tealBg,color:T.teal,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,display:"inline-block"},
  flex:{display:"flex",alignItems:"center",gap:8},
  between:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  g2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},
  g3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12},
  g4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10},
  h1:{fontFamily:FH,fontSize:24,fontWeight:700,color:T.ink},
  h3:{fontSize:14,fontWeight:700,color:T.ink},
};

// ── Utils ──
const Bd = ({status,custom})=>{const m={active:T.teal,training:T.orange,idle:T.inkMuted,completed:T.teal,"in progress":T.ocean,"not started":T.inkDim,planned:T.violet,registered:T.orange,achieved:T.teal,Senior:T.teal,Mid:T.ocean,Junior:T.orange,Lead:T.violet,High:T.red,Medium:T.orange,Low:T.inkMuted};const c=custom||m[status]||m[status?.toLowerCase()]||T.inkMuted;return<span style={{...S.badge,background:`${c}14`,color:c,border:`1px solid ${c}20`}}>{status}</span>;};
const Bar = ({pct,color=T.teal,h=5})=>(<div style={{height:h,borderRadius:h,background:T.bgSoft,width:"100%",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h,transition:"width .5s"}}/></div>);
const Chips = ({options,selected,onToggle,max=20})=>(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{options.slice(0,max).map(o=>(<span key={o} onClick={()=>onToggle(o)} style={{...S.badge,cursor:"pointer",background:selected.includes(o)?T.tealBg:T.bgSoft,color:selected.includes(o)?T.teal:T.inkMuted,border:`1px solid ${selected.includes(o)?T.teal:"transparent"}`}}>{o}</span>))}</div>);
const Logo = ({s=26})=>(<div style={{width:s,height:s,borderRadius:5,background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:s*.36,fontWeight:800}}>AXA</span></div>);

// ══════════════════════════════════════════════════════════════
// DATA — Realistic Sample Data
// ══════════════════════════════════════════════════════════════
const SKILLS=["Python","JavaScript","React","TypeScript","Azure","AWS","Machine Learning","Deep Learning","NLP","Data Engineering","SQL","Power BI","Tableau","Agile","Scrum","DevOps","CI/CD","Kubernetes","Docker","Terraform","Project Management","Change Management","Stakeholder Management","Risk Analysis","Financial Modeling","UX Design","API Design","Microservices","Cloud Architecture","Cybersecurity","Data Privacy","GDPR","Communication","Leadership","Strategic Thinking","Problem Solving","Prompt Engineering","Agentic AI","RPA","Process Automation","Business Analysis","Product Management","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Data Governance","Insurance Domain","Negotiation","Presentation Skills"];

const SKILL_CATS={"Technical":SKILLS.slice(0,10),"Cloud & Infra":["Azure","AWS","Cloud Architecture","DevOps","Kubernetes","Docker","Terraform","CI/CD"],"AI & Data":["Machine Learning","Deep Learning","NLP","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Prompt Engineering","Agentic AI"],"Business":["Project Management","Change Management","Stakeholder Management","Business Analysis","Product Management","Financial Modeling","Risk Analysis"],"Soft Skills":["Communication","Leadership","Strategic Thinking","Problem Solving","Negotiation","Presentation Skills"],"Compliance":["Data Privacy","GDPR","Data Governance","Insurance Domain"]};

const PERSONAS=[
  {id:"admin",label:"Platform Admin",icon:"⚙️",desc:"Full access — config, users, agents, all modules",color:T.axaRed,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports"]},
  {id:"hr",label:"HR / Talent Lead",icon:"👥",desc:"Talent marketplace, interviews, action plans, skills & reporting",color:T.teal,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports"]},
  {id:"manager",label:"Manager",icon:"📋",desc:"Team management, career interviews, action plans",color:T.ocean,access:["dashboard","charter","marketplace","team","interviews","careers","skills","workflows"]},
  {id:"employee",label:"Employee",icon:"👤",desc:"Self-service — career paths, skill profile, participation",color:T.violet,access:["dashboard","charter","marketplace","careers","skills"]},
];

const EMP=[
  {id:1,name:"Sophie Laurent",role:"Data Scientist",dept:"Data & AI",skills:["Python","Machine Learning","SQL","Deep Learning","NLP"],level:"Senior",avatar:"SL",aiLvl:"Advanced / expert",yrs:7,mobility:true,intent:"Looking for AI leadership role",perf:[{yr:"2025",score:4.5,note:"Exceeds expectations"},{yr:"2024",score:4.2,note:"Strong contributor"},{yr:"2023",score:4.0,note:"Solid performer"}],teams:["Data Science Core","AI Innovation Lab"],bg:"MSc Data Science, École Polytechnique. 7 years in data roles at AXA."},
  {id:2,name:"Marc Dubois",role:"DevOps Engineer",dept:"Technology",skills:["Kubernetes","Docker","CI/CD","Terraform","Azure"],level:"Mid",avatar:"MD",aiLvl:"Autonomous",yrs:4,mobility:true,intent:"Interested in Cloud Architecture",perf:[{yr:"2025",score:3.8,note:"Meets expectations"},{yr:"2024",score:4.0,note:"Good growth"},{yr:"2023",score:3.5,note:"Developing"}],teams:["Platform Engineering"],bg:"BEng Computer Science, INSA Lyon. 4 years infrastructure."},
  {id:3,name:"Amina Benali",role:"Product Manager",dept:"Product",skills:["Product Management","Agile","UX Design","Stakeholder Management","Communication"],level:"Senior",avatar:"AB",aiLvl:"Tools with guidance",yrs:9,mobility:true,intent:"VP Product track",perf:[{yr:"2025",score:4.7,note:"Outstanding"},{yr:"2024",score:4.5,note:"Exceeds"},{yr:"2023",score:4.3,note:"Strong"}],teams:["Digital Products","Customer Experience"],bg:"MBA HEC Paris. 9 years in product across fintech and insurance."},
  {id:4,name:"Thomas Moreau",role:"Financial Analyst",dept:"Finance",skills:["Financial Modeling","Power BI","SQL","Risk Analysis"],level:"Junior",avatar:"TM",aiLvl:"Basic awareness",yrs:2,mobility:false,intent:"",perf:[{yr:"2025",score:3.5,note:"Meets expectations"},{yr:"2024",score:3.2,note:"Learning curve"}],teams:["Group Finance"],bg:"MSc Finance, Paris Dauphine. 2 years at AXA."},
  {id:5,name:"Elena Rossi",role:"HR Business Partner",dept:"HR & Talent",skills:["Change Management","Stakeholder Management","Communication","Leadership","Strategic Thinking"],level:"Mid",avatar:"ER",aiLvl:"Tools with guidance",yrs:6,mobility:true,intent:"HR Director aspiration",perf:[{yr:"2025",score:4.1,note:"Strong HRBP"},{yr:"2024",score:3.9,note:"Good partner"},{yr:"2023",score:3.7,note:"Growing impact"}],teams:["HR Operations","Talent Development"],bg:"MA Human Resources, Bocconi. 6 years HR at AXA Italy then France."},
  {id:6,name:"Karim Hassan",role:"Cloud Architect",dept:"Technology",skills:["Azure","AWS","Cloud Architecture","Microservices","Cybersecurity","Kubernetes"],level:"Lead",avatar:"KH",aiLvl:"Advanced / expert",yrs:11,mobility:true,intent:"CTO track — interested in strategy roles",perf:[{yr:"2025",score:4.8,note:"Exceptional"},{yr:"2024",score:4.6,note:"Tech leader"},{yr:"2023",score:4.5,note:"Outstanding"}],teams:["Cloud Center of Excellence","Architecture Board"],bg:"MEng Imperial College. 11 years across Microsoft and AXA."},
  {id:7,name:"Claire Martin",role:"UX Designer",dept:"Product",skills:["UX Design","Communication","Problem Solving","Presentation Skills"],level:"Senior",avatar:"CM",aiLvl:"Autonomous",yrs:5,mobility:false,intent:"",perf:[{yr:"2025",score:4.0,note:"Creative leader"},{yr:"2024",score:3.8,note:"Good contributor"}],teams:["Design System","Mobile UX"],bg:"BFA Design, Parsons Paris. 5 years UX in insurance."},
  {id:8,name:"Yuki Tanaka",role:"ML Engineer",dept:"Data & AI",skills:["Python","Deep Learning","MLOps","LLM Fine-tuning","RAG Architecture","GenAI"],level:"Senior",avatar:"YT",aiLvl:"Advanced / expert",yrs:6,mobility:true,intent:"AI Director — wants to lead GenAI strategy",perf:[{yr:"2025",score:4.6,note:"GenAI pioneer"},{yr:"2024",score:4.4,note:"Strong technical"},{yr:"2023",score:4.1,note:"High potential"}],teams:["AI Platform","GenAI Lab"],bg:"PhD Machine Learning, Tokyo University. 6 years ML at AXA."},
  {id:9,name:"Lucas Ferreira",role:"Scrum Master",dept:"Technology",skills:["Agile","Scrum","Communication","Stakeholder Management","Problem Solving"],level:"Mid",avatar:"LF",aiLvl:"Basic awareness",yrs:3,mobility:true,intent:"Agile Coach or Product Owner",perf:[{yr:"2025",score:3.9,note:"Good facilitator"},{yr:"2024",score:3.6,note:"Growing"}],teams:["Delivery Excellence"],bg:"BSc IT, Universidade de Lisboa. 3 years agile roles."},
  {id:10,name:"Nadia Kowalski",role:"Compliance Officer",dept:"Risk",skills:["GDPR","Data Privacy","Risk Analysis","Data Governance","Communication"],level:"Senior",avatar:"NK",aiLvl:"Tools with guidance",yrs:8,mobility:false,intent:"",perf:[{yr:"2025",score:4.2,note:"Risk expert"},{yr:"2024",score:4.0,note:"Reliable"},{yr:"2023",score:3.9,note:"Consistent"}],teams:["Group Compliance","Data Protection"],bg:"LLM European Law, Jagiellonian. 8 years compliance at AXA."},
];

const AI_AGENTS=[
  {id:"ai-1",name:"AXA-SkillMatch",role:"Skills Matching",skills:["NLP","Recommendation Engine"],status:"active",desc:"Matches employees to positions via semantic skill analysis.",accuracy:94,tasks:127},
  {id:"ai-2",name:"AXA-CareerPath",role:"Career Advisor",skills:["Career Modeling","Gap Analysis"],status:"active",desc:"Personalized career trajectories based on skills & demand.",accuracy:91,tasks:84},
  {id:"ai-3",name:"AXA-LearnRec",role:"Learning Recommender",skills:["Content Curation","Cert Mapping"],status:"training",desc:"Training & certification recommendations.",accuracy:87,tasks:0},
  {id:"ai-4",name:"AXA-WorkforceAI",role:"Workforce Planning",skills:["Demand Forecasting","Scenario Analysis"],status:"active",desc:"Talent demand/supply forecasting.",accuracy:92,tasks:56},
  {id:"ai-5",name:"AXA-InterviewBot",role:"Interview Copilot",skills:["Conversation AI","Competency Assessment"],status:"idle",desc:"Real-time interview assistance.",accuracy:85,tasks:0},
];

const IQ=[
  {id:1,q:"What are your overall long-term career aspirations?",t:"s",o:["Grow as expert in current field","Move to different functional area","Move into people management","Strategic / transversal role","International / cross-entity","Not sure yet"]},
  {id:2,q:"Short to medium-term aspirations within AXA? (3-5 years)",t:"s",o:["Progress in current role","Different role, similar level","Higher-responsibility role","Short-term missions / projects"]},
  {id:3,q:"Which aspirations align with AXA's job opportunities?",t:"x",o:[],note:"Interviewer provides future job samples (e.g. Agentic AI)"},
  {id:4,q:"What are your current skills and strengths?",t:"m",o:SKILLS.slice(0,20)},
  {id:5,q:"Current level of AI skills?",t:"s",o:["No knowledge","Basic awareness","Tools with guidance","Autonomous","Advanced / expert"]},
  {id:6,q:"Skills you're most eager to develop?",t:"m",o:SKILLS.slice(8,28)},
  {id:7,q:"Interested in a job change short term?",t:"s",o:["Yes","No"],cond:true},
  {id:"7a",q:"Reasons for not exploring mobility now?",t:"s",o:["Comfortable in current role","Skill gaps first","No visible opportunities"],on:7,val:"No"},
  {id:8,q:"When open to a job change?",t:"s",o:["Within 6 months","6–12 months","1–2 years","2+ years","Don't foresee a move"]},
  {id:9,q:"Consider geographic mobility?",t:"s",o:["Yes internationally","Within my country","Remote only","No"]},
  {id:10,q:"Training/development activities needed?",t:"m",o:["Formal training","On-the-job learning","Mentoring/coaching","Short-term mission","Certification","None needed"]},
  {id:11,q:"Specific opportunities to explore?",t:"x",o:[]},
];

const DOMAINS=["Technology","Data & AI","Operations","Finance","HR & Talent","Risk & Compliance","Product","Strategy"];
const WF=["Scheduled","Interview","Gap Analysis","Action Plan","Training","Assessment","Completed"];

const CHARTER=[
  {title:"Smart Mobility Ecosystem",icon:"🌐",items:[{t:"Today → Tomorrow",c:"Human-Only → Hybrid Human+Agent. AI: Automate, Analyse, Recommend. Human: Decide, Validate, Accountable.",hl:"Human always stays accountable for every outcome"},{t:"Matching Engine",c:"AXA entities provide Business Roadmap & Skills Needs → Matching Engine connects Talents & AI Agents to Roles."},{t:"Role Categories",c:"Orchestration (Strategy · Direction), Execution (Delivery · Operations), Hybrid (Human + Agent)."}]},
  {title:"Guiding Principles",icon:"📐",items:[{t:"01 Hybrid Teams",c:"AI enablement & convergence"},{t:"02 Scope",c:"Define org change & impacted resources"},{t:"03 Urgency",c:"Varies by function & stakeholder"},{t:"04 SLA/KPIs",c:"Managers mandated to support"},{t:"05 Business-Need",c:"Short & long-term goals"},{t:"06 Internal First",c:"Internal always over external"},{t:"07 Standard",c:"Reach industry mobility standard"},{t:"08 Priorities",c:"Business-critical priorities shape framework"}]},
  {title:"Business Case",icon:"📊",items:[{t:"Productivity",c:"Internal: Weeks | External: 6-12 months"},{t:"Cost",c:"Internal: Low/Zero | External: 1-2× salary"},{t:"Cultural Fit",c:"Internal: Embedded | External: Risk"},{t:"Knowledge",c:"Internal: 100% retained | External: Lost"},{t:"Returns",c:"Internal: Compounds | External: Resets"}]},
];

const genPaths=()=>{const t=[{d:"Technology",p:["Junior Dev → Senior Dev → Tech Lead → Staff Engineer → Principal Architect","Support Analyst → Platform Engineer → SRE Lead → VP Infrastructure","QA Engineer → QA Lead → Test Architect → Quality Director","Frontend Dev → UI Engineer → Design System Lead","Backend Dev → API Architect → Platform Lead → CTO Track","Security Analyst → Security Engineer → CISO Track","DevOps Engineer → Platform Lead → Cloud Director","Network Engineer → Network Architect → Infra VP","IT Support → Systems Admin → IT Manager → IT Director","Release Manager → Engineering Manager → VP Engineering","Integration Dev → ESB Architect → Enterprise Architect","Mobile Dev → Mobile Lead → Cross-Platform Architect","Database Admin → Data Platform Lead → CDO Track"]},{d:"Data & AI",p:["Data Analyst → Senior Analyst → Analytics Manager → Head of Analytics","ML Engineer → Senior ML → ML Lead → AI Director","Data Scientist → Lead Scientist → Chief Data Scientist","BI Analyst → BI Developer → BI Manager → Analytics VP","AI Researcher → Applied AI Lead → AI Strategy Director","NLP Engineer → Conversational AI Lead → AI Product Dir","MLOps Engineer → ML Platform Lead → AI Infra Director","Prompt Engineer → AI Solutions Architect → GenAI Director","Data Gov Analyst → DG Manager → Chief Data Officer","AI Ethics Analyst → Responsible AI Lead → Policy Dir","Statistician → Lead Statistician → Quantitative Dir","CV Engineer → CV Lead → Applied AI VP","Knowledge Engineer → Ontology Lead → KG Director"]},{d:"Operations",p:["Ops Analyst → Ops Manager → Head of Ops → COO Track","Process Analyst → Process Lead → Excellence Director","Service Desk → Service Manager → IT Service Dir","Claims Handler → Claims Lead → Claims Ops Dir","Underwriting Asst → Underwriter → Chief Underwriter","Supply Chain → SC Manager → VP Supply Chain","Quality Analyst → Quality Manager → VP Quality","Logistics → Logistics Manager → VP Logistics","Facilities → Facilities Manager → VP Real Estate","BPO Analyst → BPO Manager → Outsourcing Dir","Procurement → Procurement Manager → CPO Track","Vendor Manager → Sourcing Lead → VP Procurement","Ops Research → OR Lead → Decision Science Dir"]},{d:"Finance",p:["Financial Analyst → Senior FA → Finance Manager → CFO Track","Accountant → Senior Accountant → Controller → VP Finance","Actuary → Senior Actuary → Chief Actuary","Internal Auditor → Audit Manager → Chief Audit Exec","Tax Analyst → Tax Manager → VP Tax","Treasury Analyst → Treasury Manager → VP Treasury","FP&A Analyst → FP&A Manager → VP Planning","Investment Analyst → Portfolio Manager → CIO Track","Compliance → Compliance Manager → CCO","Revenue Analyst → Revenue Manager → VP Revenue","Cost Analyst → Cost Manager → VP Cost Optimization","Billing → Billing Manager → Revenue Cycle Dir","Credit Analyst → Credit Manager → CCrO"]},{d:"HR & Talent",p:["HR Coordinator → HRBP → HR Manager → HR Director → CHRO","Recruiter → Senior Recruiter → TA Lead → VP TA","L&D Specialist → L&D Manager → CLO","Comp & Ben → C&B Manager → Total Rewards Dir","HRIS → HRIS Manager → HR Tech Director","Employee Rel → ER Manager → VP Employee Experience","Workforce Planner → WFP Manager → VP Strategy","DE&I Coordinator → DE&I Manager → CDO","TM Specialist → TM Lead → VP Talent","OD Consultant → OD Manager → VP Org Development","Career Coach → Career Dev Lead → VP Mobility","Change Manager → Change Lead → VP Transformation","People Analytics → PA Manager → VP People Insights"]},{d:"Risk & Compliance",p:["Risk Analyst → Risk Manager → CRO Track","Compliance Officer → Senior Compliance → VP Compliance","Fraud Analyst → Fraud Manager → VP Fraud Prevention","AML Analyst → AML Manager → VP Financial Crime","Regulatory → Reg Manager → VP Regulatory","Info Security → CISO Track","Privacy Analyst → DPO Track","OpRisk → OpRisk Manager → VP Operational Risk","Market Risk → Lead → VP Market Risk","Credit Risk → Manager → VP Credit Risk","Model Risk → Validation Lead → VP Model Risk","Business Continuity → BC Manager → VP Resilience","Third Party Risk → TPRM Lead → VP Vendor Risk"]},{d:"Product",p:["Product Analyst → PM → Senior PM → VP Product","UX Researcher → UX Lead → Head of Design","Product Designer → Design Lead → CDO","Growth Analyst → Growth Manager → VP Growth","Product Owner → Senior PO → Head of Product","Technical Writer → Doc Lead → VP Content","Product Marketing → PMM Lead → VP PMM","Customer Success → CS Manager → VP CS","Solutions Architect → Solutions Dir → VP Solutions","Product Ops → ProdOps Lead → VP ProdOps","API PM → Platform PM → VP Platform","Digital Product → Digital Lead → CDO","Innovation Analyst → Innovation Lead → VP Innovation"]},{d:"Strategy",p:["Strategy Analyst → Strategy Manager → VP Strategy → CSO","M&A Analyst → M&A Manager → VP Corp Dev","Business Dev → BD Manager → VP BD","Market Research → Insights Manager → VP Intel","Partnerships → Partnership Lead → VP Alliances","Transformation Lead → VP Transformation → CTO","Corp Planning → Planning Dir → VP Corp Strategy","Competitive Intel → CI Manager → VP Strategic Intel","Digital Strategy → DT Lead → CDO","ESG Analyst → ESG Manager → CSO","Innovation Strategy → Innovation Dir → VP Innovation","Portfolio Strategy → Portfolio Dir → VP Portfolio","New Ventures → Ventures Lead → VP New Business"]}];let id=1;const paths=[];t.forEach(g=>g.p.forEach((p,i)=>{const steps=p.split(" → ");paths.push({id:id++,domain:g.d,type:["Expert","Management","Hybrid"][i%3],name:steps[steps.length-1],steps:steps.map((s,si)=>({title:s,level:si+1,skills:SKILLS.slice((id+si*3)%30,(id+si*3)%30+3)}))});}));return paths;};

// ══════════════════════════════════════════════════════════════
// AUTH — Persona FIRST then SSO
// ══════════════════════════════════════════════════════════════
const Auth=({onLogin})=>{
  const[step,setStep]=useState("persona");
  const[persona,setPersona]=useState(null);
  const[email,setEmail]=useState("yassir.abdelfettah@axa.com");
  const[loading,setLoading]=useState(false);
  const pick=p=>{setPersona(p);setStep("sso");};
  const doSSO=()=>{if(!email.includes("@"))return;setLoading(true);setTimeout(()=>{setLoading(false);onLogin(persona);},1200);};
  if(step==="persona")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FT}}>
      <style>{css}</style>
      <div style={{maxWidth:720,width:"100%",padding:40,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo s={48}/><div style={{margin:"0 auto",width:48}}/>
          <h1 style={{fontFamily:FH,fontSize:34,fontWeight:700,color:T.ink,marginTop:16}}>SMART <span style={{color:T.teal}}>Mobility</span></h1>
          <p style={{color:T.inkSec,fontSize:13,marginTop:6}}>AXA Group Operations — Select your role</p>
          <div style={{display:"inline-flex",gap:6,marginTop:10}}><Bd status="v6.0" custom={T.axaBlue}/><Bd status="Enterprise" custom={T.teal}/><Bd status="AI-Powered" custom={T.violet}/></div>
        </div>
        <div style={S.g2}>{PERSONAS.map(p=>(<div key={p.id} onClick={()=>pick(p)} style={{...S.card,cursor:"pointer",border:`2px solid ${T.border}`,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.boxShadow=`0 4px 16px ${p.color}15`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow="none";}}>
          <div style={S.flex}><div style={{width:42,height:42,borderRadius:10,background:`${p.color}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.ink}}>{p.label}</div><div style={{fontSize:11,color:T.inkMuted,marginTop:2}}>{p.desc}</div></div></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:10}}>{p.access.slice(0,5).map(a=><span key={a} style={{...S.badge,background:`${p.color}08`,color:p.color,fontSize:9}}>{a}</span>)}{p.access.length>5&&<span style={{...S.badge,background:T.bgSoft,color:T.inkMuted,fontSize:9}}>+{p.access.length-5}</span>}</div>
        </div>))}</div>
      </div>
    </div>);
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FT}}>
      <style>{css}</style>
      <div style={{width:400,background:T.bgCard,borderRadius:14,border:`1px solid ${T.border}`,padding:36,boxShadow:"0 8px 32px rgba(0,0,0,.05)",animation:"popIn .4s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}><Logo s={36}/><div style={{margin:"0 auto",width:36}}/><h2 style={{fontFamily:FH,fontSize:20,fontWeight:700,marginTop:12}}>AXA SSO</h2><p style={{fontSize:12,color:T.inkSec,marginTop:4}}>Signing in as <strong style={{color:persona.color}}>{persona.label}</strong></p></div>
        <div style={{marginBottom:14}}><label style={S.label}>Email</label><input style={{...S.input,borderColor:email.includes("@")?T.teal:T.border}} value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div style={{marginBottom:18}}><label style={S.label}>Password</label><input style={S.input} type="password" defaultValue="••••••••••"/></div>
        <button onClick={doSSO} disabled={loading} style={{...S.btn,width:"100%",justifyContent:"center",padding:11,fontSize:13,opacity:loading?.7:1}}>{loading?"⏳ Authenticating...":"🔐 Sign In"}</button>
        <div style={{marginTop:12,padding:10,background:T.bgSoft,borderRadius:7,border:`1px solid ${T.axaBlue}10`}}><div style={{fontSize:9,color:T.axaBlue,fontWeight:700}}>🔒 SECURITY</div><div style={{fontSize:9,color:T.inkMuted,marginTop:2}}>Azure AD · MFA · JWT RS256 · 8h session</div></div>
        <button onClick={()=>{setStep("persona");setPersona(null);}} style={{...S.btn,...S.btnO,...S.btnSm,width:"100%",justifyContent:"center",marginTop:10}}>← Different role</button>
      </div>
    </div>);
};

// ══════════════════════════════════════════════════════════════
// SIDEBAR — AXA Blue Navigation
// ══════════════════════════════════════════════════════════════
const NAV=[{k:"dashboard",l:"Dashboard",e:"📊"},{k:"charter",l:"Smart Charter",e:"📜"},{k:"marketplace",l:"Marketplace",e:"🏪"},{k:"team",l:"My Team",e:"👥"},{k:"interviews",l:"Interviews",e:"🎯"},{k:"careers",l:"Career Paths",e:"🚀"},{k:"skills",l:"Skills Repo",e:"💡"},{k:"workflows",l:"Workflows",e:"⚙️"},{k:"reports",l:"Reports",e:"📈"}];

const Side=({active,go,persona,onLogout})=>(
  <div style={{width:210,background:T.axaBlue,display:"flex",flexDirection:"column",flexShrink:0}}>
    <div style={{padding:"16px 16px 12px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
      <div style={S.flex}><div style={{width:26,height:26,borderRadius:5,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:9,fontWeight:800}}>AXA</span></div><div><div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:"#fff"}}>SMART <span style={{color:"#8df"}}>Mobility</span></div><div style={{fontSize:8,color:"rgba(255,255,255,.5)",letterSpacing:1.2,textTransform:"uppercase"}}>Group Operations</div></div></div>
    </div>
    <div style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
      {NAV.filter(n=>(persona?.access||[]).includes(n.k)).map(n=>(
        <div key={n.k} onClick={()=>go(n.k)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",cursor:"pointer",background:active===n.k?"rgba(255,255,255,.12)":"transparent",borderLeft:active===n.k?"3px solid #fff":"3px solid transparent",color:active===n.k?"#fff":"rgba(255,255,255,.6)",fontSize:12,fontWeight:active===n.k?600:400,transition:"all .12s"}}><span style={{fontSize:13}}>{n.e}</span>{n.l}</div>
      ))}
    </div>
    <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.1)"}}>
      <div style={S.flex}><div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>YA</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:"#fff"}}>Yassir A.</div><div style={{fontSize:9,color:persona?.color??"rgba(255,255,255,.5)"}}>{persona?.label}</div></div></div>
      <button onClick={onLogout} style={{marginTop:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,padding:"5px 0",width:"100%",color:"rgba(255,255,255,.7)",fontSize:10,fontWeight:500}}>Sign Out</button>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════

// ── DASHBOARD ──
const PgDash=({go})=>(<div>
  <div style={S.g4}>{[{l:"Employees",v:247,d:"+12",c:T.teal,p:"team"},{l:"AI Agents",v:5,d:"+2",c:T.violet,p:"team"},{l:"Positions",v:34,d:"-3",c:T.ocean,p:"marketplace"},{l:"Interviews",v:18,d:"+5",c:T.orange,p:"interviews"}].map(s=>(<div key={s.l} onClick={()=>go(s.p)} style={{...S.card,cursor:"pointer"}}><div style={S.between}><span style={{fontSize:20}}>{s.l==="AI Agents"?"🤖":s.l==="Employees"?"👥":s.l==="Positions"?"📋":"🎯"}</span><span style={{fontSize:10,fontWeight:700,color:s.d[0]==="+"?T.teal:T.red}}>{s.d}</span></div><div style={{fontSize:26,fontWeight:800,fontFamily:FH,color:T.ink,marginTop:6}}>{s.v}</div><div style={{fontSize:11,color:T.inkMuted}}>{s.l}</div></div>))}</div>
  <div style={S.g2}>
    <div style={S.card}><h3 style={S.h3}>Pipeline</h3><div style={{marginTop:12}}>{["Scheduled","In Progress","Action Plan","Training","Completed"].map((s,i)=>(<div key={s} style={{...S.flex,marginBottom:8}}><span style={{fontSize:11,color:T.inkMuted,width:120}}>{s}</span><div style={{flex:1}}><Bar pct={[25,45,60,35,80][i]} color={[T.ocean,T.orange,T.teal,T.violet,T.green][i]}/></div><span style={{fontSize:11,fontWeight:600,width:24,textAlign:"right"}}>{[12,18,24,9,31][i]}</span></div>))}</div></div>
    <div style={S.card}><h3 style={S.h3}>AI Agents</h3><div style={{marginTop:12}}>{AI_AGENTS.slice(0,4).map(a=>(<div key={a.id} style={{...S.flex,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:14}}>🤖</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.tasks} tasks</div></div><Bd status={a.status}/></div>))}</div></div>
  </div>
  <div style={S.card}><h3 style={{...S.h3,marginBottom:10}}>Quick Actions</h3><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[{l:"Schedule Interview",p:"interviews"},{l:"Marketplace",p:"marketplace"},{l:"Career Paths",p:"careers"},{l:"Charter",p:"charter"},{l:"Skills",p:"skills"}].map(a=>(<button key={a.l} onClick={()=>go(a.p)} style={{...S.btn,...S.btnO}}>{a.l}</button>))}</div></div>
</div>);

// ── CHARTER ──
const PgCharter=()=>{const[exp,setExp]=useState({});return(<div>
  <div style={{...S.card,background:`linear-gradient(135deg,${T.axaBlue}08,${T.bgCard})`,borderColor:`${T.axaBlue}20`}}><div style={S.flex}><span style={{fontSize:18}}>⭐</span><span style={{fontSize:13,fontWeight:700,color:T.axaBlue}}>CORE PRINCIPLE</span><Bd status="Active"/></div><p style={{fontFamily:FH,fontSize:18,color:T.ink,margin:"10px 0 0",fontStyle:"italic"}}>"Human always stays accountable for every outcome"</p><p style={{fontSize:11,color:T.inkMuted,marginTop:4}}>Human-Only → Hybrid Human+Agent. AI enables, Humans decide.</p></div>
  <div style={S.g3}>{[{t:"AI",items:["Automate","Analyse","Recommend"],c:T.violet},{t:"Human",items:["Decide","Validate","Contextualise","Accountable"],c:T.teal},{t:"Roles",items:["Orchestration: Strategy·Direction","Execution: Delivery·Operations","Hybrid: Human+Agent"],c:T.ocean}].map(r=>(<div key={r.t} style={S.card}><div style={S.flex}><span style={{fontSize:14}}>{r.t==="AI"?"🤖":r.t==="Human"?"👤":"🏗️"}</span><h4 style={{fontSize:12,fontWeight:700}}>{r.t} Responsibilities</h4></div><div style={{marginTop:8}}>{r.items.map(i=><div key={i} style={{fontSize:11,color:T.inkSec,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {i}</div>)}</div></div>))}</div>
  {CHARTER.map((sec,si)=>(<div key={si} style={S.card}><div style={{...S.between,cursor:"pointer"}} onClick={()=>setExp(p=>({...p,[si]:!p[si]}))}><div style={S.flex}><span style={{fontSize:14}}>{sec.icon}</span><h3 style={S.h3}>{sec.title}</h3><Bd status={`${sec.items.length}`} custom={T.teal}/></div><span style={{color:T.inkMuted,transform:exp[si]?"rotate(90deg)":"none",display:"inline-block",transition:"transform .2s"}}>▶</span></div>{exp[si]&&<div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}}>{sec.items.map((it,i)=>(<div key={i} style={{padding:"8px 12px",background:i%2?T.bgMuted:"transparent",borderRadius:6,marginBottom:2}}><div style={{fontSize:11,fontWeight:600,color:T.teal}}>{it.t}</div><div style={{fontSize:11,color:T.inkSec,marginTop:2}}>{it.c}</div>{it.hl&&<div style={{marginTop:4,padding:"4px 10px",background:T.orangeBg,borderLeft:`3px solid ${T.orange}`,borderRadius:3,fontSize:10,color:T.orange,fontWeight:600}}>{it.hl}</div>}</div>))}</div>}</div>))}
  <div style={S.card}><h3 style={{...S.h3,marginBottom:10}}>Business Case</h3><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr style={{borderBottom:`2px solid ${T.border}`}}><th style={{textAlign:"left",padding:"8px 12px",color:T.inkMuted}}>Factor</th><th style={{textAlign:"center",padding:"8px 12px",color:T.teal,fontWeight:700}}>Internal ✓</th><th style={{textAlign:"center",padding:"8px 12px",color:T.inkMuted}}>External</th></tr></thead><tbody>{[["Productivity","Weeks","6–12 months"],["Cost","Low/Zero","1–2× salary"],["Cultural Fit","Embedded","Risk"],["Knowledge","100% retained","Lost"],["Returns","Compounds","Resets"]].map(([f,i,e],x)=>(<tr key={x} style={{borderBottom:`1px solid ${T.border}`}}><td style={{padding:"8px 12px",fontWeight:500}}>{f}</td><td style={{textAlign:"center",padding:"8px 12px"}}><Bd status={i} custom={T.teal}/></td><td style={{textAlign:"center",padding:"8px 12px",color:T.inkMuted}}>{e}</td></tr>))}</tbody></table></div>
</div>);};

// ══════════════════════════════════════════════════════════════
// MARKETPLACE — Restored v3: mobility intent, tags, ID card
// ══════════════════════════════════════════════════════════════
const PgMarket=()=>{
  const[sf,setSf]=useState([]);const[df,setDf]=useState("All");const[q,setQ]=useState("");const[sel,setSel]=useState(null);
  const pool=EMP.filter(e=>e.mobility);
  const fil=pool.filter(e=>(df==="All"||e.dept===df)&&(sf.length===0||sf.some(s=>e.skills.includes(s)))&&(!q||e.name.toLowerCase().includes(q.toLowerCase())||e.role.toLowerCase().includes(q.toLowerCase())));

  // ── Workforce ID Card (modal) ──
  if(sel) return(<div>
    <button onClick={()=>setSel(null)} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:14}}>← Back to Marketplace</button>
    <div style={{...S.card,padding:24,border:`2px solid ${T.axaBlue}20`,maxWidth:700}}>
      <div style={{...S.between,marginBottom:16}}><div style={{fontSize:10,fontWeight:700,color:T.axaBlue,letterSpacing:1.5}}>WORKFORCE ID CARD</div><Bd status="Internal Talent" custom={T.teal}/></div>
      <div style={S.flex}>
        <div style={{width:56,height:56,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff"}}>{sel.avatar}</div>
        <div style={{flex:1}}><div style={{fontSize:18,fontWeight:700,fontFamily:FH}}>{sel.name}</div><div style={{fontSize:12,color:T.inkSec}}>{sel.role} — {sel.dept} · {sel.level}</div><div style={{fontSize:11,color:T.teal,marginTop:2}}>{sel.intent}</div></div>
      </div>
      <div style={{...S.g2,marginTop:16}}>
        <div><div style={S.label}>Experience</div><div style={{fontSize:12}}>{sel.yrs} years</div><div style={{fontSize:11,color:T.inkMuted,marginTop:4,lineHeight:1.5}}>{sel.bg}</div></div>
        <div><div style={S.label}>Current & Past Teams</div>{sel.teams.map(t=><div key={t} style={{fontSize:12,padding:"3px 0"}}>• {t}</div>)}</div>
      </div>
      <div style={{marginTop:14}}><div style={S.label}>Skills (with levels)</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{sel.skills.map((sk,i)=>(<div key={sk} style={{...S.flex,gap:4,background:T.bgSoft,borderRadius:6,padding:"4px 10px"}}><span style={{fontSize:11,fontWeight:500}}>{sk}</span><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(l=><div key={l} style={{width:5,height:5,borderRadius:2,background:l<=3+Math.floor(i/2)%3?T.teal:`${T.inkDim}44`}}/>)}</div></div>))}</div></div>
      <div style={{marginTop:14}}><div style={S.label}>AI Competency</div><Bd status={sel.aiLvl}/></div>
      <div style={{marginTop:14}}><div style={S.label}>Last 3 Performance Evaluations</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:6}}><thead><tr style={{borderBottom:`1px solid ${T.border}`}}><th style={{textAlign:"left",padding:"6px 8px",color:T.inkMuted}}>Year</th><th style={{textAlign:"center",padding:"6px 8px",color:T.inkMuted}}>Score</th><th style={{textAlign:"left",padding:"6px 8px",color:T.inkMuted}}>Notes</th></tr></thead><tbody>{sel.perf.map(p=>(<tr key={p.yr} style={{borderBottom:`1px solid ${T.border}`}}><td style={{padding:"6px 8px",fontWeight:600}}>{p.yr}</td><td style={{textAlign:"center",padding:"6px 8px"}}><span style={{fontWeight:700,color:p.score>=4.0?T.teal:p.score>=3.5?T.ocean:T.orange}}>{p.score}</span></td><td style={{padding:"6px 8px",color:T.inkSec}}>{p.note}</td></tr>))}</tbody></table></div>
      <div style={{...S.flex,marginTop:16}}><button style={S.btn}>📧 Contact Employee</button><button style={{...S.btn,...S.btnO}}>📋 View Career Path</button><button style={{...S.btn,background:T.teal}}>🎯 Schedule Interview</button></div>
    </div>
  </div>);

  return(<div>
    <div style={{...S.card,padding:14}}>
      <div style={{...S.flex,marginBottom:10}}><span>🔍</span><span style={{fontSize:12,fontWeight:600,color:T.teal}}>Talent Marketplace — Employees with Mobility Intent</span>{(sf.length||df!=="All")&&<button onClick={()=>{setSf([]);setDf("All");setQ("");}} style={{...S.btn,...S.btnSm,...S.btnO,marginLeft:"auto"}}>Clear</button>}</div>
      <div style={{...S.flex,gap:8,marginBottom:10}}><input style={{...S.input,maxWidth:220}} placeholder="Search name/role..." value={q} onChange={e=>setQ(e.target.value)}/><select style={S.select} value={df} onChange={e=>setDf(e.target.value)}><option value="All">All Departments</option>{[...new Set(EMP.map(e=>e.dept))].map(d=><option key={d}>{d}</option>)}</select></div>
      <div style={S.label}>Filter by Skills</div>
      <Chips options={SKILLS.slice(0,20)} selected={sf} onToggle={s=>setSf(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}/>
    </div>
    <div style={{fontSize:11,color:T.inkMuted,margin:"8px 0"}}>{fil.length} employees with declared mobility</div>
    <div style={S.g2}>{fil.map(e=>(<div key={e.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setSel(e)}>
      <div style={S.flex}><div style={{width:36,height:36,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:T.inkMuted}}>{e.role} — {e.dept}</div></div><Bd status={e.level}/></div>
      <div style={{fontSize:11,color:T.teal,marginTop:6,fontStyle:"italic"}}>{e.intent}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:8}}>{e.skills.map(sk=><span key={sk} style={{...S.tag,background:sf.includes(sk)?T.tealBg:T.bgSoft,color:sf.includes(sk)?T.teal:T.inkMuted}}>{sk}</span>)}</div>
      <div style={{...S.flex,marginTop:10}}><button onClick={ev=>{ev.stopPropagation();setSel(e);}} style={{...S.btn,...S.btnSm}}>View ID Card</button><span style={{fontSize:10,color:T.inkMuted}}>{e.yrs}y exp · AI: {e.aiLvl}</span></div>
    </div>))}</div>
  </div>);
};

// ── TEAM ──
const PgTeam=()=>(<div>
  <h3 style={{...S.h3,marginBottom:12}}>👤 Human Team</h3>
  <div style={S.g2}>{EMP.slice(0,8).map(e=>(<div key={e.id} style={S.card}><div style={S.flex}><div style={{width:32,height:32,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{e.role} — {e.dept}</div></div><Bd status={e.level}/></div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:8}}>{e.skills.slice(0,4).map(sk=><span key={sk} style={S.tag}>{sk}</span>)}</div></div>))}</div>
  <div style={{marginTop:24,paddingTop:16,borderTop:`2px solid ${T.violet}20`}}><div style={S.flex}><span style={{fontSize:18}}>🤖</span><h3 style={{...S.h3,margin:0}}>AI Agent Team</h3><Bd status={`${AI_AGENTS.length}`} custom={T.violet}/></div><p style={{fontSize:11,color:T.inkMuted,margin:"6px 0 12px"}}>Hybrid Human+Agent workforce</p>
  <div style={S.g3}>{AI_AGENTS.map(a=>(<div key={a.id} style={{...S.card,borderLeft:`3px solid ${a.status==="active"?T.violet:a.status==="training"?T.orange:T.inkDim}`}}><div style={S.between}><div style={S.flex}><span style={{fontSize:15}}>🤖</span><div><div style={{fontSize:12,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.role}</div></div></div><Bd status={a.status}/></div><p style={{fontSize:10,color:T.inkMuted,margin:"6px 0",lineHeight:1.4}}>{a.desc}</p><div style={S.flex}><span style={{fontSize:10,color:T.inkMuted}}>Accuracy</span><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet}}>{a.accuracy}%</span></div></div>))}</div></div>
</div>);

// ══════════════════════════════════════════════════════════════
// INTERVIEWS — Full flow: Schedule → Interview → Gap → Plan → Train → Cert → Assess
// ══════════════════════════════════════════════════════════════
const PgIV=({persona})=>{
  const[ivs,setIvs]=useState([
    {id:1,emp:EMP[0],date:"2026-04-25",st:"Scheduled",wf:0,ans:{},plan:null},
    {id:2,emp:EMP[1],date:"2026-04-22",st:"In Progress",wf:1,ans:{1:"Strategic / transversal role"},plan:null},
    {id:3,emp:EMP[2],date:"2026-04-10",st:"Completed",wf:6,ans:{},plan:{target:"VP Product",pct:65,cur:EMP[2].skills,req:["Strategic Thinking","Financial Modeling","Leadership","Data Governance"],gaps:[{s:"Strategic Thinking",c:2,r:5,p:"High"},{s:"Financial Modeling",c:1,r:4,p:"High"},{s:"Leadership",c:3,r:5,p:"Medium"},{s:"Data Governance",c:0,r:3,p:"Medium"}],trains:[{n:"Product Leadership",pr:"AXA Univ",d:"10w",st:"In progress"},{n:"Executive Strategy",pr:"INSEAD",d:"6w",st:"Completed"},{n:"Finance for PM",pr:"Coursera",d:"4w",st:"Not started"}],certs:[{n:"Certified PM",pr:"AIPMM",st:"Achieved",dt:"2026-03"},{n:"AI Strategy",pr:"MIT",st:"Registered",dt:"2026-09"}],assess:[{n:"Strategic Assessment",st:"Completed",sc:78},{n:"Leadership 360",st:"In Progress",sc:null}],ms:[{t:"Gap done",d:"2026-02",s:"Completed"},{t:"Training start",d:"2026-03",s:"Completed"},{t:"Mid-review",d:"2026-06",s:"In Progress"},{t:"Certs",d:"2026-12",s:"Planned"},{t:"Final eval",d:"2027-03",s:"Planned"}]}},
    {id:4,emp:EMP[4],date:"2026-04-18",st:"Action Plan",wf:3,ans:{1:"Move into people management"},plan:{target:"HR Director",pct:25,cur:EMP[4].skills,req:["Strategic Thinking","Financial Modeling","Data Governance","Python","Power BI"],gaps:[{s:"Strategic Thinking",c:2,r:5,p:"High"},{s:"Financial Modeling",c:0,r:4,p:"High"},{s:"Data Governance",c:1,r:3,p:"Medium"},{s:"Python",c:0,r:2,p:"Low"},{s:"Power BI",c:1,r:3,p:"Medium"}],trains:[{n:"HR Strategy",pr:"AXA Univ",d:"12w",st:"Not started"},{n:"People Analytics",pr:"Coursera",d:"8w",st:"Not started"},{n:"Finance for HR",pr:"AXA Acad",d:"4w",st:"Not started"}],certs:[{n:"SHRM-SCP",pr:"SHRM",st:"Planned",dt:"2026-12"},{n:"Change Mgmt Pro",pr:"ACMP",st:"Planned",dt:"2027-03"}],assess:[{n:"Leadership Assessment",st:"Planned",sc:null}],ms:[{t:"Gap assessment",d:"2026-05",s:"In Progress"},{t:"Training",d:"2026-06",s:"Planned"},{t:"Mid-review",d:"2026-09",s:"Planned"},{t:"Certs",d:"2027-03",s:"Planned"},{t:"Transition",d:"2027-06",s:"Planned"}]}},
  ]);
  const[v,setV]=useState("list");const[aiv,setAiv]=useState(null);const[cq,setCq]=useState(0);const[ans,setAns]=useState({});const[ft,setFt]=useState({});const[ma,setMa]=useState({});const[pv,setPv]=useState(null);const[pt,setPt]=useState("gap");
  const[showSched,setShowSched]=useState(false);const[schedEmp,setSchedEmp]=useState("");const[schedDate,setSchedDate]=useState("2026-05-05");

  const startIV=iv=>{setAiv(iv);setAns(iv.ans||{});setFt({});setMa({});setCq(0);setV("iv");};
  const save=()=>{const all={...ans,...Object.fromEntries(Object.entries(ma).map(([k,v])=>[k,v.join(", ")])),...ft};setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"In Progress",wf:1,ans:all}:i));};
  const genP=(emp,ans)=>{const asp=ans[1]||"Career Growth";const roles={"Grow as expert in current field":`Senior ${emp.role}`,"Move to different functional area":"Cross-Functional Lead","Move into people management":`${emp.dept} Manager`,"Strategic / transversal role":`${emp.dept} Director`,"International / cross-entity":"Intl Ops Lead"};const target=roles[asp]||`Senior ${emp.role}`;const cur=ans[4]?ans[4].split(", "):emp.skills;const des=ans[6]?ans[6].split(", "):SKILLS.slice(5,10);const req=[...des.filter(s=>!cur.includes(s)),"Strategic Thinking","Leadership"].slice(0,5);return{target,pct:10,cur,req,gaps:req.map(s=>({s,c:Math.floor(Math.random()*2),r:3+Math.floor(Math.random()*3),p:["High","Medium","Low"][Math.floor(Math.random()*3)]})),trains:[{n:"Leadership Fundamentals",pr:"AXA Univ",d:"12w",st:"Not started"},{n:"AI for Leaders",pr:"MIT xPRO",d:"8w",st:"Not started"},{n:"Strategic Decision Making",pr:"INSEAD",d:"6w",st:"Not started"},{n:"Change Mgmt",pr:"AXA Acad",d:"4w",st:"Not started"}],certs:[{n:"AWS Architect",pr:"AWS",st:"Planned",dt:"2026-09"},{n:"PMP",pr:"PMI",st:"Planned",dt:"2026-12"},{n:"AI Ethics",pr:"AXA Acad",st:"Planned",dt:"2026-07"}],assess:[{n:"Baseline Assessment",st:"Planned",sc:null},{n:"Mid-Point Review",st:"Planned",sc:null},{n:"Final Evaluation",st:"Planned",sc:null}],ms:[{t:"Gap assessment",d:"2026-05",s:"In Progress"},{t:"First training",d:"2026-06",s:"Planned"},{t:"Mid-review",d:"2026-08",s:"Planned"},{t:"Certs done",d:"2026-12",s:"Planned"},{t:"Transition",d:"2027-03",s:"Planned"}]};};
  const complIV=()=>{const all={...ans,...Object.fromEntries(Object.entries(ma).map(([k,v])=>[k,v.join(", ")])),...ft};setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"Gap Analysis",wf:2,ans:all,plan:genP(aiv.emp,all)}:i));setAiv(null);setV("list");};
  const doSchedule=()=>{if(!schedEmp)return;const emp=EMP.find(e=>e.name===schedEmp);if(!emp)return;setIvs(p=>[...p,{id:Date.now(),emp,date:schedDate,st:"Scheduled",wf:0,ans:{},plan:null}]);setShowSched(false);setSchedEmp("");};

  const WFS=({step})=>(<div style={{display:"flex",alignItems:"center",gap:0,margin:"10px 0"}}>{WF.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",flex:1}}><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,background:i<step?T.teal:i===step?T.tealBg:T.bgSoft,color:i<step?"#fff":i===step?T.teal:T.inkDim,border:i===step?`2px solid ${T.teal}`:"none"}}>{i<step?"✓":i+1}</div><div style={{fontSize:7,color:i<=step?T.ink:T.inkDim,marginTop:2,textAlign:"center",maxWidth:50,fontWeight:i===step?600:400}}>{s}</div></div>{i<WF.length-1&&<div style={{flex:1,height:2,background:i<step?T.teal:T.bgSoft,margin:"0 2px",marginBottom:14}}/>}</div>))}</div>);

  // ── ACTION PLAN ──
  if(v==="plan"&&pv){const p=pv.plan;const emp=pv.emp;const tabs=[{k:"gap",l:"🔬 Gap",c:T.red},{k:"train",l:"📚 Training",c:T.ocean},{k:"cert",l:"🏅 Certs",c:T.orange},{k:"assess",l:"📝 Assess",c:T.violet},{k:"ms",l:"📅 Milestones",c:T.teal},{k:"form",l:"📋 Form",c:T.axaBlue}];
  return(<div>
    <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:12}}>← Back</button>
    <div style={S.between}><div><h2 style={S.h1}>Action Plan: {emp.name}</h2><p style={{fontSize:12,color:T.inkSec,marginTop:3}}>Current: <strong>{emp.role}</strong> → Target: <strong style={{color:T.teal}}>{p.target}</strong></p></div><div style={{textAlign:"right"}}><div style={{fontSize:30,fontWeight:800,fontFamily:FH,color:T.teal}}>{p.pct}%</div><div style={{fontSize:10,color:T.inkMuted}}>Progress</div></div></div>
    {/* Flow diagram */}
    <div style={{...S.card,marginTop:12,padding:14}}><div style={{fontSize:9,fontWeight:700,color:T.inkMuted,letterSpacing:1,marginBottom:8}}>LINKED PROCESS</div><div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>{[{l:"Interview",e:"🎯",c:T.axaBlue,d:pv.wf>=1},{l:"Gap",e:"🔬",c:T.red,d:pv.wf>=2},{l:"Plan",e:"📋",c:T.teal,d:pv.wf>=3},{l:"Train",e:"📚",c:T.ocean,d:pv.wf>=4},{l:"Cert",e:"🏅",c:T.orange,d:pv.wf>=5},{l:"Assess",e:"📝",c:T.violet,d:pv.wf>=6},{l:"Done",e:"✅",c:T.green,d:pv.wf>=7}].map((s,i,a)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>{if(s.l==="Gap")setPt("gap");if(s.l==="Train")setPt("train");if(s.l==="Cert")setPt("cert");if(s.l==="Assess")setPt("assess");}}><div style={{width:32,height:32,borderRadius:"50%",background:s.d?`${s.c}12`:T.bgSoft,border:`2px solid ${s.d?s.c:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{s.e}</div><div style={{fontSize:8,color:s.d?T.ink:T.inkDim,marginTop:3,fontWeight:s.d?600:400}}>{s.l}</div></div>{i<a.length-1&&<div style={{width:20,height:2,background:s.d?s.c:T.bgSoft,margin:"0 1px",marginBottom:16}}/>}</div>))}</div></div>
    {/* AI */}
    <div style={{...S.card,background:`${T.violet}06`,borderColor:`${T.violet}20`}}><div style={S.flex}><span style={{fontSize:13}}>🤖</span><span style={{fontSize:11,fontWeight:700,color:T.violet}}>AI Recommendations</span></div><div style={{fontSize:11,color:T.inkSec,lineHeight:1.6,marginTop:6}}>Focus on <strong>{p.gaps?.[0]?.s}</strong> (highest gap). The {p.target} role shows 34% YoY demand growth. Recommended: complete gap assessment → start priority training → certification path.</div></div>
    {/* Tabs */}
    <div style={{display:"flex",gap:3,marginTop:10,flexWrap:"wrap"}}>{tabs.map(tb=>(<button key={tb.k} onClick={()=>setPt(tb.k)} style={{...S.btn,...S.btnSm,background:pt===tb.k?tb.c:T.bgSoft,color:pt===tb.k?"#fff":T.inkSec,border:`1px solid ${pt===tb.k?tb.c:T.border}`}}>{tb.l}</button>))}</div>
    {/* Gap */}
    {pt==="gap"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Skills Gap Analysis</h3><div style={S.g2}><div><div style={S.label}>Current</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{p.cur.map(s=><span key={s} style={S.tag}>{s}</span>)}</div></div><div><div style={S.label}>Required (Gaps)</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{p.req.map(s=><span key={s} style={{...S.tag,background:T.redBg,color:T.red}}>{s}</span>)}</div></div></div><div style={{marginTop:14}}>{p.gaps.map((g,i)=>(<div key={i} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:11,fontWeight:600,width:140}}>{g.s}</span><div style={{flex:1,...S.flex}}><span style={{fontSize:10,color:T.inkMuted,width:35}}>Lv{g.c}</span><div style={{flex:1}}><Bar pct={(g.c/g.r)*100} color={g.c>=g.r?T.teal:g.c>=g.r/2?T.orange:T.red}/></div><span style={{fontSize:10,color:T.inkMuted,width:45}}>→ Lv{g.r}</span></div><Bd status={g.p}/><button onClick={()=>setPt("train")} style={{...S.btn,...S.btnSm,...S.btnO,padding:"2px 6px",fontSize:9}}>Train→</button></div>))}</div><div style={{...S.flex,marginTop:12}}><button onClick={()=>setPt("train")} style={{...S.btn,...S.btnG}}>Proceed to Training →</button></div></div>}
    {/* Train */}
    {pt==="train"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Training Phase</h3>{p.trains.map((t,i)=>(<div key={i} style={{padding:12,background:T.bgMuted,borderRadius:8,marginBottom:6}}><div style={S.between}><div style={S.flex}><span>📖</span><div><div style={{fontSize:12,fontWeight:600}}>{t.n}</div><div style={{fontSize:10,color:T.inkMuted}}>{t.pr} · {t.d}</div></div></div><Bd status={t.st}/></div><div style={{marginTop:6}}><Bar pct={t.st==="Completed"?100:t.st==="In progress"?50:0} color={T.ocean}/></div></div>))}<div style={{...S.flex,marginTop:10}}><button onClick={()=>setPt("gap")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Gap</button><button onClick={()=>setPt("cert")} style={{...S.btn,...S.btnSm,...S.btnG}}>Certs →</button></div></div>}
    {/* Cert */}
    {pt==="cert"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Certifications</h3>{p.certs.map((c,i)=>(<div key={i} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span>🎓</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.n}</div><div style={{fontSize:10,color:T.inkMuted}}>{c.pr} · {c.dt}</div></div><Bd status={c.st}/></div>))}<div style={{...S.flex,marginTop:10}}><button onClick={()=>setPt("train")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Training</button><button onClick={()=>setPt("assess")} style={{...S.btn,...S.btnSm,...S.btnG}}>Assessments →</button></div></div>}
    {/* Assess */}
    {pt==="assess"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Assessments</h3>{p.assess.map((a,i)=>(<div key={i} style={{padding:12,background:T.bgMuted,borderRadius:8,marginBottom:6}}><div style={S.between}><div style={S.flex}><span>📝</span><div style={{fontSize:12,fontWeight:600}}>{a.n}</div></div><div style={S.flex}>{a.sc!=null&&<span style={{fontSize:13,fontWeight:700,color:a.sc>=70?T.teal:T.orange}}>{a.sc}%</span>}<Bd status={a.st}/></div></div>{a.sc!=null&&<div style={{marginTop:6}}><Bar pct={a.sc} color={a.sc>=70?T.teal:T.orange}/></div>}</div>))}<div style={{...S.flex,marginTop:10}}><button onClick={()=>setPt("cert")} style={{...S.btn,...S.btnSm,...S.btnO}}>← Certs</button><button onClick={()=>setPt("ms")} style={{...S.btn,...S.btnSm,...S.btnG}}>Milestones →</button></div></div>}
    {/* Milestones */}
    {pt==="ms"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Milestones</h3>{p.ms.map((m,i)=>(<div key={i} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><div style={{width:24,height:24,borderRadius:"50%",background:m.s==="Completed"?T.teal:m.s==="In Progress"?T.tealBg:T.bgSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:m.s==="Completed"?"#fff":m.s==="In Progress"?T.teal:T.inkDim,border:m.s==="In Progress"?`2px solid ${T.teal}`:"none"}}>{m.s==="Completed"?"✓":i+1}</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:500}}>{m.t}</div><div style={{fontSize:10,color:T.inkMuted}}>{m.d}</div></div><Bd status={m.s}/></div>))}<button onClick={()=>setPt("form")} style={{...S.btn,...S.btnG,marginTop:10}}>📋 Action Plan Form →</button></div>}
    {/* Form */}
    {pt==="form"&&<div style={{...S.card,marginTop:10}}><h3 style={{...S.h3,marginBottom:12}}>Action Plan Form</h3><p style={{fontSize:11,color:T.inkMuted,marginBottom:14}}>Finalize and link to upskilling process.</p>
      <div style={{marginBottom:14}}><label style={S.label}>Target Role</label><input style={S.input} defaultValue={p.target}/></div>
      <div style={{marginBottom:14}}><label style={S.label}>Manager Readiness Assessment (1-5)</label><select style={{...S.select,width:"100%"}} defaultValue="3"><option>1 — Not Ready</option><option>2 — Early</option><option value="3">3 — Developing</option><option>4 — Near Ready</option><option>5 — Ready</option></select></div>
      <div style={{marginBottom:14}}><label style={S.label}>Priority Skills (from gap)</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{p.req.map(s=><span key={s} style={{...S.tag,background:T.redBg,color:T.red}}>{s}</span>)}</div></div>
      <div style={{marginBottom:14}}><label style={S.label}>Timeline</label><select style={{...S.select,width:"100%"}} defaultValue="6-12"><option value="3-6">3–6 months</option><option value="6-12">6–12 months</option><option value="12-18">12–18 months</option><option value="18+">18+ months</option></select></div>
      <div style={{marginBottom:14}}><label style={S.label}>Manager Comments</label><textarea style={{...S.input,minHeight:70}} placeholder="Actions, commitments, review schedule..."/></div>
      <div style={{marginBottom:14}}><label style={S.label}>Employee Comments</label><textarea style={{...S.input,minHeight:70}} placeholder="Personal goals, agreement..."/></div>
      <div style={{marginBottom:14}}><label style={S.label}>Next Review Date</label><input style={S.input} type="date" defaultValue="2026-08-01"/></div>
      <div style={S.flex}><button style={S.btn}>💾 Save Draft</button><button style={{...S.btn,...S.btnG}}>✅ Finalize & Link</button></div>
    </div>}
  </div>);}

  // ── INTERVIEW FORM ──
  if(v==="iv"&&aiv){const q=IQ[cq];const show=!q.on||ans[q.on]===q.val;
  return(<div>
    <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:12}}>← Back</button>
    <div style={S.between}><div><h2 style={S.h1}>Interview: {aiv.emp.name}</h2><p style={{fontSize:12,color:T.inkSec,marginTop:3}}>{aiv.emp.role} — {aiv.emp.dept}</p></div><button onClick={save} style={{...S.btn,...S.btnO,...S.btnSm}}>💾 Save</button></div>
    <div style={{margin:"10px 0"}}><Bar pct={((cq+1)/IQ.length)*100}/><div style={{fontSize:10,color:T.inkMuted,marginTop:3}}>Q{cq+1}/{IQ.length}</div></div>
    <div style={S.flex}><Bd status={`Manager: ${persona?.label}`} custom={T.axaBlue}/><Bd status={`Employee: ${aiv.emp.name}`} custom={T.ocean}/></div>
    {show?(<div style={{...S.card,padding:22,marginTop:10}}>
      <div style={{fontSize:10,color:T.teal,fontWeight:700,letterSpacing:1}}>Q{String(q.id)}</div>
      <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700,color:T.ink,margin:"6px 0 14px",lineHeight:1.4}}>{q.q}</h3>
      {q.note&&<div style={{fontSize:10,color:T.orange,marginBottom:10}}>ℹ️ {q.note}</div>}
      {q.t==="s"&&q.o.map(opt=>(<div key={opt} onClick={()=>setAns(p=>({...p,[q.id]:opt}))} style={{padding:"10px 14px",margin:"4px 0",borderRadius:8,cursor:"pointer",border:`1.5px solid ${ans[q.id]===opt?T.teal:T.border}`,background:ans[q.id]===opt?T.tealBg:"transparent"}}><div style={S.flex}><div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${ans[q.id]===opt?T.teal:T.inkDim}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{ans[q.id]===opt&&<div style={{width:7,height:7,borderRadius:"50%",background:T.teal}}/>}</div><span style={{fontSize:12,color:ans[q.id]===opt?T.ink:T.inkSec}}>{opt}</span></div></div>))}
      {q.t==="m"&&<Chips options={q.o} selected={ma[q.id]||[]} onToggle={val=>setMa(p=>{const c=p[q.id]||[];return{...p,[q.id]:c.includes(val)?c.filter(x=>x!==val):[...c,val]};})} max={q.o.length}/>}
      {q.t==="x"&&<textarea style={{...S.input,minHeight:70}} placeholder="Enter response..." value={ft[q.id]||""} onChange={e=>setFt(p=>({...p,[q.id]:e.target.value}))}/>}
      {q.t!=="x"&&<div style={{marginTop:10}}><div style={{fontSize:10,color:T.inkMuted,marginBottom:3}}>Notes (optional)</div><textarea style={{...S.input,minHeight:40}} value={ft[`${q.id}n`]||""} onChange={e=>setFt(p=>({...p,[`${q.id}n`]:e.target.value}))}/></div>}
    </div>):(<div style={{...S.card,padding:22,marginTop:10,textAlign:"center",color:T.inkMuted}}>⏭️ Skipped.</div>)}
    <div style={{...S.between,marginTop:12}}><button onClick={()=>setCq(p=>Math.max(0,p-1))} disabled={cq===0} style={{...S.btn,...S.btnO}}>← Prev</button>{cq<IQ.length-1?<button onClick={()=>setCq(p=>p+1)} style={S.btn}>Next →</button>:<button onClick={complIV} style={{...S.btn,...S.btnG}}>✅ Complete → Gap Analysis</button>}</div>
  </div>);}

  // ── SCHEDULE FORM (modal) ──
  const SchedModal = () => showSched ? (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowSched(false)}>
      <div style={{...S.card,width:400,padding:28,animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}>
        <h3 style={S.h3}>Schedule Career Interview</h3>
        <div style={{marginTop:14,marginBottom:12}}><label style={S.label}>Employee</label><select style={{...S.select,width:"100%"}} value={schedEmp} onChange={e=>setSchedEmp(e.target.value)}><option value="">Select employee...</option>{EMP.map(e=><option key={e.id} value={e.name}>{e.name} — {e.role}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={S.label}>Date</label><input style={S.input} type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)}/></div>
        <div style={{marginBottom:14}}><label style={S.label}>Notes</label><textarea style={{...S.input,minHeight:60}} placeholder="Preparation notes..."/></div>
        <div style={S.flex}><button onClick={doSchedule} style={S.btn}>✅ Schedule</button><button onClick={()=>setShowSched(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
      </div>
    </div>
  ) : null;

  // ── LIST ──
  return(<div>
    <SchedModal/>
    <div style={S.between}><div/><button onClick={()=>setShowSched(true)} style={S.btn}>+ Schedule Interview</button></div>
    <div style={{...S.card,marginTop:12,padding:14}}><div style={{fontSize:9,fontWeight:700,color:T.inkMuted,letterSpacing:1,marginBottom:6}}>END-TO-END PROCESS</div><div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>{[{l:"Interview",e:"🎯",c:T.axaBlue},{l:"Gap Analysis",e:"🔬",c:T.red},{l:"Action Plan",e:"📋",c:T.teal},{l:"Training",e:"📚",c:T.ocean},{l:"Certification",e:"🏅",c:T.orange},{l:"Assessment",e:"📝",c:T.violet},{l:"Target Role",e:"✅",c:T.green}].map((s,i,a)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div style={{textAlign:"center"}}><div style={{width:34,height:34,borderRadius:"50%",background:`${s.c}10`,border:`2px solid ${s.c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{s.e}</div><div style={{fontSize:8,color:T.ink,marginTop:3,fontWeight:600,maxWidth:55}}>{s.l}</div></div>{i<a.length-1&&<div style={{width:18,height:0,borderTop:`2px dashed ${T.border}`,margin:"0 2px",marginBottom:14}}/>}</div>))}</div></div>
    {ivs.map(iv=>(<div key={iv.id} style={S.card}>
      <div style={S.between}><div style={S.flex}><div style={{width:34,height:34,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{iv.emp.avatar}</div><div><div style={{fontSize:12,fontWeight:600}}>{iv.emp.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{iv.emp.role} — {iv.emp.dept}</div></div></div><div style={S.flex}><span style={{fontSize:10,color:T.inkMuted}}>{iv.date}</span><Bd status={iv.st}/></div></div>
      <WFS step={iv.wf}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {iv.st==="Scheduled"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>▶ Start</button>}
        {iv.st==="In Progress"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>↺ Resume</button>}
        {iv.plan&&<button onClick={()=>{setPv(iv);setPt("gap");setV("plan");}} style={{...S.btn,...S.btnSm,...S.btnG}}>📋 Action Plan</button>}
        {iv.plan&&<button onClick={()=>{setPv(iv);setPt("gap");setV("plan");}} style={{...S.btn,...S.btnSm,background:T.red,color:"#fff"}}>🔬 Gap</button>}
        {iv.plan&&<button onClick={()=>{setPv(iv);setPt("train");setV("plan");}} style={{...S.btn,...S.btnSm,background:T.ocean,color:"#fff"}}>📚 Train</button>}
      </div>
    </div>))}
  </div>);
};

// ── CAREER PATHS — Graphical ──
const PgCareer=()=>{const all=useMemo(()=>genPaths(),[]);const[df,setDf]=useState("All");const[tf,setTf]=useState("All");const[q,setQ]=useState("");const[exp,setExp]=useState(null);const[pg,setPg]=useState(0);const pp=12;
  const fil=all.filter(p=>(df==="All"||p.domain===df)&&(tf==="All"||p.type===tf)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.steps.some(s=>s.title.toLowerCase().includes(q.toLowerCase()))));const paged=fil.slice(pg*pp,(pg+1)*pp);const tp=Math.ceil(fil.length/pp);
  const Graph=({steps})=>(<div style={{padding:"12px 0",overflowX:"auto"}}><div style={{display:"flex",alignItems:"flex-start",minWidth:steps.length*120}}>{steps.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div style={{textAlign:"center",width:100}}><div style={{width:38,height:38,borderRadius:10,background:i===0?T.tealBg:i===steps.length-1?T.bgSoft:T.bgMuted,border:`2px solid ${i===0?T.teal:i===steps.length-1?T.axaBlue:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:11,fontWeight:700,color:i===0?T.teal:i===steps.length-1?T.axaBlue:T.inkSec}}>L{s.level}</div><div style={{fontSize:10,fontWeight:600,color:T.ink,marginTop:5,lineHeight:1.2}}>{s.title}</div><div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center",marginTop:3}}>{s.skills.map(sk=><span key={sk} style={{fontSize:7,background:T.tealBg,color:T.teal,padding:"1px 4px",borderRadius:2}}>{sk}</span>)}</div></div>{i<steps.length-1&&<svg width="20" height="16" viewBox="0 0 20 16" style={{margin:"0 -4px",marginBottom:30}}><path d="M2 8h16m-4-4l4 4-4 4" stroke={T.teal} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}</div>))}</div></div>);
  return(<div>
    <div style={S.between}><p style={{fontSize:12,color:T.inkMuted}}>{all.length} paths · {DOMAINS.length} domains</p><Bd status="AI-Powered" custom={T.violet}/></div>
    <div style={{...S.card,marginTop:12,padding:12}}><div style={{...S.flex,gap:8}}><input style={{...S.input,maxWidth:200}} placeholder="Search..." value={q} onChange={e=>{setQ(e.target.value);setPg(0);}}/><select style={S.select} value={df} onChange={e=>{setDf(e.target.value);setPg(0);}}><option value="All">All Domains</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select><select style={S.select} value={tf} onChange={e=>{setTf(e.target.value);setPg(0);}}><option value="All">All Types</option>{["Expert","Management","Hybrid"].map(t=><option key={t}>{t}</option>)}</select><span style={{fontSize:10,color:T.inkMuted,marginLeft:"auto"}}>{fil.length}</span></div></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"8px 0"}}>{DOMAINS.map(d=><span key={d} onClick={()=>{setDf(df===d?"All":d);setPg(0);}} style={{...S.badge,cursor:"pointer",background:df===d?T.tealBg:T.bgSoft,color:df===d?T.teal:T.inkMuted,border:`1px solid ${df===d?T.teal:"transparent"}`}}>{d} ({all.filter(p=>p.domain===d).length})</span>)}</div>
    <div style={S.g3}>{paged.map(p=>(<div key={p.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setExp(exp===p.id?null:p.id)}>
      <div style={S.between}><Bd status={p.domain} custom={T.teal}/><Bd status={p.type} custom={T.violet}/></div>
      <h4 style={{fontSize:12,fontWeight:700,margin:"8px 0 3px"}}>{p.name}</h4><div style={{fontSize:10,color:T.inkMuted}}>{p.steps.length} steps</div>
      <div style={{display:"flex",alignItems:"center",gap:0,margin:"8px 0"}}>{p.steps.map((_,i)=><div key={i} style={{flex:1,display:"flex",alignItems:"center"}}><div style={{width:6,height:6,borderRadius:"50%",background:i===0?T.teal:i===p.steps.length-1?T.axaBlue:T.border}}/>{i<p.steps.length-1&&<div style={{flex:1,height:1,background:T.border}}/>}</div>)}</div>
      {exp===p.id&&<Graph steps={p.steps}/>}
    </div>))}</div>
    <div style={{...S.flex,justifyContent:"center",marginTop:12,gap:6}}><button disabled={pg===0} onClick={()=>setPg(p=>p-1)} style={{...S.btn,...S.btnSm,...S.btnO}}>← Prev</button><span style={{fontSize:10,color:T.inkMuted}}>Page {pg+1}/{tp}</span><button disabled={pg>=tp-1} onClick={()=>setPg(p=>p+1)} style={{...S.btn,...S.btnSm,...S.btnO}}>Next →</button></div>
  </div>);
};

// ══════════════════════════════════════════════════════════════
// SKILLS REPOSITORY — Add skill, search, AI matching, categories
// ══════════════════════════════════════════════════════════════
const PgSkills=()=>{
  const[q,setQ]=useState("");const[showAdd,setShowAdd]=useState(false);const[newSk,setNewSk]=useState("");const[newCat,setNewCat]=useState("Technical");const[added,setAdded]=useState([]);const[aiMatch,setAiMatch]=useState(null);
  const allSkills=[...SKILLS,...added];
  const addSkill=()=>{if(!newSk.trim())return;const dup=allSkills.find(s=>s.toLowerCase()===newSk.trim().toLowerCase());if(dup){alert(`Duplicate detected: "${dup}"`);return;}setAdded(p=>[...p,newSk.trim()]);setNewSk("");setShowAdd(false);};
  const doAiMatch=(sk)=>{const roles=["ML Engineer","Data Scientist","Cloud Architect","Product Manager","DevOps Lead"].slice(0,2+Math.floor(Math.random()*3));const missing=SKILLS.slice(Math.floor(Math.random()*10),Math.floor(Math.random()*10)+3);setAiMatch({skill:sk,roles,missing});};

  return(<div>
    <div style={S.between}><p style={{fontSize:12,color:T.inkMuted}}>{allSkills.length} skills · {Object.keys(SKILL_CATS).length} categories</p><button onClick={()=>setShowAdd(true)} style={S.btn}>+ Add Skill</button></div>
    {/* Add Modal */}
    {showAdd&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowAdd(false)}><div style={{...S.card,width:380,padding:24}} onClick={e=>e.stopPropagation()}>
      <h3 style={S.h3}>Add New Skill</h3>
      <div style={{marginTop:12,marginBottom:10}}><label style={S.label}>Skill Name</label><input style={S.input} value={newSk} onChange={e=>setNewSk(e.target.value)} placeholder="e.g. Kubernetes"/></div>
      <div style={{marginBottom:10}}><label style={S.label}>Category</label><select style={{...S.select,width:"100%"}} value={newCat} onChange={e=>setNewCat(e.target.value)}>{Object.keys(SKILL_CATS).map(c=><option key={c}>{c}</option>)}</select></div>
      <div style={{marginBottom:10}}><label style={S.label}>Level Range</label><select style={{...S.select,width:"100%"}}><option>1-5 (Foundation to Expert)</option></select></div>
      <div style={S.flex}><button onClick={addSkill} style={S.btn}>✅ Add</button><button onClick={()=>setShowAdd(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
    </div></div>}
    {/* AI Match result */}
    {aiMatch&&<div style={{...S.card,background:T.violetBg,borderColor:`${T.violet}20`,marginTop:12}}><div style={S.between}><div style={S.flex}><span>🤖</span><span style={{fontSize:12,fontWeight:700,color:T.violet}}>AI Skill Match: {aiMatch.skill}</span></div><button onClick={()=>setAiMatch(null)} style={{...S.btn,...S.btnSm,...S.btnO,padding:"2px 8px",fontSize:9}}>✕</button></div><div style={{marginTop:8}}><div style={{fontSize:11,color:T.inkSec}}>Matched roles: {aiMatch.roles.map(r=><Bd key={r} status={r} custom={T.teal}/>)}</div><div style={{fontSize:11,color:T.inkSec,marginTop:6}}>Often paired with: {aiMatch.missing.map(s=><span key={s} style={{...S.tag,marginLeft:3}}>{s}</span>)}</div></div></div>}
    <input style={{...S.input,maxWidth:300,marginTop:12,marginBottom:12}} placeholder="Search skills..." value={q} onChange={e=>setQ(e.target.value)}/>
    {Object.entries(SKILL_CATS).map(([cat,sks])=>{const f=sks.filter(s=>!q||s.toLowerCase().includes(q.toLowerCase()));const addedInCat=added.filter(s=>!q||s.toLowerCase().includes(q.toLowerCase()));const all=[...f,...(cat==="Technical"?addedInCat:[])];if(!all.length)return null;return<div key={cat} style={S.card}><h3 style={{...S.h3,marginBottom:8}}>{cat}</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{all.map(s=>(<div key={s} style={{background:T.bgMuted,border:`1px solid ${T.border}`,borderRadius:7,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>doAiMatch(s)}><span style={{fontSize:11}}>{s}</span><div style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(l=><div key={l} style={{width:5,height:5,borderRadius:1,background:l<=3?T.teal:`${T.inkDim}33`}}/>)}</div><span style={{fontSize:8,color:T.violet}}>AI</span></div>))}</div></div>;})}
  </div>);
};

// ── WORKFLOWS ──
const PgWF=()=>{const[exp,setExp]=useState(null);const wfs=[{id:1,n:"Interview — Sophie Laurent",tp:"Career",st:4,tot:7,s:"In Progress",d:"2026-04-10",h:["Scheduled","Started","Gap Generated","Plan Created","Training..."]},{id:2,n:"AI Agent — AXA-LearnRec",tp:"Deploy",st:3,tot:5,s:"In Progress",d:"2026-04-08",h:["Config","Data Upload","Training","Validation..."]},{id:3,n:"Interview — Marc Dubois",tp:"Career",st:2,tot:7,s:"In Progress",d:"2026-04-15",h:["Scheduled","Started","In Progress..."]},{id:4,n:"Assessment — Q2",tp:"Assessment",st:5,tot:5,s:"Completed",d:"2026-03-20",h:["Initiated","Self-Assess","Review","Calibration","Done"]}];
return(<div>{wfs.map(w=>(<div key={w.id} style={S.card}><div style={S.between}><div><div style={{fontSize:13,fontWeight:700}}>{w.n}</div><div style={{...S.flex,marginTop:3}}><Bd status={w.tp} custom={T.ocean}/><span style={{fontSize:10,color:T.inkMuted}}>{w.d}</span></div></div><div style={S.flex}><Bd status={w.s}/>{w.s==="In Progress"&&<button style={{...S.btn,...S.btnSm}}>↺ Resume</button>}</div></div><div style={{margin:"8px 0"}}><div style={S.between}><span style={{fontSize:10,color:T.inkMuted}}>Step {w.st}/{w.tot}</span><span style={{fontSize:10,fontWeight:700,color:T.teal}}>{Math.round(w.st/w.tot*100)}%</span></div><Bar pct={w.st/w.tot*100}/></div><div style={{cursor:"pointer",fontSize:10,color:T.teal,fontWeight:500}} onClick={()=>setExp(exp===w.id?null:w.id)}>{exp===w.id?"▼ Hide":"▶"} History</div>{exp===w.id&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${T.border}`}}>{w.h.map((h,i)=><div key={i} style={{...S.flex,padding:"4px 0"}}><div style={{width:7,height:7,borderRadius:"50%",background:i<w.st?T.teal:T.bgSoft}}/><span style={{fontSize:10,color:i<w.st?T.ink:T.inkMuted}}>{h}</span>{i<w.st&&<span style={{color:T.teal,fontSize:9}}>✓</span>}</div>)}</div>}</div>))}</div>);};

// ── REPORTS ──
const PgRep=()=>(<div>
  <div style={S.g4}>{[{l:"Mobility Rate",v:"23%",t:"30%",p:77,c:T.teal},{l:"Time to Fill",v:"18d",t:"<30d",p:90,c:T.green},{l:"Skills Coverage",v:"72%",t:"85%",p:85,c:T.ocean},{l:"Action Plans",v:"42",t:"60",p:70,c:T.violet}].map(m=>(<div key={m.l} style={S.card}><div style={{fontSize:9,color:T.inkMuted,textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>{m.l}</div><div style={{fontSize:24,fontWeight:800,fontFamily:FH,color:m.c,margin:"4px 0"}}>{m.v}</div><div style={{fontSize:10,color:T.inkMuted,marginBottom:4}}>Target: {m.t}</div><Bar pct={m.p} color={m.c}/></div>))}</div>
  <div style={S.g2}>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:10}}>By Domain</h3>{DOMAINS.slice(0,6).map((d,i)=>(<div key={d} style={{...S.flex,marginBottom:6}}><span style={{fontSize:10,color:T.inkMuted,width:110}}>{d}</span><div style={{flex:1}}><Bar pct={[65,82,45,58,73,91][i]} color={[T.teal,T.green,T.orange,T.ocean,T.violet,T.teal][i]}/></div><span style={{fontSize:10,fontWeight:600,width:28,textAlign:"right"}}>{[65,82,45,58,73,91][i]}%</span></div>))}</div>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:10}}>AI Agents</h3>{AI_AGENTS.map(a=>(<div key={a.id} style={{...S.flex,marginBottom:6}}><span style={{fontSize:11}}>🤖</span><span style={{fontSize:10,width:95}}>{a.name}</span><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet,width:28,textAlign:"right"}}>{a.accuracy}%</span></div>))}</div>
  </div>
  <div style={S.card}><h3 style={{...S.h3,marginBottom:10}}>Pipeline</h3><div style={S.g3}>{[{l:"Trainings",v:67,e:"📚",c:T.ocean},{l:"Certs",v:23,e:"🏅",c:T.teal},{l:"Plans Done",v:31,e:"🎯",c:T.violet}].map(s=>(<div key={s.l} style={{textAlign:"center",padding:14}}><span style={{fontSize:24}}>{s.e}</span><div style={{fontSize:26,fontWeight:800,fontFamily:FH,marginTop:4,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:T.inkMuted,marginTop:3}}>{s.l}</div></div>))}</div></div>
</div>);

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function App(){
  const[auth,setAuth]=useState(false);const[persona,setPersona]=useState(null);const[pg,setPg]=useState("dashboard");
  if(!auth)return<Auth onLogin={p=>{setPersona(p);setAuth(true);}}/>;
  const titles={dashboard:"Dashboard",charter:"Smart Mobility Charter",marketplace:"Talent Marketplace",team:"My Team",interviews:"Career Interviews",careers:"Career Paths",skills:"Skills Repository",workflows:"Workflows",reports:"Reports & Analytics"};
  const pages={dashboard:<PgDash go={setPg}/>,charter:<PgCharter/>,marketplace:<PgMarket/>,team:<PgTeam/>,interviews:<PgIV persona={persona}/>,careers:<PgCareer/>,skills:<PgSkills/>,workflows:<PgWF/>,reports:<PgRep/>};
  return(
    <div style={{fontFamily:FT,background:T.bg,color:T.ink,minHeight:"100vh",display:"flex",overflow:"hidden",height:"100vh",fontSize:12}}>
      <style>{css}</style>
      <Side active={pg} go={setPg} persona={persona} onLogout={()=>{setAuth(false);setPersona(null);setPg("dashboard");}}/>
      <div style={{flex:1,overflow:"auto",padding:"0 24px 24px"}}>
        <div style={{...S.between,padding:"12px 0 14px",borderBottom:`1px solid ${T.border}`,marginBottom:16}}>
          <div><h1 style={S.h1}>{titles[pg]}</h1><p style={{fontSize:11,color:T.inkMuted,marginTop:2}}>Mobility by Design · AXA Group Operations</p></div>
          <div style={S.flex}><Bd status={persona?.label} custom={persona?.color}/><Bd status="RBAC" custom={T.teal}/></div>
        </div>
        {pages[pg]}
      </div>
    </div>
  );
}
