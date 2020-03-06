import React, { Component } from 'react';
import { getData } from '../modules/productData';
import axios from 'axios'

class DisplayProductData extends Component {
	state = {
		productData: [],
		message: {},
		orderId: ''
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
		if (this.state.orderId !== "") {
			result = await axios.put(`http://localhost:3000/api/orders/${this.state.orderId}`, { product_id: id })
		} else {
			result = await axios.post('http://localhost:3000/api/orders', { product_id: id } )
		}
		this.setState({message: {id: id, message: result.data.message}, orderId: result.data.order_id})
	}

	render() {
		let dataIndex
		if (Array.isArray(this.state.productData) && this.state.productData.length) {
			dataIndex = (
				<div id="index">
					{this.state.productData.map(item => {
						return (
							<div key={item.id} id={`product-${item.id}`} data-id={item.id} data-price={item.price}>
								{`${item.name} ${item.description} ${item.price}`}
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

		return (
			<div>
				{dataIndex}
			</div>
		)
	}
}

export default DisplayProductData;