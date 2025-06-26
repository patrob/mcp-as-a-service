import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

const app = express();
const port = process.env.MCP_SERVER_PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// GitHub client setup
let octokit: Octokit | null = null;

if (process.env.GITHUB_TOKEN) {
  octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

// Validation schemas
const RepoSchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

const IssueSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  title: z.string(),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const PullRequestSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  title: z.string(),
  head: z.string(),
  base: z.string(),
  body: z.string().optional(),
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    authenticated: !!octokit 
  });
});

// MCP server info
app.get('/info', (req, res) => {
  res.json({
    name: 'GitHub MCP Server',
    version: '1.0.0',
    description: 'GitHub integration for Model Context Protocol',
    capabilities: [
      'list_repositories',
      'get_repository',
      'list_issues',
      'create_issue',
      'get_issue',
      'list_pull_requests',
      'create_pull_request',
      'get_pull_request',
      'get_file_content',
      'search_repositories',
      'search_code'
    ],
    authenticated: !!octokit
  });
});

// Repository endpoints
app.get('/repositories', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50,
    });

    res.json({
      repositories: data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
      }))
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.get('/repositories/:owner/:repo', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { owner, repo } = RepoSchema.parse(req.params);
    const { data } = await octokit.rest.repos.get({ owner, repo });

    res.json({
      repository: {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description,
        private: data.private,
        html_url: data.html_url,
        clone_url: data.clone_url,
        ssh_url: data.ssh_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        language: data.language,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
        open_issues_count: data.open_issues_count,
        default_branch: data.default_branch,
      }
    });
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ error: 'Failed to fetch repository' });
  }
});

// Issues endpoints
app.get('/repositories/:owner/:repo/issues', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { owner, repo } = RepoSchema.parse(req.params);
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 50,
    });

    res.json({
      issues: data.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        html_url: issue.html_url,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        labels: issue.labels.map(label => (typeof label === 'string' ? label : label.name)),
        assignees: issue.assignees?.map(assignee => assignee.login) || [],
      }))
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.post('/repositories/:owner/:repo/issues', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { owner, repo } = RepoSchema.parse(req.params);
    const { title, body, labels } = IssueSchema.omit({ owner: true, repo: true }).parse(req.body);

    const { data } = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    });

    res.status(201).json({
      issue: {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body,
        state: data.state,
        html_url: data.html_url,
        created_at: data.created_at,
      }
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Pull requests endpoints
app.get('/repositories/:owner/:repo/pulls', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { owner, repo } = RepoSchema.parse(req.params);
    const { data } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 50,
    });

    res.json({
      pull_requests: data.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        html_url: pr.html_url,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        head: {
          ref: pr.head.ref,
          sha: pr.head.sha,
        },
        base: {
          ref: pr.base.ref,
          sha: pr.base.sha,
        },
      }))
    });
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    res.status(500).json({ error: 'Failed to fetch pull requests' });
  }
});

// File content endpoint
app.get('/repositories/:owner/:repo/contents/*', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const { owner, repo } = RepoSchema.parse(req.params);
    const path = req.params[0]; // Get the wildcard path

    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data)) {
      // Directory listing
      res.json({
        type: 'directory',
        contents: data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          html_url: item.html_url,
        }))
      });
    } else {
      // File content
      const content = data.encoding === 'base64' 
        ? Buffer.from(data.content, 'base64').toString('utf-8')
        : data.content;

      res.json({
        type: 'file',
        name: data.name,
        path: data.path,
        size: data.size,
        content,
        encoding: data.encoding,
        html_url: data.html_url,
      });
    }
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).json({ error: 'Failed to fetch file content' });
  }
});

// Search endpoints
app.get('/search/repositories', async (req, res) => {
  try {
    if (!octokit) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const { data } = await octokit.rest.search.repos({
      q: query,
      per_page: 20,
    });

    res.json({
      total_count: data.total_count,
      repositories: data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
      }))
    });
  } catch (error) {
    console.error('Error searching repositories:', error);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`GitHub MCP Server running on port ${port}`);
  console.log(`GitHub token configured: ${!!process.env.GITHUB_TOKEN}`);
});