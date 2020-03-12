import React, { Component } from 'react';
import {
	injectStripe,
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
} from 'react-stripe-elements'
import axios from 'axios'

class PaymentForm extends Component {

	async payWithStripe() {
		await this.props.stripe.createToken().then(response => {
			if (response.token) {
				try {
					this.performPayment(response.token)
				}
				catch {

				}
			}

		})
	}

	async performPayment(token) {
		let orderResponse = await axios.put(
			`http://localhost:3000/api/orders/${this.props.orderDetails.id}`,
			{
				activity: 'finalize',
				stripeToken: token
			}
		)
		if (orderResponse.data.paid === true) {
			this.props.finalizeOrder(orderResponse.data.message)
		} else {
			debugger
		}
	}

	render() {
		return (
			<>
				<label>Card number </label>
				<CardNumberElement />
				<label>Expiry Date</label>
				<CardExpiryElement />
				<label>CVC</label>
				<CardCVCElement />
				<button onClick={this.payWithStripe.bind(this)}>Submit</button>
			</>
		);
	}
}

export default injectStripe(PaymentForm);