import { expect, Page } from "@playwright/test";
import {
  isElementVisible,
  fillField,
  hasPageLoaded,
  clickElement,
  typeText,
} from "../utils/helper";

export class ExcelPage {
  constructor(private page: Page) {}

  private excelLocators = {
    createBlankWorkbookButton: 'div[aria-label="Blank workbook"]',
    applicationContainer: 'div[id="applicationOuterContainer"]',
    bars: 'div[id="AdditionalBars"]',
    cellInputSelectorwrapper: 'div[id="FormulaBar-NameBoxwrapper"]',
    cellInputSelector: "input#FormulaBar-NameBox-input",
    formulaInputSelector: "#formulaBarTextDivId",
    autoFontSize: "#FontSize-input",
  };

  async createBlankWorkbook(): Promise<Page> {
    const DEFAULT_TIMEOUT = 30000;

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      clickElement(
        this.page,
        this.excelLocators.createBlankWorkbookButton,
        DEFAULT_TIMEOUT,
      ),
    ]);

    if (!(await hasPageLoaded(newPage))) {
      throw new Error("The new Excel page did not load correctly");
    }

    return newPage;
  }

  async enterFormulaInCell(
    newExcelPage: Page,
    cellName: string,
    formula: string,
  ): Promise<void> {
    const DEFAULT_TIMEOUT = 10000;
    const iframe = newExcelPage.frameLocator("#WacFrame_Excel_0");

    await isElementVisible(
      iframe,
      this.excelLocators.cellInputSelector,
      DEFAULT_TIMEOUT,
    );
    await clickElement(
      iframe,
      this.excelLocators.cellInputSelector,
      DEFAULT_TIMEOUT,
    );
    await fillField(
      iframe,
      this.excelLocators.cellInputSelector,
      cellName,
      DEFAULT_TIMEOUT,
    );
    await iframe.locator(this.excelLocators.cellInputSelector).press("Enter");
    await clickElement(
      iframe,
      this.excelLocators.formulaInputSelector,
      DEFAULT_TIMEOUT,
    );
    await typeText(
      iframe,
      this.excelLocators.formulaInputSelector,
      formula,
      DEFAULT_TIMEOUT,
    );
    await iframe
      .locator(this.excelLocators.formulaInputSelector)
      .press("Control+Enter");
  }

  async dismissNotification(newExcelPage: Page): Promise<void> {
    const iframe = newExcelPage.frameLocator("#WacFrame_Excel_0");
    await newExcelPage.waitForTimeout(2000);
    const closeButton = iframe.locator('button.ms-Button[aria-label="Close"]');
    await closeButton.first().click();
  }

  async retrieveCellData(
    newExcelPage: Page,
    cellName: string,
  ): Promise<string> {
    const DEFAULT_TIMEOUT = 10000;
    const iframe = newExcelPage.frameLocator("#WacFrame_Excel_0");
    const fontSizeInput = iframe.locator(this.excelLocators.autoFontSize);
    await fontSizeInput.waitFor({ state: "visible" });
    await fontSizeInput.fill("8");
    await fontSizeInput.press("Enter");
    const element = await iframe
      .locator(`label[aria-label*="${cellName}"]`)
      .nth(0);
    const ariaLabel = await element.getAttribute("aria-label");
    if (ariaLabel) {
      const cellData = ariaLabel.split(" . ")[0];
      return cellData;
    }
    throw new Error(`Unable to retrieve data for cell ${cellName}`);
  }

  async verifyCellData(
    newExcelPage: Page,
    cellName: string,
    expectedDate: string,
  ): Promise<void> {
    const actualDate = await this.retrieveCellData(newExcelPage, cellName);
    expect(actualDate).toBe(expectedDate);
  }
}
