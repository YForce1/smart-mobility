import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   SMART MOBILITY PLATFORM v4.1 — AXA Group Operations
   Enterprise HR / Talent / AI Workforce — Production-Grade POC
   Features: SSO Auth · RBAC Personas · AXA UX Theme · Charter · 
   Marketplace · AI Agents · Career Interviews · Action Plans · 
   Career Paths (104) · Skills Repo · Workflows · Reports
   ═══════════════════════════════════════════════════════════════════════ */

// ─── AXA Design Tokens ───────────────────────────────────────────────
const AXA = {
  blue:    "#00008F", blueDeep: "#000062", blueMid:  "#2425AA",
  blueLight:"#4976BA", bluePale: "#B5D0EE", blueGhost:"#E8F0FE",
  red:     "#FF1721", redDark: "#C91432", redPale: "#FFEAEA",
  teal:    "#00D4AA", tealDark:"#00B894", tealPale: "#E0FFF7",
  ocean:   "#00ADC6", oceanPale:"#E0F7FA",
  orange:  "#F07662", orangeWarm:"#FF8C42",
  violet:  "#9190FA", violetPale:"#EDEDFF",
  white:   "#FFFFFF", offWhite:"#F7F9FC", grey50:"#F2F4F8",
  grey100: "#E4E8EE", grey200:"#C9CFD9", grey400:"#8E96A3",
  grey600: "#5B6370", grey800:"#2C3039", grey900:"#171B21",
  dark1:   "#0D1321", dark2: "#131B2B", dark3: "#192337", dark4:"#1F2D45",
  // Functional
  success: "#00D4AA", warning: "#FF8C42", error: "#FF1721", info: "#00ADC6",
};

const FONT = "'Source Sans 3', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_HEAD = "'Publico Headline', Georgia, 'Times New Roman', serif";

// ─── Personas / RBAC ─────────────────────────────────────────────────
const PERSONAS = [
  { id: "admin",   label: "Platform Admin",  icon: "⚙️", desc: "Full access — configuration, users, AI agents, reporting", color: AXA.red,    access: ["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports","admin"] },
  { id: "hr",      label: "HR / Talent Lead", icon: "👥", desc: "Talent marketplace, interviews, action plans, skills repository", color: AXA.teal,   access: ["dashboard","charter","marketplace","team","interviews","careers","skills","workflows","reports"] },
  { id: "manager", label: "Manager",          icon: "📋", desc: "Team management, career interviews, action plans, workflows", color: AXA.ocean,  access: ["dashboard","charter","marketplace","team","interviews","careers","skills","workflows"] },
  { id: "employee",label: "Employee",         icon: "👤", desc: "Self-service — career paths, skill profile, interview participation", color: AXA.violet, access: ["dashboard","charter","marketplace","careers","skills"] },
];

// ─── Skills Library ──────────────────────────────────────────────────
const SKILLS_LIBRARY = [
  "Python","JavaScript","React","Azure","AWS","Machine Learning","Deep Learning","NLP",
  "Data Engineering","SQL","Power BI","Tableau","Agile","Scrum","DevOps","CI/CD",
  "Kubernetes","Docker","Terraform","Project Management","Change Management","Stakeholder Management",
  "Risk Analysis","Financial Modeling","UX Design","UI Development","API Design","Microservices",
  "Cloud Architecture","Cybersecurity","Data Privacy","GDPR Compliance","Communication",
  "Leadership","Strategic Thinking","Problem Solving","Prompt Engineering","Agentic AI",
  "RPA","Process Automation","Business Analysis","Product Management","GenAI Applications",
  "LLM Fine-tuning","RAG Architecture","MLOps","Data Governance","Insurance Domain",
  "Negotiation","Presentation Skills",
];

// ─── Career Paths (100+) ────────────────────────────────────────────
const CAREER_DOMAINS = ["Technology","Data & AI","Operations","Finance","HR & Talent","Risk & Compliance","Product","Strategy"];
const CAREER_TYPES = ["Expert Track","Management Track","Hybrid Track"];
const generateCareerPaths = () => {
  const paths = [];
  const templates = [
    { domain:"Technology", paths:["Junior Dev → Senior Dev → Tech Lead → Staff Engineer → Principal Architect","Support Analyst → Platform Engineer → SRE Lead → VP Infrastructure","QA Engineer → QA Lead → Test Architect → Quality Director","Frontend Dev → UI Engineer → Design System Lead → UX Director","Backend Dev → API Architect → Platform Lead → CTO Track","Mobile Dev → Mobile Lead → Cross-Platform Architect","Security Analyst → Security Engineer → CISO Track","DevOps Engineer → Platform Lead → Cloud Director","Network Engineer → Network Architect → Infra VP","Data Engineer → Data Platform Lead → CDO Track","IT Support → Systems Admin → IT Manager → IT Director","Release Manager → Engineering Manager → VP Engineering","Integration Dev → ESB Architect → Enterprise Architect"]},
    { domain:"Data & AI", paths:["Data Analyst → Senior Analyst → Analytics Manager → Head of Analytics","ML Engineer → Senior ML → ML Lead → AI Director","Data Scientist → Lead Scientist → Head of DS → Chief Data Scientist","BI Analyst → BI Developer → BI Manager → Analytics VP","AI Researcher → Applied AI Lead → AI Strategy Director","NLP Engineer → Conversational AI Lead → AI Product Director","MLOps Engineer → ML Platform Lead → AI Infrastructure Director","Computer Vision Engineer → CV Lead → Applied AI VP","Data Governance Analyst → DG Manager → Chief Data Officer","Prompt Engineer → AI Solutions Architect → GenAI Director","AI Ethics Analyst → Responsible AI Lead → AI Policy Director","Statistician → Lead Statistician → Quantitative Director","Knowledge Engineer → Ontology Lead → Knowledge Graph Director"]},
    { domain:"Operations", paths:["Ops Analyst → Ops Manager → Head of Operations → COO Track","Process Analyst → Process Lead → Process Excellence Director","Service Desk Agent → Service Manager → IT Service Director","Claims Handler → Claims Lead → Claims Operations Director","Underwriting Assistant → Underwriter → Chief Underwriter","Supply Chain Analyst → Supply Chain Manager → VP Supply Chain","Quality Analyst → Quality Manager → VP Quality","Logistics Coordinator → Logistics Manager → VP Logistics","Facilities Coordinator → Facilities Manager → VP Real Estate","BPO Analyst → BPO Manager → Outsourcing Director","Procurement Analyst → Procurement Manager → CPO Track","Vendor Manager → Strategic Sourcing Lead → VP Procurement","Operations Research → OR Lead → Decision Science Director"]},
    { domain:"Finance", paths:["Financial Analyst → Senior FA → Finance Manager → CFO Track","Accountant → Senior Accountant → Controller → VP Finance","Actuary → Senior Actuary → Chief Actuary","Internal Auditor → Audit Manager → Chief Audit Executive","Tax Analyst → Tax Manager → VP Tax","Treasury Analyst → Treasury Manager → VP Treasury","FP&A Analyst → FP&A Manager → VP Financial Planning","Investment Analyst → Portfolio Manager → CIO Track","Compliance Analyst → Compliance Manager → Chief Compliance Officer","Revenue Analyst → Revenue Manager → VP Revenue Operations","Cost Analyst → Cost Manager → VP Cost Optimization","Billing Specialist → Billing Manager → Revenue Cycle Director","Credit Analyst → Credit Manager → Chief Credit Officer"]},
    { domain:"HR & Talent", paths:["HR Coordinator → HRBP → HR Manager → HR Director → CHRO Track","Recruiter → Senior Recruiter → Talent Acquisition Lead → VP TA","L&D Specialist → L&D Manager → Chief Learning Officer","Comp & Ben Analyst → C&B Manager → Total Rewards Director","HRIS Analyst → HRIS Manager → HR Technology Director","Employee Relations → ER Manager → VP Employee Experience","Workforce Planner → WFP Manager → VP Workforce Strategy","DE&I Coordinator → DE&I Manager → Chief Diversity Officer","Talent Management Specialist → TM Lead → VP Talent","OD Consultant → OD Manager → VP Organization Development","Career Coach → Career Development Lead → VP Mobility","Change Manager → Change Lead → VP Transformation","People Analytics → PA Manager → VP People Insights"]},
    { domain:"Risk & Compliance", paths:["Risk Analyst → Risk Manager → CRO Track","Compliance Officer → Senior Compliance → VP Compliance","Fraud Analyst → Fraud Manager → VP Fraud Prevention","AML Analyst → AML Manager → VP Financial Crime","Regulatory Affairs → Reg Manager → VP Regulatory","Info Security Analyst → CISO Track","Privacy Analyst → DPO Track","Operational Risk → OpRisk Manager → VP Operational Risk","Market Risk → Market Risk Lead → VP Market Risk","Credit Risk → Credit Risk Manager → VP Credit Risk","Model Risk → Model Validation Lead → VP Model Risk","Business Continuity → BC Manager → VP Resilience","Third Party Risk → TPRM Lead → VP Vendor Risk"]},
    { domain:"Product", paths:["Product Analyst → Product Manager → Senior PM → VP Product","UX Researcher → UX Lead → Head of Design","Product Designer → Design Lead → Chief Design Officer","Growth Analyst → Growth Manager → VP Growth","Product Owner → Senior PO → Head of Product","Technical Writer → Doc Lead → VP Content Strategy","Product Marketing → PMM Lead → VP Product Marketing","Customer Success → CS Manager → VP Customer Success","Solutions Architect → Solutions Director → VP Solutions","Product Ops → ProdOps Lead → VP Product Operations","API Product Manager → Platform PM → VP Platform","Digital Product → Digital Lead → Chief Digital Officer","Innovation Analyst → Innovation Lead → VP Innovation"]},
    { domain:"Strategy", paths:["Strategy Analyst → Strategy Manager → VP Strategy → CSO Track","M&A Analyst → M&A Manager → VP Corporate Development","Business Dev → BD Manager → VP Business Development","Market Research → Insights Manager → VP Market Intelligence","Partnerships → Partnership Lead → VP Alliances","Transformation Lead → VP Transformation → Chief Transformation Officer","Corporate Planning → Planning Director → VP Corporate Strategy","Competitive Intel → CI Manager → VP Strategic Intelligence","Digital Strategy → Digital Transformation Lead → CDO","ESG Analyst → ESG Manager → Chief Sustainability Officer","Innovation Strategy → Innovation Director → VP Innovation","Portfolio Strategy → Portfolio Director → VP Portfolio Management","New Ventures → Ventures Lead → VP New Business"]},
  ];
  let id = 1;
  templates.forEach(t => t.paths.forEach((p,i) => {
    const steps = p.split(" → ");
    paths.push({ id:id++, domain:t.domain, type:CAREER_TYPES[i%3], name:steps[steps.length-1],
      steps: steps.map((s,si) => ({ title:s, level:si+1, skills:SKILLS_LIBRARY.slice((id+si*3)%30,(id+si*3)%30+3), skillLevels:["Foundation","Intermediate","Advanced","Expert"].slice(0,Math.min(si+1,4)) }))
    });
  }));
  return paths;
};

