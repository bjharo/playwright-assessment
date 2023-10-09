# Henry Meds Assessment

This repo contains a small demo of using Playwright to test a small dev site. This language used in Typescript.

## Requirements

- macOS Ventura or Windows 11
  - Older versions may work but they have not been tested
- Node v20.8.0
  - Older versions may work but they have not been tested

## Executing Tests

1. Clone this repository to your machine.
2. Open a terminal and go to the folder where you cloned this repository.
3. Run these commands. You will only need to run them once.
```
npm install
npx playwright install
```
4. To run the tests, use this command:
```
npx playwright test
```

## Notes about the Tests

- I created a very basic set of tests in order to not spend an overly large amount of time. For test cases that I would have liked to implement but did not, I added skipped tests to the spec files with descriptions of what they would do.
- Currently, the tests are only set to run in Chromium. This can be changed in the `playwright.config.ts` file if you wish to do so. I did try to have at least two browsers running at once but I encountered random test errors. My guess is that I was trying to make my system do too much as once. Tests running in parallel albeit with just one browser appears to be stable.
- The tests are not running in headless mode for demonstration purposes. Again, this can be changed in the config file.