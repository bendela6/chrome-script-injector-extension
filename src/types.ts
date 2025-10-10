export enum ScriptRunAt {
  DocumentStart = "document_start",
  DocumentEnd = "document_end",
  DocumentIdle = "document_idle",
}

export type ScriptDto = {
  id: string;
  name: string;
  urlPattern: string;
  code: string;
  enabled: boolean;
  runAt: ScriptRunAt;
  createdAt: string;
  updatedAt: string;
};

export type ScriptFormData = Omit<ScriptDto, "id" | "createdAt" | "updatedAt">;

export type TabDto = {
  id: number;
  url: string;
};
