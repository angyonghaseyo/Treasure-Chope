import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import firebase from "../config/firebase";
import { connect } from "react-redux";
import { orderNow } from "../config/firebase";
import Swal from "sweetalert2";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import qrCodeImage from "../assets/images/qrCodeImage.png";

class RestaurantDetails extends Component {
  constructor() {
    super();
    this.state = {
      tab1: "col-12 col-lg-4 col-md-4 text-center res-details-tab-active",
      tab2: "col-12 col-lg-4 col-md-4 text-center",
      tab3: "col-12 col-lg-4 col-md-4 text-center",
      tab1Content: true,
      tab2Content: false,
      tab3Content: false,
      cartItemsList: [],
      totalPrice: 0,
      showCartList: false,
      reviews: [],
    };
  }

  async componentDidMount() {
    const { state } = await this.props.location;
    this.fetchMenuItems();
    if (state) {
      this.setState({
        resDetails: state,
      });
    } else {
      this.props.history.push("/restaurants");
    }
  }

  static getDerivedStateFromProps(props) {
    const { state } = props.location;
    const { user } = props;
    return {
      resDetails: state,
      userDetails: user,
    };
  }

  // fetchReviews = async () => {
  //   const { resDetails } = this.state;
  //   let reviewsList = [];

  //   try {
  //     const ordersSnapshot = await firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(resDetails.id)
  //       .collection("orderRequest")
  //       .where("status", "==", "COLLECTED")
  //       .get();

  //     const userFetchPromises = ordersSnapshot.docs.map(async (doc) => {
  //       const data = doc.data();
  //       console.log("data is fetched: " + data + " " + data.review);
  //       if (data.review && data.userEmail) {
  //         console.log("am i here");
  //         const userSnapshot = await firebase
  //           .firestore()
  //           .collection("users")
  //           .where("email", "==", data.userEmail) // Make sure the field name is correct
  //           .get();
  //         console.log("userSnapshot: ", userSnapshot.docs[0].data().name);

  //         if (!userSnapshot.empty) {
  //           const userData = userSnapshot.docs[0].data();
  //           console.log(
  //             userData.name + data.review + data.totalRatingSummation
  //           );
  //           return {
  //             reviewerName: userData.name, // Make sure userData contains 'name'
  //             reviewText: data.review,
  //             // Make sure you are calculating the rating correctly
  //             rating: data.totalRatingSummation / data.totalOrdersRated,
  //           };
  //         } else {
  //           // Handle the case where the user is not found
  //           return null;
  //         }
  //       }
  //       return null;
  //     });

  //     // Wait for all user fetch promises to complete
  //     const fetchedReviews = await Promise.all(userFetchPromises);
  //     console.log("fetchedReviews: ", fetchedReviews);

  //     // Filter out any nulls in case some user details couldn't be fetched
  //     reviewsList = fetchedReviews.filter((review) => review !== null);
  //     console.log("reviewsList: ", reviewsList);

  //     // Finally, update the state with the fetched reviews
  //     this.setState({ reviews: reviewsList });
  //   } catch (error) {
  //     console.error("Error fetching reviews: ", error);
  //   }
  // };

