import { useState, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   SMART MOBILITY v8.0 — AXA Group Operations
   PREMIUM ENTERPRISE EXPERIENCE
   ✓ Charter: Manifesto + Commitments + Expectations + 3-Year Plan
   ✓ Enriched Workforce ID Card: Manager + Entity + LinkedIn + CV + Tabs
   ✓ AI Skill Assessment with dynamic questionnaire
   ✓ Job Matching step (post-interview/gap/plan)
   ✓ All v7.1 features preserved
   ═══════════════════════════════════════════════════════════════ */

const T={axaBlue:"#00008F",axaNavy:"#000062",axaMid:"#3032C1",axaRed:"#FF1721",axaGold:"#FFC857",bg:"#F4F4F0",bgSoft:"#ECEEE8",bgCard:"#FFFFFF",bgMuted:"#F8F8F5",border:"#DDD9D0",ink:"#1B1B18",inkSec:"#555550",inkMuted:"#8A8A80",inkDim:"#B5B5AA",teal:"#0C8C6E",tealBg:"#E8F5F0",red:"#CC2200",redBg:"#FFF0EC",orange:"#CC7A00",orangeBg:"#FFF5E6",violet:"#5B47C0",violetBg:"#F0EDFF",ocean:"#0070A8",oceanBg:"#EAF5FA",green:"#0C8C6E"};
const FT="'DM Sans',-apple-system,sans-serif";const FH="'Newsreader',Georgia,serif";
const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&display=swap');*{margin:0;padding:0;box-sizing:border-box}button{cursor:pointer;font-family:${FT}}input,select,textarea{font-family:${FT}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${T.bgSoft}}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes popIn{0%{transform:scale(.96);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.85;transform:scale(1.02)}}`;
const S={card:{background:T.bgCard,borderRadius:10,border:`1px solid ${T.border}`,padding:18,marginBottom:12,animation:"fadeUp .3s ease",boxShadow:"0 1px 3px rgba(0,0,0,.03)"},btn:{background:T.axaBlue,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontWeight:600,fontSize:12,display:"inline-flex",alignItems:"center",gap:5,transition:"all .15s"},btnSm:{padding:"5px 12px",fontSize:11},btnO:{background:"transparent",border:`1.5px solid ${T.axaBlue}`,color:T.axaBlue},btnG:{background:`linear-gradient(135deg,${T.teal},${T.ocean})`},badge:{display:"inline-block",padding:"2px 9px",borderRadius:16,fontSize:10,fontWeight:600},input:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,width:"100%",outline:"none",boxSizing:"border-box"},select:{background:T.bgSoft,border:`1.5px solid ${T.border}`,borderRadius:7,padding:"9px 12px",color:T.ink,fontSize:12,outline:"none"},label:{fontSize:10,color:T.inkMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5,display:"block"},tag:{background:T.tealBg,color:T.teal,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,display:"inline-block"},flex:{display:"flex",alignItems:"center",gap:8},between:{display:"flex",justifyContent:"space-between",alignItems:"center"},g2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},g3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12},g4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10},h1:{fontFamily:FH,fontSize:24,fontWeight:700,color:T.ink},h3:{fontSize:14,fontWeight:700,color:T.ink}};

const Bd=({status,custom})=>{const m={active:T.teal,training:T.orange,idle:T.inkMuted,completed:T.teal,"in progress":T.ocean,"not started":T.inkDim,planned:T.violet,registered:T.orange,achieved:T.teal,Senior:T.teal,Mid:T.ocean,Junior:T.orange,Lead:T.violet,High:T.red,Medium:T.orange,Low:T.inkMuted,Validated:T.teal,Finalized:T.teal,Draft:T.inkMuted,Locked:T.violet,Interested:T.orange,Matched:T.teal,Applied:T.teal};const c=custom||m[status]||m[status?.toLowerCase()]||T.inkMuted;return<span style={{...S.badge,background:`${c}14`,color:c,border:`1px solid ${c}20`}}>{status}</span>;};
const Bar=({pct,color=T.teal,h=5})=>(<div style={{height:h,borderRadius:h,background:T.bgSoft,width:"100%",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h,transition:"width .5s"}}/></div>);
const Chips=({options,selected,onToggle,max=20})=>(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{options.slice(0,max).map(o=>(<span key={o} onClick={()=>onToggle(o)} style={{...S.badge,cursor:"pointer",background:selected.includes(o)?T.tealBg:T.bgSoft,color:selected.includes(o)?T.teal:T.inkMuted,border:`1px solid ${selected.includes(o)?T.teal:"transparent"}`}}>{o}</span>))}</div>);
const Toast=({msg,color=T.teal})=>msg?<div style={{position:"fixed",bottom:20,right:20,background:color,color:"#fff",padding:"10px 18px",borderRadius:8,fontSize:12,fontWeight:600,boxShadow:"0 4px 12px rgba(0,0,0,.2)",zIndex:9999,animation:"fadeUp .3s ease",maxWidth:340}}>{msg}</div>:null;

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const SKILLS=["Python","JavaScript","React","TypeScript","Azure","AWS","Machine Learning","Deep Learning","NLP","Data Engineering","SQL","Power BI","Tableau","Agile","Scrum","DevOps","CI/CD","Kubernetes","Docker","Terraform","Project Management","Change Management","Stakeholder Management","Risk Analysis","Financial Modeling","UX Design","API Design","Microservices","Cloud Architecture","Cybersecurity","Data Privacy","GDPR","Communication","Leadership","Strategic Thinking","Problem Solving","Prompt Engineering","Agentic AI","RPA","Process Automation","Business Analysis","Product Management","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Data Governance","Insurance Domain","Negotiation","Presentation Skills"];
const SKILL_CATS={"Technical":["Python","JavaScript","React","TypeScript","SQL","Docker","Kubernetes","Terraform","CI/CD","API Design"],"AI & Data":["Machine Learning","Deep Learning","NLP","GenAI","LLM Fine-tuning","RAG Architecture","MLOps","Prompt Engineering","Agentic AI"],"Cloud":["Azure","AWS","Cloud Architecture","DevOps","Cybersecurity"],"Business":["Project Management","Change Management","Stakeholder Management","Business Analysis","Product Management","Financial Modeling","Risk Analysis"],"Soft Skills":["Communication","Leadership","Strategic Thinking","Problem Solving","Negotiation","Presentation Skills"],"Compliance":["Data Privacy","GDPR","Data Governance","Insurance Domain"]};

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
  "Product Management":{train:"Product Mastery (Reforge)",cert:"AIPMM CPM",mentor:"Amina Benali"},
};
const getLearning=sk=>LEARNING[sk]||{train:`${sk} Fundamentals (AXA Univ)`,cert:`${sk} Certification`,mentor:"To be assigned"};

const PERSONAS=[{id:"admin",label:"Admin",desc:"Full platform access + AI management",color:T.axaBlue,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents","reports"],role:"admin"},{id:"hr",label:"Hr",desc:"Workforce + analytics + interviews",color:T.teal,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents","reports"],role:"hr"},{id:"manager",label:"Manager",desc:"Team management + marketplace",color:T.ocean,access:["dashboard","charter","marketplace","team","interviews","careers","refs","agents"],role:"manager"},{id:"employee",label:"Employee",desc:"My career, skills & opportunities",color:T.violet,access:["dashboard","charter","marketplace","careers","refs"],role:"employee"}];

// ENRICHED EMP DATA — v8 adds manager, entity, linkedin, cv
const EMP=[
  {id:1,name:"Sophie Laurent",role:"Data Scientist",dept:"Data & AI",entity:"AXA France",manager:"Karim Hassan",linkedin:"linkedin.com/in/sophie-laurent",cv:"sophie_laurent_cv.pdf",email:"sophie.laurent@axa.com",skills:["Python","Machine Learning","SQL","Deep Learning","NLP"],level:"Senior",avatar:"SL",aiLvl:"Advanced",yrs:7,mobility:true,intent:"AI leadership",perf:[{yr:"2025",score:4.5,note:"Exceeds"},{yr:"2024",score:4.2,note:"Strong"}],teams:["DS Core","AI Lab"],bg:"MSc Polytechnique. 7y data.",exp:[{role:"Data Scientist",company:"AXA France",years:"2022-Now"},{role:"Junior DS",company:"BNP Paribas",years:"2019-2022"},{role:"Data Analyst",company:"Capgemini",years:"2017-2019"}]},
  {id:2,name:"Marc Dubois",role:"DevOps Engineer",dept:"Technology",entity:"AXA Group Ops",manager:"Karim Hassan",linkedin:"linkedin.com/in/marc-dubois",cv:"marc_dubois_cv.pdf",email:"marc.dubois@axa.com",skills:["Kubernetes","Docker","CI/CD","Terraform","Azure"],level:"Mid",avatar:"MD",aiLvl:"Autonomous",yrs:4,mobility:true,intent:"Cloud Architecture",perf:[{yr:"2025",score:3.8,note:"Meets"}],teams:["Platform Eng"],bg:"BEng INSA Lyon.",exp:[{role:"DevOps",company:"AXA Group Ops",years:"2022-Now"},{role:"SysAdmin",company:"OVH",years:"2020-2022"}]},
  {id:3,name:"Amina Benali",role:"Product Manager",dept:"Product",entity:"AXA France",manager:"Elena Rossi",linkedin:"linkedin.com/in/amina-benali",cv:"amina_benali_cv.pdf",email:"amina.benali@axa.com",skills:["Product Management","Agile","UX Design","Stakeholder Management"],level:"Senior",avatar:"AB",aiLvl:"Guided",yrs:9,mobility:true,intent:"VP Product",perf:[{yr:"2025",score:4.7,note:"Outstanding"}],teams:["Digital Products"],bg:"MBA HEC.",exp:[{role:"Senior PM",company:"AXA France",years:"2021-Now"},{role:"PM",company:"BlaBlaCar",years:"2017-2021"},{role:"Consultant",company:"BCG",years:"2015-2017"}]},
  {id:4,name:"Thomas Moreau",role:"Financial Analyst",dept:"Finance",entity:"AXA Group",manager:"Nadia Kowalski",linkedin:"linkedin.com/in/thomas-moreau",cv:"thomas_moreau_cv.pdf",email:"thomas.moreau@axa.com",skills:["Financial Modeling","Power BI","SQL","Risk Analysis"],level:"Junior",avatar:"TM",aiLvl:"Basic",yrs:2,mobility:false,intent:"",perf:[{yr:"2025",score:3.5,note:"Meets"}],teams:["Group Finance"],bg:"MSc Dauphine.",exp:[{role:"FA",company:"AXA Group",years:"2024-Now"}]},
  {id:5,name:"Elena Rossi",role:"HR Business Partner",dept:"HR & Talent",entity:"AXA Group Ops",manager:"Yassir Abdelfettah",linkedin:"linkedin.com/in/elena-rossi",cv:"elena_rossi_cv.pdf",email:"elena.rossi@axa.com",skills:["Change Management","Stakeholder Management","Communication","Leadership"],level:"Mid",avatar:"ER",aiLvl:"Guided",yrs:6,mobility:true,intent:"HR Director",perf:[{yr:"2025",score:4.1,note:"Strong"}],teams:["HR Ops"],bg:"MA Bocconi.",exp:[{role:"HRBP",company:"AXA Group Ops",years:"2022-Now"},{role:"HR Specialist",company:"Generali",years:"2019-2022"}]},
  {id:6,name:"Karim Hassan",role:"Cloud Architect",dept:"Technology",entity:"AXA Group Ops",manager:"CTO Office",linkedin:"linkedin.com/in/karim-hassan",cv:"karim_hassan_cv.pdf",email:"karim.hassan@axa.com",skills:["Azure","AWS","Cloud Architecture","Microservices","Cybersecurity","Kubernetes"],level:"Lead",avatar:"KH",aiLvl:"Expert",yrs:11,mobility:true,intent:"CTO track",perf:[{yr:"2025",score:4.8,note:"Exceptional"}],teams:["Cloud CoE"],bg:"MEng Imperial.",exp:[{role:"Cloud Architect",company:"AXA Group Ops",years:"2020-Now"},{role:"Solutions Architect",company:"Microsoft",years:"2015-2020"}]},
  {id:7,name:"Claire Martin",role:"UX Designer",dept:"Product",entity:"AXA France",manager:"Amina Benali",linkedin:"linkedin.com/in/claire-martin",cv:"claire_martin_cv.pdf",email:"claire.martin@axa.com",skills:["UX Design","Communication","Problem Solving"],level:"Senior",avatar:"CM",aiLvl:"Autonomous",yrs:5,mobility:false,intent:"",perf:[{yr:"2025",score:4.0,note:"Creative"}],teams:["Design"],bg:"BFA Parsons.",exp:[{role:"UX Designer",company:"AXA France",years:"2023-Now"}]},
  {id:8,name:"Yuki Tanaka",role:"ML Engineer",dept:"Data & AI",entity:"AXA Group Ops",manager:"Karim Hassan",linkedin:"linkedin.com/in/yuki-tanaka",cv:"yuki_tanaka_cv.pdf",email:"yuki.tanaka@axa.com",skills:["Python","Deep Learning","MLOps","LLM Fine-tuning","RAG Architecture","GenAI"],level:"Senior",avatar:"YT",aiLvl:"Expert",yrs:6,mobility:true,intent:"AI Director",perf:[{yr:"2025",score:4.6,note:"Pioneer"}],teams:["AI Platform"],bg:"PhD Tokyo.",exp:[{role:"ML Eng",company:"AXA Group Ops",years:"2022-Now"},{role:"Research Eng",company:"DeepMind",years:"2019-2022"}]},
  {id:9,name:"Lucas Ferreira",role:"Scrum Master",dept:"Technology",entity:"AXA Group Ops",manager:"Karim Hassan",linkedin:"linkedin.com/in/lucas-ferreira",cv:"lucas_ferreira_cv.pdf",email:"lucas.ferreira@axa.com",skills:["Agile","Scrum","Communication"],level:"Mid",avatar:"LF",aiLvl:"Basic",yrs:3,mobility:true,intent:"Agile Coach",perf:[{yr:"2025",score:3.9,note:"Good"}],teams:["Delivery"],bg:"BSc Lisboa.",exp:[{role:"Scrum Master",company:"AXA Group Ops",years:"2023-Now"}]},
  {id:10,name:"Nadia Kowalski",role:"Compliance Officer",dept:"Risk",entity:"AXA Group",manager:"CRO Office",linkedin:"linkedin.com/in/nadia-kowalski",cv:"nadia_kowalski_cv.pdf",email:"nadia.kowalski@axa.com",skills:["GDPR","Data Privacy","Risk Analysis","Data Governance"],level:"Senior",avatar:"NK",aiLvl:"Guided",yrs:8,mobility:false,intent:"",perf:[{yr:"2025",score:4.2,note:"Expert"}],teams:["Compliance"],bg:"LLM Jagiellonian.",exp:[{role:"Compliance",company:"AXA Group",years:"2020-Now"}]},
];

