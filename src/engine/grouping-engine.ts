import { ArenaNode, NodeId } from "../types/tab-tree";

export class GroupingEngine {
  /**
   * Generates dynamic nested groups based on file tags (#project/subproject)
   */
  public static createTagGroups(
    nodes: Record<NodeId, ArenaNode>,
    tagsMap: Record<string, string[]> // filePath -> tags[]
  ): { updatedNodes: Record<NodeId, ArenaNode>; groupIds: NodeId[] } {
    const updatedNodes = { ...nodes };
    const groupIds: NodeId[] = [];

    Object.values(updatedNodes).forEach((node) => {
      if (node.isGroup || !node.filePath) return;

      const fileTags = tagsMap[node.filePath];
      if (fileTags && fileTags.length > 0) {
        const primaryTag = fileTags[0].replace("#", "");
        const tagParts = primaryTag.split("/");

        let currentParentId: NodeId | null = null;
        let depth = 0;

        tagParts.forEach((part) => {
          const groupId = `group-tag-${tagParts.slice(0, depth + 1).join("/")}`;

          if (!updatedNodes[groupId]) {
            updatedNodes[groupId] = {
              id: groupId,
              leafId: null,
              title: `#${part}`,
              filePath: null,
              parentId: currentParentId,
              childrenIds: [],
              isGroup: true,
              isCollapsed: false,
              isHibernated: false,
              depth: depth,
              lastAccessedTime: Date.now(),
            };
            groupIds.push(groupId);
          }

          if (currentParentId && !updatedNodes[currentParentId].childrenIds.includes(groupId)) {
            updatedNodes[currentParentId].childrenIds.push(groupId);
          }

          currentParentId = groupId;
          depth++;
        });

        if (currentParentId) {
          node.parentId = currentParentId;
          node.depth = depth;
          if (!updatedNodes[currentParentId].childrenIds.includes(node.id)) {
            updatedNodes[currentParentId].childrenIds.push(node.id);
          }
        }
      }
    });

    return { updatedNodes, groupIds };
  }
}
