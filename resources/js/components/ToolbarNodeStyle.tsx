//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux'
import { FaBold, FaItalic, FaStrikethrough } from 'react-icons/fa'

import { AppDispatch, AppState } from '@/store/store'
import { Node } from '@/store/node'
import { updateNodeStyle } from '@/store/nodeActions'

import Colorpicker from '@/components/Colorpicker'
import ToolbarNodeData from '@/components/ToolbarNodeData'
import ToolbarNodeDataButton from '@/components/ToolbarNodeDataButton'

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
        isNodeDataVisibilityModifiable={false}
        name={'Background Color'}>
        <Colorpicker
          disabled={selectedNodes.length === 0}
          value={style.backgroundColor || ''}
          updateValue={nextBackgroundColor => updateNodeStyles({ backgroundColor: nextBackgroundColor })}/>
      </ToolbarNodeData>
      <ToolbarNodeData
        isNodeDataVisibilityModifiable={false}
        name={'Text Color'}>
        <Colorpicker
          defaultValue='#000000'
          disabled={selectedNodes.length === 0}
          value={style.color || ''}
          updateValue={nextColor => updateNodeStyles({ color: nextColor })}/>
      </ToolbarNodeData>
      <ToolbarNodeData
        isNodeDataVisibilityModifiable={false}
        name={'Font Style'}>
        <ToolbarNodeDataButton 
          icon={FaBold}
          isButtonActive={style.fontWeight === 'bold'}
          onButtonClick={() => updateNodeStyles({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}/>
        <ToolbarNodeDataButton 
          icon={FaItalic}
          isButtonActive={style.fontStyle === 'italic'}
          onButtonClick={() => updateNodeStyles({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}/>
        <ToolbarNodeDataButton 
          icon={FaStrikethrough}
          isButtonActive={style.textDecorationLine === 'line-through'}
          onButtonClick={() => updateNodeStyles({ textDecorationLine: style.textDecorationLine === 'line-through' ? 'none' : 'line-through' })}/>
      </ToolbarNodeData>
    </>
  )
}

export default ToolbarNodeStyle
