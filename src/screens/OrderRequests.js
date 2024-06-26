import React, { Component } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import firebase from "../config/firebase";
import { connect } from "react-redux";
import { order_request } from "../store/action";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class OrderRequests extends Component {
  constructor() {
    super();
    this.state = {
      mainTab: "activeOrders", // For switching between Active and Past Orders
      activeSubTab: "pending", // For switching between Pending, Preparing, and Ready for Collection under Active Orders
      userDetails: null,
      reviewVisibility: {}, // Object to track visibility of each rating
    };
  }

  toggleReviewVisibility = (orderId) => {
    this.setState((prevState) => ({
      reviewVisibility: {
        ...prevState.reviewVisibility,
        [orderId]: !prevState.reviewVisibility[orderId], // Toggle the visibility for the specific order ID
      },
    }));
  };

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
  };

  handleActiveSubTabs = (tabName) => {
    this.setState({ activeSubTab: tabName });
  };

  handleUpdateOrderStatus = (userUid, orderId, newStatus) => {
    const { userDetails } = this.state;
    const restaurantUid = userDetails.userUid;
    // Step 1: Update the status in orderRequest and myOrder collections

    firebase
      .firestore()
      .collection("users")
      .doc(restaurantUid)
      .collection("orderRequest")
      .doc(orderId)
      .update({
        status: newStatus,
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(userUid)
          .collection("myOrder")
          .doc(orderId)
          .update({
            status: newStatus,
          })
          .then(() => {
            // After successfully updating the order status, switch to the relevant tab
            if (newStatus === "IN PROGRESS") {
              this.setState({ activeSubTab: "preparing" });
            } else if (newStatus === "READY FOR COLLECTION") {
              this.setState({ activeSubTab: "readyForCollection" });
            } else if (newStatus === "COLLECTED") {
              // Reference to the orders document with the restaurant's ID
              const ordersDocRestRef = firebase
                .firestore()
                .collection("orders")
                .doc(restaurantUid);

              // Reference to the orders document with the user's ID
              const ordersDocUserRef = firebase
                .firestore()
                .collection("orders")
                .doc(userUid);

              // Check if the orders document already exists - storing restrauant's all completed orders
              ordersDocRestRef.get().then((docSnapshot) => {
                if (!docSnapshot.exists) {
                  // Create the document with the restaurantUid as the document ID
                  ordersDocRestRef.set({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    // Any other initial data can be added here
                  });
                }
              });
              // Check if the orders document already exists - storing user's all completed orders
              ordersDocUserRef.get().then((docSnapshot) => {
                if (!docSnapshot.exists) {
                  // Create the document with the restaurantUid as the document ID
                  ordersDocUserRef.set({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    // Any other initial data can be added here
                  });
                }
              });

              // Retrieve the completed order data
              firebase
                .firestore()
                .collection("users")
                .doc(restaurantUid)
                .collection("orderRequest")
                .doc(orderId)
                .get()
                .then((completedOrderSnapshot) => {
                  const completedOrderData = completedOrderSnapshot.data();
                  // Add the completed order to the 'completedOrdersForOneRestaurant' subcollection
                  ordersDocRestRef
                    .collection("completedOrdersForOneRestaurant")
                    .doc(orderId)
                    .set(completedOrderData);

                  ordersDocUserRef
                    .collection("completedOrdersForOneUser")
                    .doc(orderId)
                    .set(completedOrderData);
                });
              // Update the UI state to show 'pastOrders'
              this.setState({ mainTab: "pastOrders" });
            }
          });
      });
  };

  _renderActiveOrders() {
    const { orderRequest } = this.props;
    const { activeSubTab } = this.state;
    if (orderRequest) {
        const filteredOrders = Object.keys(orderRequest).filter((key) => {
            const order = orderRequest[key];
            return (
                (activeSubTab === "pending" && order.status === "PENDING") ||
                (activeSubTab === "preparing" && order.status === "IN PROGRESS") ||
                (activeSubTab === "readyForCollection" && order.status === "READY FOR COLLECTION")
            );
        });

        if (filteredOrders.length === 0) {
          // Return a message when there are no orders to display
          return (
            <div className="text-center mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="text-muted">Check back later.</p>
                    <p>Been a while? You may not have orders due to limited food options.</p>
                    <button className="btn btn-primary" onClick={() => this.props.history.push('/add-menu-items')}>
                        Add Menu Items
                    </button>
                </div>
            </div>
        </div>
          );
      }

        // Return the list of orders if there are any
        return filteredOrders.map((key) => {
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
                                    {activeSubTab === "pending" && (
                                        <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, "IN PROGRESS")} className="btn btn-primary">
                                            Mark as Preparing
                                        </button>
                                    )}
                                    {activeSubTab === "preparing" && (
                                        <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, "READY FOR COLLECTION")} className="btn btn-secondary">
                                            Mark as Ready for Collection
                                        </button>
                                    )}
                                    {activeSubTab === "readyForCollection" && (
                                        <button onClick={() => this.handleUpdateOrderStatus(order.userUid, order.id, "COLLECTED")} className="btn btn-success">
                                            Mark as Collected
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }
}


  renderStars = (rating) => {
    // Ensure the rating is within the expected range
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - fullStars; // This should now never be negative

    return (
      <>
        {"★"
          .repeat(fullStars)
          .split("")
          .map((star, index) => (
            <span key={index} style={{ color: "#c13f86", marginRight: "2px" }}>
              {star}
            </span>
          ))}
        {"☆"
          .repeat(emptyStars)
          .split("")
          .map((star, index) => (
            <span key={index} style={{ color: "#1D0A15", marginRight: "2px" }}>
              {star}
            </span>
          ))}
      </>
    );
  };

  adjustInputSize = (element) => {
    if (element) {
      const length = element.value.length;
      element.size = Math.max(5, length); // Set the size attribute based on content length
    }
  };

  _renderPastOrders() {
    const { orderRequest } = this.props;
    if (!orderRequest || Object.keys(orderRequest).length === 0) {
      return (
          <div className="text-center mt-4">
              <div className="card shadow-sm">
                  <div className="card-body">
                      <p className="text-muted">No past orders yet.</p>
                      <p>Looking to see your completed orders here? Make sure all deliveries are marked correctly and check back later.</p>
                  </div>
              </div>
          </div>
      );
  }

    if (orderRequest) {
      return Object.keys(orderRequest)
        .filter((key) => orderRequest[key].status === "COLLECTED")
        .map((key) => {
          const order = orderRequest[key];
          const rating = Math.max(
            0,
            Math.min(5, parseFloat(order.rating || 0))
          ); // Safely parse the rating and ensure it's within the range 0-5

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
                          <img
                            style={{ width: "70px", height: "70px" }}
                            alt="Order Item"
                            src={item.itemImageUrl}
                          />
                        </div>
                        <div className="col-lg-7 col-md-6 col-sm-12 px-0">
                          <h6 className="">{item.itemTitle}</h6>
                          <p className="mb-1">
                            <small>{item.itemIngredients}</small>
                          </p>
                          <p className="mb-1">
                            <small>{item.review}</small>
                          </p>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-right">
                          <span style={{ fontSize: "14px" }} className="mx-3">
                            <b>{item.itemPrice}</b>
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <span>
                    <input
                      type="text"
                      value={
                        rating > 0 ? `${rating} / 5` : "Rating not available"
                      }
                      readOnly
                      className="rating-input"
                      ref={this.adjustInputSize} // Adjust size when element is mounted
                      placeholder="Rate this"
                    />
                    {this.renderStars(rating)}
                  </span>

                  <button
                    onClick={() => this.toggleReviewVisibility(order.id)}
                    className="btn button-toggle"
                    aria-expanded={this.state.reviewVisibility[order.id]}
                  >
                    {this.state.reviewVisibility[order.id]
                      ? "Hide Reviews "
                      : "Show Reviews "}
                    <span
                      className={
                        this.state.reviewVisibility[order.id]
                          ? "caret-up"
                          : "caret-down"
                      }
                    ></span>
                  </button>

                  {this.state.reviewVisibility[order.id] && (
                    <span>
                      {order.review ? (
                        <input
                          type="text"
                          value={order.review}
                          readOnly
                          style={{
                            width: "100%",
                            height: "50px", // or whatever height you prefer
                            overflow: "auto",
                            padding: "5px",
                            fontSize: "1em",
                            border: "1px solid #c13f86", // Set the border color

                            backgroundColor: "#fbf2f7", // Optional: matching the soft pink background
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value="Customer has not given review yet"
                          readOnly
                          style={{
                            width: "100%",
                            height: "50px", // or whatever height you prefer
                            overflow: "auto",
                            padding: "5px",
                            fontSize: "1em",
                            color: "grey",
                          }}
                        />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        });
    }
  }
  render() {
    const { mainTab, userDetails } = this.state;
    const activeSubTab = this.state.activeSubTab; // Correctly reference activeSubTab from state
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
                        <img
                          className="p-2 bg-white rounded text-center"
                          alt="Natural Healthy Food"
                          style={{ width: "60%" }}
                          src={userDetails.userProfileImageUrl}
                        />
                      </div>
                      <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
                        <h1 className="restaurant-title">
                          {userDetails.userName}
                        </h1>
                        <p className="restaurant-text">
                        {userDetails.typeOfFood ? userDetails.typeOfFood.join(", ") : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
          {/* Main tabs */}
          <div className={`col text-center tab ${mainTab === "activeOrders" ? "tab-active" : ""}`}
               onClick={() => this.handleMainTabs("activeOrders")}>
            Active Orders
          </div>
          <div className={`col text-center tab ${mainTab === "pastOrders" ? "tab-active" : ""}`}
               onClick={() => this.handleMainTabs("pastOrders")}>
            Past Orders
          </div>
        </div>
        {mainTab === "activeOrders" && (
          <div className="row">
            {/* Sub-tabs for Active Orders */}
            <div className={`col text-center tab ${activeSubTab === "pending" ? "tab-active" : ""}`}
                 onClick={() => this.handleActiveSubTabs("pending")}>
              Pending
            </div>
            <div className={`col text-center tab ${activeSubTab === "preparing" ? "tab-active" : ""}`}
                 onClick={() => this.handleActiveSubTabs("preparing")}>
              Preparing
            </div>
            <div className={`col text-center tab ${activeSubTab === "readyForCollection" ? "tab-active" : ""}`}
                 onClick={() => this.handleActiveSubTabs("readyForCollection")}>
              Ready for Collection
            </div>
          </div>
        )}
        <div className="order-section">
          {mainTab === "activeOrders" ? this._renderActiveOrders() : this._renderPastOrders()}
        </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  orderRequest: state.orderRequest,
});

const mapDispatchToProps = (dispatch) => ({
  order_request: () => dispatch(order_request()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequests);
