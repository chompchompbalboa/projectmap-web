//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { Edge } from '@/store/edge'
import { Map } from '@/store/map'
import { Node } from '@/store/node'
import { User } from '@/store/user'

//-----------------------------------------------------------------------------
// Create Map
//-----------------------------------------------------------------------------
export const createMap = ({ userId }: {
  userId: User['id']
}) => {
  return axios.post<Map>('/api/map/', { userId })
}

//-----------------------------------------------------------------------------
// Get Map
//-----------------------------------------------------------------------------
export const getMap = ({ mapId }: {
  mapId: Map['id']
}) => {
  return axios.get<{
    map: Map,
    mapNodes: Node[],
    mapEdges: Edge[]
  }>('/api/map/' + mapId)
}