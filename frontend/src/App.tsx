import { request } from "./api";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Server,
  TerminalSquare,
} from "lucide-react";
type Incident = {
  id: string;
  title: string;
  service: string;
  severity: string;
  symptom: string;
  evidence: string[];
  options: { id: string; label: string }[];
  remediation: string;
  verification: string;
};

export default function App() {
  const [items, setItems] = useState<Incident[]>([]);
  const [cur, setCur] = useState<Incident | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [remediation, setRemediation] = useState("");
  const [verification, setVerification] = useState("");
  const [result, setResult] = useState<{
    score: number;
    grade: string;
    diagnosisCorrect: boolean;
    remediationCredit: number;
    verificationCredit: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    request<Incident[]>("/api/incidents")
      .then((d) => {
        setItems(d);
        setCur(d[0] ?? null);
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    setDiagnosis("");
    setRemediation("");
    setVerification("");
    setResult(null);
  }, [cur?.id]);
  async function submit() {
    if (!cur || busy) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      setResult(
        await request<{
          score: number;
          grade: string;
          diagnosisCorrect: boolean;
          remediationCredit: number;
          verificationCredit: number;
        }>("/api/incidents/" + cur.id + "/score", {
          method: "POST",
          body: JSON.stringify({ diagnosis, remediation, verification }),
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <header>
        <div className="brand">
          <TerminalSquare /> <b>DebugArena</b>
          <span>Production incident benchmark</span>
        </div>
        <div className="live">
          <i /> CURATED LAB
        </div>
      </header>
      <main>
        {error && (
          <div role="alert" className="error">
            {error}{" "}
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        {!items.length && !error && (
          <p role="status">Loading incident queue...</p>
        )}
        <section className="intro">
          <span>INCIDENT RESPONSE • ROOT CAUSE ANALYSIS</span>
          <h1>Can you debug the failure before the next alert fires?</h1>
          <p>
            Work from evidence, select the most likely root cause, propose the
            fix, and define how you would verify it.
          </p>
        </section>
        <div className="layout">
          <aside>
            <h3>
              <Activity size={18} /> Incident queue
            </h3>
            {items.map((i) => (
              <button
                className={cur?.id === i.id ? "active" : ""}
                disabled={busy}
                onClick={() => setCur(i)}
                key={i.id}
              >
                <b>{i.title}</b>
                <span>
                  {i.service} • {i.severity}
                </span>
              </button>
            ))}
          </aside>
          {cur && (
            <section className="case">
              <div className="caseHead">
                <div>
                  <span className="sev">{cur.severity}</span>
                  <h2>{cur.title}</h2>
                  <p>{cur.symptom}</p>
                </div>
                <Server />
              </div>
              <h4>Evidence</h4>
              <div className="evidence">
                {cur.evidence.map((e, n) => (
                  <div key={e}>
                    <span>0{n + 1}</span>
                    {e}
                  </div>
                ))}
              </div>
              <h4>Root cause</h4>
              <p>
                Curated incident evidence. Text scoring is a lexical heuristic,
                not semantic reasoning.
              </p>
              <div className="options">
                {cur.options.map((o) => (
                  <label key={o.id}>
                    <input
                      type="radio"
                      name="d"
                      checked={diagnosis === o.id}
                      onChange={() => setDiagnosis(o.id)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
              <div className="two">
                <label>
                  Remediation
                  <textarea
                    value={remediation}
                    onChange={(e) => setRemediation(e.target.value)}
                    placeholder="Describe the production-safe fix..."
                  />
                </label>
                <label>
                  Verification
                  <textarea
                    value={verification}
                    onChange={(e) => setVerification(e.target.value)}
                    placeholder="How will you prove the fix works?"
                  />
                </label>
              </div>
              <button
                className="submit"
                disabled={
                  busy ||
                  !diagnosis ||
                  !remediation.trim() ||
                  !verification.trim()
                }
                onClick={submit}
              >
                {busy ? "Scoring..." : "Score diagnosis"}
              </button>
            </section>
          )}
          <section className="scorecard" aria-live="polite">
            <h3>
              <CheckCircle2 size={18} /> Evaluation
            </h3>
            {result ? (
              <>
                <strong className="score">{result.score}</strong>
                <small>/ 100</small>
                <h2>{result.grade}</h2>
                <dl>
                  <div>
                    <dt>Root cause</dt>
                    <dd>{result.diagnosisCorrect ? "55/55" : "0/55"}</dd>
                  </div>
                  <div>
                    <dt>Remediation</dt>
                    <dd>{result.remediationCredit}/25</dd>
                  </div>
                  <div>
                    <dt>Verification</dt>
                    <dd>{result.verificationCredit}/20</dd>
                  </div>
                </dl>
              </>
            ) : (
              <div className="waiting">
                <AlertTriangle />
                <p>
                  Complete the incident analysis to generate a weighted
                  evaluation.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
