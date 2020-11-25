describe('GitHub', () => {
  it('should show the login page', async () => {
    await page.goto('http://localhost:3000/login');
    await page.click('"Sign In with Gitea"');
    await page.fill('[name=user_name]', process.env.GITEA_USERNAME);
    await page.fill('[name=password]', process.env.GITEA_PASSWORD);
    await page.click('button.green');
    await page.waitForTimeout(1000);
    const matchedSel = await Promise.race(['"Authorize Application"', '"Sign Up"'].map(async sel => {
      await page.waitForSelector(sel);
      return sel;
    }));
    if (matchedSel === '"Authorize Application"') {
      await page.click('"Authorize Application"');
      await page.waitForSelector('"Sign Up"');
    }
    await expect(page).toHaveText('Sign Up');
    await page.fill('#email', process.env.GITEA_EMAIL);
    await page.fill('#first_name', 'DJ');
    await page.fill('#last_name', 'Test');
    await page.check('#accepted_terms');
    await page.focus('#first_name');
    await page.click('button[type=submit]');
    await page.waitForSelector('"DT"');
    await expect(page).toHaveText('DT');
  });
});
