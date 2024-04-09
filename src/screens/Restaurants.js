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
      renderSearchRestaurants: false,
      menuItems: {}, // new state to store menu items
      sortingMethod: 'alphabetical',
    };
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

  changeSortingMethod = (method) => {
    this.setState(prevState => {
      // Toggle between ascending and descending if alphabetical sorting is already selected
      if (method === 'alphabetical' && prevState.sortingMethod.includes('alphabetical')) {
        return { sortingMethod: prevState.sortingMethod === 'alphabetical_asc' ? 'alphabetical_desc' : 'alphabetical_asc' };
      }
      // Otherwise, just update the sorting method as normal
      return { sortingMethod: method };
    });
  }


  handleSearchBar(event) {
    const searchText = event;
    const { restaurantList } = this.props;
    if (restaurantList) {
      Object.keys(restaurantList).map((val) => { });
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
          renderSearchRestaurants: true,
          searchRestaurants: result,
          searchText: searchText,
          defaultSearchValue: searchText,
        });
      } else {
        this.setState({
          renderRestaurantList: true,
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
    const { sortingMethod } = this.state;
    if (restaurantList) {
      let sortedRestaurantArray = Object.keys(restaurantList)
        .map(key => restaurantList[key]);

      // Apply sorting based on the current sortingMethod
      if (sortingMethod === 'alphabetical_asc') {
        sortedRestaurantArray.sort((a, b) => a.userName.localeCompare(b.userName));
      } else if (sortingMethod === 'alphabetical_desc') {
        sortedRestaurantArray.sort((a, b) => b.userName.localeCompare(a.userName));
      } else if (sortingMethod === 'ratings') {
        // Example sorting by rating - adjust based on your data structure
        //ortedRestaurantArray.sort((a, b) => b.rating - a.rating);
      }

      // Map over the sorted array to render the list
      return sortedRestaurantArray.map((restaurant) => {
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
            key={restaurant.id}
          >
            <div className="row" style={{marginBottom:"-10px"}}>
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center" >
                <img
                  style={{ height: "85px", width:"130px", margin: '0 auto'  }}
                  alt="Natural Healthy Food"
                  src={restaurant.userProfileImageUrl}
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
                <h5 className="">{restaurant.userName}</h5>
                <p className="">
                  <small>
                    Type of Foods:
                    <span> {restaurant.typeOfFood.join(", ")}</span>
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
                  onClick={() => this.handleViewMenuBtn(restaurant)} // Use restaurant directly
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


  _renderSearchRestaurants() {
    const { searchText, searchRestaurants, sortingMethod } = this.state;
  
    // Convert search results into an array if it's not already one
    let searchResultsArray = Object.keys(searchRestaurants)
      .map(key => searchRestaurants[key]);
  
    // Apply sorting based on the current sortingMethod
    if (sortingMethod === 'alphabetical_asc') {
      searchResultsArray.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortingMethod === 'alphabetical_desc') {
      searchResultsArray.sort((a, b) => b.userName.localeCompare(a.userName));
    } 
    // Implement other sorting methods if needed, like 'ratings'
  
    // Now, map over the sorted array to render the search results
    return searchResultsArray.map((restaurant) => {
      // Check if all necessary data is available for each restaurant
      if (!restaurant.userProfileImageUrl || !restaurant.userName || !restaurant.typeOfFood) {
        return null; // Skip rendering this entry if data is missing
      }
  
      return (
        <div className="container bg-white p-3 px-0 mb-4" key={restaurant.id}>
          <div className="row" style={{marginBottom:"-10px"}}>
            <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
              <img
                style={{ height: "85px", width: "130px", margin: '0 auto' }}
                alt="Natural Healthy Food"
                src={restaurant.userProfileImageUrl}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 px-0">
              <p>
                <small>
                  <FontAwesomeIcon icon="star" className="rating mr-1" />
                  <FontAwesomeIcon icon="star" className="rating mr-1" />
                  <FontAwesomeIcon icon="star" className="rating mr-1" />
                  <FontAwesomeIcon icon="star" className="rating mr-1" />
                  <FontAwesomeIcon icon="star" className="rating mr-1" />
                  
                </small>
                <small>(1) Review</small>
              </p>
              <h5>{restaurant.userName}</h5>
              <p>
                <small>
                  Type of Foods: <span>{restaurant.typeOfFood.join(", ")}</span>
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
                onClick={() => this.handleViewMenuBtn(restaurant)}
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
  

  render() {
    const {
      renderRestaurantList,
      renderSearchRestaurants,
      defaultSearchValue,
    } = this.state;
    return (
      <div>
        <div className="container-fluid restaurants-cont1">
          <div className="">
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
              <div className="col-lg-9 col-md-9 col-sm-12">
                <h4 className="mb-3">Restaurant's Found</h4>
                <div className="container px-0">
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-4 px-0">
                    {renderSearchRestaurants && this._renderSearchRestaurants()}
                    {renderRestaurantList && this._renderRestaurantList()}
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
                <br />
                <br />
                <div className="container bg-white py-3 sort-by">
                  <h5>Sort By</h5>
                  <ul>
                    <li onClick={() => this.changeSortingMethod('alphabetical')}>
                      <FontAwesomeIcon icon="sort-alpha-down" className="mr-3" />
                      <span>Alphabetical {this.state.sortingMethod.includes('alphabetical') ? (this.state.sortingMethod === 'alphabetical_asc' ? '(Asc)' : '(Desc)') : ''}</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon="star" className="mr-3" />
                      <span>Ratings</span>
                    </li>
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
