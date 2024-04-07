import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import firebase from '../config/firebase'; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

class PaymentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientSecret: null, 
            error: ''
        };
    }

    componentDidMount() {
        this.setState({
            clientSecret: 'your_client_secret_here' 
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const stripe = await stripePromise;
        const elements = stripe.elements();
        const cardElement = elements.getElement(CardElement);

        if (!stripe || !cardElement) {
            Swal.fire("Error", "Stripe has not loaded yet!", "error");
            return;
        }

        const {error, paymentIntent} = await stripe.confirmCardPayment(this.state.clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Customer Name', 
                },
            },
        });

        if (error) {
            this.setState({ error: error.message });
            Swal.fire("Payment Error", error.message, "error");
        } else {
            Swal.fire("Success", "Payment processed successfully!", "success");
            this.props.history.push('/my-orders'); 
        }
    }

    render() {
        return (
            <div>
                <Navbar2 />
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <CardElement />
                        <button type="submit" className="btn btn-primary">Pay</button>
                    </form>
                    {this.state.error && <p className="text-danger">{this.state.error}</p>}
                </div>
                <Footer />
            </div>
        );
    }
}

export default PaymentForm;
