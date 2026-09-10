import { ArenaNode, NodeId } from "../types/tab-tree";

export class TabStoreSelectors {
  /**
   * Returns a flattened list of visible node IDs based on collapse states
   */
  public static selectVisibleNodeIds(
    nodes: Record<NodeId, ArenaNode>,
    rootNodeIds: NodeId[]
  ): NodeId[] {
    const visibleIds: NodeId[] = [];

    const traverse = (nodeId: NodeId) => {
      const node = nodes[nodeId];
      if (!node) return;

      visibleIds.push(node.id);

      if (node.isGroup && !node.isCollapsed) {
        node.childrenIds.forEach((childId) => traverse(childId));
      }
    };

    rootNodeIds.forEach((rootId) => traverse(rootId));
    return visibleIds;
  }

  /**
   * Selects all hibernated nodes for bulk memory release or statistics
   */
  public static selectHibernatedNodes(
    nodes: Record<NodeId, ArenaNode>
  ): ArenaNode[] {
    return Object.values(nodes).filter((node) => node.isHibernated);
  }
}
