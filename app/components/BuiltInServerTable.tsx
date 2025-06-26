'use client'

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { fetchServerTemplates, createServerInstance, type ServerTemplate } from '@/lib/servers'
import { Plus } from 'lucide-react'

export function BuiltInServerTable() {
  const [templates, setTemplates] = useState<ServerTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<number | null>(null)

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await fetchServerTemplates()
        setTemplates(data.filter(t => t.isBuiltin))
      } catch (error) {
        console.error('Error loading templates:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const handleCreateInstance = async (template: ServerTemplate) => {
    setCreating(template.id)
    try {
      const config: Record<string, any> = {}
      
      // For GitHub server, we'd need to collect the GitHub token
      // For now, we'll create without config and user can configure later
      if (template.name.includes('GitHub')) {
        const token = prompt('Enter your GitHub Personal Access Token (optional):')
        if (token) {
          config.github_token = token
        }
      }

      await createServerInstance(
        template.id,
        `${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        config
      )

      // Refresh the page or show success message
      window.location.reload()
    } catch (error) {
      console.error('Error creating server instance:', error)
      alert('Failed to create server instance')
    } finally {
      setCreating(null)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading templates...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.name}</TableCell>
            <TableCell>{template.description}</TableCell>
            <TableCell>
              <Button
                size="sm"
                onClick={() => handleCreateInstance(template)}
                disabled={creating === template.id}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {creating === template.id ? 'Creating...' : 'Create Instance'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
