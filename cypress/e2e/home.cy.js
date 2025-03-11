
describe("Home Page", () => {
    it("visits the home page", () => {
        cy.visit("http://localhost:3000/");
        cy.contains("Home");

        cy.contains("Dashboard").click();
        cy.url().should("include", "/dashboard");

        cy.contains("Posts").click();
        cy.url().should("include", "/dashboard/posts");

        cy.contains("Settings").click();
        cy.url().should("include", "/dashboard/settings");

        cy.contains("Home").click();
    });
});