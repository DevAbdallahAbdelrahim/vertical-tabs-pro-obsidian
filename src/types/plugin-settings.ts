export type RibbonIconOption = "brand" | "native" | "none";

export interface PluginSettings {
  hibernationTimeoutMinutes: number;
  maxNestingDepth: number;
  enableAutoGroupingByFolder: boolean;
  enableAutoGroupingByTag: boolean;
  showWordCountBadges: boolean;
  // إعدادات فلسفة FOSS والسيادة الكاملة
  ribbonIconStyle: RibbonIconOption;
  enableDragAndDrop: boolean;
  autoExpandActiveGroup: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  hibernationTimeoutMinutes: 15,
  maxNestingDepth: 5, // رفع الحد ليدعم المجموعات المتداخلة بكفاءة
  enableAutoGroupingByFolder: false, // تعطيل التجميع التلقائي افتراضياً لإعطاء التحكم للمستخدم
  enableAutoGroupingByTag: false,
  showWordCountBadges: true,
  ribbonIconStyle: "brand",
  enableDragAndDrop: true,
  autoExpandActiveGroup: true,
};
