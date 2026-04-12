import { useState, useMemo } from "react";

// ── Design System ──────────────────────────────────────────────
const C = {
  blue:"#00008F",blueD:"#000070",blueM:"#1A1AB0",blueTint:"#E8E8FF",bluePale:"#F0F0FF",
  red:"#C91432",redTint:"#FDEDF0",
  ink:"#0A0A1E",inkSoft:"#3A3A5C",inkMuted:"#7A7A9A",
  surface:"#F4F5FA",border:"#E0E0F0",card:"#FFFFFF",
  green:"#007A4D",greenBg:"rgba(0,122,77,0.09)",greenTint:"#E8F5EE",
  amber:"#B85C00",amberBg:"rgba(184,92,0,0.09)",amberTint:"#FEF3E2",
  purple:"#5C2D91",purpleBg:"rgba(92,45,145,0.09)",
  teal:"#006D77",tealBg:"rgba(0,109,119,0.09)",
  ai:"#7C3AED",aiBg:"rgba(124,58,237,0.09)",aiTint:"#EDE9FE",
  gold:"#C5921A",goldBg:"rgba(197,146,26,0.1)",
};

const RBAC = {
  admin:   ["read","write","delete","approve","configure","manage_ai","view_analytics","manage_users","view_marketplace","manage_team"],
  hr:      ["read","write","approve","view_analytics","manage_users","view_marketplace","manage_team"],
  manager: ["read","write","approve","view_analytics","view_marketplace","manage_team"],
  employee:["read","write_own"],
};
const canDo = (user, perm) => RBAC[user?.role]?.includes(perm);

const uid = () => Math.random().toString(36).slice(2,8);
const initials = n => n?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "—";
const yearsAt = d => { const y=(new Date()-new Date(d))/(1000*60*60*24*365.25); return Math.floor(y*10)/10; };

const POOL_META = {
  "High Performer": { color:C.gold, bg:C.goldBg, icon:"⭐" },
  "Techie":         { color:C.blue, bg:C.blueTint, icon:"💻" },
  "Future Leader":  { color:C.purple, bg:C.purpleBg, icon:"🚀" },
  "Innovation":     { color:C.teal, bg:C.tealBg, icon:"💡" },
  "AI Champion":    { color:C.ai, bg:C.aiTint, icon:"🤖" },
  "Mobilité+":      { color:C.green, bg:C.greenTint, icon:"🔄" },
};

// ── Seed Data ──────────────────────────────────────────────────
const SEED = {
  employees: [
    {id:"e1",name:"Sophie Martin",   email:"s.martin@axa.com",   department:"Technology",role:"Senior Developer",        manager:"e5",hire_date:"2018-03-15",type:"human",status:"active",pools:["High Performer","Techie"],mobility_open:true},
    {id:"e2",name:"Lucas Bernard",   email:"l.bernard@axa.com",   department:"Finance",   role:"Financial Analyst",       manager:"e6",hire_date:"2020-07-01",type:"human",status:"active",pools:["Mobilité+"],mobility_open:false},
    {id:"e3",name:"Emma Rousseau",   email:"e.rousseau@axa.com",  department:"HR",        role:"HR Business Partner",     manager:"e5",hire_date:"2019-11-20",type:"human",status:"active",pools:["Future Leader","Innovation"],mobility_open:true},
    {id:"e4",name:"Thomas Leclerc",  email:"t.leclerc@axa.com",   department:"Technology",role:"Data Engineer",           manager:"e5",hire_date:"2021-02-10",type:"human",status:"active",pools:["Techie","AI Champion"],mobility_open:true},
    {id:"e5",name:"Alexandre Dupont",email:"a.dupont@axa.com",    department:"Technology",role:"Director Engineering",    manager:null, hire_date:"2015-01-10",type:"human",status:"active",pools:["Future Leader"],mobility_open:false,is_manager:true},
    {id:"e6",name:"Isabelle Sanville",email:"i.sanville@axa.com", department:"Finance",   role:"CFO",                    manager:null, hire_date:"2013-05-20",type:"human",status:"active",pools:["High Performer"],mobility_open:false,is_manager:true},
    {id:"e7",name:"Camille Petit",   email:"c.petit@axa.com",     department:"Technology",role:"Cloud Architect",         manager:"e5",hire_date:"2017-06-01",type:"human",status:"active",pools:["Techie","High Performer"],mobility_open:true},
    {id:"e8",name:"Marc Fontaine",   email:"m.fontaine@axa.com",  department:"HR",        role:"L&D Specialist",          manager:"e3",hire_date:"2020-03-15",type:"human",status:"active",pools:["Innovation"],mobility_open:false},
    {id:"ai1",name:"ARIA-Matcher",   email:"aria@axa-ai.internal",department:"Technology",role:"AI Matching Agent",       manager:"e5",hire_date:"2024-06-01",type:"ai_agent",status:"active",lifecycle:"deployed",model:"GPT-4o",version:"2.1",accuracy:94.2,requests:847,pools:["AI Champion"]},
    {id:"ai2",name:"SKIM-Analyzer",  email:"skim@axa-ai.internal",department:"HR",        role:"Skills Intelligence",    manager:"e3",hire_date:"2024-09-01",type:"ai_agent",status:"active",lifecycle:"deployed",model:"Claude-3.5",version:"1.4",accuracy:91.8,requests:234,pools:["AI Champion"]},
    {id:"ai3",name:"FLOW-Orchestrator",email:"flow@axa-ai.internal",department:"HR",    role:"Workflow Orchestration", manager:"e3",hire_date:"2025-01-15",type:"ai_agent",status:"training",lifecycle:"training",model:"Claude-3.5",version:"0.8",accuracy:78.3,requests:0,pools:[]},
  ],
  employee_skills:[
    {id:"es1",employee_id:"e1",skill_id:"sk01",current_level:4,target_level:5,validated:true},
    {id:"es2",employee_id:"e1",skill_id:"sk11",current_level:3,target_level:4,validated:true},
    {id:"es3",employee_id:"e1",skill_id:"sk03",current_level:2,target_level:4,validated:true},
    {id:"es4",employee_id:"e2",skill_id:"sk07",current_level:4,target_level:5,validated:true},
    {id:"es5",employee_id:"e3",skill_id:"sk12",current_level:5,target_level:5,validated:true},
    {id:"es6",employee_id:"e3",skill_id:"sk14",current_level:4,target_level:5,validated:true},
    {id:"es7",employee_id:"e4",skill_id:"sk02",current_level:4,target_level:5,validated:true},
    {id:"es8",employee_id:"e4",skill_id:"sk04",current_level:3,target_level:5,validated:false},
    {id:"es9",employee_id:"ai1",skill_id:"sk19",current_level:5,target_level:5,validated:true},
    {id:"es10",employee_id:"ai2",skill_id:"sk21",current_level:4,target_level:5,validated:true},
    {id:"es11",employee_id:"e7",skill_id:"sk03",current_level:5,target_level:5,validated:true},
    {id:"es12",employee_id:"e7",skill_id:"sk01",current_level:3,target_level:4,validated:true},
  ],
  skills_ref:[
    {id:"sk01",name:"JavaScript / TypeScript",category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk02",name:"Python",                 category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk03",name:"Cloud Architecture",     category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk04",name:"Data Engineering",       category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk05",name:"DevOps / CI-CD",         category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk06",name:"Machine Learning",       category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk07",name:"Financial Modelling",    category:"Domain",     applicable_to:["human"]},
    {id:"sk08",name:"Risk Management",        category:"Domain",     applicable_to:["human"]},
    {id:"sk09",name:"Insurance Products",     category:"Domain",     applicable_to:["human"]},
    {id:"sk11",name:"Leadership & Influence", category:"Soft Skills",applicable_to:["human"]},
    {id:"sk12",name:"Change Management",      category:"Soft Skills",applicable_to:["human"]},
    {id:"sk13",name:"Communication",          category:"Soft Skills",applicable_to:["human"]},
    {id:"sk14",name:"Stakeholder Management", category:"Soft Skills",applicable_to:["human"]},
    {id:"sk15",name:"Coaching & Mentoring",   category:"Soft Skills",applicable_to:["human"]},
    {id:"sk16",name:"Strategic Thinking",     category:"Strategic",  applicable_to:["human","ai_agent"]},
    {id:"sk17",name:"Programme Management",   category:"Strategic",  applicable_to:["human","ai_agent"]},
    {id:"sk18",name:"Business Architecture",  category:"Strategic",  applicable_to:["human","ai_agent"]},
    {id:"sk19",name:"Talent Matching & Scoring",category:"AI Capability",applicable_to:["ai_agent"]},
    {id:"sk21",name:"Skills Gap Analysis",    category:"AI Capability",applicable_to:["ai_agent"]},
    {id:"sk22",name:"Workflow Orchestration", category:"AI Capability",applicable_to:["ai_agent"]},
  ],
  learning_catalog:[
    {id:"lc01",title:"AWS Solutions Architect",provider:"AWS Training",type:"Certification",duration:"40h",url:"https://aws.amazon.com/training/",skill_ids:["sk03"],level:"Advanced",cost:"Free with AXA subscription"},
    {id:"lc02",title:"Python for Data Science",provider:"Coursera / DeepLearning.AI",type:"MOOC",duration:"30h",url:"https://www.coursera.org/specializations/python",skill_ids:["sk02","sk06"],level:"Intermediate",cost:"AXA-funded"},
    {id:"lc03",title:"Leadership Essentials",provider:"LinkedIn Learning",type:"Course",duration:"8h",url:"https://linkedin.com/learning",skill_ids:["sk11","sk15"],level:"Beginner",cost:"AXA-funded"},
    {id:"lc04",title:"Change Management Practitioner",provider:"APMG International",type:"Certification",duration:"24h",url:"https://apmg-international.com",skill_ids:["sk12"],level:"Advanced",cost:"External — budget approval"},
    {id:"lc05",title:"Stakeholder Engagement",provider:"LinkedIn Learning",type:"Course",duration:"5h",url:"https://linkedin.com/learning",skill_ids:["sk14","sk13"],level:"Intermediate",cost:"AXA-funded"},
    {id:"lc06",title:"Strategic Business Architecture",provider:"TOGAF / Open Group",type:"Certification",duration:"60h",url:"https://opengroup.org/togaf",skill_ids:["sk16","sk18"],level:"Advanced",cost:"External — budget approval"},
    {id:"lc07",title:"Programme Management (MSP)",provider:"AXELOS",type:"Certification",duration:"35h",url:"https://axelos.com",skill_ids:["sk17"],level:"Advanced",cost:"External — budget approval"},
    {id:"lc08",title:"Data Engineering Fundamentals",provider:"DataCamp",type:"MOOC",duration:"20h",url:"https://datacamp.com",skill_ids:["sk04"],level:"Beginner",cost:"AXA-funded"},
    {id:"lc09",title:"Financial Risk Management",provider:"GARP",type:"Certification",duration:"80h",url:"https://garp.org",skill_ids:["sk07","sk08"],level:"Advanced",cost:"External — budget approval"},
    {id:"lc10",title:"Machine Learning Specialization",provider:"Coursera / Stanford",type:"MOOC",duration:"45h",url:"https://coursera.org/specializations/machine-learning",skill_ids:["sk06","sk02"],level:"Advanced",cost:"AXA-funded"},
    {id:"lc11",title:"TypeScript in Depth",provider:"Pluralsight",type:"Course",duration:"12h",url:"https://pluralsight.com",skill_ids:["sk01"],level:"Intermediate",cost:"AXA-funded"},
    {id:"lc12",title:"DevOps & CI/CD Fundamentals",provider:"GitLab Training",type:"Course",duration:"15h",url:"https://about.gitlab.com/learn",skill_ids:["sk05"],level:"Intermediate",cost:"Free"},
  ],
  career_paths:[
    {id:"cp01",title:"Tech Leadership Track",department:"Technology",nodes:[
      {id:"n1",role:"Developer",level:1},
      {id:"n2",role:"Senior Developer",level:2},
      {id:"n3",role:"Tech Lead",level:3},
      {id:"n4a",role:"Solution Architect",level:4},
      {id:"n4b",role:"Engineering Manager",level:4},
      {id:"n5",role:"Director Engineering",level:5},
    ],edges:[
      {from:"n1",to:"n2",timeline:"2Y",skills:["sk01","sk03"],label:"Senior promotion"},
      {from:"n2",to:"n3",timeline:"2Y",skills:["sk01","sk11","sk13"],label:"Lead transition"},
      {from:"n3",to:"n4a",timeline:"3Y",skills:["sk03","sk16","sk18"],label:"Architecture fork"},
      {from:"n3",to:"n4b",timeline:"2Y",skills:["sk11","sk15","sk17"],label:"Management fork"},
      {from:"n4a",to:"n5",timeline:"4Y",skills:["sk16","sk17","sk18"],label:"Director path"},
      {from:"n4b",to:"n5",timeline:"3Y",skills:["sk16","sk17","sk11"],label:"Director path"},
    ]},
    {id:"cp02",title:"Data & AI Track",department:"Technology",nodes:[
      {id:"d1",role:"Data Analyst",level:1},
      {id:"d2",role:"Data Engineer",level:2},
      {id:"d3a",role:"ML Engineer",level:3},
      {id:"d3b",role:"Data Architect",level:3},
      {id:"d4",role:"Chief Data Officer",level:4},
    ],edges:[
      {from:"d1",to:"d2",timeline:"2Y",skills:["sk02","sk04"],label:"Engineering move"},
      {from:"d2",to:"d3a",timeline:"2Y",skills:["sk06","sk02"],label:"ML specialisation"},
      {from:"d2",to:"d3b",timeline:"3Y",skills:["sk03","sk16","sk04"],label:"Architecture fork"},
      {from:"d3a",to:"d4",timeline:"4Y",skills:["sk16","sk18","sk17"],label:"CDO path"},
      {from:"d3b",to:"d4",timeline:"3Y",skills:["sk16","sk18","sk17"],label:"CDO path"},
    ]},
    {id:"cp03",title:"HR & People Track",department:"HR",nodes:[
      {id:"h1",role:"HR Assistant",level:1},
      {id:"h2",role:"HR Business Partner",level:2},
      {id:"h3a",role:"HR Transformation Lead",level:3},
      {id:"h3b",role:"L&D Manager",level:3},
      {id:"h4",role:"Chief People Officer",level:4},
    ],edges:[
      {from:"h1",to:"h2",timeline:"2Y",skills:["sk12","sk14","sk13"],label:"Partner promotion"},
      {from:"h2",to:"h3a",timeline:"3Y",skills:["sk12","sk17","sk16"],label:"Transformation fork"},
      {from:"h2",to:"h3b",timeline:"2Y",skills:["sk15","sk12","sk13"],label:"L&D fork"},
      {from:"h3a",to:"h4",timeline:"4Y",skills:["sk16","sk17","sk11"],label:"CPO path"},
      {from:"h3b",to:"h4",timeline:"4Y",skills:["sk16","sk17","sk11"],label:"CPO path"},
    ]},
  ],
  interviews:[
    {id:"i1",employee_id:"e1",employee_name:"Sophie Martin", department:"Technology",interviewer:"Alexandre Dupont",  scheduled_date:"2024-01-15",status:"completed",mobility_readiness:4,skills_assessed:true, next_interview_due:"2027-01-15",aspirations:"Solution Architect",notes:"Strong profile, ready for arch track"},
    {id:"i2",employee_id:"e2",employee_name:"Lucas Bernard", department:"Finance",   interviewer:"Isabelle Sanville", scheduled_date:"2026-04-10",status:"scheduled", mobility_readiness:null,skills_assessed:false,next_interview_due:"2029-04-10",aspirations:null,notes:""},
    {id:"i3",employee_id:"e3",employee_name:"Emma Rousseau", department:"HR",        interviewer:"Alexandre Dupont",  scheduled_date:"2025-06-01",status:"completed",mobility_readiness:5,skills_assessed:true, next_interview_due:"2028-06-01",aspirations:"HR Transformation Lead",notes:"Exceptional readiness score"},
    {id:"i4",employee_id:"e4",employee_name:"Thomas Leclerc",department:"Technology",interviewer:"Alexandre Dupont",  scheduled_date:"2025-09-15",status:"completed",mobility_readiness:3,skills_assessed:true, next_interview_due:"2028-09-15",aspirations:"ML Engineer",notes:"ML interest confirmed"},
  ],
  action_plans:[
    {id:"a1",employee_id:"e1",employee_name:"Sophie Martin",title:"Cloud Architecture Certification",description:"AWS SA certification",horizon:"1Y",status:"in_progress",due_date:"2025-01-15"},
    {id:"a2",employee_id:"e1",employee_name:"Sophie Martin",title:"Technical Leadership Mentoring",  description:"Shadow senior architect",horizon:"1Y",status:"completed",  due_date:"2024-07-15"},
    {id:"a3",employee_id:"e3",employee_name:"Emma Rousseau", title:"Programme Management Training",   description:"MSP certification",     horizon:"2Y",status:"open",        due_date:"2027-01-01"},
    {id:"a4",employee_id:"e4",employee_name:"Thomas Leclerc",title:"Machine Learning Fundamentals",  description:"Coursera ML course",    horizon:"1Y",status:"in_progress",due_date:"2026-09-01"},
  ],
  opportunities:[
    {id:"o1",title:"Solution Architect",    department:"Technology",required_skills:["sk01","sk03","sk11"],location:"Paris",open_date:"2026-03-01",status:"open",priority:"high"},
    {id:"o2",title:"Senior Data Engineer",  department:"Technology",required_skills:["sk02","sk04","sk03"],location:"Lyon", open_date:"2026-02-15",status:"open",priority:"critical"},
    {id:"o3",title:"HR Transformation Lead",department:"HR",        required_skills:["sk12","sk17","sk14"],location:"Paris",open_date:"2026-03-10",status:"open",priority:"normal"},
    {id:"o4",title:"ML Engineer",           department:"Technology",required_skills:["sk06","sk02","sk04"],location:"Paris",open_date:"2026-04-01",status:"open",priority:"high"},
  ],
  matches:[
    {id:"m1",employee_id:"e1",employee_name:"Sophie Martin", employee_dept:"Technology",opportunity_id:"o1",job_title:"Solution Architect",   location:"Paris",priority:"high",    match_score:87,status:"suggested",scored_by:"ai1"},
    {id:"m2",employee_id:"e4",employee_name:"Thomas Leclerc",employee_dept:"Technology",opportunity_id:"o2",job_title:"Senior Data Engineer",  location:"Lyon", priority:"critical",match_score:91,status:"reviewed", scored_by:"ai1"},
    {id:"m3",employee_id:"e3",employee_name:"Emma Rousseau", employee_dept:"HR",        opportunity_id:"o3",job_title:"HR Transformation Lead", location:"Paris",priority:"normal",  match_score:94,status:"suggested",scored_by:"ai1"},
    {id:"m4",employee_id:"e4",employee_name:"Thomas Leclerc",employee_dept:"Technology",opportunity_id:"o4",job_title:"ML Engineer",           location:"Paris",priority:"high",    match_score:79,status:"suggested",scored_by:"ai1"},
  ],
  workflows:[
    {id:"wf1",title:"Internal Mobility — Sophie Martin",employee_id:"e1",employee_name:"Sophie Martin",type:"mobility_request",target_role:"Solution Architect",status:"validated",current_step:4,created_at:"2026-02-01",steps:[
      {id:"s1",label:"Employee Request",role:"employee",status:"completed",actor:"Sophie Martin",completed_at:"2026-02-01"},
      {id:"s2",label:"Manager Review",  role:"manager", status:"completed",actor:"A. Dupont",    completed_at:"2026-02-05",notes:"Strongly recommended"},
      {id:"s3",label:"HR Validation",   role:"hr",      status:"completed",actor:"Emma Rousseau",completed_at:"2026-02-10",notes:"Approved — profile aligned"},
      {id:"s4",label:"AI Smart Fit",    role:"ai_agent",status:"completed",actor:"ARIA-Matcher", completed_at:"2026-02-10",notes:"87% match score"},
      {id:"s5",label:"Assignment Order",role:"hr",      status:"pending",  actor:"HR Team",      completed_at:null},
    ]},
    {id:"wf2",title:"Career Interview — Lucas Bernard",employee_id:"e2",employee_name:"Lucas Bernard",type:"career_interview",target_role:null,status:"draft",current_step:0,created_at:"2026-03-20",steps:[
      {id:"s1",label:"Schedule Interview",role:"hr",      status:"pending",actor:null,completed_at:null},
      {id:"s2",label:"Pre-interview prep",role:"employee",status:"pending",actor:null,completed_at:null},
      {id:"s3",label:"Interview session", role:"manager", status:"pending",actor:null,completed_at:null},
      {id:"s4",label:"Skills Assessment", role:"ai_agent",status:"pending",actor:null,completed_at:null},
      {id:"s5",label:"Action Plan",       role:"hr",      status:"pending",actor:null,completed_at:null},
    ]},
    {id:"wf3",title:"Upskilling — Thomas Leclerc",employee_id:"e4",employee_name:"Thomas Leclerc",type:"upskilling",target_role:"ML Engineer",status:"in_progress",current_step:2,created_at:"2026-01-10",steps:[
      {id:"s1",label:"Gap Analysis",    role:"ai_agent",status:"completed",actor:"SKIM-Analyzer",completed_at:"2026-01-12",notes:"2 skill gaps identified"},
      {id:"s2",label:"Plan Design",     role:"hr",      status:"completed",actor:"Emma Rousseau",completed_at:"2026-01-18"},
      {id:"s3",label:"Manager Approval",role:"manager", status:"in_progress",actor:"A. Dupont",  completed_at:null},
      {id:"s4",label:"Enrollment",      role:"employee",status:"pending",  actor:null,           completed_at:null},
      {id:"s5",label:"Progress Tracking",role:"ai_agent",status:"pending", actor:null,           completed_at:null},
    ]},
  ],
  role_skills:[
    {id:"rs01",role:"Senior Developer",    department:"Technology",required_skills:[{skill_id:"sk01",level:4},{skill_id:"sk03",level:3},{skill_id:"sk11",level:2}]},
    {id:"rs02",role:"Solution Architect",  department:"Technology",required_skills:[{skill_id:"sk01",level:4},{skill_id:"sk03",level:5},{skill_id:"sk11",level:4},{skill_id:"sk16",level:4}]},
    {id:"rs03",role:"Data Engineer",       department:"Technology",required_skills:[{skill_id:"sk02",level:4},{skill_id:"sk04",level:4},{skill_id:"sk03",level:3}]},
    {id:"rs04",role:"Financial Analyst",   department:"Finance",   required_skills:[{skill_id:"sk07",level:4},{skill_id:"sk14",level:3}]},
    {id:"rs05",role:"HR Business Partner", department:"HR",        required_skills:[{skill_id:"sk12",level:3},{skill_id:"sk14",level:4}]},
  ],
  analytics:{
    skills_coverage:[
      {department:"Technology",total_skills:8,assessed:6,coverage:75},
      {department:"Finance",   total_skills:5,assessed:2,coverage:40},
      {department:"HR",        total_skills:6,assessed:5,coverage:83},
    ],
    talent_hoarding:[
      {manager:"Alexandre Dupont",dept:"Technology",employees_blocked:2,avg_tenure:5.1,risk:"high"},
      {manager:"Isabelle Sanville",dept:"Finance",  employees_blocked:0,avg_tenure:2.8,risk:"low"},
    ],
    promoter_metrics:[
      {name:"Sophie Martin", manager:"A. Dupont",mobility_score:87,readiness:4,recommended:true},
      {name:"Emma Rousseau", manager:"A. Dupont",mobility_score:94,readiness:5,recommended:true},
      {name:"Thomas Leclerc",manager:"A. Dupont",mobility_score:91,readiness:3,recommended:false},
    ],
    ai_vs_human:{human_tasks:1240,ai_tasks:3891,ai_accuracy:93.1},
    monthly:[
      {month:"Oct",interviews:3,matches:8, placements:1},
      {month:"Nov",interviews:4,matches:12,placements:2},
      {month:"Dec",interviews:2,matches:9, placements:1},
      {month:"Jan",interviews:5,matches:15,placements:3},
      {month:"Feb",interviews:6,matches:18,placements:4},
      {month:"Mar",interviews:4,matches:14,placements:2},
    ],
  },
};

