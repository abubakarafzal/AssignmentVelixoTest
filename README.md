Here is the updated `README.md` to include instructions for running tests against the QA environment:

```markdown
# Abubakar Task 2 Velixo

A project for automating Excel tasks using Playwright and TypeScript.

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd {repository-name}
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the root of the project and add your environment variables:
   ```plaintext
   EXCEL_USERNAME=your-email@example.com
   EXCEL_PASSWORD=your-password
   BASE_URL=https://qa.office.live.com/
   BROWSER_NAME=chromium
   HEADLESS=true
   ```

2. (Optional) Create a `.env.qa` file for QA environment variables:
   ```plaintext
   EXCEL_USERNAME=qa_user@outlook.com
   EXCEL_PASSWORD=qa_password
   BASE_URL=https://qa.office.live.com/
   BROWSER_NAME=chromium
   HEADLESS=true
   ```

## Usage

### Running Tests

- Run tests in headed mode:
  ```sh
  npm run test:headed
  ```

- Run tests with the Playwright UI:
  ```sh
  npm run test:ui
  ```

- Run tests against the QA environment:
  ```sh
  npm run test:qa
  ```

### Formatting Code

- Format code:
  ```sh
  npm run format
  ```

- Check code formatting:
  ```sh
  npm run format:check
  ```

## Project Structure

- `src/pages`: Contains page object models.
- `src/tests`: Contains test files.
- `src/utils`: Contains utility functions.

## License

This project is licensed under the ISC License.
```

Make sure to replace `<repository-url>` with the actual URL of your repository.