// ─── Interview Questions (from Excel) ────────────────────────────────
const INTERVIEW_QUESTIONS = [
  {id:1,text:"What are your overall long-term career aspirations?",type:"single",options:["Grow as an expert in my current field","Move into a different functional area","Move into people management","Move into a strategic / transversal role","Explore international or cross-entity opportunities","I am not sure yet"]},
  {id:2,text:"What are your short to medium-term career aspirations within the company? (3-5 years)",type:"single",options:["Progress in my current role","Take on a different role at a similar level","Take on a higher-responsibility role","Participate in short-term missions / projects"]},
  {id:3,text:"Which of your career aspirations are most closely aligned with AXA's job opportunities?",type:"text",options:[],note:"Interviewer will provide future job samples (e.g. Agentic AI)"},
  {id:4,text:"What are your current skills and strengths?",type:"multi",options:SKILLS_LIBRARY.slice(0,20)},
  {id:5,text:"What is your current level of AI skills and competency?",type:"single",options:["No knowledge","Basic awareness","Able to use tools with guidance","Autonomous in daily work","Advanced / expert"]},
  {id:6,text:"What skills or experiences are you most eager to develop?",type:"multi",options:SKILLS_LIBRARY.slice(10,30)},
  {id:7,text:"Are you interested in exploring a job change in the short term?",type:"single",options:["Yes","No"],conditional:true},
  {id:"7a",text:"If not, what are the reasons for not exploring mobility at this time?",type:"single",options:["I feel comfortable / well positioned in my role","Skill gaps to address first","No visible opportunities"],conditionOn:7,conditionValue:"No"},
  {id:8,text:"When would you be open to making a job change?",type:"single",options:["Within 6 months","6–12 months","1–2 years","More than 2 years","I don't foresee a move"]},
  {id:9,text:"Would you be willing to consider geographic mobility?",type:"single",options:["Yes, internationally","Yes, within my country","Yes, remote only","No"]},
  {id:10,text:"What training or development activities are you currently pursuing or need to pursue?",type:"multi",options:["Formal training","On-the-job learning","Mentoring / coaching","Short-term mission (\"Be In My Shoes\")","Certification","No specific action needed"]},
  {id:11,text:"Are there specific opportunities within the organization that you are interested in exploring?",type:"text",options:[]},
];

// ─── Employees ───────────────────────────────────────────────────────
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

// ─── AI Agents ───────────────────────────────────────────────────────
const AI_AGENTS = [
  {id:"ai-1",name:"AXA-SkillMatch",role:"Skills Matching Agent",skills:["NLP","Recommendation Engine","Skills Taxonomy"],status:"active",description:"Matches employee skills to open positions using semantic analysis and AXA's competency framework.",accuracy:94,tasksToday:127},
  {id:"ai-2",name:"AXA-CareerPath",role:"Career Path Advisor",skills:["Career Modeling","Gap Analysis","Predictive Analytics"],status:"active",description:"Generates personalized career trajectories based on skills, aspirations, and market demand.",accuracy:91,tasksToday:84},
  {id:"ai-3",name:"AXA-LearnRec",role:"Learning Recommender",skills:["Content Curation","Learning Analytics","Certification Mapping"],status:"training",description:"Suggests training programs and certifications aligned with individual development plans.",accuracy:87,tasksToday:0},
  {id:"ai-4",name:"AXA-WorkforceAI",role:"Workforce Planning Agent",skills:["Demand Forecasting","Supply Modeling","Scenario Analysis"],status:"active",description:"Forecasts talent demand and supply across business units, enabling proactive workforce planning.",accuracy:92,tasksToday:56},
  {id:"ai-5",name:"AXA-InterviewBot",role:"Interview Copilot",skills:["Conversation AI","Sentiment Analysis","Competency Assessment"],status:"idle",description:"Assists managers during career interviews with real-time suggestions and competency scoring.",accuracy:85,tasksToday:0},
];

// ─── Charter Data ────────────────────────────────────────────────────
const CHARTER_SECTIONS = [
  { title:"The Smart Mobility Ecosystem", icon:"🌐", subsections:[
    {title:"Today → Tomorrow",content:"Transition from Human-Only teams to Hybrid Human+Agent teams. AI handles Automate, Analyse, and Recommend functions. Humans handle Decide, Validate, Contextualise, and remain Accountable.",highlight:"Human always stays accountable for every outcome"},
    {title:"AXA Entities Integration",content:"AXA entities provide Business Roadmap and Skills Needs. These feed into the central Matching Engine that connects Talents and Agentics to available Roles/Positions."},
    {title:"Roles & Positions",content:"Three categories: Orchestration Roles (Strategy · Direction · Judgment), Execution Roles (Delivery · Operations · Analysis), and Hybrid Roles (Human + Agent · Extended Capacity)."},
  ]},
  { title:"Guiding Principles", icon:"📐", subsections:[
    {title:"01 — Hybrid Teams",content:"AI enablement & convergence across all functions"},
    {title:"02 — Scope Definition",content:"Define scope for org change & impacted resources"},
    {title:"03 — Urgency Varies",content:"Mobility urgency varies by function & stakeholder"},
    {title:"04 — SLA/KPIs",content:"Objective SLA/KPIs — managers mandated to support"},
    {title:"05 — Business-Need Driven",content:"Short & long-term goals aligned to business needs"},
    {title:"06 — Internal First",content:"Internal mobility always prioritized over external"},
    {title:"07 — Industry Standard",content:"Short-term goal: reach industry mobility standard"},
    {title:"08 — Business-Critical",content:"Framework shaped by business-critical priorities"},
  ]},
  { title:"Business Case", icon:"📊", subsections:[
    {title:"Time to Productivity",content:"Internal: Weeks | External: 6–12 months"},
    {title:"Cost",content:"Internal: Low/Zero | External: 1–2× salary"},
    {title:"Cultural Fit",content:"Internal: Embedded | External: Risk"},
    {title:"Knowledge Retention",content:"Internal: 100% retained | External: Lost & rebuilt"},
    {title:"Compounding Returns",content:"Internal: Yes — grows | External: No — resets"},
  ]},
];

const WORKFLOW_STEPS = ["Scheduled","In Progress","Interview Complete","Action Plan Created","Training Assigned","Under Review","Completed"];

// ═══════════════════════════════════════════════════════════════════════
// STYLES — AXA Enterprise Theme
// ═══════════════════════════════════════════════════════════════════════
const cssReset = `
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:${AXA.dark2}; }
::-webkit-scrollbar-thumb { background:${AXA.dark4}; border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:${AXA.blueLight}; }

@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
@keyframes glow { 0%,100%{box-shadow:0 0 8px ${AXA.teal}44} 50%{box-shadow:0 0 20px ${AXA.teal}66} }
@keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100%)} }
`;

// ─── Component-level styles ──────────────────────────────────────────
const S = {
  card: { background:AXA.dark3, borderRadius:10, border:`1px solid ${AXA.dark4}`, padding:20, marginBottom:14, animation:"fadeIn .35s ease", transition:"border-color .2s, box-shadow .2s" },
  cardHover: { borderColor:AXA.blueLight, boxShadow:`0 4px 24px ${AXA.blue}22` },
  btn: { background:`linear-gradient(135deg,${AXA.teal},${AXA.tealDark})`, color:"#fff", border:"none", borderRadius:7, padding:"9px 20px", cursor:"pointer", fontWeight:600, fontSize:12, fontFamily:FONT, letterSpacing:.3, transition:"all .2s", display:"inline-flex", alignItems:"center", gap:6 },
  btnSm: { padding:"6px 14px", fontSize:11 },
  btnOutline: { background:"transparent", border:`1px solid ${AXA.teal}`, color:AXA.teal },
  btnAxa: { background:`linear-gradient(135deg,${AXA.blue},${AXA.blueDeep})`, color:"#fff" },
  btnDanger: { background:`linear-gradient(135deg,${AXA.red},${AXA.redDark})` },
  badge: { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600, letterSpacing:.4 },
  input: { background:AXA.dark1, border:`1px solid ${AXA.dark4}`, borderRadius:7, padding:"9px 14px", color:"#fff", fontSize:12, fontFamily:FONT, width:"100%", outline:"none", boxSizing:"border-box", transition:"border-color .2s" },
  select: { background:AXA.dark1, border:`1px solid ${AXA.dark4}`, borderRadius:7, padding:"9px 14px", color:"#fff", fontSize:12, fontFamily:FONT, outline:"none", cursor:"pointer" },
  label: { fontSize:10, color:AXA.grey400, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, marginBottom:6 },
  tag: { background:`${AXA.teal}15`, color:AXA.teal, padding:"3px 9px", borderRadius:5, fontSize:10, fontWeight:600, display:"inline-block" },
  flex: { display:"flex", alignItems:"center", gap:10 },
  between: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  grid3: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 },
  grid4: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 },
};

// ═══════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
const Badge = ({status}) => {
  const m = {active:AXA.teal,training:AXA.warning,idle:AXA.grey400,completed:AXA.teal,"in progress":AXA.info,"not started":AXA.grey400,planned:AXA.violet,registered:AXA.warning,achieved:AXA.teal,Senior:AXA.teal,Mid:AXA.ocean,Junior:AXA.orangeWarm,Lead:AXA.violet,High:AXA.red,Medium:AXA.warning,Low:AXA.grey400};
  const c = m[status] || m[status?.toLowerCase()] || AXA.grey400;
  return <span style={{...S.badge, background:`${c}20`, color:c}}>{status}</span>;
};

const Bar = ({pct,color=AXA.teal,h=6}) => (
  <div style={{height:h,borderRadius:h/2,background:AXA.dark1,width:"100%",overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h/2,transition:"width .6s ease"}}/>
  </div>
);

const MultiChips = ({options,selected,onToggle,max=24}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
    {options.slice(0,max).map(o => (
      <span key={o} onClick={()=>onToggle(o)} style={{...S.badge,cursor:"pointer",background:selected.includes(o)?`${AXA.teal}22`:`${AXA.grey600}18`,color:selected.includes(o)?AXA.teal:AXA.grey400,border:`1px solid ${selected.includes(o)?AXA.teal:"transparent"}`,transition:"all .15s"}}>{o}</span>
    ))}
  </div>
);

const Stepper = ({steps,current}) => (
  <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:14}}>
    {steps.map((s,i) => (
      <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:"0 0 auto",minWidth:28}}>
          <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,
            background:i<current?AXA.teal:i===current?`${AXA.teal}22`:`${AXA.grey600}33`,
            color:i<current?"#fff":i===current?AXA.teal:AXA.grey600,
            border:i===current?`2px solid ${AXA.teal}`:"2px solid transparent",transition:"all .3s"}}>
            {i<current?"✓":i+1}
          </div>
          <div style={{fontSize:8,color:i<=current?"#fff":AXA.grey600,marginTop:3,textAlign:"center",maxWidth:64,lineHeight:1.2}}>{s}</div>
        </div>
        {i<steps.length-1 && <div style={{flex:1,height:2,background:i<current?AXA.teal:`${AXA.grey600}33`,margin:"0 2px",marginBottom:16,transition:"background .3s"}}/>}
      </div>
    ))}
  </div>
);

