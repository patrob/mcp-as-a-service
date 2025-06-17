export interface BuiltinServer {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped';
}

export const builtinServers: BuiltinServer[] = [
  {
    id: 'github',
    name: 'GitHub MCP Server',
    type: 'github',
    status: 'running',
  },
];
