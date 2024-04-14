import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { signUp } from "../config/firebase";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

export default class RegisterRestaurant extends Component {
  constructor() {
    super();
    this.state = {
      registerFormError: "",
      userProfileImageLable: "Choose image",
      userName: "",
      userEmail: "",
      userPassword: "",
      userConfirmPassword: false,
      userCity: "",
      userCountry: "",
      userGender: "",
      userAge: "",
      userProfileImage: null,
      userTNC: false,
      showError: false,
      userLoginEmail: "",
      userLoginPassword: "",
      typeOfFood: ["", "", ""],
      restaurantDescription: "",
      //   uenNumber: "",
      //   bankAccountNumber: "",
      //   selectedBank: "",
    };
    this.handleUserName = this.handleUserName.bind(this);
    this.handleUserEmail = this.handleUserEmail.bind(this);
    this.handleUserPassword = this.handleUserPassword.bind(this);
    this.handleUserConfirmPassword = this.handleUserConfirmPassword.bind(this);
    this.handleUserCity = this.handleUserCity.bind(this);
    this.handleUserCountry = this.handleUserCountry.bind(this);
    this.handleUserAge = this.handleUserAge.bind(this);
    this.handleCreateAccountBtn = this.handleCreateAccountBtn.bind(this);
    this.handleUserProfileImage = this.handleUserProfileImage.bind(this);
    this.handleUserTNC = this.handleUserTNC.bind(this);
    this.handleUserGender = this.handleUserGender.bind(this);
    this.handleTypeOfFood = this.handleTypeOfFood.bind(this);
    this.handleRestaurantDescription = this.handleRestaurantDescription.bind(this);
    // this.handleUENNumber = this.handleUENNumber.bind(this);
    // this.handleBankAccountNumber = this.handleBankAccountNumber.bind(this);
    // this.handleSelectBank = this.handleSelectBank.bind(this);
  }

