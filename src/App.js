import React, { Component } from 'react';
import MyRoutes from './config/routes'
import { Provider } from 'react-redux';
import store from './store'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faStar, faHeart, faPhone, faEnvelope, faSearch, faUtensils,
  faThumbsUp, faSortAlphaDown, faUserMinus, faDollarSign, faAngleDoubleRight, faPlus,
  faConciergeBell, faCommentAlt, faInfoCircle, faShoppingBasket, faTimes, faSpinner, faTruck, faTasks,
} from '@fortawesome/free-solid-svg-icons';

// for stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// check if is correct path
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe key is not set in environment variables');
}
library.add(faStar, faHeart, faPhone, faEnvelope, faSearch, faUtensils,
  faThumbsUp, faSortAlphaDown, faUserMinus, faDollarSign, faAngleDoubleRight, faPlus,
  faConciergeBell, faCommentAlt, faInfoCircle, faShoppingBasket, faTimes, faSpinner, faTruck, faTasks,)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <MyRoutes />
        </div>
      </Provider>
    );
  }
}

export default App;