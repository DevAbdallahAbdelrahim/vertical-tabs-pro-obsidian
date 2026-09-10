/**
 * Strict DOM Type Guard preventing Uncaught TypeError: B.closest is not a function
 */
export class DOMGuard {
  /**
   * Verifies if an unknown event target is a valid HTML/SVG Element
   */
  public static isElement(target: unknown): target is Element {
    return target instanceof Element || target instanceof SVGElement;
  }

  /**
   * Safe wrapper around Element.closest method
   */
  public static safeClosest(target: unknown, selector: string): Element | null {
    if (!this.isElement(target)) {
      return null;
    }
    return target.closest(selector);
  }

  /**
   * Checks whether the target belongs to a tab node or group header
   */
  public static isInteractiveTabElement(target: unknown): boolean {
    if (!this.isElement(target)) {
      return false;
    }
    return (
      this.safeClosest(target, ".vtp-tab-item") !== null ||
      this.safeClosest(target, ".vtp-group-header") !== null ||
      target.classList.contains("vtp-tab-item") ||
      target.classList.contains("vtp-group-header")
    );
  }
}
