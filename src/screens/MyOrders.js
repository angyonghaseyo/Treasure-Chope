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
      ratings: {}, // Additional state for storing ratings
      existingRatings: {}, // State to track existing ratings
    };
  }

  componentDidMount() {
    this.props.my_order(); // Fetch orders
    this.fetchExistingReviewsAndRatings(); // Fetch existing reviews and ratings
  }

  fetchExistingReviewsAndRatings = () => {
    const orders = this.props.myOrder || [];
    if (orders.length === 0) {
      setTimeout(this.fetchExistingReviewsAndRatings, 1000); // Ensure this is correctly retrying or handling cases where data might be slow to load.
      return;
    }

    orders.forEach((order) => {
      if (!order.customerId || !order.restaurantId) {
        console.error("Missing customer ID or restaurant ID in order:", order);
        return;
      }

      this.fetchReviewAndRating(order, "myOrder");
      this.fetchReviewAndRating(order, "orderRequest");
    });
  };

  fetchReviewAndRating = (order, collectionName) => {
    const orderRef = firebase
      .firestore()
      .collection("users")
      .doc(order[collectionName === "myOrder" ? "customerId" : "restaurantId"])
      .collection(collectionName)
      .doc(order.id);

    orderRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let updates = {};
          if (doc.data().review) {
            updates = {
              ...updates,
              existingReviews: {
                ...this.state.existingReviews,
                [order.id]: doc.data().review,
              },
              reviews: { ...this.state.reviews, [order.id]: doc.data().review },
            };
          }
          if (doc.data().rating) {
            updates = {
              ...updates,
              existingRatings: {
                ...this.state.existingRatings,
                [order.id]: doc.data().rating,
              },
              ratings: { ...this.state.ratings, [order.id]: doc.data().rating },
            };
          }
          this.setState(updates);
        }
      })
      .catch((error) =>
        console.error("Error fetching data for order:", order.id, error)
      );
  };

  submitReviewAndRating = (order) => {
    if (
      !order.restaurantId ||
      order.restaurantId.trim() === "" ||
      this.state.existingReviews[order.id] ||
      this.state.existingRatings[order.id]
    ) {
      console.error("Submission blocked due to existing review or rating.");
      alert(
        "Review or rating already submitted or necessary information missing."
      );
      return;
    }

    const review = this.state.reviews[order.id] || "";
    const rating = this.state.ratings[order.id] || "";

    if (review.trim() === "" || !(rating >= 1 && rating <= 5)) {
      alert(
        "Please enter a review and a valid rating (1-5) before submitting."
      );
      return;
    }

    const updateData = { review: review, rating: parseInt(rating) };
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

    Promise.all([
      ordersDocUserRef.update(updateData),
      ordersDocRestaurantRef.update(updateData),
    ])
      .then(() => {
        const restaurantDocRef = firebase
          .firestore()
          .collection("users")
          .doc(order.restaurantId);

        firebase
          .firestore()
          .runTransaction((transaction) => {
            return transaction.get(restaurantDocRef).then((doc) => {
              if (!doc.exists) {
                throw new Error("Document does not exist!");
              }

              // Get the current value of the required fields or initialize them if they don't exist
              let totalRatingSummation = doc.data().totalRatingSummation || 0;
              let totalOrdersRated = doc.data().totalOrdersRated || 0;

              // Perform the increment
              transaction.update(restaurantDocRef, {
                totalRatingSummation:
                  parseInt(totalRatingSummation) + parseInt(rating),
                totalOrdersRated: totalOrdersRated + 1,
              });
            });
          })
          .then(() => {
            console.log(
              "successfully updated restaurant's totalOrderRated and totalRatingSummation "
            );
          })
          .catch((error) => {
            console.error("Transaction failed: ", error);
            console.log(
              "Failed to update estaurant's totalOrderRated and totalRatingSummation"
            );
          });

        alert("Review and rating submitted successfully!");
        this.setState((prevState) => ({
          existingReviews: { ...prevState.existingReviews, [order.id]: review },
          existingRatings: {
            ...prevState.existingRatings,
            [order.id]: parseInt(rating),
          },
        }));
      })
      .catch((error) => {
        console.error("Error submitting review and rating: ", error);
        alert("Failed to submit review and rating.");
      });
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

  handleReviewChange = (value, orderId, type) => {
    if (type === "ratings") {
      // Parse the rating as an integer only if it's a rating update
      this.setState((prevState) => ({
        [type]: {
          ...prevState[type],
          [orderId]: parseInt(value),
        },
      }));
    } else {
      // Handle text updates for reviews as regular strings
      this.setState((prevState) => ({
        [type]: {
          ...prevState[type],
          [orderId]: value,
        },
      }));
    }
  };

  cancelOrder = (order) => {
    console.log("Received order for cancellation:", order.id);
  
    // References to the order documents in Firebase Firestore
    const userOrderRef = firebase.firestore()
      .collection("users")
      .doc(order.customerId)
      .collection("myOrder")
      .doc(order.id);
  console.log(userOrderRef)
    const restaurantOrderRef = firebase.firestore()
      .collection("users")
      .doc(order.restaurantId)
      .collection("orderRequest")
      .doc(order.id);
  console.log(restaurantOrderRef)
    // First check the order status from the user's perspective
    userOrderRef.get().then(doc => {
      if (!doc.exists) {
        alert("No such order exists or it has already been deleted.");
        return;
      }
      if (doc.data().status === "PENDING") {
        // Delete the order from both user's and restaurant's collections
        Promise.all([userOrderRef.delete(), restaurantOrderRef.delete()])
          .then(() => {
            alert("Order has been cancelled and deleted successfully.");
            this.props.my_order(); // Refresh the order list
          })
          .catch((error) => {
            console.error("Error deleting the order:", error);
            alert("Failed to delete the order. Error: " + error.message);
          });
      } else {
        alert("Order cannot be cancelled because it is not in 'PENDING' status.");
      }
    }).catch((error) => {
      console.error("Error retrieving order details:", error);
      alert("Failed to retrieve order details. Error: " + error.message);
    });
  };
  
  
  
  
  

  // Modify the render method or specific component that renders each order
  _renderActiveOrders() {
    const { myOrder } = this.props;
    return myOrder
      ? myOrder
          .filter((order) =>
            ["PENDING", "IN PROGRESS", "READY FOR COLLECTION"].includes(
              order.status
            )
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
                          <span>{order.status}</span>
                        </div>
                        {order.status === "PENDING" && (
                         <button onClick={() => this.cancelOrder(order)}>Cancel Order</button>

                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
      : null;
  }

  renderStars = (rating, orderId) => {
    const maxRating = 5; // Define the maximum number of stars
    return (
      <div>
        {Array.from({ length: maxRating }, (_, index) => (
          <span
            key={index}
            style={{
              cursor: "pointer",
              color: index < rating ? "#c13f86" : "#ccc", // Highlighted if less than current rating
              marginRight: "5px",
              fontSize: "20px", // Larger font size for better clickability
            }}
            onClick={() =>
              this.handleReviewChange(index + 1, orderId, "ratings")
            }
            aria-label={`Rate ${index + 1} stars`}
          >
            {index < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  _renderPastOrders() {
    const { myOrder } = this.props;
    const { reviews, existingReviews } = this.state;
    return myOrder
      ? myOrder
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
                      </div>
                    </div>
                  );
                })}
                <div className="review-section">
                  Review :
                  <input
                    type="text"
                    placeholder="Enter your review"
                    className="review-input"
                    style={{
                      width: "100%",
                      padding: "10px",
                      boxSizing: "border-box",
                    }} // Added inline styles
                    value={reviews[order.id] || ""}
                    onChange={(e) =>
                      this.handleReviewChange(
                        e.target.value,
                        order.id,
                        "reviews"
                      )
                    }
                    disabled={!!existingReviews[order.id]}
                  />
                  <br></br>
                  Rating :
                  {this.renderStars(
                    this.state.ratings[order.id] || 0,
                    order.id
                  )}
                  <br></br>
                  <br></br>
                  <button
                    onClick={() => this.submitReviewAndRating(order)}
                    className="btn btn-primary submit-rating-btn"
                    disabled={
                      !!this.state.existingRatings[order.id] &&
                      !!this.state.existingReviews[order.id]
                    }
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          ))
      : null;
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
                      alt="User Profile"
                      style={{ width: "60%" }}
                      src={userDetails.userProfileImageUrl}
                    />
                  </div>
                  <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
                    <h1 className="user-title">{userDetails.userName}</h1>
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
