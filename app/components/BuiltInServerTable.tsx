import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { builtinServers } from '@/lib/servers'

export function BuiltInServerTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {builtinServers.map((server) => (
          <TableRow key={server.id}>
            <TableCell className="font-medium">{server.name}</TableCell>
            <TableCell className="capitalize">{server.type}</TableCell>
            <TableCell>
              <span className={server.status === 'running' ? 'text-green-600' : 'text-red-600'}>
                {server.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
