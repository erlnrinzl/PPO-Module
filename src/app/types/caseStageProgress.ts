export type CaseStageStatus = "pending" | "in_progress" | "completed" | "skipped";

export interface CaseStageProgress {
    id: string; // uuid
    case_id: string; // uuid, FK to EmployeeCase
    stage_id: string; // uuid, FK to WorkflowStage
    stage_code: string; // denormalized for query speed
    status: CaseStageStatus;
    started_at?: string;
    completed_at?: string;
    deadline_at?: string;
    actor_id?: string; // uuid, FK to User who completed it
    remarks?: string;
}