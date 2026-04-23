import { useState, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SMART MOBILITY v7.1 — AXA Group Operations
   
   MAJOR RELEASE: Full spec alignment
   ✓ Gap ≠ Plan (distinct modules with distinct workflows)
   ✓ All Save/Finalize buttons wired and persistent
   ✓ Express Interest flow → appears in Manager Marketplace
   ✓ View Career Path → navigates to Careers module
   ✓ AI Agents Management (create, configure, assign tasks)
   ✓ Data Referentials (unified Skills/Paths/Jobs/ATS)
   ✓ Action Plan linked to ATS job descriptions
   ✓ Skills Gap linked to learning/cert/mentoring
   ✓ Persistent state via localStorage (survives refresh)
   ✓ All hooks at top level (no blank pages)
   ═══════════════════════════════════════════════════════════════ */

const T={axaBlue:"#00008F",axaNavy:"#000062",axaMid:"#3032C1",axaRed:"#FF1721",bg:"#F4F4F0",bgSoft:"#ECEEE8",bgCard:"#FFFFFF",bgMuted:"#F8F8F5",border:"#DDD9D0",ink:"#1B1B18",inkSec:"#555550",inkMuted:"#8A8A80",inkDim:"#B5B5AA",teal:"#0C8C6E",tealBg:"#E8F5F0",red:"#CC2200",redBg:"#FFF0EC",orange:"#CC7A00",orangeBg:"#FFF5E6",violet:"#5B47C0",violetBg:"#F0EDFF",ocean:"#0070A8",oceanBg:"#EAF5FA",green:"#0C8C6E"};
const FT="'DM Sans',-apple-system,sans-serif";const FH="'Newsreader',Georgia,serif";
const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&display=swap');*{margin:0;padding:0;box-sizing:border-box}button{cursor:pointer;font-family:${FT}}input,select,textarea{font-family:${FT}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${T.bgSoft}}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes popIn{0%{transform:scale(.96);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`;
const S={card:{background:T.bgCard,borderRadius:10,border:`1px solid ${T.border}`,padding:18,marginBottom:12,animation:"fadeUp .3s ease",boxShadow:"0 1px 3px rgba(0,0,0,.03)"},btn:{background:T.axaBlue,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontWeight:600,fontSize:12,display:"inline-flex",alignItems:"center",gap:5,transition:"all .15s"},btnSm:{padding:"5px 12px",fontSize:11},btnO:{background:"transparent",border:`1.5px solid ${T.axaBlue}`,color:T.axaBlue},btnG:{background:`linear-gradient(135deg,${T.teal},${T.ocean})`},badge:{display:"inline-block",padding:"2px 9px",borderRadius:16,fontSize:10,fontWeight:600},input:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,width:"100%",outline:"none",boxSizing:"border-box"},select:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,outline:"none"},label:{fontSize:10,color:T.inkMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5,display:"block"},tag:{background:T.tealBg,color:T.teal,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,display:"inline-block"},flex:{display:"flex",alignItems:"center",gap:8},between:{display:"flex",justifyContent:"space-between",alignItems:"center"},g2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},g3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12},g4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10},h1:{fontFamily:FH,fontSize:24,fontWeight:700,color:T.ink},h3:{fontSize:14,fontWeight:700,color:T.ink}};

const Bd=({status,custom})=>{const m={active:T.teal,training:T.orange,idle:T.inkMuted,completed:T.teal,"in progress":T.ocean,"not started":T.inkDim,planned:T.violet,registered:T.orange,achieved:T.teal,Senior:T.teal,Mid:T.ocean,Junior:T.orange,Lead:T.violet,High:T.red,Medium:T.orange,Low:T.inkMuted,Validated:T.teal,Finalized:T.teal,Draft:T.inkMuted,Locked:T.violet,Interested:T.orange,Matched:T.teal};const c=custom||m[status]||m[status?.toLowerCase()]||T.inkMuted;return<span style={{...S.badge,background:`${c}14`,color:c,border:`1px solid ${c}20`}}>{status}</span>;};
const Bar=({pct,color=T.teal,h=5})=>(<div style={{height:h,borderRadius:h,background:T.bgSoft,width:"100%",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h,transition:"width .5s"}}/></div>);
const Chips=({options,selected,onToggle,max=20})=>(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{options.slice(0,max).map(o=>(<span key={o} onClick={()=>onToggle(o)} style={{...S.badge,cursor:"pointer",background:selected.includes(o)?T.tealBg:T.bgSoft,color:selected.includes(o)?T.teal:T.inkMuted,border:`1px solid ${selected.includes(o)?T.teal:"transparent"}`}}>{o}</span>))}</div>);
const Toast=({msg,color=T.teal})=>msg?<div style={{position:"fixed",bottom:20,right:20,background:color,color:"#fff",padding:"10px 18px",borderRadius:8,fontSize:12,fontWeight:600,boxShadow:"0 4px 12px rgba(0,0,0,.2)",zIndex:9999,animation:"fadeUp .3s ease"}}>{msg}</div>:null;

// ══════════════════════════════════════════════════════════════
// DATA REFERENTIALS — Skills, Paths, Jobs, AI Agents
// ══════════════════════════════════════════════════════════════

const SKILLS=["Python","JavaScript","React","TypeScript","Azure","AWS","Machine Learning","Deep Learning","NLP","Data Engineering","SQL","Power BI","Tableau","Agile","Scrum","DevOps","CI/CD","Kubernetes","Docker","Terraform","Project Management","Change Management","Stakeholder Management","Risk Analysis","Financial Modeling","UX Design","API Design","Microservices","Cloud Architecture","Cybersecurity","Data Privacy","GDPR","Communication","Leadership","Strategic Thinking","Problem Solving","Prompt Engineering","Agentic AI","RPA","Process Automation","Business Analysis","Product Management","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Data Governance","Insurance Domain","Negotiation","Presentation Skills"];
const SKILL_CATS={"Technical":["Python","JavaScript","React","TypeScript","SQL","Docker","Kubernetes","Terraform","CI/CD","API Design"],"AI & Data":["Machine Learning","Deep Learning","NLP","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Prompt Engineering","Agentic AI"],"Cloud":["Azure","AWS","Cloud Architecture","DevOps","Cybersecurity"],"Business":["Project Management","Change Management","Stakeholder Management","Business Analysis","Product Management","Financial Modeling","Risk Analysis"],"Soft Skills":["Communication","Leadership","Strategic Thinking","Problem Solving","Negotiation","Presentation Skills"],"Compliance":["Data Privacy","GDPR","Data Governance","Insurance Domain"]};

// Learning resources mapped to skills
const LEARNING={
  "Python":{train:"Python Mastery Bootcamp (AXA Univ, 8w)",cert:"PCEP Certified Entry-Level",mentor:"Yuki Tanaka"},
  "Machine Learning":{train:"ML Foundations (Coursera, 10w)",cert:"AWS ML Specialty",mentor:"Sophie Laurent"},
  "Leadership":{train:"Leading with Impact (INSEAD, 6w)",cert:"IEP Leadership",mentor:"Karim Hassan"},
  "Strategic Thinking":{train:"Strategic Leadership (IMD, 4w)",cert:"Strategy Certification",mentor:"Amina Benali"},
  "Cloud Architecture":{train:"Azure Architect Path (MS Learn)",cert:"Azure Solutions Architect Expert",mentor:"Karim Hassan"},
  "Agentic AI":{train:"Agentic AI Systems (MIT, 8w)",cert:"LangChain Expert",mentor:"Yuki Tanaka"},
  "Change Management":{train:"Prosci ADKAR (AXA Univ)",cert:"Prosci Change Management",mentor:"Elena Rossi"},
  "Data Governance":{train:"DG Fundamentals (DAMA)",cert:"CDMP",mentor:"Nadia Kowalski"},
  "Financial Modeling":{train:"Financial Modeling (Wall Street Prep)",cert:"CFA L1",mentor:"Thomas Moreau"},
};
const getLearning=sk=>LEARNING[sk]||{train:`${sk} Fundamentals (AXA Univ)`,cert:`${sk} Certification`,mentor:"TBD"};

