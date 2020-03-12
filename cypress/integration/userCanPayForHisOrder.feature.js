import DisplayProductData from '../../src/components/DisplayProductData'

describe('User can add a product to his/her order', () => {

	beforeEach(() => {
		cy.server();
		cy.route({
			method: 'GET',
			url: 'http://localhost:3000/api/products',
			response: 'fixture:product_data.json'
		})

		cy.route({
			method: 'POST',
			url: 'http://localhost:3000/api/orders',
			// response: { message: 'The product has been added to your order', order_id: 1 }
			response: 'fixture:post_response.json'
		})

		cy.route({
			method: 'PUT',
			url: 'http://localhost:3000/api/orders/1',
			response: 'fixture:put_response.json'
		})

		cy.visit('http://localhost:3001')
		cy.get('#product-2').within(() => {
			cy.get('button').contains('Add to order').click()
		})
		cy.get('#product-3').within(() => {
			cy.get('button').contains('Add to order').click()
		})
		cy.get('button').contains('View order').click()
	});



	it('user can pay for his order', () => {
		cy.route({
			method: 'PUT',
			url: 'http://localhost:3000/api/orders/1',
			body: { activity: 'finalize' },
			response: { paid: true, message: 'Your order will be ready in 30 minutes!' }
		})
		cy.get('button').contains('Confirm!').click()

		cy.get('#payment-form').should('exist')
		cy.wait(1000)
		cy.get('iframe[name^="__privateStripeFrame5"]').then($iframe => {
			const $body = $iframe.contents().find('body')
			cy.wrap($body)
				.find('input[name="cardnumber"]')
				.type("4242424242424242", { delay: 50 })
		})

		cy.get('iframe[name^="__privateStripeFrame6"]').then($iframe => {
			const $body = $iframe.contents().find("body");
			cy.wrap($body)
				.find('input[name="exp-date"]')
				.type("1222", { delay: 10 });
		});
		cy.get('iframe[name^="__privateStripeFrame7"]').then($iframe => {
			const $body = $iframe.contents().find("body");
			cy.wrap($body)
				.find('input[name="cvc"]')
				.type("999", { delay: 10 });
		});

		cy.get('button').contains('Submit').click()

		cy.get('#payment-form').should('not.exist')
		cy.get('.message').should('contain', "Your order will be ready in 30 minutes!")
	});

});