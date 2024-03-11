import React, { Component } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import firebase from '../config/firebase';
import { connect } from 'react-redux';
import { order_request } from '../store/action';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class OrderRequests extends Component {
    constructor() {
        super();
        this.state = {
            mainTab: 'activeOrders', // For switching between Active and Past Orders
            activeSubTab: 'pending', // For switching between Pending, Preparing, and Ready for Collection under Active Orders
            userDetails: null,
        };
    }

    async componentDidMount() {
        this.props.order_request();
    }

    static getDerivedStateFromProps(props) {
        const { user } = props;
        return {
            userDetails: user,
        };
    }

    handleMainTabs = (tabName) => {
        this.setState({ mainTab: tabName });
    }

    handleActiveSubTabs = (tabName) => {
        this.setState({ activeSubTab: tabName });
    }

    handleUpdateOrderStatus = (userUid, orderId, newStatus) => {
        const { userDetails } = this.state;
        const restaurantUid = userDetails.userUid;
        firebase.firestore().collection('users').doc(restaurantUid).collection('orderRequest').doc(orderId).update({
            status: newStatus,
        }).then(() => {
            firebase.firestore().collection('users').doc(userUid).collection('myOrder').doc(orderId).update({
                status: newStatus,
            });
        });
    }

    _renderActiveOrders() {
        const { orderRequest } = this.props;
        const { activeSubTab } = this.state;
        if (orderRequest) {
            return Object.keys(orderRequest).filter(key => {
                const order = orderRequest[key];
                return (activeSubTab === 'pending' && order.status === 'PENDING') ||
                       (activeSubTab === 'preparing' && order.status === 'IN PROGRESS') ||
                       (activeSubTab === 'readyForCollection' && order.status === 'READY FOR COLLECTION');
            }).map(key => {
                const order = orderRequest[key];
                return (
                    <div className="container border-bottom pb-2 mb-4" key={order.id}>
                        <div className="row">
                            <div className="col-12">
                                <h5>{order.userName}</h5>
                                <span className="order-status">{order.status}</span>
                                {Object.keys(order.itemsList).map((itemKey) => {
                                    const item = order.itemsList[itemKey];
                                    return (
                                        <div key={itemKey} className="orderreqcontainer">
                                            <div className="col-lg-2 col-md-3 col-8 offset-2 offset-lg-0 offset-md-0 px-0 mb-3 text-center">
                                                <img style={{ width: "70px", height: "70px" }} alt="Order Item" src={item.itemImageUrl} />
                                            </div>
                                            <div className="col-lg-7 col-md-6 col-sm-12 px-0">
                                                <h6 className="">{item.itemTitle}</h6>
                                                <p className="mb-1"><small>{item.itemIngredients}</small></p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-right">
                                                <span style={{ fontSize: "14px" }} className="mx-3"><b>{item.itemPrice}</b></span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="row">
                                    <div className="col-12">
                                        {activeSubTab === 'pending' && 
                                            <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, 'IN PROGRESS')} className="btn btn-primary">Mark as Preparing</button>}
                                        {activeSubTab === 'preparing' && 
                                            <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, 'READY FOR COLLECTION')} className="btn btn-secondary">Mark as Ready for Collection</button>}
                                        {activeSubTab === 'readyForCollection' && 
                                            <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, 'COLLECTED')} className="btn btn-success">Mark as Collected</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    }

    _renderPastOrders() {
        const { orderRequest } = this.props;
        if (orderRequest) {
            return Object.keys(orderRequest).filter(key => orderRequest[key].status === 'COLLECTED').map(key => {
                const order = orderRequest[key];
                return (
                    <div className="container border-bottom pb-2 mb-4" key={order.id}>
                        <div className="row">
                            <div className="col-12">
                                <h5>{order.userName}</h5>
                                <span className="order-status">{order.status}</span>
                                {Object.keys(order.itemsList).map((itemKey) => {
                                    const item = order.itemsList[itemKey];
                                    return (
                                        <div key={itemKey} className="orderreqcontainer">
                                            <div className="col-lg-2 col-md-3 col-8 offset-2 offset-lg-0 offset-md-0 px-0 mb-3 text-center">
                                                <img style={{ width: "70px", height: "70px" }} alt="Order Item" src={item.itemImageUrl} />
                                            </div>
                                            <div className="col-lg-7 col-md-6 col-sm-12 px-0">
                                                <h6 className="">{item.itemTitle}</h6>
                                                <p className="mb-1"><small>{item.itemIngredients}</small></p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-right">
                                                <span style={{ fontSize: "14px" }} className="mx-3"><b>{item.itemPrice}</b></span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            });
        }
    }
    render() {
        const { mainTab, userDetails } = this.state;
        return (
            <div>
                <div className="container-fluid">
                    <div className="container-fluid res-details-cont1">
                        <div className="">
                            <Navbar2 history={this.props.history} />
                            <div className="container px-0 res-details-cont1-text mx-0">
                                <div className="container">
                                    {userDetails && (
                                        <div className="row">
                                            <div className="col-lg-2 col-md-3 col-6 text-lg-center text-md-center pr-0 mb-2">
                                                <img className="p-2 bg-white rounded text-center" alt="User Profile" style={{ width: "60%" }} src={userDetails.userProfileImageUrl} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
    <div className={`col text-center ${mainTab === 'activeOrders' ? 'order-req-tab-active' : 'order-req-tab'}`} onClick={() => this.handleMainTabs('activeOrders')}>
        Active Orders
    </div>
    <div className={`col text-center ${mainTab === 'pastOrders' ? 'order-req-tab-active' : 'order-req-tab'}`} onClick={() => this.handleMainTabs('pastOrders')}>
        Past Orders
    </div>
</div>

                    {mainTab === 'activeOrders' && (
                        <div className="row">
                            <div className={`col text-center ${this.state.activeSubTab === 'pending' ? 'order-req-tab-active' : ''}`} onClick={() => this.handleActiveSubTabs('pending')}>
                                Pending
                            </div>
                            <div className={`col text-center ${this.state.activeSubTab === 'preparing' ? 'order-req-tab-active' : ''}`} onClick={() => this.handleActiveSubTabs('preparing')}>
                                Preparing
                            </div>
                            <div className={`col text-center ${this.state.activeSubTab === 'readyForCollection' ? 'order-req-tab-active' : ''}`} onClick={() => this.handleActiveSubTabs('readyForCollection')}>
                                Ready for Collection
                            </div>
                        </div>
                    )}
                    <div className="order-section">
                        {mainTab === 'activeOrders' && this._renderActiveOrders()}
                        {mainTab === 'pastOrders' && this._renderPastOrders()}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    
}

const mapStateToProps = state => ({
    user: state.user,
    orderRequest: state.orderRequest,
});

const mapDispatchToProps = dispatch => ({
    order_request: () => dispatch(order_request()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequests);