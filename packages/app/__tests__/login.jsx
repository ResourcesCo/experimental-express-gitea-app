describe('GitHub', () => {
  it('should show the login page', async () => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveText('button', 'Sign In with GitHub');
    await page.click('"Sign In with GitHub"');
    await page.screenshot({path: 'test/screenshots/oauth-sign-in.png'});
    await page.fill('[name=login]', process.env.GITHUB_TEST_USERNAME);
    await page.fill('[name=password]', process.env.GITHUB_TEST_PASSWORD);
    await page.click('[type=submit]');
    await page.screenshot({path: '__tests__/screenshots/after-submit-oauth-login-form-1.png'});
    await page.waitForTimeout(500);
    await page.screenshot({path: '__tests__/screenshots/after-submit-oauth-login-form-2.png'});
    await page.waitForTimeout(1000);
    await page.screenshot({path: '__tests__/screenshots/after-submit-oauth-login-form-3.png'});
    await page.waitForTimeout(1500);
    await page.screenshot({path: '__tests__/screenshots/after-submit-oauth-login-form-4.png'});
    await page.waitForSelector('"Sign Up"');
    await expect(page).toHaveText('Sign Up');
  });
});
