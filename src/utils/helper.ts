import { Page, Locator, FrameLocator, expect } from "@playwright/test";
import { ExcelPage } from "../pages/ExcelPage";

/**
 * Waits for an element to become visible within the given timeout.
 * @param object - The page or frame context.
 * @param locator - The locator of the element.
 * @param timeout - Maximum time to wait in milliseconds (default: 60 seconds).
 * @returns Promise<boolean> - True if the element is visible, false otherwise.
 */
export async function waitForElementVisible(
  object: Page | Locator,
  locator: string,
  timeout: number = 60000,
): Promise<boolean> {
  try {
    await object.locator(locator).waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if an element is visible and throws an error if not.
 * @param object - The page, locator, or frame context.
 * @param locatorOrResolvedLocator - The locator of the element or an already resolved locator.
 * @param timeout - Maximum time to wait in milliseconds (default: 2 seconds).
 * @returns Promise<boolean> - True if the element is visible.
 */
export async function isElementVisible(
  object: Page | Locator | FrameLocator,
  locator: string | Locator,
  timeout: number = 2000,
): Promise<boolean> {
  const resolvedLocator =
    typeof locator === "string" ? object.locator(locator) : locator;
  try {
    await resolvedLocator.waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clicks an element, optionally performing key presses during or after the click.
 * @param object - The page, frame context, or locator.
 * @param locator - The locator of the element or an already resolved locator.
 * @param timeout - Maximum time to wait for visibility (default: 2 seconds).
 * @param keyCombination - Optional key press or combination (e.g., 'Enter', 'Control+Enter').
 */

export async function clickElement(
  object: Page | Locator | FrameLocator,
  locator: string | Locator,
  timeout: number = 2000,
  keyCombination?: string | string[],
): Promise<void> {
  const resolvedLocator =
    typeof locator === "string" ? object.locator(locator) : locator;

  // Ensure the element is visible before clicking
  await isElementVisible(object, resolvedLocator, timeout);

  if ("click" in resolvedLocator) {
    await resolvedLocator.click();

    if (keyCombination && "keyboard" in object) {
      const page = object as Page;
      if (Array.isArray(keyCombination)) {
        for (const key of keyCombination) {
          await page.keyboard.press(key);
        }
      } else {
        await page.keyboard.press(keyCombination);
      }
    }
  } else {
    throw new Error("Unsupported object type for clickElement");
  }
}

/**
 * Type guard to check if an object is a Locator.
 * @param object - The object to check.
 * @returns True if the object is a Locator, false otherwise.
 */
function isLocator(object: any): object is Locator {
  return "click" in object && !("locator" in object);
}

/**
 * Fills a field with the specified value after ensuring visibility.
 * @param object - The page, locator, or frame context.
 * @param locatorOrResolvedLocator - The locator of the field or an already resolved locator.
 * @param value - The value to input.
 * @param timeout - Maximum time to wait for visibility (default: 2 seconds).
 */
export async function fillField(
  object: Page | Locator | FrameLocator,
  locatorOrResolvedLocator: string | Locator,
  value: string,
  timeout: number = 2000,
): Promise<void> {
  const resolvedLocator =
    typeof locatorOrResolvedLocator === "string"
      ? object.locator(locatorOrResolvedLocator)
      : locatorOrResolvedLocator;

  await isElementVisible(object, resolvedLocator, timeout);
  await resolvedLocator.fill(value);
}

/**
 * Checks if the page has fully loaded based on specific conditions.
 * @param object - The page context.
 * @param timeout - Maximum time to wait for the page to load (default: 60 seconds).
 * @returns Promise<boolean> - True if the page has loaded, false otherwise.
 */
export async function hasPageLoaded(
  object: Page,
  timeout: number = 60000,
): Promise<boolean> {
  try {
    await object.waitForLoadState("load", { timeout });
    return true;
  } catch {
    return false;
  }
}

export async function typeText(
  object: Page | FrameLocator | Locator,
  locator: string,
  text: string,
  timeout: number = 2000,
): Promise<void> {
  await isElementVisible(object, locator, timeout);

  let resolvedLocator: Locator;

  if ("locator" in object) {
    resolvedLocator = object.locator(locator);
  } else if ("press" in object) {
    resolvedLocator = object as Locator;
  } else {
    throw new Error("Unsupported object type for typeText");
  }

  try {
    await resolvedLocator.click(); // Ensure the field is focused

    // Use keyboard input instead of fill()
    await resolvedLocator.page().keyboard.type(text);
  } catch (error) {
    throw new Error(`Failed to type text: ${error}`);
  }
}
