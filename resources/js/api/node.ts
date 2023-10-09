//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { Node } from '@/store/node'

//-----------------------------------------------------------------------------
// Create Node
//-----------------------------------------------------------------------------
export const createNode = (
  node: Node
) => {
  return axios.post<Node>('/api/node/', node)
}

//-----------------------------------------------------------------------------
// Delete Node
//-----------------------------------------------------------------------------
export const deleteNode = (
  nodeId: Node['id']
) => {
  return axios.delete<Node>('/api/node/' + nodeId)
}

//-----------------------------------------------------------------------------
// Update Node
//-----------------------------------------------------------------------------
export const updateNode = ({
  nodeId,
  updates
}: {
  nodeId: Node['id'],
  updates: Partial<Node>
}) => {
  return axios.patch<Node>('/api/node/' + nodeId, updates)
}