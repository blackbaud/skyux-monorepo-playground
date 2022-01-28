describe('indicators', () => {
  beforeEach(() => {
    cy.visit('/iframe.html?id=alert--primary');
    cy.viewport(1200, 800);
  });

  it('should match screenshot', () => {
    cy.screenshot();
    cy.percySnapshot();
  });
});
