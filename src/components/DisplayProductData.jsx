import React, { Component } from 'react';
import { getData } from '../modules/productData';
import axios from 'axios'

class DisplayProductData extends Component {
	state = {
		productData: [],
		message: {},
		orderDetails: {},
		showOrder: false,
		orderTotal: ''
	}

	componentDidMount() {
		this.getProductData()
	}

	async getProductData() {
		let result = await getData();
		this.setState({ productData: result.data.products })
	}

	async addToOrder(event) {
		let id = event.target.parentElement.dataset.id
		let result
		if (this.state.orderDetails.hasOwnProperty('id') && this.state.orderDetails.finalized === false) {
			result = await axios.put(`http://localhost:3000/api/orders/${this.state.orderDetails.id}`, { product_id: id })
		} else {
			result = await axios.post('http://localhost:3000/api/orders', { product_id: id })
		}
		this.setState({ message: { id: id, message: result.data.message }, orderDetails: result.data.order })
	}

	async finalizeOrder() {
		let orderTotal = this.state.orderDetails.order_total
		let result = await axios.put(`http://localhost:3000/api/orders/${this.state.orderDetails.id}`, { activity: 'finalize' })
		this.setState({ message: { id: 0, message: result.data.message }, orderTotal: orderTotal,   orderDetails: {}})
	}

	render() {
		let dataIndex, orderDetailsDisplay
		if (Array.isArray(this.state.productData) && this.state.productData.length) {
			dataIndex = (
				<div id="index">
					{this.state.productData.map(item => {
						return (
							<div key={item.id} id={`product-${item.id}`} data-id={item.id} data-price={item.price}>
								{`${item.name} ${item.description} - ${item.price}kr `}
								<button onClick={this.addToOrder.bind(this)}>Add to order</button>
								{parseInt(this.state.message.id) === item.id &&
									<p className='message'>{this.state.message.message}</p>
								}
							</div>
						)
					})}
				</div>
			)
		}
		if (this.state.orderDetails.hasOwnProperty('products')) {
			orderDetailsDisplay = this.state.orderDetails.products.map(item => {
				return <li key={item.name}>{`${item.amount} x ${item.name}`}</li>
			})
		}

		return (
			<>
				{this.state.message.id === 0 &&
					<h2 className='message'>{this.state.message.message}</h2>
				}
				{this.state.orderDetails.hasOwnProperty('products') &&
					<button onClick={() => this.setState({ showOrder: !this.state.showOrder })}>View order</button>
				}
				{this.state.showOrder &&
					<>
						<ul id="order-details">
							{orderDetailsDisplay}
						</ul>
						<p>To pay: {this.state.orderDetails.order_total || this.state.orderTotal} kr</p>
						<button onClick={this.finalizeOrder.bind(this)}>Confirm!</button>
					</>
				}
				{dataIndex}
			</>
		)
	}
}

export default DisplayProductData;