const JOBS=[
  {id:"J1",title:"Senior ML Engineer",entity:"AXA France",country:"France",city:"Paris",dept:"Data & AI",level:"Senior",type:"Hybrid",hiringMgr:"Karim Hassan",skills:["Python","Machine Learning","MLOps","Deep Learning"],desc:"Lead ML model development and deployment. Design scalable pipelines, mentor junior engineers.",urgency:"High",posted:"2026-04-01",tasks:["Build ML pipeline prototype","Mentor 2 junior engineers","Deploy model to production","Document best practices"],milestones:["30-day onboarding","60-day: first model shipped","90-day: team ramp-up","6-month: production ownership"],deliverables:["ML pipeline architecture doc","Runbook for deployments","Training dataset curation","Monthly model review"]},
  {id:"J2",title:"Cloud Solutions Architect",entity:"AXA Group Ops",country:"UK",city:"London",dept:"Technology",level:"Lead",type:"Remote",hiringMgr:"CTO Office",skills:["Azure","Cloud Architecture","Microservices","Kubernetes"],desc:"Design and govern cloud architecture across AXA entities.",urgency:"High",posted:"2026-03-28",tasks:["Architecture review board","Migration roadmap","Standards definition","Cross-entity governance"],milestones:["30-day: assessment","90-day: roadmap approved","6-month: first migration live","12-month: 3 entities migrated"],deliverables:["Architecture standards doc","Migration playbook","Cost model","Quarterly architecture review"]},
  {id:"J3",title:"Product Owner — AI Platform",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"Product",level:"Senior",type:"On-site",hiringMgr:"Amina Benali",skills:["Product Management","Agile","GenAI","Stakeholder Management"],desc:"Own the AI platform product roadmap.",urgency:"Medium",posted:"2026-04-05",tasks:["Roadmap quarterly","Backlog grooming","KPI dashboards","Stakeholder reviews"],milestones:["30-day: stakeholder map","60-day: Q3 roadmap","90-day: first release"],deliverables:["Product vision doc","OKR framework","Backlog (50+ items)","Monthly release notes"]},
  {id:"J4",title:"Data Governance Manager",entity:"AXA Belgium",country:"Belgium",city:"Brussels",dept:"Data & AI",level:"Mid",type:"Hybrid",hiringMgr:"Nadia Kowalski",skills:["Data Governance","GDPR","SQL","Data Privacy"],desc:"Establish data governance policies.",urgency:"Low",posted:"2026-04-10",tasks:["Policy drafting","Data quality programs","GDPR audit","Training rollout"],milestones:["30-day: baseline assessment","90-day: policies signed","6-month: audit passed"],deliverables:["DG policy book","Data quality KPIs","GDPR compliance report","Training curriculum"]},
  {id:"J5",title:"Change Management Lead",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"HR & Talent",level:"Lead",type:"Hybrid",hiringMgr:"Elena Rossi",skills:["Change Management","Communication","Leadership","Stakeholder Management"],desc:"Lead change programs for digital transformation.",urgency:"High",posted:"2026-03-15",tasks:["Change impact assessment","Champion network","Communication plan","Adoption tracking"],milestones:["30-day: assessment","60-day: champions trained","90-day: first wave launched"],deliverables:["Change strategy doc","Communications playbook","KPI dashboard","Lessons-learned report"]},
  {id:"J6",title:"Agentic AI Developer",entity:"AXA Group Ops",country:"Remote",city:"Remote",dept:"Data & AI",level:"Senior",type:"Remote",hiringMgr:"Yuki Tanaka",skills:["Agentic AI","Python","LLM Fine-tuning","RAG Architecture"],desc:"Build autonomous AI agents.",urgency:"High",posted:"2026-04-12",tasks:["Agent architecture design","Tool integration","Safety guardrails","Production deployment"],milestones:["30-day: POC","60-day: pilot agent","90-day: production agent"],deliverables:["Agent framework","Safety review","Documentation","Monitoring dashboard"]},
  {id:"J7",title:"DevSecOps Engineer",entity:"AXA Germany",country:"Germany",city:"Cologne",dept:"Technology",level:"Mid",type:"On-site",hiringMgr:"Karim Hassan",skills:["DevOps","CI/CD","Cybersecurity","Docker"],desc:"Embed security into CI/CD pipelines.",urgency:"Medium",posted:"2026-04-08",tasks:["Pipeline security scans","Zero-trust patterns","Container security","Incident response"],milestones:["30-day: scan coverage","90-day: zero-trust MVP","6-month: full rollout"],deliverables:["Security playbook","Scan reports","Architecture doc","Monthly security review"]},
  {id:"J8",title:"HR Strategy Director",entity:"AXA Group Ops",country:"France",city:"Paris",dept:"HR & Talent",level:"Lead",type:"Hybrid",hiringMgr:"CHRO Office",skills:["Strategic Thinking","Leadership","Change Management","Communication"],desc:"Define and execute HR strategy.",urgency:"High",posted:"2026-03-20",tasks:["Strategy definition","Workforce plan","Talent development","Org design"],milestones:["30-day: diagnosis","90-day: strategy approved","12-month: execution in flight"],deliverables:["HR strategy deck","Workforce plan","Talent roadmap","Quarterly business review"]},
];

const DOMAINS=["Technology","Data & AI","Operations","Finance","HR & Talent","Risk & Compliance","Product","Strategy"];
const WF=["Scheduled","Interview","Gap","Plan","Match","Apply","Done"];

const genPaths=()=>{const tpl=[{d:"Technology",p:["Junior Dev → Senior Dev → Tech Lead → Staff Engineer → Principal Architect","Backend → API Architect → Platform Lead → CTO","DevOps → Platform Lead → Cloud Director","Security → Security Engineer → CISO"]},{d:"Data & AI",p:["Data Scientist → Lead Scientist → Chief Data Scientist","ML Engineer → Sr ML → ML Lead → AI Director","NLP Engineer → Conv AI Lead → AI Product Dir","Prompt Engineer → AI Solutions Architect → GenAI Director"]},{d:"Product",p:["Product Analyst → PM → Sr PM → VP Product","UX Researcher → UX Lead → Head Design","Growth Analyst → Growth Manager → VP Growth"]},{d:"HR & Talent",p:["HR Coord → HRBP → HR Manager → HR Director → CHRO","L&D Specialist → L&D Manager → CLO","Change Manager → Change Lead → VP Transformation"]},{d:"Strategy",p:["Strategy Analyst → Strategy Manager → VP Strategy → CSO","Transformation Lead → VP Transformation → CTO"]},{d:"Operations",p:["Ops Analyst → Ops Manager → Head of Ops → COO","Process Analyst → Process Lead → Excellence Director"]},{d:"Finance",p:["FA → Sr FA → Finance Manager → CFO","Actuary → Sr Actuary → Chief Actuary"]},{d:"Risk & Compliance",p:["Risk Analyst → Risk Manager → CRO","Compliance → Sr Compliance → VP Compliance"]}];let id=1;const paths=[];tpl.forEach(g=>g.p.forEach((p,i)=>{const steps=p.split(" → ");paths.push({id:id++,domain:g.d,type:["Expert","Management","Hybrid"][i%3],name:steps[steps.length-1],steps:steps.map((s,si)=>({title:s,level:si+1,skills:SKILLS.slice((id+si*3)%30,(id+si*3)%30+3)}))});}));return paths;};
const getJobSugg=(emp,paths)=>{const w=emp.role.toLowerCase().split(/\s+/);const dp=paths.filter(p=>{const dm=emp.dept.toLowerCase().includes(p.domain.toLowerCase().split(" ")[0]);const rm=p.steps.some(s=>w.some(x=>x.length>2&&s.title.toLowerCase().includes(x)));return dm||rm;});const r=new Set();dp.forEach(p=>{let f=false;p.steps.forEach(s=>{if(f&&r.size<15)r.add(s.title);if(w.some(x=>x.length>2&&s.title.toLowerCase().includes(x)))f=true;});if(r.size<15)r.add(p.steps[p.steps.length-1].title);});if(r.size<5)dp.slice(0,5).forEach(p=>p.steps.slice(-2).forEach(s=>r.add(s.title)));return[...r].slice(0,12);};

const IQ=[{id:1,q:"Long-term career aspirations?",t:"s",o:["Expert in current field","Different functional area","People management","Strategic / transversal","International","Not sure"]},{id:2,q:"Short-medium term? (3-5y)",t:"s",o:["Progress current role","Different role same level","Higher responsibility","Short-term missions"]},{id:3,q:"Target role aligned with AXA?",t:"job",o:[],note:"Select from career paths or enter custom"},{id:4,q:"Current skills?",t:"m",o:SKILLS.slice(0,20)},{id:5,q:"AI skills level?",t:"s",o:["None","Basic","Guided","Autonomous","Expert"]},{id:6,q:"Skills to develop?",t:"m",o:SKILLS.slice(8,28)},{id:7,q:"Job change short term?",t:"s",o:["Yes","No"],cond:true},{id:"7a",q:"Reasons not to explore?",t:"s",o:["Comfortable","Gaps first","No opportunities"],on:7,val:"No"},{id:8,q:"When open?",t:"s",o:["6mo","6-12mo","1-2y","2+y","Don't foresee"]},{id:9,q:"Geographic mobility?",t:"s",o:["International","Within country","Remote","No"]},{id:10,q:"Training needed?",t:"m",o:["Formal","On-the-job","Mentoring","Mission","Certification","None"]},{id:11,q:"Opportunities?",t:"x",o:[]}];

// ══════════════════════════════════════════════════════════════
// CHARTER CONTENT — Manifesto + 3-Year Plan
// ══════════════════════════════════════════════════════════════
const MANIFESTO={
  hero:"Internal mobility is not an HR program. It is the operating system of our future workforce.",
  beliefs:[
    {n:"01",t:"People before posts",c:"We grow careers, not headcount. Talent is the asset; roles are the canvas."},
    {n:"02",t:"Skills before titles",c:"Capability — not seniority — determines who builds what comes next."},
    {n:"03",t:"Internal first",c:"Every open role starts with a question: who already inside could become this?"},
    {n:"04",t:"Hybrid by design",c:"Humans and AI agents share the workload. Humans always stay accountable."},
    {n:"05",t:"Mobility is mutual",c:"The employee owns the ambition. The manager owns the path. The company owns the platform."},
  ],
  commitments:[
    "Make every internal opportunity visible to every eligible employee within 24 hours of posting.",
    "Guarantee a structured career interview at least once per year for every employee.",
    "Link every identified skills gap to a concrete training, certification, and mentor.",
    "Match every employee in mobility to at least three role options within their target horizon.",
    "Hold managers accountable for releasing talent — not just retaining it.",
  ],
  empExpectations:["Declare your aspirations openly","Maintain an up-to-date skills profile","Engage actively in your career interview","Take ownership of your development plan","Apply when matched — don't wait to be picked"],
  mgrExpectations:["Hold quality career conversations","Validate skills and gaps honestly","Sponsor mobility — even when it costs your team","Use the marketplace before opening external recs","Coach your team toward their next role, not just yours"],
  collective:"We choose to build careers worth staying for — by making mobility easier than leaving.",
  plan:[
    {year:"2026",theme:"FOUNDATIONS",color:T.teal,objectives:["Launch SMART Mobility platform across AXA Group Ops","Complete career interviews for 100% of employees","Establish skills repository (500+ skills) and 200+ career paths"],actions:["Deploy Talent Marketplace POC → MVP (Q3)","Train 200 managers on mobility-first practices","Integrate ATS with platform for live job feeds","Launch first AI agent pilots (SkillMatch, CareerPath)"],kpis:[{l:"Internal mobility rate",v:"23%",t:"30%",pct:77},{l:"Manager adoption",v:"68%",t:"90%",pct:76},{l:"Skills profile completion",v:"54%",t:"85%",pct:64}]},
    {year:"2027",theme:"SCALE",color:T.ocean,objectives:["Extend platform to 5 AXA entities","Reduce external hires for filled roles by 30%","Reach 95% gap-to-learning linkage"],actions:["Roll out across AXA France, UK, Germany, Belgium, Spain","Deploy AI agents in 3 production workflows","Launch Mobility Sponsor program (executive level)","Open marketplace to internal mobility AI matching"],kpis:[{l:"Internal mobility rate",v:"35%",t:"45%",pct:78},{l:"External hire reduction",v:"22%",t:"30%",pct:73},{l:"Gap-to-learning rate",v:"81%",t:"95%",pct:85}]},
    {year:"2028",theme:"INDUSTRY-LEADING",color:T.violet,objectives:["Become the reference internal mobility platform in insurance","Achieve 50% internal mobility rate","Operate 15+ AI agents in production"],actions:["Open-source the SMART Mobility framework to AXA partners","Establish AXA Mobility Academy (training center)","Launch cross-border mobility AI assistant","Publish annual Mobility Impact report"],kpis:[{l:"Internal mobility rate",v:"—",t:"50%",pct:0},{l:"Time-to-fill internally",v:"—",t:"<14 days",pct:0},{l:"AI agents in production",v:"—",t:"15+",pct:0}]},
  ],
};

