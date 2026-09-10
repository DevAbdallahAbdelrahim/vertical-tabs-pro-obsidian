import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { ArenaNode, NodeId } from "../../types/tab-tree";

export class DragAndDropHandler {
  /**
   * Handles tab/group reordering in $O(1)$ flat memory array without re-rendering parent DOM elements
   */
  public static handleReorder(
    event: DragEndEvent,
    nodes: Record<NodeId, ArenaNode>,
    rootNodeIds: NodeId[]
  ): { updatedNodes: Record<NodeId, ArenaNode>; updatedRoots: NodeId[] } | null {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return null;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeNode = nodes[activeId];
    const overNode = nodes[overId];

    if (!activeNode || !overNode) return null;

    const updatedRoots = [...rootNodeIds];
    const oldIndex = updatedRoots.indexOf(activeId);
    const newIndex = updatedRoots.indexOf(overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      updatedRoots.splice(oldIndex, 1);
      updatedRoots.splice(newIndex, 0, activeId);
    }

    return {
      updatedNodes: nodes,
      updatedRoots,
    };
  }
}
