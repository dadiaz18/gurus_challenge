class TodoPage {
    
    constructor(){
        this.api_url = 'https://mysterious-thicket-31854.herokuapp.com/';
        this.list_of_elements = '#todo-list>li';
        this.main_input = '#new-todo';
        this.main_section = '#main';
    }
    
    //UI Methods
    visit = () => {
        cy.visit('');
    }

    getApiURL = () => {
        return this.api_url;
    }

    getMainInput = () => {
        return cy.get(this.main_input);
    }

    addValueToList = (value) => {
        this.getMainInput().click().type(value).type('{enter}');
    }

    modifyFirstElementFromListWithValue = (value, new_value) => {
        cy.get(this.list_of_elements)
        .find('label')
        .contains(value)
        .first()
        .parent('div')
        .parent().invoke('attr', 'class', 'editing')
        .find('input[value="'+ value + '"]')
        .clear()
        .type(new_value).type('{enter}');
    }

    deleteFirstElementFromListWithValue = (value) => {
        cy.get(this.list_of_elements)
        .find('label')
        .contains(value)
        .first()
        .parent('div')
        .find('button').invoke('show').click()
    }

    checkValueOnList = (value) => {
        cy.get(this.list_of_elements)
        .should('be.visible')
        .find('label')
        .contains(value)
        .first().should('have.text', value)
    }

    checkThatValueNotExistsOnList = (value) => {
        cy.get(this.main_section)
        .should('be.visible')
        .find('label')
        .invoke('text')
        .should('not.contain', value);
    }

    //Api Methods
    addValueByAPI = () => {
        //actions
        let random_value = 'value_by_api' + Date.now().toString();
        cy.request('GET', this.api_url)
        .then((response) =>{
            expect(response).property('status').to.equal(200);
        })
        .its('body')
        .then((body) => {
            cy.request('POST', this.api_url, {
                title: random_value,
                order: body.length + 1,
                completed: false,
            })
        })
        .then((response) => {
            expect(response).property('status').to.equal(200);
        })
        .its('body')
        .then((body) => {
            expect(body.title).to.equal(random_value)
        })
        cy.log(random_value);
        return random_value;
    }
}
export default new TodoPage();