// ══════════════════════════════════════════════════════════════
// AI SKILL ASSESSMENT — dynamic question generator
// ══════════════════════════════════════════════════════════════
const QUESTION_BANK={
  "Strategic Thinking":[
    {q:"When facing a complex problem with limited information, your first move is:",o:["Decide quickly to maintain momentum","Map stakeholders and dependencies before deciding","Delegate to subject experts","Wait for more data"],correct:1,why:"Strategic thinkers prioritize context-mapping before action."},
    {q:"Which best describes how you frame business priorities?",o:["By short-term revenue impact","By customer satisfaction scores","By trade-offs between time, cost, value, risk","By manager directives"],correct:2,why:"Strategic thinking requires multi-dimensional trade-off analysis."},
    {q:"Your strategy faces resistance from a senior executive. You:",o:["Escalate to your manager","Reframe the strategy with executive-relevant value","Drop the initiative","Find allies first"],correct:1,why:"Strategic communication adapts the message to the audience without losing substance."},
    {q:"When evaluating a 3-year plan, the most important indicator is:",o:["Predicted ROI","Optionality preserved at each milestone","Number of milestones hit","Budget consumed"],correct:1,why:"Strategy values flexibility under uncertainty over rigid execution."},
    {q:"Which framework do you reach for when sizing a new market?",o:["SWOT","Porter's Five Forces","TAM/SAM/SOM","All three depending on context"],correct:3,why:"Senior strategists are framework-agnostic — they pick the right tool per question."},
  ],
  "Leadership":[
    {q:"A team member underperforms. Your first action is:",o:["Issue formal warning","Have a 1:1 to understand context","Reassign their tasks","Document in their record"],correct:1,why:"Effective leaders understand root causes before acting."},
    {q:"Two reports disagree publicly in a meeting. You:",o:["Pick a side immediately","Pause and ask each to articulate the other's position","Defer the decision","Move on to next agenda item"],correct:1,why:"Leaders create conditions for productive disagreement, not silence."},
    {q:"How do you measure your own leadership effectiveness?",o:["Team output metrics","Direct reports' growth into bigger roles","Number of decisions you make","Hours worked"],correct:1,why:"True leadership is measured by people you grow, not work you do."},
    {q:"When delegating a critical project, you:",o:["Assign the most experienced person","Match the project to a stretch growth opportunity","Do it yourself","Split it across the team"],correct:1,why:"Leadership delegation creates growth, not just throughput."},
  ],
  "Financial Modeling":[
    {q:"In a DCF, what is the most error-prone input?",o:["Discount rate","Terminal value assumption","Year-1 revenue","Tax rate"],correct:1,why:"Terminal value typically represents 60-80% of DCF output."},
    {q:"NPV vs IRR — when do they diverge?",o:["Never","When projects have different scales or cash flow patterns","When inflation is high","When tax rates change"],correct:1,why:"IRR can mislead when comparing mutually exclusive projects of different size."},
    {q:"What is the right discount rate for a stable insurance subsidiary?",o:["Risk-free rate","WACC of the parent","WACC of the subsidiary reflecting its risk","10% standard"],correct:2,why:"Each business unit has its own risk profile — using parent WACC overvalues risky bets."},
    {q:"Sensitivity analysis is most useful when:",o:["Inputs are highly certain","Inputs are highly uncertain","Building presentations","Calculating taxes"],correct:1,why:"Sensitivity reveals which assumptions matter most under uncertainty."},
  ],
  "Data Governance":[
    {q:"The first principle of data governance is:",o:["Lock data down","Define ownership for every data asset","Encrypt everything","Limit access to executives"],correct:1,why:"Without ownership, no other governance practice works."},
    {q:"GDPR's strictest requirement is:",o:["Encryption","Right to erasure within reasonable time","Annual audits","User consent forms"],correct:1,why:"Right to erasure forces data lineage and deletion capability across systems."},
    {q:"Master data management is most valuable when:",o:["Data is stored in one system","Data exists in multiple systems with conflicts","All data is structured","No regulations apply"],correct:1,why:"MDM exists precisely to reconcile distributed truth."},
  ],
  "Change Management":[
    {q:"In ADKAR, the most underestimated step is:",o:["Awareness","Desire","Knowledge","Reinforcement"],correct:1,why:"Most change programs assume desire — but desire requires emotional engagement, not just announcement."},
    {q:"You face active resistance from a key stakeholder. Best response:",o:["Escalate","Listen and reframe their concerns into the plan","Bypass them","Document their resistance"],correct:1,why:"Resistance often signals legitimate risk; integrating it strengthens the plan."},
    {q:"Communication frequency for major change:",o:["Once at launch","Quarterly","Weekly with consistent messaging","Daily"],correct:2,why:"Repetition builds trust; consistency builds clarity."},
  ],
  "Cloud Architecture":[
    {q:"When should you choose a microservices architecture?",o:["Always","When team boundaries clearly map to service boundaries","When the system is small","When using AWS"],correct:1,why:"Conway's Law: architecture mirrors org structure. Misaligned boundaries kill microservice benefits."},
    {q:"Multi-region active-active is justified when:",o:["RTO is very low and global users","Cost is no concern","Default for production","Hybrid cloud requires it"],correct:0,why:"Active-active is expensive — only justified by strict RTO + global latency needs."},
    {q:"Serverless makes the most sense for:",o:["Long-running batch jobs","Event-driven, spiky workloads","Steady-state high-throughput services","Always — it's modern"],correct:1,why:"Serverless cost model favors variable, event-driven loads — not steady throughput."},
  ],
};

const generateAssessment=(skill,seed)=>{
  // Get skill-specific questions, or fall back to generic
  let bank=QUESTION_BANK[skill];
  if(!bank){
    bank=[
      {q:`Rate your hands-on experience with ${skill}:`,o:["Theoretical only","Used in 1-2 projects","Used in many projects","Mentor others in it"],correct:2,why:"Self-rated experience predicts task success."},
      {q:`Last time you applied ${skill} in a real project:`,o:["Never","Over 2 years ago","Within last year","Currently using"],correct:3,why:"Recency strongly correlates with effective skill application."},
      {q:`How would you teach ${skill} to a junior colleague?`,o:["Send them documentation","Pair-program / pair-work","Explain principles, give exercises","I couldn't teach it"],correct:2,why:"The ability to teach is the strongest indicator of true mastery."},
    ];
  }
  // Pseudo-random selection seeded by date+skill so results vary per assessment
  const shuffled=[...bank].sort(()=>{const x=Math.sin(seed+skill.length)*10000;return(x-Math.floor(x))-0.5;});
  return shuffled.slice(0,3);
};

// ══════════════════════════════════════════════════════════════
// JOB MATCHING SCORING
// ══════════════════════════════════════════════════════════════
const calcJobMatch=(emp,job,gap)=>{
  // Skills match (60%)
  const empSkills=new Set(emp.skills);
  const matchedSkills=job.skills.filter(s=>empSkills.has(s));
  const skillScore=(matchedSkills.length/job.skills.length)*60;
  // Aspiration alignment (20%)
  const aspirationScore=emp.intent&&job.title.toLowerCase().split(" ").some(w=>emp.intent.toLowerCase().includes(w))?20:8;
  // Gap completion (20%) — if employee is closing relevant gaps, boost score
  let gapScore=10;
  if(gap&&gap.gaps){
    const relevantGaps=gap.gaps.filter(g=>job.skills.includes(g.s));
    if(relevantGaps.length>0){
      const avgComplete=relevantGaps.reduce((s,g)=>s+(g.c/g.r),0)/relevantGaps.length;
      gapScore=Math.round(avgComplete*20);
    }
  }
  return Math.min(100,Math.round(skillScore+aspirationScore+gapScore));
};

const DEFAULT_AGENTS=[
  {id:"ai-1",name:"AXA-SkillMatch",role:"Skills Matching",model:"GPT-4o",validator:"Karim Hassan",container:"Azure OpenAI",prompt:"You match employees to positions based on semantic skill analysis.",status:"active",accuracy:94,tasks:127,deployed:"2026-02-15"},
  {id:"ai-2",name:"AXA-CareerPath",role:"Career Advisor",model:"Claude Opus 4.6",validator:"Elena Rossi",container:"AWS Bedrock",prompt:"You generate personalized career trajectories.",status:"active",accuracy:91,tasks:84,deployed:"2026-02-20"},
  {id:"ai-3",name:"AXA-LearnRec",role:"Learning Recommender",model:"GPT-4o-mini",validator:"Elena Rossi",container:"Azure OpenAI",prompt:"You recommend training programs based on identified skill gaps.",status:"training",accuracy:87,tasks:0,deployed:"2026-04-01"},
  {id:"ai-4",name:"AXA-WorkforceAI",role:"Workforce Planning",model:"Claude Sonnet 4.6",validator:"Yassir Abdelfettah",container:"AWS Bedrock",prompt:"You forecast workforce demand and supply across AXA entities.",status:"active",accuracy:92,tasks:56,deployed:"2026-03-05"},
  {id:"ai-5",name:"AXA-AssessBot",role:"Skill Assessor",model:"Claude Opus 4.7",validator:"Elena Rossi",container:"Anthropic API",prompt:"You generate adaptive skill assessments and score responses.",status:"active",accuracy:89,tasks:23,deployed:"2026-04-15"},
];

const LLM_MODELS=["GPT-4o","GPT-4o-mini","Claude Opus 4.6","Claude Opus 4.7","Claude Sonnet 4.6","Claude Haiku 4.5","Gemini 2.5 Pro","Llama 3.3 70B","Mistral Large"];
const CONTAINERS=["Azure OpenAI","AWS Bedrock","Anthropic API","Google Vertex AI","Self-hosted (Kubernetes)","OpenShift AI"];

// ══════════════════════════════════════════════════════════════
// PERSISTENCE
// ══════════════════════════════════════════════════════════════
const STORE_KEY="axa_smart_mobility_v8";
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
  <div style={{textAlign:"center",marginBottom:16}}><h2 style={{fontFamily:FH,fontSize:18,fontWeight:700}}>SMART Mobility</h2><p style={{fontSize:11,color:T.inkMuted}}>Skills & People Marketplace · v8.0</p></div>
  <div style={{marginBottom:14}}><label style={{...S.label,display:"flex",gap:3}}>Corporate Email<span style={{color:T.axaRed}}>*</span></label><input style={{...S.input,padding:"11px 14px",fontSize:13,background:T.bgCard,border:`1.5px solid ${T.border}`}} value={email} onChange={e=>setEmail(e.target.value)}/></div>
  <div style={{marginBottom:16}}><label style={S.label}>Demo — Select Profile</label><div style={S.g2}>{PERSONAS.map(p=>(<div key={p.id} onClick={()=>setSelP(p)} style={{padding:"10px 12px",borderRadius:7,cursor:"pointer",border:selP?.id===p.id?`2px solid ${T.axaBlue}`:`1.5px solid ${T.border}`,background:selP?.id===p.id?`${T.axaBlue}06`:T.bgCard}}><div style={{fontSize:13,fontWeight:700,color:selP?.id===p.id?T.axaBlue:T.ink}}>{p.label}</div><div style={{fontSize:10,color:T.inkMuted,marginTop:1}}>{p.desc}</div></div>))}</div></div>
  <button onClick={doLogin} disabled={loading||!selP} style={{...S.btn,width:"100%",justifyContent:"center",padding:12,fontSize:14,borderRadius:10,opacity:(!selP||loading)?.5:1}}>{loading?<><span style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite"}}/>Authenticating...</>:"🔐 Sign in with Azure AD SSO"}</button>
  <div style={{marginTop:10,padding:8,background:T.bgSoft,borderRadius:6,fontSize:9,color:T.inkMuted}}>SAML 2.0 · Azure AD · RBAC · MFA · TLS 1.3</div>
</div></div>);};

