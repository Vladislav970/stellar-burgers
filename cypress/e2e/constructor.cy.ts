const apiUrl = 'https://norma.education-services.ru/api';

const selectors = {
  bun: '[data-cy=ingredient-test-bun-1]',
  main: '[data-cy=ingredient-test-main-1]',
  sauce: '[data-cy=ingredient-test-sauce-1]',
  bunTop: '[data-cy=constructor-bun-top]',
  bunBottom: '[data-cy=constructor-bun-bottom]',
  fillings: '[data-cy=constructor-ingredients]',
  bunTopEmpty: '[data-cy=constructor-bun-top-empty]',
  bunBottomEmpty: '[data-cy=constructor-bun-bottom-empty]',
  fillingsEmpty: '[data-cy=constructor-ingredients-empty]',
  total: '[data-cy=constructor-total]',
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]',
  ingredientDetailsName: '[data-cy=ingredient-details-name]',
  orderNumber: '[data-cy=order-number]'
};

const addIngredient = (selector: string) => {
  cy.get(selector).find('button').click();
};

const interceptIngredients = () => {
  cy.intercept('GET', `${apiUrl}/ingredients`, {
    fixture: 'ingredients.json'
  }).as('getIngredients');
};

const visitConstructor = () => {
  interceptIngredients();
  cy.visit('/');
  cy.wait('@getIngredients');
  cy.get(selectors.bun).should('contain', 'Test Bun');
};

describe('constructor page', () => {
  it('adds bun and fillings from ingredients list to constructor', () => {
    visitConstructor();

    addIngredient(selectors.bun);
    addIngredient(selectors.main);
    addIngredient(selectors.sauce);

    cy.get(selectors.bunTop).should('contain', 'Test Bun');
    cy.get(selectors.bunBottom).should('contain', 'Test Bun');
    cy.get(selectors.fillings).should('contain', 'Test Main');
    cy.get(selectors.fillings).should('contain', 'Test Sauce');
  });

  it('opens ingredient modal with selected ingredient data and closes by close button', () => {
    visitConstructor();

    cy.get('[data-cy=ingredient-link-test-main-1]').click();

    cy.location('pathname').should('eq', '/ingredients/test-main-1');
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.ingredientDetailsName).should('have.text', 'Test Main');

    cy.get(selectors.modalClose).click();

    cy.location('pathname').should('eq', '/');
    cy.get(selectors.modal).should('not.exist');
  });

  it('closes ingredient modal by overlay click', () => {
    visitConstructor();

    cy.get('[data-cy=ingredient-link-test-sauce-1]').click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.ingredientDetailsName).should('have.text', 'Test Sauce');

    cy.get(selectors.modalOverlay).click({ force: true });

    cy.location('pathname').should('eq', '/');
    cy.get(selectors.modal).should('not.exist');
  });

  it('creates order, shows order number, closes modal and clears constructor', () => {
    interceptIngredients();
    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', `${apiUrl}/orders`, {
      fixture: 'order.json'
    }).as('createOrder');
    cy.intercept('GET', `${apiUrl}/orders/all`, {
      fixture: 'orders.json'
    }).as('getFeed');
    cy.intercept('GET', `${apiUrl}/orders`, {
      fixture: 'orders.json'
    }).as('getProfileOrders');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token; path=/';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredient(selectors.bun);
    addIngredient(selectors.main);

    cy.get(selectors.total).find('button').click();

    cy.wait('@createOrder')
      .its('request.body.ingredients')
      .should('deep.equal', ['test-bun-1', 'test-main-1', 'test-bun-1']);
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.orderNumber).should('have.text', '777');

    cy.get(selectors.modalClose).click();

    cy.get(selectors.modal).should('not.exist');
    cy.get(selectors.bunTopEmpty).should('exist');
    cy.get(selectors.bunBottomEmpty).should('exist');
    cy.get(selectors.fillingsEmpty).should('exist');
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });
});
