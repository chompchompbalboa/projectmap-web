//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Node } from 'reactflow'
import { useDispatch, useSelector } from 'react-redux'

import { updateNode } from '@/store/nodeActions'
import { AppDispatch, AppState } from '@/store/store'

import ContentEditable from '@/components/ContentEditable'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  nodeId: Node['id']
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNodeLabel = ({ nodeId }: Props): JSX.Element => {
  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const nodeLabel = useSelector((state: AppState) => state.node.allNodes[nodeId].label)
  const nodeIsLabelVisible = useSelector((state: AppState) => state.node.allNodes[nodeId].isLabelVisible)

  // Handle Node Label Update
  const handleNodeLabelUpdate = (nextNodeLabel: string): void => {
    dispatch(
      updateNode({
        nodeId: nodeId,
        updates: { label: nextNodeLabel }
      })
    )
  }
  return (
    nodeIsLabelVisible
      ?<ContentEditable
          focusOnSelect
          value={nodeLabel}
          updateValue={handleNodeLabelUpdate}
          style={{
            fontSize: '15px',
            textAlign: 'center'
          }}/>
      : <></>
  )
}

export default MapNodeLabel
