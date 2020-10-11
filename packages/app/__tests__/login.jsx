describe("GitHub", () => {
  it("should show the login page", async () => {
    await page.goto("http://localhost:3000/login");
    await expect(page).toHaveText("button", "Sign In");
  });
});
