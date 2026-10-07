import type {Incident} from './incidents.js';
export function score(i:Incident, diagnosis:string, remediation:string, verification:string){
 const diag=diagnosis===i.answer?55:0;
 const rem=similar(remediation,i.remediation)?25:0;
 const ver=similar(verification,i.verification)?20:0;
 const total=diag+rem+ver;
 return {score:total,diagnosisCorrect:diag>0,remediationCredit:rem,verificationCredit:ver,grade:total>=90?'Excellent':total>=70?'Strong':total>=50?'Partial':'Needs Work'};
}
function similar(a:string,b:string){const keys=b.toLowerCase().split(/\W+/).filter(x=>x.length>5);const text=a.toLowerCase();return keys.some(k=>text.includes(k));}
