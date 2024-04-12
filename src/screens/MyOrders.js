import React, { Component } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { my_order } from "../store/action";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "../config/firebase";

class MyOrders extends Component {
  constructor() {
    super();
    this.state = {
      tab1: "col-12 col-lg-6 text-center order-req-tab-active",
      tab2: "col-12 col-lg-6 text-center",
      tab1Content: true,
      tab2Content: false,
      reviews: {},
      existingReviews: {},
    };
  }

  componentDidMount() {
    this.props.my_order();  // This should populate props.myOrder from Redux
    this.fetchExistingReviews();  // This fetches reviews from Firestore
}

fetchExistingReviews = () => {
    // Check if orders are available from props
    const orders = this.props.myOrder || [];
    if (orders.length === 0) {
        // Optionally add a delay or retry mechanism if orders are not immediately available
        setTimeout(this.fetchExistingReviews, 1000); // Retry after 1 second
        return;
    }

    orders.forEach((order) => {
        if (!order.customerId || !order.restaurantId) {
            console.error("Missing customer ID or restaurant ID in order:", order);
            return; // Skip this iteration if necessary IDs are missing
        }

        this.fetchReview(order, "myOrder");
        this.fetchReview(order, "orderRequest");
    });
};

fetchReview = (order, collectionName) => {
    const orderRef = firebase.firestore().collection("users").doc(order[collectionName === "myOrder" ? "customerId" : "restaurantId"]).collection(collectionName).doc(order.id);

    orderRef.get().then((doc) => {
        if (doc.exists && doc.data().review) {
            this.setState((prevState) => ({
                existingReviews: {
                    ...prevState.existingReviews,
                    [order.id]: doc.data().review,
                },
                reviews: {
                    ...prevState.reviews,
                    [order.id]: doc.data().review,
                },
            }));
        }
    }).catch(error => console.error("Failed to fetch review for order:", order.id, error));
};


  // componentDidMount() {
  //   this.props.my_order();
  //   this.fetchExistingReviews();
  // }

  // fetchExistingReviews = () => {
  //   const orders = this.props.myOrder || [];
  //   orders.forEach((order) => {
  //     if (!order.customerId || !order.restaurantId) {
  //       console.error("Missing customer ID or restaurant ID in order:", order);
  //       return; // Skip this iteration if necessary IDs are missing
  //     }

  //     const userOrderRef = firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(order.customerId)
  //       .collection("myOrder")
  //       .doc(order.id);
  //     const restaurantOrderRef = firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(order.restaurantId)
  //       .collection("orderRequest")
  //       .doc(order.id);

  //     userOrderRef.get().then((doc) => {
  //       if (doc.exists && doc.data().review) {
  //         this.setState((prevState) => ({
  //           existingReviews: {
  //             ...prevState.existingReviews,
  //             [order.id]: doc.data().review,
  //           },
  //           reviews: { ...prevState.reviews, [order.id]: doc.data().review },
  //         }));
  //       }
  //     });

  //     restaurantOrderRef.get().then((doc) => {
  //       if (doc.exists && doc.data().review) {
  //         this.setState((prevState) => ({
  //           existingReviews: {
  //             ...prevState.existingReviews,
  //             [order.id]: doc.data().review,
  //           },
  //           reviews: { ...prevState.reviews, [order.id]: doc.data().review },
  //         }));
  //       }
  //     });
  //   });
  // };

  submitReview = (order) => {
    if (
      !order.restaurantId ||
      order.restaurantId.trim() === "" ||
      this.state.existingReviews[order.id]
    ) {
      console.error(
        "Review submission blocked due to missing information or existing review."
      );
      alert("Review already submitted or necessary information missing.");
      return;
    }

    const review = this.state.reviews[order.id] || "";
    if (review.trim() === "") {
      alert("Please enter a review before submitting.");
      return;
    }

    const ordersDocUserRef = firebase
      .firestore()
      .collection("users")
      .doc(order.customerId)
      .collection("myOrder")
      .doc(order.id);
    const ordersDocRestaurantRef = firebase
      .firestore()
      .collection("users")
      .doc(order.restaurantId)
      .collection("orderRequest")
      .doc(order.id);

    ordersDocUserRef
      .update({ review: review })
      .then(() => {
        alert("Review submitted successfully for the user!");
        this.setState((prevState) => ({
          existingReviews: { ...prevState.existingReviews, [order.id]: review },
        }));
      })
      .catch((error) => console.error("Error submitting user review: ", error));

    ordersDocRestaurantRef
      .update({ review: review })
      .then(() => {
        alert("Review submitted successfully for the restaurant!");
        this.setState((prevState) => ({
          existingReviews: { ...prevState.existingReviews, [order.id]: review },
        }));
      })
      .catch((error) =>
        console.error("Error submitting restaurant review: ", error)
      );
  };

