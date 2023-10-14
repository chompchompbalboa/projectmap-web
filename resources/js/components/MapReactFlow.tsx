//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactFlow, {
  Background,
  Controls,
  ConnectionLineType,
  Node as ReactFlowNode,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnNodesChange,
  OnNodesDelete,
  OnEdgesChange,
  ReactFlowProvider,
  useReactFlow,
  XYPosition,
  ReactFlowInstance
} from 'reactflow'
import 'reactflow/dist/style.css'

import { AppDispatch, AppState } from '@/store/store'
import { Map } from '@/store/map'
import { NodeType } from '@/store/node'
import { createNode } from '@/store/nodeActions'
import { 
  onConnect, 
  onConnectEnd, 
  onConnectStart,
  onEdgesChange, 
  onNodesChange,
  onNodesDelete,
  onNodeDragStop
} from '@/store/reactFlowActions'

import MapGroup from '@/components/MapGroup'
import MapNode from '@/components/MapNode'
import Toolbar from '@/components/Toolbar'

//-----------------------------------------------------------------------------
// Node Types
//-----------------------------------------------------------------------------
const nodeTypes = { mapGroup: MapGroup, mapNode: MapNode }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  mapId: Map['id']
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
function MapReactFlow({
  mapId
}: Props): JSX.Element {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const reactflowEdges = useSelector((state: AppState) => state.reactFlow.edges)
  const reactflowNodes = useSelector((state: AppState) => state.reactFlow.nodes)

  // State
  const [reactFlowInstance, setReactFlowInstance] = useState(null as unknown as ReactFlowInstance)

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // React Flow
  const { getIntersectingNodes, project } = useReactFlow()
  
  // Get Mouse Position In React Flow Coordinates
  // This is needed when a node is created at the mouse position. Examples
  // of this functionality include dragging and dropping a new node on the
  // map and creating a new node when a connection ends without connecting
  // two nodes
  const getMousePositionInReactFlowCoordinates: (
    e: MouseEvent | React.DragEvent
  ) => XYPosition = (e) => {
    // Get the position where the connection ended
    let xPositionAdjustment = 0
    let yPositionAdjustment = 0
    if (reactFlowWrapper && reactFlowWrapper.current) {
      const { top, left } = reactFlowWrapper.current.getBoundingClientRect()
      xPositionAdjustment = left
      yPositionAdjustment = top
    }
    const position: XYPosition = project({
      x: e.clientX - xPositionAdjustment,
      y: e.clientY - yPositionAdjustment
    })
    return position
  }

  // Handle Connect
  const handleConnect: OnConnect = useCallback((params) => {
    dispatch(onConnect({ connection: params }))
  }, [])

  // Handle Connect End
  const handleConnectEnd: OnConnectEnd = useCallback(
    (e) => {
      const position = getMousePositionInReactFlowCoordinates(e as MouseEvent)
      dispatch(onConnectEnd({ nodePosition: position }))
    },
    [project]
  )
  
  // Handle Connect Start
  const handleConnectStart: OnConnectStart = useCallback((_, params) => {
    dispatch(onConnectStart({ connection: params }))
  }, [])

  // Handle Drag Over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  // Handle Drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (reactFlowInstance && reactFlowWrapper && reactFlowWrapper.current) {
        e.preventDefault()
        const newNodePosition = getMousePositionInReactFlowCoordinates(e)
        const newNodeType = e.dataTransfer.getData('application/reactflow') as NodeType
        dispatch(createNode({ 
          type: newNodeType,
          positionX: newNodePosition.x,
          positionY: newNodePosition.y,
        }))
      }
    },
    [reactFlowInstance]
  )

  // Handle Nodes Change
  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    dispatch(onNodesChange({ changes }))
  }, [])

  // Handle Nodes Delete
  const handleNodesDelete: OnNodesDelete = useCallback((nodes) => {
    dispatch(onNodesDelete({ nodes }))
  }, [])

  // Handle Node Drag Stop
  const handleNodeDragStop: (e: React.MouseEvent, node: ReactFlowNode) => void = useCallback((e, node) => {
      dispatch(onNodeDragStop({ node }))
    }, [])

  // Handle Edges Change
  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    dispatch(onEdgesChange({ changes }))
  }, [])

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          connectionLineType={ConnectionLineType.Bezier}
          nodeTypes={nodeTypes}
          nodes={reactflowNodes}
          edges={reactflowEdges}
          onConnect={handleConnect}
          onConnectEnd={handleConnectEnd}
          onConnectStart={handleConnectStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdgesChange={handleEdgesChange}
          onNodesChange={handleNodesChange}
          onNodesDelete={handleNodesDelete}
          onNodeDragStop={handleNodeDragStop}
          onInit={(value): void => setReactFlowInstance(value)}
          multiSelectionKeyCode={'Shift'}
          panActivationKeyCode={['Space']}
          panOnDrag={false}
          selectionOnDrag={true}
          selectionKeyCode={null}
        >
          <Toolbar />
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  )
}

//-----------------------------------------------------------------------------
// Wrap Component With React Flow Provider
// https://reactflow.dev/docs/guides/troubleshooting/#warning-seems-like-you-have-not-used-zustand-provider-as-an-ancestor
//-----------------------------------------------------------------------------
function MapWithReactFlowProvider({
  mapId
}: Props): JSX.Element {
  return (
    <ReactFlowProvider>
      <MapReactFlow mapId={mapId}/>
    </ReactFlowProvider>
  )
}

export default MapWithReactFlowProvider
