import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import homeBackground from "../assets/images/homeBackground.png";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import firebase from "firebase/app";
import "firebase/firestore";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      homeSearchBarText: "",
      restaurantCount: 0,
    };
    this.handleSearchBar = this.handleSearchBar.bind(this);
  }

  componentDidMount() {
    this.fetchRestaurantCount();
    // ... other componentDidMount logic
  }

  handleSearchBar() {
    const { homeSearchBarText } = this.state;
    if (homeSearchBarText) {
      this.props.history.push("/restaurants", this.state.homeSearchBarText);
    }
  }

  handleOrderNowBtn() {
    this.props.history.push("/restaurants");
  }

  handleSignInBtn = () => {
    this.props.history.push("/login");
  };

  fetchRestaurantCount() {
    const db = firebase.firestore(); // Assuming firebase is already initialized
    db.collection("users")
      .where("isRestaurant", "==", true)
      .get()
      .then((querySnapshot) => {
        // Update state with the count of restaurant documents
        this.setState({ restaurantCount: querySnapshot.size });
      })
      .catch((error) => {
        console.error("Error fetching restaurant count: ", error);
      });
  }

  render() {
    return (
      <div>
        {/* Home Navbar Section */}
        <div className="container-fluid home-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container home-cont1-text">
              <h1 className="h1 text-uppercase text-white text-center mb-2">
                <strong>
                  Join the feast <br></br> save a feast
                </strong>
              </h1>
              <h4 className="h2 text-uppercase text-white text-center mb-4">
                Savor the endless delights.
              </h4>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                    <input
                      type="text"
                      className="form-control home-cont6"
                      id="searchText"
                      placeholder="Find Your Restaurant"
                      onChange={(e) => {
                        this.setState({ homeSearchBarText: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <button
                      type="button"
                      className="btn btn-sign-in-primary mb-2 text-uppercase btn-block rounded-0"
                      onClick={this.handleSearchBar}
                    >
                      <b>Search</b>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container text-white text-center mt-4">
                <div className="col-lg-7 col-md-8 col-sm-12 mx-auto">
                  <img
                    style={{ width: "95%" }}
                    alt=""
                    src={require("../assets/images/options-img.png")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Number section */}
        <div
          className="container-fluid py-2"
          style={{ backgroundColor: "#C13F86" }}
        >
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12">
              <p className="my-3 text-lg-right text-md-right text-center text-white">
                <b className="mr-2 h5">{this.state.restaurantCount}</b>
                Restaurant{this.state.restaurantCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <p className="my-3 text-center text-white">
                <b className="mr-2 h5">9</b>People Served
              </p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <p className="my-3 text-lg-left text-md-left text-center text-white">
                <b className="mr-2 h5">44</b>Registered Users
              </p>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        {/* About Us Section with blank background */}
        <div className="container-fluid text-center home-cont6">
          <div className="row">
            <div className="col-lg-6">
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <img
                src="../assets/images/whiteback.jpg"
                alt="Treasure Chope Logo"
                className="logo"
              />
            </div>
            <div className="col-lg-6">
              <p className="mb-3 custom-text-color1">
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                Discover the joy of saving every bite with us. We turn surplus
                into discounts, making sustainability delicious. Join our
                mission for tastier, eco-friendly savings.
              </p>
              <button
                type="button"
                className="btn btn-sign-in-primary text-uppercase mb-5"
                onClick={this.handleSignInBtn}
              >
                <b>Sign In</b>
              </button>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </div>
          </div>
        </div>

        {/* Home How it work section */}
        <div className="container-fluid text-center py-4">
          <div className="py-4">
            <h2 className="h2 text-uppercase">How It Works</h2>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4 px-5">
                <span className="round-border my-4">
                  <img
                    alt="Choose A Restaurant"
                    src={require("../assets/images/Icon2.png")}
                  />
                </span>
                <h3 className="h3 mb-4">Order on website</h3>
                <p className="mb-4">
                  Log in to Treasure Chope to access to range of resturants and
                  shops offering discounted food that is too good to waste.
                </p>
              </div>
              <div className="col-12 col-md-4 px-5">
                <span className="round-border my-4">
                  <img
                    alt="Choose A Tasty Dish"
                    src={require("../assets/images/Icon3.png")}
                  />
                </span>
                <h3 className="h3 mb-4">Choose your food</h3>
                <p className="mb-4">
                  Dive into a mouthwatering world of flavors with our massive
                  selection of food options.
                </p>
              </div>
              <div className="col-12 col-md-4 px-5">
                <span className="round-border my-4">
                  <img
                    alt="Pick Up Or Delivery"
                    src={require("../assets/images/Icon4.png")}
                  />
                </span>
                <h3 className="h3 mb-4">Pick Up & Enjoy!</h3>
                <p className="mb-4">
                  Flash your confirmation code, grab your delicious food, and
                  savor a double helping of goodness
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Promotion*/}
        <div
          className="promo-section"
          style={{ backgroundImage: `url(${homeBackground})` }}
        >
          <div className="promo-content">
            <div className="text-content">
              <h1 className="promo-title">Hidden Gems, Happy Wallet</h1>
              <h2 className="promo-subtitle">
              <br></br>
                Unlock Food Deals with Treasure Chope!
                <br></br>

              </h2>
            </div>
            <div className="button-container">
              <button onClick={this.handleSignInBtn} className="btn btn-signin">
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Home Featured restaurant section */}
        <div className="container-fluid py-5">
          <div className="py-4">
            <h2 className="h2 text-uppercase text-center">
              Featured Restaurant
            </h2>
            <p className="text-center">
              Our Food Lover's Go To Places for the Best Deals
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Natural Healthy Food"
                        src={require("../assets/images/listing-logo03.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Natural Healthy Food</h5>
                      <p className="mb-2">
                        <small>Apple Juice, Beef Roast, Cheese Burger</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(1) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Menu & Drinks"
                        src={require("../assets/images/listing-logo09.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Menu &amp; Drinks</h5>
                      <p className="mb-2">
                        <small>Chicken Roast, Chines Soup, Cold Coffee</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(3) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Chefs"
                        src={require("../assets/images/listing-logo12.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Chefs</h5>
                      <p className="mb-2">
                        <small>Egg Fry, Noodles, Pastry</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(1) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Menu's"
                        src={require("../assets/images/listing-logo15.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Menu's</h5>
                      <p className="mb-2">
                        <small>Fish Fry, Fresh Juice, Stakes</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(1) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Food N&H"
                        src={require("../assets/images/2.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Food N&amp;H</h5>
                      <p className="mb-2">
                        <small>Beef Roast, Cheese Burger, Doughnut</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(4) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="container res-shadow res-border">
                  <div className="row p-3">
                    <div className="col-lg-4 col-md-4 col-sm-12 text-center border p-2">
                      <img
                        style={{ width: "70%" }}
                        alt="Restaurant"
                        src={require("../assets/images/listing-logo13.png")}
                      />
                    </div>
                    <div
                      style={{ position: "relative" }}
                      className="col-lg-8 col-md-8 col-sm-12 py-2"
                    >
                      <h5 className="mb-1">Restaurant</h5>
                      <p className="mb-2">
                        <small>Apple Juice, BB.Q</small>
                      </p>
                      <p>
                        <small className="">
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                          <FontAwesomeIcon
                            icon="star"
                            className="rating mr-1"
                          />
                        </small>
                        <small>(2) Review</small>
                      </p>
                      <span style={{ position: "absolute", top: 5, right: 5 }}>
                        <FontAwesomeIcon
                          icon="heart"
                          className="text-success mr-1"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Footer */}
        <Footer />
      </div>
    );
  }
}

export default Home;
