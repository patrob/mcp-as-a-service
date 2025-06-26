export interface ServerTemplate {
  id: number;
  name: string;
  description: string;
  dockerImage: string;
  environmentVariables: Record<string, string>;
  exposedPorts: Array<{ container: number; protocol: string }>;
  requiredConfig: Record<string, any>;
  isBuiltin: boolean;
  isPublic: boolean;
}

export interface ServerInstance {
  id: number;
  userId: number;
  templateId: number;
  name: string;
  containerId: string | null;
  status: 'stopped' | 'starting' | 'running' | 'error';
  port: number | null;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  template?: {
    name: string;
    description: string;
  };
}

export async function fetchServerTemplates(): Promise<ServerTemplate[]> {
  const response = await fetch('/api/servers/templates');
  if (!response.ok) {
    throw new Error('Failed to fetch server templates');
  }
  const data = await response.json();
  return data.templates;
}

export async function fetchUserServers(): Promise<ServerInstance[]> {
  const response = await fetch('/api/servers');
  if (!response.ok) {
    throw new Error('Failed to fetch user servers');
  }
  const data = await response.json();
  return data.instances;
}

export async function createServerInstance(
  templateId: number,
  name: string,
  config: Record<string, any>
): Promise<ServerInstance> {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ templateId, name, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create server');
  }

  const data = await response.json();
  return data.instance;
}

export async function startServer(instanceId: number): Promise<void> {
  const response = await fetch(`/api/servers/${instanceId}/start`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start server');
  }
}

export async function stopServer(instanceId: number): Promise<void> {
  const response = await fetch(`/api/servers/${instanceId}/stop`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to stop server');
  }
}

export async function deleteServer(instanceId: number): Promise<void> {
  const response = await fetch(`/api/servers/${instanceId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete server');
  }
}