// ─── AXA Logo ────────────────────────────────────────────────────────
const AXALogo = ({size=32}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <rect width="40" height="40" rx="8" fill={AXA.blue}/>
    <text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily="Arial,sans-serif">AXA</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════
// AUTH — SSO Login Screen
// ═══════════════════════════════════════════════════════════════════════
const LoginScreen = ({onLogin}) => {
  const [step,setStep] = useState("landing"); // landing | sso | persona
  const [email,setEmail] = useState("yassir.abdelfettah@axa.com");
  const [loading,setLoading] = useState(false);
  const [selectedPersona,setSelectedPersona] = useState(null);

  const handleSSO = () => {
    if(!email.includes("@axa")) return;
    setLoading(true);
    setTimeout(()=>{setLoading(false);setStep("persona");},1800);
  };

  const handlePersonaSelect = (p) => {
    setSelectedPersona(p.id);
    setTimeout(()=>onLogin(p),600);
  };

  // ─── Landing ───
  if(step==="landing") return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${AXA.dark1} 0%,${AXA.blueDeep} 50%,${AXA.dark1} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,position:"relative",overflow:"hidden"}}>
      <style>{cssReset}</style>
      {/* Background pattern */}
      <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 60px,${AXA.teal} 60px,${AXA.teal} 61px)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"10%",right:"15%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${AXA.blue}22,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"10%",left:"10%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${AXA.teal}11,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{textAlign:"center",animation:"fadeIn .8s ease",position:"relative",zIndex:1}}>
        <AXALogo size={56}/>
        <h1 style={{fontFamily:FONT_HEAD,fontSize:38,fontWeight:800,color:"#fff",margin:"20px 0 4px",letterSpacing:-.5}}>
          SMART <span style={{color:AXA.teal}}>Mobility</span>
        </h1>
        <p style={{color:AXA.grey400,fontSize:14,marginBottom:8}}>AXA Group Operations — Talent & AI Workforce Platform</p>
        <div style={{display:"inline-flex",gap:8,marginBottom:32}}>
          <span style={{...S.badge,background:`${AXA.teal}20`,color:AXA.teal}}>v4.1</span>
          <span style={{...S.badge,background:`${AXA.blue}30`,color:AXA.bluePale}}>Enterprise</span>
          <span style={{...S.badge,background:`${AXA.violet}20`,color:AXA.violet}}>AI-Powered</span>
        </div>
        <div>
          <button onClick={()=>setStep("sso")} style={{...S.btn,...S.btnAxa,padding:"14px 48px",fontSize:15,borderRadius:10,boxShadow:`0 8px 32px ${AXA.blue}44`}}>
            🔐 Sign in with AXA SSO
          </button>
        </div>
        <p style={{color:AXA.grey600,fontSize:11,marginTop:16}}>Secured by Azure AD · RBAC-enabled · ISO 27001 compliant</p>
      </div>
    </div>
  );

  // ─── SSO Flow ───
  if(step==="sso") return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${AXA.dark1},${AXA.blueDeep})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <style>{cssReset}</style>
      <div style={{width:420,background:AXA.dark3,borderRadius:16,border:`1px solid ${AXA.dark4}`,padding:40,boxShadow:`0 24px 80px ${AXA.dark1}cc`,animation:"fadeIn .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <AXALogo size={44}/>
          <h2 style={{fontFamily:FONT_HEAD,fontSize:22,fontWeight:700,color:"#fff",marginTop:12}}>AXA SSO Authentication</h2>
          <p style={{color:AXA.grey400,fontSize:12,marginTop:4}}>Sign in with your corporate credentials</p>
        </div>

        <div style={{marginBottom:16}}>
          <label style={S.label}>Corporate Email</label>
          <input style={{...S.input,borderColor:email.includes("@axa")?AXA.teal:AXA.dark4}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@axa.com"/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" defaultValue="••••••••••" placeholder="Enter password"/>
        </div>

        <button onClick={handleSSO} disabled={loading} style={{...S.btn,...S.btnAxa,width:"100%",justifyContent:"center",padding:"12px",fontSize:14,opacity:loading?.7:1}}>
          {loading ? <><span style={{animation:"pulse 1s infinite"}}>⏳</span> Authenticating via Azure AD...</> : "🔐 Authenticate"}
        </button>

        <div style={{marginTop:16,padding:12,background:`${AXA.blue}15`,borderRadius:8,border:`1px solid ${AXA.blue}33`}}>
          <div style={{fontSize:10,color:AXA.bluePale,fontWeight:600,marginBottom:4}}>🔒 SECURITY</div>
          <div style={{fontSize:10,color:AXA.grey400,lineHeight:1.5}}>MFA via Microsoft Authenticator · Session timeout: 8h · Token: JWT RS256 · Audit logging enabled</div>
        </div>

        <button onClick={()=>setStep("landing")} style={{...S.btn,...S.btnOutline,...S.btnSm,marginTop:12,width:"100%",justifyContent:"center"}}>← Back</button>
      </div>
    </div>
  );

  // ─── Persona Selection ───
  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${AXA.dark1},${AXA.blueDeep})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <style>{cssReset}</style>
      <div style={{maxWidth:800,width:"100%",padding:40,animation:"fadeIn .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <AXALogo size={44}/>
          <h2 style={{fontFamily:FONT_HEAD,fontSize:24,fontWeight:700,color:"#fff",marginTop:12}}>Welcome, Yassir</h2>
          <p style={{color:AXA.grey400,fontSize:13,marginTop:4}}>Select your role to configure access permissions</p>
          <div style={{display:"inline-flex",gap:6,marginTop:8}}>
            <span style={{...S.badge,background:`${AXA.teal}20`,color:AXA.teal}}>✓ SSO Verified</span>
            <span style={{...S.badge,background:`${AXA.blue}30`,color:AXA.bluePale}}>Azure AD</span>
          </div>
        </div>

        <div style={S.grid2}>
          {PERSONAS.map(p => (
            <div key={p.id} onClick={()=>handlePersonaSelect(p)}
              style={{...S.card,cursor:"pointer",borderColor:selectedPersona===p.id?p.color:AXA.dark4,boxShadow:selectedPersona===p.id?`0 4px 24px ${p.color}33`:"none",transform:selectedPersona===p.id?"scale(1.02)":"scale(1)",transition:"all .3s"}}>
              <div style={{...S.flex}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${p.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{p.icon}</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{p.label}</div>
                  <div style={{fontSize:11,color:AXA.grey400,marginTop:2}}>{p.desc}</div>
                </div>
              </div>
              <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:4}}>
                {p.access.map(a => <span key={a} style={{...S.badge,background:`${p.color}12`,color:p.color,fontSize:9}}>{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  {key:"dashboard",label:"Dashboard",emoji:"📊"},
  {key:"charter",label:"Smart Charter",emoji:"📜"},
  {key:"marketplace",label:"Talent Marketplace",emoji:"🏪"},
  {key:"team",label:"My Team",emoji:"👥"},
  {key:"interviews",label:"Career Interviews",emoji:"🎯"},
  {key:"careers",label:"Career Paths",emoji:"🚀"},
  {key:"skills",label:"Skills Repository",emoji:"💡"},
  {key:"workflows",label:"Workflows",emoji:"⚙️"},
  {key:"reports",label:"Reports & Analytics",emoji:"📈"},
];

const Sidebar = ({active,setActive,persona,onLogout}) => {
  const allowed = persona?.access || [];
  return (
    <div style={{width:230,background:AXA.dark2,borderRight:`1px solid ${AXA.dark4}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      {/* Header */}
      <div style={{padding:"18px 20px 16px",borderBottom:`1px solid ${AXA.dark4}`}}>
        <div style={{...S.flex,gap:10}}>
          <AXALogo size={30}/>
          <div>
            <div style={{fontFamily:FONT_HEAD,fontSize:15,fontWeight:700,color:"#fff"}}>SMART <span style={{color:AXA.teal}}>Mobility</span></div>
            <div style={{fontSize:9,color:AXA.grey400,letterSpacing:1.5,textTransform:"uppercase",marginTop:1}}>AXA Group Operations</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,padding:"10px 0",overflowY:"auto"}}>
        {NAV_ITEMS.filter(n=>allowed.includes(n.key)).map(n => (
          <div key={n.key} onClick={()=>setActive(n.key)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",cursor:"pointer",
              background:active===n.key?`${AXA.teal}12`:"transparent",
              borderLeft:active===n.key?`3px solid ${AXA.teal}`:"3px solid transparent",
              color:active===n.key?AXA.teal:AXA.grey400,fontSize:13,fontWeight:active===n.key?600:400,
              transition:"all .15s"}}>
            <span style={{fontSize:14}}>{n.emoji}</span>
            {n.label}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{padding:16,borderTop:`1px solid ${AXA.dark4}`}}>
        <div style={{...S.flex,gap:8}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${AXA.blue},${AXA.blueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>YA</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>Yassir A.</div>
            <div style={{fontSize:10,color:persona?.color || AXA.grey400,fontWeight:500}}>{persona?.label}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{...S.btn,...S.btnOutline,...S.btnSm,width:"100%",justifyContent:"center",marginTop:10,fontSize:10}}>
          🔓 Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── Top Bar ─────────────────────────────────────────────────────────
const TopBar = ({persona,page}) => {
  const titles = {dashboard:"Dashboard",charter:"Smart Mobility Charter",marketplace:"Talent Marketplace",team:"My Team",interviews:"Career Interviews",careers:"Career Paths",skills:"Skills Repository",workflows:"Workflows",reports:"Reports & Analytics"};
  return (
    <div style={{...S.between,padding:"14px 0 18px",borderBottom:`1px solid ${AXA.dark4}`,marginBottom:20}}>
      <div>
        <h1 style={{fontFamily:FONT_HEAD,fontSize:24,fontWeight:700,color:"#fff",margin:0}}>{titles[page]||"Dashboard"}</h1>
        <p style={{fontSize:11,color:AXA.grey400,marginTop:3}}>Mobility by Design · AXA Group Operations</p>
      </div>
      <div style={{...S.flex,gap:12}}>
        <div style={{...S.badge,background:`${persona?.color || AXA.teal}20`,color:persona?.color || AXA.teal}}>{persona?.icon} {persona?.label}</div>
        <div style={{...S.badge,background:`${AXA.teal}15`,color:AXA.teal}}>RBAC Active</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ───────────────────────────────────────────────────────
const DashboardPage = ({setActive,persona}) => {
  const stats = [
    {label:"Active Employees",value:247,delta:"+12",emoji:"👥",color:AXA.teal,page:"team"},
    {label:"AI Agents",value:5,delta:"+2",emoji:"🤖",color:AXA.violet,page:"team"},
    {label:"Open Positions",value:34,delta:"-3",emoji:"📋",color:AXA.ocean,page:"marketplace"},
    {label:"Career Interviews",value:18,delta:"+5",emoji:"🎯",color:AXA.orangeWarm,page:"interviews"},
  ];
  return (<div>
    <div style={S.grid4}>
      {stats.map(s => (
        <div key={s.label} style={{...S.card,cursor:"pointer"}} onClick={()=>setActive(s.page)}>
          <div style={S.between}>
            <span style={{fontSize:22}}>{s.emoji}</span>
            <span style={{fontSize:10,fontWeight:700,color:s.delta.startsWith("+")?AXA.teal:AXA.red}}>{s.delta}</span>
          </div>
          <div style={{fontSize:30,fontWeight:800,color:"#fff",marginTop:8,fontFamily:FONT_HEAD}}>{s.value}</div>
          <div style={{fontSize:11,color:AXA.grey400,marginTop:2}}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={S.grid2}>
      <div style={S.card}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>Mobility Pipeline</h3>
        {["Interview Scheduled","In Progress","Action Plan","Training","Completed"].map((s,i)=>(
          <div key={s} style={{...S.flex,marginBottom:10}}>
            <span style={{fontSize:11,color:AXA.grey400,width:130}}>{s}</span>
            <div style={{flex:1}}><Bar pct={[25,45,60,35,80][i]} color={[AXA.info,AXA.warning,AXA.teal,AXA.violet,AXA.success][i]}/></div>
            <span style={{fontSize:11,fontWeight:600,color:"#fff",width:28,textAlign:"right"}}>{[12,18,24,9,31][i]}</span>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>AI Agent Activity</h3>
        {AI_AGENTS.slice(0,4).map(a=>(
          <div key={a.id} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
            <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${AXA.violet}44,${AXA.ocean}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🤖</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{a.name}</div><div style={{fontSize:10,color:AXA.grey400}}>{a.role} · {a.tasksToday} tasks today</div></div>
            <Badge status={a.status}/>
          </div>
        ))}
      </div>
    </div>
    <div style={S.card}>
      <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:12}}>Quick Actions</h3>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[{l:"Schedule Interview",p:"interviews"},{l:"Browse Marketplace",p:"marketplace"},{l:"View Career Paths",p:"careers"},{l:"Review Charter",p:"charter"},{l:"Skills Repository",p:"skills"}].map(a=>(
          <button key={a.l} style={{...S.btn,...S.btnOutline}} onClick={()=>setActive(a.p)}>{a.l}</button>
        ))}
      </div>
    </div>
  </div>);
};

// ─── CHARTER ─────────────────────────────────────────────────────────
const CharterPage = () => {
  const [exp,setExp] = useState({});
  const toggle = k => setExp(p=>({...p,[k]:!p[k]}));
  return (<div>
    {/* Core Principle Banner */}
    <div style={{...S.card,background:`linear-gradient(135deg,${AXA.blue}44,${AXA.dark3})`,border:`1px solid ${AXA.teal}44`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,right:0,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${AXA.teal}11,transparent)`,pointerEvents:"none"}}/>
      <div style={S.flex}>
        <span style={{fontSize:22}}>⭐</span>
        <span style={{fontSize:14,fontWeight:700,color:AXA.teal,letterSpacing:.5}}>CORE PRINCIPLE</span>
        <Badge status="Active"/>
      </div>
      <p style={{fontSize:18,fontWeight:700,fontFamily:FONT_HEAD,color:"#fff",margin:"12px 0 0",lineHeight:1.5}}>
        "Human always stays accountable for every outcome"
      </p>
      <p style={{fontSize:12,color:AXA.grey400,marginTop:6}}>Transition from Human-Only to Hybrid Human+Agent teams — AI enables, Humans decide.</p>
    </div>

    {/* Roles Split */}
    <div style={S.grid3}>
      {[
        {title:"AI Responsibilities",label:"AI",items:["Automate","Analyse","Recommend"],color:AXA.violet,emoji:"🤖"},
        {title:"Human Responsibilities",label:"H",items:["Decide","Validate","Contextualise","Accountable"],color:AXA.teal,emoji:"👤"},
        {title:"Role Categories",label:"R",items:["Orchestration: Strategy · Direction · Judgment","Execution: Delivery · Operations · Analysis","Hybrid: Human + Agent · Extended Capacity"],color:AXA.ocean,emoji:"🏗️"},
      ].map(r=>(
        <div key={r.title} style={S.card}>
          <div style={S.flex}><span style={{fontSize:18}}>{r.emoji}</span><h4 style={{fontSize:13,fontWeight:700,color:"#fff"}}>{r.title}</h4></div>
          <div style={{marginTop:10}}>{r.items.map(it=><div key={it} style={{fontSize:12,color:AXA.grey400,padding:"5px 0",borderBottom:`1px solid ${AXA.dark4}`}}>• {it}</div>)}</div>
        </div>
      ))}
    </div>

    {/* Expandable Sections */}
    {CHARTER_SECTIONS.map((sec,si)=>(
      <div key={si} style={S.card}>
        <div style={{...S.between,cursor:"pointer"}} onClick={()=>toggle(`s${si}`)}>
          <div style={S.flex}>
            <span style={{fontSize:18}}>{sec.icon}</span>
            <h3 style={{fontSize:15,fontWeight:700,color:"#fff"}}>{sec.title}</h3>
            <span style={{...S.badge,background:`${AXA.teal}15`,color:AXA.teal}}>{sec.subsections.length}</span>
          </div>
          <span style={{color:AXA.grey400,transition:"transform .2s",transform:exp[`s${si}`]?"rotate(90deg)":"none"}}>▶</span>
        </div>
        {exp[`s${si}`] && <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${AXA.dark4}`}}>
          {sec.subsections.map((sub,i)=>(
            <div key={i} style={{padding:"10px 14px",background:i%2===0?"transparent":`${AXA.dark1}55`,borderRadius:7,marginBottom:4}}>
              <div style={{fontSize:12,fontWeight:600,color:AXA.teal}}>{sub.title}</div>
              <div style={{fontSize:12,color:AXA.grey400,lineHeight:1.6,marginTop:3}}>{sub.content}</div>
              {sub.highlight && <div style={{marginTop:6,padding:"6px 12px",background:`${AXA.orangeWarm}12`,borderLeft:`3px solid ${AXA.orangeWarm}`,borderRadius:4,fontSize:11,color:AXA.orangeWarm,fontWeight:600}}>{sub.highlight}</div>}
            </div>
          ))}
        </div>}
      </div>
    ))}

    {/* Business Case */}
    <div style={S.card}>
      <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>Business Case: Internal vs External</h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{borderBottom:`2px solid ${AXA.dark4}`}}>
          <th style={{textAlign:"left",padding:"10px 14px",color:AXA.grey400,fontWeight:600}}>Factor</th>
          <th style={{textAlign:"center",padding:"10px 14px",color:AXA.teal,fontWeight:700}}>Internal ✓</th>
          <th style={{textAlign:"center",padding:"10px 14px",color:AXA.grey400}}>External</th>
        </tr></thead>
        <tbody>{[
          ["Time to Productivity","Weeks","6–12 months"],
          ["Cost","Low / Zero","1–2× salary"],
          ["Cultural Fit","Embedded","Risk"],
          ["Knowledge Retention","100% retained","Lost & rebuilt"],
          ["Compounding Returns","Yes — grows","No — resets"],
        ].map(([f,i,e],idx)=>(
          <tr key={idx} style={{borderBottom:`1px solid ${AXA.dark4}`}}>
            <td style={{padding:"10px 14px",fontWeight:500,color:"#fff"}}>{f}</td>
            <td style={{padding:"10px 14px",textAlign:"center"}}><span style={{...S.badge,background:`${AXA.teal}20`,color:AXA.teal}}>{i}</span></td>
            <td style={{padding:"10px 14px",textAlign:"center",color:AXA.grey400}}>{e}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>);
};

// ─── MARKETPLACE ─────────────────────────────────────────────────────
const MarketplacePage = () => {
  const [sf,setSf]=useState([]);const [df,setDf]=useState("All");const [lf,setLf]=useState("All");const [q,setQ]=useState("");
  const positions=[
    {id:1,title:"Senior ML Engineer",domain:"Data & AI",level:"Senior",skills:["Python","Machine Learning","MLOps","Deep Learning"],location:"Paris",type:"Hybrid",urgency:"High"},
    {id:2,title:"Cloud Solutions Architect",domain:"Technology",level:"Lead",skills:["Azure","Cloud Architecture","Microservices","Kubernetes"],location:"London",type:"Remote",urgency:"Medium"},
    {id:3,title:"Product Owner — AI Platform",domain:"Product",level:"Senior",skills:["Product Management","Agile","GenAI Applications","Stakeholder Management"],location:"Paris",type:"On-site",urgency:"High"},
    {id:4,title:"Data Governance Manager",domain:"Data & AI",level:"Mid",skills:["Data Governance","GDPR Compliance","SQL","Data Privacy"],location:"Brussels",type:"Hybrid",urgency:"Low"},
    {id:5,title:"DevSecOps Engineer",domain:"Technology",level:"Mid",skills:["DevOps","CI/CD","Cybersecurity","Docker"],location:"Paris",type:"On-site",urgency:"Medium"},
    {id:6,title:"Change Management Lead",domain:"HR & Talent",level:"Lead",skills:["Change Management","Communication","Leadership","Stakeholder Management"],location:"Paris",type:"Hybrid",urgency:"High"},
    {id:7,title:"Agentic AI Developer",domain:"Data & AI",level:"Senior",skills:["Agentic AI","Python","LLM Fine-tuning","RAG Architecture"],location:"Remote",type:"Remote",urgency:"High"},
    {id:8,title:"RPA Analyst",domain:"Operations",level:"Junior",skills:["RPA","Process Automation","Business Analysis","Python"],location:"Cologne",type:"On-site",urgency:"Medium"},
  ];
  const filtered=positions.filter(p=>{
    if(df!=="All"&&p.domain!==df)return false; if(lf!=="All"&&p.level!==lf)return false;
    if(sf.length>0&&!sf.some(s=>p.skills.includes(s)))return false;
    if(q&&!p.title.toLowerCase().includes(q.toLowerCase()))return false; return true;
  });
  return (<div>
    <div style={{...S.card,padding:16}}>
      <div style={{...S.flex,marginBottom:12}}><span style={{fontSize:14}}>🔍</span><span style={{fontSize:12,fontWeight:600,color:AXA.teal}}>Advanced Filters</span>
        {(sf.length>0||df!=="All"||lf!=="All")&&<button style={{...S.btn,...S.btnSm,...S.btnOutline,marginLeft:"auto"}} onClick={()=>{setSf([]);setDf("All");setLf("All");setQ("");}}>Clear All</button>}
      </div>
      <div style={{...S.flex,gap:12,marginBottom:12}}>
        <input style={{...S.input,maxWidth:250}} placeholder="Search positions..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select style={S.select} value={df} onChange={e=>setDf(e.target.value)}><option value="All">All Domains</option>{CAREER_DOMAINS.map(d=><option key={d}>{d}</option>)}</select>
        <select style={S.select} value={lf} onChange={e=>setLf(e.target.value)}><option value="All">All Levels</option>{["Junior","Mid","Senior","Lead"].map(l=><option key={l}>{l}</option>)}</select>
      </div>
      <div style={S.label}>Filter by Skills</div>
      <MultiChips options={SKILLS_LIBRARY.slice(0,24)} selected={sf} onToggle={s=>setSf(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}/>
    </div>
    <div style={{fontSize:11,color:AXA.grey400,margin:"10px 0 8px"}}>{filtered.length} positions found</div>
    <div style={S.grid2}>
      {filtered.map(p=>(
        <div key={p.id} style={S.card}>
          <div style={S.between}><h4 style={{fontSize:14,fontWeight:700,color:"#fff",margin:0}}>{p.title}</h4><Badge status={p.urgency}/></div>
          <div style={{...S.flex,marginTop:6,fontSize:11,color:AXA.grey400}}><span>{p.domain}</span><span>·</span><span>{p.level}</span><span>·</span><span>{p.location}</span><span>·</span><span>{p.type}</span></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:10}}>{p.skills.map(sk=><span key={sk} style={{...S.tag,background:sf.includes(sk)?`${AXA.teal}22`:`${AXA.grey600}15`,color:sf.includes(sk)?AXA.teal:AXA.grey400}}>{sk}</span>)}</div>
          <button style={{...S.btn,...S.btnSm,marginTop:12}}>Apply / Express Interest</button>
        </div>
      ))}
    </div>
  </div>);
};

// ─── TEAM ────────────────────────────────────────────────────────────
const TeamPage = () => (<div>
  <h3 style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:14}}>👤 Human Team Members</h3>
  <div style={S.grid2}>
    {EMPLOYEES.map(e=>(
      <div key={e.id} style={S.card}>
        <div style={S.flex}>
          <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${AXA.blue},${AXA.blueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{e.avatar}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{e.name}</div><div style={{fontSize:11,color:AXA.grey400}}>{e.role} — {e.dept}</div></div>
          <Badge status={e.level}/>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:10}}>{e.skills.map(sk=><span key={sk} style={S.tag}>{sk}</span>)}</div>
        <div style={{...S.flex,marginTop:8,fontSize:10,color:AXA.grey400}}>AI Level: <Badge status={e.aiLevel}/></div>
      </div>
    ))}
  </div>

  {/* AI Agents */}
  <div style={{marginTop:28,paddingTop:20,borderTop:`2px solid ${AXA.violet}33`}}>
    <div style={S.flex}>
      <span style={{fontSize:22}}>🤖</span>
      <h3 style={{fontSize:16,fontWeight:700,color:"#fff",margin:0}}>AI Agent Team</h3>
      <span style={{...S.badge,background:`${AXA.violet}20`,color:AXA.violet}}>{AI_AGENTS.length} agents</span>
    </div>
    <p style={{fontSize:11,color:AXA.grey400,margin:"8px 0 16px"}}>AI-powered agents augmenting team capabilities — Hybrid Human+Agent workforce model</p>
    <div style={S.grid3}>
      {AI_AGENTS.map(a=>(
        <div key={a.id} style={{...S.card,borderLeft:`3px solid ${a.status==="active"?AXA.violet:a.status==="training"?AXA.warning:AXA.grey600}`}}>
          <div style={S.between}>
            <div style={S.flex}>
              <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${AXA.violet}33,${AXA.ocean}33)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
              <div><div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{a.name}</div><div style={{fontSize:10,color:AXA.grey400}}>{a.role}</div></div>
            </div>
            <Badge status={a.status}/>
          </div>
          <p style={{fontSize:11,color:AXA.grey400,margin:"10px 0",lineHeight:1.5}}>{a.description}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{a.skills.map(sk=><span key={sk} style={{...S.tag,background:`${AXA.violet}12`,color:AXA.violet}}>{sk}</span>)}</div>
          <div style={S.flex}>
            <span style={{fontSize:10,color:AXA.grey400}}>Accuracy</span>
            <div style={{flex:1}}><Bar pct={a.accuracy} color={AXA.violet}/></div>
            <span style={{fontSize:10,fontWeight:700,color:AXA.violet}}>{a.accuracy}%</span>
          </div>
          <div style={{fontSize:10,color:AXA.grey600,marginTop:6}}>{a.tasksToday} tasks processed today</div>
        </div>
      ))}
    </div>
  </div>
</div>);

// ─── INTERVIEWS ──────────────────────────────────────────────────────
const InterviewsPage = ({persona}) => {
  const [interviews,setInterviews] = useState([
    {id:1,employee:EMPLOYEES[0],date:"2026-04-25",status:"Scheduled",step:0,answers:{},actionPlan:null},
    {id:2,employee:EMPLOYEES[1],date:"2026-04-22",status:"In Progress",step:2,answers:{1:"Move into a strategic / transversal role",2:"Take on a higher-responsibility role"},actionPlan:null},
    {id:3,employee:EMPLOYEES[2],date:"2026-04-10",status:"Completed",step:6,answers:{},actionPlan:{targetRole:"VP Product",completion:65,currentSkills:EMPLOYEES[2].skills,requiredSkills:["Strategic Thinking","Leadership","Financial Modeling"],gapAnalysis:[{skill:"Strategic Thinking",current:2,required:4,priority:"High"},{skill:"Financial Modeling",current:1,required:3,priority:"Medium"}],trainings:[{id:1,name:"Product Leadership",provider:"AXA University",duration:"10 weeks",status:"In progress",type:"Internal"},{id:2,name:"Executive Strategy",provider:"INSEAD",duration:"6 weeks",status:"Completed",type:"External"}],certifications:[{id:1,name:"Certified Product Manager",provider:"AIPMM",status:"Achieved",targetDate:"2026-03"},{id:2,name:"AI for Business",provider:"MIT",status:"Registered",targetDate:"2026-09"}],milestones:[{title:"Gap assessment",target:"2026-02",status:"Completed"},{title:"Training start",target:"2026-03",status:"Completed"},{title:"Mid-review",target:"2026-06",status:"In Progress"},{title:"Final eval",target:"2026-12",status:"Planned"}]}},
    {id:4,employee:EMPLOYEES[3],date:"2026-04-28",status:"Scheduled",step:0,answers:{},actionPlan:null},
    {id:5,employee:EMPLOYEES[4],date:"2026-04-18",status:"Action Plan Created",step:4,answers:{},actionPlan:{targetRole:"HR Director",completion:30,currentSkills:EMPLOYEES[4].skills,requiredSkills:["Strategic Thinking","Financial Modeling","Data Governance"],gapAnalysis:[{skill:"Strategic Thinking",current:2,required:4,priority:"High"},{skill:"Financial Modeling",current:0,required:3,priority:"High"},{skill:"Data Governance",current:1,required:3,priority:"Medium"}],trainings:[{id:1,name:"HR Strategy Masterclass",provider:"AXA University",duration:"12 weeks",status:"Not started",type:"Internal"},{id:2,name:"People Analytics",provider:"Coursera",duration:"8 weeks",status:"Not started",type:"External"},{id:3,name:"Finance for HR Leaders",provider:"AXA Academy",duration:"4 weeks",status:"Not started",type:"Internal"}],certifications:[{id:1,name:"SHRM-SCP",provider:"SHRM",status:"Planned",targetDate:"2026-12"},{id:2,name:"Change Management Pro",provider:"ACMP",status:"Planned",targetDate:"2027-03"}],milestones:[{title:"Gap assessment",target:"2026-05",status:"In Progress"},{title:"Start training",target:"2026-06",status:"Planned"},{title:"Mid-review",target:"2026-09",status:"Planned"},{title:"Certifications",target:"2027-03",status:"Planned"},{title:"Role transition",target:"2027-06",status:"Planned"}]}},
  ]);
  const [activeIV,setActiveIV]=useState(null);
  const [activePlan,setActivePlan]=useState(null);
  const [curQ,setCurQ]=useState(0);
  const [answers,setAnswers]=useState({});
  const [freeTexts,setFreeTexts]=useState({});
  const [multiAns,setMultiAns]=useState({});

  const startIV = iv => {setActiveIV(iv);setAnswers(iv.answers||{});setFreeTexts({});setMultiAns({});setCurQ(0);};
  const setAns = (qId,v) => setAnswers(p=>({...p,[qId]:v}));
  const togMulti = (qId,v) => setMultiAns(p=>{const c=p[qId]||[];return{...p,[qId]:c.includes(v)?c.filter(x=>x!==v):[...c,v]};});

  const saveProgress = () => {
    setInterviews(p=>p.map(i=>i.id===activeIV.id?{...i,status:"In Progress",step:2,answers:{...answers,...Object.fromEntries(Object.entries(multiAns).map(([k,v])=>[k,v.join(", ")])),...freeTexts}}:i));
  };

  const genPlan = (emp,ans) => {
    const asp = ans[1]||"Career Growth";
    const roles={"Grow as an expert in my current field":`Senior ${emp.role}`,"Move into a different functional area":"Cross-Functional Lead","Move into people management":`${emp.dept} Manager`,"Move into a strategic / transversal role":`${emp.dept} Director`,"Explore international or cross-entity opportunities":"International Operations Lead"};
    const target = roles[asp]||`Senior ${emp.role}`;
    const req = [...SKILLS_LIBRARY.slice(0,8).filter(s=>!emp.skills.includes(s)),"Strategic Thinking","Leadership"].slice(0,5);
    return {
      targetRole:target,aspiration:asp,currentSkills:emp.skills,requiredSkills:req,completion:15,
      gapAnalysis:req.map(s=>({skill:s,current:Math.floor(Math.random()*3),required:3+Math.floor(Math.random()*2),priority:["High","Medium","Low"][Math.floor(Math.random()*3)]})),
      trainings:[
        {id:1,name:"Advanced Leadership",provider:"AXA University",duration:"12 weeks",status:"Not started",type:"Internal"},
        {id:2,name:"AI for Business Leaders",provider:"MIT xPRO",duration:"8 weeks",status:"Not started",type:"External"},
        {id:3,name:"Strategic Decision Making",provider:"INSEAD Online",duration:"6 weeks",status:"Not started",type:"External"},
        {id:4,name:"Change Management Practitioner",provider:"AXA Academy",duration:"4 weeks",status:"Not started",type:"Internal"},
      ],
      certifications:[
        {id:1,name:"AWS Solutions Architect",provider:"AWS",status:"Planned",targetDate:"2026-09"},
        {id:2,name:"PMP Certification",provider:"PMI",status:"Planned",targetDate:"2026-12"},
        {id:3,name:"AI Ethics Certificate",provider:"AXA Academy",status:"Planned",targetDate:"2026-07"},
      ],
      milestones:[
        {title:"Complete gap assessment",target:"2026-05-15",status:"In Progress"},
        {title:"Start first training module",target:"2026-06-01",status:"Planned"},
        {title:"Mid-point review with manager",target:"2026-08-01",status:"Planned"},
        {title:"Complete certifications",target:"2026-12-31",status:"Planned"},
        {title:"Final evaluation & role transition",target:"2027-03-31",status:"Planned"},
      ],
    };
  };

  const completeIV = () => {
    const allAns = {...answers,...Object.fromEntries(Object.entries(multiAns).map(([k,v])=>[k,v.join(", ")])),...freeTexts};
    setInterviews(p=>p.map(i=>i.id===activeIV.id?{...i,status:"Action Plan Created",step:4,answers:allAns,actionPlan:genPlan(activeIV.employee,allAns)}:i));
    setActiveIV(null);
  };

  // ── ACTION PLAN VIEW ──
  if(activePlan) {
    const plan = activePlan.actionPlan;
    const emp = activePlan.employee;
    return (<div>
      <button style={{...S.btn,...S.btnOutline,...S.btnSm,marginBottom:16}} onClick={()=>setActivePlan(null)}>← Back to Interviews</button>
      <div style={S.between}>
        <div>
          <h2 style={{fontFamily:FONT_HEAD,fontSize:22,fontWeight:700,color:"#fff"}}>Action Plan: {emp.name}</h2>
          <p style={{fontSize:12,color:AXA.grey400,marginTop:3}}>Target: <strong style={{color:AXA.teal}}>{plan.targetRole}</strong></p>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:32,fontWeight:800,fontFamily:FONT_HEAD,color:AXA.teal}}>{plan.completion}%</div>
          <div style={{fontSize:10,color:AXA.grey400}}>Overall Progress</div>
        </div>
      </div>
      {/* AI Suggestion */}
      <div style={{...S.card,marginTop:14,background:`linear-gradient(135deg,${AXA.violet}12,${AXA.ocean}08)`,border:`1px solid ${AXA.violet}33`}}>
        <div style={S.flex}><span style={{fontSize:16}}>🤖</span><span style={{fontSize:12,fontWeight:700,color:AXA.violet}}>AI Recommendations — AXA-CareerPath Agent</span></div>
        <div style={{marginTop:8,fontSize:12,color:AXA.grey400,lineHeight:1.7}}>
          Based on {emp.name}'s profile and market trends, focus on <strong style={{color:"#fff"}}>Agentic AI</strong> and <strong style={{color:"#fff"}}>Strategic Thinking</strong> as priorities. The {plan.targetRole} role shows 34% YoY demand growth across AXA entities. Consider <strong style={{color:"#fff"}}>MIT AI Strategy</strong> certification.
        </div>
      </div>
      {/* Gap Analysis */}
      <div style={{...S.card,marginTop:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>🔬 Skill Gap Analysis</h3>
        <div style={S.grid2}>
          <div><div style={S.label}>Current Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{plan.currentSkills.map(s=><span key={s} style={S.tag}>{s}</span>)}</div></div>
          <div><div style={S.label}>Skills to Acquire</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{plan.requiredSkills.map(s=><span key={s} style={{...S.tag,background:`${AXA.red}12`,color:AXA.red}}>{s}</span>)}</div></div>
        </div>
        <div style={{marginTop:16}}>
          {plan.gapAnalysis.map((g,i)=>(
            <div key={i} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
              <span style={{fontSize:12,fontWeight:500,color:"#fff",width:150}}>{g.skill}</span>
              <div style={{flex:1,...S.flex}}><span style={{fontSize:10,color:AXA.grey400,width:45}}>Lv {g.current}</span><div style={{flex:1}}><Bar pct={(g.current/g.required)*100} color={g.current>=g.required?AXA.teal:AXA.warning}/></div><span style={{fontSize:10,color:AXA.grey400,width:50}}>→ Lv {g.required}</span></div>
              <Badge status={g.priority}/>
            </div>
          ))}
        </div>
      </div>
      {/* Training */}
      <div style={{...S.card,marginTop:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>📚 Training Phase</h3>
        {plan.trainings.map(t=>(
          <div key={t.id} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
            <span style={{fontSize:14}}>📖</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{t.name}</div><div style={{fontSize:10,color:AXA.grey400}}>{t.provider} · {t.duration} · {t.type}</div></div>
            <Badge status={t.status}/>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div style={{...S.card,marginTop:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>🏅 Certification Phase</h3>
        {plan.certifications.map(c=>(
          <div key={c.id} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
            <span style={{fontSize:14}}>🎓</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{c.name}</div><div style={{fontSize:10,color:AXA.grey400}}>{c.provider} · Target: {c.targetDate}</div></div>
            <Badge status={c.status}/>
          </div>
        ))}
      </div>
      {/* Milestones */}
      <div style={{...S.card,marginTop:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>📅 Execution Milestones</h3>
        {plan.milestones.map((m,i)=>(
          <div key={i} style={{...S.flex,padding:"10px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:m.status==="Completed"?AXA.teal:m.status==="In Progress"?`${AXA.teal}22`:`${AXA.grey600}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:m.status==="Completed"?"#fff":m.status==="In Progress"?AXA.teal:AXA.grey600,border:m.status==="In Progress"?`2px solid ${AXA.teal}`:"none"}}>{m.status==="Completed"?"✓":i+1}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:"#fff"}}>{m.title}</div><div style={{fontSize:10,color:AXA.grey400}}>Target: {m.target}</div></div>
            <Badge status={m.status}/>
          </div>
        ))}
      </div>
    </div>);
  }

  // ── INTERVIEW FORM ──
  if(activeIV) {
    const q = INTERVIEW_QUESTIONS[curQ];
    const show = !q.conditionOn || answers[q.conditionOn]===q.conditionValue;
    return (<div>
      <button style={{...S.btn,...S.btnOutline,...S.btnSm,marginBottom:16}} onClick={()=>setActiveIV(null)}>← Back</button>
      <div style={S.between}>
        <div>
          <h2 style={{fontFamily:FONT_HEAD,fontSize:22,fontWeight:700,color:"#fff"}}>Career Interview: {activeIV.employee.name}</h2>
          <p style={{fontSize:12,color:AXA.grey400,marginTop:3}}>{activeIV.employee.role} — {activeIV.employee.dept}</p>
        </div>
        <button style={{...S.btn,...S.btnOutline,...S.btnSm}} onClick={saveProgress}>💾 Save Progress</button>
      </div>
      <div style={{margin:"14px 0"}}><Bar pct={((curQ+1)/INTERVIEW_QUESTIONS.length)*100}/><div style={{fontSize:10,color:AXA.grey400,marginTop:4}}>Question {curQ+1} of {INTERVIEW_QUESTIONS.length}</div></div>
      <div style={{...S.flex,marginBottom:14}}>
        <span style={{...S.badge,background:`${AXA.blue}20`,color:AXA.bluePale}}>👤 Manager: You ({persona?.label})</span>
        <span style={{...S.badge,background:`${AXA.ocean}20`,color:AXA.ocean}}>👤 Employee: {activeIV.employee.name}</span>
      </div>
      {show ? (
        <div style={{...S.card,padding:24}}>
          <div style={{fontSize:11,color:AXA.teal,fontWeight:700,marginBottom:8,letterSpacing:1}}>Q{String(q.id)}</div>
          <h3 style={{fontSize:17,fontWeight:600,fontFamily:FONT_HEAD,color:"#fff",margin:"0 0 16px",lineHeight:1.4}}>{q.text}</h3>
          {q.note&&<div style={{fontSize:11,color:AXA.orangeWarm,marginBottom:12,fontStyle:"italic"}}>ℹ️ {q.note}</div>}
          {q.type==="single"&&q.options.map(opt=>(
            <div key={opt} onClick={()=>setAns(q.id,opt)} style={{padding:"11px 16px",margin:"6px 0",borderRadius:8,cursor:"pointer",border:`1px solid ${answers[q.id]===opt?AXA.teal:AXA.dark4}`,background:answers[q.id]===opt?`${AXA.teal}12`:"transparent",transition:"all .15s"}}>
              <div style={S.flex}>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${answers[q.id]===opt?AXA.teal:AXA.grey600}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {answers[q.id]===opt&&<div style={{width:8,height:8,borderRadius:"50%",background:AXA.teal}}/>}
                </div>
                <span style={{fontSize:13,color:answers[q.id]===opt?"#fff":AXA.grey400}}>{opt}</span>
              </div>
            </div>
          ))}
          {q.type==="multi"&&<MultiChips options={q.options} selected={multiAns[q.id]||[]} onToggle={v=>togMulti(q.id,v)} max={q.options.length}/>}
          {q.type==="text"&&<textarea style={{...S.input,minHeight:80,resize:"vertical"}} placeholder="Enter response..." value={freeTexts[q.id]||""} onChange={e=>setFreeTexts(p=>({...p,[q.id]:e.target.value}))}/>}
          {q.type!=="text"&&<div style={{marginTop:14}}><div style={{fontSize:11,color:AXA.grey400,marginBottom:4}}>Additional comments (optional)</div><textarea style={{...S.input,minHeight:50,resize:"vertical"}} placeholder="Free text notes..." value={freeTexts[`${q.id}_note`]||""} onChange={e=>setFreeTexts(p=>({...p,[`${q.id}_note`]:e.target.value}))}/></div>}
        </div>
      ):(
        <div style={{...S.card,padding:24,textAlign:"center",color:AXA.grey400}}><p>⏭️ This question is skipped based on your previous answer.</p></div>
      )}
      <div style={{...S.between,marginTop:16}}>
        <button style={{...S.btn,...S.btnOutline}} onClick={()=>setCurQ(p=>Math.max(0,p-1))} disabled={curQ===0}>← Previous</button>
        {curQ<INTERVIEW_QUESTIONS.length-1
          ? <button style={S.btn} onClick={()=>setCurQ(p=>Math.min(INTERVIEW_QUESTIONS.length-1,p+1))}>Next →</button>
          : <button style={{...S.btn,background:`linear-gradient(135deg,${AXA.teal},${AXA.tealDark})`}} onClick={completeIV}>✅ Complete & Generate Action Plan</button>
        }
      </div>
    </div>);
  }

  // ── LIST ──
  return (<div>
    <div style={S.between}>
      <div/>
      <button style={S.btn}>+ Schedule Interview</button>
    </div>
    <div style={{marginTop:18}}><Stepper steps={WORKFLOW_STEPS} current={2}/></div>
    <div style={{marginTop:14}}>
      {interviews.map(iv=>(
        <div key={iv.id} style={{...S.card,marginBottom:10}}>
          <div style={S.between}>
            <div style={S.flex}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${AXA.blue},${AXA.blueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{iv.employee.avatar}</div>
              <div><div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{iv.employee.name}</div><div style={{fontSize:11,color:AXA.grey400}}>{iv.employee.role} — {iv.employee.dept}</div></div>
            </div>
            <div style={S.flex}><span style={{fontSize:11,color:AXA.grey400}}>{iv.date}</span><Badge status={iv.status}/></div>
          </div>
          <div style={{margin:"10px 0",display:"flex",alignItems:"center",gap:2}}>
            {WORKFLOW_STEPS.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=iv.step?AXA.teal:`${AXA.grey600}33`}}/>)}
          </div>
          <div style={{fontSize:10,color:AXA.grey400}}>Step {iv.step+1}/{WORKFLOW_STEPS.length}: {WORKFLOW_STEPS[Math.min(iv.step,WORKFLOW_STEPS.length-1)]}</div>
          <div style={{...S.flex,marginTop:10}}>
            {iv.status==="Scheduled"&&<button style={{...S.btn,...S.btnSm}} onClick={()=>startIV(iv)}>▶ Start Interview</button>}
            {iv.status==="In Progress"&&<button style={{...S.btn,...S.btnSm}} onClick={()=>startIV(iv)}>↺ Resume Interview</button>}
            {iv.actionPlan&&<button style={{...S.btn,...S.btnSm,background:`linear-gradient(135deg,${AXA.violet},${AXA.ocean})`}} onClick={()=>setActivePlan(iv)}>📋 View Action Plan</button>}
            <button style={{...S.btn,...S.btnSm,...S.btnOutline}}>View History</button>
          </div>
        </div>
      ))}
    </div>
  </div>);
};

// ─── CAREER PATHS ────────────────────────────────────────────────────
const CareerPathsPage = () => {
  const allPaths = useMemo(()=>generateCareerPaths(),[]);
  const [df,setDf]=useState("All");const [tf,setTf]=useState("All");const [q,setQ]=useState("");const [exp,setExp]=useState(null);const [pg,setPg]=useState(0);
  const perPage=12;
  const filtered=allPaths.filter(p=>{
    if(df!=="All"&&p.domain!==df)return false;if(tf!=="All"&&p.type!==tf)return false;
    if(q&&!p.name.toLowerCase().includes(q.toLowerCase())&&!p.steps.some(s=>s.title.toLowerCase().includes(q.toLowerCase())))return false;return true;
  });
  const paged=filtered.slice(pg*perPage,(pg+1)*perPage);
  const totalPg=Math.ceil(filtered.length/perPage);
  return (<div>
    <div style={S.between}>
      <p style={{fontSize:12,color:AXA.grey400}}>{allPaths.length} AI-driven career paths across {CAREER_DOMAINS.length} domains</p>
      <span style={{...S.badge,background:`${AXA.violet}20`,color:AXA.violet}}>🤖 AI-Powered</span>
    </div>
    <div style={{...S.card,marginTop:14,padding:14}}>
      <div style={{...S.flex,gap:12}}>
        <input style={{...S.input,maxWidth:220}} placeholder="Search paths..." value={q} onChange={e=>{setQ(e.target.value);setPg(0);}}/>
        <select style={S.select} value={df} onChange={e=>{setDf(e.target.value);setPg(0);}}><option value="All">All Domains</option>{CAREER_DOMAINS.map(d=><option key={d}>{d}</option>)}</select>
        <select style={S.select} value={tf} onChange={e=>{setTf(e.target.value);setPg(0);}}><option value="All">All Types</option>{CAREER_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <span style={{fontSize:11,color:AXA.grey400,marginLeft:"auto"}}>{filtered.length} paths</span>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"10px 0"}}>
      {CAREER_DOMAINS.map(d=>{
        const cnt=allPaths.filter(p=>p.domain===d).length;
        return <span key={d} onClick={()=>{setDf(df===d?"All":d);setPg(0);}} style={{...S.badge,cursor:"pointer",background:df===d?`${AXA.teal}20`:`${AXA.grey600}12`,color:df===d?AXA.teal:AXA.grey400,border:`1px solid ${df===d?AXA.teal:"transparent"}`}}>{d} ({cnt})</span>;
      })}
    </div>
    <div style={S.grid3}>
      {paged.map(p=>(
        <div key={p.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setExp(exp===p.id?null:p.id)}>
          <div style={S.between}><span style={{...S.badge,background:`${AXA.teal}12`,color:AXA.teal}}>{p.domain}</span><span style={{...S.badge,background:`${AXA.violet}12`,color:AXA.violet}}>{p.type}</span></div>
          <h4 style={{fontSize:13,fontWeight:700,color:"#fff",margin:"10px 0 4px"}}>{p.name}</h4>
          <div style={{fontSize:10,color:AXA.grey400}}>{p.steps.length} career steps</div>
          <div style={{display:"flex",alignItems:"center",gap:2,margin:"10px 0"}}>
            {p.steps.map((_,i)=><div key={i} style={{flex:1,display:"flex",alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:AXA.teal,flexShrink:0}}/>{i<p.steps.length-1&&<div style={{flex:1,height:1,background:AXA.dark4}}/>}</div>)}
          </div>
          {exp===p.id&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${AXA.dark4}`}}>
            {p.steps.map((s,i)=>(
              <div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${AXA.dark4}`}}>
                <div style={S.flex}><span style={{width:20,height:20,borderRadius:"50%",background:`${AXA.teal}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:AXA.teal}}>{s.level}</span><span style={{fontSize:12,fontWeight:500,color:"#fff"}}>{s.title}</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4,paddingLeft:30}}>{s.skills.map(sk=><span key={sk} style={{...S.tag,fontSize:9}}>{sk}</span>)}</div>
              </div>
            ))}
          </div>}
        </div>
      ))}
    </div>
    <div style={{...S.flex,justifyContent:"center",marginTop:16,gap:8}}>
      <button style={{...S.btn,...S.btnSm,...S.btnOutline}} disabled={pg===0} onClick={()=>setPg(p=>p-1)}>← Prev</button>
      <span style={{fontSize:11,color:AXA.grey400}}>Page {pg+1} / {totalPg}</span>
      <button style={{...S.btn,...S.btnSm,...S.btnOutline}} disabled={pg>=totalPg-1} onClick={()=>setPg(p=>p+1)}>Next →</button>
    </div>
  </div>);
};

// ─── SKILLS ──────────────────────────────────────────────────────────
const SkillsPage = () => {
  const [q,setQ]=useState("");
  const cats={"Technical":["Python","JavaScript","React","SQL","Docker","Kubernetes","Terraform","CI/CD","API Design","Microservices"],"AI & Data":["Machine Learning","Deep Learning","NLP","Data Engineering","GenAI Applications","LLM Fine-tuning","RAG Architecture","MLOps","Prompt Engineering","Agentic AI"],"Cloud & Infra":["Azure","AWS","Cloud Architecture","DevOps","Cybersecurity"],"Business":["Project Management","Change Management","Stakeholder Management","Business Analysis","Product Management","Financial Modeling","Risk Analysis"],"Soft Skills":["Communication","Leadership","Strategic Thinking","Problem Solving","Negotiation","Presentation Skills"],"Compliance":["Data Privacy","GDPR Compliance","Data Governance","Insurance Domain"]};
  return (<div>
    <p style={{fontSize:12,color:AXA.grey400,marginBottom:14}}>{SKILLS_LIBRARY.length} standardized skills across the organization</p>
    <input style={{...S.input,maxWidth:350,marginBottom:14}} placeholder="Search skills..." value={q} onChange={e=>setQ(e.target.value)}/>
    {Object.entries(cats).map(([cat,skills])=>{
      const f=skills.filter(s=>SKILLS_LIBRARY.includes(s)&&(!q||s.toLowerCase().includes(q.toLowerCase())));
      if(!f.length)return null;
      return <div key={cat} style={S.card}>
        <h3 style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>{cat}</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{f.map(s=>(
          <div key={s} style={{background:AXA.dark1,border:`1px solid ${AXA.dark4}`,borderRadius:8,padding:"8px 14px",display:"inline-flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:"#fff"}}>{s}</span>
            <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(l=><div key={l} style={{width:6,height:6,borderRadius:2,background:l<=3?AXA.teal:`${AXA.grey600}33`}}/>)}</div>
          </div>
        ))}</div>
      </div>;
    })}
  </div>);
};

// ─── WORKFLOWS ───────────────────────────────────────────────────────
const WorkflowsPage = () => {
  const wfs=[
    {id:1,name:"Career Interview — Sophie Laurent",type:"Career Interview",step:4,total:7,status:"In Progress",started:"2026-04-10",history:["Scheduled (Apr 10)","Interview Started (Apr 12)","Interview In Progress (Apr 12)","Interview Completed (Apr 15)","Action Plan In Progress..."]},
    {id:2,name:"Onboarding — New AI Agent",type:"Agent Deployment",step:3,total:5,status:"In Progress",started:"2026-04-08",history:["Configuration (Apr 8)","Training Data Upload (Apr 9)","Model Training (Apr 10)","Validation In Progress..."]},
    {id:3,name:"Career Interview — Marc Dubois",type:"Career Interview",step:2,total:7,status:"In Progress",started:"2026-04-15",history:["Scheduled (Apr 15)","Interview Started (Apr 18)","Answering Questions..."]},
    {id:4,name:"Skill Assessment — Q2 Batch",type:"Assessment",step:5,total:5,status:"Completed",started:"2026-03-20",history:["Initiated (Mar 20)","Self-Assessment (Mar 25)","Manager Review (Apr 1)","Calibration (Apr 5)","Completed (Apr 8)"]},
  ];
  const [exp,setExp]=useState(null);
  return (<div>
    {wfs.map(wf=>(
      <div key={wf.id} style={S.card}>
        <div style={S.between}>
          <div><h4 style={{fontSize:14,fontWeight:700,color:"#fff",margin:0}}>{wf.name}</h4><div style={{...S.flex,marginTop:4}}><span style={{...S.badge,background:`${AXA.ocean}20`,color:AXA.ocean}}>{wf.type}</span><span style={{fontSize:10,color:AXA.grey400}}>Started: {wf.started}</span></div></div>
          <div style={S.flex}><Badge status={wf.status}/>{wf.status==="In Progress"&&<button style={{...S.btn,...S.btnSm}}>↺ Resume</button>}</div>
        </div>
        <div style={{margin:"12px 0"}}><div style={S.between}><span style={{fontSize:10,color:AXA.grey400}}>Step {wf.step}/{wf.total}</span><span style={{fontSize:10,fontWeight:700,color:AXA.teal}}>{Math.round((wf.step/wf.total)*100)}%</span></div><Bar pct={(wf.step/wf.total)*100}/></div>
        <div style={{cursor:"pointer",fontSize:11,color:AXA.teal,fontWeight:500}} onClick={()=>setExp(exp===wf.id?null:wf.id)}>{exp===wf.id?"▼ Hide":"▶ Show"} Execution History</div>
        {exp===wf.id&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${AXA.dark4}`}}>
          {wf.history.map((h,i)=><div key={i} style={{...S.flex,padding:"5px 0"}}><div style={{width:8,height:8,borderRadius:"50%",background:i<wf.step?AXA.teal:i===wf.step?AXA.warning:AXA.grey600,flexShrink:0}}/><span style={{fontSize:11,color:i<wf.step?"#fff":AXA.grey400}}>{h}</span>{i<wf.step&&<span style={{color:AXA.teal,fontSize:10}}>✓</span>}</div>)}
        </div>}
      </div>
    ))}
  </div>);
};