  handleUserName(e) {
    const userName = e;
    const userNameFormate = /^([A-Za-z.\s_-]).{2,}$/;
    if (userName.match(userNameFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userName: userName,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid name of minimum 3 characters.",
        userName: "",
      });
    }
  }

  handleUserEmail(e) {
    const userEmail = e;
    const userEmailFormate =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (userEmail.match(userEmailFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userEmail: userEmail,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid email address.",
        userEmail: "",
      });
    }
  }

  handleUserPassword(e) {
    const userPassword = e;
    const userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;
    if (userPassword.match(userPasswordFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userPassword: userPassword,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError:
          "Use alphanumeric, uppercase, lowercase & greater than 10 characters.",
        userPassword: "",
      });
    }
  }

  handleUserConfirmPassword(e) {
    const userConfirmPassword = e;
    const { userPassword } = this.state;
    if (userConfirmPassword.match(userPassword)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userConfirmPassword: true,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Confirmation password not matched.",
        userConfirmPassword: false,
      });
    }
  }

  handleUserCity(e) {
    const userCity = e;
    const userCityFormate = /^([A-Za-z.\s_-]).{5,}$/;
    if (userCity.match(userCityFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userCity: userCity,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid city name.",
        userCity: "",
      });
    }
  }

  handleUserCountry(e) {
    const userCountry = e;
    const userCountryFormate = /^([A-Za-z.\s_-]).{5,}$/;
    if (userCountry.match(userCountryFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userCountry: userCountry,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid country name.",
        userCountry: "",
      });
    }
  }

  handleUserGender(e) {
    this.setState({
      userGender: e.target.value,
    });
  }

  handleUserAge(e) {
    const userAge = e;
    if (userAge > 0 && userAge < 101) {
      this.setState({
        showError: false,
        registerFormError: "",
        userAge: userAge,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError:
          "Please enter a valid age: Minimum age requirement is 13 or above.",
        userAge: "",
      });
    }
  }

  handleUserProfileImage(e) {
    if (e.target.files[0] != null) {
      this.setState({
        showError: false,
        registerFormError: "",
        userProfileImageLable: e.target.files[0].name,
        userProfileImage: e.target.files[0],
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please select a profile image.",
        userProfileImageLable: "Choose image...",
        userProfileImage: "",
      });
    }
  }

  //inlclude a pop-up for TNC
  handleUserTNC() {
    const { userTNC } = this.state;
    if (!userTNC) {
      this.setState({
        userTNC: true,
        showError: false,
        registerFormError: "",
      });
    } else {
      this.setState({
        userTNC: false,
        showError: true,
        registerFormError: "Please accept terms and conditions.",
      });
    }
  }

  handleTypeOfFood(e, index) {
    const { typeOfFood } = this.state;
    typeOfFood[index] = e.target.value;
    this.setState({ typeOfFood });
  }

  handleRestaurantDescription = (e) => {
    this.setState({
      restaurantDescription: e.target.value,
    });
  };

  //   handleUENNumber(e) {
  //     this.setState({ uenNumber: e.target.value });
  //   }

  //   handleBankAccountNumber(e) {
  //     this.setState({ bankAccountNumber: e.target.value });
  //   }

  //   handleSelectBank(e) {
  //     this.setState({ selectedBank: e.target.value });
  //   }

  async handleCreateAccountBtn(event) {
    const {
      userName,
      userEmail,
      userPassword,
      userConfirmPassword,
      userCity,
      userCountry,
      userGender,
      userAge,
      userProfileImage,
      userTNC,
      typeOfFood,
      restaurantDescription,
      //   uenNumber,
      //   bankAccountNumber,
      //   selectedBank,
    } = this.state;
    event.preventDefault();

    // const whiteSpaces = /^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/;
    const userNameFormate = /^([A-Za-z.\s_-]).{2,}$/;
    const userEmailFormate =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;
    const userCountryFormate = /^([A-Za-z.\s_-]).{5,}$/;
    const userCityFormate = /^([A-Za-z.\s_-]).{5,}$/;

    if (!userName.match(userNameFormate)) {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid name.",
      });
    } else if (!userEmail.match(userEmailFormate)) {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid email address.",
        userEmail: "",
      });
    } else if (!userPassword.match(userPasswordFormate)) {
      this.setState({
        showError: true,
        registerFormError:
          "Use alphanumeric, uppercase, lowercase & greater than 10 characters.",
        userPassword: "",
      });
    } else if (!userConfirmPassword) {
      this.setState({
        showError: true,
        registerFormError: "Confirmation password not matched.",
        userConfirmPassword: false,
      });
    } else if (!userCity.match(userCityFormate)) {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid city name.",
        userCity: "",
      });
    } else if (!userCountry.match(userCountryFormate)) {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid country name.",
        userCountry: "",
      });
    } else if (!(userAge > 0 && userAge < 101)) {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid age.",
        userAge: "",
      });
    } else if (userProfileImage == null) {
      this.setState({
        showError: true,
        registerFormError: "Please select a profile image.",
        userProfileImageLable: "Choose image...",
        userProfileImage: "",
      });
    } else if (!userTNC) {
      this.setState({
        userTNC: false,
        showError: true,
        registerFormError: "Please accept terms and conditions.",
      });
    } else {
      // console.log(userName, userEmail, userPassword, userConfirmPassword, userCity, userCountry, userGender, userAge, userProfileImage, userTNC)
      const userDetails = {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userCity: userCity,
        userCountry: userCountry,
        userGender: userGender,
        userAge: userAge,
        userProfileImage: userProfileImage,
        isRestaurant: true,
        propsHistory: this.props.history,
        typeOfFood: typeOfFood.filter((food) => food.trim() !== ""),
        restaurantDescription: restaurantDescription,
        userFavorites: [],
        //uenNumber: uenNumber,
        //bankAccountNumber: bankAccountNumber,
        //selectedBank: selectedBank,
      };
      try {
        await signUp(userDetails);
        // console.log(signUpReturn)
      } catch (error) {
        console.log("Error in Register Restaurant => ", error);
      }
    }
  }

  render() {
    const {
      showError,
      registerFormError,
      userProfileImageLable,
      userTNC,
      userGender,
      typeOfFood,
      restaurantDescription,
    } = this.state;
    return (
      <div>
        <div className="container-fluid register-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container register-cont1-text">
              <h1 className="text-uppercase text-white text-center mb-4">
                <strong>Register your business</strong>
              </h1>
            </div>
          </div>
        </div>
        <div className="container-fluid py-5 bg-light">
          <div className="col-lg-6 col-md-6 col-sm-12 mx-auto bg-white shadow p-4">
            <h2 className="text-center mb-4">Register Restaurant</h2>
            <form onSubmit={this.handleCreateAccountBtn}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="userFullName">Registered Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    placeholder="Full Name"
                    onKeyUp={(e) => this.handleUserName(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="userEmail">Registered Business Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    placeholder="Email"
                    onKeyUp={(e) => this.handleUserEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="userPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userPassword"
                    placeholder="Password"
                    onKeyUp={(e) => this.handleUserPassword(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="userConfirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userConfirmPassword"
                    placeholder="Password"
                    onKeyUp={(e) =>
                      this.handleUserConfirmPassword(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="userCity">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userCity"
                    onKeyUp={(e) => this.handleUserCity(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="userCountry">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userCountry"
                    onKeyUp={(e) => this.handleUserCountry(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="userGender">Gender</label>
                  <select
                    id="userGender"
                    className="form-control"
                    value={userGender}
                    onChange={this.handleUserGender}
                  >
                    <option defaultValue>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="form-group col-md-2">
                  <label htmlFor="userAge">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="userAge"
                    onKeyUp={(e) => this.handleUserAge(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <p className="mb-2">Logo</p>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="userProfileImage"
                      onChange={this.handleUserProfileImage}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="userProfileImage"
                    >
                      {userProfileImageLable}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="typeOfFood1">Top Dish 1</label>
                  <input
                    type="text"
                    className="form-control"
                    id="typeOfFood1"
                    value={typeOfFood[0]}
                    onChange={(e) => this.handleTypeOfFood(e, 0)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="typeOfFood2">Top Dish 2</label>
                  <input
                    type="text"
                    className="form-control"
                    id="typeOfFood2"
                    value={typeOfFood[1]}
                    onChange={(e) => this.handleTypeOfFood(e, 1)}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="typeOfFood3">Top Dish 3</label>
                  <input
                    type="text"
                    className="form-control"
                    id="typeOfFood3"
                    value={typeOfFood[2]}
                    onChange={(e) => this.handleTypeOfFood(e, 2)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="restaurantDescription">
                    Restaurant Description
                  </label>
                  <textarea
                    className="form-control"
                    id="restaurantDescription"
                    rows="4"
                    placeholder="Describe your restaurant"
                    value={restaurantDescription}
                    onChange={(e) => this.handleRestaurantDescription(e)}
                  ></textarea>
                </div>
              </div>

              {/* <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="uenNumber">UEN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="uenNumber"
                    placeholder="UEN Number"
                    onChange={(e) => this.handleUENNumber(e)}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="bankAccountNumber">Bank Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankAccountNumber"
                    placeholder="Bank Account Number"
                    onChange={(e) => this.handleBankAccountNumber(e)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="selectBank">Select Bank</label>
                <select
                  className="form-control"
                  id="selectBank"
                  onChange={(e) => this.handleSelectBank(e)}
                >
                  <option value="">Please select</option>
                  <option value="bank1">DBS</option>
                  <option value="bank2">UOB</option>
                  <option value="bank3">POSB</option>
                </select>
              </div> */}
              <div className="form-group">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="userTNC"
                    defaultChecked={userTNC}
                    onChange={this.handleUserTNC}
                  />
                  <label className="custom-control-label" htmlFor="userTNC">
                    Accept Terms and Conditions
                  </label>
                </div>
              </div>
              <p className="text-danger">
                {showError ? registerFormError : null}
              </p>
              <button
                type="submit"
                style={{
                  backgroundColor: "#C13F86",
                  borderColor: "#C13F86",
                  color: "#FFFFFF",
                }}
                className="btn text-uppercase mb-3"
                onClick={this.handleCreateAccountBtn}
              >
                {" "}
                <b>Create an Account</b>
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
