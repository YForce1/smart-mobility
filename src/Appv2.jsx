import { useState } from "react";

const AXA = {
  blue:"#00008F", blueDeep:"#000070", blueMid:"#1A1AB0",
  blueTint:"#E8E8FF", bluePale:"#F0F0FF",
  red:"#C91432", redTint:"#FDEDF0",
  ink:"#0A0A1E", inkSoft:"#3A3A5C", inkMuted:"#7A7A9A",
  surface:"#F4F5FA", border:"#E0E0F0", card:"#FFFFFF",
  green:"#007A4D", greenBg:"rgba(0,122,77,0.09)",
  amber:"#B85C00", amberBg:"rgba(184,92,0,0.09)",
  purple:"#5C2D91", purpleBg:"rgba(92,45,145,0.09)",
  teal:"#006D77", tealBg:"rgba(0,109,119,0.09)",
  ai:"#7C3AED", aiBg:"rgba(124,58,237,0.09)", aiTint:"#EDE9FE",
};

const RBAC = {
  admin:["read","write","delete","approve","configure","manage_ai","view_analytics","manage_users"],
  hr:["read","write","approve","view_analytics","manage_users"],
  manager:["read","write","approve","view_analytics"],
  employee:["read","write_own"],
};

const canDo=(user,perm)=>RBAC[user?.role]?.includes(perm);
const uid=()=>Math.random().toString(36).slice(2,8);
const initials=n=>n?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"??";
const fmtDate=d=>d?new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"—";

