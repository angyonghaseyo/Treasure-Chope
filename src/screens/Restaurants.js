import React, { Component } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { restaurant_list } from "../store/action";
import firebase from "../config/firebase";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heart from "react-animated-heart";

class Restaurants extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      defaultSearchValue: "",
      renderRestaurantList: true,
      renderSearchRestaurants: false,
      menuItems: {},
      sortingMethod: 'alphabetical',
      userFavorites: [],
    };
    this.handleSearchBar = this.handleSearchBar.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidMount() {
    this.props.restaurant_list();
    const userId = firebase.auth().currentUser?.uid;
    if (userId) {
      firebase.firestore().collection('users').doc(userId).get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            this.setState({ userFavorites: docSnapshot.data().userFavorites || [] });
          }
        })
        .catch(error => {
          console.error("Error fetching user favorites:", error);
        });
    }
  
    // Retrieve favorites from local storage
    const storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      this.setState({ userFavorites: JSON.parse(storedFavorites) });
    }
  
    const { state } = this.props.location;
    if (state) {
      this.setState({
        defaultSearchValue: state,
      });
      this.handleSearchBar(state);
    }
  }
  

  /*componentDidMount() {
    this.props.restaurant_list();
    const userId = firebase.auth().currentUser?.uid;
    if (userId) {
      firebase.firestore().collection('users').doc(userId).get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            this.setState({ userFavorites: docSnapshot.data().userFavorites || [] });
          }
        })
        .catch(error => {
          console.error("Error fetching user favorites:", error);
        });
    }
    const { state } = this.props.location;
    if (state) {
      this.setState({
        defaultSearchValue: state,
      });
      this.handleSearchBar(state);
    }
  }*/

  /*toggleFavorite(restaurantId) {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    const userRef = firebase.firestore().collection("users").doc(userId);
    firebase.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User document does not exist");
      }

      const userData = userDoc.data();
      let updatedFavorites = userData.userFavorites || [];
      if (updatedFavorites.includes(restaurantId)) {
        updatedFavorites = updatedFavorites.filter(id => id !== restaurantId);
      } else {
        updatedFavorites.push(restaurantId);
      }
      transaction.update(userRef, { userFavorites: updatedFavorites });
      return updatedFavorites; // Return the new favorites list for immediate update
    }).then((updatedFavorites) => {
      this.setState({ userFavorites: updatedFavorites });
      console.log("Favorites updated successfully!");
    }).catch(error => {
      console.error("Error updating favorites:", error);
    });
  }*/

  toggleFavorite(restaurantId) {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
  
    const userRef = firebase.firestore().collection("users").doc(userId);
    firebase.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User document does not exist");
      }
  
      const userData = userDoc.data();
      let updatedFavorites = userData.userFavorites || [];
      if (updatedFavorites.includes(restaurantId)) {
        updatedFavorites = updatedFavorites.filter(id => id !== restaurantId);
      } else {
        updatedFavorites.push(restaurantId);
      }
      transaction.update(userRef, { userFavorites: updatedFavorites });
      return updatedFavorites; // Return the new favorites list for immediate update
    }).then((updatedFavorites) => {
      // Update state
      this.setState({ userFavorites: updatedFavorites });
  
      // Store favorites in local storage
      localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
  
      console.log("Favorites updated successfully!");
    }).catch(error => {
      console.error("Error updating favorites:", error);
    });
  }
  

  handleSearchBar(event) {
    const searchText = event;
    const { restaurantList } = this.props;
    if (restaurantList) {
      const result = restaurantList.filter(val => val.userName.toLowerCase().includes(searchText.toLowerCase()));
      this.setState({
        renderRestaurantList: searchText.length === 0,
        renderSearchRestaurants: searchText.length > 0,
        searchRestaurants: result,
        searchText: searchText,
        defaultSearchValue: searchText,
      });
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

  handleViewMenuBtn(resDetails) {
    this.props.history.push("/restaurant-details", resDetails);
  }

  _renderRestaurantList() {
    const { restaurantList } = this.props;
    const { sortingMethod, userFavorites } = this.state;
    if (restaurantList) {
      let sortedRestaurantArray = [...restaurantList];
      if (sortingMethod.includes('alphabetical')) {
        sortedRestaurantArray.sort((a, b) => sortingMethod === 'alphabetical_asc' ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName));
      }
      return sortedRestaurantArray.map(restaurant => {
        const isFavorited = userFavorites.includes(restaurant.id);
        return restaurant.userProfileImageUrl && restaurant.userName && restaurant.typeOfFood ? (
          <div className="container bg-white p-3 px-0 mb-4" key={restaurant.id}>
            <div className="row" style={{ marginBottom: "-10px" }}>
              <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
                <img style={{ height: "85px", width: "130px", margin: '0 auto' }} alt="Restaurant" src={restaurant.userProfileImageUrl} />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 px-0">
                <h5>{restaurant.userName}</h5>
                <p><small>Type of Foods: <span>{restaurant.typeOfFood.join(", ")}</span></small></p>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 d-flex justify-content-center flex-column px-0">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span onClick={() => this.toggleFavorite(restaurant.id)}
                  style={{
                    cursor: 'pointer',
                    textAlign: "center",
                    borderRadius: "13px",
                    marginLeft: "-55px",
                  }}>
                  <Heart isClick={isFavorited} onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from triggering the span's onClick
                      this.toggleFavorite(restaurant.id);
                  }} />
                </span>
                <button style={{marginRight:"20px"}} type="button" onClick={() => this.handleViewMenuBtn(restaurant)}
                  className="btn btn-warning btn-sm text-uppercase">
                  View Menu
                </button>
              </div>
            </div>
          </div>
        </div>
        ) : null;
      });
    }
  }

  _renderSearchRestaurants() {
    const { searchText, searchRestaurants, sortingMethod } = this.state;
    let searchResultsArray = [...searchRestaurants];
    if (sortingMethod.includes('alphabetical')) {
      searchResultsArray.sort((a, b) => sortingMethod === 'alphabetical_asc' ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName));
    }
    return searchResultsArray.map(restaurant => {
      const isFavorited = this.state.userFavorites.includes(restaurant.id);
      return restaurant.userProfileImageUrl && restaurant.userName && restaurant.typeOfFood ? (
        <div className="container bg-white p-3 px-0 mb-4" key={restaurant.id}>
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-center">
              <img style={{ height: "85px", width: "130px", margin: '0 auto' }} alt="Restaurant" src={restaurant.userProfileImageUrl} />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 px-0">
              <h5>{restaurant.userName}</h5>
              <p><small>Type of Foods: <span>{restaurant.typeOfFood.join(", ")}</span></small></p>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 d-flex justify-content-center flex-column px-0">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span onClick={() => this.toggleFavorite(restaurant.id)}
                  style={{
                    cursor: 'pointer',
                    textAlign: "center",
                    borderRadius: "13px",
                    marginLeft: "-55px",
                    marginTop:"10px",
                  }}>
                  <Heart isClick={isFavorited} onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from triggering the span's onClick
                      this.toggleFavorite(restaurant.id);
                  }} />
                </span>
                <button style={{marginRight:"20px", marginTop:"10px"}} type="button" onClick={() => this.handleViewMenuBtn(restaurant)}
                  className="btn btn-warning btn-sm text-uppercase">
                  View Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null;
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
          <Navbar2 history={this.props.history} />
          <div className="container px-0 restaurants-cont1-text">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">
                      <FontAwesomeIcon icon="search" />
                    </span>
                  </div>
                  <input type="text" value={defaultSearchValue} onChange={(e) => this.handleSearchBar(e.target.value)} className="form-control" placeholder="RESTAURANT NAME" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
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