// ══════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════
const NAV=[{k:"dashboard",l:"Dashboard",e:"📊"},{k:"charter",l:"Charter",e:"📜"},{k:"marketplace",l:"Marketplace",e:"🏪"},{k:"team",l:"Team",e:"👥"},{k:"interviews",l:"Interviews",e:"🎯"},{k:"careers",l:"Careers",e:"🚀"},{k:"refs",l:"Data & Refs",e:"📚"},{k:"agents",l:"AI Agents",e:"🤖"},{k:"reports",l:"Reports",e:"📈"}];
const Side=({active,go,persona,onLogout})=>(<div style={{width:200,background:T.axaBlue,display:"flex",flexDirection:"column",flexShrink:0}}><div style={{padding:"14px 14px 10px",borderBottom:"1px solid rgba(255,255,255,.1)"}}><div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:"#fff"}}>SMART Mobility</div><div style={{fontSize:8,color:"rgba(255,255,255,.4)",letterSpacing:1}}>AXA GROUP OPS · v8.0</div></div><div style={{flex:1,padding:"4px 0",overflowY:"auto"}}>{NAV.filter(n=>(persona?.access||[]).includes(n.k)).map(n=>(<div key={n.k} onClick={()=>go(n.k)} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",cursor:"pointer",background:active===n.k?"rgba(255,255,255,.1)":"transparent",borderLeft:active===n.k?"3px solid #fff":"3px solid transparent",color:active===n.k?"#fff":"rgba(255,255,255,.5)",fontSize:12,fontWeight:active===n.k?600:400}}><span style={{fontSize:12}}>{n.e}</span>{n.l}</div>))}</div><div style={{padding:10,borderTop:"1px solid rgba(255,255,255,.1)"}}><div style={S.flex}><div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>YA</div><div style={{flex:1}}><div style={{fontSize:10,fontWeight:600,color:"#fff"}}>Yassir Q.</div><div style={{fontSize:8,color:"rgba(255,255,255,.4)"}}>{persona?.label}</div></div></div><button onClick={onLogout} style={{marginTop:6,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:5,padding:"4px 0",width:"100%",color:"rgba(255,255,255,.6)",fontSize:9}}>Sign Out</button></div></div>);

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
const PgDash=({go,store})=>(<div><div style={S.g4}>{[{l:"Employees",v:EMP.length,d:"+12",c:T.teal,p:"team"},{l:"AI Agents",v:(store.agents||DEFAULT_AGENTS).length,d:"+2",c:T.violet,p:"agents"},{l:"Positions",v:JOBS.length,d:"-3",c:T.ocean,p:"marketplace"},{l:"Interviews",v:(store.ivs||[]).length||4,d:"+5",c:T.orange,p:"interviews"}].map(s=>(<div key={s.l} onClick={()=>go(s.p)} style={{...S.card,cursor:"pointer"}}><div style={S.between}><span style={{fontSize:18}}>{s.l==="AI Agents"?"🤖":s.l==="Employees"?"👥":s.l==="Positions"?"📋":"🎯"}</span><span style={{fontSize:10,fontWeight:700,color:s.d[0]==="+"?T.teal:T.red}}>{s.d}</span></div><div style={{fontSize:24,fontWeight:800,fontFamily:FH,marginTop:6}}>{s.v}</div><div style={{fontSize:11,color:T.inkMuted}}>{s.l}</div></div>))}</div><div style={S.g2}><div style={S.card}><h3 style={S.h3}>Pipeline</h3><div style={{marginTop:10}}>{["Scheduled","In Progress","Plan","Training","Done"].map((s,i)=>(<div key={s} style={{...S.flex,marginBottom:7}}><span style={{fontSize:10,color:T.inkMuted,width:100}}>{s}</span><div style={{flex:1}}><Bar pct={[25,45,60,35,80][i]} color={[T.ocean,T.orange,T.teal,T.violet,T.green][i]}/></div><span style={{fontSize:10,fontWeight:600,width:22,textAlign:"right"}}>{[12,18,24,9,31][i]}</span></div>))}</div></div><div style={S.card}><h3 style={S.h3}>AI Agents</h3><div style={{marginTop:10}}>{(store.agents||DEFAULT_AGENTS).slice(0,4).map(a=>(<div key={a.id} style={{...S.flex,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><span>🤖</span><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{a.name}</div></div><Bd status={a.status}/></div>))}</div></div></div></div>);

// ══════════════════════════════════════════════════════════════
// CHARTER — PREMIUM EXECUTIVE EXPERIENCE
// ══════════════════════════════════════════════════════════════
const PgCharter=()=>{
  const[activeYear,setActiveYear]=useState(0);
  
  return(<div style={{maxWidth:1100}}>
    {/* HERO MANIFESTO */}
    <div style={{position:"relative",padding:"40px 36px",background:`linear-gradient(135deg,${T.axaBlue},${T.axaMid})`,borderRadius:14,overflow:"hidden",marginBottom:18,boxShadow:"0 8px 24px rgba(0,0,128,.15)"}}>
      <div style={{position:"absolute",top:0,left:0,width:6,height:60,background:T.axaRed}}/>
      <div style={{fontSize:9,fontWeight:700,color:T.axaGold,letterSpacing:4,textTransform:"uppercase"}}>Internal Mobility Manifesto · 2026</div>
      <div style={{fontFamily:FH,fontSize:32,fontWeight:700,color:"#fff",marginTop:14,lineHeight:1.25,fontStyle:"italic",letterSpacing:-0.5}}>"{MANIFESTO.hero}"</div>
      <div style={{marginTop:16,fontSize:11,color:"rgba(255,255,255,.55)",letterSpacing:2,textTransform:"uppercase"}}>— AXA Group Operations · Mobility by Design</div>
    </div>

    {/* CORE BELIEFS — quote-style cards */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
        <span style={{fontFamily:FH,fontSize:11,color:T.axaRed,fontWeight:700,letterSpacing:2}}>I.</span>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:T.ink}}>Five Beliefs</h2>
      </div>
      <div style={S.g3}>{MANIFESTO.beliefs.slice(0,3).map(b=>(<div key={b.n} style={{...S.card,padding:20,position:"relative",background:T.bgCard,borderTop:`3px solid ${T.axaBlue}`}}>
        <div style={{position:"absolute",top:-12,left:18,background:T.axaBlue,color:"#fff",width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:FH}}>{b.n}</div>
        <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700,color:T.ink,marginTop:8,marginBottom:6}}>{b.t}</h3>
        <p style={{fontSize:12,color:T.inkSec,lineHeight:1.55}}>{b.c}</p>
      </div>))}</div>
      <div style={{...S.g2,marginTop:12}}>{MANIFESTO.beliefs.slice(3,5).map(b=>(<div key={b.n} style={{...S.card,padding:20,position:"relative",borderTop:`3px solid ${T.axaBlue}`}}>
        <div style={{position:"absolute",top:-12,left:18,background:T.axaBlue,color:"#fff",width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:FH}}>{b.n}</div>
        <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700,color:T.ink,marginTop:8,marginBottom:6}}>{b.t}</h3>
        <p style={{fontSize:12,color:T.inkSec,lineHeight:1.55}}>{b.c}</p>
      </div>))}</div>
    </div>

    {/* COMMITMENTS — checklist pillars */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
        <span style={{fontFamily:FH,fontSize:11,color:T.axaRed,fontWeight:700,letterSpacing:2}}>II.</span>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:T.ink}}>Our Five Commitments</h2>
      </div>
      <div style={{...S.card,padding:0,overflow:"hidden"}}>
        {MANIFESTO.commitments.map((c,i)=>(<div key={i} style={{...S.flex,padding:"14px 18px",borderBottom:i<MANIFESTO.commitments.length-1?`1px solid ${T.border}`:"none",background:i%2===0?T.bgCard:T.bgMuted}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:T.tealBg,color:T.teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>✓</div>
          <div style={{flex:1,fontSize:13,color:T.ink,lineHeight:1.5}}>{c}</div>
        </div>))}
      </div>
    </div>

    {/* EXPECTATIONS — parallel columns */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
        <span style={{fontFamily:FH,fontSize:11,color:T.axaRed,fontWeight:700,letterSpacing:2}}>III.</span>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:T.ink}}>What We Expect</h2>
      </div>
      <div style={S.g2}>
        <div style={{...S.card,padding:20,background:T.tealBg,borderColor:T.teal}}>
          <div style={{fontSize:10,fontWeight:700,color:T.teal,letterSpacing:2,marginBottom:6}}>FROM EMPLOYEES</div>
          <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700,color:T.teal,marginBottom:12}}>Own Your Career</h3>
          {MANIFESTO.empExpectations.map((e,i)=>(<div key={i} style={{...S.flex,padding:"6px 0",borderBottom:i<MANIFESTO.empExpectations.length-1?`1px solid ${T.teal}25`:"none"}}>
            <span style={{color:T.teal,fontWeight:700}}>→</span>
            <span style={{fontSize:12,color:T.ink,flex:1}}>{e}</span>
          </div>))}
        </div>
        <div style={{...S.card,padding:20,background:T.oceanBg,borderColor:T.ocean}}>
          <div style={{fontSize:10,fontWeight:700,color:T.ocean,letterSpacing:2,marginBottom:6}}>FROM MANAGERS</div>
          <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700,color:T.ocean,marginBottom:12}}>Sponsor Their Future</h3>
          {MANIFESTO.mgrExpectations.map((m,i)=>(<div key={i} style={{...S.flex,padding:"6px 0",borderBottom:i<MANIFESTO.mgrExpectations.length-1?`1px solid ${T.ocean}25`:"none"}}>
            <span style={{color:T.ocean,fontWeight:700}}>→</span>
            <span style={{fontSize:12,color:T.ink,flex:1}}>{m}</span>
          </div>))}
        </div>
      </div>
    </div>

    {/* COLLECTIVE CHOICE — banner */}
    <div style={{padding:"36px 40px",background:`linear-gradient(135deg,${T.axaNavy},#000040)`,borderRadius:14,marginBottom:24,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:14,right:18,fontFamily:FH,fontSize:80,color:"rgba(255,200,87,.15)",fontStyle:"italic",fontWeight:700,lineHeight:1}}>"</div>
      <div style={{fontSize:9,color:T.axaGold,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Our Collective Choice</div>
      <div style={{fontFamily:FH,fontSize:24,color:"#fff",marginTop:10,lineHeight:1.4,fontWeight:600,maxWidth:780,fontStyle:"italic"}}>{MANIFESTO.collective}</div>
    </div>

    {/* 3-YEAR PLAN — timeline */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:14}}>
        <span style={{fontFamily:FH,fontSize:11,color:T.axaRed,fontWeight:700,letterSpacing:2}}>IV.</span>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:700,color:T.ink}}>Three-Year Plan</h2>
        <span style={{fontSize:11,color:T.inkMuted,marginLeft:6}}>2026 → 2028</span>
      </div>
      
      {/* Timeline stepper */}
      <div style={{display:"flex",gap:0,marginBottom:18,position:"relative"}}>
        {MANIFESTO.plan.map((y,i)=>(<div key={i} onClick={()=>setActiveYear(i)} style={{flex:1,cursor:"pointer",padding:"16px 14px",background:activeYear===i?y.color:T.bgCard,color:activeYear===i?"#fff":T.ink,borderRadius:i===0?"10px 0 0 10px":i===MANIFESTO.plan.length-1?"0 10px 10px 0":0,border:`1px solid ${activeYear===i?y.color:T.border}`,marginRight:i<MANIFESTO.plan.length-1?-1:0,transition:"all .2s",position:"relative"}}>
          <div style={{fontFamily:FH,fontSize:24,fontWeight:700}}>{y.year}</div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,opacity:activeYear===i?0.9:0.6,marginTop:2}}>{y.theme}</div>
          {activeYear===i&&<div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:14,height:14,background:y.color}}/>}
        </div>))}
      </div>
      
      {/* Year detail */}
      <div style={{...S.card,padding:24,borderTop:`4px solid ${MANIFESTO.plan[activeYear].color}`}}>
        <div style={S.g2}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:MANIFESTO.plan[activeYear].color,letterSpacing:2,marginBottom:8}}>OBJECTIVES</div>
            {MANIFESTO.plan[activeYear].objectives.map((o,i)=>(<div key={i} style={{...S.flex,padding:"6px 0"}}>
              <span style={{color:MANIFESTO.plan[activeYear].color,fontWeight:700,fontSize:12}}>0{i+1}</span>
              <span style={{fontSize:12,color:T.ink,lineHeight:1.4}}>{o}</span>
            </div>))}
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:MANIFESTO.plan[activeYear].color,letterSpacing:2,marginBottom:8}}>ACTIONS</div>
            {MANIFESTO.plan[activeYear].actions.map((a,i)=>(<div key={i} style={{...S.flex,padding:"6px 0"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:MANIFESTO.plan[activeYear].color,flexShrink:0}}/>
              <span style={{fontSize:12,color:T.inkSec,lineHeight:1.4}}>{a}</span>
            </div>))}
          </div>
        </div>
        
        <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,fontWeight:700,color:MANIFESTO.plan[activeYear].color,letterSpacing:2,marginBottom:10}}>KPIs</div>
          <div style={S.g3}>{MANIFESTO.plan[activeYear].kpis.map((k,i)=>(<div key={i} style={{padding:14,background:T.bgMuted,borderRadius:8,borderLeft:`3px solid ${MANIFESTO.plan[activeYear].color}`}}>
            <div style={{fontSize:10,color:T.inkMuted,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{k.l}</div>
            <div style={{...S.flex,marginTop:4,gap:6}}>
              <div style={{fontSize:24,fontWeight:800,fontFamily:FH,color:MANIFESTO.plan[activeYear].color}}>{k.v}</div>
              <div style={{fontSize:10,color:T.inkMuted}}>→ {k.t}</div>
            </div>
            <div style={{marginTop:6}}><Bar pct={k.pct} color={MANIFESTO.plan[activeYear].color}/></div>
          </div>))}</div>
        </div>
      </div>
    </div>
  </div>);
};

