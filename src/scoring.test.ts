import {describe,expect,it} from 'vitest';
import {incidents} from './incidents';
import {scoreDiagnosis} from './scoring';
describe('incident scoring',()=>{
  it('awards full credit for exact diagnosis and remediation',()=>{
    const i=incidents[0];
    expect(scoreDiagnosis(i,i.rootCause,i.fix).score).toBe(100);
  });
  it('does not award remediation credit for a distractor',()=>{
    const i=incidents[0];
    expect(scoreDiagnosis(i,i.rootCause,i.distractors[0]).score).toBe(60);
  });
});