  handleTabs = (tabName) => {
    if (tabName === "tab1") {
      this.setState({
        tab1: "col-12 col-lg-6 text-center order-req-tab-active",
        tab2: "col-12 col-lg-6 text-center",
        tab1Content: true,
        tab2Content: false,
      });
    } else if (tabName === "tab2") {
      this.setState({
        tab1: "col-12 col-lg-6 text-center",
        tab2: "col-12 col-lg-6 text-center order-req-tab-active",
        tab1Content: false,
        tab2Content: true,
      });
    }
  };

  handleReviewChange = (value, orderId) => {
    this.setState((prevState) => ({
      reviews: {
        ...prevState.reviews,
        [orderId]: value,
      },
    }));
  };

  _renderActiveOrders() {
    const { myOrder } = this.props;
    if (myOrder) {
      return myOrder
        .filter(
          (order) =>
            order.status === "PENDING" ||
            order.status === "IN PROGRESS" ||
            order.status === "READY FOR COLLECTION"
        )
        .map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-item">
              {Object.keys(order.itemsList).map((itemKey) => {
                const item = order.itemsList[itemKey];
                return (
                  <div key={itemKey} className="order-content">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        width: "100%",
                        height: "100px",
                      }}
                    >
                      <img
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        className="order-image"
                        alt="Order Item"
                        src={item.itemImageUrl}
                      />
                    </div>
                    <div className="order-details">
                      <h5 className="order-title">
                        {item.itemTitle} ${item.itemPrice} Surprise Box
                      </h5>
                      <div className="order-status">
                        <span
                          className={`status-indicator ${order.status.toLowerCase()}`}
                        ></span>
                        <span>
                          {
                            order.status === "PENDING"
                              ? "Order is awaiting acceptance from the restaurant"
                              : order.status === "IN PROGRESS"
                              ? "Order is being prepared"
                              : order.status === "READY FOR COLLECTION"
                              ? "Order is ready for collection"
                              : "" // Fallback text if needed
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ));
    }
    return null; // Render nothing if there are no orders
  }

  _renderPastOrders() {
    const { myOrder } = this.props;
    const { reviews, existingReviews } = this.state;
    if (myOrder) {
      return myOrder
        .filter((order) => order.status === "COLLECTED")
        .map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-item">
              {Object.keys(order.itemsList).map((itemKey) => {
                const item = order.itemsList[itemKey];
                return (
                  <div key={itemKey} className="order-content">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        width: "100%",
                        height: "100px",
                      }}
                    >
                      <img
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        className="order-image"
                        alt="Order Item"
                        src={item.itemImageUrl}
                      />
                    </div>
                    <div className="order-details">
                      <h5 className="order-title">
                        {item.itemTitle} ${item.itemPrice} Surprise Box
                      </h5>
                      <div className="order-status">
                        <span
                          className={`status-indicator ${order.status.toLowerCase()}`}
                        ></span>
                        <span>
                          {
                            order.status === "PENDING"
                              ? "Order is awaiting acceptance from the restaurant"
                              : order.status === "IN PROGRESS"
                              ? "Order is being prepared"
                              : order.status === "READY FOR COLLECTION"
                              ? "Order is ready for collection"
                              : "" // Fallback text if needed
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="review-section">
                <input
                  type="text"
                  placeholder="Enter your review"
                  className="review-input"
                  value={reviews[order.id] || ""}
                  onChange={(e) =>
                    this.handleReviewChange(e.target.value, order.id)
                  }
                  disabled={!!existingReviews[order.id]}
                />
                <button
                  onClick={() => this.submitReview(order)}
                  className="btn btn-primary submit-review-btn"
                  disabled={!!existingReviews[order.id]}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        ));
    }
    return null; // Render nothing if there are no past orders
  }

  render() {
    const { tab1, tab2, tab1Content, tab2Content, userDetails } = this.state;
    return (
      <div>
        <div className="container-fluid myorderspage-bgd">
          <Navbar2 history={this.props.history} />
          <div className="container px-0 myorderspage-bgd-text mx-0">
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
                    <h1 className="restaurant-title">{userDetails.userName}</h1>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ background: "#EBEDF3" }} className="container-fluid py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 col-md-10 col-sm-12 offset-lg-1 offset-md-1">
                <div className="container">
                  <div className="row">
                    <div
                      className={tab1}
                      onClick={() => this.handleTabs("tab1")}
                    >
                      <p className="order-req-tab-text">
                        <FontAwesomeIcon icon="spinner" className="mr-3" />
                        Active Orders
                      </p>
                    </div>
                    <div
                      className={tab2}
                      onClick={() => this.handleTabs("tab2")}
                    >
                      <p className="order-req-tab-text">
                        <FontAwesomeIcon icon="tasks" className="mr-3" />
                        Past Orders
                      </p>
                    </div>
                  </div>
                  {tab1Content && (
                    <div className="row pending-order-section">
                      <div className="col-12 bg-white p-4">
                        {this._renderActiveOrders()}
                      </div>
                    </div>
                  )}
                  {tab2Content && (
                    <div className="row delivered-order-section">
                      <div className="col-12 bg-white p-4">
                        {this._renderPastOrders()}
                      </div>
                    </div>
                  )}
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
    myOrder: state.myOrder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    my_order: () => dispatch(my_order()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