// ══════════════════════════════════════════════════════════════
// MARKETPLACE
// ══════════════════════════════════════════════════════════════
const PgMarket=({persona,store,setStore,setToast,go})=>{
  const isEmp=persona?.role==="employee";const isHR=persona?.role==="hr";const isMgr=persona?.role==="manager"||persona?.role==="admin";
  const[tab,setTab]=useState(isEmp?"jobs":"people");const[sf,setSf]=useState([]);const[df,setDf]=useState("All");const[q,setQ]=useState("");const[countryF,setCountryF]=useState("All");const[entityF,setEntityF]=useState("All");const[sel,setSel]=useState(null);const[selJob,setSelJob]=useState(null);const[idTab,setIdTab]=useState("profile");
  const showPeople=isMgr||(isHR&&tab==="people");const showJobs=isEmp||(isHR&&tab==="jobs");
  const interests=store.interests||[];const apps=store.applications||[];
  const interestedEmpIds=[...new Set(interests.map(i=>i.empId))];
  const pool=EMP.filter(e=>e.mobility||interestedEmpIds.includes(e.id));
  const filPeople=pool.filter(e=>(df==="All"||e.dept===df)&&(sf.length===0||sf.some(s=>e.skills.includes(s)))&&(!q||e.name.toLowerCase().includes(q.toLowerCase())||e.role.toLowerCase().includes(q.toLowerCase())));
  const countries=[...new Set(JOBS.map(j=>j.country))];const entities=[...new Set(JOBS.map(j=>j.entity))];
  const filJobs=JOBS.filter(j=>(df==="All"||j.dept===df)&&(countryF==="All"||j.country===countryF)&&(entityF==="All"||j.entity===entityF)&&(sf.length===0||sf.some(s=>j.skills.includes(s)))&&(!q||j.title.toLowerCase().includes(q.toLowerCase())));
  const empSkills=EMP[0].skills;
  const matchPct=(jobSkills)=>{const m=jobSkills.filter(s=>empSkills.includes(s)).length;return Math.round((m/jobSkills.length)*100);};
  const doExpressInterest=(job)=>{const newInt={empId:EMP[0].id,empName:EMP[0].name,jobId:job.id,jobTitle:job.title,date:new Date().toISOString().slice(0,10),status:"Interested"};const updated=[...interests.filter(i=>!(i.empId===EMP[0].id&&i.jobId===job.id)),newInt];setStore(p=>({...p,interests:updated}));setToast(`✅ Interest expressed in ${job.title}`);};
  const hasExpressed=(jobId)=>interests.some(i=>i.empId===EMP[0].id&&i.jobId===jobId);

  // ══ ENRICHED WORKFORCE ID CARD with TABS ══
  if(sel){const tabs=[{k:"profile",l:"👤 Profile"},{k:"experience",l:"💼 Experience"},{k:"skills",l:"💡 Skills"},{k:"docs",l:"📄 Documents"}];
    return(<div>
      <button onClick={()=>{setSel(null);setIdTab("profile");}} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:10}}>← Back</button>
      <div style={{...S.card,padding:0,maxWidth:760,overflow:"hidden"}}>
        {/* Header banner */}
        <div style={{background:`linear-gradient(135deg,${T.axaBlue},${T.axaMid})`,padding:"24px 28px",color:"#fff",position:"relative"}}>
          <div style={{fontSize:9,fontWeight:700,color:T.axaGold,letterSpacing:2,textTransform:"uppercase"}}>Workforce ID Card</div>
          <div style={{...S.flex,marginTop:10}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff",border:"2px solid rgba(255,255,255,.3)"}}>{sel.avatar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:20,fontWeight:700,fontFamily:FH}}>{sel.name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.85)",marginTop:1}}>{sel.role} · {sel.dept} · {sel.level}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:1}}>📍 {sel.entity} · 👤 Manager: {sel.manager}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <Bd status={sel.level}/>
              {interests.filter(i=>i.empId===sel.id).length>0&&<div style={{marginTop:4}}><Bd status={`${interests.filter(i=>i.empId===sel.id).length} interests`} custom={T.axaGold}/></div>}
            </div>
          </div>
          <div style={{fontSize:11,color:T.axaGold,marginTop:8,fontStyle:"italic"}}>"{sel.intent||"No mobility intent declared"}"</div>
        </div>
        
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.bgMuted}}>{tabs.map(t=>(<button key={t.k} onClick={()=>setIdTab(t.k)} style={{padding:"12px 18px",background:idTab===t.k?T.bgCard:"transparent",color:idTab===t.k?T.axaBlue:T.inkMuted,border:"none",borderBottom:idTab===t.k?`2px solid ${T.axaBlue}`:"2px solid transparent",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t.l}</button>))}</div>
        
        <div style={{padding:24}}>
          {idTab==="profile"&&<div>
            <div style={S.g2}>
              <div><div style={S.label}>Email</div><div style={{fontSize:12}}>{sel.email}</div></div>
              <div><div style={S.label}>LinkedIn</div><a href={`https://${sel.linkedin}`} onClick={e=>{e.preventDefault();setToast("🔗 Opening LinkedIn profile");}} style={{fontSize:12,color:T.ocean,textDecoration:"underline",cursor:"pointer"}}>{sel.linkedin}</a></div>
              <div><div style={S.label}>Entity</div><div style={{fontSize:12,fontWeight:600}}>{sel.entity}</div></div>
              <div><div style={S.label}>Reports to</div><div style={{fontSize:12,fontWeight:600}}>{sel.manager}</div></div>
              <div><div style={S.label}>Department</div><div style={{fontSize:12}}>{sel.dept}</div></div>
              <div><div style={S.label}>Experience</div><div style={{fontSize:12}}>{sel.yrs} years</div></div>
            </div>
            <div style={{marginTop:14}}><div style={S.label}>Background</div><div style={{fontSize:12,color:T.inkSec,lineHeight:1.5}}>{sel.bg}</div></div>
            <div style={{marginTop:14}}><div style={S.label}>Teams</div>{sel.teams.map(t=><span key={t} style={{...S.tag,marginRight:4}}>{t}</span>)}</div>
            <div style={{marginTop:14}}><div style={S.label}>AI Maturity</div><Bd status={sel.aiLvl} custom={T.violet}/></div>
          </div>}
          
          {idTab==="experience"&&<div>
            <div style={S.label}>Career History</div>
            <div style={{marginTop:8}}>{sel.exp.map((x,i)=>(<div key={i} style={{...S.flex,padding:"10px 0",borderBottom:i<sel.exp.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:i===0?T.teal:T.inkDim,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.ink}}>{x.role}</div>
                <div style={{fontSize:11,color:T.inkSec}}>{x.company}</div>
              </div>
              <div style={{fontSize:11,color:T.inkMuted,fontWeight:500}}>{x.years}</div>
            </div>))}</div>
            <div style={{marginTop:18}}><div style={S.label}>Performance</div><table style={{width:"100%",marginTop:6,fontSize:11}}><tbody>{sel.perf.map(p=>(<tr key={p.yr} style={{borderBottom:`1px solid ${T.border}`}}><td style={{padding:"6px 0",fontWeight:600,width:60}}>{p.yr}</td><td style={{textAlign:"center",fontWeight:700,color:p.score>=4?T.teal:T.orange,width:50}}>{p.score}</td><td style={{padding:"6px 0",color:T.inkSec}}>{p.note}</td></tr>))}</tbody></table></div>
          </div>}
          
          {idTab==="skills"&&<div>
            <div style={S.label}>Skills with Mastery Level</div>
            <div style={{marginTop:8}}>{sel.skills.map((sk,i)=>{const lvl=3+(i%3);return(<div key={sk} style={{...S.flex,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{flex:1,fontSize:12,fontWeight:500}}>{sk}</div>
              <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(l=><div key={l} style={{width:12,height:6,borderRadius:1,background:l<=lvl?T.teal:T.bgSoft}}/>)}</div>
              <div style={{fontSize:10,color:T.inkMuted,width:30,textAlign:"right"}}>L{lvl}</div>
            </div>);})}</div>
            <div style={{marginTop:14,padding:10,background:T.bgMuted,borderRadius:6,fontSize:11,color:T.inkSec}}>💡 Click any skill in the Skills Repository or Career Path to see linked training, certification, and mentor.</div>
          </div>}
          
          {idTab==="docs"&&<div>
            <div style={S.label}>Documents</div>
            <div style={{marginTop:8}}>
              <div style={{...S.flex,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:8,background:T.bgMuted}}>
                <span style={{fontSize:24}}>📄</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>{sel.cv}</div>
                  <div style={{fontSize:10,color:T.inkMuted}}>Curriculum Vitae · PDF · 245KB · Updated 2026-03-15</div>
                </div>
                <button onClick={()=>setToast("📄 CV download started")} style={{...S.btn,...S.btnSm}}>⬇ Download</button>
              </div>
              <div style={{...S.flex,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:8,background:T.bgMuted}}>
                <span style={{fontSize:24}}>🔗</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>LinkedIn Profile</div>
                  <div style={{fontSize:10,color:T.inkMuted}}>{sel.linkedin}</div>
                </div>
                <button onClick={()=>setToast("🔗 Opening LinkedIn")} style={{...S.btn,...S.btnSm,...S.btnO}}>Open</button>
              </div>
              <div style={{...S.flex,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:8,background:T.bgMuted}}>
                <span style={{fontSize:24}}>🏅</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>Certifications & Achievements</div>
                  <div style={{fontSize:10,color:T.inkMuted}}>Available on request</div>
                </div>
                <button onClick={()=>setToast("🏅 Requesting certifications")} style={{...S.btn,...S.btnSm,...S.btnO}}>Request</button>
              </div>
            </div>
          </div>}
        </div>
        
        <div style={{padding:"14px 24px",borderTop:`1px solid ${T.border}`,background:T.bgMuted,display:"flex",gap:8}}>
          <button onClick={()=>setToast(`📧 Contact request sent to ${sel.name}`)} style={S.btn}>📧 Contact</button>
          <button onClick={()=>{setToast(`🎯 Interview scheduled with ${sel.name}`);go("interviews");}} style={{...S.btn,background:T.teal}}>🎯 Schedule Interview</button>
        </div>
      </div>
    </div>);
  }

  if(selJob){const mp=matchPct(selJob.skills);const already=hasExpressed(selJob.id);
    return(<div>
      <button onClick={()=>setSelJob(null)} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:10}}>← Back</button>
      <div style={{...S.card,padding:22,border:`2px solid ${T.ocean}18`,maxWidth:680}}>
        <div style={S.between}><div style={{fontSize:9,fontWeight:700,color:T.ocean,letterSpacing:1.5}}>JOB DESCRIPTION · {selJob.id}</div><Bd status={selJob.urgency}/></div>
        <h2 style={{fontFamily:FH,fontSize:20,fontWeight:700,marginTop:10}}>{selJob.title}</h2>
        <div style={{...S.flex,marginTop:6,fontSize:11,color:T.inkSec}}><span>{selJob.entity}</span><span>·</span><span>{selJob.city}, {selJob.country}</span><span>·</span><span>{selJob.type}</span><span>·</span><Bd status={selJob.level}/></div>
        <div style={{fontSize:11,color:T.inkMuted,marginTop:4}}>👤 Hiring Manager: <strong>{selJob.hiringMgr}</strong></div>
        <p style={{fontSize:12,color:T.inkSec,lineHeight:1.6,marginTop:12}}>{selJob.desc}</p>
        <div style={{marginTop:12}}><div style={S.label}>Required Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{selJob.skills.map(sk=>(<span key={sk} style={{...S.tag,background:empSkills.includes(sk)?T.tealBg:T.redBg,color:empSkills.includes(sk)?T.teal:T.red}}>{sk} {empSkills.includes(sk)?"✓":"✗"}</span>))}</div></div>
        {isEmp&&<div style={{marginTop:12,padding:12,background:mp>=75?T.tealBg:mp>=50?T.oceanBg:T.orangeBg,borderRadius:8}}>
          <div style={S.between}><span style={{fontSize:12,fontWeight:700,color:mp>=75?T.teal:mp>=50?T.ocean:T.orange}}>Skill Match: {mp}%</span><div style={{flex:1,marginLeft:10}}><Bar pct={mp} color={mp>=75?T.teal:mp>=50?T.ocean:T.orange} h={8}/></div></div>
        </div>}
        <div style={{...S.flex,marginTop:14,flexWrap:"wrap"}}>
          {isEmp&&<button onClick={()=>doExpressInterest(selJob)} disabled={already} style={{...S.btn,background:already?T.inkMuted:T.teal,opacity:already?.6:1}}>{already?"✓ Interest Expressed":"🙋 Express Interest"}</button>}
          <button onClick={()=>go("careers")} style={{...S.btn,...S.btnO}}>📋 View Career Path</button>
          {(isMgr||isHR)&&<button onClick={()=>setToast(`📧 ${selJob.hiringMgr} contacted`)} style={S.btn}>📧 Contact Hiring Mgr</button>}
        </div>
      </div>
    </div>);
  }

  return(<div>
    {isHR&&<div style={{display:"flex",gap:4,marginBottom:14}}>
      <button onClick={()=>{setTab("people");setSf([]);setDf("All");setQ("");}} style={{...S.btn,background:tab==="people"?T.teal:T.bgSoft,color:tab==="people"?"#fff":T.inkSec,border:`1.5px solid ${tab==="people"?T.teal:T.border}`,borderRadius:8,padding:"10px 20px",fontSize:13}}>👥 Employees ({filPeople.length})</button>
      <button onClick={()=>{setTab("jobs");setSf([]);setDf("All");setQ("");setCountryF("All");setEntityF("All");}} style={{...S.btn,background:tab==="jobs"?T.ocean:T.bgSoft,color:tab==="jobs"?"#fff":T.inkSec,border:`1.5px solid ${tab==="jobs"?T.ocean:T.border}`,borderRadius:8,padding:"10px 20px",fontSize:13}}>📋 Positions ({JOBS.length})</button>
    </div>}
    {isMgr&&interests.length>0&&<div style={{...S.card,background:T.orangeBg,borderColor:T.orange,padding:12,marginBottom:12}}>
      <div style={S.flex}><span>🔔</span><span style={{fontSize:12,fontWeight:700,color:T.orange}}>New Interest Expressions ({interests.length})</span></div>
      <div style={{marginTop:6}}>{interests.slice(-3).map((int,i)=><div key={i} style={{fontSize:11,padding:"3px 0",color:T.inkSec}}>• <strong>{int.empName}</strong> → <strong>{int.jobTitle}</strong> ({int.date})</div>)}</div>
    </div>}
    <div style={{...S.card,padding:14}}>
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
      <div style={S.flex}><div style={{width:32,height:32,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{e.role} · {e.entity}</div></div><Bd status={e.level}/></div>
      <div style={{fontSize:10,color:T.teal,marginTop:4,fontStyle:"italic"}}>{e.intent}</div>
      {empInterests.length>0&&<div style={{fontSize:10,color:T.orange,marginTop:3}}>🎯 {empInterests.length} interest(s)</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:5}}>{e.skills.slice(0,4).map(sk=><span key={sk} style={{...S.tag,fontSize:9}}>{sk}</span>)}</div>
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
const PgTeam=({store})=>{const agents=store.agents||DEFAULT_AGENTS;return(<div><h3 style={{...S.h3,marginBottom:8}}>Human Team</h3><div style={S.g2}>{EMP.slice(0,8).map(e=>(<div key={e.id} style={S.card}><div style={S.flex}><div style={{width:28,height:28,borderRadius:"50%",background:T.axaBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{e.avatar}</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{e.role} · {e.entity}</div></div><Bd status={e.level}/></div></div>))}</div><div style={{marginTop:16,paddingTop:12,borderTop:`2px solid ${T.violet}18`}}><div style={S.flex}><span>🤖</span><h3 style={{...S.h3,margin:0}}>AI Agents Team</h3></div><div style={{...S.g3,marginTop:8}}>{agents.map(a=>(<div key={a.id} style={{...S.card,borderLeft:`3px solid ${a.status==="active"?T.violet:T.inkDim}`}}><div style={{fontSize:11,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.role}</div><div style={{fontSize:9,color:T.inkDim,marginTop:3}}>{a.model}</div><div style={{...S.flex,marginTop:6}}><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet}}>{a.accuracy}%</span></div></div>))}</div></div></div>);};

// ══════════════════════════════════════════════════════════════
// INTERVIEWS — with AI Skill Assessment + Job Matching step
// ══════════════════════════════════════════════════════════════
const DEFAULT_IVS=[
  {id:1,emp:EMP[0],date:"2026-04-25",st:"Scheduled",wf:0,ans:{},gap:null,plan:null,matches:null},
  {id:2,emp:EMP[1],date:"2026-04-22",st:"In Progress",wf:1,ans:{1:"Strategic / transversal"},gap:null,plan:null,matches:null},
  {id:3,emp:EMP[2],date:"2026-04-10",st:"Completed",wf:6,ans:{3:"VP Product"},
    gap:{targetRole:"VP Product",currentSkills:EMP[2].skills,targetSkills:["Strategic Thinking","Financial Modeling","Leadership","Data Governance","Product Management"],gaps:[{s:"Strategic Thinking",c:2,r:5,p:"High",status:"In Progress",empConfirmed:true,mgrValidated:true,assessment:null},{s:"Financial Modeling",c:1,r:4,p:"High",status:"Not Started",empConfirmed:true,mgrValidated:false,assessment:null},{s:"Leadership",c:3,r:5,p:"Medium",status:"In Progress",empConfirmed:true,mgrValidated:true,assessment:null},{s:"Data Governance",c:0,r:3,p:"Medium",status:"Not Started",empConfirmed:false,mgrValidated:false,assessment:null}]},
    plan:{jobId:"J3",status:"Draft",readiness:3,timeline:"6-12mo",mgrNotes:"Strong strategic potential.",empNotes:"Excited to grow.",nextReview:"2026-08-01",completion:65},matches:null},
];

const PgIV=({persona,store,setStore,setToast,go,setFocusSkill})=>{
  const allPaths=useMemo(()=>{
    const tpl=[{d:"Tech",p:["Junior → Senior → Lead → Architect"]},{d:"Data",p:["DS → Lead DS → Chief DS"]}];
    return tpl.flatMap(g=>g.p.map((p,i)=>{const steps=p.split(" → ");return{id:i,domain:g.d,steps:steps.map(s=>({title:s}))};}));
  },[]);
  const ivs=store.ivs||DEFAULT_IVS;
  const setIvs=(fn)=>{const updated=typeof fn==="function"?fn(ivs):fn;setStore(p=>({...p,ivs:updated}));};
  
  const[v,setV]=useState("list");const[aiv,setAiv]=useState(null);const[cq,setCq]=useState(0);const[ans,setAns]=useState({});const[ft,setFt]=useState({});const[ma,setMa]=useState({});const[pv,setPv]=useState(null);const[showSch,setShowSch]=useState(false);const[schEmp,setSchEmp]=useState("");const[schDt,setSchDt]=useState("2026-05-05");
  
  // Assessment state
  const[assessSkill,setAssessSkill]=useState(null);
  const[assessQuestions,setAssessQuestions]=useState([]);
  const[assessAns,setAssessAns]=useState({});
  
  const jobSugg=useMemo(()=>aiv?getJobSugg(aiv.emp,allPaths):[],[aiv?.emp?.id,allPaths]);
  
  const startIV=iv=>{setAiv(iv);setAns(iv.ans||{});setFt({});setMa({});setCq(0);setV("iv");};
  const doSave=()=>{const a={...ans};Object.entries(ma).forEach(([k,vl])=>{a[k]=vl.join(", ");});Object.entries(ft).forEach(([k,vl])=>{if(vl)a[k]=vl;});setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"In Progress",wf:Math.max(i.wf,1),ans:a}:i));setAiv(prev=>({...prev,ans:a}));setToast("✅ Interview saved");};
  
  const genGap=(emp,a)=>{const target=a[3]||a["3c"]||`Senior ${emp.role}`;const cur=a[4]?a[4].split(", "):emp.skills;const des=a[6]?a[6].split(", "):SKILLS.slice(5,10);const targetSkills=[...des.filter(s=>!cur.includes(s)),"Strategic Thinking","Leadership"].slice(0,5);return{targetRole:target,currentSkills:cur,targetSkills,gaps:targetSkills.map(s=>({s,c:Math.floor(Math.random()*2),r:3+Math.floor(Math.random()*3),p:["High","Medium","Low"][Math.floor(Math.random()*3)],status:"Not Started",empConfirmed:false,mgrValidated:false,assessment:null}))};};
  
  const findMatchingJob=(targetRole)=>{const lower=targetRole.toLowerCase();return JOBS.find(j=>j.title.toLowerCase().includes(lower)||lower.includes(j.title.toLowerCase().split(" ")[0]))||JOBS[0];};
  
  const complIV=()=>{const a={...ans};Object.entries(ma).forEach(([k,vl])=>{a[k]=vl.join(", ");});Object.entries(ft).forEach(([k,vl])=>{if(vl)a[k]=vl;});const gap=genGap(aiv.emp,a);const job=findMatchingJob(gap.targetRole);const plan={jobId:job.id,status:"Draft",readiness:2,timeline:"6-12mo",mgrNotes:"",empNotes:"",nextReview:"2026-08-01",completion:10};setIvs(p=>p.map(i=>i.id===aiv.id?{...i,st:"Gap Analysis",wf:2,ans:a,gap,plan}:i));setAiv(null);setV("list");setToast("✅ Interview complete");};
  
  const doSch=()=>{if(!schEmp)return;const emp=EMP.find(e=>e.name===schEmp);if(!emp)return;setIvs(p=>[...p,{id:Date.now(),emp,date:schDt,st:"Scheduled",wf:0,ans:{},gap:null,plan:null,matches:null}]);setShowSch(false);setSchEmp("");setToast("✅ Interview scheduled");};

  // ─── ASSESSMENT FLOW ───
  const startAssessment=(skill)=>{
    const seed=Date.now();
    const questions=generateAssessment(skill,seed);
    setAssessSkill(skill);
    setAssessQuestions(questions);
    setAssessAns({});
  };
  
  const submitAssessment=()=>{
    let correct=0;
    assessQuestions.forEach((q,i)=>{if(assessAns[i]===q.correct)correct++;});
    const score=Math.round((correct/assessQuestions.length)*100);
    const newLevel=Math.max(1,Math.min(5,Math.round(score/20)));
    
    // Update gap
    const newGaps=pv.gap.gaps.map(g=>g.s===assessSkill?{...g,assessment:{score,date:new Date().toISOString().slice(0,10),mgrValidated:false},c:newLevel}:g);
    setIvs(p=>p.map(i=>i.id===pv.id?{...i,gap:{...i.gap,gaps:newGaps}}:i));
    setPv(p=>({...p,gap:{...p.gap,gaps:newGaps}}));
    setToast(`✅ Assessment complete: ${score}% · Level updated to L${newLevel}`);
    setAssessSkill(null);setAssessQuestions([]);setAssessAns({});
  };

  const validateAssessment=(skill)=>{
    const newGaps=pv.gap.gaps.map(g=>g.s===skill?{...g,assessment:{...g.assessment,mgrValidated:true},mgrValidated:true}:g);
    setIvs(p=>p.map(i=>i.id===pv.id?{...i,gap:{...i.gap,gaps:newGaps}}:i));
    setPv(p=>({...p,gap:{...p.gap,gaps:newGaps}}));
    setToast("✅ Assessment validated by manager");
  };

  // ─── JOB MATCHING ───
  const generateMatches=()=>{
    const scored=JOBS.map(j=>({job:j,score:calcJobMatch(pv.emp,j,pv.gap)})).sort((a,b)=>b.score-a.score);
    setIvs(p=>p.map(i=>i.id===pv.id?{...i,matches:scored,wf:5}:i));
    setPv(p=>({...p,matches:scored,wf:5}));
    setToast("✅ Job matching complete · 8 jobs scored");
  };
  
  const applyToJob=(job)=>{
    const apps=store.applications||[];
    const newApp={empId:pv.emp.id,empName:pv.emp.name,jobId:job.id,jobTitle:job.title,date:new Date().toISOString().slice(0,10),status:"Applied"};
    setStore(p=>({...p,applications:[...apps.filter(a=>!(a.empId===pv.emp.id&&a.jobId===job.id)),newApp]}));
    setIvs(p=>p.map(i=>i.id===pv.id?{...i,wf:6,st:"Completed"}:i));
    setToast(`✅ Applied to ${job.title}`);
  };

  const WFS=({step})=>(<div style={{display:"flex",alignItems:"center",margin:"6px 0"}}>{WF.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",flex:1}}><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:18,height:18,borderRadius:"50%",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:i<step?T.teal:i===step?T.tealBg:T.bgSoft,color:i<step?"#fff":i===step?T.teal:T.inkDim,border:i===step?`2px solid ${T.teal}`:"none"}}>{i<step?"✓":i+1}</div><div style={{fontSize:6,color:i<=step?T.ink:T.inkDim,marginTop:1,textAlign:"center",maxWidth:42}}>{s}</div></div>{i<WF.length-1&&<div style={{flex:1,height:1,background:i<step?T.teal:T.bgSoft,marginBottom:10}}/>}</div>))}</div>);

  // ═══ ASSESSMENT MODAL ═══
  const AssessmentModal=()=>assessSkill?(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}} onClick={()=>setAssessSkill(null)}>
    <div style={{...S.card,width:600,maxHeight:"90vh",overflowY:"auto",padding:0,animation:"popIn .3s ease"}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:"20px 24px",background:`linear-gradient(135deg,${T.violet},${T.axaBlue})`,color:"#fff",borderRadius:"10px 10px 0 0"}}>
        <div style={{fontSize:9,fontWeight:700,color:T.axaGold,letterSpacing:2,textTransform:"uppercase"}}>🤖 AI-Powered Skill Assessment</div>
        <h3 style={{fontFamily:FH,fontSize:20,fontWeight:700,marginTop:6}}>{assessSkill}</h3>
        <div style={{fontSize:11,color:"rgba(255,255,255,.75)",marginTop:4}}>3 dynamic questions · Generated by AXA-AssessBot · Each assessment is unique</div>
      </div>
      <div style={{padding:24}}>
        {assessQuestions.map((q,i)=>(<div key={i} style={{marginBottom:18,padding:14,background:T.bgMuted,borderRadius:8}}>
          <div style={{fontSize:10,color:T.violet,fontWeight:700,letterSpacing:1,marginBottom:6}}>QUESTION {i+1}/{assessQuestions.length}</div>
          <div style={{fontSize:13,fontWeight:600,color:T.ink,marginBottom:10}}>{q.q}</div>
          {q.o.map((opt,oi)=>(<div key={oi} onClick={()=>setAssessAns(p=>({...p,[i]:oi}))} style={{padding:"8px 12px",margin:"3px 0",borderRadius:6,cursor:"pointer",border:`1.5px solid ${assessAns[i]===oi?T.violet:T.border}`,background:assessAns[i]===oi?T.violetBg:T.bgCard}}>
            <div style={S.flex}><div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${assessAns[i]===oi?T.violet:T.inkDim}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{assessAns[i]===oi&&<div style={{width:6,height:6,borderRadius:"50%",background:T.violet}}/>}</div><span style={{fontSize:12,color:T.ink}}>{opt}</span></div>
          </div>))}
        </div>))}
        <div style={{...S.flex,marginTop:14}}>
          <button onClick={submitAssessment} disabled={Object.keys(assessAns).length<assessQuestions.length} style={{...S.btn,background:T.violet,opacity:Object.keys(assessAns).length<assessQuestions.length?.5:1}}>✅ Submit Assessment</button>
          <button onClick={()=>setAssessSkill(null)} style={{...S.btn,...S.btnO}}>Cancel</button>
          <span style={{fontSize:11,color:T.inkMuted,marginLeft:"auto"}}>{Object.keys(assessAns).length}/{assessQuestions.length} answered</span>
        </div>
      </div>
    </div>
  </div>):null;

  // ═══ GAP VIEW with Assess button ═══
  if(v==="gap"&&pv&&pv.gap){
    const g=pv.gap;
    const updateGap=(skillName,field,value)=>{const newGaps=g.gaps.map(gg=>gg.s===skillName?{...gg,[field]:value}:gg);setIvs(p=>p.map(i=>i.id===pv.id?{...i,gap:{...i.gap,gaps:newGaps}}:i));setPv(p=>({...p,gap:{...p.gap,gaps:newGaps}}));};
    const totalValidated=g.gaps.filter(gg=>gg.mgrValidated&&gg.empConfirmed).length;const completionPct=Math.round((totalValidated/g.gaps.length)*100);
    
    return(<div><AssessmentModal/>
      <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h1}>🔬 Skills Gap Analysis</h2><p style={{fontSize:11,color:T.inkSec}}>{pv.emp.name} · Target: <strong style={{color:T.red}}>{g.targetRole}</strong></p></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:T.red}}>{completionPct}%</div><div style={{fontSize:9,color:T.inkMuted}}>Validated</div></div>
      </div>
      
      <div style={{...S.card,background:T.violetBg,borderColor:`${T.violet}30`,marginTop:8}}>
        <div style={S.flex}><span>🤖</span><span style={{fontSize:11,fontWeight:700,color:T.violet}}>AI ASSESSMENT AVAILABLE</span></div>
        <div style={{fontSize:11,color:T.inkSec,marginTop:4}}>Click <strong>"Assess Skill"</strong> on any skill below to launch a dynamic AI-powered questionnaire. Each assessment generates unique questions adapted to the skill type. Results update the skill level and require manager validation.</div>
      </div>
      
      <h3 style={{...S.h3,marginTop:14,marginBottom:6}}>Skills · Validation · AI Assessment</h3>
      {g.gaps.map((gg,i)=>(<div key={i} style={{...S.card,padding:14}}>
        <div style={S.between}>
          <div style={S.flex}>
            <span onClick={()=>{setFocusSkill(gg.s);go("careers");}} style={{fontSize:13,fontWeight:700,color:T.axaBlue,textDecoration:"underline",cursor:"pointer"}}>{gg.s}</span>
            <Bd status={gg.p}/><Bd status={gg.status}/>
            {gg.assessment&&<Bd status={`Score: ${gg.assessment.score}%`} custom={gg.assessment.score>=70?T.teal:T.orange}/>}
          </div>
          <button onClick={()=>startAssessment(gg.s)} style={{...S.btn,...S.btnSm,background:T.violet}}>🤖 Assess Skill</button>
        </div>
        
        <div style={{...S.flex,marginTop:8}}>
          <span style={{fontSize:10,color:T.inkMuted,width:60}}>Lv{gg.c} → Lv{gg.r}</span>
          <div style={{flex:1}}><Bar pct={(gg.c/gg.r)*100} color={gg.c>=gg.r?T.teal:gg.c>=gg.r/2?T.orange:T.red}/></div>
          <span style={{fontSize:10,fontWeight:600,color:T.inkMuted}}>{Math.round((gg.c/gg.r)*100)}%</span>
        </div>
        
        <div style={{marginTop:8,padding:10,background:T.bgMuted,borderRadius:6}}>
          <div style={{fontSize:9,fontWeight:700,color:T.inkMuted,letterSpacing:1,marginBottom:4}}>LINKED RESOURCES</div>
          <div style={{fontSize:11,lineHeight:1.6}}>
            <div>📚 <strong>Training:</strong> {getLearning(gg.s).train}</div>
            <div>🏅 <strong>Certification:</strong> {getLearning(gg.s).cert}</div>
            <div>👤 <strong>Mentor:</strong> {getLearning(gg.s).mentor}</div>
          </div>
        </div>
        
        {gg.assessment&&<div style={{marginTop:8,padding:10,background:T.violetBg,borderRadius:6,borderLeft:`3px solid ${T.violet}`}}>
          <div style={S.between}>
            <div><div style={{fontSize:10,fontWeight:700,color:T.violet,letterSpacing:1}}>AI ASSESSMENT RESULT</div><div style={{fontSize:11,color:T.inkSec,marginTop:2}}>Score: {gg.assessment.score}% · Date: {gg.assessment.date} · {gg.assessment.mgrValidated?"✓ Validated":"⏳ Awaiting validation"}</div></div>
            {!gg.assessment.mgrValidated&&<button onClick={()=>validateAssessment(gg.s)} style={{...S.btn,...S.btnSm,background:T.teal}}>✓ Validate as Manager</button>}
          </div>
        </div>}
        
        <div style={{...S.g2,marginTop:8,gap:8}}>
          <div><label style={S.label}>Status</label><select style={{...S.select,width:"100%"}} value={gg.status} onChange={e=>updateGap(gg.s,"status",e.target.value)}><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Validated</option></select></div>
          <div><label style={S.label}>Current Level</label><select style={{...S.select,width:"100%"}} value={gg.c} onChange={e=>updateGap(gg.s,"c",parseInt(e.target.value))}>{[0,1,2,3,4,5].map(l=><option key={l} value={l}>Lv{l}</option>)}</select></div>
        </div>
        
        <div style={{...S.g2,marginTop:8,gap:8}}>
          <label style={{...S.flex,cursor:"pointer",padding:8,background:gg.empConfirmed?T.tealBg:T.bgSoft,borderRadius:6}}><input type="checkbox" checked={gg.empConfirmed} onChange={e=>updateGap(gg.s,"empConfirmed",e.target.checked)}/><span style={{fontSize:11}}>✓ Employee confirmed</span></label>
          <label style={{...S.flex,cursor:"pointer",padding:8,background:gg.mgrValidated?T.tealBg:T.bgSoft,borderRadius:6}}><input type="checkbox" checked={gg.mgrValidated} onChange={e=>updateGap(gg.s,"mgrValidated",e.target.checked)}/><span style={{fontSize:11}}>✓ Manager validated</span></label>
        </div>
      </div>))}
      
      <div style={S.flex}>
        <button onClick={()=>setToast("✅ Gap analysis saved")} style={S.btn}>💾 Save Gap</button>
        <button onClick={()=>setV("plan")} style={{...S.btn,...S.btnG}}>→ Action Plan</button>
        <button onClick={()=>{generateMatches();setV("matches");}} style={{...S.btn,background:T.axaGold,color:T.ink}}>🎯 Generate Job Matches</button>
      </div>
    </div>);
  }

  // ═══ JOB MATCHING VIEW ═══
  if(v==="matches"&&pv){
    const matches=pv.matches||JOBS.map(j=>({job:j,score:calcJobMatch(pv.emp,j,pv.gap)})).sort((a,b)=>b.score-a.score);
    const apps=store.applications||[];
    const hasApplied=(jobId)=>apps.some(a=>a.empId===pv.emp.id&&a.jobId===jobId);
    
    return(<div>
      <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h1}>🎯 AI Job Matching</h2><p style={{fontSize:11,color:T.inkSec}}>{pv.emp.name} · Aspiration: <strong style={{color:T.teal}}>{pv.gap?.targetRole||pv.emp.intent}</strong></p></div>
        <Bd status={`${matches.length} jobs scored`} custom={T.axaGold}/>
      </div>
      
      <div style={{...S.card,background:`linear-gradient(135deg,${T.axaGold}15,${T.orange}10)`,borderColor:T.axaGold,marginTop:10}}>
        <div style={S.flex}><span>🤖</span><span style={{fontSize:11,fontWeight:700,color:T.orange}}>AXA-SkillMatch · Matching Engine</span></div>
        <div style={{fontSize:11,color:T.inkSec,marginTop:4}}>Match score combines: <strong>Skills (60%)</strong> + <strong>Aspiration alignment (20%)</strong> + <strong>Gap completion progress (20%)</strong>. Top 3 matches highlighted in gold.</div>
      </div>
      
      <div style={{marginTop:12}}>{matches.map((m,i)=>{const isTop=i<3;const applied=hasApplied(m.job.id);return(<div key={m.job.id} style={{...S.card,padding:18,border:isTop?`2px solid ${T.axaGold}`:`1px solid ${T.border}`,background:isTop?`${T.axaGold}06`:T.bgCard,position:"relative"}}>
        {isTop&&<div style={{position:"absolute",top:-9,left:14,background:T.axaGold,color:T.ink,padding:"2px 10px",borderRadius:10,fontSize:9,fontWeight:700,letterSpacing:1}}>★ TOP MATCH #{i+1}</div>}
        <div style={S.between}>
          <div style={{flex:1}}>
            <h3 style={{fontFamily:FH,fontSize:16,fontWeight:700}}>{m.job.title}</h3>
            <div style={{fontSize:11,color:T.inkSec,marginTop:3}}>{m.job.entity} · {m.job.city}, {m.job.country} · {m.job.level} · 👤 {m.job.hiringMgr}</div>
            <p style={{fontSize:11,color:T.inkMuted,marginTop:6,lineHeight:1.4}}>{m.job.desc}</p>
          </div>
          <div style={{textAlign:"right",marginLeft:20,minWidth:100}}>
            <div style={{fontSize:32,fontWeight:800,fontFamily:FH,color:m.score>=75?T.teal:m.score>=50?T.ocean:T.orange}}>{m.score}%</div>
            <div style={{fontSize:9,color:T.inkMuted,letterSpacing:1,fontWeight:600}}>MATCH SCORE</div>
            <div style={{marginTop:4,maxWidth:90}}><Bar pct={m.score} color={m.score>=75?T.teal:m.score>=50?T.ocean:T.orange} h={6}/></div>
          </div>
        </div>
        
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:10}}>{m.job.skills.map(sk=>(<span key={sk} style={{...S.tag,background:pv.emp.skills.includes(sk)?T.tealBg:T.redBg,color:pv.emp.skills.includes(sk)?T.teal:T.red}}>{sk} {pv.emp.skills.includes(sk)?"✓":"✗"}</span>))}</div>
        
        <div style={{...S.flex,marginTop:12}}>
          <button onClick={()=>applyToJob(m.job)} disabled={applied} style={{...S.btn,background:applied?T.inkMuted:T.teal,opacity:applied?.6:1}}>{applied?"✓ Applied":"📤 Apply"}</button>
          <button onClick={()=>setToast(`📋 Saved ${m.job.title} for later`)} style={{...S.btn,...S.btnO}}>⭐ Save</button>
          <button onClick={()=>setToast(`📧 ${m.job.hiringMgr} contacted`)} style={{...S.btn,...S.btnO}}>📧 Contact Mgr</button>
          <span style={{marginLeft:"auto",fontSize:10,color:T.inkMuted}}>Posted {m.job.posted}</span>
        </div>
      </div>);})}</div>
      
      <div style={S.flex}>
        <button onClick={generateMatches} style={{...S.btn,...S.btnO}}>↻ Regenerate Matches</button>
        <button onClick={()=>setV("gap")} style={{...S.btn,...S.btnO}}>← Back to Gap</button>
      </div>
    </div>);
  }

  // ═══ PLAN VIEW ═══
  if(v==="plan"&&pv&&pv.plan){
    const plan=pv.plan;const job=JOBS.find(j=>j.id===plan.jobId)||JOBS[0];const empSkills=pv.emp.skills;const matchPct=Math.round((job.skills.filter(s=>empSkills.includes(s)).length/job.skills.length)*100);const isLocked=plan.status==="Finalized";
    const updatePlan=(field,value)=>{setIvs(p=>p.map(i=>i.id===pv.id?{...i,plan:{...i.plan,[field]:value}}:i));setPv(p=>({...p,plan:{...p.plan,[field]:value}}));};
    const doSavePlan=()=>setToast("✅ Action plan saved");
    const doFinalize=()=>{updatePlan("status","Finalized");setToast("🔒 Plan finalized and locked");};
    
    return(<div>
      <button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
      <div style={S.between}>
        <div><h2 style={S.h1}>📋 Action Plan</h2><p style={{fontSize:11,color:T.inkSec}}>{pv.emp.name} · Target: <strong style={{color:T.teal}}>{job.title}</strong> ({job.id})</p></div>
        <div style={S.flex}><Bd status={plan.status}/><div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:T.teal}}>{plan.completion}%</div></div></div>
      </div>
      
      <div style={{...S.card,background:T.oceanBg,borderColor:`${T.ocean}30`,marginTop:8}}>
        <div style={S.between}><div style={{fontSize:10,fontWeight:700,color:T.ocean,letterSpacing:1}}>MATCHED ATS JOB · {job.id}</div><Bd status={`Match ${matchPct}%`} custom={matchPct>=75?T.teal:T.ocean}/></div>
        <h4 style={{fontSize:14,fontWeight:700,marginTop:5}}>{job.title}</h4>
        <div style={{fontSize:11,color:T.inkSec,marginTop:2}}>{job.entity} · {job.city}, {job.country} · 👤 {job.hiringMgr}</div>
      </div>
      
      <div style={{...S.g3,marginTop:10}}>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.teal,marginBottom:6}}>✅ Tasks</h4>{job.tasks.map((t,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {t}</div>)}</div>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:6}}>🎯 Milestones</h4>{job.milestones.map((m,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {m}</div>)}</div>
        <div style={S.card}><h4 style={{fontSize:12,fontWeight:700,color:T.violet,marginBottom:6}}>📦 Deliverables</h4>{job.deliverables.map((d,i)=><div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>• {d}</div>)}</div>
      </div>
      
      <div style={{...S.card,marginTop:10}}>
        <h3 style={{...S.h3,marginBottom:10}}>Plan Details {isLocked&&<span style={{fontSize:10,color:T.violet,marginLeft:8}}>🔒 LOCKED</span>}</h3>
        <div style={{...S.g2,gap:10}}>
          <div><label style={S.label}>Readiness</label><select disabled={isLocked} style={{...S.select,width:"100%",opacity:isLocked?.6:1}} value={plan.readiness} onChange={e=>updatePlan("readiness",parseInt(e.target.value))}><option value={1}>1 - Not ready</option><option value={2}>2 - Developing</option><option value={3}>3 - Approaching</option><option value={4}>4 - Ready</option><option value={5}>5 - Fully ready</option></select></div>
          <div><label style={S.label}>Timeline</label><select disabled={isLocked} style={{...S.select,width:"100%",opacity:isLocked?.6:1}} value={plan.timeline} onChange={e=>updatePlan("timeline",e.target.value)}><option>3-6mo</option><option>6-12mo</option><option>12-18mo</option></select></div>
        </div>
        <div style={{marginTop:10}}><label style={S.label}>Manager Comments</label><textarea disabled={isLocked} style={{...S.input,minHeight:60,opacity:isLocked?.6:1}} value={plan.mgrNotes} onChange={e=>updatePlan("mgrNotes",e.target.value)}/></div>
        <div style={{marginTop:10}}><label style={S.label}>Employee Comments</label><textarea disabled={isLocked} style={{...S.input,minHeight:60,opacity:isLocked?.6:1}} value={plan.empNotes} onChange={e=>updatePlan("empNotes",e.target.value)}/></div>
        <div style={{...S.flex,marginTop:14}}>
          <button onClick={doSavePlan} disabled={isLocked} style={{...S.btn,opacity:isLocked?.5:1}}>💾 Save</button>
          <button onClick={doFinalize} disabled={isLocked} style={{...S.btn,...S.btnG,opacity:isLocked?.5:1}}>{isLocked?"🔒 Finalized":"✅ Finalize"}</button>
          <button onClick={()=>{generateMatches();setV("matches");}} style={{...S.btn,background:T.axaGold,color:T.ink}}>🎯 Find Matching Jobs</button>
        </div>
      </div>
    </div>);
  }

  if(v==="iv"&&aiv){const curQ=IQ[cq];const show=!curQ.on||ans[curQ.on]===curQ.val;
    return(<div><button onClick={()=>setV("list")} style={{...S.btn,...S.btnO,...S.btnSm,marginBottom:8}}>← Back</button>
    <div style={S.between}><div><h2 style={S.h1}>Interview: {aiv.emp.name}</h2></div><button onClick={doSave} style={{...S.btn,...S.btnSm}}>💾 Save</button></div>
    <div style={{margin:"6px 0"}}><Bar pct={(cq+1)/IQ.length*100}/><div style={{fontSize:10,color:T.inkMuted,marginTop:2}}>Q{cq+1}/{IQ.length}</div></div>
    {show?(<div style={{...S.card,padding:18,marginTop:6}}>
    <h3 style={{fontFamily:FH,fontSize:15,fontWeight:700,margin:"4px 0 10px"}}>{curQ.q}</h3>
    {curQ.t==="s"&&curQ.o.map(opt=>(<div key={opt} onClick={()=>setAns(p=>({...p,[curQ.id]:opt}))} style={{padding:"8px 10px",margin:"3px 0",borderRadius:6,cursor:"pointer",border:`1.5px solid ${ans[curQ.id]===opt?T.teal:T.border}`,background:ans[curQ.id]===opt?T.tealBg:"transparent"}}><div style={S.flex}><div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${ans[curQ.id]===opt?T.teal:T.inkDim}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{ans[curQ.id]===opt&&<div style={{width:6,height:6,borderRadius:"50%",background:T.teal}}/>}</div><span style={{fontSize:12}}>{opt}</span></div></div>))}
    {curQ.t==="m"&&<Chips options={curQ.o} selected={ma[curQ.id]||[]} onToggle={val=>setMa(p=>{const c=p[curQ.id]||[];return{...p,[curQ.id]:c.includes(val)?c.filter(x=>x!==val):[...c,val]};})} max={curQ.o.length}/>}
    {curQ.t==="x"&&<textarea style={{...S.input,minHeight:60}} value={ft[curQ.id]||""} onChange={e=>setFt(p=>({...p,[curQ.id]:e.target.value}))}/>}
    {curQ.t==="job"&&(<div>
      <div style={{fontSize:11,fontWeight:600,marginBottom:5}}>Suggested:</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>{jobSugg.map(j=>(<span key={j} onClick={()=>setAns(p=>({...p,[curQ.id]:j}))} style={{...S.badge,cursor:"pointer",padding:"5px 10px",fontSize:11,background:ans[curQ.id]===j?T.tealBg:T.bgSoft,color:ans[curQ.id]===j?T.teal:T.inkSec,border:`1.5px solid ${ans[curQ.id]===j?T.teal:T.border}`,borderRadius:6}}>{j}</span>))}</div>
      <input style={S.input} placeholder="Or custom..." value={ft["3c"]||""} onChange={e=>{setFt(p=>({...p,"3c":e.target.value}));if(e.target.value)setAns(p=>({...p,[curQ.id]:e.target.value}));}}/>
    </div>)}
    </div>):(<div style={{...S.card,padding:18,marginTop:6,textAlign:"center",color:T.inkMuted}}>⏭️ Skipped</div>)}
    <div style={{...S.between,marginTop:8}}><button onClick={()=>setCq(p=>Math.max(0,p-1))} disabled={cq===0} style={{...S.btn,...S.btnO}}>←</button>{cq<IQ.length-1?<button onClick={()=>setCq(p=>p+1)} style={S.btn}>Next→</button>:<button onClick={complIV} style={{...S.btn,...S.btnG}}>✅ Complete</button>}</div></div>);
  }

  const SchM=()=>showSch?(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowSch(false)}><div style={{...S.card,width:360,padding:22}} onClick={e=>e.stopPropagation()}><h3 style={S.h3}>Schedule Interview</h3><div style={{marginTop:10,marginBottom:8}}><label style={S.label}>Employee</label><select style={{...S.select,width:"100%"}} value={schEmp} onChange={e=>setSchEmp(e.target.value)}><option value="">Select...</option>{EMP.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}</select></div><div style={{marginBottom:8}}><label style={S.label}>Date</label><input style={S.input} type="date" value={schDt} onChange={e=>setSchDt(e.target.value)}/></div><div style={S.flex}><button onClick={doSch} style={S.btn}>Schedule</button><button onClick={()=>setShowSch(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div></div></div>):null;

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
        {iv.gap&&<button onClick={()=>{setPv(iv);setV("gap");}} style={{...S.btn,...S.btnSm,background:T.red,color:"#fff"}}>🔬 Gap</button>}
        {iv.plan&&<button onClick={()=>{setPv(iv);setV("plan");}} style={{...S.btn,...S.btnSm,...S.btnG}}>📋 Plan</button>}
        {iv.gap&&<button onClick={()=>{setPv(iv);if(!iv.matches){generateMatches();}setV("matches");}} style={{...S.btn,...S.btnSm,background:T.axaGold,color:T.ink}}>🎯 Match</button>}
      </div>
    </div>))}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// CAREERS
