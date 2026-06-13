id PK	uuid	
case_number	varchar	human-readable, e.g. PPO-2024-00123
employee_id FK	uuid	→ Employee
case_type enum	varchar	8 event types
case_group	int	derived 1–5, stored for query
status enum	varchar	per-group FSM states
source_case_id FK	uuid?	→ EmployeeCase; set when spawned from G3/G4
benefit_eligible	boolean	G2 only — drives benefit creation
initiated_by FK	uuid	→ User (HR officer)
initiated_at	timestamptz	
effective_date	date	dismissal / retirement effective date
resolved_at	timestamptz?	null until closed
notes	text?	general remarks
created_at	timestamptz	audit
updated_at	timestamptz	audit