  fetchReviews = async () => {
    const { resDetails } = this.state;
    let reviewsList = [];

    try {
      const ordersSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(resDetails.id)
        .collection("orderRequest")
        .where("status", "==", "COLLECTED")
        .get();

      if (ordersSnapshot.empty) {
        console.log("No orders with status 'COLLECTED' found.");
        return; // Early return if no orders are found
      }

      const userFetchPromises = ordersSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (data.review && data.userEmail) {
          const userSnapshot = await firebase
            .firestore()
            .collection("users")
            .where("userEmail", "==", data.userEmail)
            .get();

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            console.log("userData: ", userData);
            console.log(data.review, data.rating);
            console.log(userData.userProfileImageUrl);
            return {
              reviewerPhoto: userData.userProfileImageUrl,
              reviewerName: userData.userName,
              reviewText: data.review,
              rating: data.rating,
            };
          } else {
            console.log(`No user found with email: ${data.userEmail}`);
            return null; // Return null if no user data found
          }
        }
        return null;
      });

      const fetchedReviews = await Promise.all(userFetchPromises);
      reviewsList = fetchedReviews.filter((review) => review !== null);
      this.setState({ reviews: reviewsList });
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  handleTabs(e) {
    const newState = {
      tab1: "col-12 col-lg-4 col-md-4 text-center",
      tab2: "col-12 col-lg-4 col-md-4 text-center",
      tab3: "col-12 col-lg-4 col-md-4 text-center",
      tab1Content: false,
      tab2Content: false,
      tab3Content: false,
    };

    // Update the active tab and content visibility based on the selected tab
    if (e === "tab1") {
      newState.tab1 += " res-details-tab-active";
      newState.tab1Content = true;
    } else if (e === "tab2") {
      newState.tab2 += " res-details-tab-active";
      newState.tab2Content = true;
      // Fetch reviews only when the Reviews tab is selected
      this.fetchReviews(); // This line calls fetchReviews when tab2 is activated
    } else if (e === "tab3") {
      newState.tab3 += " res-details-tab-active";
      newState.tab3Content = true;
    }

    // Apply the updated state
    this.setState(newState);
  }

  fetchMenuItems(category) {
    const { resDetails } = this.state;
    let query = firebase
      .firestore()
      .collection("users")
      .doc(resDetails.id)
      .collection("menuItems");

    if (category) {
      query = query.where("chooseItemType", "==", category);
    }
    query.onSnapshot((snapshot) => {
      const menuItemsList = [];
      snapshot.forEach((doc) => {
        const obj = { id: doc.id, ...doc.data() };
        menuItemsList.push(obj);
      });
      this.setState({
        menuItemsList: menuItemsList,
      });
    });
  }

  addToCart(item) {
    const { cartItemsList, totalPrice } = this.state;
    if (item) {
      cartItemsList.push(item);
      this.setState({
        totalPrice: totalPrice + Number(item.itemPrice),
        cartItemsList: cartItemsList,
        showCartList: true,
      });
    }
  }

  removeCartItem(itemIndex) {
    const { cartItemsList, totalPrice } = this.state;
    const removedItemPrice = Number(cartItemsList[itemIndex].itemPrice);
    cartItemsList.splice(itemIndex, 1);
    this.setState({
      totalPrice: totalPrice - removedItemPrice,
      cartItemsList: cartItemsList,
    });
  }

  // async handleConfirmOrderBtn() {
  //   const { cartItemsList, totalPrice, resDetails, userDetails } = this.state;
  //   console.log(cartItemsList.length);
  //   if (userDetails) {
  //     if (!userDetails.isRestaurant) {
  //       if (cartItemsList.length > 0) {
  //         try {
  //           const history = this.props.history;
  //           const orderNowReturn = await orderNow(
  //             cartItemsList,
  //             totalPrice,
  //             resDetails,
  //             userDetails,
  //             history
  //           );
  //           console.log(orderNowReturn);
  //           // console.log("Successfully Ordered")
  //           Swal.fire({
  //             title: "Success",
  //             text: "Successfully Ordered",
  //             type: "success",
  //           }).then(() => {
  //             history.push("/my-orders");
  //           });
  //         } catch (error) {
  //           // console.log(" Error in confirm order => ", error)
  //           Swal.fire({
  //             title: "Error",
  //             text: error,
  //             type: "error",
  //           });
  //         }
  //       } else {
  //         console.log("You have to select atleast one item");
  //         Swal.fire({
  //           title: "Error",
  //           text: "You have to select atleast one item",
  //           type: "error",
  //         });
  //       }
  //     } else {
  //       // console.log("You are not able to order")
  //       Swal.fire({
  //         title: "Error",
  //         text: "You are not able to order",
  //         type: "error",
  //       });
  //     }
  //   } else {
  //     // console.log("You must be Loged In")
  //     Swal.fire({
  //       title: "Error",
  //       text: "You must be Logged In",
  //       type: "error",
  //     }).then(() => {
  //       this.props.history.push("/login");
  //     });
  //   }
  // }

  async handleConfirmOrderBtn() {
    const { cartItemsList, totalPrice, resDetails, userDetails } = this.state;
    console.log(cartItemsList.length);
    if (userDetails) {
      if (!userDetails.isRestaurant) {
        if (cartItemsList.length > 0) {
          try {
            const history = this.props.history;
            const orderNowReturn = await orderNow(
              cartItemsList,
              totalPrice,
              resDetails,
              userDetails,
              history
            );
            console.log(orderNowReturn);

            // Swal.fire({
            //   title:
            //     '<span style="color: #1d0a15; font-size: 18px;">Scan QR Code to Pay</span>',
            //   html:
            //     '<img src="' +
            //     qrCodeImage +
            //     '" alt="QR Code" style="width: 150px; height: auto;">' +
            //     '<p style="color: #1d0a15; font-size: 16px;">Please scan the QR code to proceed with your payment.</p>',
            //   confirmButtonText: '<span style="color: white;">Proceed</span>',
            //   confirmButtonColor: "#1d0a15", // Button background color
            //   focusConfirm: false,
            //   preConfirm: () => {
            //     return new Promise((resolve) => {
            //       Swal.fire({
            //         title:
            //           '<span style="color: #1d0a15; font-size: 18px;">Success</span>',
            //         text: "Successfully Ordered",
            //         icon: "success",
            //       }).then(() => {
            //         history.push("/my-orders");
            //         resolve();
            //       });
            //     });
            //   },
            // });
            Swal.fire({
              title:
                '<span style="color: #1d0a15; font-size: 18px;">Scan QR Code to Pay</span>',
              html:
                '<img src="' +
                qrCodeImage +
                '" alt="QR Code" style="width: 150px; height: auto;">' +
                '<p style="color: #1d0a15; font-size: 16px;">Please scan the QR code to proceed with your payment.</p>',
              confirmButtonText: '<span style="color: white;">Proceed</span>',
              confirmButtonColor: "#1d0a15",
              focusConfirm: false,
              preConfirm: () => {
                return new Promise((resolve) => {
                  Swal.fire({
                    title: "Success",
                    text: "Successfully Ordered",
                    type: "success",
                  }).then(() => {
                    history.push("/my-orders");
                    resolve();
                  });
                });
              },
            });
          } catch (error) {
            console.log("Error in confirm order => ", error);
            Swal.fire({
              title: "Error",
              text: error,
              type: "error",
            });
          }
        } else {
          console.log("You have to select at least one item");
          Swal.fire({
            title: "Error",
            text: "You have to select at least one item",
            type: "error",
          });
        }
      } else {
        console.log("You are not able to order");
        Swal.fire({
          title: "Error",
          text: "You are not able to order",
          type: "error",
        });
      }
    } else {
      console.log("You must be Logged In");
      Swal.fire({
        title: "Error",
        text: "You must be Logged In",
        type: "error",
      }).then(() => {
        this.props.history.push("/login");
      });
    }
  }

  _renderMenuItemsList() {
    const { menuItemsList } = this.state;
    if (menuItemsList) {
      return Object.keys(menuItemsList).map((val) => {
        const item = menuItemsList[val]; // Refactoring for better readability
        return (
          <div
            className="container border-bottom pb-2 px-lg-0 px-md-0 mb-4"
            key={item.id}
          >
            <div className="row">
              <div className="col-lg-2 col-md-3 col-8 offset-2 offset-lg-0 offset-md-0 px-0 mb-3 text-center">
                <img
                  style={{ width: "70px", height: "70px" }}
                  alt="Natural Healthy Food"
                  src={item.itemImageUrl}
                />
              </div>
              <div className="col-lg-7 col-md-6 col-sm-12 px-0">
                <h6>{item.itemTitle}</h6>
                <p>
                  <small>{item.itemIngredients}</small>
                </p>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
                <span className="mx-3">${item.itemPrice}</span>
                {item.availability && (
                  <span
                    className="menuItemsListAddBtn"
                    onClick={() => this.addToCart(item)}
                  >
                    <FontAwesomeIcon icon="plus" className="text-warning" />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      });
    }
  }

  _renderCartItemsList() {
    const { cartItemsList } = this.state;
    if (cartItemsList) {
      return Object.keys(cartItemsList).map((val) => {
        return (
          <li className="food-item border-bottom pb-2 mb-3" key={val}>
            <div className="row">
              <div className="col-8 pr-0">
                <p className="mb-0">{cartItemsList[val].itemTitle}</p>
              </div>
              <div className="col-4 pl-0 text-right">
                <p className="mb-0">
                  <span className="food-price">
                    ${cartItemsList[val].itemPrice}
                  </span>
                  <span
                    onClick={() => this.removeCartItem(val)}
                    className="remove-food-item"
                  >
                    <FontAwesomeIcon icon="times" />
                  </span>
                </p>
              </div>
            </div>
          </li>
        );
      });
    }
  }

  _renderReviews() {
    const { reviews } = this.state;
    if (reviews.length === 0) {
      return (
        <p style={{ color: "#999", fontSize: "16px", fontFamily: "Poppins" }}>
          No reviews available.
        </p>
      );
    }

    return (
      <div style={{ backgroundColor: "#FBF2F7", padding: "15px" }}>
        {reviews.map((review, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #dee1e9",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              position: "relative",
              marginBottom: "10px",
              display: "flex",
              alignItems: "flex-start", // Aligns items at the top of the container
            }}
          >
            <img
              src={review.reviewerPhoto}
              alt={`${review.reviewerName}'s profile`}
              style={{
                width: "50px", // Adjust size as needed
                height: "50px", // Adjust size as needed
                borderRadius: "50%", // Makes the image round
                objectFit: "cover", // Ensures the image covers the area without distortion
                marginRight: "15px", // Adds some space between the image and the text
              }}
            />
            <div style={{ flex: 1 }}>
              <h5
                style={{
                  color: "#1d0a15",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "4px",
                }}
              >
                {review.reviewerName}
              </h5>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  fontFamily: "Poppins, sans-serif",
                  margin: "0",
                  width: "100%", // Ensures text uses the full width
                }}
              >
                {review.reviewText}
              </p>
            </div>
            <span
              style={{
                backgroundColor: "#c13f86",
                color: "#FBF2F7",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "14px",
                position: "absolute", // Positioned absolutely to be on the right
                top: "20px", // Distance from the top of the container
                right: "20px", // Distance from the right of the container
              }}
            >
              Rating: {review.rating}
            </span>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {
      tab1,
      tab2,
      tab3,
      tab1Content,
      tab2Content,
      tab3Content,
      resDetails,
      totalPrice,
      cartItemsList,
      showCartList,
    } = this.state;
    return (
      <div>
        <div className="container-fluid res-details-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container px-0 res-details-cont1-text mx-0">
              <div className="container">
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-6 text-lg-center text-md-center pr-0 mb-2">
                    <img
                      className="p-2 bg-white rounded text-center"
                      alt="Natural Healthy Food"
                      style={{ width: "60%" }}
                      src={resDetails.userProfileImageUrl}
                    />
                  </div>
                  <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
                    <h1 className="restaurant-title">{resDetails.userName}</h1>
                    <p className="restaurant-text">
                      {resDetails.typeOfFood.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: "#EBEDF3" }} className="container-fluid py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-2 col-sm-12">
                <div className="listing-category">
                  <div className="category-heading py-0 mb-1">
                    <h6 className="m-0">
                      <FontAwesomeIcon icon="utensils" className="mr-2" />
                      Categories
                    </h6>
                  </div>
                  <div>
                    <ul className="category-list">
                      <li onClick={() => this.fetchMenuItems("standard")}>
                        <p>Standard</p>
                      </li>
                      <li onClick={() => this.fetchMenuItems("halal")}>
                        <p>Halal</p>
                      </li>
                      <li onClick={() => this.fetchMenuItems("vegetarian")}>
                        <p>Vegetarian</p>
                      </li>
                      <li onClick={() => this.fetchMenuItems("vegan")}>
                        <p>Vegan</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-md-7 col-sm-12">
                <div className="container">
                  <div className="row">
                    <div
                      className={tab1}
                      onClick={() => this.handleTabs("tab1")}
                    >
                      <p className="res-details-tab-text">
                        <FontAwesomeIcon
                          icon="concierge-bell"
                          className="mr-3"
                        />
                        Menu
                      </p>
                    </div>
                    <div
                      className={tab2}
                      onClick={() => this.handleTabs("tab2")}
                    >
                      <p className="res-details-tab-text">
                        <FontAwesomeIcon icon="comment-alt" className="mr-3" />
                        Reviews
                      </p>
                    </div>
                    <div
                      className={tab3}
                      onClick={() => this.handleTabs("tab3")}
                    >
                      <p className="res-details-tab-text">
                        <FontAwesomeIcon icon="info-circle" className="mr-3" />
                        Restaurant Info
                      </p>
                    </div>
                  </div>
                  {tab1Content && (
                    <div className="row menu-section">
                      <div className="col-12 bg-white p-4">
                        <div className="input-group input-group-sm mb-4 mt-2">
                          <input
                            type="text"
                            className="form-control search-menu-input"
                            htmlFor="search-menu"
                            placeholder="Search food item"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text search-menu-text"
                              id="search-menu"
                            >
                              <FontAwesomeIcon icon="search" />
                            </span>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-4 text-warning">
                            Best food items:
                          </h6>
                          {this._renderMenuItemsList()}
                        </div>
                      </div>
                    </div>
                  )}
                  {tab2Content && (
                    <div className="row review-section">
                      <div className="col-12 bg-white p-4">
                        <h5>Customer Reviews For {resDetails.userName}</h5>
                        {this.state.reviews.length > 0 ? (
                          <div>{this._renderReviews()}</div>
                        ) : (
                          <p>No reviews available.</p>
                        )}
                      </div>
                    </div>
                  )}
                  {tab3Content && (
                    <div className="row info-section">
                      <div className="col-12 bg-white p-4">
                        <h5>Overview {resDetails.userName}</h5>
                        <br />
                        <p>{resDetails.restaurantDescription}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
                <div className="container bg-white py-3 order-card">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon="shopping-basket" className="mr-2" />
                    Your Order
                  </h6>
                  {cartItemsList.length > 0 ? (
                    <div>
                      <div>
                        <ul>{this._renderCartItemsList()}</ul>
                      </div>
                      <div>
                        <div className="row ">
                          <div className="col-12">
                            <p
                              style={{
                                backgroundColor: "#f1f3f8",
                                padding: "10px 15px",
                              }}
                            >
                              Total+{" "}
                              <span
                                style={{
                                  float: "right",
                                  color: "#2f313a",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                <em>${totalPrice}</em>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-success">
                      There are no items in your basket.
                    </p>
                  )}
                  <div>
                    <div className="row ">
                      <div className="col-12">
                        <button
                          onClick={() => this.handleConfirmOrderBtn()}
                          type="button"
                          className="btn btn-warning btn-sm btn-block text-uppercase mr-2 mr-1 px-3"
                        >
                          <b>Confirm Order</b>
                        </button>
                      </div>
                    </div>
                  </div>
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
  };
};

export default connect(mapStateToProps, null)(RestaurantDetails);
