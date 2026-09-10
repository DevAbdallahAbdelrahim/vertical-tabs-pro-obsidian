import { create } from "zustand";
import type {
  ArenaNode,
  NodeId,
  SavedGroupState,
  PluginDataStorage,
} from "../types/tab-tree";

interface TabStoreState {
  nodes: Record<NodeId, ArenaNode>;
  rootNodeIds: NodeId[];
  activeNodeId: NodeId | null;
  persistentGroups: Record<NodeId, SavedGroupState>;

  // Actions
  setNodes: (nodes: Record<NodeId, ArenaNode>, rootIds: NodeId[]) => void;
  setActiveNode: (id: NodeId | null) => void;
  renameGroup: (
    groupId: NodeId,
    newName: string,
    saveCallback: (data: PluginDataStorage) => Promise<void>,
  ) => void;
  toggleGroupCollapse: (
    groupId: NodeId,
    saveCallback: (data: PluginDataStorage) => Promise<void>,
  ) => void;
  hydratePersistentGroups: (groups: Record<NodeId, SavedGroupState>) => void;
  moveNode: (
    draggedId: NodeId,
    targetId: NodeId | null,
    dropPosition: "inside" | "before" | "after",
    saveCallback: (data: PluginDataStorage) => Promise<void>,
  ) => void;
  collapseAllGroups: (collapse: boolean) => void;
  createNewGroup: (title: string, parentId?: NodeId | null) => void;
}

export const useTabStore = create<TabStoreState>((set, get) => ({
  nodes: {},
  rootNodeIds: [],
  activeNodeId: null,
  persistentGroups: {},

  setNodes: (nodes, rootNodeIds) => set({ nodes, rootNodeIds }),

  setActiveNode: (activeNodeId) => set({ activeNodeId }),

  hydratePersistentGroups: (persistentGroups) => {
    set({ persistentGroups });
  },

  renameGroup: async (groupId, newName, saveCallback) => {
    const { persistentGroups, nodes } = get();
    const existing = persistentGroups[groupId] || {
      id: groupId,
      customTitle: newName,
      isCollapsed: false,
      parentId: nodes[groupId]?.parentId || null,
      childGroupIds: [],
    };

    const updatedGroups = {
      ...persistentGroups,
      [groupId]: { ...existing, customTitle: newName },
    };

    const updatedNodes = { ...nodes };
    if (updatedNodes[groupId]) {
      updatedNodes[groupId].title = newName;
    }

    set({ persistentGroups: updatedGroups, nodes: updatedNodes });

    await saveCallback({
      version: "1.0.0",
      persistentGroups: updatedGroups,
      settings: {
        hibernationTimeoutMinutes: 15,
        maxNestingDepth: 5,
        enableAutoGroupingByFolder: true,
      },
    });
  },

  toggleGroupCollapse: async (groupId, saveCallback) => {
    const { nodes, persistentGroups } = get();
    const node = nodes[groupId];
    if (!node) return;

    const newCollapsedState = !node.isCollapsed;
    const updatedNodes = {
      ...nodes,
      [groupId]: { ...node, isCollapsed: newCollapsedState },
    };

    const updatedGroups = {
      ...persistentGroups,
      [groupId]: {
        ...(persistentGroups[groupId] || {
          id: groupId,
          customTitle: node.title,
          parentId: node.parentId,
          childGroupIds: [],
        }),
        isCollapsed: newCollapsedState,
      },
    };

    set({ nodes: updatedNodes, persistentGroups: updatedGroups });

    await saveCallback({
      version: "1.0.0",
      persistentGroups: updatedGroups,
      settings: {
        hibernationTimeoutMinutes: 15,
        maxNestingDepth: 5,
        enableAutoGroupingByFolder: true,
      },
    });
  },

  createNewGroup: (title, parentId = null) => {
    const { nodes, rootNodeIds } = get();
    const newGroupId = `group-custom-${Date.now()}`;

    const newGroupNode: ArenaNode = {
      id: newGroupId,
      leafId: null,
      title: title || "New Group",
      filePath: null,
      parentId: parentId,
      childrenIds: [],
      isGroup: true,
      isCollapsed: false,
      isHibernated: false,
      depth: parentId && nodes[parentId] ? nodes[parentId].depth + 1 : 0,
      lastAccessedTime: Date.now(),
    };

    const updatedNodes = { ...nodes, [newGroupId]: newGroupNode };
    const updatedRootIds = [...rootNodeIds];

    if (parentId && updatedNodes[parentId]) {
      updatedNodes[parentId].childrenIds.push(newGroupId);
    } else {
      updatedRootIds.push(newGroupId);
    }

    set({ nodes: updatedNodes, rootNodeIds: updatedRootIds });
  },

  collapseAllGroups: (collapse) => {
    const { nodes } = get();
    const updatedNodes = { ...nodes };

    Object.keys(updatedNodes).forEach((id) => {
      if (updatedNodes[id].isGroup) {
        updatedNodes[id].isCollapsed = collapse;
      }
    });

    set({ nodes: updatedNodes });
  },

  moveNode: (draggedId, targetId, dropPosition, saveCallback) => {
    const { nodes, rootNodeIds } = get();
    const dragged = nodes[draggedId];
    if (!dragged || draggedId === targetId) return;

    const updatedNodes: Record<NodeId, ArenaNode> = JSON.parse(
      JSON.stringify(nodes),
    );
    let updatedRootIds = [...rootNodeIds];

    // 1. إزالة العنصر من والده القديم أو من الجذور
    if (dragged.parentId && updatedNodes[dragged.parentId]) {
      updatedNodes[dragged.parentId].childrenIds = updatedNodes[
        dragged.parentId
      ].childrenIds.filter((id) => id !== draggedId);
    } else {
      updatedRootIds = updatedRootIds.filter((id) => id !== draggedId);
    }

    // 2. إدراج العنصر في الموضع الجديد
    if (
      dropPosition === "inside" &&
      targetId &&
      updatedNodes[targetId]?.isGroup
    ) {
      dragged.parentId = targetId;
      dragged.depth = updatedNodes[targetId].depth + 1;
      updatedNodes[targetId].childrenIds.push(draggedId);
    } else if (targetId && updatedNodes[targetId]) {
      const targetNode = updatedNodes[targetId];
      dragged.parentId = targetNode.parentId;
      dragged.depth = targetNode.depth;

      const targetList = targetNode.parentId
        ? updatedNodes[targetNode.parentId].childrenIds
        : updatedRootIds;

      const targetIdx = targetList.indexOf(targetId);
      const insertIdx = dropPosition === "after" ? targetIdx + 1 : targetIdx;
      targetList.splice(insertIdx, 0, draggedId);
    } else {
      // إفلات في الجذر
      dragged.parentId = null;
      dragged.depth = 0;
      updatedRootIds.push(draggedId);
    }

    updatedNodes[draggedId] = dragged;
    set({ nodes: updatedNodes, rootNodeIds: updatedRootIds });
  },
}));
