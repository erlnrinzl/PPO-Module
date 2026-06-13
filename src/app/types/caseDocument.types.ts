export interface CaseDocument {
    id: string; // uuid
    case_id: string; // uuid, FK to EmployeeCase
    stage_code?: string;
    document_type: string; // e.g. surat_pengantar, sk_pemberhentian, akta_kematian
    file_name: string;
    file_path: string;
    file_size_bytes: number;
    mime_type: string;
    uploaded_by: string; // uuid, FK to User
    uploaded_at: string; // timestamptz
    is_verified: boolean;
    verified_by?: string; // uuid, FK to User
}