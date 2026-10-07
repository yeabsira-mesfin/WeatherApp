import {useState} from 'react';
import {AlertTriangle,CheckCircle2,Clock3,ServerCrash,TerminalSquare} from 'lucide-react';
import {incidents} from './incidents';
import {scoreDiagnosis} from './scoring';
export default function App(){
  const [active,setActive]=useState(incidents[0]);
  const [cause,setCause]=useState('');
  const [fix,setFix]=useState('');
  const [result,setResult]=useState<ReturnType<typeof scoreDiagnosis>|null>(null);
  const submit=()=>setResult(scoreDiagnosis(active,cause,fix));
  return <main className="wrap">
    <nav><b><ServerCrash size={21}/>DebugArena</b><a href="https://github.com/yeabsira-mesfin/WeatherApp" target="_blank" rel="noreferrer">GitHub</a></nav>
    <section className="hero"><div><span>PRODUCTION INCIDENT BENCHMARK</span><h1>Debug systems under pressure.</h1><p>Work from logs, symptoms, and service context. Identify the root cause, choose the production-safe fix, and receive deterministic scoring.</p></div><div className="terminal"><div>$ arena status</div><strong>5 incidents loaded</strong><div className="ok">● evaluation environment ready</div><div>hidden checks: enabled</div><div>scoring: deterministic</div></div></section>
    <section className="layout"><aside><h2>Incident queue</h2>{incidents.map(i=><button className={active.id===i.id?'selected':''} onClick={()=>{setActive(i);setCause('');setFix('');setResult(null)}} key={i.id}><span>{i.id}<em>{i.severity}</em></span><b>{i.title}</b><small>{i.service}</small></button>)}</aside>
    <section className="incident"><div className="meta"><span><AlertTriangle size={17}/>{active.severity}</span><span><Clock3 size={17}/>Active investigation</span></div><h2>{active.title}</h2><p className="signal">{active.signal}</p><div className="logs"><div><TerminalSquare size={18}/>Evidence</div>{active.logs.map(l=><code key={l}>{l}</code>)}</div><h3>1. Identify the root cause</h3><div className="choices">{[active.rootCause,...active.distractors.map((d,index)=>`alternative-${index}`)].map((v,index)=>{const labels=[active.rootCause,...active.distractors];return <button className={cause===v?'picked':''} onClick={()=>setCause(v)} key={v}>{labels[index]}</button>})}</div><h3>2. Choose the remediation</h3><div className="choices">{[active.fix,...active.distractors].map(v=><button className={fix===v?'picked':''} onClick={()=>setFix(v)} key={v}>{v}</button>)}</div><button className="submit" disabled={!cause||!fix} onClick={submit}>Score investigation</button>{result&&<div className={`result ${result.score===100?'pass':''}`}><CheckCircle2/><div><b>{result.score}/100</b><span>{result.score===100?'Production-safe diagnosis':'Review the evidence and try again'}</span></div></div>}</section></section>
    <footer>Built to demonstrate debugging, incident analysis, root-cause reasoning, testing, and production support skills.</footer>
  </main>;
}
