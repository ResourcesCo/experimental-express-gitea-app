module.exports = {
  // browsers: ["chromium", "firefox", "webkit"],
  browsers: ["chromium"],
  launchOptions: {
    headless: process.env.HEADLESS !== 'false'
  }
}