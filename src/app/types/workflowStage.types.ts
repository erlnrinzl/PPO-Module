export interface WorkflowStage {
  id: string;
  templateId: string;
  stageOrder: number;
  stageCode: string;
  stageName: string;
  assignedRole: string;
  deadlineDays?: number;
  isConditional: boolean;
  conditionField?: string;
  requiredDocs?: string[]; // Assuming document_type codes are strings
}