const SEED = {
  employees:[
    {id:"e1",name:"Sophie Martin",  email:"s.martin@axa.com",  department:"Technology",role:"Senior Developer",       manager:"e5",hire_date:"2018-03-15",type:"human",   status:"active"},
    {id:"e2",name:"Lucas Bernard",  email:"l.bernard@axa.com",  department:"Finance",   role:"Financial Analyst",      manager:"e6",hire_date:"2020-07-01",type:"human",   status:"active"},
    {id:"e3",name:"Emma Rousseau",  email:"e.rousseau@axa.com", department:"HR",        role:"HR Business Partner",    manager:"e5",hire_date:"2019-11-20",type:"human",   status:"active"},
    {id:"e4",name:"Thomas Leclerc", email:"t.leclerc@axa.com",  department:"Technology",role:"Data Engineer",          manager:"e5",hire_date:"2021-02-10",type:"human",   status:"active"},
    {id:"e5",name:"Alexandre Dupont",email:"a.dupont@axa.com",  department:"Technology",role:"Director Engineering",   manager:null,hire_date:"2015-01-10",type:"human",   status:"active"},
    {id:"e6",name:"Isabelle Sanville",email:"i.sanville@axa.com",department:"Finance",  role:"CFO",                    manager:null,hire_date:"2013-05-20",type:"human",   status:"active"},
    {id:"ai1",name:"ARIA-Matcher",  email:"aria@axa-ai.internal",department:"Technology",role:"AI Matching Agent",     manager:"e5",hire_date:"2024-06-01",type:"ai_agent",status:"active",lifecycle:"deployed",model:"GPT-4o",version:"2.1",accuracy:94.2,requests:847},
    {id:"ai2",name:"SKIM-Analyzer", email:"skim@axa-ai.internal",department:"HR",       role:"Skills Intelligence",    manager:"e3",hire_date:"2024-09-01",type:"ai_agent",status:"active",lifecycle:"deployed",model:"Claude-3.5",version:"1.4",accuracy:91.8,requests:234},
    {id:"ai3",name:"FLOW-Orchestrator",email:"flow@axa-ai.internal",department:"HR",    role:"Workflow Orchestration", manager:"e3",hire_date:"2025-01-15",type:"ai_agent",status:"training",lifecycle:"training",model:"Claude-3.5",version:"0.8",accuracy:78.3,requests:0},
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
  ],
  skills_ref:[
    {id:"sk01",name:"JavaScript / TypeScript",   category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk02",name:"Python",                    category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk03",name:"Cloud Architecture",        category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk04",name:"Data Engineering",          category:"Technical",  applicable_to:["human","ai_agent"]},
    {id:"sk07",name:"Financial Modelling",       category:"Domain",     applicable_to:["human"]},
    {id:"sk11",name:"Leadership & Influence",    category:"Soft Skills",applicable_to:["human"]},
    {id:"sk12",name:"Change Management",         category:"Soft Skills",applicable_to:["human"]},
    {id:"sk14",name:"Stakeholder Management",    category:"Soft Skills",applicable_to:["human"]},
    {id:"sk16",name:"Strategic Thinking",        category:"Strategic",  applicable_to:["human","ai_agent"]},
    {id:"sk17",name:"Programme Management",      category:"Strategic",  applicable_to:["human","ai_agent"]},
    {id:"sk19",name:"Talent Matching & Scoring", category:"AI Capability",applicable_to:["ai_agent"]},
    {id:"sk21",name:"Skills Gap Analysis",       category:"AI Capability",applicable_to:["ai_agent"]},
    {id:"sk22",name:"Workflow Orchestration",    category:"AI Capability",applicable_to:["ai_agent"]},
  ],
  interviews:[
    {id:"i1",employee_id:"e1",employee_name:"Sophie Martin", department:"Technology",interviewer:"Alexandre Dupont",  scheduled_date:"2024-01-15",status:"completed",mobility_readiness:4,skills_assessed:true, next_interview_due:"2027-01-15",aspirations:"Solution Architect"},
    {id:"i2",employee_id:"e2",employee_name:"Lucas Bernard", department:"Finance",   interviewer:"Isabelle Sanville", scheduled_date:"2026-04-10",status:"scheduled", mobility_readiness:null,skills_assessed:false,next_interview_due:"2029-04-10",aspirations:null},
    {id:"i3",employee_id:"e3",employee_name:"Emma Rousseau", department:"HR",        interviewer:"Alexandre Dupont",  scheduled_date:"2025-06-01",status:"completed",mobility_readiness:5,skills_assessed:true, next_interview_due:"2028-06-01",aspirations:"HR Transformation Lead"},
  ],
  action_plans:[
    {id:"a1",employee_id:"e1",employee_name:"Sophie Martin",title:"Cloud Architecture Certification",description:"AWS SA certification",horizon:"1Y",status:"in_progress",due_date:"2025-01-15"},
    {id:"a2",employee_id:"e1",employee_name:"Sophie Martin",title:"Technical Leadership Mentoring",  description:"Shadow senior architect",horizon:"1Y",status:"completed",  due_date:"2024-07-15"},
    {id:"a3",employee_id:"e3",employee_name:"Emma Rousseau", title:"Programme Management Training",   description:"PM certification",      horizon:"2Y",status:"open",        due_date:"2027-01-01"},
  ],
  opportunities:[
    {id:"o1",title:"Solution Architect",    department:"Technology",required_skills:["sk01","sk03","sk11"],location:"Paris",open_date:"2026-03-01",status:"open",priority:"high"},
    {id:"o2",title:"Senior Data Engineer",  department:"Technology",required_skills:["sk02","sk04","sk03"],location:"Lyon", open_date:"2026-02-15",status:"open",priority:"critical"},
    {id:"o3",title:"HR Transformation Lead",department:"HR",        required_skills:["sk12","sk17","sk14"],location:"Paris",open_date:"2026-03-10",status:"open",priority:"normal"},
  ],
  matches:[
    {id:"m1",employee_id:"e1",employee_name:"Sophie Martin", employee_dept:"Technology",opportunity_id:"o1",job_title:"Solution Architect",   location:"Paris",priority:"high",    match_score:87,status:"suggested",scored_by:"ai1"},
    {id:"m2",employee_id:"e4",employee_name:"Thomas Leclerc",employee_dept:"Technology",opportunity_id:"o2",job_title:"Senior Data Engineer",  location:"Lyon", priority:"critical",match_score:91,status:"reviewed", scored_by:"ai1"},
    {id:"m3",employee_id:"e3",employee_name:"Emma Rousseau", employee_dept:"HR",        opportunity_id:"o3",job_title:"HR Transformation Lead", location:"Paris",priority:"normal",  match_score:94,status:"suggested",scored_by:"ai1"},
  ],
  workflows:[
    {id:"wf1",title:"Internal Mobility — Sophie Martin",employee_id:"e1",employee_name:"Sophie Martin",type:"mobility_request",target_role:"Solution Architect",status:"validated",current_step:3,created_at:"2026-02-01",steps:[
      {id:"s1",label:"Employee Request",  role:"employee", status:"completed",actor:"Sophie Martin",    completed_at:"2026-02-01"},
      {id:"s2",label:"Manager Review",    role:"manager",  status:"completed",actor:"A. Dupont",        completed_at:"2026-02-05",notes:"Strongly recommended"},
      {id:"s3",label:"HR Validation",     role:"hr",       status:"completed",actor:"Emma Rousseau",    completed_at:"2026-02-10",notes:"Approved — profile aligned"},
      {id:"s4",label:"AI Smart Fit",      role:"ai_agent", status:"completed",actor:"ARIA-Matcher",     completed_at:"2026-02-10",notes:"87% match score"},
      {id:"s5",label:"Assignment Order",  role:"hr",       status:"pending",  actor:"HR Team",          completed_at:null},
    ]},
    {id:"wf2",title:"Career Interview — Lucas Bernard",employee_id:"e2",employee_name:"Lucas Bernard",type:"career_interview",target_role:null,status:"draft",current_step:0,created_at:"2026-03-20",steps:[
      {id:"s1",label:"Schedule Interview",role:"hr",       status:"pending",actor:null,completed_at:null},
      {id:"s2",label:"Pre-interview prep",role:"employee", status:"pending",actor:null,completed_at:null},
      {id:"s3",label:"Interview session", role:"manager",  status:"pending",actor:null,completed_at:null},
      {id:"s4",label:"Skills Assessment", role:"ai_agent", status:"pending",actor:null,completed_at:null},
      {id:"s5",label:"Action Plan",       role:"hr",       status:"pending",actor:null,completed_at:null},
    ]},
    {id:"wf3",title:"Upskilling — Thomas Leclerc",employee_id:"e4",employee_name:"Thomas Leclerc",type:"upskilling",target_role:"Data Architect",status:"in_progress",current_step:2,created_at:"2026-01-10",steps:[
      {id:"s1",label:"Gap Analysis",      role:"ai_agent", status:"completed",  actor:"SKIM-Analyzer",  completed_at:"2026-01-10"},
      {id:"s2",label:"Plan Design",       role:"hr",       status:"completed",  actor:"Emma Rousseau",  completed_at:"2026-01-15"},
      {id:"s3",label:"Manager Approval",  role:"manager",  status:"in_progress",actor:"A. Dupont",      completed_at:null},
      {id:"s4",label:"Training Enrollment",role:"employee",status:"pending",    actor:null,             completed_at:null},
      {id:"s5",label:"Progress Tracking", role:"ai_agent", status:"pending",    actor:null,             completed_at:null},
    ]},
  ],
  role_skills:[
    {id:"rs01",role:"Senior Developer",    department:"Technology",required_skills:[{skill_id:"sk01",level:4},{skill_id:"sk03",level:3},{skill_id:"sk11",level:2}]},
    {id:"rs02",role:"Solution Architect",  department:"Technology",required_skills:[{skill_id:"sk01",level:4},{skill_id:"sk03",level:5},{skill_id:"sk11",level:4},{skill_id:"sk16",level:4}]},
    {id:"rs03",role:"Data Engineer",       department:"Technology",required_skills:[{skill_id:"sk02",level:4},{skill_id:"sk04",level:4},{skill_id:"sk03",level:3}]},
    {id:"rs04",role:"Financial Analyst",   department:"Finance",   required_skills:[{skill_id:"sk07",level:4},{skill_id:"sk14",level:3}]},
    {id:"rs05",role:"HR Business Partner", department:"HR",        required_skills:[{skill_id:"sk12",level:3},{skill_id:"sk14",level:4}]},
  ],
  career_paths:[
    {id:"cp01",from_role:"Senior Developer",  to_role:"Solution Architect",    timeline:"3Y",description:"Architecture & leadership transition.",requirements:["sk01","sk03","sk11","sk16"]},
    {id:"cp02",from_role:"Data Engineer",      to_role:"Data Architect",         timeline:"2Y",description:"Enterprise data strategy.",            requirements:["sk04","sk03","sk02","sk16"]},
    {id:"cp03",from_role:"Financial Analyst",  to_role:"Senior Financial Analyst",timeline:"2Y",description:"Analytical depth & stakeholders.",     requirements:["sk07","sk14"]},
    {id:"cp04",from_role:"HR Business Partner",to_role:"HR Transformation Lead", timeline:"3Y",description:"Strategic transformation.",            requirements:["sk12","sk17","sk14","sk16"]},
  ],
  analytics:{
    skills_coverage:[
      {department:"Technology",total_skills:6,assessed:5,coverage:83},
      {department:"Finance",   total_skills:4,assessed:2,coverage:50},
      {department:"HR",        total_skills:5,assessed:4,coverage:80},
    ],
    talent_hoarding:[
      {manager:"Alexandre Dupont",dept:"Technology",employees_blocked:2,avg_tenure:4.2,risk:"high"},
      {manager:"Isabelle Sanville",dept:"Finance",  employees_blocked:0,avg_tenure:2.1,risk:"low"},
    ],
    promoter_metrics:[
      {name:"Sophie Martin", manager:"A. Dupont",mobility_score:87,readiness:4,recommended:true},
      {name:"Emma Rousseau", manager:"A. Dupont",mobility_score:94,readiness:5,recommended:true},
      {name:"Thomas Leclerc",manager:"A. Moreau",mobility_score:91,readiness:3,recommended:false},
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

// ── Shared UI ──────────────────────────────────────────────────
const card=(x={})=>({background:AXA.card,border:`1px solid ${AXA.border}`,borderRadius:10,padding:20,boxShadow:"0 1px 4px rgba(0,0,143,0.05)",...x});
const TH={textAlign:"left",fontSize:10,fontWeight:700,color:AXA.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",padding:"9px 14px",borderBottom:`2px solid ${AXA.border}`,background:AXA.bluePale};
const TD=(x={})=>({padding:"11px 14px",borderBottom:`1px solid ${AXA.border}`,color:AXA.ink,verticalAlign:"middle",fontSize:13,...x});
const INP={width:"100%",padding:"8px 12px",border:`1px solid ${AXA.border}`,borderRadius:6,fontSize:13,color:AXA.ink,background:AXA.surface,fontFamily:"inherit",outline:"none"};
const BTN=v=>{
  const b={display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"inherit"};
  const m={primary:{...b,background:AXA.blue,color:"#fff"},ai:{...b,background:AXA.ai,color:"#fff"},red:{...b,background:AXA.red,color:"#fff"},
    outline:{...b,background:"transparent",color:AXA.blue,border:`1.5px solid ${AXA.blue}`},
    ghost:{...b,background:"transparent",color:AXA.inkMuted},
    sm:{...b,padding:"5px 11px",fontSize:12,background:AXA.blue,color:"#fff"},
    "sm-out":{...b,padding:"5px 11px",fontSize:12,background:"transparent",color:AXA.blue,border:`1.5px solid ${AXA.blue}`},
    "sm-ghost":{...b,padding:"5px 11px",fontSize:12,background:"transparent",color:AXA.inkMuted},
    "sm-ai":{...b,padding:"5px 11px",fontSize:12,background:AXA.ai,color:"#fff"},
  };
  return m[v]||m.outline;
};

const Badge=({type,children,small})=>{
  const P={
    blue:{bg:AXA.blueTint,co:AXA.blue},red:{bg:AXA.redTint,co:AXA.red},green:{bg:AXA.greenBg,co:AXA.green},
    amber:{bg:AXA.amberBg,co:AXA.amber},grey:{bg:AXA.surface,co:AXA.inkMuted},purple:{bg:AXA.purpleBg,co:AXA.purple},
    ai:{bg:AXA.aiBg,co:AXA.ai},teal:{bg:AXA.tealBg,co:AXA.teal},
    completed:{bg:AXA.greenBg,co:AXA.green},scheduled:{bg:AXA.blueTint,co:AXA.blue},
    in_progress:{bg:AXA.amberBg,co:AXA.amber},draft:{bg:AXA.surface,co:AXA.inkMuted},
    validated:{bg:AXA.greenBg,co:AXA.green},pending:{bg:AXA.amberBg,co:AXA.amber},
    deployed:{bg:AXA.greenBg,co:AXA.green},training:{bg:AXA.amberBg,co:AXA.amber},
    open:{bg:AXA.blueTint,co:AXA.blue},suggested:{bg:AXA.amberBg,co:AXA.amber},
    reviewed:{bg:AXA.purpleBg,co:AXA.purple},human:{bg:AXA.blueTint,co:AXA.blue},
    ai_agent:{bg:AXA.aiBg,co:AXA.ai},high:{bg:AXA.amberBg,co:AXA.amber},
    critical:{bg:AXA.redTint,co:AXA.red},normal:{bg:AXA.greenBg,co:AXA.green},
  };
  const p=P[type]||P.grey;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:small?10:11,fontWeight:600,padding:small?"2px 7px":"3px 10px",borderRadius:20,background:p.bg,color:p.co,whiteSpace:"nowrap"}}>{children}</span>;
};

const statusBadge=s=>{
  const L={completed:"✓ Completed",scheduled:"📅 Scheduled",in_progress:"In Progress",draft:"Draft",validated:"✓ Validated",pending:"Pending",deployed:"● Deployed",training:"⟳ Training",open:"Open",suggested:"Suggested",reviewed:"Reviewed"};
  return <Badge type={s}>{L[s]||s}</Badge>;
};

const Avatar=({name,size=36,type="human"})=>{
  const isAI=type==="ai_agent";
  const bgs=isAI?[AXA.aiBg,AXA.purpleBg]:[AXA.blueTint,AXA.redTint,AXA.greenBg,AXA.amberBg];
  const cos=isAI?[AXA.ai,AXA.purple]:[AXA.blue,AXA.red,AXA.green,AXA.amber];
  const idx=(name||"").charCodeAt(0)%bgs.length;
  return <div style={{width:size,height:size,borderRadius:isAI?"8px":"50%",background:bgs[idx],color:cos[idx],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:700,flexShrink:0,border:isAI?`2px solid ${AXA.ai}33`:"none"}}>{isAI?"🤖":initials(name)}</div>;
};

const SkillBar=({current,target})=>(
  <div style={{position:"relative",height:7}}>
    <div style={{height:7,background:AXA.border,borderRadius:99}}>
      <div style={{height:"100%",width:`${(current/5)*100}%`,background:AXA.blue,borderRadius:99}}/>
    </div>
    {target>0&&<div style={{position:"absolute",top:-2,left:`${(target/5)*100}%`,transform:"translateX(-50%)",width:2,height:11,background:AXA.red,borderRadius:2}}/>}
  </div>
);

const StatCard=({label,value,sub,color,icon})=>(
  <div style={{...card(),padding:"16px 18px",borderTop:`3px solid ${color||AXA.blue}`}}>
    <div style={{fontSize:10,color:AXA.inkMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{icon} {label}</div>
    <div style={{fontSize:26,fontWeight:800,color:AXA.ink,lineHeight:1.1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:AXA.inkMuted,marginTop:2}}>{sub}</div>}
  </div>
);

const Modal=({title,onClose,children,wide})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,80,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(3px)"}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:AXA.card,borderRadius:14,boxShadow:"0 24px 80px rgba(0,0,80,0.25)",padding:30,width:wide?640:500,maxWidth:"calc(100vw - 32px)",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,paddingBottom:14,borderBottom:`2px solid ${AXA.border}`}}>
        <div style={{fontSize:16,fontWeight:800,color:AXA.blue}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:AXA.inkMuted}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const FG=({label,children})=>(
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:11,fontWeight:700,color:AXA.inkMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</label>
    {children}
  </div>
);

// ── AUTH ───────────────────────────────────────────────────────
function AuthPage({onLogin}){
  const [step,setStep]=useState("login");
  const [email,setEmail]=useState("y.benali@axa.com");
  const [role,setRole]=useState("admin");
  const [loading,setLoading]=useState(false);

  const doSSO=()=>{setLoading(true);setTimeout(()=>{setLoading(false);setStep("mfa");},1000);};
  const doMFA=()=>{setLoading(true);setTimeout(()=>onLogin({id:"u1",name:"Yassir Benali",email,role,avatar:"YB",department:"Technology",type:"human"}),700);};

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${AXA.blueDeep} 0%,${AXA.blue} 60%,${AXA.blueMid} 100%)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 15% 50%,rgba(255,255,255,0.04),transparent 50%),radial-gradient(circle at 85% 20%,rgba(201,20,50,0.15),transparent 40%)"}}/>
      <div style={{position:"relative",width:420,background:"rgba(255,255,255,0.97)",borderRadius:16,boxShadow:"0 32px 80px rgba(0,0,80,0.45)",overflow:"hidden"}}>
        <div style={{height:4,background:`linear-gradient(90deg,${AXA.red},${AXA.blue})`}}/>
        <div style={{padding:"36px 36px 32px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:30,fontWeight:900,color:AXA.blue,letterSpacing:4}}>AXA</div>
            <div style={{fontSize:10,color:AXA.inkMuted,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Group Operations</div>
            <div style={{marginTop:14,fontSize:17,fontWeight:700,color:AXA.ink}}>SMART Mobility Platform</div>
            <div style={{fontSize:12,color:AXA.inkMuted,marginTop:3}}>Enterprise Workforce Intelligence · v3.0</div>
          </div>

          {step==="login"&&<>
            <FG label="Corporate Email"><input style={{...INP,fontSize:14,padding:"10px 12px"}} value={email} onChange={e=>setEmail(e.target.value)}/></FG>
            <FG label="Demo role (select for POC)">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {["admin","hr","manager","employee"].map(r=>(
                  <div key={r} onClick={()=>setRole(r)} style={{padding:"8px 10px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"center",
                    background:role===r?AXA.blue:AXA.surface,color:role===r?"#fff":AXA.inkSoft,border:`1.5px solid ${role===r?AXA.blue:AXA.border}`}}>
                    {r.charAt(0).toUpperCase()+r.slice(1)}
                  </div>
                ))}
              </div>
            </FG>
            <button style={{...BTN("primary"),width:"100%",justifyContent:"center",padding:"12px",fontSize:14,marginTop:8}} onClick={doSSO}>
              {loading?"Connecting…":"🔐 Sign in with Azure AD SSO"}
            </button>
            <div style={{marginTop:14,padding:"10px 12px",background:AXA.bluePale,borderRadius:8,fontSize:10,color:AXA.inkSoft,lineHeight:1.6}}>
              SAML 2.0 · Azure AD · RBAC · MFA-ready · TLS 1.3
            </div>
          </>}

          {step==="mfa"&&<>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:36,marginBottom:10}}>📱</div>
              <div style={{fontWeight:700,fontSize:15,color:AXA.ink}}>Multi-Factor Authentication</div>
              <div style={{fontSize:12,color:AXA.inkMuted,marginTop:4}}>Enter the 6-digit code from your authenticator</div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:24}}>
              {[1,2,3,4,5,6].map(i=>(
                <div key={i} style={{width:44,height:52,border:`2px solid ${i<=3?AXA.blue:AXA.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:AXA.blue,background:i<=3?AXA.bluePale:AXA.surface}}>
                  {i<=3?["4","8","2"][i-1]:""}
                </div>
              ))}
            </div>
            <button style={{...BTN("primary"),width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} onClick={doMFA}>
              {loading?"Verifying…":"Verify & Enter"}
            </button>
          </>}
        </div>
        <div style={{background:AXA.surface,borderTop:`1px solid ${AXA.border}`,padding:"10px 36px",display:"flex",justifyContent:"space-between",fontSize:9,color:AXA.inkMuted}}>
          <span>AXA Group Operations</span><span>SAML 2.0 · Secure</span><span>Azure AD Tenant</span>
        </div>
      </div>
    </div>
  );
}

// ── CHARTER ────────────────────────────────────────────────────
function CharterPage(){
  const [expanded,setExpanded]=useState(null);
  const principles=[
    {id:1,icon:"🎯",title:"Skills-First Mobility",color:AXA.blue,  desc:"Internal mobility is driven by competency alignment, not hierarchy. Every role transition is evaluated against a structured skills referential.",rules:["Employees matched to opportunities by validated skill profiles","Skill gaps identified before mobility requests","AI-powered Smart Fit ensures objective, bias-reduced matching"]},
    {id:2,icon:"⏱",title:"3-Year Career Cycle",   color:AXA.green, desc:"Every employee has a mandatory career development interview at least every 3 years. Skills are assessed and action plans created.",rules:["Interviews scheduled automatically and tracked by the platform","Skills assessed and updated each cycle","Action plans with +1Y/+2Y horizons created post-interview"]},
    {id:3,icon:"🤝",title:"Transparency & Fairness",color:AXA.amber,desc:"All mobility decisions follow documented, auditable processes. Employees can view their own status and match scores.",rules:["All workflow steps visible to the employee concerned","AI recommendations are explainable with confidence scores","HR retains final approval authority on all placements"]},
    {id:4,icon:"🤖",title:"Human + AI Collaboration",color:AXA.ai,  desc:"AI agents augment — never replace — human judgment. They handle data processing and matching; humans handle final decisions.",rules:["Human oversight mandatory at all decision points","Agent actions are logged and fully auditable","Employees may request human-only review of any AI recommendation"]},
    {id:5,icon:"📈",title:"Continuous Development", color:AXA.purple,desc:"Mobility is not a one-time event. The platform tracks skill evolution and proactively surfaces upskilling pathways.",rules:["Skill trajectories monitored quarterly","Career paths define clear upskilling requirements","Training enrollment integrated into action plan workflow"]},
    {id:6,icon:"🛡",title:"Anti-Hoarding Policy",   color:AXA.red,   desc:"Managers are accountable for enabling team growth. The platform detects and flags patterns of talent hoarding.",rules:["Managers with >3 years blocked mobility flagged for HR review","Talent Promoter metrics included in manager evaluations","No employee can be blocked from internal opportunities"]},
  ];
  const wfTypes=[
    {type:"Mobility Request",   steps:["Employee applies","Manager reviews","HR validates","AI Smart Fit","Assignment"],duration:"4–6 weeks"},
    {type:"Career Interview",   steps:["Schedule","Prep","Interview","Skills assessment","Action plan"],              duration:"3-year cycle"},
    {type:"Upskilling Plan",    steps:["AI gap analysis","Plan design","Manager approval","Enrollment","Progress"],   duration:"6–18 months"},
    {type:"AI Agent Deployment",steps:["Design","Training","Evaluation","Governance review","Go-live"],              duration:"8–12 weeks"},
  ];
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${AXA.blue} 0%,${AXA.blueMid} 100%)`,borderRadius:12,padding:"28px 32px",color:"#fff",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:180,height:180,background:"rgba(255,255,255,0.04)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:-40,right:80,width:100,height:100,background:"rgba(201,20,50,0.18)",borderRadius:"50%"}}/>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:8}}>AXA Group Operations</div>
        <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>SMART Mobility Charter</div>
        <div style={{fontSize:13,opacity:0.8,maxWidth:600,lineHeight:1.6}}>The foundational framework governing how AXA Group Operations manages internal talent mobility, career development, and workforce intelligence — for humans and AI agents.</div>
        <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
          {["Skills-First","Human + AI","Transparent","Anti-Hoarding","3-Year Cycle"].map(t=><span key={t} style={{background:"rgba(255,255,255,0.14)",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:600,border:"1px solid rgba(255,255,255,0.2)"}}>{t}</span>)}
        </div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>Six Guiding Principles</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
        {principles.map(p=>(
          <div key={p.id} onClick={()=>setExpanded(expanded===p.id?null:p.id)}
            style={{...card({padding:"14px 16px"}),borderLeft:`4px solid ${p.color}`,cursor:"pointer",background:expanded===p.id?`${p.color}08`:AXA.card,transition:"all 0.2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{p.title}</div>
                {expanded!==p.id&&<div style={{fontSize:11,color:AXA.inkMuted,marginTop:1}}>{p.desc.slice(0,55)}…</div>}
              </div>
              <span style={{color:AXA.inkMuted,fontSize:14}}>{expanded===p.id?"▲":"▼"}</span>
            </div>
            {expanded===p.id&&<>
              <div style={{fontSize:12,color:AXA.inkSoft,lineHeight:1.6,marginTop:10,marginBottom:10}}>{p.desc}</div>
              {p.rules.map((r,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,color:AXA.inkSoft,marginBottom:4}}><span style={{color:p.color}}>✓</span>{r}</div>)}
            </>}
          </div>
        ))}
      </div>

      <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>Workflow Typology</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {wfTypes.map((w,wi)=>(
          <div key={wi} style={card({padding:"14px 16px"})}>
            <div style={{fontWeight:700,fontSize:12,color:AXA.blue,marginBottom:10}}>{w.type}</div>
            {w.steps.map((s,si)=>(
              <div key={si} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:AXA.blue,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{si+1}</div>
                <div style={{fontSize:11,color:AXA.inkSoft}}>{s}</div>
              </div>
            ))}
            <div style={{fontSize:10,color:AXA.inkMuted,borderTop:`1px solid ${AXA.border}`,paddingTop:8,marginTop:4}}>⏱ {w.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WORKFLOW ───────────────────────────────────────────────────
function WorkflowEngine({data,user}){
  const [selected,setSelected]=useState(null);
  const ROLE_COLOR={employee:AXA.blue,manager:AXA.amber,hr:AXA.green,ai_agent:AXA.ai};
  const ROLE_ICON={employee:"👤",manager:"👔",hr:"🏢",ai_agent:"🤖"};
  const wf=data.workflows;
  const sel=selected?wf.find(w=>w.id===selected):null;

  return (
    <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:14,height:"calc(100vh - 120px)",maxHeight:680}}>
      <div style={{display:"flex",flexDirection:"column",gap:8,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div style={{fontSize:12,fontWeight:700,color:AXA.blue}}>Active Workflows</div>
          {canDo(user,"write")&&<button style={BTN("sm")}>＋ New</button>}
        </div>
        {wf.map(w=>(
          <div key={w.id} onClick={()=>setSelected(w.id)}
            style={{...card({padding:"12px 14px"}),cursor:"pointer",borderLeft:`4px solid ${ROLE_COLOR[w.steps[w.current_step]?.role]||AXA.border}`,
              background:selected===w.id?AXA.bluePale:AXA.card,transition:"all 0.15s"}}>
            <div style={{fontWeight:600,fontSize:12,marginBottom:6}}>{w.title}</div>
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>{statusBadge(w.status)}<Badge type="grey">{w.type.replace(/_/g," ")}</Badge></div>
            <div style={{display:"flex",gap:3}}>{w.steps.map((s,si)=><div key={si} style={{flex:1,height:4,borderRadius:99,background:s.status==="completed"?AXA.green:s.status==="in_progress"?AXA.amber:AXA.border}}/>)}</div>
            <div style={{fontSize:10,color:AXA.inkMuted,marginTop:5}}>{w.steps.filter(s=>s.status==="completed").length}/{w.steps.length} steps · {fmtDate(w.created_at)}</div>
          </div>
        ))}
      </div>

      <div style={{overflowY:"auto"}}>
        {!sel?<div style={{...card(),textAlign:"center",padding:60,color:AXA.inkMuted}}><div style={{fontSize:32,marginBottom:10}}>⚙</div><div>Select a workflow</div></div>:(
          <div>
            <div style={card({marginBottom:14})}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div><div style={{fontSize:15,fontWeight:800,color:AXA.blue,marginBottom:6}}>{sel.title}</div>
                  <div style={{display:"flex",gap:8}}>{statusBadge(sel.status)}<Badge type="grey">{sel.type.replace(/_/g," ")}</Badge></div>
                </div>
                {sel.target_role&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:AXA.inkMuted}}>Target</div><div style={{fontWeight:700,color:AXA.blue}}>{sel.target_role}</div></div>}
              </div>
              {/* Stepper */}
              <div style={{position:"relative",padding:"20px 0"}}>
                <div style={{position:"absolute",top:42,left:"10%",right:"10%",height:2,background:AXA.border,zIndex:0}}/>
                <div style={{display:"flex",justifyContent:"space-around",position:"relative",zIndex:1}}>
                  {sel.steps.map((s,si)=>{
                    const done=s.status==="completed",active=s.status==="in_progress";
                    const col=done?AXA.green:active?ROLE_COLOR[s.role]:AXA.border;
                    return (
                      <div key={si} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                        <div style={{width:40,height:40,borderRadius:"50%",background:done?AXA.green:active?col:AXA.surface,border:`2px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginBottom:8,color:done?"#fff":active?col:AXA.inkMuted}}>
                          {done?"✓":active?ROLE_ICON[s.role]:si+1}
                        </div>
                        <div style={{fontSize:10,fontWeight:600,color:done?AXA.green:active?col:AXA.inkMuted,textAlign:"center",maxWidth:72,lineHeight:1.3}}>{s.label}</div>
                        <div style={{fontSize:9,color:AXA.inkMuted,marginTop:2}}>{ROLE_ICON[s.role]} {s.role}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {sel.steps.map((s,si)=>(
                <div key={si} style={card({padding:"12px 16px",borderLeft:`4px solid ${s.status==="completed"?AXA.green:s.status==="in_progress"?ROLE_COLOR[s.role]:AXA.border}`,marginBottom:0})}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{ROLE_ICON[s.role]}</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{s.label}</div>
                        <div style={{fontSize:11,color:AXA.inkMuted}}>Role: {s.role}{s.actor?` · ${s.actor}`:""}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {statusBadge(s.status)}
                      {s.status==="in_progress"&&canDo(user,"approve")&&<button style={BTN("sm")}>Approve</button>}
                    </div>
                  </div>
                  {s.notes&&<div style={{marginTop:8,padding:"8px 10px",background:AXA.surface,borderRadius:6,fontSize:12,color:AXA.inkSoft}}>💬 {s.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── WORKFORCE (humans + AI) ────────────────────────────────────
function Workforce({data,user,onSelectEmp}){
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
    return (
      <tr>
        <td style={TD()}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={e.name} size={32} type={e.type}/><div><div style={{fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:AXA.inkMuted}}>{e.email}</div></div></div></td>
        <td style={TD()}><Badge type={e.type}>{e.type==="ai_agent"?"AI Agent":"Human"}</Badge></td>
        <td style={TD()}><Badge type="blue">{e.department}</Badge></td>
        <td style={TD({fontSize:12})}>{e.role}</td>
        <td style={TD({fontSize:12,color:AXA.inkMuted})}>{mgr?.name||"—"}</td>
        <td style={TD()}><Badge type={skCount>0?"green":"grey"}>{skCount} skills</Badge></td>
        <td style={TD()}>{statusBadge(e.status)}</td>
        <td style={TD()}><button style={BTN("sm-ghost")} onClick={()=>onSelectEmp(e.id)}>Profile →</button></td>
      </tr>
    );
  };

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...INP,maxWidth:240}} placeholder="🔍  Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <div style={{display:"flex",gap:6}}>
          {[["all","All"],["human","Humans"],["ai_agent","AI Agents"]].map(([v,l])=>(
            <button key={v} style={v===typeFilter?BTN("sm"):BTN("sm-out")} onClick={()=>setTypeFilter(v)}>{l}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          {canDo(user,"write")&&<button style={BTN("primary")}>＋ Add Employee</button>}
          {canDo(user,"manage_ai")&&<button style={BTN("ai")}>🤖 Deploy Agent</button>}
        </div>
      </div>

      {humans.length>0&&<>
        <div style={{fontSize:11,fontWeight:700,color:AXA.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>👥 Human Employees ({humans.length})</div>
        <div style={{...card(),marginBottom:16}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>Employee</th><th style={TH}>Type</th><th style={TH}>Dept</th><th style={TH}>Role</th><th style={TH}>Manager</th><th style={TH}>Skills</th><th style={TH}>Status</th><th style={TH}></th></tr></thead>
            <tbody>{humans.map(e=><Row key={e.id} e={e}/>)}</tbody>
          </table>
        </div>
      </>}

      {agents.length>0&&<>
        <div style={{fontSize:11,fontWeight:700,color:AXA.inkMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>🤖 AI Agents ({agents.length})</div>
        <div style={{...card(),border:`1px solid ${AXA.ai}33`}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={{...TH,background:AXA.aiBg}}>Agent</th><th style={{...TH,background:AXA.aiBg}}>Type</th><th style={{...TH,background:AXA.aiBg}}>Dept</th><th style={{...TH,background:AXA.aiBg}}>Role</th><th style={{...TH,background:AXA.aiBg}}>Manager</th><th style={{...TH,background:AXA.aiBg}}>Skills</th><th style={{...TH,background:AXA.aiBg}}>Status</th><th style={{...TH,background:AXA.aiBg}}></th></tr></thead>
            <tbody>{agents.map(e=><Row key={e.id} e={e}/>)}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

// ── EMPLOYEE PROFILE ───────────────────────────────────────────
function EmployeeProfile({employeeId,data,onBack}){
  const [tab,setTab]=useState("skills");
  const emp=data.employees.find(e=>e.id===employeeId);
  if(!emp)return <div>Not found</div>;
  const skills=data.employee_skills.filter(s=>s.employee_id===employeeId);
  const interviews=data.interviews.filter(i=>i.employee_id===employeeId);
  const plans=data.action_plans.filter(a=>a.employee_id===employeeId);
  const matches=data.matches.filter(m=>m.employee_id===employeeId);
  const roleMap=data.role_skills.find(r=>r.role===emp.role);
  const isAI=emp.type==="ai_agent";

  return (
    <div>
      <button style={{...BTN("ghost"),marginBottom:12}} onClick={onBack}>← Back</button>
      <div style={{background:isAI?`linear-gradient(135deg,${AXA.ai} 0%,${AXA.purple} 100%)`:`linear-gradient(135deg,${AXA.blue} 0%,${AXA.blueMid} 100%)`,borderRadius:12,padding:24,color:"#fff",marginBottom:16,display:"flex",alignItems:"center",gap:18}}>
        <Avatar name={emp.name} size={56} type={emp.type}/>
        <div>
          <div style={{fontSize:18,fontWeight:800}}>{emp.name}</div>
          <div style={{fontSize:13,opacity:0.8,marginTop:2}}>{emp.role} · {emp.department}</div>
          {isAI&&<div style={{fontSize:12,opacity:0.65,marginTop:2}}>{emp.model} · v{emp.version}</div>}
          <div style={{fontSize:11,opacity:0.6,marginTop:6,display:"flex",gap:16}}>
            <span>📧 {emp.email}</span>
            <span>📅 {fmtDate(emp.hire_date)}</span>
          </div>
        </div>
        <div style={{marginLeft:"auto"}}><Badge type={emp.type}>{emp.type==="ai_agent"?"AI Agent":"Human"}</Badge></div>
      </div>

      <div style={{display:"flex",borderBottom:`2px solid ${AXA.border}`,marginBottom:16}}>
        {[["skills","🎯 Skills"],["gap","📊 Gap vs Role"],["interviews","🎙 Interviews"],["plans","📋 Plans"],["matches","🔄 Mobility"]].map(([id,label])=>(
          <div key={id} onClick={()=>setTab(id)} style={{padding:"9px 14px",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?AXA.blue:AXA.inkMuted,borderBottom:`3px solid ${tab===id?AXA.red:"transparent"}`,marginBottom:-2,cursor:"pointer"}}>{label}</div>
        ))}
      </div>

      {tab==="skills"&&<div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:14}}>Skills Profile</div>
        {skills.length===0?<div style={{textAlign:"center",padding:24,color:AXA.inkMuted}}>No skills assessed yet</div>:
        skills.map(es=>{
          const sk=data.skills_ref.find(s=>s.id===es.skill_id);
          if(!sk)return null;
          const gap=es.target_level-es.current_level;
          return (
            <div key={es.id} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span style={{fontWeight:600}}>{sk.name} <Badge type={sk.category==="AI Capability"?"ai":"blue"}>{sk.category}</Badge></span>
                <span style={{color:AXA.inkMuted,fontFamily:"monospace"}}>{es.current_level}/{es.target_level}</span>
              </div>
              <SkillBar current={es.current_level} target={es.target_level}/>
              <div style={{fontSize:11,color:AXA.inkMuted,marginTop:3}}>{es.validated?"✅ Validated":"⚠️ Pending"} {gap>0?<span style={{color:AXA.red}}> · Gap: {gap}</span>:<span style={{color:AXA.green}}> · ✓ Target reached</span>}</div>
            </div>
          );
        })}
      </div>}

      {tab==="gap"&&<div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:4}}>Gap Analysis vs <span style={{color:AXA.red}}>{emp.role}</span></div>
        {!roleMap?<div style={{padding:20,color:AXA.inkMuted}}>No standard mapping defined for this role.</div>:(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>Skill</th><th style={TH}>Required</th><th style={TH}>Current</th><th style={TH}>Gap</th><th style={TH}>Status</th></tr></thead>
            <tbody>{roleMap.required_skills.map(rs=>{
              const sk=data.skills_ref.find(s=>s.id===rs.skill_id);
              const assessed=skills.find(s=>s.skill_id===rs.skill_id);
              const cur=assessed?.current_level||0;
              const gap=rs.level-cur;
              return (
                <tr key={rs.skill_id}>
                  <td style={TD({fontWeight:600})}>{sk?.name||rs.skill_id}</td>
                  <td style={TD()}><span style={{fontWeight:700,color:AXA.blue}}>{rs.level}/5</span></td>
                  <td style={TD()}>{cur>0?<span style={{fontWeight:700}}>{cur}/5</span>:<span style={{color:AXA.inkMuted}}>Not assessed</span>}</td>
                  <td style={TD()}>{gap>0?<span style={{color:AXA.red,fontWeight:700}}>-{gap}</span>:gap<0?<span style={{color:AXA.green,fontWeight:700}}>+{Math.abs(gap)}</span>:<span style={{color:AXA.green}}>✓</span>}</td>
                  <td style={TD()}>{gap>0?<Badge type="red">Gap</Badge>:gap<0?<Badge type="green">Exceeds</Badge>:<Badge type="completed">Met</Badge>}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>}

      {tab==="interviews"&&<div style={card()}>
        {interviews.length===0?<div style={{textAlign:"center",padding:24,color:AXA.inkMuted}}>No interviews yet</div>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Date</th><th style={TH}>Interviewer</th><th style={TH}>Status</th><th style={TH}>Readiness</th><th style={TH}>Skills</th><th style={TH}>Next Due</th></tr></thead>
          <tbody>{interviews.map(i=><tr key={i.id}>
            <td style={TD({fontFamily:"monospace",fontSize:12})}>{fmtDate(i.scheduled_date)}</td>
            <td style={TD()}>{i.interviewer}</td>
            <td style={TD()}>{statusBadge(i.status)}</td>
            <td style={TD()}>{i.mobility_readiness?<span style={{fontWeight:700,color:AXA.blue}}>{i.mobility_readiness}/5</span>:"—"}</td>
            <td style={TD()}>{i.skills_assessed?<Badge type="completed">✓</Badge>:<Badge type="amber">Pending</Badge>}</td>
            <td style={TD({fontSize:11,fontFamily:"monospace",color:AXA.inkMuted})}>{fmtDate(i.next_interview_due)}</td>
          </tr>)}</tbody>
        </table>}
      </div>}

      {tab==="plans"&&<div style={card()}>
        {plans.length===0?<div style={{textAlign:"center",padding:24,color:AXA.inkMuted}}>No plans yet</div>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Plan</th><th style={TH}>Horizon</th><th style={TH}>Status</th><th style={TH}>Due</th></tr></thead>
          <tbody>{plans.map(a=><tr key={a.id}><td style={TD({fontWeight:600})}>{a.title}</td><td style={TD()}><Badge type="blue">{a.horizon}</Badge></td><td style={TD()}>{statusBadge(a.status)}</td><td style={TD({fontSize:11,fontFamily:"monospace",color:AXA.inkMuted})}>{fmtDate(a.due_date)}</td></tr>)}</tbody>
        </table>}
      </div>}

      {tab==="matches"&&<div>
        {matches.length===0?<div style={{...card(),textAlign:"center",padding:40,color:AXA.inkMuted}}>No matches yet</div>:
        matches.map(m=>(
          <div key={m.id} style={{...card({marginBottom:12}),display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,border:`3px solid ${m.match_score>=85?AXA.green:AXA.amber}`,color:m.match_score>=85?AXA.green:AXA.amber,background:m.match_score>=85?AXA.greenBg:AXA.amberBg}}>{m.match_score}%</div>
              <div><div style={{fontWeight:700,fontSize:14}}>{m.job_title}</div><div style={{fontSize:12,color:AXA.inkMuted}}>📍{m.location}</div></div>
            </div>
            <div style={{display:"flex",gap:8}}><Badge type={m.priority}>{m.priority}</Badge>{statusBadge(m.status)}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ── AI AGENTS ─────────────────────────────────────────────────
function AIAgents({data,user}){
  const [selected,setSelected]=useState(null);
  const [tab,setTab]=useState("overview");
  const agents=data.employees.filter(e=>e.type==="ai_agent");
  const agent=selected?agents.find(a=>a.id===selected):null;
  const LC=["draft","training","deployed","monitoring"];
  const LCC={draft:AXA.inkMuted,training:AXA.amber,deployed:AXA.green,monitoring:AXA.blue};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div><div style={{fontSize:14,fontWeight:700,color:AXA.blue}}>AI Agent Management</div><div style={{fontSize:12,color:AXA.inkMuted}}>Create, manage and monitor AI agents in your workforce</div></div>
        {canDo(user,"manage_ai")&&<button style={BTN("ai")}>🤖 Deploy New Agent</button>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard label="Total Agents" value={agents.length} color={AXA.ai} icon="🤖"/>
        <StatCard label="Deployed"     value={agents.filter(a=>a.lifecycle==="deployed").length} color={AXA.green} icon="●"/>
        <StatCard label="In Training"  value={agents.filter(a=>a.lifecycle==="training").length} color={AXA.amber} icon="⟳"/>
        <StatCard label="Avg Accuracy" value={Math.round(agents.filter(a=>a.accuracy>0).reduce((s,a)=>s+a.accuracy,0)/Math.max(agents.filter(a=>a.accuracy>0).length,1))+"%"} color={AXA.blue} icon="🎯"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {agents.map(a=>(
            <div key={a.id} onClick={()=>{setSelected(a.id);setTab("overview");}}
              style={{...card({padding:"12px 14px"}),cursor:"pointer",borderLeft:`4px solid ${LCC[a.lifecycle]}`,background:selected===a.id?AXA.aiBg:AXA.card,transition:"all 0.15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <Avatar name={a.name} size={34} type="ai_agent"/>
                <div><div style={{fontWeight:700,fontSize:12}}>{a.name}</div><div style={{fontSize:10,color:AXA.inkMuted}}>v{a.version} · {a.model}</div></div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{statusBadge(a.lifecycle)}<Badge type="grey">{a.department}</Badge></div>
              {a.accuracy>0&&<div style={{marginTop:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:AXA.inkMuted,marginBottom:2}}><span>Accuracy</span><span>{a.accuracy}%</span></div><div style={{height:4,background:AXA.border,borderRadius:99}}><div style={{height:"100%",width:`${a.accuracy}%`,background:AXA.ai,borderRadius:99}}/></div></div>}
            </div>
          ))}
        </div>

        <div>
          {!agent?<div style={{...card(),textAlign:"center",padding:60,color:AXA.inkMuted}}><div style={{fontSize:32,marginBottom:10}}>🤖</div><div>Select an agent</div></div>:(
            <div>
              <div style={{background:`linear-gradient(135deg,${AXA.ai},${AXA.purple})`,borderRadius:12,padding:22,color:"#fff",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:56,height:56,borderRadius:12,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🤖</div>
                  <div>
                    <div style={{fontSize:18,fontWeight:800}}>{agent.name}</div>
                    <div style={{opacity:0.8,fontSize:12,marginTop:2}}>{agent.role} · v{agent.version} · {agent.model}</div>
                    <div style={{opacity:0.65,fontSize:11,marginTop:3}}>Managed by: {data.employees.find(e=>e.id===agent.manager)?.name||"—"}</div>
                  </div>
                  <div style={{marginLeft:"auto"}}>{statusBadge(agent.lifecycle)}</div>
                </div>
              </div>

              <div style={{display:"flex",borderBottom:`2px solid ${AXA.border}`,marginBottom:14}}>
                {[["overview","Overview"],["skills","Skills"],["performance","Performance"],["governance","Governance"]].map(([id,l])=>(
                  <div key={id} onClick={()=>setTab(id)} style={{padding:"8px 14px",fontSize:12,fontWeight:tab===id?700:400,color:tab===id?AXA.ai:AXA.inkMuted,borderBottom:`3px solid ${tab===id?AXA.ai:"transparent"}`,marginBottom:-2,cursor:"pointer"}}>{l}</div>
                ))}
              </div>

              {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={card()}>
                  <div style={{fontSize:12,fontWeight:700,color:AXA.blue,marginBottom:10}}>Identity</div>
                  {[["Model",agent.model],["Version","v"+agent.version],["Department",agent.department],["Created",fmtDate(agent.hire_date)]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${AXA.border}`,fontSize:12}}>
                      <span style={{color:AXA.inkMuted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={card()}>
                  <div style={{fontSize:12,fontWeight:700,color:AXA.blue,marginBottom:10}}>Lifecycle</div>
                  {LC.map((l,li)=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:agent.lifecycle===l?LCC[l]:AXA.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:agent.lifecycle===l?"#fff":AXA.inkMuted}}>
                        {LC.indexOf(agent.lifecycle)>=li?"✓":""}
                      </div>
                      <div style={{fontSize:12,fontWeight:agent.lifecycle===l?700:400,color:agent.lifecycle===l?LCC[l]:AXA.inkMuted,textTransform:"capitalize"}}>{l}</div>
                      {agent.lifecycle===l&&<Badge type={l}>Current</Badge>}
                    </div>
                  ))}
                </div>
              </div>}

              {tab==="performance"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"Accuracy",v:agent.accuracy+"%",c:AXA.green},{l:"Daily Requests",v:agent.requests,c:AXA.blue},{l:"Model",v:agent.model,c:AXA.ai},{l:"Version",v:"v"+agent.version,c:AXA.purple}].map(m=>(
                  <div key={m.l} style={{...card({padding:"14px 16px"}),borderTop:`3px solid ${m.c}`}}>
                    <div style={{fontSize:10,color:AXA.inkMuted,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>{m.l}</div>
                    <div style={{fontSize:22,fontWeight:800}}>{m.v||"—"}</div>
                  </div>
                ))}
              </div>}

              {tab==="governance"&&<div style={card()}>
                <div style={{fontSize:12,fontWeight:700,color:AXA.blue,marginBottom:12}}>Governance & Controls</div>
                {[{l:"Human Oversight",v:"Required at all decision points",ok:true},{l:"Audit Logging",v:"All actions logged & traceable",ok:true},{l:"Explainability",v:"High — recommendations include reasoning",ok:true},{l:"Override",v:"Human can override any AI decision",ok:true},{l:"Data Access",v:"Limited to assigned scope",ok:true}].map(g=>(
                  <div key={g.l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${AXA.border}`}}>
                    <span style={{fontSize:13,color:AXA.inkSoft}}>{g.l}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontWeight:600,fontSize:12,color:g.ok?AXA.green:AXA.red}}>{g.v}</span><span>{g.ok?"✅":"⚠️"}</span></div>
                  </div>
                ))}
              </div>}

              {tab==="skills"&&<div style={card()}>
                <div style={{fontSize:12,fontWeight:700,color:AXA.blue,marginBottom:12}}>AI Capabilities</div>
                {data.employee_skills.filter(es=>es.employee_id===agent.id).map(es=>{
                  const sk=data.skills_ref.find(s=>s.id===es.skill_id);
                  if(!sk)return null;
                  return (
                    <div key={es.id} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                        <span style={{fontWeight:600}}>{sk.name} <Badge type="ai">AI Capability</Badge></span>
                        <span style={{color:AXA.inkMuted}}>{es.current_level}/5</span>
                      </div>
                      <SkillBar current={es.current_level} target={es.target_level}/>
                      <div style={{fontSize:11,color:AXA.inkMuted,marginTop:3}}>{es.validated?"✅ Validated":"⚠️ Pending validation"}</div>
                    </div>
                  );
                })}
                {data.employee_skills.filter(es=>es.employee_id===agent.id).length===0&&<div style={{textAlign:"center",padding:20,color:AXA.inkMuted}}>No capabilities assigned yet</div>}
              </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SKILLS REPO ────────────────────────────────────────────────
function SkillsRepo({data,user,onUpdate}){
  const [cat,setCat]=useState("All");
  const [showAdd,setShowAdd]=useState(false);
  const [newSk,setNewSk]=useState({name:"",category:"Technical",applicable_to:["human"]});
  const cats=["All","Technical","Domain","Soft Skills","Strategic","AI Capability"];
  const filtered=cat==="All"?data.skills_ref:data.skills_ref.filter(s=>s.category===cat);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><button key={c} style={c===cat?BTN("sm"):BTN("sm-out")} onClick={()=>setCat(c)}>{c}</button>)}</div>
        {canDo(user,"write")&&<button style={BTN("primary")} onClick={()=>setShowAdd(true)}>＋ New Skill</button>}
      </div>
      <div style={card()}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Skill Name</th><th style={TH}>Category</th><th style={TH}>Applies To</th><th style={TH}>Used by</th><th style={TH}>Validated</th></tr></thead>
          <tbody>{filtered.map(sk=>{
            const usage=data.employee_skills.filter(es=>es.skill_id===sk.id).length;
            const validated=data.employee_skills.filter(es=>es.skill_id===sk.id&&es.validated).length;
            return (
              <tr key={sk.id}>
                <td style={TD({fontWeight:600})}>{sk.name}</td>
                <td style={TD()}><Badge type={sk.category==="AI Capability"?"ai":sk.category==="Technical"?"blue":sk.category==="Domain"?"purple":sk.category==="Soft Skills"?"green":"amber"}>{sk.category}</Badge></td>
                <td style={TD()}><div style={{display:"flex",gap:4}}>{(sk.applicable_to||[]).map(t=><Badge key={t} type={t==="ai_agent"?"ai":"blue"} small>{t==="ai_agent"?"AI":"Human"}</Badge>)}</div></td>
                <td style={TD()}><Badge type={usage>0?"blue":"grey"}>{usage}</Badge></td>
                <td style={TD({fontSize:12})}>{usage>0?`${validated}/${usage}`:"—"}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {showAdd&&<Modal title="📚 Add Skill" onClose={()=>setShowAdd(false)}>
        <FG label="Skill Name"><input style={INP} value={newSk.name} onChange={e=>setNewSk(s=>({...s,name:e.target.value}))} placeholder="e.g. Kubernetes"/></FG>
        <FG label="Category"><select style={INP} value={newSk.category} onChange={e=>setNewSk(s=>({...s,category:e.target.value}))}>{["Technical","Domain","Soft Skills","Strategic","AI Capability"].map(c=><option key={c}>{c}</option>)}</select></FG>
        <FG label="Applicable To"><div style={{display:"flex",gap:12}}>{["human","ai_agent"].map(t=><label key={t} style={{display:"flex",gap:6,cursor:"pointer",fontSize:13}}><input type="checkbox" checked={(newSk.applicable_to||[]).includes(t)} onChange={e=>setNewSk(s=>({...s,applicable_to:e.target.checked?[...s.applicable_to,t]:s.applicable_to.filter(x=>x!==t)}))}/>{t==="ai_agent"?"AI Agents":"Humans"}</label>)}</div></FG>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}><button style={BTN("outline")} onClick={()=>setShowAdd(false)}>Cancel</button><button style={BTN("primary")} onClick={()=>{if(newSk.name){onUpdate("add_skill",newSk);setShowAdd(false);}}}>Add</button></div>
      </Modal>}
    </div>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────
function Analytics({data}){
  const an=data.analytics;
  const months=an.monthly;
  const maxM=Math.max(...months.map(m=>m.matches));

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard label="Avg Skills Coverage" value="71%"  sub="Across all departments" color={AXA.green}  icon="📊"/>
        <StatCard label="Active Gaps"          value="18"   sub="Requiring action"       color={AXA.amber}  icon="⚠️"/>
        <StatCard label="AI Contribution"      value="76%"  sub="3,891 tasks/month"      color={AXA.ai}     icon="🤖"/>
        <StatCard label="Talent Promoter"      value="68"   sub="+12 vs last quarter"    color={AXA.blue}   icon="🌟"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:14}}>📊 Skills Coverage by Department</div>
          {an.skills_coverage.map(d=>(
            <div key={d.department} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span style={{fontWeight:600}}>{d.department}</span>
                <span style={{fontWeight:700,color:d.coverage>=80?AXA.green:d.coverage>=60?AXA.amber:AXA.red}}>{d.coverage}%</span>
              </div>
              <div style={{height:8,background:AXA.border,borderRadius:99}}><div style={{height:"100%",width:`${d.coverage}%`,background:d.coverage>=80?AXA.green:d.coverage>=60?AXA.amber:AXA.red,borderRadius:99}}/></div>
              <div style={{fontSize:10,color:AXA.inkMuted,marginTop:3}}>{d.assessed}/{d.total_skills} skills assessed</div>
            </div>
          ))}
        </div>

        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:4}}>📈 Monthly Mobility Activity</div>
          <div style={{display:"flex",gap:14,marginBottom:12,fontSize:11}}><span style={{color:AXA.blue}}>■ Matches</span><span style={{color:AXA.green}}>■ Placements</span></div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120,paddingTop:8}}>
            {months.map((m,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:9,color:AXA.inkMuted,fontWeight:600}}>{m.matches}</div>
                <div style={{width:"100%",background:AXA.blue,borderRadius:"3px 3px 0 0",height:`${(m.matches/maxM)*90}px`,minHeight:3}}/>
                <div style={{fontSize:9,color:AXA.inkMuted}}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.red,marginBottom:14}}>⚠️ Talent Hoarding Detection</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={TH}>Manager</th><th style={TH}>Dept</th><th style={TH}>Blocked</th><th style={TH}>Avg Tenure</th><th style={TH}>Risk</th></tr></thead>
            <tbody>{an.talent_hoarding.map((h,i)=>(
              <tr key={i}>
                <td style={TD({fontWeight:600,fontSize:12})}>{h.manager}</td>
                <td style={TD()}><Badge type="blue" small>{h.dept}</Badge></td>
                <td style={TD({textAlign:"center",fontWeight:700,color:h.employees_blocked>0?AXA.red:AXA.green})}>{h.employees_blocked}</td>
                <td style={TD({fontSize:12})}>{h.avg_tenure}y</td>
                <td style={TD()}><Badge type={h.risk==="high"?"red":"green"}>{h.risk}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:14}}>🤖 AI vs Human Contribution</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[{l:"Human Tasks",v:an.ai_vs_human.human_tasks,c:AXA.blue},{l:"AI Tasks",v:an.ai_vs_human.ai_tasks,c:AXA.ai},{l:"AI Accuracy",v:an.ai_vs_human.ai_accuracy+"%",c:AXA.green}].map(m=>(
              <div key={m.l} style={{padding:"10px 12px",background:AXA.surface,borderRadius:8,borderLeft:`3px solid ${m.c}`}}>
                <div style={{fontSize:10,color:AXA.inkMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>{m.l}</div>
                <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",height:10,borderRadius:99,overflow:"hidden"}}>
            <div style={{background:AXA.blue,width:`${Math.round(an.ai_vs_human.human_tasks/(an.ai_vs_human.human_tasks+an.ai_vs_human.ai_tasks)*100)}%`}}/>
            <div style={{background:AXA.ai,flex:1}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:AXA.inkMuted,marginTop:4}}>
            <span>Human {Math.round(an.ai_vs_human.human_tasks/(an.ai_vs_human.human_tasks+an.ai_vs_human.ai_tasks)*100)}%</span>
            <span>AI {Math.round(an.ai_vs_human.ai_tasks/(an.ai_vs_human.human_tasks+an.ai_vs_human.ai_tasks)*100)}%</span>
          </div>
        </div>
      </div>

      <div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:14}}>🌟 Talent Promoter Metrics</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Employee</th><th style={TH}>Manager</th><th style={TH}>Match Score</th><th style={TH}>Readiness</th><th style={TH}>Status</th></tr></thead>
          <tbody>{an.promoter_metrics.map((p,i)=>(
            <tr key={i}>
              <td style={TD({fontWeight:600})}>{p.name}</td>
              <td style={TD({fontSize:12,color:AXA.inkMuted})}>{p.manager}</td>
              <td style={TD()}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{height:6,width:80,background:AXA.border,borderRadius:99}}><div style={{height:"100%",width:`${p.mobility_score}%`,background:p.mobility_score>=85?AXA.green:AXA.amber,borderRadius:99}}/></div><span style={{fontWeight:700,fontSize:12}}>{p.mobility_score}%</span></div></td>
              <td style={TD()}><span style={{fontWeight:700,color:AXA.blue}}>{p.readiness}/5</span></td>
              <td style={TD()}>{p.recommended?<Badge type="green">✓ Recommended</Badge>:<Badge type="grey">Not yet</Badge>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({data,user}){
  const humans=data.employees.filter(e=>e.type==="human");
  const agents=data.employees.filter(e=>e.type==="ai_agent");
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${AXA.blue} 0%,${AXA.blueMid} 100%)`,borderRadius:12,padding:"22px 28px",color:"#fff",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:10,opacity:0.55,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Welcome back</div>
          <div style={{fontSize:19,fontWeight:800}}>{user.name}</div>
          <div style={{fontSize:12,opacity:0.7,marginTop:2}}>{user.role.charAt(0).toUpperCase()+user.role.slice(1)} · {user.department}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,opacity:0.55}}>Today</div>
          <div style={{fontSize:12,fontWeight:600}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        <StatCard label="Human Employees"  value={humans.length}                              sub="Active profiles"    color={AXA.blue}   icon="👥"/>
        <StatCard label="AI Agents"         value={agents.filter(e=>e.status==="active").length} sub={`${agents.length} total`} color={AXA.ai} icon="🤖"/>
        <StatCard label="Active Workflows"  value={data.workflows.filter(w=>["draft","in_progress"].includes(w.status)).length} sub="Requires attention" color={AXA.amber} icon="⚙️"/>
        <StatCard label="Pending Matches"   value={data.matches.filter(m=>m.status==="suggested").length} sub="Awaiting review" color={AXA.red} icon="🔄"/>
        <StatCard label="Interviews Scheduled" value={data.interviews.filter(i=>i.status==="scheduled").length} sub="Upcoming" color={AXA.green} icon="📅"/>
        <StatCard label="Skills Assessed"   value={data.employee_skills.length}              sub="Total"              color={AXA.purple}  icon="🎯"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>⚙️ Active Workflows</div>
          {data.workflows.map(w=>(
            <div key={w.id} style={{padding:"10px 0",borderBottom:`1px solid ${AXA.border}`,display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{w.employee_name}</div><div style={{fontSize:11,color:AXA.inkMuted}}>{w.type.replace(/_/g," ")}</div></div>
              <div style={{flex:1}}><div style={{display:"flex",gap:3}}>{w.steps.map((s,si)=><div key={si} style={{flex:1,height:4,borderRadius:99,background:s.status==="completed"?AXA.green:s.status==="in_progress"?AXA.amber:AXA.border}}/>)}</div><div style={{fontSize:10,color:AXA.inkMuted,marginTop:3}}>{w.steps.filter(s=>s.status==="completed").length}/{w.steps.length} steps</div></div>
              {statusBadge(w.status)}
            </div>
          ))}
        </div>

        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>🤖 AI Agents Status</div>
          {agents.map(a=>(
            <div key={a.id} style={{padding:"10px 0",borderBottom:`1px solid ${AXA.border}`,display:"flex",alignItems:"center",gap:10}}>
              <Avatar name={a.name} size={30} type="ai_agent"/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{a.name}</div><div style={{fontSize:10,color:AXA.inkMuted}}>{a.role}</div></div>
              <div style={{textAlign:"right"}}>{statusBadge(a.lifecycle)}{a.accuracy>0&&<div style={{fontSize:9,color:AXA.inkMuted,marginTop:2}}>{a.accuracy}% acc.</div>}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>🔄 Top Mobility Matches (AI-Scored)</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th style={TH}>Score</th><th style={TH}>Employee</th><th style={TH}>Target Role</th><th style={TH}>Location</th><th style={TH}>AI Agent</th><th style={TH}>Status</th></tr></thead>
          <tbody>{[...data.matches].sort((a,b)=>b.match_score-a.match_score).map(m=>{
            const agent=data.employees.find(e=>e.id===m.scored_by);
            const pct=m.match_score;
            return (
              <tr key={m.id}>
                <td style={TD()}><div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:40,height:40,borderRadius:"50%",fontSize:12,fontWeight:700,border:`3px solid ${pct>=85?AXA.green:AXA.amber}`,color:pct>=85?AXA.green:AXA.amber,background:pct>=85?AXA.greenBg:AXA.amberBg}}>{pct}%</div></td>
                <td style={TD({fontWeight:600})}>{m.employee_name}</td>
                <td style={TD()}>{m.job_title}</td>
                <td style={TD({fontSize:12,color:AXA.inkMuted})}>📍{m.location}</td>
                <td style={TD()}>{agent&&<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>🤖</span><span style={{fontSize:11}}>{agent.name}</span></div>}</td>
                <td style={TD()}>{statusBadge(m.status)}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── NAV ────────────────────────────────────────────────────────
const NAV=[
  {id:"charter",   label:"SMART Charter",      sec:"Overview",          icon:"📜",highlight:true},
  {id:"dashboard", label:"Dashboard",          sec:"Overview",          icon:"◼"},
  {id:"workflows", label:"Workflow Engine",    sec:"Mobility",          icon:"⚙"},
  {id:"workforce", label:"Workforce",          sec:"Mobility",          icon:"👥"},
  {id:"interviews",label:"Career Interviews",  sec:"Mobility",          icon:"🎙"},
  {id:"matches",   label:"Mobility Matches",   sec:"Mobility",          icon:"🔄"},
  {id:"ai-agents", label:"AI Agent Mgmt",      sec:"AI & Intelligence", icon:"🤖",aiOnly:true},
  {id:"skills-ref",label:"Skills Repository",  sec:"AI & Intelligence", icon:"📚"},
  {id:"analytics", label:"Analytics",          sec:"Reporting",         icon:"📊"},
];
const PAGE_TITLES=Object.fromEntries(NAV.map(n=>[n.id,n.label]));

// ── APP ────────────────────────────────────────────────────────
export default function App(){
  const [authed,setAuthed]=useState(false);
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("charter");
  const [selectedEmp,setSelectedEmp]=useState(null);
  const [data,setData]=useState(SEED);

  const onLogin=u=>{setUser(u);setAuthed(true);};
  const onUpdate=(action,payload)=>{
    if(action==="add_skill") setData(d=>({...d,skills_ref:[...d.skills_ref,{id:"sk"+uid(),...payload}]}));
  };

  if(!authed) return <AuthPage onLogin={onLogin}/>;

  const sections=[...new Set(NAV.map(n=>n.sec))];
  const pendingMatches=data.matches.filter(m=>m.status==="suggested").length;

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',Arial,sans-serif",background:AXA.surface,color:AXA.ink,overflow:"hidden"}}>
      <aside style={{width:225,minWidth:225,background:AXA.blue,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:AXA.blueDeep,borderBottom:`2px solid ${AXA.red}`,padding:"13px 15px 11px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:4}}>AXA</div>
            <div style={{borderLeft:"1.5px solid rgba(255,255,255,0.2)",paddingLeft:10}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Group Operations</div>
              <div style={{fontSize:11,fontWeight:700,color:"#fff",marginTop:1}}>SMART Mobility v3</div>
            </div>
          </div>
        </div>

        <div style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{user?.avatar||initials(user?.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{user?.role}</div>
          </div>
        </div>

        <nav style={{flex:1,padding:"6px 5px",overflowY:"auto"}}>
          {sections.map(sec=>(
            <div key={sec}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",padding:"12px 11px 4px"}}>{sec}</div>
              {NAV.filter(n=>n.sec===sec).map(n=>{
                if(n.aiOnly&&!canDo(user,"manage_ai"))return null;
                const active=page===n.id&&!selectedEmp;
                const badge=n.id==="matches"&&pendingMatches>0;
                return (
                  <div key={n.id} onClick={()=>{setPage(n.id);setSelectedEmp(null);}}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"7px 11px",borderRadius:5,cursor:"pointer",marginBottom:1,
                      color:active?"#fff":"rgba(255,255,255,0.6)",fontWeight:active?700:400,fontSize:12,
                      background:active?(n.highlight?"rgba(201,20,50,0.3)":"rgba(255,255,255,0.15)"):"transparent",
                      borderLeft:active?`3px solid ${n.highlight?AXA.red:"#fff"}`:"3px solid transparent",transition:"all 0.15s"}}>
                    <span style={{fontSize:13,flexShrink:0}}>{n.icon}</span>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.label}</span>
                    {badge&&<span style={{background:AXA.red,color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8}}>{pendingMatches}</span>}
                    {n.highlight&&!active&&<span style={{width:6,height:6,borderRadius:"50%",background:AXA.red,flexShrink:0}}/>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.3)"}}>
          <span>Mobility by Design</span><span>v3.0 · POC</span>
        </div>
      </aside>

      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:AXA.card,borderBottom:`1px solid ${AXA.border}`,padding:"0 22px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,borderTop:`3px solid ${AXA.red}`}}>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:AXA.blue}}>{selectedEmp?"Employee Profile":PAGE_TITLES[page]}</div>
            <div style={{fontSize:10,color:AXA.inkMuted}}>AXA Group Operations · Career Interview Management · RBAC: <b>{user?.role}</b></div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,color:AXA.inkMuted}}>Permissions: <b style={{color:AXA.blue}}>{RBAC[user?.role]?.slice(0,3).join(", ")}…</b></span>
            <button style={BTN("sm-ghost")} onClick={()=>{setAuthed(false);setUser(null);}}>Sign out</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
          {page==="charter"   &&!selectedEmp&&<CharterPage/>}
          {page==="dashboard" &&!selectedEmp&&<Dashboard data={data} user={user}/>}
          {page==="workflows" &&!selectedEmp&&<WorkflowEngine data={data} user={user}/>}
          {page==="workforce" &&!selectedEmp&&<Workforce data={data} user={user} onSelectEmp={id=>{setSelectedEmp(id);setPage("workforce");}}/>}
          {page==="workforce" && selectedEmp&&<EmployeeProfile employeeId={selectedEmp} data={data} onBack={()=>setSelectedEmp(null)}/>}
          {page==="interviews"&&!selectedEmp&&(
            <div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>{canDo(user,"write")&&<button style={BTN("primary")}>＋ Schedule Interview</button>}</div>
              <div style={card()}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr><th style={TH}>Employee</th><th style={TH}>Dept</th><th style={TH}>Interviewer</th><th style={TH}>Date</th><th style={TH}>Status</th><th style={TH}>Readiness</th><th style={TH}>Skills</th><th style={TH}>Next Due</th></tr></thead>
                  <tbody>{data.interviews.map(i=>(
                    <tr key={i.id}>
                      <td style={TD({fontWeight:600})}>{i.employee_name}</td>
                      <td style={TD()}><Badge type="blue">{i.department}</Badge></td>
                      <td style={TD({fontSize:12})}>{i.interviewer}</td>
                      <td style={TD({fontSize:12,fontFamily:"monospace",color:AXA.inkMuted})}>{fmtDate(i.scheduled_date)}</td>
                      <td style={TD()}>{statusBadge(i.status)}</td>
                      <td style={TD()}>{i.mobility_readiness?<span style={{fontWeight:700,color:AXA.blue}}>{i.mobility_readiness}/5</span>:"—"}</td>
                      <td style={TD()}>{i.skills_assessed?<Badge type="completed">✓</Badge>:<Badge type="amber">Pending</Badge>}</td>
                      <td style={TD({fontSize:11,fontFamily:"monospace",color:AXA.inkMuted})}>{fmtDate(i.next_interview_due)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          {page==="matches"   &&!selectedEmp&&(
            <div style={card()}>
              <div style={{fontSize:13,fontWeight:700,color:AXA.blue,marginBottom:12}}>🔄 Mobility Matches — Smart Fit Engine</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr><th style={TH}>Score</th><th style={TH}>Employee</th><th style={TH}>Dept</th><th style={TH}>Target Role</th><th style={TH}>Location</th><th style={TH}>Priority</th><th style={TH}>AI Agent</th><th style={TH}>Status</th></tr></thead>
                <tbody>{[...data.matches].sort((a,b)=>b.match_score-a.match_score).map(m=>{
                  const agent=data.employees.find(e=>e.id===m.scored_by);
                  const pct=m.match_score;
                  return (
                    <tr key={m.id}>
                      <td style={TD()}><div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:"50%",fontSize:12,fontWeight:700,border:`3px solid ${pct>=85?AXA.green:AXA.amber}`,color:pct>=85?AXA.green:AXA.amber,background:pct>=85?AXA.greenBg:AXA.amberBg}}>{pct}%</div></td>
                      <td style={TD({fontWeight:600})}>{m.employee_name}</td>
                      <td style={TD()}><Badge type="blue">{m.employee_dept}</Badge></td>
                      <td style={TD()}>{m.job_title}</td>
                      <td style={TD({fontSize:12,color:AXA.inkMuted})}>📍{m.location}</td>
                      <td style={TD()}><Badge type={m.priority}>{m.priority}</Badge></td>
                      <td style={TD()}>{agent&&<div style={{display:"flex",alignItems:"center",gap:6}}><span>🤖</span><span style={{fontSize:11}}>{agent.name}</span></div>}</td>
                      <td style={TD()}>{statusBadge(m.status)}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
          {page==="ai-agents" &&!selectedEmp&&<AIAgents data={data} user={user}/>}
          {page==="skills-ref"&&!selectedEmp&&<SkillsRepo data={data} user={user} onUpdate={onUpdate}/>}
          {page==="analytics" &&!selectedEmp&&<Analytics data={data}/>}
        </div>
      </main>
    </div>
  );
}
