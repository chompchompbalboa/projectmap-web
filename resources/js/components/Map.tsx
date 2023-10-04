//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactFlow, {
  Background,
  Controls,
  Node,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
  useReactFlow,
  XYPosition,
  ReactFlowInstance
} from 'reactflow'
import 'reactflow/dist/style.css'

import { AppDispatch, AppState } from '../store/store'
import { NodeType } from '../store/node'
import { createNode } from '../store/nodeActions'
import {
  onConnectStart,
  onNodesChange,
  resetMap,
  updateNodeParentOnDragStop
} from '../store/reactFlow'
import { onConnect, onConnectEnd, onEdgesChange } from '../store/reactFlowActions'

import MapGroup from '../components/MapGroup'
import MapNode from '../components/MapNode'
import Toolbar from '../components/Toolbar'

//-----------------------------------------------------------------------------
// Custom Node Types
//-----------------------------------------------------------------------------
const nodeTypes = { mapGroup: MapGroup, mapNode: MapNode }

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
function Map(): JSX.Element {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const reactflowEdges = useSelector(
    (state: AppState) => state.reactFlow.edges
  )
  const reactflowNodes = useSelector(
    (state: AppState) => state.reactFlow.nodes
  )

  // State
  const [reactFlowInstance, setReactFlowInstance] = useState(
    null as unknown as ReactFlowInstance
  )

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // React Flow
  const { getIntersectingNodes, project } = useReactFlow()
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
  const handleConnect: OnConnect = useCallback((params) => {
    dispatch(onConnect({ connection: params }))
  }, [])
  const handleConnectEnd: OnConnectEnd = useCallback(
    (e) => {
      const position = getMousePositionInReactFlowCoordinates(e as MouseEvent)
      dispatch(onConnectEnd({ nodePosition: position }))
    },
    [project]
  )
  const handleConnectStart: OnConnectStart = useCallback((_, params) => {
    dispatch(onConnectStart(params))
  }, [])
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])
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
  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    dispatch(onNodesChange(changes))
  }, [])
  const handleNodeDragStop: (e: React.MouseEvent, node: Node) => void =
    useCallback((e, node) => {
      if (node.type === 'mapNode') {
        const intersections = getIntersectingNodes(node).map((n) => n.id)
        if (intersections.length > 0) {
          intersections.find((intersectingNodeId) => {
            const intersectingNode = reactflowNodes.find(
              (n1) => n1.id === intersectingNodeId
            )
            if (intersectingNode?.type === 'mapGroup') {
              const position = getMousePositionInReactFlowCoordinates(
                e as unknown as MouseEvent
              )
              dispatch(
                updateNodeParentOnDragStop({
                  nodeId: node.id,
                  parentNodeId: intersectingNode.id,
                  position: position
                })
              )
            }
          })
        }
      }
    }, [])
  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    dispatch(onEdgesChange({ changes }))
  }, [])

  // Reset Map
  const handleResetMap = (): void => {
    dispatch(resetMap())
  }

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          edges={reactflowEdges}
          multiSelectionKeyCode={'Shift'}
          nodes={reactflowNodes}
          nodeTypes={nodeTypes}
          onConnect={handleConnect}
          onConnectEnd={handleConnectEnd}
          onConnectStart={handleConnectStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdgesChange={handleEdgesChange}
          onNodesChange={handleNodesChange}
          onNodeDragStop={handleNodeDragStop}
          onInit={(value): void => setReactFlowInstance(value)}
          panActivationKeyCode={['Space']}
          panOnDrag={false}
          selectionOnDrag={true}
          selectionKeyCode={null}
        >
          <Toolbar resetMap={handleResetMap} />
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
function MapWithReactFlowProvider(): JSX.Element {
  return (
    <ReactFlowProvider>
      <Map />
    </ReactFlowProvider>
  )
}

export default MapWithReactFlowProvider