// ══════════════════════════════════════════════════════════════
const PgCareer=({focusSkill})=>{
  const all=useMemo(()=>genPaths(),[]);const[df,setDf]=useState("All");const[q,setQ]=useState(focusSkill||"");const[exp,setExp]=useState(null);const[pg,setPg]=useState(0);const pp=12;
  const fil=all.filter(p=>(df==="All"||p.domain===df)&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.steps.some(s=>s.title.toLowerCase().includes(q.toLowerCase()))));
  const paged=fil.slice(pg*pp,(pg+1)*pp);const tp=Math.ceil(fil.length/pp);
  
  return(<div>
    {focusSkill&&<div style={{...S.card,background:T.orangeBg,borderColor:T.orange,padding:12}}>
      <div style={S.flex}><span>🎯</span><span style={{fontSize:11,fontWeight:700,color:T.orange}}>Focused on: {focusSkill}</span></div>
      <div style={{marginTop:6,fontSize:11}}>📚 {getLearning(focusSkill).train} · 🏅 {getLearning(focusSkill).cert} · 👤 {getLearning(focusSkill).mentor}</div>
    </div>}
    <div style={{...S.card,padding:10}}><div style={{...S.flex,gap:6}}><input style={{...S.input,maxWidth:160}} placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/><select style={S.select} value={df} onChange={e=>setDf(e.target.value)}><option value="All">All</option>{DOMAINS.map(d=><option key={d}>{d}</option>)}</select></div></div>
    <div style={S.g3}>{paged.map(p=>(<div key={p.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setExp(exp===p.id?null:p.id)}><div style={S.between}><Bd status={p.domain} custom={T.teal}/><Bd status={p.type} custom={T.violet}/></div><h4 style={{fontSize:11,fontWeight:700,margin:"5px 0"}}>{p.name}</h4>{exp===p.id&&<div style={{padding:"6px 0"}}>{p.steps.map((s,i)=>(<div key={i} style={{...S.flex,padding:"3px 0"}}><span style={{fontSize:10,fontWeight:600,color:T.teal,width:24}}>L{s.level}</span><span style={{fontSize:11}}>{s.title}</span></div>))}</div>}</div>))}</div>
    <div style={{...S.flex,justifyContent:"center",marginTop:8}}><button disabled={pg===0} onClick={()=>setPg(p=>p-1)} style={{...S.btn,...S.btnSm,...S.btnO}}>←</button><span style={{fontSize:10}}>{pg+1}/{tp}</span><button disabled={pg>=tp-1} onClick={()=>setPg(p=>p+1)} style={{...S.btn,...S.btnSm,...S.btnO}}>→</button></div>
  </div>);
};