// ── Shared UI Components ───────────────────────────────────────
const card = (x={}) => ({background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,boxShadow:"0 2px 8px rgba(0,0,143,0.04)",...x});
const TH = {textAlign:"left",fontSize:10,fontWeight:700,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",padding:"9px 14px",borderBottom:`2px solid ${C.border}`,background:C.bluePale,whiteSpace:"nowrap"};
const TD = (x={}) => ({padding:"11px 14px",borderBottom:`1px solid ${C.border}`,color:C.ink,verticalAlign:"middle",fontSize:13,...x});
const INP = {width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.ink,background:C.surface,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
const SEL = {...INP,cursor:"pointer"};

const BTN = v => {
  const b = {display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"inherit",transition:"all 0.15s"};
  return ({
    primary:  {...b,background:C.blue,   color:"#fff"},
    ai:       {...b,background:C.ai,    color:"#fff"},
    red:      {...b,background:C.red,   color:"#fff"},
    green:    {...b,background:C.green, color:"#fff"},
    outline:  {...b,background:"transparent",color:C.blue, border:`1.5px solid ${C.blue}`},
    ghost:    {...b,background:"transparent",color:C.inkMuted},
    sm:       {...b,padding:"5px 12px",fontSize:12,background:C.blue,  color:"#fff"},
    "sm-out": {...b,padding:"5px 12px",fontSize:12,background:"transparent",color:C.blue,border:`1.5px solid ${C.blue}`},
    "sm-ghost":{...b,padding:"5px 12px",fontSize:12,background:"transparent",color:C.inkMuted},
    "sm-ai":  {...b,padding:"5px 12px",fontSize:12,background:C.ai,    color:"#fff"},
    "sm-green":{...b,padding:"5px 12px",fontSize:12,background:C.green,color:"#fff"},
  })[v] || b;
};

const Badge = ({type,children,small}) => {
  const P = {
    blue:{bg:C.blueTint,co:C.blue},red:{bg:C.redTint,co:C.red},green:{bg:C.greenBg,co:C.green},
    amber:{bg:C.amberBg,co:C.amber},grey:{bg:C.surface,co:C.inkMuted},purple:{bg:C.purpleBg,co:C.purple},
    ai:{bg:C.aiBg,co:C.ai},teal:{bg:C.tealBg,co:C.teal},gold:{bg:C.goldBg,co:C.gold},
    completed:{bg:C.greenTint,co:C.green},scheduled:{bg:C.blueTint,co:C.blue},
    in_progress:{bg:C.amberTint,co:C.amber},draft:{bg:C.surface,co:C.inkMuted},
    validated:{bg:C.greenTint,co:C.green},pending:{bg:C.amberTint,co:C.amber},
    deployed:{bg:C.greenTint,co:C.green},training:{bg:C.amberTint,co:C.amber},
    open:{bg:C.blueTint,co:C.blue},suggested:{bg:C.amberTint,co:C.amber},
    reviewed:{bg:C.purpleBg,co:C.purple},human:{bg:C.blueTint,co:C.blue},
    ai_agent:{bg:C.aiBg,co:C.ai},high:{bg:C.amberTint,co:C.amber},
    critical:{bg:C.redTint,co:C.red},normal:{bg:C.greenTint,co:C.green},
  };
  const p = P[type]||P.grey;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:small?10:11,fontWeight:600,padding:small?"2px 7px":"3px 10px",borderRadius:20,background:p.bg,color:p.co,whiteSpace:"nowrap"}}>{children}</span>;
};

const PoolTag = ({pool}) => {
  const m = POOL_META[pool]||{color:C.inkMuted,bg:C.surface,icon:"●"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:m.bg,color:m.color,whiteSpace:"nowrap",border:`1px solid ${m.color}33`}}>{m.icon} {pool}</span>;
};

const SBadge = s => {
  const L={completed:"✓ Completed",scheduled:"📅 Scheduled",in_progress:"In Progress",draft:"Draft",validated:"✓ Validated",pending:"Pending",deployed:"● Deployed",training:"⟳ Training",open:"Open",suggested:"Suggested",reviewed:"Reviewed"};
  return <Badge type={s}>{L[s]||s}</Badge>;
};

const Avatar = ({name,size=36,type="human"}) => {
  const isAI = type==="ai_agent";
  const bgs = isAI?[C.aiBg,C.purpleBg]:[C.blueTint,C.redTint,C.greenBg,C.amberBg,C.goldBg];
  const cos = isAI?[C.ai,C.purple]:[C.blue,C.red,C.green,C.amber,C.gold];
  const idx = (name||"").charCodeAt(0)%bgs.length;
  return <div style={{width:size,height:size,borderRadius:isAI?"10px":"50%",background:bgs[idx],color:cos[idx],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.34,fontWeight:700,flexShrink:0,border:isAI?`2px solid ${C.ai}44`:"none",letterSpacing:"-0.5px"}}>{isAI?"🤖":initials(name)}</div>;
};

const SkillBar = ({current,target}) => (
  <div style={{position:"relative",height:8}}>
    <div style={{height:8,background:C.border,borderRadius:99}}>
      <div style={{height:"100%",width:`${(current/5)*100}%`,background:C.blue,borderRadius:99,transition:"width 0.4s ease"}}/>
    </div>
    {target>0&&<div style={{position:"absolute",top:-3,left:`${(target/5)*100}%`,transform:"translateX(-50%)",width:2,height:14,background:C.red,borderRadius:2}}/>}
  </div>
);

