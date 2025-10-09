export interface Script {
  id: number;
  name: string;
  urlPattern: string;
  code: string;
  createdAt: string;
  updatedAt?: string;
  enabled?: boolean; // Scripts are enabled by default
}

export interface ScriptsStorage {
  scripts: Script[];
}
