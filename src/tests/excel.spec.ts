import {
  test,
  expect,
  chromium,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ExcelPage } from "../pages/ExcelPage";
import config from "../config/config.json";
import dotenv from "dotenv";

dotenv.config();

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let excelPage: ExcelPage;
let newExcelPage: Page;
//
// const username =
//   config.credentials.username?.trim() || process.env.EXCEL_USERNAME;
// const password =
//   config.credentials.password?.trim() || process.env.EXCEL_PASSWORD;
const username = process.env.EXCEL_USERNAME;
const password = process.env.EXCEL_PASSWORD;
if (!username || !password) {
  throw new Error(
    "Username or password is not defined. Please check your configuration and environment variables.",
  );
}

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
  excelPage = new ExcelPage(page);

  page.setDefaultTimeout(10000);

  const excelUrlPath = "/start/Excel.aspx";

  await page.goto(excelUrlPath);
  await loginPage.login(username, password);
  newExcelPage = await excelPage.createBlankWorkbook();
});

test.afterAll(async () => {
  await browser.close();
});

test("Test-01 Validate the today function in Excel", async () => {
  const today = new Date();
  await excelPage.enterFormulaInCell(newExcelPage, "A1", "=TODAY()");
  await excelPage.dismissNotification(newExcelPage);

  const expectedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  await excelPage.verifyCellData(newExcelPage, "A1", expectedDate);
});
