import type { Incident } from "./incidents.js";
export function score(
  i: Incident,
  diagnosis: string,
  remediation: string,
  verification: string,
) {
  const diag = diagnosis === i.answer ? 55 : 0;
  const rem = similar(remediation, i.remediation) ? 25 : 0;
  const ver = similar(verification, i.verification) ? 20 : 0;
  const total = diag + rem + ver;
  return {
    score: total,
    diagnosisCorrect: diag > 0,
    remediationCredit: rem,
    verificationCredit: ver,
    grade:
      total >= 90
        ? "Excellent"
        : total >= 70
          ? "Strong"
          : total >= 50
            ? "Partial"
            : "Needs Work",
  };
}
function similar(a: string, b: string) {
  const keys = [
    ...new Set(
      b
        .toLowerCase()
        .split(/\W+/)
        .filter((x) => x.length > 5),
    ),
  ];
  const words = new Set(a.toLowerCase().split(/\W+/));
  return (
    a.trim().length >= 20 &&
    keys.filter((k) => words.has(k)).length >= Math.min(2, keys.length)
  );
}
