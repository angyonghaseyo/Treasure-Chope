import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { my_order } from '../store/action';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MyOrders extends Component {
    constructor() {
        super();
        this.state = {
            tab1: "col-12 col-lg-6 text-center order-req-tab-active",
            tab2: "col-12 col-lg-6 text-center",
            tab1Content: true,
            tab2Content: false,
        };
    }

    async componentDidMount() {
        this.props.my_order();
    }

    static getDerivedStateFromProps(props) {
        const { user } = props;
        return {
            userDetails: user,
        };
    }

    handleTabs(e) {
        if (e === "tab1") {
            this.setState({
                tab1: "col-12 col-lg-6 text-center order-req-tab-active",
                tab2: "col-12 col-lg-6 text-center",
                tab1Content: true,
                tab2Content: false,
            });
        } else if (e === "tab2") {
            this.setState({
                tab1: "col-12 col-lg-6 text-center",
                tab2: "col-12 col-lg-6 text-center order-req-tab-active",
                tab1Content: false,
                tab2Content: true,
            });
        }
    }

    _renderActiveOrders() {
        const { myOrder } = this.props;
        if (myOrder) {
            return myOrder.filter(order => order.status === "PENDING" || order.status === "READY").map((order) => (
                <div className="order-card" key={order.id}>
                    <div className="order-item">
                        <img className="order-image" alt="Order Item" src={order.itemsList[Object.keys(order.itemsList)[0]].itemImageUrl} />
                        <div className="order-details">
                            <h5 className="order-title">
                                {order.itemsList[Object.keys(order.itemsList)[0]].itemTitle} ${order.itemsList[Object.keys(order.itemsList)[0]].itemPrice} Surprise Box
                            </h5>
                            <div className="order-status">
                                <span className={`status-indicator ${order.status.toLowerCase()}`}></span>
                                <span>{order.status === "PENDING" ? "Order is being prepared" : "Ready for pickup"}</span>
                            </div>
                            <a href="/#" className="details-link">View More Details &rarr;</a>
                        </div>
                    </div>
                </div>
            ));
        }
    }

    _renderPastOrders() {
        const { myOrder } = this.props;
        if (myOrder) {
            return myOrder.filter(order => order.status === "DELIVERED").map((order) => (
                <div className="order-card" key={order.id}>
                    <div className="order-item">
                        <img className="order-image" alt="Order Item" src={order.itemsList[Object.keys(order.itemsList)[0]].itemImageUrl} />
                        <div className="order-details">
                            <h5 className="order-title">
                                {order.itemsList[Object.keys(order.itemsList)[0]].itemTitle} ${order.itemsList[Object.keys(order.itemsList)[0]].itemPrice} Surprise Box
                            </h5>
                            <div className="order-status">
                                <span className="status-indicator delivered"></span>
                                <span>Order Delivered</span>
                            </div>
                            <a href="/#" className="details-link">View More Details &rarr;</a>
                        </div>
                    </div>
                </div>
            ));
        }
    }


    render() {
        const { tab1, tab2, tab1Content, tab2Content, userDetails } = this.state;
        return (
            <div>
                <div className="container-fluid myorderspage-bgd">
                    <Navbar2 history={this.props.history} />
                    <div className="container px-0 myorderspage-bgd-text mx-0">
                        <div className="container">
                            {userDetails && 
                                <div className="row">
                                    <div className="col-lg-2 col-md-3 col-6 text-lg-center text-md-center pr-0 mb-2">
                                        <img className="p-2 bg-white rounded text-center" alt="Natural Healthy Food" style={{ width: "60%" }} src={userDetails.userProfileImageUrl} />
                                    </div>
                                    <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
                                        <h1 className="restaurant-title">{userDetails.userName}</h1>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div style={{ background: "#EBEDF3" }} className="container-fluid py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 col-md-10 col-sm-12 offset-lg-1 offset-md-1">
                                <div className="container">
                                    <div className="row">
                                        <div className={tab1} onClick={() => this.handleTabs("tab1")}>
                                            <p className="order-req-tab-text"><FontAwesomeIcon icon="spinner" className="mr-3" />Active Orders</p>
                                        </div>
                                        <div className={tab2} onClick={() => this.handleTabs("tab2")}>
                                            <p className="order-req-tab-text"><FontAwesomeIcon icon="tasks" className="mr-3" />Past Orders</p>
                                        </div>
                                    </div>
                                    {tab1Content &&
                                        <div className="row pending-order-section">
                                            <div className="col-12 bg-white p-4">
                                                {this._renderActiveOrders()}              
                                            </div>
                                        </div>
                                    }
                                    {tab2Content && 
                                        <div className="row delivered-order-section">
                                            <div className="col-12 bg-white p-4">
                                                {this._renderPastOrders()}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        myOrder: state.myOrder,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        my_order: () => dispatch(my_order()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);