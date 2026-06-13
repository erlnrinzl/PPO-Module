export interface MissingPersonWatch {
    id: string; // uuid
    case_id: string; // uuid, FK to EmployeeCase (unique)
    missing_declared_at: string; // date
    twelve_month_deadline: string; // date, computed: declared_at + 12 months
    last_known_location?: string;
    last_known_date?: string; // date
    police_report_number?: string;
    revocation_attempted_at?: string; // date, null until attempted
    revocation_outcome?: "revoked" | "not_revoked" | "pending";
    watch_status: "active" | "expired" | "resolved";
    notes?: string;
}