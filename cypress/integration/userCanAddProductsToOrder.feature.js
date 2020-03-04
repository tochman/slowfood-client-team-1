describe('User can add a product to his/her order', () => {

	before(() => {
		cy.server();
		cy.route({
			method: 'GET',
			url: 'http://localhost:3000/api/products',
			response: 'fixture:product_data.json'
		})

		cy.route({
			method: 'POST',
			url: 'http://localhost:3000/api/orders',
			response: { message: 'The product has been added to your order' }
		})
	});

	it('user get a confirmation message when adding product to order', () => {
		cy.visit('http://localhost:3001')
		cy.get('#product-2').within(()=>{
			cy.get('button').contains('Add to order').click()
		})
		cy.wait(500)
		cy.get('#product-2').within(()=>{
			cy.get('p .message').should('contain', "The product has been added to your order")
		})
	});

});