import React, { useState, useEffect, useRef } from "react";

// ── Olympic Animated Background ───────────────────────────────────────────────
const RING_COLORS = ["#0085C7","#F4C300","#009F3D","#DF0024","#000000"];
function OlympicBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);
  const rings = useRef([]);
  const embers = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; initRings(); };
    const initRings = () => {
      const W = canvas.width, H = canvas.height;
      rings.current = RING_COLORS.map((color, i) => ({ x:W*0.12+(i%3)*W*0.29, y:i<3?H*0.3:H*0.45, r:Math.min(W,H)*0.085, color, alpha:0.06+Math.random()*0.04, pulse:Math.random()*Math.PI*2, pulseSpeed:0.007+Math.random()*0.006 }));
    };
    const spawnParticle = () => {
      const W=canvas.width, H=canvas.height, gold=["#FFD700","#FFC200","#FFEA70","#FFB300","#FFF0A0"];
      particles.current.push({ x:Math.random()*W, y:H+10, vx:(Math.random()-0.5)*0.6, vy:-(0.4+Math.random()*1.2), size:1+Math.random()*2.5, alpha:0.6+Math.random()*0.4, decay:0.003+Math.random()*0.005, color:gold[Math.floor(Math.random()*gold.length)], twinkle:Math.random()*Math.PI*2, twinkleSpeed:0.04+Math.random()*0.08 });
    };
    const spawnEmber = () => {
      embers.current.push({ x:Math.random()*canvas.width, y:canvas.height+5, vx:(Math.random()-0.5)*1.5, vy:-(1.5+Math.random()*3), len:8+Math.random()*20, alpha:0.3+Math.random()*0.5, decay:0.008+Math.random()*0.012, hue:30+Math.random()*30 });
    };
    let frame = 0;
    const draw = () => {
      const W=canvas.width, H=canvas.height; ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,"#050508"); bg.addColorStop(0.4,"#0a0800"); bg.addColorStop(1,"#110900"); ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      const glow=ctx.createRadialGradient(W/2,H*0.85,0,W/2,H*0.85,W*0.7); glow.addColorStop(0,"rgba(200,140,0,0.12)"); glow.addColorStop(0.5,"rgba(180,100,0,0.05)"); glow.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=glow; ctx.fillRect(0,0,W,H);
      rings.current.forEach(ring => {
        ring.pulse+=ring.pulseSpeed; const a=ring.alpha+Math.sin(ring.pulse)*0.025;
        ctx.beginPath(); ctx.arc(ring.x,ring.y,ring.r,0,Math.PI*2); ctx.strokeStyle=ring.color+Math.round(a*255).toString(16).padStart(2,"0"); ctx.lineWidth=2.5; ctx.stroke();
        const rg=ctx.createRadialGradient(ring.x,ring.y,ring.r*0.7,ring.x,ring.y,ring.r*1.1); rg.addColorStop(0,"rgba(0,0,0,0)"); rg.addColorStop(0.6,ring.color+"08"); rg.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(ring.x,ring.y,ring.r*1.2,0,Math.PI*2); ctx.fill();
      });
      if(frame%3===0) spawnParticle();
      particles.current=particles.current.filter(p=>p.alpha>0.01);
      particles.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.alpha-=p.decay; p.twinkle+=p.twinkleSpeed;
        const ta=p.alpha*(0.7+0.3*Math.sin(p.twinkle));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=p.color+Math.round(ta*255).toString(16).padStart(2,"0"); ctx.fill();
        if(p.size>1.8){ ctx.strokeStyle="#FFD700"+Math.round(ta*0.5*255).toString(16).padStart(2,"0"); ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(p.x-p.size*1.8,p.y); ctx.lineTo(p.x+p.size*1.8,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y-p.size*1.8); ctx.lineTo(p.x,p.y+p.size*1.8); ctx.stroke(); }
      });
      if(frame%8===0) spawnEmber();
      embers.current=embers.current.filter(e=>e.alpha>0.01);
      embers.current.forEach(e => {
        e.x+=e.vx; e.y+=e.vy; e.alpha-=e.decay; e.vx+=(Math.random()-0.5)*0.05;
        const grad=ctx.createLinearGradient(e.x,e.y,e.x-e.vx*e.len*0.5,e.y-e.vy*e.len*0.5); grad.addColorStop(0,`hsla(${e.hue},100%,65%,${e.alpha})`); grad.addColorStop(1,`hsla(${e.hue+20},100%,80%,0)`);
        ctx.beginPath(); ctx.moveTo(e.x,e.y); ctx.lineTo(e.x-e.vx*e.len*0.5,e.y-e.vy*e.len*0.5); ctx.strokeStyle=grad; ctx.lineWidth=1; ctx.stroke();
      });
      frame++; animRef.current=requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize",resize); draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EMOJIS=["🏃","💪","🧘","🚴","🏊","📚","🎓","✍️","🎯","💰","💳","🏠","🎨","🎸","🌱","✈️","🍎","😴","🧠","⚽"];
