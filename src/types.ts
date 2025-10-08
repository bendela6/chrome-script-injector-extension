export interface Script {
  id: number;
  name: string;
  urlPattern: string;
  code: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ScriptsStorage {
  scripts: Script[];
}