const StatCard = ({label,value,sub,color,icon}) => (
  <div style={{...card({padding:"16px 18px"}),borderTop:`3px solid ${color||C.blue}`}}>
    <div style={{fontSize:10,color:C.inkMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>{icon} {label}</div>
    <div style={{fontSize:28,fontWeight:900,color:C.ink,lineHeight:1.1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.inkMuted,marginTop:4}}>{sub}</div>}
  </div>
);

const Modal = ({title,onClose,children,wide}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,80,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)"}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:C.card,borderRadius:16,boxShadow:"0 32px 80px rgba(0,0,80,0.28)",padding:30,width:wide?680:520,maxWidth:"calc(100vw - 32px)",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,paddingBottom:14,borderBottom:`2px solid ${C.border}`}}>
        <div style={{fontSize:16,fontWeight:800,color:C.blue}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:C.inkMuted,lineHeight:1}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const FG = ({label,children,required}) => (
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:11,fontWeight:700,color:C.inkMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>
    {children}
  </div>
);

const Empty = ({icon,text}) => (
  <div style={{textAlign:"center",padding:"48px 24px",color:C.inkMuted}}>
    <div style={{fontSize:36,marginBottom:12}}>{icon||"📭"}</div>
    <div style={{fontSize:14,fontWeight:600}}>{text||"No data yet"}</div>
  </div>
);

// ── AUTH PAGE ──────────────────────────────────────────────────
function AuthPage({onLogin}) {
  const [step,setStep]=useState("login");
  const [email,setEmail]=useState("y.benali@axa.com");
  const [role,setRole]=useState("admin");
  const [loading,setLoading]=useState(false);
  const [code,setCode]=useState(["","","","","",""]);

  const doSSO = () => { setLoading(true); setTimeout(()=>{setLoading(false);setStep("mfa");},900); };
  const doMFA = () => {
    setLoading(true);
    const userMap = {
      admin:    {id:"u1",name:"Yassir Benali",email,role:"admin",  department:"Technology",is_manager:true},
      hr:       {id:"u2",name:"Emma Rousseau", email:"e.rousseau@axa.com",role:"hr",department:"HR",employee_id:"e3"},
      manager:  {id:"u3",name:"Alexandre Dupont",email:"a.dupont@axa.com",role:"manager",department:"Technology",employee_id:"e5",is_manager:true,team:["e1","e3","e4","e7","e8"]},
      employee: {id:"u4",name:"Sophie Martin", email:"s.martin@axa.com", role:"employee",department:"Technology",employee_id:"e1"},
    };
    setTimeout(()=>onLogin(userMap[role]||userMap.admin),600);
  };

  const roleDescs = {admin:"Full platform access + AI management",hr:"Workforce + analytics + interviews",manager:"Team management + marketplace",employee:"My career, skills & opportunities"};

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.blueD} 0%,${C.blue} 55%,${C.blueM} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 12% 55%,rgba(255,255,255,0.04),transparent 45%),radial-gradient(circle at 88% 18%,rgba(201,20,50,0.18),transparent 40%)"}}/> 
      <div style={{position:"relative",width:440,background:"rgba(255,255,255,0.97)",borderRadius:20,boxShadow:"0 40px 100px rgba(0,0,80,0.5)",overflow:"hidden"}}>
        <div style={{height:4,background:`linear-gradient(90deg,${C.red},${C.blue})`}}/>
        <div style={{padding:"40px 38px 34px"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <div style={{fontSize:32,fontWeight:900,color:C.blue,letterSpacing:5,marginBottom:2}}>AXA</div>
            <div style={{fontSize:10,color:C.inkMuted,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>Group Operations</div>
            <div style={{height:1,background:C.border,margin:"14px 0"}}/>
            <div style={{fontSize:18,fontWeight:800,color:C.ink}}>SMART Mobility</div>
            <div style={{fontSize:12,color:C.inkMuted,marginTop:3}}>Skills & People Marketplace · v4.0</div>
          </div>

          {step==="login"&&<>
            <FG label="Corporate Email" required>
              <input style={{...INP,fontSize:14,padding:"11px 14px"}} value={email} onChange={e=>setEmail(e.target.value)}/>
            </FG>
            <FG label="Demo — Select profile">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {["admin","hr","manager","employee"].map(r=>(
                  <div key={r} onClick={()=>setRole(r)} style={{padding:"10px 12px",borderRadius:10,cursor:"pointer",border:`2px solid ${role===r?C.blue:C.border}`,background:role===r?C.blue:C.card,transition:"all 0.15s"}}>
                    <div style={{fontSize:12,fontWeight:700,color:role===r?"#fff":C.ink}}>{r.charAt(0).toUpperCase()+r.slice(1)}</div>
                    <div style={{fontSize:10,color:role===r?"rgba(255,255,255,0.7)":C.inkMuted,marginTop:2}}>{roleDescs[r]}</div>
                  </div>
                ))}
              </div>
            </FG>
            <button style={{...BTN("primary"),width:"100%",justifyContent:"center",padding:"13px",fontSize:14,marginTop:6,borderRadius:10}} onClick={doSSO}>
              {loading?"Connecting…":"🔐 Sign in with Azure AD SSO"}
            </button>
            <div style={{marginTop:14,padding:"10px 14px",background:C.bluePale,borderRadius:10,fontSize:10,color:C.inkSoft,lineHeight:1.7}}>SAML 2.0 · Azure AD · Role-based access · MFA · TLS 1.3</div>
          </>}

          {step==="mfa"&&<>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:40,marginBottom:10}}>📱</div>
              <div style={{fontWeight:700,fontSize:16,color:C.ink}}>Two-Factor Authentication</div>
              <div style={{fontSize:12,color:C.inkMuted,marginTop:4}}>Enter the 6-digit code from your authenticator app</div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:24}}>
              {[0,1,2,3,4,5].map(i=>(
                <div key={i} style={{width:46,height:54,border:`2px solid ${i<=2?C.blue:C.border}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:C.blue,background:i<=2?C.bluePale:C.surface}}>
                  {["4","8","2","","",""][i]}
                </div>
              ))}
            </div>
            <button style={{...BTN("primary"),width:"100%",justifyContent:"center",padding:"13px",fontSize:14,borderRadius:10}} onClick={doMFA}>
              {loading?"Verifying…":"Verify & Continue"}
            </button>
            <button style={{...BTN("ghost"),width:"100%",justifyContent:"center",marginTop:8,fontSize:12}} onClick={()=>setStep("login")}>← Back to login</button>
          </>}
        </div>
        <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,padding:"10px 38px",display:"flex",justifyContent:"space-between",fontSize:9,color:C.inkMuted}}>
          <span>AXA Group Operations</span><span>SAML 2.0 · Secure</span><span>v4.0</span>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────
function Dashboard({data,user}) {
  const pendingMatches = data.matches.filter(m=>m.status==="suggested").length;
  const myEmpId = user.employee_id;
  const isEmployee = user.role==="employee";
  const myMatches = isEmployee ? data.matches.filter(m=>m.employee_id===myEmpId) : data.matches;
  const myInterviews = isEmployee ? data.interviews.filter(i=>i.employee_id===myEmpId) : data.interviews;
  const myPlans = isEmployee ? data.action_plans.filter(a=>a.employee_id===myEmpId) : data.action_plans;
  const mySkills = isEmployee ? data.employee_skills.filter(s=>s.employee_id===myEmpId) : data.employee_skills;

  const teamIds = user.team||[];
  const teamEmployees = data.employees.filter(e=>teamIds.includes(e.id));

  if(isEmployee) {
    const emp = data.employees.find(e=>e.id===myEmpId);
    const topMatch = myMatches.sort((a,b)=>b.match_score-a.match_score)[0];
    const gaps = mySkills.filter(s=>s.target_level>s.current_level).length;
    const nextInterview = myInterviews.find(i=>i.status==="scheduled");
    return (
      <div>
        <div style={{background:`linear-gradient(135deg,${C.blue} 0%,${C.blueM} 100%)`,borderRadius:14,padding:"22px 26px",color:"#fff",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
          <Avatar name={emp?.name||user.name} size={52}/>
          <div>
            <div style={{fontSize:11,opacity:0.6,letterSpacing:"0.05em",textTransform:"uppercase"}}>My Career Hub</div>
            <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{emp?.name||user.name}</div>
            <div style={{fontSize:12,opacity:0.75,marginTop:2}}>{emp?.role} · {emp?.department}</div>
            {emp?.pools?.map(p=><PoolTag key={p} pool={p}/>)}
          </div>
          {topMatch&&<div style={{marginLeft:"auto",textAlign:"center",background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"12px 18px"}}>
            <div style={{fontSize:28,fontWeight:900}}>{topMatch.match_score}%</div>
            <div style={{fontSize:10,opacity:0.7}}>Best match score</div>
          </div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          <StatCard label="My Skills" value={mySkills.length} sub="Assessed" color={C.blue} icon="🎯"/>
          <StatCard label="Skill Gaps" value={gaps} sub="Need development" color={gaps>0?C.amber:C.green} icon="📊"/>
          <StatCard label="Opportunities" value={myMatches.length} sub="AI-matched roles" color={C.green} icon="🔄"/>
          <StatCard label="Learning" value={data.learning_catalog.length} sub="Available courses" color={C.purple} icon="📚"/>
        </div>
        {nextInterview&&<div style={{...card({padding:"14px 18px",marginBottom:16,borderLeft:`4px solid ${C.blue}`})}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:12,fontWeight:700,color:C.blue}}>📅 Upcoming Interview</div><div style={{fontSize:13,marginTop:3}}>{nextInterview.interviewer} · {fmtDate(nextInterview.scheduled_date)}</div></div>
            <Badge type="scheduled">Scheduled</Badge>
          </div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={card()}>
            <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🎯 Top Skill Gaps</div>
            {mySkills.filter(s=>s.target_level>s.current_level).slice(0,3).map(es=>{
              const sk=data.skills_ref.find(s=>s.id===es.skill_id);
              return <div key={es.id} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                  <span style={{fontWeight:600}}>{sk?.name}</span><span style={{color:C.red}}>Gap {es.target_level-es.current_level}</span>
                </div>
                <SkillBar current={es.current_level} target={es.target_level}/>
              </div>;
            })}
            {mySkills.filter(s=>s.target_level>s.current_level).length===0&&<Empty icon="✅" text="No gaps — great work!"/>}
          </div>
          <div style={card()}>
            <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🔄 My Opportunities</div>
            {myMatches.slice(0,3).map(m=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:42,height:42,borderRadius:"50%",border:`2.5px solid ${m.match_score>=85?C.green:C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:m.match_score>=85?C.green:C.amber,flexShrink:0,background:m.match_score>=85?C.greenTint:C.amberTint}}>{m.match_score}%</div>
                <div><div style={{fontWeight:600,fontSize:13}}>{m.job_title}</div><div style={{fontSize:11,color:C.inkMuted}}>{m.location} · {m.priority} priority</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const humans = data.employees.filter(e=>e.type==="human");
  const agents = data.employees.filter(e=>e.type==="ai_agent");
  const longTenure = humans.filter(e=>yearsAt(e.hire_date)>=5||e.mobility_open);
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${C.blue} 0%,${C.blueM} 100%)`,borderRadius:14,padding:"20px 26px",color:"#fff",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:11,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Welcome back</div>
          <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{user.name}</div>
          <div style={{fontSize:12,opacity:0.7,marginTop:2}}>{user.role.charAt(0).toUpperCase()+user.role.slice(1)} · {user.department}</div>
        </div>
        <div style={{fontSize:12,opacity:0.7}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:20}}>
        <StatCard label="Employees" value={humans.length} sub="Active" color={C.blue} icon="👥"/>
        <StatCard label="AI Agents" value={agents.length} sub="Deployed: 2" color={C.ai} icon="🤖"/>
        <StatCard label="Workflows" value={data.workflows.length} sub="Active processes" color={C.amber} icon="⚙️"/>
        <StatCard label="Matches" value={pendingMatches} sub="Pending review" color={C.red} icon="🔄"/>
        <StatCard label="Interviews" value={data.interviews.filter(i=>i.status==="scheduled").length} sub="Scheduled" color={C.green} icon="🎙"/>
        <StatCard label="Marketplace" value={longTenure.length} sub="Available" color={C.purple} icon="🏪"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>⚙️ Active Workflows</div>
          {data.workflows.map(w=>(
            <div key={w.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:12}}>{w.employee_name}</span>{SBadge(w.status)}
              </div>
              <div style={{fontSize:11,color:C.inkMuted,marginBottom:6}}>{w.title}</div>
              <div style={{display:"flex",gap:2}}>{w.steps.map((s,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:s.status==="completed"?C.green:s.status==="in_progress"?C.amber:C.border}}/>)}</div>
            </div>
          ))}
        </div>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🔄 Top Matches</div>
          {data.matches.sort((a,b)=>b.match_score-a.match_score).slice(0,4).map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:40,height:40,borderRadius:"50%",border:`2.5px solid ${m.match_score>=85?C.green:C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:m.match_score>=85?C.green:C.amber,flexShrink:0,background:m.match_score>=85?C.greenTint:C.amberTint}}>{m.match_score}%</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:12}}>{m.employee_name}</div>
                <div style={{fontSize:11,color:C.inkMuted}}>→ {m.job_title}</div>
              </div>
              {SBadge(m.status)}
            </div>
          ))}
        </div>
      </div>
      <div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🤖 AI Agents Status</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {data.employees.filter(e=>e.type==="ai_agent").map(a=>(
            <div key={a.id} style={{...card({padding:"12px 14px"}),background:C.surface,borderLeft:`3px solid ${a.lifecycle==="deployed"?C.green:C.amber}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Avatar name={a.name} size={28} type="ai_agent"/><div style={{fontWeight:700,fontSize:12}}>{a.name}</div></div>
              <div style={{fontSize:11,color:C.inkMuted,marginBottom:6}}>{a.model} · v{a.version}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                {SBadge(a.lifecycle)}
                <span style={{fontWeight:800,color:a.lifecycle==="deployed"?C.green:C.amber,fontSize:13}}>{a.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MARKETPLACE ────────────────────────────────────────────────
function Marketplace({data,user,onSelectEmp}) {
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("all");
  const [poolFilter,setPoolFilter]=useState("all");
  const [deptFilter,setDeptFilter]=useState("all");
  const [tenureFilter,setTenureFilter]=useState("all");
  const [view,setView]=useState("grid");

  const allPools = Object.keys(POOL_META);
  const depts = [...new Set(data.employees.filter(e=>e.type==="human").map(e=>e.department))];

  const filtered = data.employees.filter(e=>{
    if(e.type==="ai_agent" && typeFilter==="human") return false;
    if(e.type==="human"    && typeFilter==="ai")    return false;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())||e.role.toLowerCase().includes(search.toLowerCase())||e.department.toLowerCase().includes(search.toLowerCase());
    const matchPool = poolFilter==="all" || (e.pools||[]).includes(poolFilter);
    const matchDept = deptFilter==="all" || e.department===deptFilter;
    const yrs = yearsAt(e.hire_date);
    const matchTenure = tenureFilter==="all"||
      (tenureFilter==="5plus" && yrs>=5)||
      (tenureFilter==="open"  && e.mobility_open);
    return matchSearch && matchPool && matchDept && matchTenure;
  });

  const humans = filtered.filter(e=>e.type==="human");
  const agents = filtered.filter(e=>e.type==="ai_agent");

  const PersonCard = ({e}) => {
    const yrs = yearsAt(e.hire_date);
    const skCount = data.employee_skills.filter(s=>s.employee_id===e.id).length;
    const topMatch = data.matches.find(m=>m.employee_id===e.id);
    const flag5yr = e.type==="human"&&yrs>=5;
    const isAI = e.type==="ai_agent";
    return (
      <div style={{...card({padding:0}),overflow:"hidden",cursor:"pointer",transition:"all 0.2s",border:`1.5px solid ${e.mobility_open?C.green+"66":C.border}`}} onClick={()=>onSelectEmp(e.id)}>
        <div style={{height:4,background:isAI?`linear-gradient(90deg,${C.ai},${C.purple})`:e.mobility_open?C.green:C.blue}}/>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
            <Avatar name={e.name} size={44} type={e.type}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
              <div style={{fontSize:11,color:C.inkMuted,marginTop:2}}>{e.role}</div>
              <div style={{fontSize:11,color:C.inkMuted}}>{e.department}</div>
            </div>
            {topMatch&&<div style={{textAlign:"center",minWidth:40}}>
              <div style={{fontSize:15,fontWeight:800,color:topMatch.match_score>=85?C.green:C.amber}}>{topMatch.match_score}%</div>
              <div style={{fontSize:8,color:C.inkMuted}}>Fit</div>
            </div>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
            {(e.pools||[]).map(p=><PoolTag key={p} pool={p}/>)}
            {isAI&&<Badge type="ai">AI Agent</Badge>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:C.inkMuted}}>
            <span>{isAI?`${e.accuracy}% acc`:`${yrs}y tenure`}</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {skCount>0&&<Badge type="blue" small>{skCount} skills</Badge>}
              {e.mobility_open&&<Badge type="green" small>Open</Badge>}
              {flag5yr&&!e.mobility_open&&<Badge type="amber" small>5y+</Badge>}
              {isAI&&<Badge type={e.lifecycle}>{e.lifecycle}</Badge>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{...card({padding:"14px 18px",marginBottom:16})}}>
        <div style={{fontSize:14,fontWeight:800,color:C.blue,marginBottom:3}}>🏪 Skills & People Marketplace</div>
        <div style={{fontSize:12,color:C.inkMuted}}>Employees open to mobility · Talents in place 5+ years · AI agents available for deployment</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...INP,maxWidth:220}} placeholder="🔍 Search name, role, dept…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{...SEL,maxWidth:160}} value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
          <option value="all">All departments</option>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
        <select style={{...SEL,maxWidth:160}} value={poolFilter} onChange={e=>setPoolFilter(e.target.value)}>
          <option value="all">All talent pools</option>
          {allPools.map(p=><option key={p}>{p}</option>)}
        </select>
        <select style={{...SEL,maxWidth:160}} value={tenureFilter} onChange={e=>setTenureFilter(e.target.value)}>
          <option value="all">All tenure</option>
          <option value="5plus">5+ years in role</option>
          <option value="open">Open to mobility</option>
        </select>
        <div style={{display:"flex",gap:6}}>
          {[["all","All"],["human","People"],["ai","Agents"]].map(([v,l])=><button key={v} style={typeFilter===v?BTN("sm"):BTN("sm-out")} onClick={()=>setTypeFilter(v)}>{l}</button>)}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <button style={view==="grid"?BTN("sm"):BTN("sm-out")} onClick={()=>setView("grid")}>⊞</button>
          <button style={view==="list"?BTN("sm"):BTN("sm-out")} onClick={()=>setView("list")}>☰</button>
        </div>
      </div>

      {humans.length>0&&<>
        <div style={{fontSize:11,fontWeight:700,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>👥 People ({humans.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:20}}>
          {humans.map(e=><PersonCard key={e.id} e={e}/>)}
        </div>
      </>}
      {agents.length>0&&typeFilter!=="human"&&<>
        <div style={{fontSize:11,fontWeight:700,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>🤖 AI Agents ({agents.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {agents.map(e=><PersonCard key={e.id} e={e}/>)}
        </div>
      </>}
      {humans.length===0&&agents.length===0&&<Empty icon="🔍" text="No results — try adjusting filters"/>}
    </div>
  );
}

// ── MY TEAM (Manager view) ─────────────────────────────────────
function MyTeam({data,user,onSelectEmp,onUpdate}) {
  const [showInterview,setShowInterview]=useState(false);
  const [showSkillReview,setShowSkillReview]=useState(false);
  const [showActionPlan,setShowActionPlan]=useState(false);
  const [newInterview,setNewInterview]=useState({employee_id:"",scheduled_date:"",aspirations:""});
  const [newPlan,setNewPlan]=useState({employee_id:"",title:"",description:"",horizon:"1Y"});
  const [selectedForReview,setSelectedForReview]=useState(null);

  const teamIds = user.team||[];
  const teamEmps = data.employees.filter(e=>teamIds.includes(e.id)&&e.type==="human");

  const saveInterview = () => {
    if(!newInterview.employee_id||!newInterview.scheduled_date) return;
    const emp = data.employees.find(e=>e.id===newInterview.employee_id);
    onUpdate("add_interview",{id:"i"+uid(),employee_id:newInterview.employee_id,employee_name:emp?.name||"",department:emp?.department||"",interviewer:user.name,scheduled_date:newInterview.scheduled_date,status:"scheduled",mobility_readiness:null,skills_assessed:false,next_interview_due:"",aspirations:newInterview.aspirations,notes:""});
    setShowInterview(false); setNewInterview({employee_id:"",scheduled_date:"",aspirations:""});
  };

  const savePlan = () => {
    if(!newPlan.employee_id||!newPlan.title) return;
    const emp = data.employees.find(e=>e.id===newPlan.employee_id);
    onUpdate("add_action_plan",{id:"a"+uid(),employee_id:newPlan.employee_id,employee_name:emp?.name||"",title:newPlan.title,description:newPlan.description,horizon:newPlan.horizon,status:"open",due_date:""});
    setShowActionPlan(false); setNewPlan({employee_id:"",title:"",description:"",horizon:"1Y"});
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:14,fontWeight:800,color:C.blue}}>👔 My Team ({teamEmps.length})</div>
        <div style={{display:"flex",gap:8}}>
          <button style={BTN("sm-out")} onClick={()=>setShowSkillReview(true)}>🎯 Skills Review</button>
          <button style={BTN("sm")} onClick={()=>setShowActionPlan(true)}>📋 Action Plan</button>
          <button style={BTN("primary")} onClick={()=>setShowInterview(true)}>🎙 Schedule Interview</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {teamEmps.map(emp=>{
          const skills = data.employee_skills.filter(s=>s.employee_id===emp.id);
          const gaps = skills.filter(s=>s.target_level>s.current_level).length;
          const lastInterview = data.interviews.filter(i=>i.employee_id===emp.id&&i.status==="completed").sort((a,b)=>new Date(b.scheduled_date)-new Date(a.scheduled_date))[0];
          const yrs = yearsAt(emp.hire_date);
          const flag = yrs>=5;
          return (
            <div key={emp.id} style={card({padding:0,overflow:"hidden"})}>
              <div style={{height:3,background:flag?C.amber:C.green}}/>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <Avatar name={emp.name} size={40}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{emp.name}</div>
                    <div style={{fontSize:11,color:C.inkMuted}}>{emp.role}</div>
                  </div>
                  {flag&&<Badge type="amber" small>5y+ in role</Badge>}
                  {emp.mobility_open&&<Badge type="green" small>Open</Badge>}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                  {(emp.pools||[]).map(p=><PoolTag key={p} pool={p}/>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12,fontSize:11}}>
                  <div style={{textAlign:"center",background:C.surface,borderRadius:8,padding:"6px 4px"}}><div style={{fontWeight:800,fontSize:15,color:C.blue}}>{skills.length}</div><div style={{color:C.inkMuted}}>Skills</div></div>
                  <div style={{textAlign:"center",background:C.surface,borderRadius:8,padding:"6px 4px"}}><div style={{fontWeight:800,fontSize:15,color:gaps>0?C.amber:C.green}}>{gaps}</div><div style={{color:C.inkMuted}}>Gaps</div></div>
                  <div style={{textAlign:"center",background:C.surface,borderRadius:8,padding:"6px 4px"}}><div style={{fontWeight:800,fontSize:15,color:C.ink}}>{yrs}y</div><div style={{color:C.inkMuted}}>Tenure</div></div>
                </div>
                {lastInterview&&<div style={{fontSize:11,color:C.inkMuted,marginBottom:10}}>Last interview: {fmtDate(lastInterview.scheduled_date)} · Readiness {lastInterview.mobility_readiness}/5</div>}
                <div style={{display:"flex",gap:6}}>
                  <button style={{...BTN("sm-out"),flex:1,justifyContent:"center"}} onClick={()=>onSelectEmp(emp.id)}>Profile →</button>
                  <button style={{...BTN("sm"),justifyContent:"center"}} onClick={()=>{setNewInterview(x=>({...x,employee_id:emp.id}));setShowInterview(true);}}>🎙</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showInterview&&<Modal title="🎙 Schedule Career Interview" onClose={()=>setShowInterview(false)}>
        <FG label="Employee" required>
          <select style={SEL} value={newInterview.employee_id} onChange={e=>setNewInterview(x=>({...x,employee_id:e.target.value}))}>
            <option value="">Select employee…</option>
            {teamEmps.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
          </select>
        </FG>
        <FG label="Scheduled Date" required><input type="date" style={INP} value={newInterview.scheduled_date} onChange={e=>setNewInterview(x=>({...x,scheduled_date:e.target.value}))}/></FG>
        <FG label="Known Aspirations"><input style={INP} placeholder="e.g. Solution Architect…" value={newInterview.aspirations} onChange={e=>setNewInterview(x=>({...x,aspirations:e.target.value}))}/></FG>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <button style={BTN("outline")} onClick={()=>setShowInterview(false)}>Cancel</button>
          <button style={BTN("primary")} onClick={saveInterview}>Schedule Interview</button>
        </div>
      </Modal>}

      {showSkillReview&&<Modal title="🎯 Team Skills Overview" onClose={()=>setShowSkillReview(false)} wide>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Employee</th><th style={TH}>Skills</th><th style={TH}>Gaps</th><th style={TH}>Readiness</th><th style={TH}>Pools</th></tr></thead>
          <tbody>{teamEmps.map(emp=>{
            const skills = data.employee_skills.filter(s=>s.employee_id===emp.id);
            const gaps = skills.filter(s=>s.target_level>s.current_level).length;
            const lastIv = data.interviews.filter(i=>i.employee_id===emp.id&&i.status==="completed")[0];
            return <tr key={emp.id}>
              <td style={TD({fontWeight:600})}>{emp.name}</td>
              <td style={TD()}><Badge type="blue">{skills.length}</Badge></td>
              <td style={TD()}>{gaps>0?<Badge type="amber">{gaps} gaps</Badge>:<Badge type="completed">No gaps</Badge>}</td>
              <td style={TD()}>{lastIv?<span style={{fontWeight:700,color:C.blue}}>{lastIv.mobility_readiness}/5</span>:"—"}</td>
              <td style={TD()}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(emp.pools||[]).map(p=><PoolTag key={p} pool={p}/>)}</div></td>
            </tr>;
          })}</tbody>
        </table>
      </Modal>}

      {showActionPlan&&<Modal title="📋 New Action Plan" onClose={()=>setShowActionPlan(false)}>
        <FG label="Employee" required>
          <select style={SEL} value={newPlan.employee_id} onChange={e=>setNewPlan(x=>({...x,employee_id:e.target.value}))}>
            <option value="">Select employee…</option>
            {teamEmps.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </FG>
        <FG label="Plan Title" required><input style={INP} placeholder="e.g. Cloud Architecture Certification" value={newPlan.title} onChange={e=>setNewPlan(x=>({...x,title:e.target.value}))}/></FG>
        <FG label="Description"><textarea style={{...INP,minHeight:72,resize:"vertical"}} placeholder="Details…" value={newPlan.description} onChange={e=>setNewPlan(x=>({...x,description:e.target.value}))}/></FG>
        <FG label="Horizon">
          <select style={SEL} value={newPlan.horizon} onChange={e=>setNewPlan(x=>({...x,horizon:e.target.value}))}>
            {["1Y","2Y","3Y+"].map(h=><option key={h}>{h}</option>)}
          </select>
        </FG>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <button style={BTN("outline")} onClick={()=>setShowActionPlan(false)}>Cancel</button>
          <button style={BTN("primary")} onClick={savePlan}>Create Plan</button>
        </div>
      </Modal>}
    </div>
  );
}

// ── WORKFLOW ENGINE ────────────────────────────────────────────
const ROLE_COLOR={employee:C.blue,manager:C.amber,hr:C.green,ai_agent:C.ai};
const ROLE_ICON={employee:"👤",manager:"👔",hr:"🏢",ai_agent:"🤖"};

function WorkflowEngine({data,user,onUpdate}) {
  const [selected,setSelected]=useState(data.workflows[0]?.id);
  const [showNew,setShowNew]=useState(false);
  const [newWf,setNewWf]=useState({title:"",employee_id:"",type:"mobility_request",target_role:""});
  const sel = data.workflows.find(w=>w.id===selected);

  const WF_TYPES=[
    {id:"mobility_request",label:"Mobility Request",steps:[
      {label:"Employee Request",role:"employee"},{label:"Manager Review",role:"manager"},
      {label:"HR Validation",role:"hr"},{label:"AI Smart Fit",role:"ai_agent"},{label:"Assignment",role:"hr"}
    ]},
    {id:"career_interview",label:"Career Interview",steps:[
      {label:"Schedule",role:"hr"},{label:"Preparation",role:"employee"},
      {label:"Interview",role:"manager"},{label:"Skills Assessment",role:"ai_agent"},{label:"Action Plan",role:"hr"}
    ]},
    {id:"upskilling",label:"Upskilling Plan",steps:[
      {label:"Gap Analysis",role:"ai_agent"},{label:"Plan Design",role:"hr"},
      {label:"Approval",role:"manager"},{label:"Enrollment",role:"employee"},{label:"Tracking",role:"ai_agent"}
    ]},
    {id:"ai_agent_deployment",label:"AI Agent Deployment",steps:[
      {label:"Design",role:"hr"},{label:"Training",role:"ai_agent"},
      {label:"Evaluation",role:"hr"},{label:"Governance",role:"manager"},{label:"Go-Live",role:"hr"}
    ]},
  ];

  const createWorkflow = () => {
    if(!newWf.title||!newWf.employee_id) return;
    const emp = data.employees.find(e=>e.id===newWf.employee_id);
    const template = WF_TYPES.find(t=>t.id===newWf.type);
    onUpdate("add_workflow",{
      id:"wf"+uid(),title:newWf.title||`${template.label} — ${emp?.name}`,
      employee_id:newWf.employee_id,employee_name:emp?.name||"",type:newWf.type,
      target_role:newWf.target_role,status:"draft",current_step:0,created_at:new Date().toISOString().split("T")[0],
      steps:template.steps.map((s,i)=>({id:"s"+i,label:s.label,role:s.role,status:"pending",actor:null,completed_at:null}))
    });
    setShowNew(false); setNewWf({title:"",employee_id:"",type:"mobility_request",target_role:""});
  };

  const approveStep = (wfId,stepId) => {
    onUpdate("approve_step",{wfId,stepId});
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14,height:"calc(100vh-200px)"}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.inkMuted}}>Workflows</div>
          {canDo(user,"write")&&<button style={BTN("sm")} onClick={()=>setShowNew(true)}>＋ New</button>}
        </div>
        {data.workflows.map(w=>(
          <div key={w.id} onClick={()=>setSelected(w.id)} style={{...card({padding:"12px 14px"}),cursor:"pointer",borderLeft:`4px solid ${ROLE_COLOR[w.steps[w.current_step]?.role]||C.border}`,background:selected===w.id?C.bluePale:C.card}}>
            <div style={{fontWeight:600,fontSize:12,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.title}</div>
            <div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap"}}>{SBadge(w.status)}<Badge type="grey">{w.type.replace(/_/g," ")}</Badge></div>
            <div style={{display:"flex",gap:2}}>{w.steps.map((s,si)=><div key={si} style={{flex:1,height:4,borderRadius:99,background:s.status==="completed"?C.green:s.status==="in_progress"?C.amber:C.border}}/>)}</div>
            <div style={{fontSize:10,color:C.inkMuted,marginTop:5}}>{w.steps.filter(s=>s.status==="completed").length}/{w.steps.length} steps</div>
          </div>
        ))}
      </div>

      <div style={{overflowY:"auto"}}>
        {!sel?<div style={{...card(),textAlign:"center",padding:60,color:C.inkMuted}}><div style={{fontSize:32,marginBottom:10}}>⚙️</div><div>Select a workflow</div></div>:(
          <div>
            <div style={card({marginBottom:12})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.blue,marginBottom:6}}>{sel.title}</div>
                  <div style={{display:"flex",gap:8}}>{SBadge(sel.status)}<Badge type="grey">{sel.type.replace(/_/g," ")}</Badge></div>
                </div>
                {sel.target_role&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.inkMuted}}>Target</div><div style={{fontWeight:700,color:C.blue}}>{sel.target_role}</div></div>}
              </div>
              <div style={{position:"relative",padding:"18px 0"}}>
                <div style={{position:"absolute",top:42,left:"10%",right:"10%",height:2,background:C.border,zIndex:0}}/>
                <div style={{display:"flex",justifyContent:"space-around",position:"relative",zIndex:1}}>
                  {sel.steps.map((s,si)=>{
                    const done=s.status==="completed",active=s.status==="in_progress";
                    const col=done?C.green:active?ROLE_COLOR[s.role]:C.border;
                    return (
                      <div key={si} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                        <div style={{width:42,height:42,borderRadius:"50%",background:done?C.green:active?col:C.surface,border:`2.5px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,marginBottom:8,color:done?"#fff":active?col:C.inkMuted}}>
                          {done?"✓":active?ROLE_ICON[s.role]:si+1}
                        </div>
                        <div style={{fontSize:9,fontWeight:600,color:done?C.green:active?col:C.inkMuted,textAlign:"center",maxWidth:72,lineHeight:1.3}}>{s.label}</div>
                        <div style={{fontSize:8,color:C.inkMuted,marginTop:1}}>{ROLE_ICON[s.role]} {s.role}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {sel.steps.map((s,si)=>(
                <div key={si} style={card({padding:"12px 16px",borderLeft:`4px solid ${s.status==="completed"?C.green:s.status==="in_progress"?ROLE_COLOR[s.role]:C.border}`,marginBottom:0})}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{ROLE_ICON[s.role]}</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{s.label}</div>
                        <div style={{fontSize:11,color:C.inkMuted}}>Role: {s.role}{s.actor?` · ${s.actor}`:""}</div>
                        {s.completed_at&&<div style={{fontSize:10,color:C.inkMuted}}>{fmtDate(s.completed_at)}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {SBadge(s.status)}
                      {s.status==="in_progress"&&canDo(user,"approve")&&<button style={BTN("sm-green")} onClick={()=>approveStep(sel.id,s.id)}>✓ Approve</button>}
                    </div>
                  </div>
                  {s.notes&&<div style={{marginTop:8,padding:"8px 10px",background:C.surface,borderRadius:8,fontSize:12,color:C.inkSoft}}>💬 {s.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNew&&<Modal title="⚙️ New Workflow" onClose={()=>setShowNew(false)}>
        <FG label="Workflow Type" required>
          <select style={SEL} value={newWf.type} onChange={e=>setNewWf(x=>({...x,type:e.target.value}))}>
            {WF_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </FG>
        <FG label="Employee" required>
          <select style={SEL} value={newWf.employee_id} onChange={e=>setNewWf(x=>({...x,employee_id:e.target.value}))}>
            <option value="">Select employee…</option>
            {data.employees.filter(e=>e.type==="human").map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
          </select>
        </FG>
        <FG label="Title"><input style={INP} placeholder="Auto-generated if left blank" value={newWf.title} onChange={e=>setNewWf(x=>({...x,title:e.target.value}))}/></FG>
        <FG label="Target Role"><input style={INP} placeholder="e.g. Solution Architect" value={newWf.target_role} onChange={e=>setNewWf(x=>({...x,target_role:e.target.value}))}/></FG>
        <div style={{...card({background:C.surface,padding:"12px 14px",marginBottom:16})}}>
          <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:8}}>Steps included:</div>
          {WF_TYPES.find(t=>t.id===newWf.type)?.steps.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,fontSize:12}}>
              <span>{ROLE_ICON[s.role]}</span><span style={{fontWeight:600}}>{i+1}. {s.label}</span><Badge type="grey" small>{s.role}</Badge>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button style={BTN("outline")} onClick={()=>setShowNew(false)}>Cancel</button>
          <button style={BTN("primary")} onClick={createWorkflow}>Create Workflow</button>
        </div>
      </Modal>}
    </div>
  );
}

// ── CAREER INTERVIEWS ─────────────────────────────────────────
function CareerInterviews({data,user,onUpdate}) {
  const [showNew,setShowNew]=useState(false);
  const [newIv,setNewIv]=useState({employee_id:"",scheduled_date:"",interviewer:user.name,aspirations:""});

  const save = () => {
    if(!newIv.employee_id||!newIv.scheduled_date) return;
    const emp = data.employees.find(e=>e.id===newIv.employee_id);
    const due = new Date(new Date(newIv.scheduled_date).setFullYear(new Date(newIv.scheduled_date).getFullYear()+3)).toISOString().split("T")[0];
    onUpdate("add_interview",{id:"i"+uid(),employee_id:newIv.employee_id,employee_name:emp?.name||"",department:emp?.department||"",interviewer:newIv.interviewer,scheduled_date:newIv.scheduled_date,status:"scheduled",mobility_readiness:null,skills_assessed:false,next_interview_due:due,aspirations:newIv.aspirations,notes:""});
    setShowNew(false); setNewIv({employee_id:"",scheduled_date:"",interviewer:user.name,aspirations:""});
  };

  const interviews = user.role==="employee"
    ? data.interviews.filter(i=>i.employee_id===user.employee_id)
    : user.role==="manager"
    ? data.interviews.filter(i=>(user.team||[]).includes(i.employee_id))
    : data.interviews;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:800,color:C.blue}}>🎙 Career Interviews</div>
        {canDo(user,"write")&&<button style={BTN("primary")} onClick={()=>setShowNew(true)}>＋ Schedule Interview</button>}
      </div>
      <div style={card()}>
        {interviews.length===0?<Empty icon="🎙" text="No interviews yet"/>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Employee</th><th style={TH}>Dept</th><th style={TH}>Interviewer</th><th style={TH}>Date</th><th style={TH}>Status</th><th style={TH}>Readiness</th><th style={TH}>Skills</th><th style={TH}>Next Due</th><th style={TH}>Aspirations</th></tr></thead>
          <tbody>{interviews.map(i=>(
            <tr key={i.id}>
              <td style={TD({fontWeight:600})}>{i.employee_name}</td>
              <td style={TD()}><Badge type="blue">{i.department}</Badge></td>
              <td style={TD({fontSize:12})}>{i.interviewer}</td>
              <td style={TD({fontSize:12,fontFamily:"monospace",color:C.inkMuted})}>{fmtDate(i.scheduled_date)}</td>
              <td style={TD()}>{SBadge(i.status)}</td>
              <td style={TD()}>{i.mobility_readiness?<span style={{fontWeight:700,color:C.blue}}>{i.mobility_readiness}/5</span>:"—"}</td>
              <td style={TD()}>{i.skills_assessed?<Badge type="completed">✓</Badge>:<Badge type="amber">Pending</Badge>}</td>
              <td style={TD({fontSize:11,fontFamily:"monospace",color:C.inkMuted})}>{fmtDate(i.next_interview_due)}</td>
              <td style={TD({fontSize:12,color:C.inkMuted,fontStyle:"italic"})}>{i.aspirations||"—"}</td>
            </tr>
          ))}</tbody>
        </table>}
      </div>

      {showNew&&<Modal title="🎙 Schedule Career Interview" onClose={()=>setShowNew(false)}>
        <FG label="Employee" required>
          <select style={SEL} value={newIv.employee_id} onChange={e=>setNewIv(x=>({...x,employee_id:e.target.value}))}>
            <option value="">Select employee…</option>
            {data.employees.filter(e=>e.type==="human").map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
          </select>
        </FG>
        <FG label="Interviewer"><input style={INP} value={newIv.interviewer} onChange={e=>setNewIv(x=>({...x,interviewer:e.target.value}))}/></FG>
        <FG label="Scheduled Date" required><input type="date" style={INP} value={newIv.scheduled_date} onChange={e=>setNewIv(x=>({...x,scheduled_date:e.target.value}))}/></FG>
        <FG label="Known Aspirations"><input style={INP} placeholder="e.g. Solution Architect, Product Manager…" value={newIv.aspirations} onChange={e=>setNewIv(x=>({...x,aspirations:e.target.value}))}/></FG>
        <div style={{...card({background:C.bluePale,padding:"10px 14px",marginTop:4,marginBottom:16})}}>
          <div style={{fontSize:11,color:C.inkSoft}}>Next interview due date will be auto-calculated as +3 years from the scheduled date.</div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button style={BTN("outline")} onClick={()=>setShowNew(false)}>Cancel</button>
          <button style={BTN("primary")} onClick={save}>Schedule</button>
        </div>
      </Modal>}
    </div>
  );
}

// ── CAREER PATHS ───────────────────────────────────────────────
function CareerPaths({data,user}) {
  const [selectedPath,setSelectedPath]=useState(data.career_paths[0]?.id);
  const [hoveredNode,setHoveredNode]=useState(null);
  const [hoveredEdge,setHoveredEdge]=useState(null);
  const path = data.career_paths.find(p=>p.id===selectedPath);
  const myEmp = data.employees.find(e=>e.id===user.employee_id);

  const LEVEL_X = {1:80,2:240,3:440,4:640,5:840};
  const NODE_Y_MAP = {};
  if(path){
    const byLevel = {};
    path.nodes.forEach(n=>{
      if(!byLevel[n.level]) byLevel[n.level]=[];
      byLevel[n.level].push(n);
    });
    Object.entries(byLevel).forEach(([lvl,nodes])=>{
      nodes.forEach((n,i)=>{
        const base=200+(i-(nodes.length-1)/2)*100;
        NODE_Y_MAP[n.id]=base;
      });
    });
  }

  const isCurrentRole = n => myEmp&&n.role===myEmp.role;
  const NWIDTH=130, NHEIGHT=40;

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {data.career_paths.map(p=>(
          <button key={p.id} style={p.id===selectedPath?BTN("primary"):BTN("outline")} onClick={()=>setSelectedPath(p.id)}>
            {p.title}
          </button>
        ))}
      </div>

      {path&&<>
        <div style={{...card({padding:"14px 18px",marginBottom:14})}}>
          <div style={{fontSize:15,fontWeight:800,color:C.blue,marginBottom:3}}>{path.title}</div>
          <div style={{fontSize:12,color:C.inkMuted}}>{path.department} · Click any node to see required skills · Hover connections for transition details</div>
        </div>

        <div style={{overflowX:"auto"}}>
          <svg width="100%" viewBox={`0 0 ${Math.max(900,Object.keys(LEVEL_X).length*200)} 420`} style={{minWidth:700,display:"block"}}>
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <marker id="arr-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* Level labels */}
            {[1,2,3,4,5].filter(l=>path.nodes.some(n=>n.level===l)).map(l=>(
              <text key={l} x={LEVEL_X[l]+NWIDTH/2} y={30} textAnchor="middle" fontSize={10} fill={C.inkMuted} fontWeight="600">
                {["Entry","Mid","Senior","Principal","Director"][l-1]}
              </text>
            ))}

            {/* Edges */}
            {path.edges.map((e,i)=>{
              const fromNode=path.nodes.find(n=>n.id===e.from);
              const toNode=path.nodes.find(n=>n.id===e.to);
              if(!fromNode||!toNode)return null;
              const x1=LEVEL_X[fromNode.level]+NWIDTH;
              const y1=NODE_Y_MAP[e.from]+NHEIGHT/2;
              const x2=LEVEL_X[toNode.level];
              const y2=NODE_Y_MAP[e.to]+NHEIGHT/2;
              const isHovered=hoveredEdge===i;
              return (
                <g key={i} onMouseEnter={()=>setHoveredEdge(i)} onMouseLeave={()=>setHoveredEdge(null)} style={{cursor:"pointer"}}>
                  <path d={`M${x1},${y1} C${x1+60},${y1} ${x2-60},${y2} ${x2},${y2}`}
                    fill="none" stroke={isHovered?C.green:C.blue} strokeWidth={isHovered?2.5:1.5}
                    strokeDasharray={isHovered?"none":"4 3"} markerEnd={`url(#arr${isHovered?"-h":""})`} opacity={0.7}/>
                  {isHovered&&<>
                    <rect x={(x1+x2)/2-60} y={(y1+y2)/2-28} width={120} height={56} rx={8} fill={C.card} stroke={C.green} strokeWidth={1.5}/>
                    <text x={(x1+x2)/2} y={(y1+y2)/2-12} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.blue}>{e.label}</text>
                    <text x={(x1+x2)/2} y={(y1+y2)/2+2} textAnchor="middle" fontSize={9} fill={C.inkMuted}>⏱ {e.timeline}</text>
                    <text x={(x1+x2)/2} y={(y1+y2)/2+16} textAnchor="middle" fontSize={9} fill={C.inkMuted}>{e.skills.length} skills needed</text>
                  </>}
                </g>
              );
            })}

            {/* Nodes */}
            {path.nodes.map(n=>{
              const x=LEVEL_X[n.level];
              const y=NODE_Y_MAP[n.id];
              const isCurrent=isCurrentRole(n);
              const isHovered=hoveredNode===n.id;
              const inEdges=path.edges.filter(e=>e.to===n.id);
              const allSkills=[...new Set(inEdges.flatMap(e=>e.skills))];
              return (
                <g key={n.id} onMouseEnter={()=>setHoveredNode(n.id)} onMouseLeave={()=>setHoveredNode(null)} style={{cursor:"pointer"}}>
                  <rect x={x} y={y} width={NWIDTH} height={NHEIGHT} rx={10}
                    fill={isCurrent?C.blue:isHovered?C.blueTint:C.card}
                    stroke={isCurrent?C.blue:isHovered?C.blue:C.border}
                    strokeWidth={isCurrent?2.5:isHovered?2:1}/>
                  <text x={x+NWIDTH/2} y={y+NHEIGHT/2-4} textAnchor="middle" fontSize={11} fontWeight="700"
                    fill={isCurrent?"#fff":C.ink} dominantBaseline="central">{n.role.length>14?n.role.slice(0,14)+"…":n.role}</text>
                  {isCurrent&&<text x={x+NWIDTH/2} y={y+NHEIGHT-6} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.7)">● You are here</text>}
                  {isHovered&&!isCurrent&&allSkills.length>0&&<>
                    <rect x={x-10} y={y+NHEIGHT+4} width={NWIDTH+20} height={allSkills.length*14+16} rx={6} fill={C.card} stroke={C.border} strokeWidth={1}/>
                    <text x={x+NWIDTH/2} y={y+NHEIGHT+14} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.blue}>Skills to reach this role:</text>
                    {allSkills.map((sid,si)=>{
                      const sk=data.skills_ref.find(s=>s.id===sid);
                      return <text key={sid} x={x+NWIDTH/2} y={y+NHEIGHT+28+si*14} textAnchor="middle" fontSize={9} fill={C.inkSoft}>· {sk?.name||sid}</text>;
                    })}
                  </>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Transition table */}
        <div style={card({marginTop:14})}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>Career Transitions in this path</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>From</th><th style={TH}>To</th><th style={TH}>Timeline</th><th style={TH}>Key Skills</th><th style={TH}>Learning Resources</th></tr></thead>
            <tbody>{path.edges.map((e,i)=>{
              const fromN=path.nodes.find(n=>n.id===e.from);
              const toN=path.nodes.find(n=>n.id===e.to);
              const courses=data.learning_catalog.filter(lc=>e.skills.some(sid=>lc.skill_ids.includes(sid)));
              return <tr key={i}>
                <td style={TD({fontWeight:600})}>{fromN?.role}</td>
                <td style={TD({fontWeight:600,color:C.blue})}>{toN?.role}</td>
                <td style={TD()}><Badge type="amber">{e.timeline}</Badge></td>
                <td style={TD()}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{e.skills.map(sid=>{const sk=data.skills_ref.find(s=>s.id===sid);return sk?<Badge key={sid} type="blue" small>{sk.name}</Badge>:null;})}</div></td>
                <td style={TD()}>{courses.length>0?<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{courses.slice(0,2).map(c=><a key={c.id} href={c.url} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.ai,textDecoration:"none",padding:"2px 6px",borderRadius:4,background:C.aiTint}}>{c.title}</a>)}</div>:<span style={{color:C.inkMuted,fontSize:12}}>—</span>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

// ── LEARNING CATALOGUE ────────────────────────────────────────
function Learning({data,user}) {
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("all");
  const [skillFilter,setSkillFilter]=useState("all");
  const myEmpId = user.employee_id;
  const mySkills = data.employee_skills.filter(s=>s.employee_id===myEmpId);
  const myGaps = mySkills.filter(s=>s.target_level>s.current_level).map(s=>s.skill_id);

  const types = [...new Set(data.learning_catalog.map(l=>l.type))];
  const filtered = data.learning_catalog.filter(lc=>{
    const mSearch = lc.title.toLowerCase().includes(search.toLowerCase())||lc.provider.toLowerCase().includes(search.toLowerCase());
    const mType = typeFilter==="all"||lc.type===typeFilter;
    const mSkill = skillFilter==="all"||lc.skill_ids.includes(skillFilter)||
      (skillFilter==="my_gaps"&&lc.skill_ids.some(sid=>myGaps.includes(sid)));
    return mSearch&&mType&&mSkill;
  });

  const TYPE_COLOR={Certification:C.purple,MOOC:C.green,Course:C.blue,Workshop:C.amber};

  return (
    <div>
      <div style={{...card({padding:"14px 18px",marginBottom:14,borderLeft:`4px solid ${C.purple}`})}}>
        <div style={{fontSize:14,fontWeight:800,color:C.purple,marginBottom:3}}>📚 Learning Catalogue</div>
        <div style={{fontSize:12,color:C.inkMuted}}>AXA-approved training resources linked to the skills referential</div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...INP,maxWidth:240}} placeholder="🔍 Search courses…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{...SEL,maxWidth:160}} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
        <select style={{...SEL,maxWidth:200}} value={skillFilter} onChange={e=>setSkillFilter(e.target.value)}>
          <option value="all">All skills</option>
          {myGaps.length>0&&<option value="my_gaps">⚡ My skill gaps ({myGaps.length})</option>}
          {data.skills_ref.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div style={{marginLeft:"auto",fontSize:12,color:C.inkMuted}}>{filtered.length} course{filtered.length!==1?"s":""}</div>
      </div>

      {myGaps.length>0&&skillFilter==="all"&&<div style={{...card({padding:"12px 16px",marginBottom:14,background:C.amberTint,border:`1px solid ${C.amber}44`})}}>
        <div style={{fontSize:12,fontWeight:700,color:C.amber,marginBottom:6}}>⚡ Recommended for your skill gaps</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {data.learning_catalog.filter(lc=>lc.skill_ids.some(sid=>myGaps.includes(sid))).slice(0,3).map(lc=>(
            <a key={lc.id} href={lc.url} target="_blank" rel="noreferrer" style={{padding:"6px 12px",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,fontWeight:600,color:C.blue,textDecoration:"none"}}>📖 {lc.title}</a>
          ))}
        </div>
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
        {filtered.map(lc=>{
          const relSkills=data.skills_ref.filter(s=>lc.skill_ids.includes(s.id));
          const isGapRelevant=lc.skill_ids.some(sid=>myGaps.includes(sid));
          const col=TYPE_COLOR[lc.type]||C.blue;
          return (
            <div key={lc.id} style={{...card({padding:0,overflow:"hidden"}),border:`1.5px solid ${isGapRelevant?C.amber+"66":C.border}`}}>
              <div style={{height:3,background:col}}/>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{lc.title}</div>
                    <div style={{fontSize:12,color:C.inkMuted}}>{lc.provider}</div>
                  </div>
                  {isGapRelevant&&<span style={{fontSize:16,marginLeft:8}} title="Relevant to your gaps">⚡</span>}
                </div>
                <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                  <Badge type="blue" small>{lc.type}</Badge>
                  <Badge type="grey" small>⏱ {lc.duration}</Badge>
                  <Badge type={lc.level==="Advanced"?"amber":lc.level==="Intermediate"?"blue":"green"} small>{lc.level}</Badge>
                </div>
                <div style={{fontSize:11,color:C.inkMuted,marginBottom:10}}>💰 {lc.cost}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                  {relSkills.map(s=><Badge key={s.id} type="purple" small>🎯 {s.name}</Badge>)}
                </div>
                <a href={lc.url} target="_blank" rel="noreferrer" style={{...BTN("outline"),textDecoration:"none",fontSize:12,display:"inline-flex",justifyContent:"center",width:"100%",boxSizing:"border-box"}}>Access Course →</a>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:"1/-1"}}><Empty icon="📚" text="No courses match your filters"/></div>}
      </div>
    </div>
  );
}

// ── EMPLOYEE PROFILE (Full) ────────────────────────────────────
function EmployeeProfile({employeeId,data,user,onBack}) {
  const [tab,setTab]=useState("skills");
  const [showEditPool,setShowEditPool]=useState(false);
  const emp = data.employees.find(e=>e.id===employeeId);
  if(!emp) return <div>Not found</div>;
  const skills = data.employee_skills.filter(s=>s.employee_id===employeeId);
  const interviews = data.interviews.filter(i=>i.employee_id===employeeId);
  const plans = data.action_plans.filter(a=>a.employee_id===employeeId);
  const matches = data.matches.filter(m=>m.employee_id===employeeId);
  const roleMap = data.role_skills.find(r=>r.role===emp.role);
  const isAI = emp.type==="ai_agent";
  const yrs = yearsAt(emp.hire_date);
  const myGapSkills = skills.filter(s=>s.target_level>s.current_level).map(s=>s.skill_id);
  const relCourses = data.learning_catalog.filter(lc=>lc.skill_ids.some(sid=>myGapSkills.includes(sid)));

  const tabs = isAI
    ? [["skills","🎯 Skills"],["performance","⚡ Performance"],["governance","🛡 Governance"]]
    : [["skills","🎯 Skills"],["gap","📊 Gap vs Role"],["interviews","🎙 Interviews"],["plans","📋 Plans"],["matches","🔄 Mobility"],["learning","📚 Learning"]];

  return (
    <div>
      <button style={{...BTN("ghost"),marginBottom:12}} onClick={onBack}>← Back</button>
      <div style={{background:isAI?`linear-gradient(135deg,${C.ai},${C.purple})`:`linear-gradient(135deg,${C.blue},${C.blueM})`,borderRadius:14,padding:24,color:"#fff",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:12}}>
          <Avatar name={emp.name} size={60} type={emp.type}/>
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:800}}>{emp.name}</div>
            <div style={{fontSize:13,opacity:0.8,marginTop:2}}>{emp.role} · {emp.department}</div>
            {isAI&&<div style={{fontSize:12,opacity:0.6,marginTop:2}}>{emp.model} · v{emp.version}</div>}
            <div style={{fontSize:11,opacity:0.6,marginTop:6,display:"flex",gap:16}}>
              <span>📧 {emp.email}</span>
              <span>📅 Joined {fmtDate(emp.hire_date)}</span>
              {!isAI&&<span>🕐 {yrs}y tenure</span>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
            {yrs>=5&&!isAI&&<Badge type="amber">5+ years in role</Badge>}
            {emp.mobility_open&&<Badge type="green">Open to mobility</Badge>}
            {isAI&&<Badge type={emp.lifecycle}>{emp.lifecycle}</Badge>}
          </div>
        </div>
        {!isAI&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {(emp.pools||[]).map(p=>{ const m=POOL_META[p]||{}; return <span key={p} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.2)",color:"#fff"}}>{m.icon} {p}</span>; })}
          {canDo(user,"manage_users")&&<button style={{...BTN("ghost"),padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,0.7)"}} onClick={()=>setShowEditPool(true)}>+ Edit pools</button>}
        </div>}
      </div>

      <div style={{display:"flex",borderBottom:`2px solid ${C.border}`,marginBottom:16,overflowX:"auto"}}>
        {tabs.map(([id,label])=>(
          <div key={id} onClick={()=>setTab(id)} style={{padding:"9px 16px",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?C.blue:C.inkMuted,borderBottom:`3px solid ${tab===id?C.red:"transparent"}`,marginBottom:-2,cursor:"pointer",whiteSpace:"nowrap"}}>{label}</div>
        ))}
      </div>

      {tab==="skills"&&<div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:14}}>Skills Profile</div>
        {skills.length===0?<Empty icon="🎯" text="No skills assessed yet"/>:skills.map(es=>{
          const sk=data.skills_ref.find(s=>s.id===es.skill_id);
          if(!sk)return null;
          const gap=es.target_level-es.current_level;
          return (
            <div key={es.id} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                <span style={{fontWeight:600}}>{sk.name} <Badge type={sk.category==="AI Capability"?"ai":"blue"} small>{sk.category}</Badge></span>
                <span style={{color:C.inkMuted,fontFamily:"monospace"}}>{es.current_level}/5 → {es.target_level}/5</span>
              </div>
              <SkillBar current={es.current_level} target={es.target_level}/>
              <div style={{fontSize:11,color:C.inkMuted,marginTop:4}}>{es.validated?"✅ Validated":"⚠️ Pending"} {gap>0?<span style={{color:C.red}}>· Gap: {gap} level{gap>1?"s":""}</span>:<span style={{color:C.green}}>· ✓ On target</span>}</div>
            </div>
          );
        })}
      </div>}

      {tab==="gap"&&<div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:4}}>Gap Analysis — <span style={{color:C.red}}>{emp.role}</span></div>
        {!roleMap?<Empty icon="📊" text="No role mapping defined yet"/>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Skill</th><th style={TH}>Required</th><th style={TH}>Current</th><th style={TH}>Gap</th><th style={TH}>Status</th></tr></thead>
          <tbody>{roleMap.required_skills.map(rs=>{
            const sk=data.skills_ref.find(s=>s.id===rs.skill_id);
            const assessed=skills.find(s=>s.skill_id===rs.skill_id);
            const cur=assessed?.current_level||0; const gap=rs.level-cur;
            return <tr key={rs.skill_id}>
              <td style={TD({fontWeight:600})}>{sk?.name||rs.skill_id}</td>
              <td style={TD()}><span style={{fontWeight:700,color:C.blue}}>{rs.level}/5</span></td>
              <td style={TD()}>{cur>0?<span style={{fontWeight:700}}>{cur}/5</span>:<span style={{color:C.inkMuted}}>Not assessed</span>}</td>
              <td style={TD()}>{gap>0?<span style={{color:C.red,fontWeight:700}}>-{gap}</span>:gap<0?<span style={{color:C.green,fontWeight:700}}>+{Math.abs(gap)}</span>:<span style={{color:C.green}}>✓</span>}</td>
              <td style={TD()}>{gap>0?<Badge type="red">Gap</Badge>:gap<0?<Badge type="green">Exceeds</Badge>:<Badge type="completed">Met</Badge>}</td>
            </tr>;
          })}</tbody>
        </table>}
      </div>}

      {tab==="interviews"&&<div style={card()}>
        {interviews.length===0?<Empty icon="🎙" text="No interviews yet"/>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Date</th><th style={TH}>Interviewer</th><th style={TH}>Status</th><th style={TH}>Readiness</th><th style={TH}>Aspirations</th><th style={TH}>Next Due</th></tr></thead>
          <tbody>{interviews.map(i=><tr key={i.id}>
            <td style={TD({fontSize:12,fontFamily:"monospace",color:C.inkMuted})}>{fmtDate(i.scheduled_date)}</td>
            <td style={TD()}>{i.interviewer}</td>
            <td style={TD()}>{SBadge(i.status)}</td>
            <td style={TD()}>{i.mobility_readiness?<span style={{fontWeight:700,color:C.blue}}>{i.mobility_readiness}/5</span>:"—"}</td>
            <td style={TD({fontSize:12,color:C.inkMuted,fontStyle:"italic"})}>{i.aspirations||"—"}</td>
            <td style={TD({fontSize:11,fontFamily:"monospace",color:C.inkMuted})}>{fmtDate(i.next_interview_due)}</td>
          </tr>)}</tbody>
        </table>}
      </div>}

      {tab==="plans"&&<div style={card()}>
        {plans.length===0?<Empty icon="📋" text="No action plans yet"/>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Plan</th><th style={TH}>Description</th><th style={TH}>Horizon</th><th style={TH}>Due</th><th style={TH}>Status</th></tr></thead>
          <tbody>{plans.map(a=><tr key={a.id}>
            <td style={TD({fontWeight:600})}>{a.title}</td>
            <td style={TD({fontSize:12,color:C.inkMuted})}>{a.description}</td>
            <td style={TD()}><Badge type="amber">{a.horizon}</Badge></td>
            <td style={TD({fontSize:11,fontFamily:"monospace",color:C.inkMuted})}>{fmtDate(a.due_date)}</td>
            <td style={TD()}>{SBadge(a.status)}</td>
          </tr>)}</tbody>
        </table>}
      </div>}

      {tab==="matches"&&<div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🔄 Mobility Opportunities</div>
        {matches.length===0?<Empty icon="🔄" text="No matches yet — ARIA-Matcher is processing"/>:matches.sort((a,b)=>b.match_score-a.match_score).map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${m.match_score>=85?C.green:C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:m.match_score>=85?C.green:C.amber,flexShrink:0,background:m.match_score>=85?C.greenTint:C.amberTint}}>{m.match_score}%</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{m.job_title}</div>
              <div style={{fontSize:12,color:C.inkMuted,marginTop:2}}>📍 {m.location} · {m.priority} priority · ARIA-Matcher</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge type={m.priority}>{m.priority}</Badge>{SBadge(m.status)}</div>
          </div>
        ))}
      </div>}

      {tab==="learning"&&<div>
        {relCourses.length>0&&<div style={{...card({marginBottom:12,background:C.amberTint,border:`1px solid ${C.amber}44`})}}>
          <div style={{fontSize:12,fontWeight:700,color:C.amber,marginBottom:8}}>⚡ Recommended for your gaps</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {relCourses.map(lc=><a key={lc.id} href={lc.url} target="_blank" rel="noreferrer" style={{padding:"6px 12px",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,fontWeight:600,color:C.blue,textDecoration:"none"}}>📖 {lc.title}</a>)}
          </div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {data.learning_catalog.map(lc=>{
            const relSkills=data.skills_ref.filter(s=>lc.skill_ids.includes(s.id));
            const isGap=lc.skill_ids.some(sid=>myGapSkills.includes(sid));
            return <div key={lc.id} style={{...card({padding:"12px 14px"}),border:`1.5px solid ${isGap?C.amber+"66":C.border}`}}>
              <div style={{fontWeight:700,fontSize:12,marginBottom:3}}>{lc.title}</div>
              <div style={{fontSize:11,color:C.inkMuted,marginBottom:6}}>{lc.provider} · {lc.duration} · {lc.level}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{relSkills.map(s=><Badge key={s.id} type="purple" small>{s.name}</Badge>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:C.inkMuted}}>{lc.cost}</span>
                <a href={lc.url} target="_blank" rel="noreferrer" style={{...BTN("sm-out"),textDecoration:"none",fontSize:11}}>Access →</a>
              </div>
            </div>;
          })}
        </div>
      </div>}

      {tab==="performance"&&isAI&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{l:"Accuracy",v:emp.accuracy+"%",c:C.green},{l:"Daily Requests",v:emp.requests,c:C.blue},{l:"Model",v:emp.model,c:C.ai},{l:"Version",v:"v"+emp.version,c:C.purple}].map(m=>(
          <div key={m.l} style={{...card({padding:"14px 16px"}),borderTop:`3px solid ${m.c}`}}>
            <div style={{fontSize:10,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>{m.l}</div>
            <div style={{fontSize:24,fontWeight:800}}>{m.v||"—"}</div>
          </div>
        ))}
      </div>}

      {tab==="governance"&&isAI&&<div style={card()}>
        {[{l:"Human Oversight",v:"Required at all decision points",ok:true},{l:"Audit Logging",v:"All actions logged & traceable",ok:true},{l:"Explainability",v:"High — reasoning included",ok:true},{l:"Override",v:"Human can override any AI decision",ok:true},{l:"Data Access",v:"Limited to assigned scope",ok:true}].map(g=>(
          <div key={g.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:13,color:C.inkSoft}}>{g.l}</span>
            <div style={{display:"flex",gap:8}}><span style={{fontSize:12,color:g.ok?C.green:C.red}}>{g.v}</span><span>{g.ok?"✅":"⚠️"}</span></div>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ── SKILLS REPO ────────────────────────────────────────────────
function SkillsRepo({data,user,onUpdate}) {
  const [cat,setCat]=useState("All");
  const [showAdd,setShowAdd]=useState(false);
  const [newSk,setNewSk]=useState({name:"",category:"Technical",applicable_to:["human"]});
  const cats=["All","Technical","Domain","Soft Skills","Strategic","AI Capability"];
  const filtered=cat==="All"?data.skills_ref:data.skills_ref.filter(s=>s.category===cat);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><button key={c} style={c===cat?BTN("sm"):BTN("sm-out")} onClick={()=>setCat(c)}>{c}</button>)}</div>
        {canDo(user,"write")&&<button style={BTN("primary")} onClick={()=>setShowAdd(true)}>＋ New Skill</button>}
      </div>
      <div style={card()}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Skill Name</th><th style={TH}>Category</th><th style={TH}>Applies To</th><th style={TH}>Used by</th><th style={TH}>Validated</th><th style={TH}>Courses</th></tr></thead>
          <tbody>{filtered.map(sk=>{
            const usage=data.employee_skills.filter(es=>es.skill_id===sk.id).length;
            const validated=data.employee_skills.filter(es=>es.skill_id===sk.id&&es.validated).length;
            const courses=data.learning_catalog.filter(lc=>lc.skill_ids.includes(sk.id)).length;
            return (
              <tr key={sk.id}>
                <td style={TD({fontWeight:600})}>{sk.name}</td>
                <td style={TD()}><Badge type={sk.category==="AI Capability"?"ai":sk.category==="Technical"?"blue":sk.category==="Domain"?"purple":sk.category==="Soft Skills"?"green":"amber"}>{sk.category}</Badge></td>
                <td style={TD()}><div style={{display:"flex",gap:4}}>{(sk.applicable_to||[]).map(t=><Badge key={t} type={t==="ai_agent"?"ai":"blue"} small>{t==="ai_agent"?"AI":"Human"}</Badge>)}</div></td>
                <td style={TD()}><Badge type={usage>0?"blue":"grey"}>{usage}</Badge></td>
                <td style={TD({fontSize:12})}>{usage>0?`${validated}/${usage}`:"—"}</td>
                <td style={TD()}>{courses>0?<Badge type="purple">{courses} course{courses>1?"s":""}</Badge>:<Badge type="grey">—</Badge>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {showAdd&&<Modal title="📚 Add New Skill" onClose={()=>setShowAdd(false)}>
        <FG label="Skill Name" required><input style={INP} value={newSk.name} onChange={e=>setNewSk(s=>({...s,name:e.target.value}))} placeholder="e.g. Kubernetes, Agile, Risk Analysis…"/></FG>
        <FG label="Category"><select style={SEL} value={newSk.category} onChange={e=>setNewSk(s=>({...s,category:e.target.value}))}>{["Technical","Domain","Soft Skills","Strategic","AI Capability"].map(c=><option key={c}>{c}</option>)}</select></FG>
        <FG label="Applicable To"><div style={{display:"flex",gap:16}}>{["human","ai_agent"].map(t=><label key={t} style={{display:"flex",gap:8,cursor:"pointer",fontSize:13,alignItems:"center"}}><input type="checkbox" checked={(newSk.applicable_to||[]).includes(t)} onChange={e=>setNewSk(s=>({...s,applicable_to:e.target.checked?[...s.applicable_to,t]:s.applicable_to.filter(x=>x!==t)}))}/>{t==="ai_agent"?"AI Agents":"Human Employees"}</label>)}</div></FG>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <button style={BTN("outline")} onClick={()=>setShowAdd(false)}>Cancel</button>
          <button style={BTN("primary")} onClick={()=>{if(newSk.name){onUpdate("add_skill",newSk);setShowAdd(false);}}}>Add Skill</button>
        </div>
      </Modal>}
    </div>
  );
}

// ── MATCHES PAGE ───────────────────────────────────────────────
function MatchesPage({data,user}) {
  const matches = user.role==="employee"
    ? data.matches.filter(m=>m.employee_id===user.employee_id)
    : data.matches;
  return (
    <div style={card()}>
      <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:12}}>🔄 Mobility Matches — Smart Fit Engine</div>
      {matches.length===0?<Empty icon="🔄" text="No matches yet"/>:
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr><th style={TH}>Score</th><th style={TH}>Employee</th><th style={TH}>Dept</th><th style={TH}>Target Role</th><th style={TH}>Location</th><th style={TH}>Priority</th><th style={TH}>AI Agent</th><th style={TH}>Status</th></tr></thead>
        <tbody>{[...matches].sort((a,b)=>b.match_score-a.match_score).map(m=>{
          const agent=data.employees.find(e=>e.id===m.scored_by);
          const pct=m.match_score;
          return <tr key={m.id}>
            <td style={TD()}><div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:"50%",fontSize:12,fontWeight:800,border:`3px solid ${pct>=85?C.green:pct>=70?C.amber:C.red}`,color:pct>=85?C.green:pct>=70?C.amber:C.red,background:pct>=85?C.greenTint:pct>=70?C.amberTint:C.redTint}}>{pct}%</div></td>
            <td style={TD({fontWeight:600})}>{m.employee_name}</td>
            <td style={TD()}><Badge type="blue">{m.employee_dept}</Badge></td>
            <td style={TD()}>{m.job_title}</td>
            <td style={TD({fontSize:12,color:C.inkMuted})}>📍 {m.location}</td>
            <td style={TD()}><Badge type={m.priority}>{m.priority}</Badge></td>
            <td style={TD()}>{agent&&<div style={{display:"flex",alignItems:"center",gap:6}}><span>🤖</span><span style={{fontSize:11}}>{agent.name}</span></div>}</td>
            <td style={TD()}>{SBadge(m.status)}</td>
          </tr>;
        })}</tbody>
      </table>}
    </div>
  );
}

// ── AI AGENTS PAGE ─────────────────────────────────────────────
function AIAgents({data,user,onUpdate}) {
  const [selectedAgent,setSelectedAgent]=useState(null);
  const [tab,setTab]=useState("overview");
  const [showDeploy,setShowDeploy]=useState(false);
  const [newAgent,setNewAgent]=useState({name:"",role:"",department:"Technology",model:"GPT-4o",manager_id:""});
  const agents=data.employees.filter(e=>e.type==="ai_agent");
  const agent=agents.find(a=>a.id===selectedAgent)||agents[0];

  const LC=["draft","training","deployed","monitoring","deprecated"];
  const LCC={draft:C.inkMuted,training:C.amber,deployed:C.green,monitoring:C.blue,deprecated:C.red};

  const deployAgent = () => {
    if(!newAgent.name||!newAgent.role) return;
    onUpdate("add_agent",{id:"ai"+uid(),name:newAgent.name,email:newAgent.name.toLowerCase().replace(" ","-")+"@axa-ai.internal",department:newAgent.department,role:newAgent.role,manager:newAgent.manager_id||"e5",hire_date:new Date().toISOString().split("T")[0],type:"ai_agent",status:"active",lifecycle:"draft",model:newAgent.model,version:"0.1",accuracy:0,requests:0,pools:["AI Champion"]});
    setShowDeploy(false); setNewAgent({name:"",role:"",department:"Technology",model:"GPT-4o",manager_id:""});
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:14}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontSize:12,fontWeight:700,color:C.inkMuted}}>AI Agents</div>
          {canDo(user,"manage_ai")&&<button style={BTN("sm-ai")} onClick={()=>setShowDeploy(true)}>+ Deploy</button>}
        </div>
        {agents.map(a=>(
          <div key={a.id} onClick={()=>{setSelectedAgent(a.id);setTab("overview");}} style={{...card({padding:"12px 14px"}),cursor:"pointer",borderLeft:`4px solid ${LCC[a.lifecycle]||C.border}`,background:(selectedAgent||agents[0]?.id)===a.id?C.bluePale:C.card}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><Avatar name={a.name} size={28} type="ai_agent"/><div style={{fontWeight:600,fontSize:12}}>{a.name}</div></div>
            <div style={{fontSize:11,color:C.inkMuted,marginBottom:6}}>{a.model} · v{a.version}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {SBadge(a.lifecycle)}
              <span style={{fontWeight:700,fontSize:12,color:LCC[a.lifecycle]}}>{a.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>

      {agent&&<div>
        <div style={{background:`linear-gradient(135deg,${C.ai},${C.purple})`,borderRadius:14,padding:"20px 22px",color:"#fff",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🤖</div>
            <div>
              <div style={{fontSize:18,fontWeight:800}}>{agent.name}</div>
              <div style={{opacity:0.8,fontSize:12,marginTop:2}}>{agent.role} · v{agent.version} · {agent.model}</div>
              <div style={{opacity:0.6,fontSize:11,marginTop:2}}>Manager: {data.employees.find(e=>e.id===agent.manager)?.name||"—"}</div>
            </div>
            <div style={{marginLeft:"auto"}}>{SBadge(agent.lifecycle)}</div>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:`2px solid ${C.border}`,marginBottom:14}}>
          {[["overview","Overview"],["skills","Skills"],["performance","Performance"],["governance","Governance"]].map(([id,l])=>(
            <div key={id} onClick={()=>setTab(id)} style={{padding:"8px 16px",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?C.ai:C.inkMuted,borderBottom:`3px solid ${tab===id?C.ai:"transparent"}`,marginBottom:-2,cursor:"pointer"}}>{l}</div>
          ))}
        </div>
        {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={card()}>
            <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:10}}>Identity</div>
            {[["Model",agent.model],["Version","v"+agent.version],["Department",agent.department],["Created",fmtDate(agent.hire_date)]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                <span style={{color:C.inkMuted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={card()}>
            <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:10}}>Lifecycle</div>
            {LC.map((l,li)=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:LC.indexOf(agent.lifecycle)>=li?LCC[l]:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:LC.indexOf(agent.lifecycle)>=li?"#fff":C.inkMuted}}>{LC.indexOf(agent.lifecycle)>=li?"✓":""}</div>
                <div style={{fontSize:12,fontWeight:agent.lifecycle===l?700:400,color:agent.lifecycle===l?LCC[l]:C.inkMuted,textTransform:"capitalize"}}>{l}</div>
                {agent.lifecycle===l&&<Badge type={l}>Current</Badge>}
              </div>
            ))}
          </div>
        </div>}
        {tab==="performance"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"Accuracy",v:agent.accuracy+"%",c:C.green},{l:"Daily Requests",v:agent.requests||0,c:C.blue},{l:"Model",v:agent.model,c:C.ai},{l:"Version",v:"v"+agent.version,c:C.purple}].map(m=>(
            <div key={m.l} style={{...card({padding:"14px 16px"}),borderTop:`3px solid ${m.c}`}}>
              <div style={{fontSize:10,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>{m.l}</div>
              <div style={{fontSize:22,fontWeight:800}}>{m.v||"—"}</div>
            </div>
          ))}
        </div>}
        {tab==="governance"&&<div style={card()}>
          <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:12}}>Governance & Controls</div>
          {[{l:"Human Oversight",v:"Required at all decision points",ok:true},{l:"Audit Logging",v:"All actions logged & traceable",ok:true},{l:"Explainability",v:"High — recommendations include reasoning",ok:true},{l:"Override",v:"Human can override any AI decision",ok:true},{l:"Data Access",v:"Limited to assigned scope",ok:true}].map(g=>(
            <div key={g.l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
              <span style={{fontSize:13,color:C.inkSoft}}>{g.l}</span>
              <div style={{display:"flex",gap:8}}><span style={{fontWeight:600,fontSize:12,color:g.ok?C.green:C.red}}>{g.v}</span><span>{g.ok?"✅":"⚠️"}</span></div>
            </div>
          ))}
        </div>}
        {tab==="skills"&&<div style={card()}>
          <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:12}}>AI Capabilities</div>
          {data.employee_skills.filter(es=>es.employee_id===agent.id).map(es=>{
            const sk=data.skills_ref.find(s=>s.id===es.skill_id);
            if(!sk)return null;
            return <div key={es.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span style={{fontWeight:600}}>{sk.name} <Badge type="ai">AI Capability</Badge></span>
                <span style={{color:C.inkMuted}}>{es.current_level}/5</span>
              </div>
              <SkillBar current={es.current_level} target={es.target_level}/>
            </div>;
          })}
          {data.employee_skills.filter(es=>es.employee_id===agent.id).length===0&&<Empty icon="🤖" text="No capabilities assigned yet"/>}
        </div>}
      </div>}

      {showDeploy&&<Modal title="🤖 Deploy New AI Agent" onClose={()=>setShowDeploy(false)}>
        <FG label="Agent Name" required><input style={INP} placeholder="e.g. MATCH-Pro, SKILLS-Scout…" value={newAgent.name} onChange={e=>setNewAgent(x=>({...x,name:e.target.value}))}/></FG>
        <FG label="Role / Purpose" required><input style={INP} placeholder="e.g. Advanced Talent Matching" value={newAgent.role} onChange={e=>setNewAgent(x=>({...x,role:e.target.value}))}/></FG>
        <FG label="Department"><select style={SEL} value={newAgent.department} onChange={e=>setNewAgent(x=>({...x,department:e.target.value}))}>
          {["Technology","HR","Finance","Operations"].map(d=><option key={d}>{d}</option>)}
        </select></FG>
        <FG label="Foundation Model"><select style={SEL} value={newAgent.model} onChange={e=>setNewAgent(x=>({...x,model:e.target.value}))}>
          {["GPT-4o","Claude-3.5","Gemini 1.5","Mistral Large"].map(m=><option key={m}>{m}</option>)}
        </select></FG>
        <FG label="Responsible Manager">
          <select style={SEL} value={newAgent.manager_id} onChange={e=>setNewAgent(x=>({...x,manager_id:e.target.value}))}>
            <option value="">Select manager…</option>
            {data.employees.filter(e=>e.type==="human"&&(e.is_manager||e.role.toLowerCase().includes("manager")||e.role.toLowerCase().includes("director")||e.role.toLowerCase().includes("partner"))).map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
          </select>
        </FG>
        <div style={{...card({background:C.aiTint,padding:"12px 14px",marginBottom:16}),border:`1px solid ${C.ai}33`}}>
          <div style={{fontSize:11,color:C.ai,fontWeight:700,marginBottom:4}}>Deployment will start in Draft state</div>
          <div style={{fontSize:11,color:C.inkSoft}}>The agent will go through: Draft → Training → Deployed → Monitoring. All stages require human approval.</div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button style={BTN("outline")} onClick={()=>setShowDeploy(false)}>Cancel</button>
          <button style={BTN("ai")} onClick={deployAgent}>Deploy Agent</button>
        </div>
      </Modal>}
    </div>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────
function Analytics({data}) {
  const an=data.analytics; const months=an.monthly; const maxM=Math.max(...months.map(m=>m.matches));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard label="Avg Skills Coverage" value="71%"  sub="All departments" color={C.green}  icon="📊"/>
        <StatCard label="Active Gaps"          value="18"   sub="Requiring action" color={C.amber}  icon="⚠️"/>
        <StatCard label="AI Contribution"      value="76%"  sub="3,891 tasks/mo"  color={C.ai}     icon="🤖"/>
        <StatCard label="Talent Promoter"      value="68"   sub="+12 vs last qtr" color={C.blue}   icon="🌟"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:14}}>📊 Skills Coverage by Department</div>
          {an.skills_coverage.map(d=>(
            <div key={d.department} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{fontWeight:600}}>{d.department}</span><span style={{fontWeight:700,color:d.coverage>=80?C.green:d.coverage>=60?C.amber:C.red}}>{d.coverage}%</span></div>
              <div style={{height:8,background:C.border,borderRadius:99}}><div style={{height:"100%",width:`${d.coverage}%`,background:d.coverage>=80?C.green:d.coverage>=60?C.amber:C.red,borderRadius:99}}/></div>
              <div style={{fontSize:10,color:C.inkMuted,marginTop:3}}>{d.assessed}/{d.total_skills} skills assessed</div>
            </div>
          ))}
        </div>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:4}}>📈 Monthly Mobility Activity</div>
          <div style={{display:"flex",gap:14,marginBottom:10,fontSize:11}}><span style={{color:C.blue}}>■ Matches</span><span style={{color:C.green}}>■ Placements</span></div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:110,paddingTop:8}}>
            {months.map((m,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:9,color:C.inkMuted,fontWeight:600}}>{m.matches}</div>
                <div style={{width:"100%",background:C.blue,borderRadius:"3px 3px 0 0",height:`${(m.matches/maxM)*90}px`,minHeight:3}}/>
                <div style={{fontSize:9,color:C.inkMuted}}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:14}}>⚠️ Talent Hoarding Detection</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>Manager</th><th style={TH}>Dept</th><th style={TH}>5y+ members</th><th style={TH}>Avg Tenure</th><th style={TH}>Risk</th></tr></thead>
            <tbody>{an.talent_hoarding.map((h,i)=>(
              <tr key={i}>
                <td style={TD({fontWeight:600,fontSize:12})}>{h.manager}</td>
                <td style={TD()}><Badge type="blue" small>{h.dept}</Badge></td>
                <td style={TD({textAlign:"center",fontWeight:700,color:h.employees_blocked>0?C.red:C.green})}>{h.employees_blocked}</td>
                <td style={TD({fontSize:12})}>{h.avg_tenure}y</td>
                <td style={TD()}><Badge type={h.risk==="high"?"red":"green"}>{h.risk}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:14}}>🌟 Talent Promoter Metrics</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>Employee</th><th style={TH}>Match</th><th style={TH}>Readiness</th><th style={TH}>Status</th></tr></thead>
            <tbody>{an.promoter_metrics.map((p,i)=>(
              <tr key={i}>
                <td style={TD({fontWeight:600})}>{p.name}</td>
                <td style={TD()}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{height:6,width:70,background:C.border,borderRadius:99}}><div style={{height:"100%",width:`${p.mobility_score}%`,background:p.mobility_score>=85?C.green:C.amber,borderRadius:99}}/></div><span style={{fontWeight:700,fontSize:12}}>{p.mobility_score}%</span></div></td>
                <td style={TD()}><span style={{fontWeight:700,color:C.blue}}>{p.readiness}/5</span></td>
                <td style={TD()}>{p.recommended?<Badge type="green">✓ Ready</Badge>:<Badge type="grey">Developing</Badge>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── CHARTER ────────────────────────────────────────────────────
function CharterPage() {
  const [expanded,setExpanded]=useState(null);
  const principles=[
    {id:1,icon:"🎯",title:"Skills-First Mobility",color:C.blue,desc:"Internal mobility is driven by competency alignment, not hierarchy.",rules:["Employees matched to opportunities by validated skill profiles","Skill gaps identified before mobility requests","AI-powered Smart Fit ensures objective matching"]},
    {id:2,icon:"⏱",title:"3-Year Career Cycle",  color:C.green,desc:"Every employee has a mandatory career interview at least every 3 years.",rules:["Interviews tracked automatically by the platform","Skills assessed and action plans created each cycle","3Y+ cycle triggers talent hoarding alert"]},
    {id:3,icon:"🤝",title:"Transparency",         color:C.amber,desc:"All mobility decisions follow documented, auditable processes.",rules:["All workflow steps visible to concerned parties","AI recommendations are explainable","HR retains final approval on all placements"]},
    {id:4,icon:"🤖",title:"Human + AI",           color:C.ai,   desc:"AI agents augment — never replace — human judgment.",rules:["Human oversight mandatory at all decision points","Agent actions are logged and auditable","Employees may request human-only review"]},
    {id:5,icon:"📈",title:"Continuous Dev.",      color:C.purple,desc:"The platform tracks skill evolution and surfaces upskilling pathways.",rules:["Skill trajectories monitored quarterly","Career paths define clear upskilling requirements","Learning catalogue linked to each skill gap"]},
    {id:6,icon:"🛡",title:"Anti-Hoarding",        color:C.red,  desc:"Managers cannot block team members from internal opportunities.",rules:["5-year tenure auto-flagged in marketplace","Talent hoarding detected in analytics","Employees apply directly to internal roles"]},
  ];
  const wfTypes=[
    {icon:"🔄",name:"Mobility Request",steps:["Request","Manager Review","HR Validation","AI Smart Fit","Assignment"],time:"4–6 weeks"},
    {icon:"🎙",name:"Career Interview",steps:["Schedule","Preparation","Interview","Skills Assessment","Action Plan"],time:"3-year cycle"},
    {icon:"📚",name:"Upskilling Plan",steps:["Gap Analysis","Plan Design","Approval","Enrollment","Tracking"],time:"6–18 months"},
    {icon:"🤖",name:"AI Deployment",  steps:["Design","Training","Evaluation","Governance","Go-Live"],time:"8–12 weeks"},
  ];
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${C.blue} 0%,${C.blueM} 100%)`,borderRadius:14,padding:"24px 28px",color:"#fff",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:0,top:0,width:200,height:"100%",background:"rgba(255,255,255,0.04)",clipPath:"polygon(30% 0,100% 0,100% 100%,0 100%)"}}/>
        <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",opacity:0.6,marginBottom:6}}>AXA Group Operations</div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>SMART Mobility Charter</div>
        <div style={{fontSize:13,opacity:0.75,maxWidth:560}}>The foundational framework governing internal talent mobility, skills development, and AI augmentation at AXA GO.</div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {["Skills-First","Human + AI","Anti-Hoarding","Transparent","3-Year Cycle","AI-Augmented"].map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.15)",color:"#fff"}}>{t}</span>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {principles.map(p=>(
          <div key={p.id} style={{...card({padding:0,overflow:"hidden"}),cursor:"pointer",border:`1.5px solid ${expanded===p.id?p.color:C.border}`}} onClick={()=>setExpanded(expanded===p.id?null:p.id)}>
            <div style={{height:4,background:p.color}}/>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:20}}>{p.icon}</span>
                <div style={{fontWeight:700,fontSize:13}}>{p.title}</div>
                <span style={{marginLeft:"auto",color:C.inkMuted,fontSize:12}}>{expanded===p.id?"▲":"▼"}</span>
              </div>
              <div style={{fontSize:12,color:C.inkMuted,lineHeight:1.5}}>{p.desc}</div>
              {expanded===p.id&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
                {p.rules.map((r,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,color:C.inkSoft,marginBottom:6}}><span style={{color:p.color,fontWeight:700,flexShrink:0}}>→</span>{r}</div>)}
              </div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:14,fontWeight:800,color:C.blue,marginBottom:14}}>Workflow Typology</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {wfTypes.map(wt=>(
          <div key={wt.name} style={card({padding:"14px 16px"})}>
            <div style={{fontSize:20,marginBottom:6}}>{wt.icon}</div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>{wt.name}</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
              {wt.steps.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}><div style={{width:18,height:18,borderRadius:"50%",background:C.blue,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{i+1}</div><span style={{color:C.inkSoft}}>{s}</span></div>)}
            </div>
            <div style={{fontSize:11,color:C.inkMuted,borderTop:`1px solid ${C.border}`,paddingTop:8}}>⏱ {wt.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [authed,setAuthed]=useState(false);
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [selectedEmp,setSelectedEmp]=useState(null);
  const [data,setData]=useState(()=>JSON.parse(JSON.stringify(SEED)));

  const onLogin = u => { setUser(u); setAuthed(true); setPage("dashboard"); };

  const onUpdate = (type,payload) => {
    setData(d => {
      const nd = {...d};
      if(type==="add_skill")       nd.skills_ref=[...nd.skills_ref,{...payload,id:"sk"+uid(),applicable_to:payload.applicable_to||["human"]}];
      if(type==="add_workflow")    nd.workflows=[...nd.workflows,payload];
      if(type==="add_interview")   nd.interviews=[...nd.interviews,payload];
      if(type==="add_action_plan") nd.action_plans=[...nd.action_plans,payload];
      if(type==="add_agent")       nd.employees=[...nd.employees,payload];
      if(type==="approve_step"){
        nd.workflows=nd.workflows.map(wf=>{
          if(wf.id!==payload.wfId)return wf;
          const steps=wf.steps.map(s=>{
            if(s.id!==payload.stepId)return s;
            return {...s,status:"completed",completed_at:new Date().toISOString().split("T")[0]};
          });
          const nextIdx=steps.findIndex(s=>s.status==="pending");
          if(nextIdx>=0)steps[nextIdx]={...steps[nextIdx],status:"in_progress"};
          const allDone=steps.every(s=>s.status==="completed");
          return {...wf,steps,status:allDone?"completed":"in_progress",current_step:nextIdx>=0?nextIdx:wf.current_step};
        });
      }
      return nd;
    });
  };

  if(!authed) return <AuthPage onLogin={onLogin}/>;

  const isEmployee = user.role==="employee";
  const pendingMatches = data.matches.filter(m=>m.status==="suggested").length;

  const NAV_ALL = [
    {id:"dashboard",   icon:"◼",  label:"Dashboard",         sec:"Overview",  highlight:true},
    {id:"charter",     icon:"📜", label:"SMART Charter",     sec:"Overview"},
    {id:"marketplace", icon:"🏪", label:"Talent Marketplace", sec:"Workforce", hidden:isEmployee},
    {id:"myteam",      icon:"👔", label:"My Team",           sec:"Workforce", hidden:!canDo(user,"manage_team")},
    {id:"workforce",   icon:"👥", label:"All Workforce",     sec:"Workforce", hidden:isEmployee||(!canDo(user,"manage_users"))},
    {id:"interviews",  icon:"🎙", label:"Career Interviews", sec:"Mobility"},
    {id:"workflows",   icon:"⚙️", label:"Workflow Engine",   sec:"Mobility"},
    {id:"matches",     icon:"🔄", label:"Mobility Matches",  sec:"Mobility"},
    {id:"career-paths",icon:"🗺", label:"Career Paths",      sec:"Development"},
    {id:"learning",    icon:"📚", label:"Learning",          sec:"Development"},
    {id:"skills-ref",  icon:"🎯", label:"Skills Repository", sec:"Development"},
    {id:"ai-agents",   icon:"🤖", label:"AI Agents",         sec:"AI & Intel", aiOnly:true},
    {id:"analytics",   icon:"📊", label:"Analytics",         sec:"Reporting",  hidden:isEmployee},
  ];

  const NAV = NAV_ALL.filter(n=>!n.hidden);
  const sections = [...new Set(NAV.map(n=>n.sec))];

  const PAGE_TITLES = {dashboard:"Dashboard",charter:"SMART Charter",marketplace:"Talent & AI Marketplace",myteam:"My Team",workforce:"All Workforce",interviews:"Career Interviews",workflows:"Workflow Engine",matches:"Mobility Matches","career-paths":"Career Paths",learning:"Learning Catalogue","skills-ref":"Skills Repository","ai-agents":"AI Agent Management",analytics:"Analytics & Reports"};

  const Workforce_Full = ({data,user,onSelectEmp}) => {
    const [search,setSearch]=useState("");
    const [typeFilter,setTypeFilter]=useState("all");
    const filtered=data.employees.filter(e=>{
      const ms=e.name.toLowerCase().includes(search.toLowerCase())||e.role.toLowerCase().includes(search.toLowerCase());
      const mt=typeFilter==="all"||e.type===typeFilter;
      return ms&&mt;
    });
    const humans=filtered.filter(e=>e.type==="human");
    const agents=filtered.filter(e=>e.type==="ai_agent");
    const Row=({e})=>{
      const skCount=data.employee_skills.filter(s=>s.employee_id===e.id).length;
      const mgr=data.employees.find(m=>m.id===e.manager);
      const yrs=yearsAt(e.hire_date);
      return <tr>
        <td style={TD()}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={e.name} size={32} type={e.type}/><div><div style={{fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:C.inkMuted}}>{e.email}</div></div></div></td>
        <td style={TD()}><Badge type={e.type==="ai_agent"?"ai":"human"}>{e.type==="ai_agent"?"AI Agent":"Human"}</Badge></td>
        <td style={TD()}><Badge type="blue">{e.department}</Badge></td>
        <td style={TD({fontSize:12})}>{e.role}</td>
        <td style={TD({fontSize:12,color:C.inkMuted})}>{mgr?.name||"—"}</td>
        <td style={TD()}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(e.pools||[]).slice(0,2).map(p=><PoolTag key={p} pool={p}/>)}</div></td>
        <td style={TD({fontSize:11})}>{e.type==="human"?`${yrs}y`:e.lifecycle}</td>
        <td style={TD()}><button style={BTN("sm-ghost")} onClick={()=>onSelectEmp(e.id)}>Profile →</button></td>
      </tr>;
    };
    return <div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...INP,maxWidth:240}} placeholder="🔍 Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <div style={{display:"flex",gap:6}}>{[["all","All"],["human","Humans"],["ai_agent","AI Agents"]].map(([v,l])=><button key={v} style={v===typeFilter?BTN("sm"):BTN("sm-out")} onClick={()=>setTypeFilter(v)}>{l}</button>)}</div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          {canDo(user,"write")&&<button style={BTN("primary")}>＋ Add Employee</button>}
          {canDo(user,"manage_ai")&&<button style={BTN("ai")}>🤖 Deploy Agent</button>}
        </div>
      </div>
      {humans.length>0&&<><div style={{fontSize:11,fontWeight:700,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>👥 Human Employees ({humans.length})</div>
        <div style={{...card(),marginBottom:16}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={TH}>Employee</th><th style={TH}>Type</th><th style={TH}>Dept</th><th style={TH}>Role</th><th style={TH}>Manager</th><th style={TH}>Pools</th><th style={TH}>Tenure</th><th style={TH}></th></tr></thead><tbody>{humans.map(e=><Row key={e.id} e={e}/>)}</tbody></table></div></>}
      {agents.length>0&&<><div style={{fontSize:11,fontWeight:700,color:C.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>🤖 AI Agents ({agents.length})</div>
        <div style={{...card(),border:`1px solid ${C.ai}33`}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={{...TH,background:C.aiBg}}>Agent</th><th style={{...TH,background:C.aiBg}}>Type</th><th style={{...TH,background:C.aiBg}}>Dept</th><th style={{...TH,background:C.aiBg}}>Role</th><th style={{...TH,background:C.aiBg}}>Manager</th><th style={{...TH,background:C.aiBg}}>Pools</th><th style={{...TH,background:C.aiBg}}>Status</th><th style={{...TH,background:C.aiBg}}></th></tr></thead><tbody>{agents.map(e=><Row key={e.id} e={e}/>)}</tbody></table></div></>}
    </div>;
  };

  return (
    <div style={{display:"flex",height:"100vh",background:C.surface,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",fontSize:13,color:C.ink}}>
      <aside style={{width:220,background:`linear-gradient(180deg,${C.blueD} 0%,${C.blue} 100%)`,display:"flex",flexDirection:"column",flexShrink:0,borderRight:`1px solid rgba(255,255,255,0.06)`}}>
        <div style={{padding:"16px 14px 12px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:4}}>AXA</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:1}}>Group Operations</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:2}}>SMART Mobility · v4.0</div>
        </div>
        <div style={{padding:"10px 14px 8px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(user?.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{user?.role}</div>
          </div>
        </div>
        <nav style={{flex:1,padding:"6px 5px",overflowY:"auto"}}>
          {sections.map(sec=>(
            <div key={sec}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",padding:"10px 10px 3px"}}>{sec}</div>
              {NAV.filter(n=>n.sec===sec).map(n=>{
                if(n.aiOnly&&!canDo(user,"manage_ai"))return null;
                const active=page===n.id&&!selectedEmp;
                const badge=n.id==="matches"&&pendingMatches>0;
                return (
                  <div key={n.id} onClick={()=>{setPage(n.id);setSelectedEmp(null);}}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,cursor:"pointer",marginBottom:1,
                      color:active?"#fff":"rgba(255,255,255,0.58)",fontWeight:active?700:400,fontSize:12,
                      background:active?"rgba(255,255,255,0.14)":"transparent",
                      borderLeft:active?`3px solid ${n.highlight?C.red:"rgba(255,255,255,0.8)"}` :"3px solid transparent",transition:"all 0.15s"}}>
                    <span style={{fontSize:13,flexShrink:0}}>{n.icon}</span>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.label}</span>
                    {badge&&<span style={{background:C.red,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8}}>{pendingMatches}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.3)"}}>
          <span>Mobility by Design</span><span>v4.0 POC</span>
        </div>
      </aside>

      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"0 22px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,borderTop:`3px solid ${C.red}`}}>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:C.blue}}>{selectedEmp?"Employee Profile":PAGE_TITLES[page]||page}</div>
            <div style={{fontSize:10,color:C.inkMuted}}>AXA GO · SMART Mobility · <b style={{color:C.blue}}>{user?.role}</b></div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {isEmployee&&<Badge type="blue" small>Employee View</Badge>}
            {canDo(user,"manage_ai")&&<Badge type="ai" small>AI Admin</Badge>}
            <button style={BTN("sm-ghost")} onClick={()=>{setAuthed(false);setUser(null);setPage("dashboard");}}>Sign out</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {selectedEmp
            ? <EmployeeProfile employeeId={selectedEmp} data={data} user={user} onBack={()=>setSelectedEmp(null)} onUpdate={onUpdate}/>
            : <>
              {page==="dashboard"    &&<Dashboard     data={data} user={user}/>}
              {page==="charter"      &&<CharterPage/>}
              {page==="marketplace"  &&<Marketplace   data={data} user={user} onSelectEmp={id=>{setSelectedEmp(id);}}/>}
              {page==="myteam"       &&<MyTeam        data={data} user={user} onSelectEmp={id=>setSelectedEmp(id)} onUpdate={onUpdate}/>}
              {page==="workforce"    &&<Workforce_Full data={data} user={user} onSelectEmp={id=>setSelectedEmp(id)}/>}
              {page==="interviews"   &&<CareerInterviews data={data} user={user} onUpdate={onUpdate}/>}
              {page==="workflows"    &&<WorkflowEngine data={data} user={user} onUpdate={onUpdate}/>}
              {page==="matches"      &&<MatchesPage   data={data} user={user}/>}
              {page==="career-paths" &&<CareerPaths   data={data} user={user}/>}
              {page==="learning"     &&<Learning      data={data} user={user}/>}
              {page==="skills-ref"   &&<SkillsRepo    data={data} user={user} onUpdate={onUpdate}/>}
              {page==="ai-agents"    &&<AIAgents      data={data} user={user} onUpdate={onUpdate}/>}
              {page==="analytics"    &&<Analytics     data={data}/>}
            </>
          }
        </div>
      </main>
    </div>
  );
}
