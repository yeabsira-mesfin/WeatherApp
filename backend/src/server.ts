import express from "express";
import cors from "cors";
import { incidents } from "./incidents.js";
import { score } from "./scoring.js";
const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "http://localhost:5173,https://yeabsira-mesfin.github.io").split(","),
  }),
);
app.use(express.json({ limit: "50kb" }));
app.get("/health", (_, res) =>
  res.json({ status: "ok", incidents: incidents.length }),
);
app.get("/api/incidents", (_, res) =>
  res.json(incidents.map(({ answer, remediation, verification, ...i }) => i)),
);
app.post("/api/incidents/:id/score", (req, res) => {
  const i = incidents.find((x) => x.id === req.params.id);
  if (!i) return res.status(404).json({ error: "Incident not found" });
  const {
    diagnosis = "",
    remediation = "",
    verification = "",
  } = req.body ?? {};
  if (
    [diagnosis, remediation, verification].some(
      (v) => typeof v !== "string" || v.length > 4000,
    ) ||
    !i.options.some((o) => o.id === diagnosis)
  )
    return res
      .status(422)
      .json({
        error: "Choose a known diagnosis and provide bounded text fields",
      });
  res.json({
    ...score(i, diagnosis, remediation, verification),
    reference: { remediation: i.remediation, verification: i.verification },
    method: "lexical heuristic",
  });
});
app.use(
  (
    error: { status?: number },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res
      .status(error.status === 413 ? 413 : 400)
      .json({ error: "Invalid or oversized request" });
  },
);
if (process.env.NODE_ENV !== "test")
  app.listen(Number(process.env.PORT || 8080), () =>
    console.log("DebugArena API on 8080"),
  );
export { app };

export default app;
