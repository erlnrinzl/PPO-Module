export interface CaseDecision {
    id: string; // uuid
    case_id: string; // uuid, FK to EmployeeCase (source)
    decision_type: string; // e.g. death_on_duty_confirmed, forwarded_to_dismissal
    outcome: "confirmed" | "denied" | "forwarded";
    decided_by: string; // uuid, FK to User (approving officer)
    decided_at: string; // timestamptz
    resulting_case_id?: string; // uuid, FK to EmployeeCase; set when forwarded to G1
    basis_document_id?: string; // uuid, FK to CaseDocument; supporting doc for decision
    notes?: string; // rationale
}