const PERSONAS=[{id:"admin",label:"Admin",desc:"Full platform access + AI management",color:T.axaBlue,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents","reports"],role:"admin"},{id:"hr",label:"Hr",desc:"Workforce + analytics + interviews",color:T.teal,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents","reports"],role:"hr"},{id:"manager",label:"Manager",desc:"Team management + marketplace",color:T.ocean,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents"],role:"manager"},{id:"employee",label:"Employee",desc:"My career, skills & opportunities",color:T.violet,access:["dashboard","charter","marketplace","careers","refs"],role:"employee"}];

const EMP=[{id:1,name:"Sophie Laurent",role:"Data Scientist",dept:"Data & AI",skills:["Python","Machine Learning","SQL","Deep Learning","NLP"],level:"Senior",avatar:"SL",aiLvl:"Advanced",yrs:7,mobility:true,intent:"AI leadership",perf:[{yr:"2025",score:4.5,note:"Exceeds"},{yr:"2024",score:4.2,note:"Strong"}],teams:["DS Core","AI Lab"],bg:"MSc Polytechnique. 7y data."},{id:2,name:"Marc Dubois",role:"DevOps Engineer",dept:"Technology",skills:["Kubernetes","Docker","CI/CD","Terraform","Azure"],level:"Mid",avatar:"MD",aiLvl:"Autonomous",yrs:4,mobility:true,intent:"Cloud Architecture",perf:[{yr:"2025",score:3.8,note:"Meets"}],teams:["Platform Eng"],bg:"BEng INSA Lyon."},{id:3,name:"Amina Benali",role:"Product Manager",dept:"Product",skills:["Product Management","Agile","UX Design","Stakeholder Management"],level:"Senior",avatar:"AB",aiLvl:"Guided",yrs:9,mobility:true,intent:"VP Product",perf:[{yr:"2025",score:4.7,note:"Outstanding"}],teams:["Digital Products"],bg:"MBA HEC."},{id:4,name:"Thomas Moreau",role:"Financial Analyst",dept:"Finance",skills:["Financial Modeling","Power BI","SQL","Risk Analysis"],level:"Junior",avatar:"TM",aiLvl:"Basic",yrs:2,mobility:false,intent:"",perf:[{yr:"2025",score:3.5,note:"Meets"}],teams:["Group Finance"],bg:"MSc Dauphine."},{id:5,name:"Elena Rossi",role:"HR Business Partner",dept:"HR & Talent",skills:["Change Management","Stakeholder Management","Communication","Leadership"],level:"Mid",avatar:"ER",aiLvl:"Guided",yrs:6,mobility:true,intent:"HR Director",perf:[{yr:"2025",score:4.1,note:"Strong"}],teams:["HR Ops"],bg:"MA Bocconi."},{id:6,name:"Karim Hassan",role:"Cloud Architect",dept:"Technology",skills:["Azure","AWS","Cloud Architecture","Microservices","Cybersecurity","Kubernetes"],level:"Lead",avatar:"KH",aiLvl:"Expert",yrs:11,mobility:true,intent:"CTO track",perf:[{yr:"2025",score:4.8,note:"Exceptional"}],teams:["Cloud CoE"],bg:"MEng Imperial."},{id:7,name:"Claire Martin",role:"UX Designer",dept:"Product",skills:["UX Design","Communication","Problem Solving"],level:"Senior",avatar:"CM",aiLvl:"Autonomous",yrs:5,mobility:false,intent:"",perf:[{yr:"2025",score:4.0,note:"Creative"}],teams:["Design"],bg:"BFA Parsons."},{id:8,name:"Yuki Tanaka",role:"ML Engineer",dept:"Data & AI",skills:["Python","Deep Learning","MLOps","LLM Fine-tuning","RAG Architecture","GenAI"],level:"Senior",avatar:"YT",aiLvl:"Expert",yrs:6,mobility:true,intent:"AI Director",perf:[{yr:"2025",score:4.6,note:"Pioneer"}],teams:["AI Platform"],bg:"PhD Tokyo."},{id:9,name:"Lucas Ferreira",role:"Scrum Master",dept:"Technology",skills:["Agile","Scrum","Communication"],level:"Mid",avatar:"LF",aiLvl:"Basic",yrs:3,mobility:true,intent:"Agile Coach",perf:[{yr:"2025",score:3.9,note:"Good"}],teams:["Delivery"],bg:"BSc Lisboa."},{id:10,name:"Nadia Kowalski",role:"Compliance Officer",dept:"Risk",skills:["GDPR","Data Privacy","Risk Analysis","Data Governance"],level:"Senior",avatar:"NK",aiLvl:"Guided",yrs:8,mobility:false,intent:"",perf:[{yr:"2025",score:4.2,note:"Expert"}],teams:["Compliance"],bg:"LLM Jagiellonian."}];

// ATS Jobs with tasks/milestones/deliverables for Action Plan
const JOBS=[
  {id:"J1",title:"Senior ML Engineer",entity:"AXA France",country:"France",city:"Paris",dept:"Data & AI",level:"Senior",type:"Hybrid",skills:["Python","Machine Learning","MLOps","Deep Learning"],desc:"Lead ML model development and deployment. Design scalable pipelines, mentor junior engineers.",urgency:"High",posted:"2026-04-01",tasks:["Build ML pipeline prototype","Mentor 2 junior engineers","Deploy model to production","Document best practices"],milestones:["30-day onboarding","60-day: first model shipped","90-day: team ramp-up","6-month: production ownership"],deliverables:["ML pipeline architecture doc","Runbook for deployments","Training dataset curation","Monthly model review"]},
  {id:"J2",title:"Cloud Solutions Architect",entity:"AXA Group Ops",country:"UK",city:"London",dept:"Technology",level:"Lead",type:"Remote",skills:["Azure","Cloud Architecture","Microservices","Kubernetes"],desc:"Design and govern cloud architecture across AXA entities.",urgency:"High",posted:"2026-03-28",tasks:["Architecture review board","Migration roadmap","Standards definition","Cross-entity governance"],milestones:["30-day: assessment","90-day: roadmap approved","6-month: first migration live","12-month: 3 entities migrated"],deliverables:["Architecture standards doc","Migration playbook","Cost model","Quarterly architecture review"]},
  {id:"J3",title:"Product Owner — AI Platform",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"Product",level:"Senior",type:"On-site",skills:["Product Management","Agile","GenAI","Stakeholder Management"],desc:"Own the AI platform product roadmap.",urgency:"Medium",posted:"2026-04-05",tasks:["Roadmap quarterly","Backlog grooming","KPI dashboards","Stakeholder reviews"],milestones:["30-day: stakeholder map","60-day: Q3 roadmap","90-day: first release"],deliverables:["Product vision doc","OKR framework","Backlog (50+ items)","Monthly release notes"]},
  {id:"J4",title:"Data Governance Manager",entity:"AXA Belgium",country:"Belgium",city:"Brussels",dept:"Data & AI",level:"Mid",type:"Hybrid",skills:["Data Governance","GDPR","SQL","Data Privacy"],desc:"Establish data governance policies.",urgency:"Low",posted:"2026-04-10",tasks:["Policy drafting","Data quality programs","GDPR audit","Training rollout"],milestones:["30-day: baseline assessment","90-day: policies signed","6-month: audit passed"],deliverables:["DG policy book","Data quality KPIs","GDPR compliance report","Training curriculum"]},
  {id:"J5",title:"Change Management Lead",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"HR & Talent",level:"Lead",type:"Hybrid",skills:["Change Management","Communication","Leadership","Stakeholder Management"],desc:"Lead change programs for digital transformation.",urgency:"High",posted:"2026-03-15",tasks:["Change impact assessment","Champion network","Communication plan","Adoption tracking"],milestones:["30-day: assessment","60-day: champions trained","90-day: first wave launched"],deliverables:["Change strategy doc","Communications playbook","KPI dashboard","Lessons-learned report"]},
  {id:"J6",title:"Agentic AI Developer",entity:"AXA Group Ops",country:"Remote",city:"Remote",dept:"Data & AI",level:"Senior",type:"Remote",skills:["Agentic AI","Python","LLM Fine-tuning","RAG Architecture"],desc:"Build autonomous AI agents.",urgency:"High",posted:"2026-04-12",tasks:["Agent architecture design","Tool integration","Safety guardrails","Production deployment"],milestones:["30-day: POC","60-day: pilot agent","90-day: production agent"],deliverables:["Agent framework","Safety review","Documentation","Monitoring dashboard"]},
  {id:"J7",title:"DevSecOps Engineer",entity:"AXA Germany",country:"Germany",city:"Cologne",dept:"Technology",level:"Mid",type:"On-site",skills:["DevOps","CI/CD","Cybersecurity","Docker"],desc:"Embed security into CI/CD pipelines.",urgency:"Medium",posted:"2026-04-08",tasks:["Pipeline security scans","Zero-trust patterns","Container security","Incident response"],milestones:["30-day: scan coverage","90-day: zero-trust MVP","6-month: full rollout"],deliverables:["Security playbook","Scan reports","Architecture doc","Monthly security review"]},
  {id:"J8",title:"HR Strategy Director",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"HR & Talent",level:"Lead",type:"Hybrid",skills:["Strategic Thinking","Leadership","Change Management","Communication"],desc:"Define and execute HR strategy.",urgency:"High",posted:"2026-03-20",tasks:["Strategy definition","Workforce plan","Talent development","Org design"],milestones:["30-day: diagnosis","90-day: strategy approved","12-month: execution in flight"],deliverables:["HR strategy deck","Workforce plan","Talent roadmap","Quarterly business review"]},
];

const DOMAINS=["Technology","Data & AI","Operations","Finance","HR & Talent","Risk & Compliance","Product","Strategy"];
const WF=["Scheduled","Interview","Gap Analysis","Action Plan","Training","Assessment","Completed"];

const genPaths=()=>{const tpl=[{d:"Technology",p:["Junior Dev → Senior Dev → Tech Lead → Staff Engineer → Principal Architect","Support Analyst → Platform Engineer → SRE Lead → VP Infra","QA Engineer → QA Lead → Test Architect → Quality Dir","Frontend → UI Engineer → Design Lead","Backend → API Architect → Platform Lead → CTO","Security → Security Engineer → CISO","DevOps → Platform Lead → Cloud Dir","Network → Network Architect → Infra VP","IT Support → SysAdmin → IT Manager → IT Dir","Release Mgr → Eng Manager → VP Eng","Integration → ESB Architect → Enterprise Architect","Mobile → Mobile Lead → Cross-Platform Architect","DBA → Data Platform Lead → CDO"]},{d:"Data & AI",p:["Data Analyst → Sr Analyst → Analytics Mgr → Head Analytics","ML Engineer → Sr ML → ML Lead → AI Director","Data Scientist → Lead Scientist → Chief DS","BI Analyst → BI Dev → BI Mgr → Analytics VP","AI Researcher → Applied AI Lead → AI Strategy Dir","NLP Engineer → Conv AI Lead → AI Product Dir","MLOps → ML Platform Lead → AI Infra Dir","Prompt Eng → AI Solutions Arch → GenAI Dir","Data Gov → DG Manager → CDO","AI Ethics → Responsible AI Lead → Policy Dir","Statistician → Lead Statistician → Quant Dir","CV Engineer → CV Lead → Applied AI VP","Knowledge Eng → Ontology Lead → KG Dir"]},{d:"Operations",p:["Ops Analyst → Ops Mgr → Head Ops → COO","Process Analyst → Process Lead → Excellence Dir","Service Desk → Service Mgr → IT Service Dir","Claims → Claims Lead → Claims Ops Dir","Underwriting → Underwriter → Chief UW","Supply Chain → SC Mgr → VP SC","Quality → Quality Mgr → VP Quality","Logistics → Logistics Mgr → VP Logistics","Facilities → Facilities Mgr → VP RE","BPO → BPO Mgr → Outsourcing Dir","Procurement → Procurement Mgr → CPO","Vendor Mgr → Sourcing Lead → VP Procurement","Ops Research → OR Lead → Decision Science Dir"]},{d:"Finance",p:["FA → Sr FA → Finance Mgr → CFO","Accountant → Sr Accountant → Controller → VP Finance","Actuary → Sr Actuary → Chief Actuary","Auditor → Audit Mgr → Chief Audit","Tax → Tax Mgr → VP Tax","Treasury → Treasury Mgr → VP Treasury","FP&A → FP&A Mgr → VP Planning","Investment → Portfolio Mgr → CIO","Compliance → Compliance Mgr → CCO","Revenue → Revenue Mgr → VP Revenue","Cost → Cost Mgr → VP Cost","Billing → Billing Mgr → Revenue Dir","Credit → Credit Mgr → CCrO"]},{d:"HR & Talent",p:["HR Coord → HRBP → HR Mgr → HR Dir → CHRO","Recruiter → Sr Recruiter → TA Lead → VP TA","L&D → L&D Mgr → CLO","C&B → C&B Mgr → Rewards Dir","HRIS → HRIS Mgr → HR Tech Dir","ER → ER Mgr → VP EX","WFP → WFP Mgr → VP Strategy","DE&I → DE&I Mgr → CDO","TM → TM Lead → VP Talent","OD → OD Mgr → VP OD","Career Coach → Career Lead → VP Mobility","Change Mgr → Change Lead → VP Transformation","People Analytics → PA Mgr → VP Insights"]},{d:"Risk & Compliance",p:["Risk → Risk Mgr → CRO","Compliance → Sr Compliance → VP Compliance","Fraud → Fraud Mgr → VP Fraud","AML → AML Mgr → VP FinCrime","Regulatory → Reg Mgr → VP Reg","InfoSec → CISO","Privacy → DPO","OpRisk → OpRisk Mgr → VP OpRisk","Market Risk → Lead → VP Market Risk","Credit Risk → Mgr → VP Credit Risk","Model Risk → Validation → VP Model Risk","BC → BC Mgr → VP Resilience","TPR → TPRM Lead → VP Vendor Risk"]},{d:"Product",p:["Product Analyst → PM → Sr PM → VP Product","UX Research → UX Lead → Head Design","Product Design → Design Lead → CDO","Growth → Growth Mgr → VP Growth","PO → Sr PO → Head Product","Tech Writer → Doc Lead → VP Content","PMM → PMM Lead → VP PMM","CS → CS Mgr → VP CS","Solutions → Solutions Dir → VP Solutions","ProdOps → ProdOps Lead → VP ProdOps","API PM → Platform PM → VP Platform","Digital → Digital Lead → CDO","Innovation → Innovation Lead → VP Innovation"]},{d:"Strategy",p:["Strategy → Strategy Mgr → VP Strategy → CSO","M&A → M&A Mgr → VP Corp Dev","BD → BD Mgr → VP BD","Research → Insights → VP Intel","Partners → Lead → VP Alliances","Transformation → VP Transform → CTO","Planning → Dir → VP Strategy","CI → CI Mgr → VP Intel","Digital Strategy → DT Lead → CDO","ESG → ESG Mgr → CSO","Innovation → Dir → VP Innovation","Portfolio → Dir → VP Portfolio","Ventures → Lead → VP New Business"]}];let id=1;const paths=[];tpl.forEach(g=>g.p.forEach((p,i)=>{const steps=p.split(" → ");paths.push({id:id++,domain:g.d,type:["Expert","Management","Hybrid"][i%3],name:steps[steps.length-1],steps:steps.map((s,si)=>({title:s,level:si+1,skills:SKILLS.slice((id+si*3)%30,(id+si*3)%30+3)}))});}));return paths;};
const getJobSugg=(emp,paths)=>{const w=emp.role.toLowerCase().split(/\s+/);const dp=paths.filter(p=>{const dm=emp.dept.toLowerCase().includes(p.domain.toLowerCase().split(" ")[0]);const rm=p.steps.some(s=>w.some(x=>x.length>2&&s.title.toLowerCase().includes(x)));return dm||rm;});const r=new Set();dp.forEach(p=>{let f=false;p.steps.forEach(s=>{if(f&&r.size<15)r.add(s.title);if(w.some(x=>x.length>2&&s.title.toLowerCase().includes(x)))f=true;});if(r.size<15)r.add(p.steps[p.steps.length-1].title);});if(r.size<5)dp.slice(0,5).forEach(p=>p.steps.slice(-2).forEach(s=>r.add(s.title)));return[...r].slice(0,12);};

const IQ=[{id:1,q:"Long-term career aspirations?",t:"s",o:["Expert in current field","Different functional area","People management","Strategic / transversal","International","Not sure"]},{id:2,q:"Short-medium term? (3-5y)",t:"s",o:["Progress current role","Different role same level","Higher responsibility","Short-term missions"]},{id:3,q:"Target role aligned with AXA?",t:"job",o:[],note:"Select from career paths or enter custom"},{id:4,q:"Current skills?",t:"m",o:SKILLS.slice(0,20)},{id:5,q:"AI skills level?",t:"s",o:["None","Basic","Guided","Autonomous","Expert"]},{id:6,q:"Skills to develop?",t:"m",o:SKILLS.slice(8,28)},{id:7,q:"Job change short term?",t:"s",o:["Yes","No"],cond:true},{id:"7a",q:"Reasons not to explore?",t:"s",o:["Comfortable","Gaps first","No opportunities"],on:7,val:"No"},{id:8,q:"When open?",t:"s",o:["6mo","6-12mo","1-2y","2+y","Don't foresee"]},{id:9,q:"Geographic mobility?",t:"s",o:["International","Within country","Remote","No"]},{id:10,q:"Training needed?",t:"m",o:["Formal","On-the-job","Mentoring","Mission","Certification","None"]},{id:11,q:"Opportunities?",t:"x",o:[]}];

const CHARTER=[{title:"Ecosystem",icon:"🌐",items:[{t:"Today → Tomorrow",c:"Human-Only → Hybrid. AI: Automate, Analyse, Recommend. Human: Decide, Validate.",hl:"Human always accountable"},{t:"Matching Engine",c:"Business Roadmap + Skills → Roles."}]},{title:"Principles",icon:"📐",items:[{t:"01 Hybrid",c:"AI convergence"},{t:"02 Scope",c:"Org change"},{t:"03 Urgency",c:"By function"},{t:"06 Internal",c:"Over external"},{t:"08 Priorities",c:"Business-critical"}]},{title:"Business Case",icon:"📊",items:[{t:"Productivity",c:"Weeks vs 6-12mo"},{t:"Cost",c:"Low vs 1-2×"},{t:"Returns",c:"Compounds vs Resets"}]}];

// Default AI Agents
const DEFAULT_AGENTS=[
  {id:"ai-1",name:"AXA-SkillMatch",role:"Skills Matching",model:"GPT-4o",validator:"Karim Hassan",container:"Azure OpenAI",prompt:"You match employees to positions based on semantic skill analysis. Return top 5 candidates with match percentage.",status:"active",accuracy:94,tasks:127,deployed:"2026-02-15"},
  {id:"ai-2",name:"AXA-CareerPath",role:"Career Advisor",model:"Claude Opus 4.6",validator:"Elena Rossi",container:"AWS Bedrock",prompt:"You generate personalized career trajectories based on employee skills, aspirations, and AXA career paths.",status:"active",accuracy:91,tasks:84,deployed:"2026-02-20"},
  {id:"ai-3",name:"AXA-LearnRec",role:"Learning Recommender",model:"GPT-4o-mini",validator:"Elena Rossi",container:"Azure OpenAI",prompt:"You recommend training programs and certifications based on identified skill gaps.",status:"training",accuracy:87,tasks:0,deployed:"2026-04-01"},
  {id:"ai-4",name:"AXA-WorkforceAI",role:"Workforce Planning",model:"Claude Sonnet 4.6",validator:"Yassir Abdelfettah",container:"AWS Bedrock",prompt:"You forecast workforce demand and supply across AXA entities based on business roadmap.",status:"active",accuracy:92,tasks:56,deployed:"2026-03-05"},
  {id:"ai-5",name:"AXA-InterviewBot",role:"Interview Copilot",model:"Claude Opus 4.6",validator:"Elena Rossi",container:"Anthropic API",prompt:"You assist managers during career interviews with real-time suggestions and competency scoring.",status:"idle",accuracy:85,tasks:0,deployed:"2026-04-15"},
];

const LLM_MODELS=["GPT-4o","GPT-4o-mini","Claude Opus 4.6","Claude Opus 4.7","Claude Sonnet 4.6","Claude Haiku 4.5","Gemini 2.5 Pro","Llama 3.3 70B","Mistral Large"];
const CONTAINERS=["Azure OpenAI","AWS Bedrock","Anthropic API","Google Vertex AI","Self-hosted (Kubernetes)","OpenShift AI"];

// ══════════════════════════════════════════════════════════════
// PERSISTENCE — localStorage with safe fallback
// ══════════════════════════════════════════════════════════════
const STORE_KEY="axa_smart_mobility_v71";
const loadStore=()=>{try{const s=localStorage.getItem(STORE_KEY);return s?JSON.parse(s):{};}catch(e){return{};}};
const saveStore=(data)=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(data));}catch(e){}};

