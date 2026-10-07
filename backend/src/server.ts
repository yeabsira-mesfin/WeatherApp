import express from 'express';import cors from 'cors';import {incidents} from './incidents.js';import {score} from './scoring.js';
const app=express();app.use(cors());app.use(express.json({limit:'50kb'}));
app.get('/health',(_,res)=>res.json({status:'ok',incidents:incidents.length}));
app.get('/api/incidents',(_,res)=>res.json(incidents.map(({answer,...i})=>i)));
app.post('/api/incidents/:id/score',(req,res)=>{const i=incidents.find(x=>x.id===req.params.id);if(!i)return res.status(404).json({error:'Incident not found'});const {diagnosis='',remediation='',verification=''}=req.body??{};res.json(score(i,diagnosis,remediation,verification));});
if(process.env.NODE_ENV!=='test')app.listen(Number(process.env.PORT||8080),()=>console.log('DebugArena API on 8080'));
export {app};