const CATEGORIES=[
  {id:"fitness", label:"Fitness", color:"#FF6B6B",icon:"💪"},
  {id:"learning",label:"Learning",color:"#4ECDC4",icon:"📚"},
  {id:"finance", label:"Finance", color:"#FFE66D",icon:"💰"},
  {id:"wellness",label:"Wellness",color:"#A8E6CF",icon:"🧘"},
  {id:"creative",label:"Creative",color:"#FF9FF3",icon:"🎨"},
  {id:"other",   label:"Other",   color:"#C084FC",icon:"⭐"},
];
const FREQUENCIES=[
  {id:"daily",   label:"Daily",    desc:"Every day"},
  {id:"weekly",  label:"Weekly",   desc:"Once a week"},
  {id:"biweekly",label:"Bi-Weekly",desc:"Twice a week"},
  {id:"lifetime",label:"Lifetime", desc:"One-time goal"},
];
const CAT_COLORS={
  fitness: {bg:"#FF6B6B22",border:"#FF6B6B",accent:"#FF6B6B"},
  learning:{bg:"#4ECDC422",border:"#4ECDC4",accent:"#4ECDC4"},
  finance: {bg:"#FFE66D22",border:"#FFE66D",accent:"#FFE66D"},
  wellness:{bg:"#A8E6CF22",border:"#A8E6CF",accent:"#A8E6CF"},
  creative:{bg:"#FF9FF322",border:"#FF9FF3",accent:"#FF9FF3"},
  other:   {bg:"#C084FC22",border:"#C084FC",accent:"#C084FC"},
};
const FREQ_LABELS={daily:"Daily",weekly:"Weekly",biweekly:"Bi-Weekly",lifetime:"Lifetime"};
const XP_PER_CHECKIN={daily:10,weekly:50,biweekly:25,lifetime:100};
const STREAK_MULTIPLIERS=[[0,1],[3,1.25],[7,1.5],[14,2],[30,3]];
const GROUP_BONUSES=[
  {id:"all_daily", label:"Crew Sync 🔥",     desc:"Everyone checks in today",       xp:25,icon:"🔥"},
  {id:"milestone", label:"Milestone Party 🎉",desc:"Any member hits a milestone",    xp:15,icon:"🎉"},
  {id:"streak_7",  label:"Week Warriors ⚡",  desc:"All members hit 7-day streaks",  xp:50,icon:"⚡"},
];
const GOLD="#FFD700",GOLD2="#FFC200",GOLD_DIM="#A07800";
const GLASS="rgba(10,8,4,0.72)",GLASS_BORDER="rgba(200,160,0,0.18)";

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_PROFILES=[
  { id:"p1",name:"Jordan",avatar:"JO",color:"#C084FC",pin:"1234",xp:955,streak:5,
    goals:[
      {id:1,title:"Run a 5K",emoji:"🏃",progress:68,xp:340,streak:5,category:"fitness",daysLeft:12,frequency:"daily",milestones:["First run ✓","Week 2 ✓","Race day"],mileStoneIdx:2,checkedToday:false,lastCheckin:null},
      {id:2,title:"Read 12 Books",emoji:"📚",progress:41,xp:205,streak:3,category:"learning",daysLeft:45,frequency:"weekly",milestones:["3 books ✓","6 books ✓","9 books","12 books"],mileStoneIdx:2,checkedToday:false,lastCheckin:null},
      {id:3,title:"Save $5,000",emoji:"💰",progress:82,xp:410,streak:14,category:"finance",daysLeft:7,frequency:"lifetime",milestones:["$1k ✓","$2.5k ✓","$4k ✓","$5k"],mileStoneIdx:3,checkedToday:false,lastCheckin:null},
    ]},
  { id:"p2",name:"Maya",avatar:"MA",color:"#FF6B6B",pin:"2222",xp:4200,streak:8,
    goals:[
      {id:10,title:"Morning Yoga",emoji:"🧘",progress:55,xp:275,streak:8,category:"wellness",daysLeft:20,frequency:"daily",milestones:["1 week ✓","2 weeks","1 month"],mileStoneIdx:1,checkedToday:false,lastCheckin:null},
      {id:11,title:"Learn Spanish",emoji:"🎓",progress:30,xp:150,streak:4,category:"learning",daysLeft:60,frequency:"daily",milestones:["A1 ✓","A2","B1"],mileStoneIdx:1,checkedToday:false,lastCheckin:null},
    ]},
  { id:"p3",name:"Devlin",avatar:"DE",color:"#4ECDC4",pin:"3333",xp:3100,streak:3,
    goals:[
      {id:20,title:"Build a Habit",emoji:"💪",progress:20,xp:100,streak:3,category:"fitness",daysLeft:30,frequency:"daily",milestones:["1 week","2 weeks","1 month"],mileStoneIdx:0,checkedToday:false,lastCheckin:null},
    ]},
  { id:"p4",name:"Priya",avatar:"PR",color:"#FFE66D",pin:"4444",xp:5800,streak:21,
    goals:[
      {id:30,title:"Paint 10 canvases",emoji:"🎨",progress:70,xp:350,streak:21,category:"creative",daysLeft:14,frequency:"weekly",milestones:["3 ✓","6 ✓","10"],mileStoneIdx:2,checkedToday:true,lastCheckin:new Date().toISOString()},
    ]},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getLevel=xp=>Math.floor(xp/500)+1;
const getStreakMult=streak=>{let m=1;for(const[min,v]of STREAK_MULTIPLIERS)if(streak>=min)m=v;return m;};
const getMsThresholds=count=>Array.from({length:count},(_,i)=>Math.round(((i+1)/count)*100));

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({toasts}){
  return(
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:200,display:"flex",flexDirection:"column",gap:8,maxWidth:360,width:"90%",pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} className="toast-in" style={{background:t.group?"linear-gradient(135deg,rgba(255,180,0,0.97),rgba(220,120,0,0.97))":"rgba(8,18,8,0.97)",border:`1px solid ${t.group?GOLD:"#4ade80"}`,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
          <span style={{fontSize:22}}>{t.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:t.group?"#000":"#fff"}}>{t.title}</div>
            <div style={{fontSize:11,color:t.group?"#5a2800":"#86efac",marginTop:2}}>{t.msg}</div>
          </div>
          {t.xp&&<div style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"4px 8px",fontSize:12,fontWeight:800,color:t.group?"#000":"#fff"}}>+{t.xp} XP</div>}
        </div>
      ))}
    </div>
  );
}

