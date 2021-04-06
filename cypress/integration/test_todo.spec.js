import TodoPage from '../support/pages/todo_page';

context('Challenge Suite', () => {
  
      
    it('Check Added Value', () => {
        let random_value = 'value_by_ui' + Date.now().toString();
        TodoPage.visit();
        TodoPage.addValueToList(random_value);
        TodoPage.checkValueOnList(random_value);
    })

    it('Check Modified Value', () => {
        let random_value = 'modified_value' + Date.now().toString();
        let generated_value = TodoPage.addValueByAPI();
        cy.log(random_value);
        TodoPage.visit();
        cy.log(generated_value)
        TodoPage.modifyFirstElementFromListWithValue(generated_value, random_value);
        TodoPage.checkValueOnList(random_value);
    })

    it('Check Delete Value', () => {
        let generated_value = TodoPage.addValueByAPI();
        TodoPage.visit();
        cy.log(generated_value)
        TodoPage.deleteFirstElementFromListWithValue(generated_value);
        TodoPage.checkThatValueNotExistsOnList(generated_value);
    })

    it('Check Added Value With Mock response', () => {
        let random_value = 'value_by_ui' + Date.now().toString();
        let message = 'You do not have permissions to do this action'
        TodoPage.visit();
        cy.intercept({
            method:'POST',
            url: TodoPage.getApiURL()
        },{
            statusCode: 403,
            body:{error: message},
            headers: { 'access-control-allow-origin': '*' },
            delayMs: 5000,
        }).as('insertValue')
        TodoPage.addValueToList(random_value);
        cy.wait('@insertValue').should(({request, response}) =>{
            expect(response.statusCode).be.equal(403);
            cy.log(response.message)
        })
    })
  
  })
  