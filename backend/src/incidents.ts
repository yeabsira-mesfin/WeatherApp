export type Incident = {
  id: string;
  title: string;
  service: string;
  severity: string;
  symptom: string;
  evidence: string[];
  options: { id: string; label: string }[];
  answer: string;
  remediation: string;
  verification: string;
};
export const incidents: Incident[] = [
  {
    id: "db-latency",
    title: "Database latency after traffic growth",
    service: "activity-api",
    severity: "SEV-2",
    symptom: "p95 latency rose from 180ms to 6.4s.",
    evidence: [
      "EXPLAIN shows a sequential scan across 4.8M rows",
      "Query filters tenant_id and sorts created_at DESC",
      "CPU is normal while database I/O is saturated",
    ],
    options: [
      {
        id: "index",
        label: "Missing composite index for tenant_id + created_at",
      },
      { id: "cpu", label: "Insufficient API CPU" },
      { id: "dns", label: "DNS resolution failure" },
    ],
    answer: "index",
    remediation:
      "Add and validate a composite index aligned with the filter and sort pattern.",
    verification:
      "Compare query plans and p95 latency before and after the change.",
  },
  {
    id: "token-race",
    title: "Intermittent refresh-token failures",
    service: "identity-api",
    severity: "SEV-2",
    symptom:
      "Valid users are occasionally signed out during concurrent requests.",
    evidence: [
      "Two refresh requests arrive within milliseconds",
      "First request rotates the token",
      "Second request sees the old token as revoked",
    ],
    options: [
      { id: "race", label: "Refresh-token rotation race condition" },
      { id: "clock", label: "Server clock drift" },
      { id: "cors", label: "CORS preflight failure" },
    ],
    answer: "race",
    remediation:
      "Use replay-aware token-family handling and a bounded concurrency strategy.",
    verification:
      "Run parallel refresh tests and verify replay detection still works.",
  },
  {
    id: "rate-limit",
    title: "Vendor integration fails in bursts",
    service: "sync-worker",
    severity: "SEV-3",
    symptom: "Import jobs fail when the vendor returns 429.",
    evidence: [
      "Response includes Retry-After",
      "Client retries immediately five times",
      "Failures correlate with traffic spikes",
    ],
    options: [
      { id: "backoff", label: "Retry policy ignores rate-limit semantics" },
      { id: "schema", label: "Vendor schema mismatch" },
      { id: "tls", label: "Expired TLS certificate" },
    ],
    answer: "backoff",
    remediation:
      "Honor Retry-After and add bounded exponential backoff with jitter.",
    verification: "Simulate 429/5xx responses and ensure retries are bounded.",
  },
  {
    id: "react-stale",
    title: "Dashboard renders stale search results",
    service: "web-ui",
    severity: "SEV-3",
    symptom:
      "Fast filter changes sometimes show results from an older request.",
    evidence: [
      "Multiple fetches remain in flight",
      "Slower earlier request resolves last",
      "No AbortController or request version guard",
    ],
    options: [
      { id: "stale", label: "Out-of-order async response race" },
      { id: "cache", label: "Browser cache corruption" },
      { id: "css", label: "CSS hydration mismatch" },
    ],
    answer: "stale",
    remediation:
      "Abort superseded requests or ignore responses that are no longer current.",
    verification:
      "Test rapid filter changes with deliberately reordered responses.",
  },
  {
    id: "partial-import",
    title: "CSV import leaves partial records",
    service: "import-api",
    severity: "SEV-2",
    symptom: "Rows before an invalid line remain committed.",
    evidence: [
      "Each row is inserted immediately",
      "Validation happens during iteration",
      "No transaction wraps the import",
    ],
    options: [
      {
        id: "transaction",
        label: "Missing atomic transaction / staged commit",
      },
      { id: "encoding", label: "CSV character encoding only" },
      { id: "memory", label: "Insufficient memory" },
    ],
    answer: "transaction",
    remediation:
      "Validate then commit atomically, or stage rows and promote only on success.",
    verification: "Inject a bad row and verify zero records are committed.",
  },
  {
    id: "env-secret",
    title: "Deployment returns 500 after release",
    service: "payments-api",
    severity: "SEV-1",
    symptom: "Every payment request fails immediately after deployment.",
    evidence: [
      "Startup log shows missing PAYMENT_PROVIDER_KEY",
      "Previous revision is healthy",
      "No provider requests appear in outbound telemetry",
    ],
    options: [
      { id: "env", label: "Missing production environment secret" },
      { id: "provider", label: "Payment provider outage" },
      { id: "database", label: "Database deadlock" },
    ],
    answer: "env",
    remediation:
      "Restore the secret through the deployment secret store and add startup validation.",
    verification:
      "Health check must validate required configuration before traffic shifts.",
  },
  {
    id: "nplus1",
    title: "Orders endpoint slows with page size",
    service: "orders-api",
    severity: "SEV-3",
    symptom: "Latency grows almost linearly with number of orders returned.",
    evidence: [
      "One SELECT orders query",
      "Then one SELECT customer per order",
      "Database connection count spikes",
    ],
    options: [
      { id: "nplus1", label: "N+1 query pattern" },
      { id: "gc", label: "Garbage collection pause" },
      { id: "cdn", label: "CDN cache miss" },
    ],
    answer: "nplus1",
    remediation:
      "Batch or join related customer data with bounded query shape.",
    verification: "Assert query count does not grow with result count.",
  },
  {
    id: "loop",
    title: "Worker CPU pins at 100%",
    service: "event-worker",
    severity: "SEV-2",
    symptom: "One worker consumes a full core and stops processing new jobs.",
    evidence: [
      "Same job ID repeats in logs",
      "Retry counter never increments",
      "Failure path requeues synchronously",
    ],
    options: [
      { id: "loop", label: "Unbounded retry/requeue loop" },
      { id: "leak", label: "Memory leak" },
      { id: "network", label: "Packet loss" },
    ],
    answer: "loop",
    remediation:
      "Bound retries, add dead-letter handling, and make failure state observable.",
    verification:
      "Force a permanent failure and verify eventual dead-letter behavior.",
  },
];
