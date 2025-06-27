-- Add MCP server instances and templates tables

-- Server templates (built-in and user-created MCP servers)
CREATE TABLE IF NOT EXISTS server_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  docker_image TEXT NOT NULL,
  environment_variables JSONB DEFAULT '{}',
  exposed_ports JSONB DEFAULT '[]',
  required_config JSONB DEFAULT '{}',
  is_builtin BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Server instances (running containers for users)
CREATE TABLE IF NOT EXISTS server_instances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  template_id INTEGER REFERENCES server_templates(id) NOT NULL,
  name TEXT NOT NULL,
  container_id TEXT UNIQUE,
  status TEXT DEFAULT 'stopped', -- stopped, starting, running, error
  port INTEGER,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Server usage metrics
CREATE TABLE IF NOT EXISTS server_metrics (
  id SERIAL PRIMARY KEY,
  instance_id INTEGER REFERENCES server_instances(id) NOT NULL,
  metric_type TEXT NOT NULL, -- requests, cpu_usage, memory_usage, etc.
  value NUMERIC NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert built-in GitHub MCP server template
INSERT INTO server_templates (
  name, 
  description, 
  docker_image, 
  environment_variables,
  exposed_ports,
  required_config,
  is_builtin,
  is_public
) VALUES (
  'GitHub MCP Server',
  'Connect to GitHub repositories and manage issues, PRs, and code',
  'mcp-github-server:latest',
  '{"MCP_SERVER_NAME": "github", "NODE_ENV": "production"}',
  '[{"container": 3000, "protocol": "tcp"}]',
  '{"github_token": {"type": "string", "required": true, "description": "GitHub Personal Access Token"}}',
  TRUE,
  TRUE
) ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_server_instances_user_id ON server_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_server_instances_status ON server_instances(status);
CREATE INDEX IF NOT EXISTS idx_server_instances_container_id ON server_instances(container_id);
CREATE INDEX IF NOT EXISTS idx_server_metrics_instance_id ON server_metrics(instance_id);
CREATE INDEX IF NOT EXISTS idx_server_metrics_recorded_at ON server_metrics(recorded_at);