// ── Level Up Overlay ──────────────────────────────────────────────────────────
function LevelUpOverlay({level,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div className="levelup-pop" style={{textAlign:"center"}}>
        <div style={{fontSize:72,lineHeight:1,marginBottom:12}}>⚡</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,letterSpacing:4,background:`linear-gradient(135deg,${GOLD},#FFF0A0,${GOLD2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 20px rgba(255,200,0,0.6))"}}>LEVEL UP!</div>
        <div style={{fontSize:28,fontWeight:800,color:"#fff",marginTop:8}}>You're now Level {level}</div>
        <div style={{fontSize:14,color:"#aaa",marginTop:8}}>Your crew has been notified 🎉</div>
      </div>
    </div>
  );
}

// ── PIN Pad ───────────────────────────────────────────────────────────────────
function PinPad({profile,onSuccess,onCancel}){
  const [input,setInput]=useState("");
  const [shake,setShake]=useState(false);

  const press=d=>{
    if(input.length>=4)return;
    const next=input+d;
    setInput(next);
    if(next.length===4){
      if(next===profile.pin){setTimeout(onSuccess,180);}
      else{setTimeout(()=>{setShake(true);setInput("");setTimeout(()=>setShake(false),500);},200);}
    }
  };
  const dots=Array.from({length:4},(_,i)=>i<input.length);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)"}}>
      <div style={{background:"rgba(12,9,2,0.96)",border:`1px solid ${profile.color}44`,borderRadius:28,padding:"32px 28px",width:300,textAlign:"center",backdropFilter:"blur(20px)"}}>
        <div style={{width:60,height:60,borderRadius:18,background:profile.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#000",margin:"0 auto 12px",boxShadow:`0 0 20px ${profile.color}55`}}>{profile.avatar}</div>
        <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{profile.name}</div>
        <div style={{fontSize:12,color:"#666",marginBottom:28}}>Enter your PIN to continue</div>
        {/* Dots */}
        <div className={shake?"shake":""} style={{display:"flex",justifyContent:"center",gap:16,marginBottom:32}}>
          {dots.map((filled,i)=>(
            <div key={i} style={{width:14,height:14,borderRadius:"50%",background:filled?profile.color:"transparent",border:`2px solid ${filled?profile.color:"#444"}`,transition:"all 0.15s",boxShadow:filled?`0 0 8px ${profile.color}88`:"none"}}/>
          ))}
        </div>
        {/* Numpad */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>press(String(n))} className="pin-btn" style={{padding:"15px 0",borderRadius:14,border:`1px solid ${GLASS_BORDER}`,background:"rgba(255,200,0,0.05)",color:"#fff",fontSize:20,fontWeight:700,cursor:"pointer",transition:"all 0.1s",fontFamily:"inherit"}}>{n}</button>
          ))}
          <div/>
          <button onClick={()=>press("0")} className="pin-btn" style={{padding:"15px 0",borderRadius:14,border:`1px solid ${GLASS_BORDER}`,background:"rgba(255,200,0,0.05)",color:"#fff",fontSize:20,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>0</button>
          <button onClick={()=>setInput(i=>i.slice(0,-1))} style={{padding:"15px 0",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",background:"transparent",color:"#666",fontSize:18,cursor:"pointer",fontFamily:"inherit"}}>⌫</button>
        </div>
        <div style={{fontSize:11,color:"#444",marginBottom:16}}>Demo hint: PIN is <span style={{color:profile.color,fontWeight:700}}>{profile.pin}</span></div>
        <button onClick={onCancel} style={{background:"transparent",border:"none",color:"#555",fontSize:13,cursor:"pointer",fontFamily:"inherit",padding:"8px 16px"}}>← Back to profiles</button>
      </div>
    </div>
  );
}

// ── Profile Switcher Screen ───────────────────────────────────────────────────
function ProfileSwitcher({profiles,onSelect}){
  return(
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,zIndex:1}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,letterSpacing:8,background:`linear-gradient(135deg,${GOLD},#FFF0A0,${GOLD2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4,filter:"drop-shadow(0 0 16px rgba(255,200,0,0.5))"}}>QUEST</div>
      <div style={{fontSize:12,color:GOLD_DIM,letterSpacing:3,textTransform:"uppercase",marginBottom:52}}>Who's playing today?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,width:"100%",maxWidth:380}}>
        {profiles.map(p=>{
          const lv=getLevel(p.xp), pct=((p.xp%500)/500)*100;
          return(
            <button key={p.id} onClick={()=>onSelect(p)} className="profile-card" style={{background:"rgba(12,9,2,0.78)",border:`1px solid ${p.color}33`,borderRadius:22,padding:"22px 16px",textAlign:"center",cursor:"pointer",backdropFilter:"blur(14px)",transition:"all 0.22s",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:56,height:56,borderRadius:18,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#000",marginBottom:10,boxShadow:`0 0 18px ${p.color}44`}}>{p.avatar}</div>
              <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:11,color:p.color,fontWeight:700,marginBottom:10}}>LVL {lv} · {p.xp} XP</div>
              <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:10,overflow:"hidden",width:"100%",marginBottom:8}}>
                <div style={{height:"100%",width:`${pct}%`,background:p.color,borderRadius:10}}/>
              </div>
              <div style={{fontSize:11,color:"#555"}}>🔥 {p.streak}-day streak</div>
            </button>
          );
        })}
        <button onClick={()=>onSelect("new")} style={{background:"rgba(255,200,0,0.03)",border:`1px dashed rgba(200,160,0,0.2)`,borderRadius:22,padding:"22px 16px",textAlign:"center",cursor:"pointer",color:"#555",fontFamily:"inherit",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,minHeight:158}}>
          <div style={{width:48,height:48,borderRadius:14,border:"2px dashed #333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>+</div>
          <div style={{fontSize:13,fontWeight:600}}>Add Profile</div>
        </button>
      </div>
    </div>
  );
}

// ── Group Bonus Panel ─────────────────────────────────────────────────────────
function GroupBonusPanel({profiles,currentId}){
  const me=profiles.find(p=>p.id===currentId);
  const myChecked=me?.goals.some(g=>g.checkedToday);
  const crewChecked=(myChecked?1:0)+profiles.filter(p=>p.id!==currentId&&p.goals.some(g=>g.checkedToday)).length;
  const total=profiles.length;
  const allStreak7=profiles.every(p=>p.goals.some(g=>g.streak>=7));
  const bonusData=[
    {...GROUP_BONUSES[0],active:crewChecked===total,progress:crewChecked,total},
    {...GROUP_BONUSES[1],active:false,progress:0,total:1},
    {...GROUP_BONUSES[2],active:allStreak7,progress:profiles.filter(p=>p.goals.some(g=>g.streak>=7)).length,total},
  ];
  return(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:12}}>🏅 Crew Bonuses</div>
      {bonusData.map(b=>(
        <div key={b.id} style={{background:b.active?"rgba(10,25,10,0.7)":"rgba(10,8,2,0.5)",border:`1px solid ${b.active?"#4ade8044":GLASS_BORDER}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,marginBottom:8,backdropFilter:"blur(10px)"}}>
          <span style={{fontSize:20}}>{b.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:b.active?"#4ade80":"#ccc"}}>{b.label}</div>
            <div style={{fontSize:11,color:"#666",marginTop:2}}>{b.desc}</div>
            {!b.active&&b.total>1&&(
              <div style={{marginTop:6}}>
                <div style={{height:3,background:"rgba(255,200,0,0.07)",borderRadius:10,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(b.progress/b.total)*100}%`,background:`linear-gradient(90deg,${GOLD2},${GOLD})`,borderRadius:10,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:10,color:"#555",marginTop:3}}>{b.progress}/{b.total} members</div>
              </div>
            )}
          </div>
          <div style={{background:b.active?"rgba(74,222,128,0.12)":"rgba(255,200,0,0.05)",border:`1px solid ${b.active?"#4ade8044":GLASS_BORDER}`,borderRadius:8,padding:"4px 8px",fontSize:11,fontWeight:800,color:b.active?"#4ade80":GOLD_DIM}}>+{b.xp} XP</div>
        </div>
      ))}
    </div>
  );
}

