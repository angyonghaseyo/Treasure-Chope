import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { restaurant_list } from "../store/action";
import firebase from "../config/firebase";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Restaurants extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      defaultSearchValue: "",
      renderRestaurantList: true,
      renderCategorizedRestaurants: false,
      renderSearchRestaurants: false,
      menuItems: {}, // new state to store menu items
    };
    this.handleCategoriesCheckbox = this.handleCategoriesCheckbox.bind(this);
    this.handleSearchBar = this.handleSearchBar.bind(this);
  }

  componentDidMount() {
    this.props.restaurant_list();
    //this.fetchAllMenuItems(); // Call a new method to fetch all menu items on mount
    const { state } = this.props.location;
    if (state) {
      this.setState({
        defaultSearchValue: state,
      });
      this.handleSearchBar(state);
    }
  }

  fetchMenuItemsByCategory = async (category) => {
    let filteredRestaurants = {};
    const { restaurantList } = this.props; // or this.state

    await Promise.all(
      Object.keys(restaurantList).map(async (restaurantId) => {
        const menuItemsSnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(restaurantId)
          .collection("menuItems")
          .where("chooseItemType", "==", category)
          .get();
        if (!menuItemsSnapshot.empty) {
          filteredRestaurants[restaurantId] = restaurantList[restaurantId];
        }
      })
    );

    return filteredRestaurants;
  };

  handleCategoriesCheckbox = async (event) => {
    const target = event.target;
    const isChecked = target.checked;
    const category = target.name;

    // Reset the categories state entirely based on the new checkbox selection
    let newCategories = isChecked ? [category] : [];

    this.setState({ isLoading: true }); // Set a loading state

    if (isChecked) {
      // If the checkbox is checked, fetch and filter the restaurants by category
      const filteredRestaurants = await this.fetchMenuItemsByCategory(category);

      this.setState({
        filteredRestaurantList: filteredRestaurants,
        renderCategorizedRestaurants: true,
        renderRestaurantList: false,
        renderSearchRestaurants: false,
        categories: newCategories, // Update the categories array with only the selected category
        isLoading: false,
      });
    } else {
      // If the checkbox is unchecked, reset to the full list
      this.setState({
        filteredRestaurantList: {},
        renderCategorizedRestaurants: false,
        renderRestaurantList: true,
        renderSearchRestaurants: false,
        categories: newCategories, // The categories array should be empty if no checkbox is checked
        isLoading: false,
      });
    }
  };

  handleSearchBar(event) {
    const searchText = event;
    const { restaurantList } = this.props;
    if (restaurantList) {
      Object.keys(restaurantList).map((val) => {});
      const result = restaurantList.filter((val) => {
        return (
          val.userName
            .toLocaleLowerCase()
            .indexOf(searchText.toLocaleLowerCase()) !== -1
        );
      });
      if (searchText.length > 0) {
        this.setState({
          renderRestaurantList: false,
          renderCategorizedRestaurants: false,
          renderSearchRestaurants: true,
          searchRestaurants: result,
          searchText: searchText,
          defaultSearchValue: searchText,
        });
      } else {
        this.setState({
          renderRestaurantList: true,
          renderCategorizedRestaurants: false,
          renderSearchRestaurants: false,
          searchRestaurants: result,
          searchText: searchText,
          defaultSearchValue: searchText,
        });
      }
    }
  }

  handleViewMenuBtn(resDetails) {
    this.props.history.push("/restaurant-details", resDetails);
  }

  _renderRestaurantList() {
    const { restaurantList } = this.props;
    if (restaurantList) {
      return Object.keys(restaurantList).map((val) => {
        const restaurant = restaurantList[val];
        if (
          !restaurant.userProfileImageUrl ||
          !restaurant.userName ||
          !restaurant.typeOfFood
        ) {
          // Skip rendering this entry if data is missing
          return null;
        }
        return (
          <div
            className="container bg-white p-3 px-0 mb-4"
            key={restaurantList[val].id}
          >
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
                <img
                  style={{ width: "70%" }}
                  alt="Natural Healthy Food"
                  src={restaurantList[val].userProfileImageUrl}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 px-0">
                <p>
                  <small className="">
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                  </small>
                  <small>(1) Review</small>
                </p>
                <h5 className="">{restaurantList[val].userName}</h5>
                <p className="">
                  <small>
                    Type of Foods:{" "}
                    <span>{restaurantList[val].typeOfFood.join(", ")}</span>
                  </small>
                </p>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 py-4 px-0">
                <span
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    borderRadius: "3px",
                    border: "1px solid #dddddd",
                    padding: "6px 7px 0px 7px",
                    marginRight: "16px",
                  }}
                >
                  <FontAwesomeIcon icon="heart" className="text-success" />
                </span>
                <button
                  type="button"
                  onClick={() => this.handleViewMenuBtn(restaurantList[val])}
                  className="btn btn-warning btn-sm text-uppercase"
                  style={{ marginBottom: "8px" }}
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  _renderCategorizedRestaurants() {
    const { filteredRestaurantList } = this.state; // Use the filtered list from the state

    if (filteredRestaurantList) {
      return Object.keys(filteredRestaurantList).map((restaurantId) => {
        const restaurant = filteredRestaurantList[restaurantId];
        // No need to map through categories here, since filtering is already done
        return (
          <div className="container bg-white p-3 px-0 mb-4" key={restaurant.id}>
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
                <img
                  style={{ width: "70%" }}
                  alt="Restaurant"
                  src={restaurant.userProfileImageUrl}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 px-0">
                {/* Ratings and other info */}
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 py-4 px-0">
                {/* View menu button */}
              </div>
            </div>
          </div>
        );
      });
    }
  }

  _renderSearchRestaurants() {
    const { searchText, searchRestaurants } = this.state;
    if (searchRestaurants) {
      return Object.keys(searchRestaurants).map((val) => {
        return (
          <div
            className="container bg-white p-3 px-0 mb-4"
            key={searchRestaurants[val].id}
          >
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
                <img
                  style={{ width: "70%" }}
                  alt="Natural Healthy Food"
                  src={searchRestaurants[val].userProfileImageUrl}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 px-0">
                <p>
                  <small className="">
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                    <FontAwesomeIcon icon="star" className="rating mr-1" />
                  </small>
                  <small>(1) Review</small>
                </p>
                <h5 className="">{searchRestaurants[val].userName}</h5>
                <p className="">
                  <small>
                    Type of Foods:{" "}
                    <span>{searchRestaurants[val].typeOfFood.join(", ")}</span>
                  </small>
                </p>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 py-4 px-0">
                <span
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    borderRadius: "3px",
                    border: "1px solid #dddddd",
                    padding: "6px 7px 0px 7px",
                    marginRight: "16px",
                  }}
                >
                  <FontAwesomeIcon icon="heart" className="text-success" />
                </span>
                <button
                  type="button"
                  onClick={() => this.handleViewMenuBtn(searchRestaurants[val])}
                  className="btn btn-warning btn-sm text-uppercase"
                  style={{ marginBottom: "8px" }}
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  render() {
    const {
      renderRestaurantList,
      renderCategorizedRestaurants,
      renderSearchRestaurants,
      defaultSearchValue,
    } = this.state;
    return (
      <div>
        <div className="container-fluid restaurants-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container px-0 restaurants-cont1-text">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-sm"
                        >
                          <FontAwesomeIcon icon="search" />
                        </span>
                      </div>
                      <input
                        type="text"
                        value={defaultSearchValue}
                        onChange={(e) => this.handleSearchBar(e.target.value)}
                        className="form-control"
                        placeholder="RESTAURANT NAME"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                      />
                    </div>
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
                <div className="listing-filter">
                  <div className="filter-heading py-2 mb-3">
                    <h6 className="m-0">
                      <FontAwesomeIcon icon="utensils" className="mr-2" />
                      Categories
                    </h6>
                  </div>
                  <div>
                    <ul className="filter-list">
                      <li>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="standard"
                          name="standard"
                          checked={this.state.categories.includes("standard")}
                          onChange={this.handleCategoriesCheckbox}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="standard"
                        >
                          Standard
                        </label>
                      </li>
                      <li>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="halal"
                          name="halal"
                          checked={this.state.categories.includes("halal")}
                          onChange={this.handleCategoriesCheckbox}
                        />
                        <label className="custom-control-label" htmlFor="halal">
                          Halal
                        </label>
                      </li>

                      <li>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="vegetarian"
                          name="vegetarian"
                          checked={this.state.categories.includes("vegetarian")}
                          onChange={this.handleCategoriesCheckbox}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="vegetarian"
                        >
                          Vegetarian
                        </label>
                      </li>

                      <li>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="vegan"
                          name="vegan"
                          checked={this.state.categories.includes("vegan")}
                          onChange={this.handleCategoriesCheckbox}
                        />
                        <label className="custom-control-label" htmlFor="vegan">
                          Vegan
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-md-7 col-sm-12">
                <h4 className="mb-3">Restaurant's Found</h4>
                <div className="container px-0">
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-4 px-0">
                    {renderSearchRestaurants && this._renderSearchRestaurants()}
                    {renderCategorizedRestaurants &&
                      this._renderCategorizedRestaurants()}
                    {renderRestaurantList && this._renderRestaurantList()}
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
                <div className="container bg-white py-3 sort-by">
                  <h5>Sort By</h5>
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        icon="sort-alpha-down"
                        className="mr-3"
                      />
                      <span>Alphabetical</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon="star" className="mr-3" />
                      <span>Ratings</span>
                    </li>
                    {/* <li>
                                            <FontAwesomeIcon icon="user-minus" className="mr-3"/>
                                            <span>Minimum order value</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon="dollar-sign" className="mr-3"/>
                                            <span>Delivery fee</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon="angle-double-right" className="mr-3"/>
                                            <span>Fastest delivery</span>
                                        </li> */}
                  </ul>
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
    restaurantList: state.restaurantList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    restaurant_list: () => dispatch(restaurant_list()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
