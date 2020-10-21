describe('GitHub', () => {
  it('should show the login page', async () => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveText('button', 'Sign In with GitHub');
    await page.click('"Sign In with GitHub"');
    await page.fill('[name=login]', process.env.GITHUB_TEST_USERNAME);
    await page.fill('[name=password]', process.env.GITHUB_TEST_PASSWORD);
    await page.click('[type=submit]');
    await page.waitForSelector('"Sign Up"');
    await expect(page).toHaveText('Sign Up');
  });
});
