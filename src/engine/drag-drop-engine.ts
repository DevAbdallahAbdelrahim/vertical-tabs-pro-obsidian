import { useTabStore } from "../store/tab-store";
import type { PluginDataStorage } from "../types/tab-tree";

export class DragDropEngine {
  private static draggedNodeId: string | null = null;

  public static handleDragStart(event: DragEvent, nodeId: string): void {
    DragDropEngine.draggedNodeId = nodeId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", nodeId);
    }
  }

  public static handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  public static handleDrop(
    event: DragEvent,
    targetNodeId: string,
    isGroup: boolean,
    saveCallback: (data: PluginDataStorage) => Promise<void>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (
      !DragDropEngine.draggedNodeId ||
      DragDropEngine.draggedNodeId === targetNodeId
    ) {
      return;
    }

    const targetEl = event.currentTarget as HTMLElement | null;
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const height = rect.height;

    let dropPosition: "before" | "after" | "inside" = "inside";

    if (isGroup) {
      if (offsetY < height * 0.25) dropPosition = "before";
      else if (offsetY > height * 0.75) dropPosition = "after";
      else dropPosition = "inside";
    } else {
      dropPosition = offsetY > height / 2 ? "after" : "before";
    }

    useTabStore
      .getState()
      .moveNode(
        DragDropEngine.draggedNodeId,
        targetNodeId,
        dropPosition,
        saveCallback,
      );

    DragDropEngine.draggedNodeId = null;
  }
}
