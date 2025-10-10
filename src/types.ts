export type ScriptDto = {
  id: string;
  name: string;
  urlPattern: string;
  code: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ScriptFormData = Omit<ScriptDto, "id" | "createdAt" | "updatedAt">;

export type TabDto = {
  id: number;
  url: string;
}