// ── Check In Button ───────────────────────────────────────────────────────────
function CheckInBtn({goal,onCheckin,col}){
  const[pressing,setPressing]=useState(false);
  if(goal.progress>=100)return<div style={{fontSize:11,color:"#4ade80",fontWeight:700,background:"rgba(10,20,10,0.8)",border:"1px solid #4ade8033",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>✅ Complete!</div>;
  if(goal.checkedToday)return<div style={{fontSize:11,color:"#555",fontWeight:700,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>✓ Done today</div>;
  return(
    <button onMouseDown={()=>setPressing(true)} onMouseUp={()=>{setPressing(false);onCheckin(goal.id);}} onMouseLeave={()=>setPressing(false)} onTouchStart={e=>{e.preventDefault();setPressing(true);}} onTouchEnd={e=>{e.preventDefault();setPressing(false);onCheckin(goal.id);}}
      style={{background:pressing?col.accent:col.accent+"1a",border:`1px solid ${col.accent}`,borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:800,color:pressing?"#000":col.accent,cursor:"pointer",transition:"all 0.12s",whiteSpace:"nowrap"}}>
      ＋ Check In
    </button>
  );
}

// ── New Quest Modal ───────────────────────────────────────────────────────────
function NewQuestModal({onClose,onAdd}){
  const[step,setStep]=useState(1);
  const[form,setForm]=useState({title:"",emoji:"🎯",category:"",frequency:"",daysLeft:30,milestones:["",""]});
  const[emojiOpen,setEmojiOpen]=useState(false);
  const[newMs,setNewMs]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const updateMs=(i,v)=>{const ms=[...form.milestones];ms[i]=v;set("milestones",ms);};
  const addMs=()=>{if(newMs.trim()){set("milestones",[...form.milestones,newMs.trim()]);setNewMs("");}};
  const removeMs=i=>set("milestones",form.milestones.filter((_,idx)=>idx!==i));
  const canNext1=form.title.trim()&&form.category;
  const canNext2=form.frequency&&form.daysLeft>0;
  const handleSubmit=()=>{
    const msFilled=form.milestones.filter(m=>m.trim());
    onAdd({id:Date.now(),title:form.title.trim(),emoji:form.emoji,category:form.category,frequency:form.frequency,daysLeft:Number(form.daysLeft),milestones:msFilled.length?msFilled:["Complete!"],mileStoneIdx:0,progress:0,xp:0,streak:0,checkedToday:false,lastCheckin:null});
    onClose();
  };
  const cat=CATEGORIES.find(c=>c.id===form.category);
  const ac=cat?cat.color:GOLD;
  const estXP=form.frequency==="daily"?form.daysLeft*10:form.frequency==="weekly"?Math.floor(form.daysLeft/7)*10:form.frequency==="biweekly"?Math.floor(form.daysLeft/3.5)*10:100;
  return(
    <div style={md.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={md.modal}>
        <div style={md.handle}/>
        <div style={md.stepRow}>{[1,2,3].map(s=><div key={s} style={{...md.stepDot,background:s<=step?ac:"#2a2a3a",transform:s===step?"scale(1.3)":"scale(1)"}}/>)}</div>
        <div style={md.stepLabel}>{step===1?"Name your quest":step===2?"Set the rules":"Add milestones"}</div>
        {step===1&&(<div style={md.stepContent}>
          <div style={md.fieldLabel}>Quest Icon</div>
          <div style={{position:"relative"}}>
            <button style={{...md.emojiMain,borderColor:ac}} onClick={()=>setEmojiOpen(o=>!o)}>{form.emoji}<span style={{fontSize:10,color:"#666",marginLeft:4}}>▼</span></button>
            {emojiOpen&&<div style={md.emojiGrid}>{EMOJIS.map(e=><button key={e} style={md.emojiOpt} onClick={()=>{set("emoji",e);setEmojiOpen(false);}}>{e}</button>)}</div>}
          </div>
          <div style={md.fieldLabel}>Quest Title</div>
          <input style={{...md.input,borderColor:form.title?ac+"88":"#2a2a3a"}} placeholder="e.g. Run a 5K..." value={form.title} onChange={e=>set("title",e.target.value)} maxLength={40}/>
          <div style={md.fieldLabel}>Category</div>
          <div style={md.catGrid}>{CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>set("category",c.id)} style={{...md.catBtn,borderColor:form.category===c.id?c.color:"#2a2a3a",background:form.category===c.id?c.color+"22":"transparent",color:form.category===c.id?c.color:"#888"}}>
              <span style={{fontSize:18}}>{c.icon}</span><span style={{fontSize:11,fontWeight:700}}>{c.label}</span>
            </button>
          ))}</div>
        </div>)}
        {step===2&&(<div style={md.stepContent}>
          <div style={md.fieldLabel}>Frequency</div>
          <div style={md.freqGrid}>{FREQUENCIES.map(f=>(
            <button key={f.id} onClick={()=>set("frequency",f.id)} style={{...md.freqBtn,borderColor:form.frequency===f.id?ac:"#2a2a3a",background:form.frequency===f.id?ac+"22":"transparent"}}>
              <span style={{fontSize:13,fontWeight:800,color:form.frequency===f.id?ac:"#ccc"}}>{f.label}</span>
              <span style={{fontSize:10,color:"#666",marginTop:2}}>{f.desc}</span>
            </button>
          ))}</div>
          <div style={md.fieldLabel}>Duration</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {[7,14,30,60,90].map(d=>(
              <button key={d} onClick={()=>set("daysLeft",d)} style={{...md.dayChip,borderColor:form.daysLeft===d?ac:"#2a2a3a",background:form.daysLeft===d?ac+"22":"transparent",color:form.daysLeft===d?ac:"#666"}}>{d}d</button>
            ))}
            <input type="number" style={md.dayInput} placeholder="Custom" value={[7,14,30,60,90].includes(form.daysLeft)?"":form.daysLeft} onChange={e=>set("daysLeft",parseInt(e.target.value)||30)} min={1} max={365}/>
          </div>
          <div style={{...md.xpPreview,borderColor:ac+"44",background:ac+"11"}}>
            <span style={{fontSize:24}}>⚡</span>
            <div><div style={{fontSize:12,color:ac,fontWeight:800}}>Estimated XP</div><div style={{fontSize:11,color:"#888"}}>~{estXP} XP over {form.daysLeft} days</div></div>
          </div>
        </div>)}
        {step===3&&(<div style={md.stepContent}>
          <div style={{fontSize:12,color:"#666",marginBottom:16}}>Break it into checkpoints. Crew cheers you at each one! 🎉</div>
          {form.milestones.map((ms,i)=>(
            <div key={i} style={md.msRow}>
              <div style={{...md.msDot,background:ms.trim()?ac:"#333"}}/>
              <input style={{...md.msInput,borderColor:ms.trim()?ac+"66":"#2a2a3a"}} placeholder={`Milestone ${i+1}...`} value={ms} onChange={e=>updateMs(i,e.target.value)}/>
              {form.milestones.length>1&&<button style={md.msRemove} onClick={()=>removeMs(i)}>✕</button>}
            </div>
          ))}
          <div style={md.msRow}>
            <div style={{...md.msDot,background:"#333"}}/>
            <input style={{...md.msInput,borderColor:"#2a2a3a"}} placeholder="Add another milestone..." value={newMs} onChange={e=>setNewMs(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addMs()}/>
            <button style={{...md.msAdd,borderColor:ac,color:ac}} onClick={addMs}>+</button>
          </div>
          <div style={{...md.summary,borderColor:ac+"44",background:ac+"0d"}}>
            {[["Quest",`${form.emoji} ${form.title}`],["Category",cat?.label],["Frequency",FREQ_LABELS[form.frequency]],["Duration",`${form.daysLeft} days`],["Milestones",`${form.milestones.filter(s=>s.trim()).length} checkpoints`]].map(([label,val],i)=>(
              <div key={i} style={md.summaryRow}><span style={md.sumLabel}>{label}</span><span style={{...md.sumVal,...(label==="Category"?{color:ac}:{})}}>{val}</span></div>
            ))}
          </div>
        </div>)}
        <div style={md.footer}>
          {step>1&&<button style={md.backBtn} onClick={()=>setStep(s=>s-1)}>← Back</button>}
          {step<3?(
            <button onClick={()=>(step===1?canNext1:canNext2)&&setStep(s=>s+1)} style={{...md.nextBtn,background:(step===1?canNext1:canNext2)?`linear-gradient(135deg,${ac},${ac}bb)`:"#1a1208",color:(step===1?canNext1:canNext2)?"#000":"#444",cursor:(step===1?canNext1:canNext2)?"pointer":"not-allowed"}}>Continue →</button>
          ):(
            <button onClick={handleSubmit} style={{...md.nextBtn,background:`linear-gradient(135deg,${ac},${ac}bb)`,color:"#000",cursor:"pointer"}}>🚀 Launch Quest!</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const[profiles,setProfiles]=useState(SEED_PROFILES);
  const[screen,setScreen]=useState("switcher");   // "switcher"|"pin"|"app"
  const[pendingP,setPendingP]=useState(null);
  const[activeP,setActiveP]=useState(null);
  const[activeTab,setActiveTab]=useState("goals");
  const[toasts,setToasts]=useState([]);
  const[levelUp,setLevelUp]=useState(null);
  const[showModal,setShowModal]=useState(false);
  const[cheerSent,setCheerSent]=useState({});
  const[feedItems,setFeedItems]=useState([
    {user:"Priya", action:"checked in",          detail:"Daily quest done ✓",  time:"3h ago", emoji:"✅"},
    {user:"Maya",  action:"hit a new streak",    detail:"8 days of yoga!",     time:"5h ago", emoji:"🔥"},
    {user:"Devlin",action:"started a new quest", detail:"Build a Habit 💪",    time:"1d ago", emoji:"⚔️"},
  ]);
  const toastId=useRef(0);
  const prevLevel=useRef(null);

  const me=profiles.find(p=>p.id===activeP);
  const addToast=(icon,title,msg,xp=null,group=false)=>{const id=++toastId.current;setToasts(ts=>[...ts,{id,icon,title,msg,xp,group}]);setTimeout(()=>setToasts(ts=>ts.filter(t=>t.id!==id)),3500);};
  const addFeed=(user,action,detail,emoji)=>setFeedItems(f=>[{user,action,detail,time:"just now",emoji},...f.slice(0,11)]);
  const updateProfile=(id,fn)=>setProfiles(ps=>ps.map(p=>p.id===id?fn(p):p));
  const sendCheer=id=>{setCheerSent(p=>({...p,[id]:true}));setTimeout(()=>setCheerSent(p=>({...p,[id]:false})),2000);};

  const handleSelectProfile=p=>{if(p==="new")return;setPendingP(p);setScreen("pin");};
  const handlePinSuccess=()=>{setActiveP(pendingP.id);prevLevel.current=getLevel(pendingP.xp);setPendingP(null);setScreen("app");setActiveTab("goals");};
  const handleSwitchUser=()=>{setActiveP(null);setScreen("switcher");};

  const handleCheckin=goalId=>{
    if(!me)return;
    let earnedXP=0,milestonePop=null,completedPop=null;
    const updatedGoals=me.goals.map(g=>{
      if(g.id!==goalId)return g;
      const mult=getStreakMult(g.streak),base=XP_PER_CHECKIN[g.frequency]||10,xpGain=Math.round(base*mult);
      earnedXP=xpGain;
      const pgain=g.frequency==="daily"?5:g.frequency==="weekly"?8:g.frequency==="biweekly"?6:15;
      const newProg=Math.min(100,g.progress+pgain),newStreak=g.streak+1;
      const thr=getMsThresholds(g.milestones.length);
      let newMsIdx=g.mileStoneIdx;
      for(let i=g.mileStoneIdx;i<thr.length;i++){if(newProg>=thr[i]&&g.progress<thr[i]){newMsIdx=i+1;milestonePop={name:g.milestones[i],goal:g.title};}}
      if(newProg>=100&&g.progress<100)completedPop=g.title;
      return{...g,progress:newProg,xp:g.xp+xpGain,streak:newStreak,mileStoneIdx:newMsIdx,checkedToday:true,lastCheckin:new Date().toISOString()};
    });
    const ug=updatedGoals.find(g=>g.id===goalId),mult=getStreakMult(ug.streak-1);
    addToast("⚡",`+${earnedXP} XP earned!`,mult>1?`${mult}x streak bonus 🔥`:"Keep it up!",earnedXP);
    if(milestonePop)setTimeout(()=>addToast("🎉","Milestone Unlocked!",`${milestonePop.name} on "${milestonePop.goal}"`),800);
    if(completedPop)setTimeout(()=>addToast("🏆","Quest Complete!",`You finished "${completedPop}"!`,100),1200);
    addFeed(me.name,"checked in",`${ug.emoji} ${ug.title}`,"✅");
    const newXP=me.xp+earnedXP+(completedPop?100:0),newLv=getLevel(newXP);
    if(newLv>prevLevel.current){prevLevel.current=newLv;setTimeout(()=>setLevelUp(newLv),600);addFeed(me.name,"leveled up",`Reached Level ${newLv}!`,"⚡");}
    // Crew sync check
    const myAllDone=updatedGoals.filter(g=>g.frequency==="daily").every(g=>g.checkedToday);
    const othersDone=profiles.filter(p=>p.id!==me.id).every(p=>p.goals.some(g=>g.checkedToday));
    if(myAllDone&&othersDone)setTimeout(()=>{addToast("🔥","Crew Sync!","Everyone checked in — +25 XP each!",25,true);updateProfile(me.id,p=>({...p,xp:p.xp+25}));addFeed("🏅 BONUS","Crew Sync!","+25 XP for everyone 🔥","🏅");},2000);
    if(milestonePop)setTimeout(()=>addToast("🎉","Milestone Party!","Crew earns +15 XP!",15,true),1600);
    updateProfile(me.id,p=>({...p,goals:updatedGoals,xp:newXP,streak:Math.max(...updatedGoals.map(g=>g.streak),0)}));
  };

  const otherProfiles=profiles.filter(p=>p.id!==activeP);

  // ── SWITCHER ──────────────────────────────────────────────────────────────
  if(screen==="switcher")return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <style>{css}</style><OlympicBackground/>
      <ProfileSwitcher profiles={profiles} onSelect={handleSelectProfile}/>
    </div>
  );

  // ── PIN ───────────────────────────────────────────────────────────────────
  if(screen==="pin")return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <style>{css}</style><OlympicBackground/>
      <PinPad profile={pendingP} onSuccess={handlePinSuccess} onCancel={()=>setScreen("switcher")}/>
    </div>
  );

  if(!me)return null;
  const level=getLevel(me.xp),xpToNext=500-(me.xp%500);
  const myCheckedToday=me.goals.some(g=>g.checkedToday);
  const addGoal=g=>updateProfile(me.id,p=>({...p,goals:[g,...p.goals]}));

  // ── APP ───────────────────────────────────────────────────────────────────
  return(
    <div style={s.root}>
      <style>{css}</style><OlympicBackground/>
      <Toast toasts={toasts}/>
      {levelUp&&<LevelUpOverlay level={levelUp} onDone={()=>setLevelUp(null)}/>}
      {showModal&&<NewQuestModal onClose={()=>setShowModal(false)} onAdd={addGoal}/>}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.logo}>QUEST</div>
          <div style={s.tagline}>your goals. your crew.</div>
        </div>
        <div style={s.playerCard}>
          <button onClick={handleSwitchUser} title="Switch profile" style={{...s.avatarBtn,background:me.color,boxShadow:`0 0 14px ${me.color}55`}}>{me.avatar}</button>
          <div>
            <div style={s.playerName}>{me.name}</div>
            <div style={s.levelBadge}>
              <span style={s.levelNum}>LVL {level}</span>
              <div style={s.xpBar}><div style={{...s.xpFill,width:`${((me.xp%500)/500)*100}%`}}/></div>
              <span style={s.xpText}>{xpToNext} to next</span>
            </div>
          </div>
          <div style={s.streakBadge}>🔥 {me.streak}</div>
        </div>
      </div>

      {/* Crew today strip */}
      <div style={s.statusBar}>
        <span style={{fontSize:11,color:"#777",fontWeight:600}}>Today:</span>
        {profiles.map(p=>{
          const checked=p.id===activeP?myCheckedToday:p.goals.some(g=>g.checkedToday);
          return<div key={p.id} title={p.name} style={{width:26,height:26,borderRadius:8,background:checked?p.color:p.color+"1a",border:`2px solid ${checked?p.color:p.color+"33"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:checked?"#000":"#555",transition:"all 0.3s"}}>{checked?"✓":p.avatar[0]}</div>;
        })}
        {myCheckedToday&&profiles.filter(p=>p.id!==activeP).every(p=>p.goals.some(g=>g.checkedToday))&&<span style={{fontSize:10,color:"#4ade80",fontWeight:700,marginLeft:2}}>🔥 All in!</span>}
        <div style={{flex:1}}/>
        <button onClick={handleSwitchUser} style={{fontSize:10,color:GOLD_DIM,background:"transparent",border:`1px solid ${GLASS_BORDER}`,borderRadius:8,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Switch ⇄</button>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {["goals","crew","feed"].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{...s.tab,...(activeTab===t?s.tabActive:{})}}>
            {t==="goals"?"⚔️ Goals":t==="crew"?"👥 Crew":"📡 Feed"}
          </button>
        ))}
      </div>

      <div style={s.content}>

        {/* ── GOALS ── */}
        {activeTab==="goals"&&(
          <div>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Active Quests</span>
              <button style={s.addBtn} onClick={()=>setShowModal(true)}>+ New Quest</button>
            </div>
            <GroupBonusPanel profiles={profiles} currentId={activeP}/>
            {me.goals.map(g=>{
              const col=CAT_COLORS[g.category]||CAT_COLORS.other,mult=getStreakMult(g.streak);
              return(
                <div key={g.id} className="goal-card" style={{...s.goalCard,background:g.checkedToday?"rgba(20,14,2,0.82)":"rgba(14,10,2,0.68)",borderColor:g.checkedToday?col.accent+"77":col.border+"44",boxShadow:g.checkedToday?`0 0 0 1px ${col.accent}22,0 4px 24px rgba(0,0,0,0.4)`:"0 4px 20px rgba(0,0,0,0.3)"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
                    <span style={{fontSize:28,lineHeight:1,marginTop:2}}>{g.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>{g.title}</div>
                      <div style={{display:"flex",gap:6,fontSize:12,fontWeight:600,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{color:col.accent}}>🔥 {g.streak}-day</span>
                        {mult>1&&<span style={{fontSize:10,background:col.accent+"22",color:col.accent,borderRadius:6,padding:"1px 6px",fontWeight:800}}>{mult}x XP</span>}
                        <span style={{fontSize:10,color:"#555",background:"rgba(255,255,255,0.04)",borderRadius:6,padding:"1px 6px"}}>{FREQ_LABELS[g.frequency]}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      <div style={{textAlign:"right"}}><div style={{color:col.accent,fontWeight:800,fontSize:18}}>{g.xp}</div><div style={{fontSize:10,color:"#888"}}>XP</div></div>
                      <CheckInBtn goal={g} onCheckin={handleCheckin} col={col}/>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{flex:1,height:8,background:"rgba(255,200,0,0.06)",borderRadius:20,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:20,background:col.accent,width:`${g.progress}%`,transition:"width 0.8s cubic-bezier(.4,0,.2,1)"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:"#aaa",minWidth:32}}>{g.progress}%</span>
                  </div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    {g.milestones.map((ms,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,color:i<g.mileStoneIdx?col.accent:"#555",opacity:i<g.mileStoneIdx?1:0.5}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:i<g.mileStoneIdx?col.accent:"#333"}}/>
                        <span>{ms}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {me.goals.length===0&&<div style={s.empty}><div style={{fontSize:48,marginBottom:12}}>⚔️</div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>No quests yet!</div><div style={{fontSize:13,color:"#666",marginTop:6}}>Tap + New Quest to begin</div></div>}
          </div>
        )}

        {/* ── CREW ── */}
        {activeTab==="crew"&&(
          <div>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Your Crew</span>
              <button style={s.addBtn} onClick={()=>setScreen("switcher")}>Switch Profile</button>
            </div>
            <div style={{background:"rgba(255,200,0,0.05)",border:`1px solid rgba(255,200,0,0.18)`,borderRadius:16,padding:"14px 16px",marginBottom:20,backdropFilter:"blur(10px)"}}>
              <div style={{fontSize:13,fontWeight:800,color:GOLD,marginBottom:10}}>🏅 Group Bonuses — earn XP together</div>
              {GROUP_BONUSES.map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:12,color:"#aaa"}}>{b.icon} {b.label} — <span style={{color:"#666",fontSize:11}}>{b.desc}</span></span>
                  <span style={{fontSize:11,color:GOLD,fontWeight:700,marginLeft:8,flexShrink:0}}>+{b.xp} ea</span>
                </div>
              ))}
            </div>
            {profiles.map(p=>{
              const isMe=p.id===activeP,checked=isMe?myCheckedToday:p.goals.some(g=>g.checkedToday),plv=getLevel(p.xp);
              return(
                <div key={p.id} className="goal-card" style={{...s.friendCard,borderColor:p.color+"44",background:checked?"rgba(10,18,8,0.72)":"rgba(10,8,2,0.62)"}}>
                  <div style={{width:46,height:46,borderRadius:14,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000",flexShrink:0,boxShadow:isMe?`0 0 14px ${p.color}55`:"none"}}>{p.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                      <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{p.name}</div>
                      {isMe&&<span style={{fontSize:9,color:GOLD,fontWeight:800,background:"rgba(255,200,0,0.12)",border:`1px solid ${GOLD}33`,borderRadius:6,padding:"1px 6px",letterSpacing:1}}>YOU</span>}
                      {checked&&<span style={{fontSize:10,color:"#4ade80",fontWeight:700,background:"rgba(10,25,10,0.8)",border:"1px solid #4ade8033",borderRadius:6,padding:"1px 6px"}}>✓ Today</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#666",marginBottom:8}}>
                      <span style={{color:p.color}}>LVL {plv}</span><span>·</span><span>{p.xp} XP</span><span>·</span><span>🔥 {p.streak}</span>
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:10,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${((p.xp%500)/500)*100}%`,background:p.color,borderRadius:10,transition:"width 0.6s"}}/>
                    </div>
                  </div>
                  {!isMe&&<button className="cheer-btn" onClick={()=>sendCheer(p.id)} style={{background:"transparent",borderRadius:10,border:`1px solid ${p.color}`,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.2s",flexShrink:0,color:cheerSent[p.id]?p.color:"#aaa",whiteSpace:"nowrap"}}>
                    {cheerSent[p.id]?"🎉 Sent!":"👏 Cheer"}
                  </button>}
                </div>
              );
            })}
            <div style={{fontSize:16,fontWeight:800,color:"#fff",marginTop:28,marginBottom:12}}>🏆 Leaderboard</div>
            <div style={{background:"rgba(10,8,2,0.72)",borderRadius:16,border:`1px solid ${GLASS_BORDER}`,overflow:"hidden",backdropFilter:"blur(10px)"}}>
              {[...profiles].sort((a,b)=>b.xp-a.xp).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:`1px solid rgba(200,160,0,0.08)`,background:p.id===activeP?"rgba(255,200,0,0.04)":"transparent"}}>
                  <span style={{fontSize:16,minWidth:28,textAlign:"center",fontWeight:800,color:i===0?GOLD:i===1?"#C0C0C0":i===2?"#CD7F32":"#555"}}>{i===0?"👑":`#${i+1}`}</span>
                  <div style={{width:32,height:32,borderRadius:10,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#000"}}>{p.avatar}</div>
                  <span style={{flex:1,fontSize:14,fontWeight:p.id===activeP?800:600,color:p.id===activeP?"#fff":"#aaa"}}>{p.name}{p.id===activeP?" ⭐":""}</span>
                  <span style={{color:p.color,fontWeight:700}}>{p.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FEED ── */}
        {activeTab==="feed"&&(
          <div>
            <div style={s.sectionTitle}>📡 Live Feed</div>
            <div style={{marginTop:16}}>
              {feedItems.map((item,i)=>(
                <div key={i} className="goal-card" style={{background:item.user==="🏅 BONUS"?"rgba(255,200,0,0.07)":item.time==="just now"?"rgba(8,18,8,0.75)":"rgba(10,8,2,0.62)",borderRadius:14,border:`1px solid ${item.user==="🏅 BONUS"?"rgba(255,200,0,0.3)":item.time==="just now"?"rgba(74,222,128,0.2)":"rgba(200,160,0,0.1)"}`,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12,backdropFilter:"blur(10px)"}}>
                  <div style={{fontSize:24,flexShrink:0}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13}}><strong style={{color:item.user==="🏅 BONUS"?GOLD:"#fff"}}>{item.user}</strong><span style={{color:"#aaa"}}> {item.action}</span></div>
                    <div style={{fontSize:12,color:"#888",marginTop:4}}>{item.detail}</div>
                  </div>
                  <div style={{fontSize:11,color:"#444",flexShrink:0}}>{item.time}</div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(10,8,2,0.62)",borderRadius:16,border:`1px solid rgba(255,200,0,0.18)`,padding:16,marginTop:4,backdropFilter:"blur(10px)"}}>
              <div style={{fontSize:14,fontWeight:700,color:GOLD,marginBottom:12}}>Send a cheer to your crew 🎉</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {otherProfiles.map(p=>(
                  <button key={p.id} className="cheer-btn" onClick={()=>sendCheer(p.id)} style={{borderRadius:20,border:`1px solid ${p.color}`,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s",background:cheerSent[p.id]?p.color:"transparent",color:cheerSent[p.id]?"#000":p.color}}>
                    {p.avatar} {cheerSent[p.id]?"✓ Cheered!":p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={s.bottomNav}>
        {[{t:"goals",icon:"⚔️",label:"Quests"},{t:"crew",icon:"👥",label:"Crew"},{t:"feed",icon:"📡",label:"Feed"}].map(({t,icon,label})=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{...s.navBtn,...(activeTab===t?s.navBtnActive:{})}}>
            <span style={{fontSize:20}}>{icon}</span>
            <span style={{fontSize:10,marginTop:2}}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s={
  root:{background:"transparent",minHeight:"100vh",color:"#fff",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:420,margin:"0 auto",position:"relative",paddingBottom:80,zIndex:1},
  header:{padding:"20px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${GLASS_BORDER}`,background:GLASS,backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:10},
  logo:{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:32,letterSpacing:6,background:`linear-gradient(135deg,${GOLD},#FFF0A0,${GOLD2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,filter:"drop-shadow(0 0 8px rgba(255,200,0,0.4))"},
  tagline:{fontSize:10,color:GOLD_DIM,letterSpacing:2,textTransform:"uppercase",marginTop:2},
  playerCard:{display:"flex",alignItems:"center",gap:10},
  avatarBtn:{width:42,height:42,borderRadius:13,border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#000",cursor:"pointer",transition:"transform 0.15s, box-shadow 0.15s",flexShrink:0},
  playerName:{fontSize:13,fontWeight:700,color:"#fff"},
  levelBadge:{display:"flex",alignItems:"center",gap:6,marginTop:3},
  levelNum:{fontSize:10,color:GOLD,fontWeight:800,letterSpacing:1},
  xpBar:{width:50,height:4,background:"rgba(255,200,0,0.1)",borderRadius:10,overflow:"hidden"},
  xpFill:{height:"100%",background:`linear-gradient(90deg,${GOLD2},${GOLD})`,borderRadius:10,transition:"width 0.6s ease",boxShadow:`0 0 6px ${GOLD}55`},
  xpText:{fontSize:9,color:GOLD_DIM},
  streakBadge:{background:"rgba(255,107,107,0.12)",border:"1px solid rgba(255,107,107,0.3)",borderRadius:8,padding:"4px 8px",fontSize:12,fontWeight:700,color:"#FF6B6B"},
  statusBar:{padding:"9px 20px",display:"flex",alignItems:"center",gap:8,background:"rgba(5,4,1,0.65)",borderBottom:`1px solid ${GLASS_BORDER}`,backdropFilter:"blur(10px)"},
  tabs:{display:"flex",padding:"0 20px",gap:8,marginTop:12},
  tab:{flex:1,padding:"10px 0",borderRadius:12,border:`1px solid rgba(200,160,0,0.14)`,background:"rgba(10,8,4,0.5)",color:"#666",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",backdropFilter:"blur(8px)"},
  tabActive:{background:"linear-gradient(135deg,rgba(255,200,0,0.11),rgba(255,160,0,0.07))",borderColor:"rgba(255,200,0,0.38)",color:GOLD},
  content:{padding:"20px 20px 0"},
  sectionHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  sectionTitle:{fontSize:18,fontWeight:800,color:"#fff"},
  addBtn:{background:`linear-gradient(135deg,${GOLD},${GOLD2})`,border:"none",borderRadius:10,padding:"8px 14px",color:"#000",fontSize:12,fontWeight:800,cursor:"pointer",boxShadow:`0 0 12px rgba(255,200,0,0.22)`},
  goalCard:{borderRadius:18,border:"1px solid",padding:16,marginBottom:14,transition:"transform 0.2s",backdropFilter:"blur(12px)"},
  empty:{textAlign:"center",padding:"60px 20px",color:"#555"},
  friendCard:{borderRadius:16,border:"1px solid",padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12,transition:"all 0.3s",backdropFilter:"blur(10px)"},
  bottomNav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:420,background:"rgba(5,4,1,0.9)",borderTop:`1px solid ${GLASS_BORDER}`,display:"flex",padding:"8px 0 20px",backdropFilter:"blur(20px)"},
  navBtn:{flex:1,background:"transparent",border:"none",display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",color:"#555",transition:"color 0.2s"},
  navBtnActive:{color:GOLD},
};
const md={
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"},
  modal:{background:"rgba(12,9,2,0.96)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:420,padding:"12px 20px 40px",border:`1px solid rgba(200,160,0,0.22)`,borderBottom:"none",maxHeight:"90vh",overflowY:"auto",backdropFilter:"blur(20px)"},
  handle:{width:40,height:4,background:"rgba(200,160,0,0.28)",borderRadius:10,margin:"0 auto 20px"},
  stepRow:{display:"flex",justifyContent:"center",gap:8,marginBottom:8},
  stepDot:{width:8,height:8,borderRadius:"50%",transition:"all 0.3s"},
  stepLabel:{textAlign:"center",fontSize:20,fontWeight:800,color:"#fff",marginBottom:24},
  stepContent:{minHeight:280},
  fieldLabel:{fontSize:11,fontWeight:700,color:"#666",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,marginTop:20},
  emojiMain:{background:"rgba(20,15,4,0.85)",border:"1px solid",borderRadius:12,padding:"10px 16px",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center"},
  emojiGrid:{position:"absolute",top:52,left:0,background:"rgba(14,10,2,0.98)",borderRadius:16,border:`1px solid ${GLASS_BORDER}`,padding:12,display:"flex",flexWrap:"wrap",gap:6,zIndex:10,width:264},
  emojiOpt:{background:"transparent",border:"none",fontSize:22,cursor:"pointer",padding:4,borderRadius:8},
  input:{width:"100%",background:"rgba(20,15,4,0.85)",border:"1px solid",borderRadius:12,padding:"14px 16px",fontSize:15,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box"},
  catGrid:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8},
  catBtn:{border:"1px solid",borderRadius:12,padding:"10px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s",fontFamily:"inherit"},
  freqGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
  freqBtn:{border:"1px solid",borderRadius:12,padding:"12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,transition:"all 0.2s",background:"transparent",fontFamily:"inherit"},
  dayChip:{border:"1px solid",borderRadius:10,padding:"8px 12px",fontSize:13,fontWeight:700,cursor:"pointer",background:"transparent",transition:"all 0.2s",fontFamily:"inherit"},
  dayInput:{border:`1px solid ${GLASS_BORDER}`,borderRadius:10,padding:"8px 12px",fontSize:13,fontWeight:700,background:"rgba(20,15,4,0.85)",color:"#fff",width:80,outline:"none",fontFamily:"inherit"},
  xpPreview:{border:"1px solid",borderRadius:14,padding:"14px 16px",marginTop:20,display:"flex",alignItems:"center",gap:12},
  msRow:{display:"flex",alignItems:"center",gap:10,marginBottom:10},
  msDot:{width:10,height:10,borderRadius:"50%",flexShrink:0,transition:"background 0.2s"},
  msInput:{flex:1,background:"rgba(20,15,4,0.85)",border:"1px solid",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fff",outline:"none",fontFamily:"inherit"},
  msRemove:{background:"transparent",border:"none",color:"#555",fontSize:14,cursor:"pointer",padding:"4px 6px"},
  msAdd:{background:"transparent",border:"1px solid",borderRadius:10,width:34,height:34,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"},
  summary:{border:"1px solid",borderRadius:14,padding:"14px 16px",marginTop:20},
  summaryRow:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,marginBottom:8,borderBottom:`1px solid rgba(200,160,0,0.1)`},
  sumLabel:{fontSize:11,color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:1},
  sumVal:{fontSize:13,fontWeight:700,color:"#ddd"},
  footer:{display:"flex",gap:10,marginTop:24},
  backBtn:{flex:0,background:"rgba(20,15,4,0.85)",border:`1px solid ${GLASS_BORDER}`,borderRadius:14,padding:"14px 18px",color:"#aaa",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  nextBtn:{flex:1,border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:800,transition:"all 0.2s",fontFamily:"inherit"},
};
const css=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#050508;min-height:100vh;}
  .goal-card:hover{transform:translateY(-2px);}
  .cheer-btn:hover{transform:scale(1.05);}
  .profile-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.5)!important;border-color:rgba(255,200,0,0.3)!important;}
  .pin-btn:hover{background:rgba(255,200,0,0.12)!important;}
  input{background:rgba(20,15,4,0.85)!important;}
  input::placeholder{color:#4a3820;}
  input[type=number]::-webkit-inner-spin-button{opacity:0.3;}
  .toast-in{animation:toastIn 0.35s cubic-bezier(.4,0,.2,1) forwards;}
  @keyframes toastIn{from{opacity:0;transform:translateY(-12px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
  .levelup-pop{animation:levelPop 0.5s cubic-bezier(.4,0,.2,1) forwards;}
  @keyframes levelPop{from{opacity:0;transform:scale(0.7);}to{opacity:1;transform:scale(1);}}
  .shake{animation:shake 0.42s cubic-bezier(.36,.07,.19,.97);}
  @keyframes shake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-6px)}40%,60%{transform:translateX(6px)}}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(200,160,0,0.18);border-radius:10px;}
`;
