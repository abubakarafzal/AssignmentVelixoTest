import { Page } from '@playwright/test';
import {
  clickElement,
  fillField,
  isElementVisible,
  hasPageLoaded,
} from '../utils/helper';

export class LoginPage {
  constructor(private page: Page) {}

  private loginLocators = {
    signInButton: 'text="Sign in"',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    userNameSubmitBtn: 'input[type="submit"]',
    passSubmitBtn: 'button[type="submit"]',
    staySignInModal: '#kmsiTitle',
    textButtonContainer: '[data-testid="textButtonContainer"]',
    acceptButton: '#acceptButton',
    emailScreenHeader: 'div#loginHeader:has-text("Sign in")',
    userDisplayName: 'div#userDisplayName',
    passwordScreenHeader: 'div#loginHeader:has-text("Enter password")',
  };

  async login(
    username: any,
    password: any,
    options: { checkPageLoaded?: boolean } = { checkPageLoaded: true },
  ) {
    const DEFAULT_TIMEOUT = 30000; // Default timeout for the first interaction

    // Ensure the email screen is loaded
    await clickElement(
      this.page,
      this.loginLocators.signInButton,
      DEFAULT_TIMEOUT,
    );
    if (
      !(await isElementVisible(this.page, this.loginLocators.emailScreenHeader))
    ) {
      throw new Error('Email screen did not load correctly');
    }

    // Fill in the username/email field
    await fillField(
      this.page,
      this.loginLocators.emailInput,
      username,
      DEFAULT_TIMEOUT,
    );

    // Click the "Next" button after entering username/email
    await clickElement(
      this.page,
      this.loginLocators.userNameSubmitBtn,
      DEFAULT_TIMEOUT,
    );

    // Verify that the displayed email matches the provided username
    const displayedEmail = await this.page
      .locator(this.loginLocators.userDisplayName)
      .textContent();
    if (displayedEmail?.trim() !== username) {
      throw new Error(
        `Displayed email (${displayedEmail?.trim()}) does not match provided username (${username})`,
      );
    }

    if (
      !(await isElementVisible(
        this.page,
        this.loginLocators.passwordScreenHeader,
      ))
    ) {
      throw new Error('Password screen did not load correctly');
    }

    // Fill in the password field
    await fillField(
      this.page,
      this.loginLocators.passwordInput,
      password,
      DEFAULT_TIMEOUT,
    );

    // Click the "Sign In" button after entering password
    await clickElement(
      this.page,
      this.loginLocators.passSubmitBtn,
      DEFAULT_TIMEOUT,
    );

    // Handle "Stay signed in?" prompt
    const staySignInModal = this.page.locator(
      this.loginLocators.staySignInModal,
    );
    if (await isElementVisible(this.page, this.loginLocators.staySignInModal)) {
      const titleText = await staySignInModal.textContent();
      if (titleText?.trim() === 'Stay signed in?') {
        const acceptButton = this.page.locator(
          `${this.loginLocators.textButtonContainer} >> ${this.loginLocators.acceptButton}`,
        );

        // Ensure the "Accept" button in the prompt is visible
        if (
          !(await isElementVisible(
            this.page,
            `${this.loginLocators.textButtonContainer} >> ${this.loginLocators.acceptButton}`,
          ))
        ) {
          throw new Error(
            'Accept button in "Stay signed in?" prompt is not visible',
          );
        }

        // Click the "Accept" button
        await clickElement(
          this.page,
          `${this.loginLocators.textButtonContainer} >> ${this.loginLocators.acceptButton}`,
          DEFAULT_TIMEOUT,
        );
      }
    }

    // Verify the page has fully loaded after login, if specified
    if (options.checkPageLoaded && !(await hasPageLoaded(this.page))) {
      throw new Error('Page did not load correctly after login');
    }
  }
}
