describe("Home", () => {
  it("shows App Shell OK", () => {
    cy.visit("/");
    cy.contains("App Shell OK").should("be.visible");
  });
});