// ─── REPORTS ─────────────────────────────────────────────────────────
const ReportsPage = () => (<div>
  <div style={S.grid4}>
    {[
      {label:"Internal Mobility Rate",value:"23%",target:"30%",pct:77,color:AXA.teal},
      {label:"Avg Time to Fill",value:"18 days",target:"<30d",pct:90,color:AXA.success},
      {label:"Skills Coverage",value:"72%",target:"85%",pct:85,color:AXA.ocean},
      {label:"Active Action Plans",value:"42",target:"60",pct:70,color:AXA.violet},
    ].map(m=>(
      <div key={m.label} style={S.card}>
        <div style={{fontSize:10,color:AXA.grey400,textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>{m.label}</div>
        <div style={{fontSize:26,fontWeight:800,fontFamily:FONT_HEAD,color:m.color,margin:"6px 0"}}>{m.value}</div>
        <div style={{fontSize:10,color:AXA.grey400,marginBottom:6}}>Target: {m.target}</div>
        <Bar pct={m.pct} color={m.color}/>
      </div>
    ))}
  </div>
  <div style={S.grid2}>
    <div style={S.card}>
      <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>Mobility by Domain</h3>
      {CAREER_DOMAINS.slice(0,6).map((d,i)=>(
        <div key={d} style={{...S.flex,marginBottom:8}}><span style={{fontSize:11,width:130,color:AXA.grey400}}>{d}</span><div style={{flex:1}}><Bar pct={[65,82,45,58,73,91][i]} color={[AXA.teal,AXA.success,AXA.warning,AXA.ocean,AXA.violet,AXA.teal][i]}/></div><span style={{fontSize:11,fontWeight:600,color:"#fff",width:30,textAlign:"right"}}>{[65,82,45,58,73,91][i]}%</span></div>
      ))}
    </div>
    <div style={S.card}>
      <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>AI Agent Performance</h3>
      {AI_AGENTS.map(a=>(
        <div key={a.id} style={{...S.flex,marginBottom:8}}><span style={{fontSize:12}}>🤖</span><span style={{fontSize:11,color:"#fff",width:110}}>{a.name}</span><div style={{flex:1}}><Bar pct={a.accuracy} color={AXA.violet}/></div><span style={{fontSize:11,fontWeight:700,color:AXA.violet,width:35,textAlign:"right"}}>{a.accuracy}%</span></div>
      ))}
    </div>
  </div>
  <div style={S.card}>
    <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:14}}>Training & Certification Pipeline</h3>
    <div style={S.grid3}>
      {[{l:"Trainings In Progress",v:67,e:"📚",c:AXA.ocean},{l:"Certifications Achieved",v:23,e:"🏅",c:AXA.teal},{l:"Action Plans Completed",v:31,e:"🎯",c:AXA.violet}].map(s=>(
        <div key={s.l} style={{textAlign:"center",padding:16}}><span style={{fontSize:28}}>{s.e}</span><div style={{fontSize:30,fontWeight:800,fontFamily:FONT_HEAD,marginTop:6,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:AXA.grey400,marginTop:4}}>{s.l}</div></div>
      ))}
    </div>
  </div>
</div>);

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [authed,setAuthed] = useState(false);
  const [persona,setPersona] = useState(null);
  const [activePage,setActivePage] = useState("dashboard");

  const handleLogin = (p) => { setPersona(p); setAuthed(true); };
  const handleLogout = () => { setAuthed(false); setPersona(null); setActivePage("dashboard"); };

  if(!authed) return <LoginScreen onLogin={handleLogin}/>;

  const pages = {
    dashboard: <DashboardPage setActive={setActivePage} persona={persona}/>,
    charter: <CharterPage/>,
    marketplace: <MarketplacePage/>,
    team: <TeamPage/>,
    interviews: <InterviewsPage persona={persona}/>,
    careers: <CareerPathsPage/>,
    skills: <SkillsPage/>,
    workflows: <WorkflowsPage/>,
    reports: <ReportsPage/>,
  };

  return (
    <div style={{fontFamily:FONT,background:AXA.dark1,color:"#fff",minHeight:"100vh",display:"flex",overflow:"hidden",height:"100vh",fontSize:13}}>
      <style>{cssReset}</style>
      <Sidebar active={activePage} setActive={setActivePage} persona={persona} onLogout={handleLogout}/>
      <div style={{flex:1,overflow:"auto",padding:"0 28px 28px"}}>
        <TopBar persona={persona} page={activePage}/>
        {pages[activePage]}
      </div>
    </div>
  );
}
