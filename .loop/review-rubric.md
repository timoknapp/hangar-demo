# Repository review notes

The app is a read-only demo with in-memory fixtures. Persistence, authentication and background jobs are separate product decisions.
Keep local HTTP tests deterministic and close every listener.
Treat user-provided strings as text, not HTML.
Check acceptance criteria and test evidence on the final commit; state missing evidence honestly.
