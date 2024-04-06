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
      reviews: {}, // Holds review texts keyed by order IDs
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
  handleReviewChange(value, orderId) {
    this.setState((prevState) => ({
      reviews: {
        ...prevState.reviews,
        [orderId]: value, // Update the review for the specific order ID
      },
    }));
  }

  //Review logic;
  submitReview = (order) => {
    if (!order.restaurantId || order.restaurantId.trim() === "") {
      console.error("Restaurant ID is missing for the order.");
      alert(
        "There was an issue submitting your review due to missing information."
      );
      return;
    }

    // Fetch the review from the component's state
    const review = this.state.reviews[order.id] || "";
    if (review.trim() === "") {
      alert("Please enter a review before submitting.");
      return;
    }

    // //     const docRef = firebase.firestore().collection('orders').doc('yourDocumentId');
    alert(order.id); // This will log 'yourDocumentId'

    // // Define references to Firestore documents
    // const ordersDocUserRef = firebase
    //   .firestore()
    //   .collection("orders")
    //   .doc(order.customerId) // Assuming customerId is valid and exists
    //   .collection("completedOrdersForOneUser")
    //   .doc(order.id); // Targeting the specific order by its ID

    // const ordersDocRestaurantRef = firebase
    //   .firestore()
    //   .collection("orders")
    //   .doc(order.restaurantId) // Using restaurantId to navigate to the correct document
    //   .collection("completedOrdersForOneRestaurant")
    //   .doc(order.id); // Targeting the specific order by its ID

    // // Firestore operation to update review for the user's order
    // ordersDocUserRef
    //   .update({ review: review })
    //   .then(() => alert("Review submitted successfully for the user!"))
    //   .catch((error) => console.error("Error submitting user review: ", error));

    // // Firestore operation to update review for the restaurant's order
    // ordersDocRestaurantRef
    //   .update({ review: review })
    //   .then(() => alert("Review submitted successfully for the restaurant!"))
    //   .catch((error) =>
    //     console.error("Error submitting restaurant review: ", error)
    //   );
        //     const docRef = firebase.firestore().collection('orders').doc('yourDocumentId');
        //alert(order.id); // This will log 'yourDocumentId'

        // Define references to Firestore documents
        const ordersDocUserRef = firebase
          .firestore()
          .collection("users")
          .doc(order.customerId) // Assuming customerId is valid and exists
          .collection("myOrder")
          .doc(order.id); // Targeting the specific order by its ID
    
        const ordersDocRestaurantRef = firebase
          .firestore()
          .collection("users")
          .doc(order.restaurantId) // Using restaurantId to navigate to the correct document
          .collection("orderRequest")
          .doc(order.id); // Targeting the specific order by its ID
    
        // Firestore operation to update review for the user's order
        ordersDocUserRef
          .update({ review: review })
          .then(() => alert("Review submitted successfully for the user!"))
          .catch((error) => console.error("Error submitting user review: ", error));
    
        // Firestore operation to update review for the restaurant's order
        ordersDocRestaurantRef
          .update({ review: review })
          .then(() => alert("Review submitted successfully for the restaurant!"))
          .catch((error) =>
            console.error("Error submitting restaurant review: ", error)
          );
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  width: "100%", // Container width
                  height: "100px", // Container height
                }}
              >
                <img
                  style={{
                    maxWidth: "100%", // Image maximum width is 100% of its container
                    maxHeight: "100%", // Image maximum height is 100% of its container
                    objectFit: "contain", // Image will be scaled to maintain its aspect ratio
                  }}
                  className="order-image"
                  alt="Order Item"
                  src={
                    order.itemsList[Object.keys(order.itemsList)[0]]
                      .itemImageUrl
                  }
                />
              </div>

              <div className="order-details">
                <h5 className="order-title">
                  {order.itemsList[Object.keys(order.itemsList)[0]].itemTitle} $
                  {order.itemsList[Object.keys(order.itemsList)[0]].itemPrice}{" "}
                  Surprise Box
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
                <a href="/#" className="details-link">
                  View More Details &rarr;
                </a>
              </div>
            </div>
          </div>
        ));
    }
    return null; // Render nothing if there are no orders
  }

  _renderPastOrders() {
    const { myOrder } = this.props;
    const { reviews } = this.state; // Destructure reviews from state
    if (myOrder) {
      return myOrder
        .filter((order) => order.status === "COLLECTED")
        .map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  width: "100%", // Container width
                  height: "100px", // Container height
                }}
              >
                <img
                  style={{
                    maxWidth: "100%", // Image maximum width is 100% of its container
                    maxHeight: "100%", // Image maximum height is 100% of its container
                    objectFit: "contain", // Image will be scaled to maintain its aspect ratio
                  }}
                  className="order-image"
                  alt="Order Item"
                  src={
                    order.itemsList[Object.keys(order.itemsList)[0]]
                      .itemImageUrl
                  }
                />
              </div>

              <div className="order-details">
                <h5 className="order-title">
                  {order.itemsList[Object.keys(order.itemsList)[0]].itemTitle} $
                  {order.itemsList[Object.keys(order.itemsList)[0]].itemPrice}{" "}
                  Surprise Box
                </h5>
                <div className="order-status">
                  <span className="status-indicator delivered"></span>
                  <span>Order has already been collected!</span>
                </div>
                <a href="/#" className="details-link">
                  View More Details &rarr;
                </a>
              </div>
              {/* Review Section */}

              <div className="review-section">
                <input
                  type="text"
                  placeholder="Enter your review"
                  className="review-input"
                  value={reviews[order.id] || ""} // Use order ID to manage each review
                  onChange={(e) =>
                    this.handleReviewChange(e.target.value, order.id)
                  }
                />
                <button
                  onClick={() => this.submitReview(order)}
                  className="btn btn-primary submit-review-btn"
                >
                  Submit Review
                </button>
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