// ══════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════
const Auth=({onLogin})=>{const[email,setEmail]=useState("yassir.qaissi@axa.com");const[selP,setSelP]=useState(null);const[loading,setLoading]=useState(false);const[mfa,setMfa]=useState(null);
const doLogin=()=>{if(!selP||!email.includes("@"))return;setLoading(true);setTimeout(()=>{setLoading(false);setMfa("mfa");},800);};
const confirmMfa=()=>{setMfa("done");setTimeout(()=>onLogin(selP),600);};
if(mfa==="mfa")return(<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.axaNavy},${T.axaMid} 60%,${T.violet})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FT}}><style>{css}</style><div style={{width:400,background:T.bgCard,borderRadius:14,borderTop:`4px solid ${T.axaRed}`,padding:32,boxShadow:"0 16px 60px rgba(0,0,0,.25)",animation:"popIn .4s ease",textAlign:"center"}}><div style={{fontSize:36}}>🔐</div><h2 style={{fontFamily:FH,fontSize:18,marginTop:10}}>Multi-Factor Authentication</h2><p style={{fontSize:11,color:T.inkSec,marginTop:6}}>Verification sent to Authenticator</p><div style={{display:"flex",gap:8,justifyContent:"center",marginTop:18}}>{[1,2,3,4,5,6].map(i=><input key={i} style={{width:36,height:44,textAlign:"center",fontSize:18,fontWeight:700,borderRadius:7,border:`2px solid ${T.border}`,background:T.bgSoft,outline:"none"}} maxLength={1} defaultValue={i<=4?String(Math.floor(Math.random()*10)):""}/>)}</div><button onClick={confirmMfa} style={{...S.btn,width:"100%",justifyContent:"center",padding:11,marginTop:16,borderRadius:10,background:T.teal}}>✅ Verify & Sign In</button></div></div>);
if(mfa==="done")return(<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.axaNavy},${T.axaMid} 60%,${T.violet})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FT}}><style>{css}</style><div style={{textAlign:"center",animation:"fadeUp .5s ease"}}><div style={{fontSize:44}}>✅</div><h2 style={{fontFamily:FH,fontSize:20,color:"#fff",marginTop:10}}>Authenticated</h2></div></div>);
return(<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.axaNavy},${T.axaMid} 60%,${T.violet})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FT}}><style>{css}</style>
<div style={{width:430,background:T.bgCard,borderRadius:14,borderTop:`4px solid ${T.axaRed}`,padding:"28px 34px",boxShadow:"0 16px 60px rgba(0,0,0,.25)",animation:"popIn .5s ease"}}>
  <div style={{textAlign:"center"}}><div style={{fontSize:34,fontWeight:800,color:T.axaBlue,letterSpacing:8,fontFamily:"Georgia,serif"}}>AXA</div><div style={{fontSize:9,color:T.inkMuted,letterSpacing:3,textTransform:"uppercase",marginTop:2}}>Group Operations</div></div>
  <div style={{width:"100%",height:1,background:T.border,margin:"12px 0"}}/>
  <div style={{textAlign:"center",marginBottom:16}}><h2 style={{fontFamily:FH,fontSize:18,fontWeight:700}}>SMART Mobility</h2><p style={{fontSize:11,color:T.inkMuted}}>Skills & People Marketplace · v7.1</p></div>
  <div style={{marginBottom:14}}><label style={{...S.label,display:"flex",gap:3}}>Corporate Email<span style={{color:T.axaRed}}>*</span></label><input style={{...S.input,padding:"11px 14px",fontSize:13,background:T.bgCard,border:`1.5px solid ${T.border}`}} value={email} onChange={e=>setEmail(e.target.value)}/></div>
  <div style={{marginBottom:16}}><label style={S.label}>Demo — Select Profile</label><div style={S.g2}>{PERSONAS.map(p=>(<div key={p.id} onClick={()=>setSelP(p)} style={{padding:"10px 12px",borderRadius:7,cursor:"pointer",border:selP?.id===p.id?`2px solid ${T.axaBlue}`:`1.5px solid ${T.border}`,background:selP?.id===p.id?`${T.axaBlue}06`:T.bgCard}}><div style={{fontSize:13,fontWeight:700,color:selP?.id===p.id?T.axaBlue:T.ink}}>{p.label}</div><div style={{fontSize:10,color:T.inkMuted,marginTop:1}}>{p.desc}</div></div>))}</div></div>
  <button onClick={doLogin} disabled={loading||!selP} style={{...S.btn,width:"100%",justifyContent:"center",padding:12,fontSize:14,borderRadius:10,opacity:(!selP||loading)?.5:1}}>{loading?<><span style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite"}}/>Authenticating...</>:"🔐 Sign in with Azure AD SSO"}</button>
  <div style={{marginTop:10,padding:8,background:T.bgSoft,borderRadius:6,fontSize:9,color:T.inkMuted}}>SAML 2.0 · Azure AD · RBAC · MFA · TLS 1.3</div>
</div></div>);};

