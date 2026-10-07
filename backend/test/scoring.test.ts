import test from 'node:test';import assert from 'node:assert/strict';import {incidents} from '../src/incidents.js';import {score} from '../src/scoring.js';
test('correct diagnosis receives majority credit',()=>{const i=incidents[0];const result=score(i,i.answer,i.remediation,i.verification);assert.equal(result.score,100);assert.equal(result.grade,'Excellent')});
test('wrong diagnosis cannot pass',()=>{const i=incidents[0];const result=score(i,'dns','','');assert.equal(result.score,0)});
