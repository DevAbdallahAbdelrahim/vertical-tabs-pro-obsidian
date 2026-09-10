import { Plugin } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS } from "./types/plugin-settings";
import {
  VerticalTabsProView,
  VIEW_TYPE_VERTICAL_TABS_PRO,
} from "./ui/types/view-container";
import { ObsidianEventObserver } from "./adapter/obsidian-events";
import { ArenaTreeEngine } from "./engine/arena-tree";
import { useTabStore } from "./store/tab-store";

export default class VerticalTabsProPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  private ribbonIconEl: HTMLElement | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();

    // 1. تسجيل حاوي العرض الجانبي (Sidebar View)
    this.registerView(
      VIEW_TYPE_VERTICAL_TABS_PRO,
      (leaf) => new VerticalTabsProView(leaf, this.saveData.bind(this)),
    );

    // 2. إعداد أيقونة الـ Ribbon ديناميكياً حسب خيار المستخدم
    this.setupRibbonIcon();

    // 3. تهيئة مراقب الأحداث (Workspace Observer)
    const observer = new ObsidianEventObserver(this.app, this);
    observer.registerEvents({
      onLeafCreated: () => this.syncWorkspaceState(),
      onLeafClosed: () => this.syncWorkspaceState(),
      onActiveLeafChanged: () => this.syncWorkspaceState(),
      onLayoutChanged: () => this.syncWorkspaceState(),
    });

    this.app.workspace.onLayoutReady(() => {
      this.syncWorkspaceState();
    });
  }

  /**
   * التحكم في إنشاء أو حذف أو تغيير شكل أيقونة الـ Ribbon مرئياً وفقاً لإعدادات المستخدم
   */
  public setupRibbonIcon(): void {
    // إزالة الأيقونة القديمة إن وجدت لمنع التكرار
    if (this.ribbonIconEl) {
      this.ribbonIconEl.remove();
      this.ribbonIconEl = null;
    }

    const { ribbonIconStyle } = this.settings;

    // عدم فرض أي أيقونة إذا اختار المستخدم إخفاءها (مبدأ FOSS والسيادة)
    if (ribbonIconStyle === "none") return;

    // تحديد نوع الأيقونة (brand = layout-list / native = layers)
    const iconName = ribbonIconStyle === "brand" ? "layout-list" : "layers";

    this.ribbonIconEl = this.addRibbonIcon(
      iconName,
      "Vertical Tabs Pro",
      () => {
        this.activateView();
      },
    );
  }

  public syncWorkspaceState(): void {
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    const activeLeaf =
      this.app.workspace.getActiveViewOfType(null)?.leaf || null;

    const { nodes, rootIds } = ArenaTreeEngine.buildFlatTree(
      leaves,
      activeLeaf,
      this.settings.enableAutoGroupingByFolder,
    );

    useTabStore.getState().setNodes(nodes, rootIds);
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_VERTICAL_TABS_PRO)[0];

    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        leaf = rightLeaf;
        await leaf.setViewState({
          type: VIEW_TYPE_VERTICAL_TABS_PRO,
          active: true,
        });
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    // تحديث الأيقونة تلقائياً بمجرد حفظ الإعدادات الجديدة
    this.setupRibbonIcon();
  }
}