// ══════════════════════════════════════════════════════════════
// REFS
// ══════════════════════════════════════════════════════════════
const PgRefs=({store,setStore,setToast})=>{
  const[tab,setTab]=useState("skills");const[q,setQ]=useState("");
  const added=store.addedSkills||[];const allSk=[...SKILLS,...added];const allPaths=useMemo(()=>genPaths(),[]);
  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:12}}>
      <button onClick={()=>setTab("skills")} style={{...S.btn,background:tab==="skills"?T.teal:T.bgSoft,color:tab==="skills"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>💡 Skills ({allSk.length})</button>
      <button onClick={()=>setTab("paths")} style={{...S.btn,background:tab==="paths"?T.ocean:T.bgSoft,color:tab==="paths"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>🚀 Paths ({allPaths.length})</button>
      <button onClick={()=>setTab("jobs")} style={{...S.btn,background:tab==="jobs"?T.violet:T.bgSoft,color:tab==="jobs"?"#fff":T.inkSec,borderRadius:8,padding:"10px 18px"}}>📋 ATS ({JOBS.length})</button>
    </div>
    <input style={{...S.input,maxWidth:260,marginBottom:10}} placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
    {tab==="skills"&&Object.entries(SKILL_CATS).map(([cat,sks])=>{const f=sks.filter(s=>!q||s.toLowerCase().includes(q.toLowerCase()));if(!f.length)return null;return<div key={cat} style={S.card}><h3 style={{...S.h3,marginBottom:6}}>{cat}</h3><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{f.map(s=>(<div key={s} style={{background:T.bgMuted,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 8px",fontSize:10}}>{s}</div>))}</div></div>;})}
    {tab==="paths"&&<div style={S.g3}>{allPaths.filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase())).slice(0,18).map(p=>(<div key={p.id} style={S.card}><Bd status={p.domain} custom={T.teal}/><h4 style={{fontSize:11,fontWeight:700,marginTop:6}}>{p.name}</h4></div>))}</div>}
    {tab==="jobs"&&<div style={S.g2}>{JOBS.filter(j=>!q||j.title.toLowerCase().includes(q.toLowerCase())).map(j=>(<div key={j.id} style={S.card}><div style={S.between}><h4 style={{fontSize:13,fontWeight:700,margin:0}}>{j.title}</h4><Bd status={j.urgency}/></div><div style={{fontSize:10,color:T.inkSec,marginTop:4}}>{j.id} · {j.entity}</div></div>))}</div>}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// AGENTS
// ══════════════════════════════════════════════════════════════
const PgAgents=({store,setStore,setToast})=>{
  const agents=store.agents||DEFAULT_AGENTS;
  const setAgents=(fn)=>setStore(p=>({...p,agents:typeof fn==="function"?fn(agents):fn}));
  const[showNew,setShowNew]=useState(false);
  const[newA,setNewA]=useState({name:"",role:"",prompt:"",model:LLM_MODELS[0],validator:"",container:CONTAINERS[0],status:"idle"});
  const createAgent=()=>{if(!newA.name||!newA.role){setToast("⚠️ Name and role required");return;}setAgents(p=>[...p,{...newA,id:`ai-${Date.now()}`,accuracy:85,tasks:0,deployed:new Date().toISOString().slice(0,10)}]);setToast("✅ Agent created");setShowNew(false);setNewA({name:"",role:"",prompt:"",model:LLM_MODELS[0],validator:"",container:CONTAINERS[0],status:"idle"});};
  
  return(<div>
    <div style={S.between}><div><h3 style={S.h3}>AI Agents Management</h3></div><button onClick={()=>setShowNew(true)} style={S.btn}>+ New Agent</button></div>
    <div style={{...S.g4,marginTop:12}}>{[{l:"Active",v:agents.filter(a=>a.status==="active").length,c:T.teal},{l:"Training",v:agents.filter(a=>a.status==="training").length,c:T.orange},{l:"Idle",v:agents.filter(a=>a.status==="idle").length,c:T.inkMuted},{l:"Tasks",v:agents.reduce((s,a)=>s+a.tasks,0),c:T.violet}].map(k=>(<div key={k.l} style={S.card}><div style={{fontSize:9,color:T.inkMuted,textTransform:"uppercase",fontWeight:600}}>{k.l}</div><div style={{fontSize:24,fontWeight:800,fontFamily:FH,color:k.c,marginTop:4}}>{k.v}</div></div>))}</div>
    <div style={{...S.g2,marginTop:12}}>{agents.map(a=>(<div key={a.id} style={{...S.card,borderLeft:`4px solid ${a.status==="active"?T.teal:a.status==="training"?T.orange:T.inkDim}`}}>
      <div style={S.between}><div style={S.flex}><span style={{fontSize:18}}>🤖</span><div><div style={{fontSize:13,fontWeight:700}}>{a.name}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.role}</div></div></div><Bd status={a.status}/></div>
      <div style={{fontSize:10,color:T.inkSec,marginTop:6}}>Model: {a.model} · {a.container}</div>
      <div style={{fontSize:10,color:T.inkSec}}>Validator: {a.validator}</div>
      <div style={{...S.flex,marginTop:8}}><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet}}>{a.accuracy}%</span></div>
    </div>))}</div>
    {showNew&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}} onClick={()=>setShowNew(false)}><div style={{...S.card,width:480,padding:24,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <h3 style={S.h3}>Create AI Agent</h3>
      <div style={{marginTop:12}}><label style={S.label}>Name *</label><input style={S.input} value={newA.name} onChange={e=>setNewA(p=>({...p,name:e.target.value}))}/></div>
      <div style={{marginTop:10}}><label style={S.label}>Role *</label><input style={S.input} value={newA.role} onChange={e=>setNewA(p=>({...p,role:e.target.value}))}/></div>
      <div style={{marginTop:10}}><label style={S.label}>Prompt</label><textarea style={{...S.input,minHeight:80}} value={newA.prompt} onChange={e=>setNewA(p=>({...p,prompt:e.target.value}))}/></div>
      <div style={{...S.g2,marginTop:10}}>
        <div><label style={S.label}>Model</label><select style={{...S.select,width:"100%"}} value={newA.model} onChange={e=>setNewA(p=>({...p,model:e.target.value}))}>{LLM_MODELS.map(m=><option key={m}>{m}</option>)}</select></div>
        <div><label style={S.label}>Container</label><select style={{...S.select,width:"100%"}} value={newA.container} onChange={e=>setNewA(p=>({...p,container:e.target.value}))}>{CONTAINERS.map(c=><option key={c}>{c}</option>)}</select></div>
      </div>
      <div style={{...S.flex,marginTop:14}}><button onClick={createAgent} style={S.btn}>✅ Create</button><button onClick={()=>setShowNew(false)} style={{...S.btn,...S.btnO}}>Cancel</button></div>
    </div></div>}
  </div>);
};

// ══════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════
const PgRep=({store})=>{const agents=store.agents||DEFAULT_AGENTS;const apps=store.applications||[];return(<div>
  <div style={S.g4}>{[{l:"Mobility",v:"23%",p:77,c:T.teal},{l:"Fill",v:"18d",p:90,c:T.green},{l:"Skills",v:"72%",p:85,c:T.ocean},{l:"Apps",v:apps.length||0,p:60,c:T.violet}].map(m=>(<div key={m.l} style={S.card}><div style={{fontSize:9,color:T.inkMuted,textTransform:"uppercase",fontWeight:600}}>{m.l}</div><div style={{fontSize:22,fontWeight:800,fontFamily:FH,color:m.c,margin:"3px 0"}}>{m.v}</div><Bar pct={m.p} color={m.c}/></div>))}</div>
  <div style={S.g2}>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:6}}>By Domain</h3>{DOMAINS.slice(0,5).map((d,i)=>(<div key={d} style={{...S.flex,marginBottom:5}}><span style={{fontSize:10,width:90}}>{d}</span><div style={{flex:1}}><Bar pct={[65,82,45,58,73][i]}/></div><span style={{fontSize:10,fontWeight:600,width:24,textAlign:"right"}}>{[65,82,45,58,73][i]}%</span></div>))}</div>
    <div style={S.card}><h3 style={{...S.h3,marginBottom:6}}>AI Agents</h3>{agents.map(a=>(<div key={a.id} style={{...S.flex,marginBottom:5}}><span style={{fontSize:10,width:100}}>{a.name}</span><div style={{flex:1}}><Bar pct={a.accuracy} color={T.violet}/></div><span style={{fontSize:10,fontWeight:700,color:T.violet,width:28,textAlign:"right"}}>{a.accuracy}%</span></div>))}</div>
  </div>
  {apps.length>0&&<div style={S.card}><h3 style={{...S.h3,marginBottom:6}}>Recent Applications ({apps.length})</h3>{apps.slice(-5).map((a,i)=>(<div key={i} style={{...S.flex,padding:"6px 0",borderBottom:`1px solid ${T.border}`}}><div style={{flex:1,fontSize:11}}><strong>{a.empName}</strong> → {a.jobTitle}</div><div style={{fontSize:10,color:T.inkMuted}}>{a.date}</div><Bd status={a.status}/></div>))}</div>}
</div>);};

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function App(){
  const[auth,setAuth]=useState(false);const[persona,setPersona]=useState(null);const[pg,setPg]=useState("dashboard");
  const[store,setStore]=useState(loadStore());const[toast,setToast]=useState(null);const[focusSkill,setFocusSkill]=useState(null);
  
  useEffect(()=>{saveStore(store);},[store]);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t);}},[toast]);
  
  if(!auth)return<Auth onLogin={p=>{setPersona(p);setAuth(true);}}/>;
  
  const titles={dashboard:"Dashboard",charter:"Smart Mobility Charter",marketplace:"Talent Marketplace",team:"My Team",interviews:"Career Interviews",careers:"Career Paths",refs:"Data & Referentials",agents:"AI Agents Management",reports:"Reports"};
  const pages={dashboard:<PgDash go={setPg} store={store}/>,charter:<PgCharter/>,marketplace:<PgMarket persona={persona} store={store} setStore={setStore} setToast={setToast} go={setPg}/>,team:<PgTeam store={store}/>,interviews:<PgIV persona={persona} store={store} setStore={setStore} setToast={setToast} go={setPg} setFocusSkill={setFocusSkill}/>,careers:<PgCareer focusSkill={focusSkill}/>,refs:<PgRefs store={store} setStore={setStore} setToast={setToast}/>,agents:<PgAgents store={store} setStore={setStore} setToast={setToast}/>,reports:<PgRep store={store}/>};
  
  return(<div style={{fontFamily:FT,background:T.bg,color:T.ink,minHeight:"100vh",display:"flex",overflow:"hidden",height:"100vh",fontSize:12}}>
    <style>{css}</style>
    <Side active={pg} go={setPg} persona={persona} onLogout={()=>{setAuth(false);setPersona(null);setPg("dashboard");}}/>
    <div style={{flex:1,overflow:"auto",padding:"0 22px 22px"}}>
      <div style={{...S.between,padding:"10px 0 12px",borderBottom:`1px solid ${T.border}`,marginBottom:12}}>
        <div><h1 style={S.h1}>{titles[pg]}</h1><p style={{fontSize:10,color:T.inkMuted,marginTop:1}}>Mobility by Design · AXA Group Ops · v8.0</p></div>
        <Bd status={persona?.label} custom={persona?.color}/>
      </div>
      {pages[pg]}
    </div>
    <Toast msg={toast}/>
  </div>);
}
