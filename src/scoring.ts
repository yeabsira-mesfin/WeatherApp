import type { Incident } from './incidents';
export function scoreDiagnosis(incident:Incident,rootCause:string,fix:string){
  const cause=rootCause===incident.rootCause?60:0;
  const remediation=fix===incident.fix?40:0;
  return {score:cause+remediation,causeCorrect:cause>0,fixCorrect:remediation>0};
}
