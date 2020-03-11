import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StripeProvider } from 'react-stripe-elements'
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/";

ReactDOM.render(
	<StripeProvider apiKey={'pk_test_QicERB8w3kyqaYW3hUUQylRH'}>
		<App />
	</StripeProvider>

	, document.getElementById('root'));

serviceWorker.unregister();