// ══════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════
const NAV=[{k:"dashboard",l:"Dashboard",e:"📊"},{k:"charter",l:"Charter",e:"📜"},{k:"marketplace",l:"Marketplace",e:"🏪"},{k:"team",l:"Team",e:"👥"},{k:"interviews",l:"Interviews",e:"🎯"},{k:"careers",l:"Careers",e:"🚀"},{k:"refs",l:"Data & Refs",e:"📚"},{k:"agents",l:"AI Agents",e:"🤖"},{k:"reports",l:"Reports",e:"📈"}];
const Side=({active,go,persona,onLogout})=>(<div style={{width:200,background:T.axaBlue,display:"flex",flexDirection:"column",flexShrink:0}}><div style={{padding:"14px 14px 10px",borderBottom:"1px solid rgba(255,255,255,.1)"}}><div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:"#fff"}}>SMART Mobility</div><div style={{fontSize:8,color:"rgba(255,255,255,.4)",letterSpacing:1}}>AXA GROUP OPS · v7.1</div></div><div style={{flex:1,padding:"4px 0",overflowY:"auto"}}>{NAV.filter(n=>(persona?.access||[]).includes(n.k)).map(n=>(<div key={n.k} onClick={()=>go(n.k)} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",cursor:"pointer",background:active===n.k?"rgba(255,255,255,.1)":"transparent",borderLeft:active===n.k?"3px solid #fff":"3px solid transparent",color:active===n.k?"#fff":"rgba(255,255,255,.5)",fontSize:12,fontWeight:active===n.k?600:400}}><span style={{fontSize:12}}>{n.e}</span>{n.l}</div>))}</div><div style={{padding:10,borderTop:"1px solid rgba(255,255,255,.1)"}}><div style={S.flex}><div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>YA</div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:600,color:"#fff"}}>Yassir Q.</div><div style={{fontSize:8,color:"rgba(255,255,255,.4)"}}>{persona?.label}</div></div></div><button onClick={onLogout} style={{marginTop:6,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:5,padding:"4px 0",width:"100%",color:"rgba(255,255,255,.6)",fontSize:9}}>Sign Out</button></div></div>);

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
const PgDash=({go,store})=>(<div><div style={S.g4}>{[{l:"Employees",v:EMP.length,d:"+12",c:T.teal,p:"team"},{l:"AI Agents",v:(store.agents||DEFAULT_AGENTS).length,d:"+2",c:T.violet,p:"agents"},{l:"Positions",v:JOBS.length,d:"-3",c:T.ocean,p:"marketplace"},{l:"Interviews",v:(store.ivs||[]).length||4,d:"+5",c:T.orange,p:"interviews"}].map(s=>(<div key={s.l} onClick={()=>go(s.p)} style={{...S.card,cursor:"pointer"}}><div style={S.between}><span style={{fontSize:18}}>{s.l==="AI Agents"?"🤖":s.l==="Employees"?"👥":s.l==="Positions"?"📋":"🎯"}</span><span style={{fontSize:10,fontWeight:700,color:s.d[0]==="+"?T.teal:T.red}}>{s.d}</span></div><div style={{fontSize:24,fontWeight:800,fontFamily:FH,marginTop:6}}>{s.v}</div><div style={{fontSize:11,color:T.inkMuted}}>{s.l}</div></div>))}</div><div style={S.g2}><div style={S.card}><h3 style={S.h3}>Pipeline</h3><div style={{marginTop:10}}>{["Scheduled","In Progress","Plan","Training","Done"].map((s,i)=>(<div key={s} style={{...S.flex,marginBottom:7}}><span style={{fontSize:10,color:T.inkMuted,width:100}}>{s}</span><div style={{flex:1}}><Bar pct={[25,45,60,35,80][i]} color={[T.ocean,T.orange,T.teal,T.violet,T.green][i]}/></div><span style={{fontSize:10,fontWeight:600,width:22,textAlign:"right"}}>{[12,18,24,9,31][i]}</span></div>))}</div></div><div style={S.card}><h3 style={S.h3}>AI Agents</h3><div style={{marginTop:10}}>{(store.agents||DEFAULT_AGENTS).slice(0,4).map(a=>(<div key={a.id} style={{...S.flex,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><span>🤖</span><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{a.name}</div></div><Bd status={a.status}/></div>))}</div></div></div><div style={S.card}><h3 style={{...S.h3,marginBottom:8}}>Quick Actions</h3><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[{l:"Marketplace",p:"marketplace"},{l:"Interviews",p:"interviews"},{l:"AI Agents",p:"agents"},{l:"Refs",p:"refs"}].map(a=>(<button key={a.l} onClick={()=>go(a.p)} style={{...S.btn,...S.btnO}}>{a.l}</button>))}</div></div></div>);

// ══════════════════════════════════════════════════════════════
// CHARTER
// ══════════════════════════════════════════════════════════════
const PgCharter=()=>{const[exp,setExp]=useState({});return(<div><div style={{...S.card,background:`${T.axaBlue}04`,borderColor:`${T.axaBlue}18`}}><div style={S.flex}><span>⭐</span><span style={{fontSize:12,fontWeight:700,color:T.axaBlue}}>CORE PRINCIPLE</span></div><p style={{fontFamily:FH,fontSize:16,fontStyle:"italic",marginTop:6}}>"Human always stays accountable"</p></div>{CHARTER.map((sec,si)=>(<div key={si} style={S.card}><div style={{...S.between,cursor:"pointer"}} onClick={()=>setExp(p=>({...p,[si]:!p[si]}))}><div style={S.flex}><span>{sec.icon}</span><h3 style={S.h3}>{sec.title}</h3></div><span style={{color:T.inkMuted}}>{exp[si]?"▼":"▶"}</span></div>{exp[si]&&<div style={{marginTop:8,borderTop:`1px solid ${T.border}`,paddingTop:8}}>{sec.items.map((it,i)=>(<div key={i} style={{padding:"5px 8px",background:i%2?T.bgMuted:"transparent",borderRadius:5}}><div style={{fontSize:11,fontWeight:600,color:T.teal}}>{it.t}</div><div style={{fontSize:11,color:T.inkSec}}>{it.c}</div>{it.hl&&<div style={{marginTop:3,padding:"3px 8px",background:T.orangeBg,borderLeft:`2px solid ${T.orange}`,borderRadius:3,fontSize:10,color:T.orange,fontWeight:600}}>{it.hl}</div>}</div>))}</div>}</div>))}</div>);};

// ══════════════════════════════════════════════════════════════
// MARKETPLACE — with Express Interest flow
// ══════════════════════════════════════════════════════════════
const PgMarket=({persona,store,setStore,setToast,go})=>{
  const isEmp=persona?.role==="employee";const isHR=persona?.role==="hr";const isMgr=persona?.role==="manager"||persona?.role==="admin";
  const[tab,setTab]=useState(isEmp?"jobs":"people");const[sf,setSf]=useState([]);const[df,setDf]=useState("All");const[q,setQ]=useState("");const[countryF,setCountryF]=useState("All");const[entityF,setEntityF]=useState("All");const[sel,setSel]=useState(null);const[selJob,setSelJob]=useState(null);
  const showPeople=isMgr||(isHR&&tab==="people");const showJobs=isEmp||(isHR&&tab==="jobs");
  const interests=store.interests||[]; // {empId, jobId, date, status}
  
  // People pool includes: mobility=true + any who expressed interest
  const interestedEmpIds=[...new Set(interests.map(i=>i.empId))];
  const pool=EMP.filter(e=>e.mobility||interestedEmpIds.includes(e.id));
  const filPeople=pool.filter(e=>(df==="All"||e.dept===df)&&(sf.length===0||sf.some(s=>e.skills.includes(s)))&&(!q||e.name.toLowerCase().includes(q.toLowerCase())||e.role.toLowerCase().includes(q.toLowerCase())));
  
  const countries=[...new Set(JOBS.map(j=>j.country))];const entities=[...new Set(JOBS.map(j=>j.entity))];
  const filJobs=JOBS.filter(j=>(df==="All"||j.dept===df)&&(countryF==="All"||j.country===countryF)&&(entityF==="All"||j.entity===entityF)&&(sf.length===0||sf.some(s=>j.skills.includes(s)))&&(!q||j.title.toLowerCase().includes(q.toLowerCase())));
  
  const empSkills=EMP[0].skills; // current employee = Sophie for demo
  const matchPct=(jobSkills)=>{const m=jobSkills.filter(s=>empSkills.includes(s)).length;return Math.round((m/jobSkills.length)*100);};
  
  // Express Interest — adds to store.interests, visible to managers
  const doExpressInterest=(job)=>{
    const newInt={empId:EMP[0].id,empName:EMP[0].name,jobId:job.id,jobTitle:job.title,date:new Date().toISOString().slice(0,10),status:"Interested"};
    const updated=[...interests.filter(i=>!(i.empId===EMP[0].id&&i.jobId===job.id)),newInt];
    setStore(p=>({...p,interests:updated}));
    setToast(`✅ Interest expressed in ${job.title} — visible to managers`);
  };
  
  const hasExpressed=(jobId)=>interests.some(i=>i.empId===EMP[0].id&&i.jobId===jobId);

  if(sel) return(<div>
    <button onClick={()=>setSel(null)} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:10}}>← Back</button>
    <div style={{...S.card,padding:22,border:`2px solid ${T.axaBlue}18`,maxWidth:680}}>
      <div style={S.between}><div style={{fontSize:9,fontWeight:700,color:T.axaBlue,letterSpacing:1.5}}>WORKFORCE ID CARD</div>{interests.filter(i=>i.empId===sel.id).length>0&&<Bd status={`${interests.filter(i=>i.empId===sel.id).length} interests`} custom={T.orange}/>}</div>
      <div style={{...S.flex,marginTop:10}}><div style={{width:48,height:48,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{sel.avatar}</div><div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,fontFamily:FH}}>{sel.name}</div><div style={{fontSize:11,color:T.inkSec}}>{sel.role} — {sel.dept} · {sel.level}</div><div style={{fontSize:10,color:T.teal,marginTop:1}}>{sel.intent}</div></div></div>
      <div style={{...S.g2,marginTop:12}}><div><div style={S.label}>Experience</div><div style={{fontSize:12}}>{sel.yrs}y — {sel.bg}</div></div><div><div style={S.label}>Teams</div>{sel.teams.map(t=><div key={t} style={{fontSize:11}}>• {t}</div>)}</div></div>
      <div style={{marginTop:10}}><div style={S.label}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:3}}>{sel.skills.map(sk=>(<span key={sk} style={{background:T.bgSoft,borderRadius:4,padding:"2px 7px",fontSize:10}}>{sk}</span>))}</div></div>
      {interests.filter(i=>i.empId===sel.id).length>0&&<div style={{marginTop:10}}><div style={S.label}>Expressed Interest In:</div>{interests.filter(i=>i.empId===sel.id).map((int,i)=><div key={i} style={{fontSize:11,padding:"3px 8px",background:T.orangeBg,borderRadius:4,marginTop:3}}>• {int.jobTitle} ({int.date})</div>)}</div>}
      <div style={{marginTop:10}}><div style={S.label}>Performance</div>{sel.perf.map(p=><div key={p.yr} style={{...S.flex,padding:"3px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:11,fontWeight:600,width:40}}>{p.yr}</span><span style={{fontWeight:700,color:p.score>=4?T.teal:T.orange}}>{p.score}</span><span style={{fontSize:10,color:T.inkSec,flex:1}}>{p.note}</span></div>)}</div>
      <div style={{...S.flex,marginTop:12}}><button onClick={()=>setToast(`📧 Contact initiated with ${sel.name}`)} style={S.btn}>📧 Contact</button><button onClick={()=>{setToast(`🎯 Interview scheduled for ${sel.name}`);go("interviews");}} style={{...S.btn,background:T.teal}}>🎯 Schedule Interview</button></div>
    </div>
  </div>);

  if(selJob) {const mp=matchPct(selJob.skills);const already=hasExpressed(selJob.id);
    return(<div>
      <button onClick={()=>setSelJob(null)} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:10}}>← Back</button>
      <div style={{...S.card,padding:22,border:`2px solid ${T.ocean}18`,maxWidth:680}}>
        <div style={S.between}><div style={{fontSize:9,fontWeight:700,color:T.ocean,letterSpacing:1.5}}>JOB DESCRIPTION · {selJob.id}</div><Bd status={selJob.urgency}/></div>
        <h2 style={{fontFamily:FH,fontSize:20,fontWeight:700,marginTop:10}}>{selJob.title}</h2>
        <div style={{...S.flex,marginTop:6,fontSize:11,color:T.inkSec}}><span>{selJob.entity}</span><span>·</span><span>{selJob.city}, {selJob.country}</span><span>·</span><span>{selJob.type}</span><span>·</span><Bd status={selJob.level}/></div>
        <p style={{fontSize:12,color:T.inkSec,lineHeight:1.6,marginTop:12}}>{selJob.desc}</p>
        <div style={{marginTop:12}}><div style={S.label}>Required Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{selJob.skills.map(sk=>(<span key={sk} style={{...S.tag,background:empSkills.includes(sk)?T.tealBg:T.redBg,color:empSkills.includes(sk)?T.teal:T.red}}>{sk} {empSkills.includes(sk)?"✓":"✗"}</span>))}</div></div>
        {isEmp&&<div style={{marginTop:12,padding:12,background:mp>=75?T.tealBg:mp>=50?T.oceanBg:T.orangeBg,borderRadius:8}}>
          <div style={S.between}><span style={{fontSize:12,fontWeight:700,color:mp>=75?T.teal:mp>=50?T.ocean:T.orange}}>Skill Match: {mp}%</span><div style={{flex:1,marginLeft:10}}><Bar pct={mp} color={mp>=75?T.teal:mp>=50?T.ocean:T.orange} h={8}/></div></div>
          <div style={{fontSize:10,color:T.inkSec,marginTop:4}}>{mp>=75?"Strong match":mp>=50?"Partial match — upskill recommended":"Gap identified — training first"}</div>
        </div>}
        <div style={{...S.flex,marginTop:14,flexWrap:"wrap"}}>
          {isEmp&&<button onClick={()=>doExpressInterest(selJob)} disabled={already} style={{...S.btn,background:already?T.inkMuted:T.teal,opacity:already?.6:1}}>{already?"✓ Interest Expressed":"🙋 Express Interest"}</button>}
          <button onClick={()=>go("careers")} style={{...S.btn,...S.btnO}}>📋 View Career Path</button>
          {(isMgr||isHR)&&<button onClick={()=>setToast(`📧 Hiring manager contacted for ${selJob.title}`)} style={S.btn}>📧 Contact Hiring Mgr</button>}
        </div>
        <div style={{fontSize:10,color:T.inkDim,marginTop:10}}>Posted: {selJob.posted} · Dept: {selJob.dept} · ID: {selJob.id}</div>
      </div>
    </div>);
  }

  return(<div>
    {isHR&&<div style={{display:"flex",gap:4,marginBottom:14}}>
      <button onClick={()=>{setTab("people");setSf([]);setDf("All");setQ("");}} style={{...S.btn,background:tab==="people"?T.teal:T.bgSoft,color:tab==="people"?"#fff":T.inkSec,border:`1.5px solid ${tab==="people"?T.teal:T.border}`,borderRadius:8,padding:"10px 20px",fontSize:13}}>👥 Employees in Mobility ({filPeople.length})</button>
      <button onClick={()=>{setTab("jobs");setSf([]);setDf("All");setQ("");setCountryF("All");setEntityF("All");}} style={{...S.btn,background:tab==="jobs"?T.ocean:T.bgSoft,color:tab==="jobs"?"#fff":T.inkSec,border:`1.5px solid ${tab==="jobs"?T.ocean:T.border}`,borderRadius:8,padding:"10px 20px",fontSize:13}}>📋 Open Positions ({JOBS.length})</button>
    </div>}
    {isMgr&&interests.length>0&&<div style={{...S.card,background:T.orangeBg,borderColor:T.orange,padding:12,marginBottom:12}}>
      <div style={S.flex}><span>🔔</span><span style={{fontSize:12,fontWeight:700,color:T.orange}}>New Interest Expressions ({interests.length})</span></div>
      <div style={{marginTop:6}}>{interests.slice(-3).map((int,i)=><div key={i} style={{fontSize:11,padding:"3px 0",color:T.inkSec}}>• <strong>{int.empName}</strong> expressed interest in <strong>{int.jobTitle}</strong> ({int.date})</div>)}</div>
    </div>}
    <div style={{...S.card,padding:14}}>
      <div style={{...S.flex,marginBottom:8}}><span style={{fontSize:14}}>{showPeople?"👥":"📋"}</span><span style={{fontSize:12,fontWeight:600,color:showPeople?T.teal:T.ocean}}>{showPeople?"Talent Pool":"Open Positions"}</span>{(sf.length>0||df!=="All"||countryF!=="All"||entityF!=="All")&&<button onClick={()=>{setSf([]);setDf("All");setQ("");setCountryF("All");setEntityF("All");}} style={{...S.btn,...S.btnSm,...S.btnO,marginLeft:"auto"}}>Clear</button>}</div>
      <div style={{...S.flex,gap:8,marginBottom:8,flexWrap:"wrap"}}>
        <input style={{...S.input,maxWidth:180}} placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select style={S.select} value={df} onChange={e=>setDf(e.target.value)}><option value="All">{showPeople?"All Depts":"All Domains"}</option>{(showPeople?[...new Set(EMP.map(e=>e.dept))]:DOMAINS).map(d=><option key={d}>{d}</option>)}</select>
        {showJobs&&<><select style={S.select} value={countryF} onChange={e=>setCountryF(e.target.value)}><option value="All">All Countries</option>{countries.map(c=><option key={c}>{c}</option>)}</select>
        <select style={S.select} value={entityF} onChange={e=>setEntityF(e.target.value)}><option value="All">All Entities</option>{entities.map(e=><option key={e}>{e}</option>)}</select></>}
      </div>
      <Chips options={SKILLS.slice(0,14)} selected={sf} onToggle={s=>setSf(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}/>
    </div>
    <div style={{fontSize:10,color:T.inkMuted,margin:"5px 0"}}>{showPeople?`${filPeople.length} employees`:`${filJobs.length} positions`}</div>
    {showPeople&&<div style={S.g2}>{filPeople.map(e=>{const empInterests=interests.filter(i=>i.empId===e.id);return(<div key={e.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setSel(e)}>
      <div style={S.flex}><div style={{width:32,height:32,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{e.role} — {e.dept}</div></div><Bd status={e.level}/></div>
      <div style={{fontSize:10,color:T.teal,marginTop:4,fontStyle:"italic"}}>{e.intent}</div>
      {empInterests.length>0&&<div style={{fontSize:10,color:T.orange,marginTop:3}}>🎯 {empInterests.length} position(s) expressed</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:5}}>{e.skills.slice(0,4).map(sk=><span key={sk} style={{...S.tag,fontSize:9,background:sf.includes(sk)?T.tealBg:T.bgSoft,color:sf.includes(sk)?T.teal:T.inkMuted}}>{sk}</span>)}</div>
    </div>);})}</div>}
    {showJobs&&<div style={S.g2}>{filJobs.map(j=>{const mp=matchPct(j.skills);const already=hasExpressed(j.id);return(<div key={j.id} style={{...S.card,cursor:"pointer",borderLeft:already?`3px solid ${T.teal}`:`1px solid ${T.border}`}} onClick={()=>setSelJob(j)}>
      <div style={S.between}><h4 style={{fontSize:13,fontWeight:700,margin:0}}>{j.title}</h4><Bd status={j.urgency}/></div>
      <div style={{...S.flex,marginTop:5,fontSize:10,color:T.inkSec}}><span>{j.entity}</span><span>·</span><span>{j.city}, {j.country}</span></div>
      <p style={{fontSize:10,color:T.inkMuted,marginTop:6,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{j.desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:6}}>{j.skills.map(sk=><span key={sk} style={{...S.tag,fontSize:9,background:isEmp&&empSkills.includes(sk)?T.tealBg:T.bgSoft,color:isEmp&&empSkills.includes(sk)?T.teal:T.inkMuted}}>{sk}</span>)}</div>
      {isEmp&&<div style={{...S.flex,marginTop:6}}><span style={{fontSize:10,fontWeight:600,color:mp>=75?T.teal:mp>=50?T.ocean:T.orange}}>Match: {mp}%</span><div style={{flex:1,maxWidth:100}}><Bar pct={mp} color={mp>=75?T.teal:mp>=50?T.ocean:T.orange} h={4}/></div>{already&&<Bd status="✓ Interested" custom={T.teal}/>}</div>}
    </div>);})}</div>}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// TEAM
// ══════════════════════════════════════════════════════════════
const PgTeam=({store})=>{const agents=store.agents||DEFAULT_AGENTS;return(<div><h3 style={{...S.h3,marginBottom:8}}>Human Team</h3><div style={S.g2}>{EMP.slice(0,8).map(e=>(<div key={e.id} style={S.card}><div style={S.flex}><div style={{width:28,height:28,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{e.role}</div></div><Bd status={e.level}/></div></div>))}</div><div style={{marginTop:16,paddingTop:12,borderTop:`2px solid ${T.violet}18`}}><div style={S.flex}><span>🤖</span><h3 style={{...S.h3,margin:0}}>AI Agents Team</h3><Bd status={`${agents.length}`} custom={T.violet}/></div><div style={{...S.g3,marginTop:8}}>{agents.map(a=>(<div key={a.id} style={{...S.card,borderLeft:`3px solid ${a.status==="active"?T.violet:a.status==="training"?T.orange:T.inkDim}`}}><div style={{fontSize:11,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.role}</div><div style={{fontSize:9,color:T.inkDim,marginTop:3}}>{a.model} · {a.container}</div><div style={{...S.flex,marginTop:6}}><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet}}>{a.accuracy}%</span></div></div>))}</div></div></div>);};

// ══════════════════════════════════════════════════════════════
// INTERVIEWS — persistent via store
// ══════════════════════════════════════════════════════════════
const DEFAULT_IVS=[
  {id:1,emp:EMP[0],date:"2026-04-25",st:"Scheduled",wf:0,ans:{},gap:null,plan:null},
  {id:2,emp:EMP[1],date:"2026-04-22",st:"In Progress",wf:1,ans:{1:"Strategic / transversal"},gap:null,plan:null},
  {id:3,emp:EMP[2],date:"2026-04-10",st:"Completed",wf:6,ans:{3:"VP Product"},
    gap:{targetRole:"VP Product",currentSkills:EMP[2].skills,targetSkills:["Strategic Thinking","Financial Modeling","Leadership","Data Governance","Product Management"],gaps:[{s:"Strategic Thinking",c:2,r:5,p:"High",status:"In Progress",empConfirmed:true,mgrValidated:true},{s:"Financial Modeling",c:1,r:4,p:"High",status:"Not Started",empConfirmed:true,mgrValidated:false},{s:"Leadership",c:3,r:5,p:"Medium",status:"In Progress",empConfirmed:true,mgrValidated:true},{s:"Data Governance",c:0,r:3,p:"Medium",status:"Not Started",empConfirmed:false,mgrValidated:false}]},
    plan:{jobId:"J3",status:"Draft",readiness:3,timeline:"6-12mo",mgrNotes:"Strong strategic potential. Focus on financial modeling.",empNotes:"Excited to grow into product leadership.",nextReview:"2026-08-01",completion:65}},
  {id:4,emp:EMP[4],date:"2026-04-18",st:"Action Plan",wf:3,ans:{3:"HR Director"},
    gap:{targetRole:"HR Director",currentSkills:EMP[4].skills,targetSkills:["Strategic Thinking","Financial Modeling","Data Governance","Change Management"],gaps:[{s:"Strategic Thinking",c:2,r:5,p:"High",status:"Not Started",empConfirmed:false,mgrValidated:false},{s:"Financial Modeling",c:0,r:4,p:"High",status:"Not Started",empConfirmed:false,mgrValidated:false},{s:"Data Governance",c:1,r:3,p:"Medium",status:"Not Started",empConfirmed:false,mgrValidated:false}]},
    plan:{jobId:"J8",status:"Draft",readiness:2,timeline:"12-18mo",mgrNotes:"",empNotes:"",nextReview:"2026-06-01",completion:25}},
];

const PgIV=({persona,store,setStore,setToast,go,setFocusSkill})=>{
  const allPaths=useMemo(()=>genPaths(),[]);
  const ivs=store.ivs||DEFAULT_IVS;
  const setIvs=(fn)=>{const updated=typeof fn==="function"?fn(ivs):fn;setStore(p=>({...p,ivs:updated}));};
  
  const[v,setV]=useState("list");
  const[aiv,setAiv]=useState(null);
  const[cq,setCq]=useState(0);
  const[ans,setAns]=useState({});
  const[ft,setFt]=useState({});
  const[ma,setMa]=useState({});
  const[pv,setPv]=useState(null);
  const[showSch,setShowSch]=useState(false);
  const[schEmp,setSchEmp]=useState("");
  const[schDt,setSchDt]=useState("2026-05-05");
  
  const jobSugg=useMemo(()=>aiv?getJobSugg(aiv.emp,allPaths):[],[aiv?.emp?.id,allPaths]);
  
  const startIV=iv=>{setAiv(iv);setAns(iv.ans||{});setFt({});setMa({});setCq(0);setV("iv");};
  
  const doSave=()=>{
    const a={...ans};Object.entries(ma).forEach(([k,vl])=>{a[k]=vl.join(", ");});Object.entries(ft).forEach(([k,vl])=>{if(vl)a[k]=vl;});
    setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"In Progress",wf:Math.max(i.wf,1),ans:a}:i));
    setAiv(prev=>({...prev,ans:a}));
    setToast("✅ Interview saved");
  };
  
  // Generate Gap from answers
  const genGap=(emp,a)=>{
    const target=a[3]||a["3c"]||`Senior ${emp.role}`;
    const cur=a[4]?a[4].split(", "):emp.skills;
    const des=a[6]?a[6].split(", "):SKILLS.slice(5,10);
    const targetSkills=[...des.filter(s=>!cur.includes(s)),"Strategic Thinking","Leadership"].slice(0,5);
    return{targetRole:target,currentSkills:cur,targetSkills,gaps:targetSkills.map(s=>({s,c:Math.floor(Math.random()*2),r:3+Math.floor(Math.random()*3),p:["High","Medium","Low"][Math.floor(Math.random()*3)],status:"Not Started",empConfirmed:false,mgrValidated:false}))};
  };
  
  // Match plan to best-fit job
  const findMatchingJob=(targetRole)=>{
    const lower=targetRole.toLowerCase();
    return JOBS.find(j=>j.title.toLowerCase().includes(lower)||lower.includes(j.title.toLowerCase().split(" ")[0]))||JOBS[0];
  };
  
  const complIV=()=>{
    const a={...ans};Object.entries(ma).forEach(([k,vl])=>{a[k]=vl.join(", ");});Object.entries(ft).forEach(([k,vl])=>{if(vl)a[k]=vl;});
    const gap=genGap(aiv.emp,a);
    const job=findMatchingJob(gap.targetRole);
    const plan={jobId:job.id,status:"Draft",readiness:2,timeline:"6-12mo",mgrNotes:"",empNotes:"",nextReview:"2026-08-01",completion:10};
    setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"Gap Analysis",wf:2,ans:a,gap,plan}:i));
    setAiv(null);setV("list");
    setToast("✅ Interview complete — Gap + Action Plan generated");
  };
  
  const doSch=()=>{if(!schEmp)return;const emp=EMP.find(e=>e.name===schEmp);if(!emp)return;setIvs(p=>[...p,{id:Date.now(),emp,date:schDt,st:"Scheduled",wf:0,ans:{},gap:null,plan:null}]);setShowSch(false);setSchEmp("");setToast("✅ Interview scheduled");};

  const WFS=({step})=>(<div style={{display:"flex",alignItems:"center",margin:"6px 0"}}>{WF.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",flex:1}}><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:18,height:18,borderRadius:"50%",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:i<step?T.teal:i===step?T.tealBg:T.bgSoft,color:i<step?"#fff":i===step?T.teal:T.inkDim,border:i===step?`2px solid ${T.teal}`:"none"}}>{i<step?"✓":i+1}</div><div style={{fontSize:6,color:i<=step?T.ink:T.inkDim,marginTop:1,textAlign:"center",maxWidth:42}}>{s}</div></div>{i<WF.length-1&&<div style={{flex:1,height:1,background:i<step?T.teal:T.bgSoft,marginBottom:10}}/>}</div>))}</div>);

  // ═══ GAP VIEW (distinct from Plan) ═══
  if(v==="gap"&&pv&&pv.gap){
    const g=pv.gap;
    const updateGap=(skillName,field,value)=>{
      const newGaps=g.gaps.map(gg=>gg.s===skillName?{...gg,[field]:value}:gg);
      setIvs(p=>p.map(i=>i.id===pv.id?{...i,gap:{...i.gap,gaps:newGaps}}:i));
      setPv(p=>({...p,gap:{...p.gap,gaps:newGaps}}));
    };
    const totalValidated=g.gaps.filter(gg=>gg.mgrValidated&&gg.empConfirmed).length;
    const completionPct=Math.round((totalValidated/g.gaps.length)*100);
    
    return(<div>
      <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h1}>🔬 Skills Gap Analysis</h2><p style={{fontSize:11,color:T.inkSec}}>{pv.emp.name} · Target: <strong style={{color:T.red}}>{g.targetRole}</strong></p></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:T.red}}>{completionPct}%</div><div style={{fontSize:9,color:T.inkMuted}}>Validated</div></div>
      </div>
      
      <div style={{...S.card,background:T.redBg,borderColor:`${T.red}30`,marginTop:8}}>
        <div style={{fontSize:10,fontWeight:700,color:T.red,letterSpacing:1}}>VALIDATION WORKFLOW</div>
        <div style={{fontSize:11,color:T.inkSec,marginTop:4}}>Each gap skill must be confirmed by the <strong>Employee</strong> and validated by the <strong>Manager</strong>. Status updates track reskilling progress.</div>
      </div>
      
      <div style={{...S.g2,marginTop:10}}>
        <div style={S.card}><div style={S.label}>Current Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{g.currentSkills.map(s=><span key={s} style={S.tag}>{s}</span>)}</div></div>
        <div style={S.card}><div style={S.label}>Target Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{g.targetSkills.map(s=><span key={s} style={{...S.tag,background:T.redBg,color:T.red}}>{s}</span>)}</div></div>
      </div>
      
      <h3 style={{...S.h3,marginTop:14,marginBottom:6}}>Gap Details · Validation · Reskilling</h3>
      {g.gaps.map((gg,i)=>(<div key={i} style={{...S.card,padding:14}}>
        <div style={S.between}>
          <div style={{...S.flex,cursor:"pointer"}} onClick={()=>{setFocusSkill(gg.s);go("careers");}}>
            <span style={{fontSize:13,fontWeight:700,color:T.axaBlue,textDecoration:"underline"}}>{gg.s}</span>
            <Bd status={gg.p}/>
            <Bd status={gg.status}/>
          </div>
          <div style={{fontSize:10,color:T.inkMuted}}>Click skill → Learning & Cert</div>
        </div>
        
        <div style={{...S.flex,marginTop:8}}>
          <span style={{fontSize:10,color:T.inkMuted,width:60}}>Lv{gg.c} → Lv{gg.r}</span>
          <div style={{flex:1}}><Bar pct={(gg.c/gg.r)*100} color={gg.c>=gg.r?T.teal:gg.c>=gg.r/2?T.orange:T.red}/></div>
          <span style={{fontSize:10,fontWeight:600,color:T.inkMuted}}>{Math.round((gg.c/gg.r)*100)}%</span>
        </div>
        
        {/* Linked learning */}
        <div style={{marginTop:8,padding:10,background:T.bgMuted,borderRadius:6}}>
          <div style={{fontSize:9,fontWeight:700,color:T.inkMuted,letterSpacing:1,marginBottom:4}}>LINKED RESOURCES</div>
          <div style={{fontSize:11,lineHeight:1.6}}>
            <div>📚 <strong>Training:</strong> {getLearning(gg.s).train}</div>
            <div>🏅 <strong>Certification:</strong> {getLearning(gg.s).cert}</div>
            <div>👤 <strong>Mentor:</strong> {getLearning(gg.s).mentor}</div>
          </div>
        </div>
        
        {/* Status Update */}
        <div style={{...S.g2,marginTop:8,gap:8}}>
          <div>
            <label style={S.label}>Status</label>
            <select style={{...S.select,width:"100%"}} value={gg.status} onChange={e=>updateGap(gg.s,"status",e.target.value)}>
              <option>Not Started</option><option>In Progress</option><option>Completed</option><option>Validated</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Current Level</label>
            <select style={{...S.select,width:"100%"}} value={gg.c} onChange={e=>updateGap(gg.s,"c",parseInt(e.target.value))}>
              {[0,1,2,3,4,5].map(l=><option key={l} value={l}>Lv{l}</option>)}
            </select>
          </div>
        </div>
        
        {/* Validation */}
        <div style={{...S.g2,marginTop:8,gap:8}}>
          <label style={{...S.flex,cursor:"pointer",padding:8,background:gg.empConfirmed?T.tealBg:T.bgSoft,borderRadius:6}}><input type="checkbox" checked={gg.empConfirmed} onChange={e=>updateGap(gg.s,"empConfirmed",e.target.checked)}/><span style={{fontSize:11}}>✓ Employee confirmed</span></label>
          <label style={{...S.flex,cursor:"pointer",padding:8,background:gg.mgrValidated?T.tealBg:T.bgSoft,borderRadius:6}}><input type="checkbox" checked={gg.mgrValidated} onChange={e=>updateGap(gg.s,"mgrValidated",e.target.checked)}/><span style={{fontSize:11}}>✓ Manager validated</span></label>
        </div>
      </div>))}
      
      <div style={S.flex}><button onClick={()=>{setToast("✅ Gap analysis saved");}} style={S.btn}>💾 Save Gap Analysis</button><button onClick={()=>{setV("plan");}} style={{...S.btn,...S.btnG}}>→ View Action Plan</button></div>
    </div>);
  }

  // ═══ PLAN VIEW (distinct from Gap — ATS job match + execution) ═══
  if(v==="plan"&&pv&&pv.plan){
    const plan=pv.plan;
    const job=JOBS.find(j=>j.id===plan.jobId)||JOBS[0];
    const empSkills=pv.emp.skills;
    const matchPct=Math.round((job.skills.filter(s=>empSkills.includes(s)).length/job.skills.length)*100);
    const isLocked=plan.status==="Finalized"||plan.status==="Locked";
    
    const updatePlan=(field,value)=>{
      setIvs(p=>p.map(i=>i.id===pv.id?{...i,plan:{...i.plan,[field]:value}}:i));
      setPv(p=>({...p,plan:{...p.plan,[field]:value}}));
    };
    
    const doSavePlan=()=>setToast("✅ Action plan saved");
    const doFinalize=()=>{
      updatePlan("status","Finalized");
      setToast("🔒 Plan finalized and locked");
    };
    
    return(<div>
      <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h1}>📋 Action Plan</h2><p style={{fontSize:11,color:T.inkSec}}>{pv.emp.name} · Target job: <strong style={{color:T.teal}}>{job.title}</strong> ({job.id})</p></div>
        <div style={S.flex}><Bd status={plan.status}/><div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:T.teal}}>{plan.completion}%</div><div style={{fontSize:9,color:T.inkMuted}}>Complete</div></div></div>
      </div>
      
      {/* ATS Job Card */}
      <div style={{...S.card,background:T.oceanBg,borderColor:`${T.ocean}30`,marginTop:8}}>
        <div style={S.between}><div style={{fontSize:10,fontWeight:700,color:T.ocean,letterSpacing:1}}>MATCHED ATS JOB · {job.id}</div><Bd status={`Match ${matchPct}%`} custom={matchPct>=75?T.teal:matchPct>=50?T.ocean:T.orange}/></div>
        <h4 style={{fontSize:14,fontWeight:700,marginTop:5}}>{job.title}</h4>
        <div style={{fontSize:11,color:T.inkSec,marginTop:2}}>{job.entity} · {job.city}, {job.country} · {job.level} · {job.type}</div>
        <p style={{fontSize:11,color:T.inkSec,marginTop:6}}>{job.desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>{job.skills.map(sk=><span key={sk} style={{...S.tag,background:empSkills.includes(sk)?T.tealBg:T.redBg,color:empSkills.includes(sk)?T.teal:T.red}}>{sk} {empSkills.includes(sk)?"✓":"✗"}</span>)}</div>
      </div>
      
      {/* Tasks + Milestones + Deliverables from ATS */}
      <div style={{...S.g3,marginTop:10}}>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.teal,marginBottom:6}}>✅ Tasks</h4>{job.tasks.map((t,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {t}</div>)}</div>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:6}}>🎯 Milestones</h4>{job.milestones.map((m,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {m}</div>)}</div>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.violet,marginBottom:6}}>📦 Deliverables</h4>{job.deliverables.map((d,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {d}</div>)}</div>
      </div>
      
      {/* Plan form */}
      <div style={{...S.card,marginTop:10}}>
        <h3 style={{...S.h3,marginBottom:10}}>Plan Details {isLocked&&<span style={{fontSize:10,color:T.violet,marginLeft:8}}>🔒 LOCKED</span>}</h3>
        <div style={{...S.g2,gap:10}}>
          <div><label style={S.label}>Readiness (1-5)</label><select disabled={isLocked} style={{...S.select,width:"100%",opacity:isLocked?.6:1}} value={plan.readiness} onChange={e=>updatePlan("readiness",parseInt(e.target.value))}><option value={1}>1 - Not ready</option><option value={2}>2 - Developing</option><option value={3}>3 - Approaching</option><option value={4}>4 - Ready</option><option value={5}>5 - Fully ready</option></select></div>
          <div><label style={S.label}>Timeline</label><select disabled={isLocked} style={{...S.select,width:"100%",opacity:isLocked?.6:1}} value={plan.timeline} onChange={e=>updatePlan("timeline",e.target.value)}><option>3-6mo</option><option>6-12mo</option><option>12-18mo</option><option>18-24mo</option></select></div>
        </div>
        <div style={{marginTop:10}}><label style={S.label}>Manager Comments</label><textarea disabled={isLocked} style={{...S.input,minHeight:60,opacity:isLocked?.6:1}} value={plan.mgrNotes} onChange={e=>updatePlan("mgrNotes",e.target.value)} placeholder="Manager observations and commitments..."/></div>
        <div style={{marginTop:10}}><label style={S.label}>Employee Comments</label><textarea disabled={isLocked} style={{...S.input,minHeight:60,opacity:isLocked?.6:1}} value={plan.empNotes} onChange={e=>updatePlan("empNotes",e.target.value)} placeholder="Employee goals and agreement..."/></div>
        <div style={{marginTop:10,maxWidth:260}}><label style={S.label}>Next Review</label><input disabled={isLocked} style={{...S.input,opacity:isLocked?.6:1}} type="date" value={plan.nextReview} onChange={e=>updatePlan("nextReview",e.target.value)}/></div>
        
        <div style={{...S.flex,marginTop:14}}>
          <button onClick={doSavePlan} disabled={isLocked} style={{...S.btn,opacity:isLocked?.5:1}}>💾 Save</button>
          <button onClick={doFinalize} disabled={isLocked} style={{...S.btn,...S.btnG,opacity:isLocked?.5:1}}>{isLocked?"🔒 Finalized":"✅ Finalize & Lock"}</button>
          {isLocked&&<button onClick={()=>{updatePlan("status","Draft");setToast("Plan unlocked for editing");}} style={{...S.btn,...S.btnO}}>Unlock (Admin)</button>}
          <button onClick={()=>setV("gap")} style={{...S.btn,...S.btnO}}>← Back to Gap</button>
        </div>
      </div>
    </div>);
  }

  // ═══ INTERVIEW FORM ═══
  if(v==="iv"&&aiv){const curQ=IQ[cq];const show=!curQ.on||ans[curQ.on]===curQ.val;
    return(<div><button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
    <div style={S.between}><div><h2 style={S.h1}>Interview: {aiv.emp.name}</h2><p style={{fontSize:11,color:T.inkSec}}>{aiv.emp.role}</p></div><button onClick={doSave} style={{...S.btn,...S.btnSm}}>💾 Save</button></div>
    <div style={{margin:"6px 0"}}><Bar pct={(cq+1)/IQ.length*100}/><div style={{fontSize:10,color:T.inkMuted,marginTop:2}}>Q{cq+1}/{IQ.length}</div></div>
    {show?(<div style={{...S.card,padding:18,marginTop:6}}>
    <div style={{fontSize:10,color:T.teal,fontWeight:700,letterSpacing:1}}>Q{String(curQ.id)}</div>
    <h3 style={{fontFamily:FH,fontSize:15,fontWeight:700,margin:"4px 0 10px",lineHeight:1.3}}>{curQ.q}</h3>
    {curQ.note&&<div style={{fontSize:10,color:T.orange,marginBottom:8}}>ℹ️ {curQ.note}</div>}
    {curQ.t==="s"&&curQ.o.map(opt=>(<div key={opt} onClick={()=>setAns(p=>({...p,[curQ.id]:opt}))} style={{padding:"8px 10px",margin:"3px 0",borderRadius:6,cursor:"pointer",border:`1.5px solid ${ans[curQ.id]===opt?T.teal:T.border}`,background:ans[curQ.id]===opt?T.tealBg:"transparent"}}><div style={S.flex}><div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${ans[curQ.id]===opt?T.teal:T.inkDim}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{ans[curQ.id]===opt&&<div style={{width:6,height:6,borderRadius:"50%",background:T.teal}}/>}</div><span style={{fontSize:12,color:ans[curQ.id]===opt?T.ink:T.inkSec}}>{opt}</span></div></div>))}
    {curQ.t==="m"&&<Chips options={curQ.o} selected={ma[curQ.id]||[]} onToggle={val=>setMa(p=>{const c=p[curQ.id]||[];return{...p,[curQ.id]:c.includes(val)?c.filter(x=>x!==val):[...c,val]};})} max={curQ.o.length}/>}
    {curQ.t==="x"&&<textarea style={{...S.input,minHeight:60}} placeholder="Response..." value={ft[curQ.id]||""} onChange={e=>setFt(p=>({...p,[curQ.id]:e.target.value}))}/>}
    {curQ.t==="job"&&(<div>
      <div style={{fontSize:11,fontWeight:600,marginBottom:5}}>Suggested roles ({aiv.emp.role} path):</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>{jobSugg.map(j=>(<span key={j} onClick={()=>setAns(p=>({...p,[curQ.id]:j}))} style={{...S.badge,cursor:"pointer",padding:"5px 10px",fontSize:11,background:ans[curQ.id]===j?T.tealBg:T.bgSoft,color:ans[curQ.id]===j?T.teal:T.inkSec,border:`1.5px solid ${ans[curQ.id]===j?T.teal:T.border}`,borderRadius:6}}>{j}</span>))}</div>
      <div style={{fontSize:11,fontWeight:600,marginBottom:3}}>Or custom:</div>
      <input style={S.input} placeholder="e.g. Agentic AI Lead..." value={ft["3c"]||""} onChange={e=>{setFt(p=>({...p,"3c":e.target.value}));if(e.target.value)setAns(p=>({...p,[curQ.id]:e.target.value}));}}/>
      {ans[curQ.id]&&<div style={{marginTop:6,padding:"4px 8px",background:T.tealBg,borderRadius:5,fontSize:10,color:T.teal,fontWeight:600}}>→ {ans[curQ.id]}</div>}
    </div>)}
    </div>):(<div style={{...S.card,padding:18,marginTop:6,textAlign:"center",color:T.inkMuted}}>⏭️ Skipped</div>)}
    <div style={{...S.between,marginTop:8}}><button onClick={()=>setCq(p=>Math.max(0,p-1))} disabled={cq===0} style={{...S.btn,...S.btnO}}>←</button>{cq<IQ.length-1?<button onClick={()=>setCq(p=>p+1)} style={S.btn}>Next→</button>:<button onClick={complIV} style={{...S.btn,...S.btnG}}>✅ Complete → Gap + Plan</button>}</div></div>);
  }

  // ═══ LIST VIEW — distinct Gap + Plan buttons ═══
  const SchM=()=>showSch?(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowSch(false)}><div style={{...S.card,width:360,padding:22,animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}><h3 style={S.h3}>Schedule Interview</h3><div style={{marginTop:10,marginBottom:8}}><label style={S.label}>Employee</label><select style={{...S.select,width:"100%"}} value={schEmp} onChange={e=>setSchEmp(e.target.value)}><option value="">Select...</option>{EMP.map(e=><option key={e.id} value={e.name}>{e.name} — {e.role}</option>)}</select></div><div style={{marginBottom:8}}><label style={S.label}>Date</label><input style={S.input} type="date" value={schDt} onChange={e=>setSchDt(e.target.value)}/></div><div style={S.flex}><button onClick={doSch} style={S.btn}>✅ Schedule</button><button onClick={()=>setShowSch(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div></div></div>):null;

  return(<div><SchM/>
    <div style={S.between}><div/><button onClick={()=>setShowSch(true)} style={S.btn}>+ Schedule Interview</button></div>
    {ivs.map(iv=>(<div key={iv.id} style={S.card}>
      <div style={S.between}>
        <div style={S.flex}><div style={{width:30,height:30,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{iv.emp.avatar}</div><div><div style={{fontSize:12,fontWeight:600}}>{iv.emp.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{iv.emp.role}</div></div></div>
        <div style={S.flex}><span style={{fontSize:10,color:T.inkMuted}}>{iv.date}</span><Bd status={iv.st}/></div>
      </div>
      <WFS step={iv.wf}/>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {iv.st==="Scheduled"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>▶ Start</button>}
        {iv.st==="In Progress"&&<button onClick={()=>startIV(iv)} style={{...S.btn,...S.btnSm}}>↺ Resume</button>}
        {iv.gap&&<button onClick={()=>{setPv(iv);setV("gap");}} style={{...S.btn,...S.btnSm,background:T.red,color:"#fff"}}>🔬 Gap Analysis</button>}
        {iv.plan&&<button onClick={()=>{setPv(iv);setV("plan");}} style={{...S.btn,...S.btnSm,...S.btnG}}>📋 Action Plan</button>}
      </div>
    </div>))}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// CAREERS — with focusSkill highlight
// ══════════════════════════════════════════════════════════════
const PgCareer=({focusSkill})=>{
  const all=useMemo(()=>genPaths(),[]);
  const[df,setDf]=useState("All");const[q,setQ]=useState(focusSkill||"");const[exp,setExp]=useState(null);const[pg,setPg]=useState(0);const pp=12;
  const fil=all.filter(p=>(df==="All"||p.domain===df)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.steps.some(s=>s.title.toLowerCase().includes(q.toLowerCase())||s.skills.some(sk=>sk.toLowerCase().includes(q.toLowerCase())))));
  const paged=fil.slice(pg*pp,(pg+1)*pp);const tp=Math.ceil(fil.length/pp);
  
  const Graph=({steps})=>(<div style={{padding:"8px 0",overflowX:"auto"}}><div style={{display:"flex",alignItems:"flex-start",minWidth:steps.length*110}}>{steps.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div style={{textAlign:"center",width:95}}><div style={{width:30,height:30,borderRadius:7,background:i===0?T.tealBg:i===steps.length-1?`${T.axaBlue}08`:T.bgMuted,border:`2px solid ${i===0?T.teal:i===steps.length-1?T.axaBlue:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:9,fontWeight:700,color:i===0?T.teal:i===steps.length-1?T.axaBlue:T.inkSec}}>L{s.level}</div><div style={{fontSize:9,fontWeight:600,marginTop:3}}>{s.title}</div><div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center",marginTop:3}}>{s.skills.map(sk=>(<span key={sk} title={`Click for ${sk} learning`} style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:focusSkill===sk?T.orangeBg:T.tealBg,color:focusSkill===sk?T.orange:T.teal,fontWeight:600,cursor:"pointer"}}>{sk}</span>))}</div></div>{i<steps.length-1&&<svg width="18" height="14" viewBox="0 0 18 14" style={{margin:"0 -2px",marginBottom:26}}><path d="M2 7h12m-3-3l3 3-3 3" stroke={T.teal} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}</div>))}</div></div>);
  
  return(<div>
    {focusSkill&&<div style={{...S.card,background:T.orangeBg,borderColor:T.orange,padding:10}}>
      <div style={S.flex}><span>🎯</span><span style={{fontSize:11,fontWeight:700,color:T.orange}}>Focused on skill: {focusSkill}</span></div>
      <div style={{marginTop:6,fontSize:11,color:T.inkSec}}>
        📚 <strong>Training:</strong> {getLearning(focusSkill).train} · 🏅 <strong>Cert:</strong> {getLearning(focusSkill).cert} · 👤 <strong>Mentor:</strong> {getLearning(focusSkill).mentor}
      </div>
    </div>}
    <div style={{...S.card,padding:10}}><div style={{...S.flex,gap:6}}><input style={{...S.input,maxWidth:160}} placeholder="Search..." value={q} onChange={e=>{setQ(e.target.value);setPg(0);}}/><select style={S.select} value={df} onChange={e=>{setDf(e.target.value);setPg(0);}}><option value="All">All</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select><span style={{fontSize:10,color:T.inkMuted,marginLeft:"auto"}}>{fil.length}</span></div></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:3,margin:"5px 0"}}>{DOMAINS.map(d=><span key={d} onClick={()=>{setDf(df===d?"All":d);setPg(0);}} style={{...S.badge,cursor:"pointer",background:df===d?T.tealBg:T.bgSoft,color:df===d?T.teal:T.inkMuted,border:`1px solid ${df===d?T.teal:"transparent"}`}}>{d}</span>)}</div>
    <div style={S.g3}>{paged.map(p=>(<div key={p.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setExp(exp===p.id?null:p.id)}><div style={S.between}><Bd status={p.domain} custom={T.teal}/><Bd status={p.type} custom={T.violet}/></div><h4 style={{fontSize:11,fontWeight:700,margin:"5px 0 2px"}}>{p.name}</h4>{exp===p.id&&<Graph steps={p.steps}/>}</div>))}</div>
    <div style={{...S.flex,justifyContent:"center",marginTop:8,gap:5}}><button disabled={pg===0} onClick={()=>setPg(p=>p-1)} style={{...S.btn,...S.btnSm,...S.btnO}}>←</button><span style={{fontSize:10,color:T.inkMuted}}>{pg+1}/{tp}</span><button disabled={pg>=tp-1} onClick={()=>setPg(p=>p+1)} style={{...S.btn,...S.btnSm,...S.btnO}}>→</button></div>
  </div>);
};

// ══════════════════════════════════════════════════════════════
// DATA & REFERENTIALS — unified Skills + Paths + Jobs (ATS)
// ══════════════════════════════════════════════════════════════
const PgRefs=({store,setStore,setToast})=>{
  const[tab,setTab]=useState("skills");
  const[q,setQ]=useState("");
  const added=store.addedSkills||[];
  const allSk=[...SKILLS,...added];
  const allPaths=useMemo(()=>genPaths(),[]);
  const[newSk,setNewSk]=useState("");const[newCat,setNewCat]=useState("Technical");const[showAdd,setShowAdd]=useState(false);
  
  const addSk=()=>{if(!newSk.trim())return;if(allSk.find(s=>s.toLowerCase()===newSk.trim().toLowerCase())){setToast("⚠️ Duplicate skill");return;}setStore(p=>({...p,addedSkills:[...(p.addedSkills||[]),newSk.trim()]}));setToast("✅ Skill added");setNewSk("");setShowAdd(false);};
  
  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:12}}>
      <button onClick={()=>setTab("skills")} style={{...S.btn,background:tab==="skills"?T.teal:T.bgSoft,color:tab==="skills"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>💡 Skills ({allSk.length})</button>
      <button onClick={()=>setTab("paths")} style={{...S.btn,background:tab==="paths"?T.ocean:T.bgSoft,color:tab==="paths"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>🚀 Career Paths ({allPaths.length})</button>
      <button onClick={()=>setTab("jobs")} style={{...S.btn,background:tab==="jobs"?T.violet:T.bgSoft,color:tab==="jobs"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>📋 Job Descriptions / ATS ({JOBS.length})</button>
    </div>
    
    {tab==="skills"&&<div>
      <div style={S.between}>
        <input style={{...S.input,maxWidth:260}} placeholder="Search skills..." value={q} onChange={e=>setQ(e.target.value)}/>
        <button onClick={()=>setShowAdd(true)} style={S.btn}>+ Add Skill</button>
      </div>
      {showAdd&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowAdd(false)}><div style={{...S.card,width:340,padding:20}} onClick={e=>e.stopPropagation()}><h3 style={S.h3}>Add Skill</h3><div style={{marginTop:8,marginBottom:6}}><label style={S.label}>Name</label><input style={S.input} value={newSk} onChange={e=>setNewSk(e.target.value)} autoFocus/></div><div style={{marginBottom:6}}><label style={S.label}>Category</label><select style={{...S.select,width:"100%"}} value={newCat} onChange={e=>setNewCat(e.target.value)}>{Object.keys(SKILL_CATS).map(c=><option key={c}>{c}</option>)}</select></div><div style={S.flex}><button onClick={addSk} style={S.btn}>Add</button><button onClick={()=>setShowAdd(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div></div></div>}
      {Object.entries(SKILL_CATS).map(([cat,sks])=>{const f=[...sks,...(cat==="Technical"?added:[])].filter(s=>!q||s.toLowerCase().includes(q.toLowerCase()));if(!f.length)return null;return<div key={cat} style={S.card}><h3 style={{...S.h3,marginBottom:6}}>{cat} ({f.length})</h3><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{f.map(s=>(<div key={s} title={`${getLearning(s).train}`} style={{background:T.bgMuted,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 8px",fontSize:10}}>{s}</div>))}</div></div>;})}
    </div>}
    
    {tab==="paths"&&<div>
      <input style={{...S.input,maxWidth:260,marginBottom:10}} placeholder="Search paths..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div style={S.g3}>{allPaths.filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase())).slice(0,18).map(p=>(<div key={p.id} style={S.card}><div style={S.between}><Bd status={p.domain} custom={T.teal}/><Bd status={p.type} custom={T.violet}/></div><h4 style={{fontSize:11,fontWeight:700,marginTop:6}}>{p.name}</h4><div style={{fontSize:10,color:T.inkMuted,marginTop:3}}>{p.steps.length} levels</div></div>))}</div>
      <div style={{fontSize:10,color:T.inkMuted,textAlign:"center",marginTop:10}}>Showing 18 of {allPaths.length}. Use Careers module for full catalog.</div>
    </div>}
    
    {tab==="jobs"&&<div>
      <input style={{...S.input,maxWidth:260,marginBottom:10}} placeholder="Search jobs..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div style={{fontSize:11,color:T.inkMuted,marginBottom:8}}>📡 Synced from ATS · {JOBS.length} open positions</div>
      <div style={S.g2}>{JOBS.filter(j=>!q||j.title.toLowerCase().includes(q.toLowerCase())).map(j=>(<div key={j.id} style={S.card}>
        <div style={S.between}><h4 style={{fontSize:13,fontWeight:700,margin:0}}>{j.title}</h4><Bd status={j.urgency}/></div>
        <div style={{fontSize:10,color:T.inkSec,marginTop:4}}>{j.id} · {j.entity} · {j.city}, {j.country}</div>
        <p style={{fontSize:10,color:T.inkMuted,marginTop:6,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{j.desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:6}}>{j.skills.slice(0,4).map(sk=><span key={sk} style={{...S.tag,fontSize:9}}>{sk}</span>)}</div>
        <div style={{fontSize:9,color:T.inkDim,marginTop:6}}>{j.tasks.length} tasks · {j.milestones.length} milestones · {j.deliverables.length} deliverables</div>
      </div>))}</div>
    </div>}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// AI AGENTS MANAGEMENT — NEW MODULE
// ══════════════════════════════════════════════════════════════
const PgAgents=({store,setStore,setToast})=>{
  const agents=store.agents||DEFAULT_AGENTS;
  const setAgents=(fn)=>{const updated=typeof fn==="function"?fn(agents):fn;setStore(p=>({...p,agents:updated}));};
  const tasks=store.agentTasks||[];
  const setTasks=(fn)=>{const updated=typeof fn==="function"?fn(tasks):fn;setStore(p=>({...p,agentTasks:updated}));};
  
  const[view,setView]=useState("list");
  const[sel,setSel]=useState(null);
  const[showNew,setShowNew]=useState(false);
  const[showTask,setShowTask]=useState(false);
  const[newA,setNewA]=useState({name:"",role:"",prompt:"",model:LLM_MODELS[0],validator:"",container:CONTAINERS[0],status:"idle"});
  const[newT,setNewT]=useState({title:"",desc:"",agentId:"auto"});

  const createAgent=()=>{
    if(!newA.name||!newA.role||!newA.prompt){setToast("⚠️ Name, role and prompt required");return;}
    const agent={...newA,id:`ai-${Date.now()}`,accuracy:85,tasks:0,deployed:new Date().toISOString().slice(0,10)};
    setAgents(p=>[...p,agent]);
    setToast("✅ Agent created");
    setShowNew(false);
    setNewA({name:"",role:"",prompt:"",model:LLM_MODELS[0],validator:"",container:CONTAINERS[0],status:"idle"});
  };
  
  const updateStatus=(id,status)=>{setAgents(p=>p.map(a=>a.id===id?{...a,status}:a));setToast(`Agent ${status}`);};
  
  const createTask=()=>{
    if(!newT.title){setToast("⚠️ Title required");return;}
    // Auto-assign: find agent matching task keywords
    let agentId=newT.agentId;
    if(agentId==="auto"){
      const words=(newT.title+" "+newT.desc).toLowerCase();
      const match=agents.find(a=>words.includes(a.role.toLowerCase().split(" ")[0]));
      agentId=match?.id||agents[0]?.id;
    }
    const task={id:Date.now(),title:newT.title,desc:newT.desc,agentId,status:"Assigned",created:new Date().toISOString().slice(0,10)};
    setTasks(p=>[...p,task]);
    setAgents(p=>p.map(a=>a.id===agentId?{...a,tasks:a.tasks+1}:a));
    setToast(`✅ Task assigned to ${agents.find(a=>a.id===agentId)?.name}`);
    setShowNew(false);setShowTask(false);
    setNewT({title:"",desc:"",agentId:"auto"});
  };

  if(view==="detail"&&sel){
    const agentTasks=tasks.filter(t=>t.agentId===sel.id);
    return(<div>
      <button onClick={()=>{setView("list");setSel(null);}} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:10}}>← Back</button>
      <div style={{...S.card,padding:22}}>
        <div style={S.between}>
          <div style={S.flex}><span style={{fontSize:24}}>🤖</span><div><h2 style={S.h1}>{sel.name}</h2><p style={{fontSize:11,color:T.inkSec}}>{sel.role}</p></div></div>
          <Bd status={sel.status}/>
        </div>
        <div style={{...S.g3,marginTop:14}}>
          <div><div style={S.label}>Model</div><div style={{fontSize:12,fontWeight:600}}>{sel.model}</div></div>
          <div><div style={S.label}>Container</div><div style={{fontSize:12,fontWeight:600}}>{sel.container}</div></div>
          <div><div style={S.label}>Validator</div><div style={{fontSize:12,fontWeight:600}}>{sel.validator||"—"}</div></div>
          <div><div style={S.label}>Accuracy</div><div style={{fontSize:12,fontWeight:600,color:T.teal}}>{sel.accuracy}%</div></div>
          <div><div style={S.label}>Tasks Done</div><div style={{fontSize:12,fontWeight:600}}>{sel.tasks}</div></div>
          <div><div style={S.label}>Deployed</div><div style={{fontSize:12,fontWeight:600}}>{sel.deployed}</div></div>
        </div>
        <div style={{marginTop:14}}><div style={S.label}>Specialization Prompt</div><div style={{padding:12,background:T.bgMuted,borderRadius:6,fontSize:11,color:T.inkSec,lineHeight:1.5,fontFamily:"monospace"}}>{sel.prompt}</div></div>
        <div style={{...S.flex,marginTop:14,flexWrap:"wrap"}}>
          {sel.status!=="active"&&<button onClick={()=>updateStatus(sel.id,"active")} style={{...S.btn,background:T.teal}}>▶ Deploy</button>}
          {sel.status==="active"&&<button onClick={()=>updateStatus(sel.id,"idle")} style={{...S.btn,background:T.orange}}>⏸ Pause</button>}
          <button onClick={()=>updateStatus(sel.id,"training")} style={{...S.btn,...S.btnO}}>🎓 Retrain</button>
          <button onClick={()=>setShowTask(true)} style={S.btn}>+ Assign Task</button>
        </div>
      </div>
      
      <h3 style={{...S.h3,marginTop:16,marginBottom:6}}>Task History ({agentTasks.length})</h3>
      {agentTasks.length===0?<div style={{...S.card,textAlign:"center",color:T.inkMuted,fontSize:11}}>No tasks assigned yet</div>:agentTasks.map(t=>(<div key={t.id} style={S.card}>
        <div style={S.between}><div style={{fontSize:12,fontWeight:600}}>{t.title}</div><Bd status={t.status}/></div>
        <div style={{fontSize:11,color:T.inkSec,marginTop:4}}>{t.desc}</div>
        <div style={{fontSize:9,color:T.inkDim,marginTop:4}}>Created: {t.created}</div>
      </div>))}
      
      {showTask&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowTask(false)}><div style={{...S.card,width:420,padding:22}} onClick={e=>e.stopPropagation()}>
        <h3 style={S.h3}>Assign Task to {sel.name}</h3>
        <div style={{marginTop:10}}><label style={S.label}>Task Title</label><input style={S.input} value={newT.title} onChange={e=>setNewT(p=>({...p,title:e.target.value}))}/></div>
        <div style={{marginTop:10}}><label style={S.label}>Description</label><textarea style={{...S.input,minHeight:60}} value={newT.desc} onChange={e=>setNewT(p=>({...p,desc:e.target.value}))}/></div>
        <div style={{...S.flex,marginTop:14}}><button onClick={()=>{setNewT(p=>({...p,agentId:sel.id}));createTask();}} style={S.btn}>✅ Assign</button><button onClick={()=>setShowTask(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
      </div></div>}
    </div>);
  }

  return(<div>
    <div style={S.between}>
      <div><h3 style={S.h3}>AI Agents Management</h3><p style={{fontSize:11,color:T.inkMuted,marginTop:2}}>Create, configure, deploy and assign tasks to AI agents</p></div>
      <div style={S.flex}>
        <button onClick={()=>setShowTask(true)} style={{...S.btn,...S.btnO}}>+ Task (Auto-assign)</button>
        <button onClick={()=>setShowNew(true)} style={S.btn}>+ New Agent</button>
      </div>
    </div>
    
    <div style={{...S.g4,marginTop:12}}>
      {[{l:"Active",v:agents.filter(a=>a.status==="active").length,c:T.teal},{l:"Training",v:agents.filter(a=>a.status==="training").length,c:T.orange},{l:"Idle",v:agents.filter(a=>a.status==="idle").length,c:T.inkMuted},{l:"Total Tasks",v:agents.reduce((s,a)=>s+a.tasks,0),c:T.violet}].map(k=>(<div key={k.l} style={S.card}><div style={{fontSize:9,color:T.inkMuted,textTransform:"uppercase",fontWeight:600}}>{k.l}</div><div style={{fontSize:24,fontWeight:800,fontFamily:FH,color:k.c,marginTop:4}}>{k.v}</div></div>))}
    </div>
    
    <div style={{...S.g2,marginTop:12}}>{agents.map(a=>(<div key={a.id} style={{...S.card,cursor:"pointer",borderLeft:`4px solid ${a.status==="active"?T.teal:a.status==="training"?T.orange:T.inkDim}`}} onClick={()=>{setSel(a);setView("detail");}}>
      <div style={S.between}>
        <div style={S.flex}><span style={{fontSize:18}}>🤖</span><div><div style={{fontSize:13,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.role}</div></div></div>
        <Bd status={a.status}/>
      </div>
      <div style={{fontSize:10,color:T.inkSec,marginTop:6}}>Model: <strong>{a.model}</strong> · Container: <strong>{a.container}</strong></div>
      <div style={{fontSize:10,color:T.inkSec,marginTop:2}}>Validator: <strong>{a.validator||"—"}</strong></div>
      <div style={{...S.flex,marginTop:8}}>
        <div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div>
        <span style={{fontSize:10,fontWeight:700,color:T.violet}}>{a.accuracy}%</span>
        <span style={{fontSize:10,color:T.inkMuted,marginLeft:8}}>{a.tasks} tasks</span>
      </div>
    </div>))}</div>
    
    {showNew&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}} onClick={()=>setShowNew(false)}><div style={{...S.card,width:480,padding:24,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <h3 style={S.h3}>Create AI Agent</h3>
      <div style={{marginTop:12}}><label style={S.label}>Name *</label><input style={S.input} value={newA.name} onChange={e=>setNewA(p=>({...p,name:e.target.value}))} placeholder="AXA-MyAgent"/></div>
      <div style={{marginTop:10}}><label style={S.label}>Role / Specialization *</label><input style={S.input} value={newA.role} onChange={e=>setNewA(p=>({...p,role:e.target.value}))} placeholder="e.g. Claims Triage"/></div>
      <div style={{marginTop:10}}><label style={S.label}>Specialization Prompt *</label><textarea style={{...S.input,minHeight:80}} value={newA.prompt} onChange={e=>setNewA(p=>({...p,prompt:e.target.value}))} placeholder="You are an expert in..."/></div>
      <div style={{...S.g2,marginTop:10,gap:10}}>
        <div><label style={S.label}>LLM Model</label><select style={{...S.select,width:"100%"}} value={newA.model} onChange={e=>setNewA(p=>({...p,model:e.target.value}))}>{LLM_MODELS.map(m=><option key={m}>{m}</option>)}</select></div>
        <div><label style={S.label}>Container</label><select style={{...S.select,width:"100%"}} value={newA.container} onChange={e=>setNewA(p=>({...p,container:e.target.value}))}>{CONTAINERS.map(c=><option key={c}>{c}</option>)}</select></div>
      </div>
      <div style={{marginTop:10}}><label style={S.label}>Human Validator (Manager)</label><select style={{...S.select,width:"100%"}} value={newA.validator} onChange={e=>setNewA(p=>({...p,validator:e.target.value}))}><option value="">Select...</option>{EMP.filter(e=>e.level==="Lead"||e.level==="Senior").map(e=><option key={e.id}>{e.name}</option>)}</select></div>
      <div style={{...S.flex,marginTop:16}}><button onClick={createAgent} style={S.btn}>✅ Create Agent</button><button onClick={()=>setShowNew(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
    </div></div>}
    
    {showTask&&!sel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowTask(false)}><div style={{...S.card,width:440,padding:22}} onClick={e=>e.stopPropagation()}>
      <h3 style={S.h3}>Create Task · Auto-Assign</h3>
      <p style={{fontSize:11,color:T.inkMuted,marginTop:4}}>Task will be auto-assigned to the agent matching its specialization.</p>
      <div style={{marginTop:10}}><label style={S.label}>Task Title *</label><input style={S.input} value={newT.title} onChange={e=>setNewT(p=>({...p,title:e.target.value}))}/></div>
      <div style={{marginTop:10}}><label style={S.label}>Description</label><textarea style={{...S.input,minHeight:60}} value={newT.desc} onChange={e=>setNewT(p=>({...p,desc:e.target.value}))}/></div>
      <div style={{marginTop:10}}><label style={S.label}>Assign To</label><select style={{...S.select,width:"100%"}} value={newT.agentId} onChange={e=>setNewT(p=>({...p,agentId:e.target.value}))}><option value="auto">🤖 Auto-assign (based on specialization)</option>{agents.map(a=><option key={a.id} value={a.id}>{a.name} — {a.role}</option>)}</select></div>
      <div style={{...S.flex,marginTop:14}}><button onClick={createTask} style={S.btn}>✅ Create Task</button><button onClick={()=>setShowTask(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
    </div></div>}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════
const PgRep=({store})=>{
  const agents=store.agents||DEFAULT_AGENTS;
  return(<div>
    <div style={S.g4}>{[{l:"Mobility",v:"23%",p:77,c:T.teal},{l:"Fill",v:"18d",p:90,c:T.green},{l:"Skills",v:"72%",p:85,c:T.ocean},{l:"Plans",v:"42",p:70,c:T.violet}].map(m=>(<div key={m.l} style={S.card}><div style={{fontSize:9,color:T.inkMuted,textTransform:"uppercase",fontWeight:600}}>{m.l}</div><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:m.c,margin:"3px 0"}}>{m.v}</div><Bar pct={m.p} color={m.c}/></div>))}</div>
    <div style={S.g2}>
      <div style={S.card}><h3 style={{...S.h3,marginBottom:6}}>By Domain</h3>{DOMAINS.slice(0,5).map((d,i)=>(<div key={d} style={{...S.flex,marginBottom:5}}><span style={{fontSize:10,color:T.inkMuted,width:90}}>{d}</span><div style={{flex:1}}><Bar pct={[65,82,45,58,73][i]}/></div><span style={{fontSize:10,fontWeight:600,width:24,textAlign:"right"}}>{[65,82,45,58,73][i]}%</span></div>))}</div>
      <div style={S.card}><h3 style={{...S.h3,marginBottom:6}}>AI Agents</h3>{agents.map(a=>(<div key={a.id} style={{...S.flex,marginBottom:5}}><span style={{fontSize:10,width:100}}>{a.name}</span><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet,width:28,textAlign:"right"}}>{a.accuracy}%</span></div>))}</div>
    </div>
  </div>);
};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function App(){
  const[auth,setAuth]=useState(false);
  const[persona,setPersona]=useState(null);
  const[pg,setPg]=useState("dashboard");
  const[store,setStore]=useState(loadStore());
  const[toast,setToast]=useState(null);
  const[focusSkill,setFocusSkill]=useState(null);
  
  useEffect(()=>{saveStore(store);},[store]);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t);}},[toast]);
  useEffect(()=>{if(focusSkill&&pg!=="careers"){setFocusSkill(null);}},[pg,focusSkill]);
  
  if(!auth)return<Auth onLogin={p=>{setPersona(p);setAuth(true);}}/>;
  
  const titles={dashboard:"Dashboard",charter:"Smart Charter",marketplace:"Talent Marketplace",team:"My Team",interviews:"Career Interviews",careers:"Career Paths",refs:"Data & Referentials",agents:"AI Agents Management",reports:"Reports"};
  const pages={
    dashboard:<PgDash go={setPg} store={store}/>,
    charter:<PgCharter/>,
    marketplace:<PgMarket persona={persona} store={store} setStore={setStore} setToast={setToast} go={setPg}/>,
    team:<PgTeam store={store}/>,
    interviews:<PgIV persona={persona} store={store} setStore={setStore} setToast={setToast} go={setPg} setFocusSkill={setFocusSkill}/>,
    careers:<PgCareer focusSkill={focusSkill}/>,
    refs:<PgRefs store={store} setStore={setStore} setToast={setToast}/>,
    agents:<PgAgents store={store} setStore={setStore} setToast={setToast}/>,
    reports:<PgRep store={store}/>,
  };
  
  return(<div style={{fontFamily:FT,background:T.bg,color:T.ink,minHeight:"100vh",display:"flex",overflow:"hidden",height:"100vh",fontSize:12}}>
    <style>{css}</style>
    <Side active={pg} go={setPg} persona={persona} onLogout={()=>{setAuth(false);setPersona(null);setPg("dashboard");}}/>
    <div style={{flex:1,overflow:"auto",padding:"0 22px 22px"}}>
      <div style={{...S.between,padding:"10px 0 12px",borderBottom:`1px solid ${T.border}`,marginBottom:12}}>
        <div><h1 style={S.h1}>{titles[pg]}</h1><p style={{fontSize:10,color:T.inkMuted,marginTop:1}}>Mobility by Design · AXA Group Ops · v7.1</p></div>
        <div style={S.flex}><Bd status={persona?.label} custom={persona?.color}/></div>
      </div>
      {pages[pg]}
    </div>
    <Toast msg={toast}/>
  </div>);
}
