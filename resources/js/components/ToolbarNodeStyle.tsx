//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '@/store/store'
import { Node } from '@/store/node'
import { updateNodeStyle } from '@/store/nodeActions'

import Colorpicker from '@/components/Colorpicker'
import ContentEditable from '@/components/ContentEditable'
import ToolbarNodeData from '@/components/ToolbarNodeData'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeStyle = (): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const style = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeStylesSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].style == selectedNodes0.style
      })
      return isAllSelectedNodeStylesSame
        ? selectedNodes0.style
        : {}
    } else {
      return {}
    }
  })
  const selectedNodes = useSelector((state: AppState) => state.reactFlow.active.selectedNodes)

  // Update Node Styles
  const updateNodeStyles = (styleUpdates: Partial<Node['style']>) => {
    selectedNodes.forEach(selectedNodeId => {
      dispatch(updateNodeStyle({
        nodeId: selectedNodeId,
        styleUpdates
      }))
    })
  }

  return (
    <>
      <ToolbarNodeData
        name={'Background Color'}>
        <Colorpicker
          disabled={selectedNodes.length === 0}
          value={style.backgroundColor || ''}
          updateValue={nextBackgroundColor => updateNodeStyles({ backgroundColor: nextBackgroundColor })}/>
      </ToolbarNodeData>
      <ToolbarNodeData
        name={'Text Color'}>
        <Colorpicker
          defaultValue='#000000'
          disabled={selectedNodes.length === 0}
          value={style.color || ''}
          updateValue={nextColor => updateNodeStyles({ color: nextColor })}/>
      </ToolbarNodeData>
      <ToolbarNodeData
        name={'Font Weight'}>
        <ContentEditable
          disabled={selectedNodes.length === 0}
          value={(style.fontWeight || '') as string}
          updateValue={nextFontWeight => updateNodeStyles({ fontWeight: nextFontWeight })}/>
      </ToolbarNodeData>
    </>
  )
}

export default ToolbarNodeStyle
