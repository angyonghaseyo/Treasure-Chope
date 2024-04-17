import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { signUp, logIn } from "../config/firebase";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      isRegisterForm: false,
      registerFormError: "",
      userProfileImageLable: "Choose image",
      userName: "",
      userEmail: "",
      userPassword: "",
      userConfirmPassword: false,
      userCity: "",
      userCountry: "",
      userGender: "Male",
      userAge: "",
      userProfileImage: null,
      userTNC: false,
      showError: false,
      userLoginEmail: "",
      userLoginPassword: "",
      loginErrorMessage: "",
      userFavorites: [],
    };
    this.handleForms = this.handleForms.bind(this);
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
    this.handleLoginNowBtn = this.handleLoginNowBtn.bind(this);
  }

  handleForms() {
    const { isRegisterForm } = this.state;
    if (isRegisterForm) {
      this.setState({ isRegisterForm: false });
    } else {
      this.setState({ isRegisterForm: true });
    }
  }

  handleUserName(e) {
    const userName = e;
    const userNameFormate = /^([A-Za-z.\s_-]).{5,}$/;
    if (userName.match(userNameFormate)) {
      this.setState({
        showError: false,
        registerFormError: "",
        userName: userName,
      });
    } else {
      this.setState({
        showError: true,
        registerFormError: "Please enter a valid name.",
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
        registerFormError: "Please enter a valid age.",
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
      userFavorites,
    } = this.state;

    event.preventDefault();

    // const whiteSpaces = /^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/;
    const userNameFormate = /^([A-Za-z.\s_-]).{5,}$/;
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
        isRestaurant: false,
        propsHistory: this.props.history,
        typeOfFood: [],
        restaurantDescription: "",
        // Add the favourites array to userDetails
        userFavorites,
      };
      try {
        await signUp(userDetails);
        // console.log(signUpReturn)
      } catch (error) {
        console.log("Error in Sign up => ", error);
      }
    }
  }

  async handleLoginNowBtn(event) {
    const { userLoginEmail, userLoginPassword } = this.state;
    const userLoginDetails = {
      userLoginEmail: userLoginEmail,
      userLoginPassword: userLoginPassword,
      propsHistory: this.props.history,
    };

    event.preventDefault();

    try {
      await logIn(userLoginDetails);
      this.setState({ loginErrorMessage: "" });
      // console.log(LoginReturn)
    } catch (error) {
      console.error("Login error:", error);
      this.setState({ loginErrorMessage: error });
      // console.log("Error in Login => ", error);
    }
  }

  render() {
    const {
      isRegisterForm,
      showError,
      registerFormError,
      userProfileImageLable,
      userTNC,
      userGender,
    } = this.state;
    return (
      <div>
        <div className="container-fluid register-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container register-cont1-text">
              <h1 className="text-uppercase text-white text-center mb-4">
                <strong>User Login / Register</strong>
              </h1>
            </div>
          </div>
        </div>
        <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
          {isRegisterForm ? (
    <div className="col-lg-6 col-md-8 col-sm-12 mx-auto" style={{ backgroundColor: "#fbf2f7", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "1rem" }}>
        <h2 className="text-center" style={{ marginBottom: "1rem", color: "#C13F86" }}>Create An Account</h2>
              <form onSubmit={this.handleCreateAccountBtn}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="userFullName"style={{ fontWeight: "bold", color: "#C13F86" }}>Full Name </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      placeholder="Full Name"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserName(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="userEmail" style={{ fontWeight: "bold", color: "#C13F86" }}>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="userEmail"
                      placeholder="Email"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="userPassword" style={{ fontWeight: "bold", color: "#C13F86" }}>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="userPassword"
                      placeholder="Password"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="userConfirmPassword" style={{ fontWeight: "bold", color: "#C13F86" }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="userConfirmPassword"
                      placeholder="Password"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) =>
                        this.handleUserConfirmPassword(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="userCity" style={{ fontWeight: "bold", color: "#C13F86" }}>City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userCity"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserCity(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="userCountry" style={{ fontWeight: "bold", color: "#C13F86" }}>Country</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userCountry"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserCountry(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="userGender" style={{ fontWeight: "bold", color: "#C13F86" }}>Gender</label>
                    <select
                      id="userGender"
                      className="form-control"
                      value={userGender}
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onChange={this.handleUserGender}
                    >
                      <option defaultValue>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="userAge" style={{ fontWeight: "bold", color: "#C13F86" }}>Age</label>
                    <input
                      type="number"
                      className="form-control"
                      id="userAge"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
                      onKeyUp={(e) => this.handleUserAge(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <p className="mb-2" style={{ fontWeight: "bold", color: "#C13F86" }}>Profile Image</p>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="userProfileImage"
                        onChange={this.handleUserProfileImage}
                        style={{
                          boxShadow: "none",
                          color: "#1d0a15",
                          borderColor: '#C13F86', // Sets the border color to match the label
                          borderWidth: '1px', // Specifies the border width
                          borderStyle: 'solid', // Ensures the border is solid
                          outline: 'none' // Removes the default focus outline
                      }}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="userProfileImage" style={{
                          backgroundColor: 'transparent',
                          borderColor: '#c13f86',
                          color: '#1d0a15',
                          fontSize: '0.875rem',
                          transition: 'border .3s ease-in-out',
                          display: 'block',
                          padding: '0.375rem 0.75rem',
                          width: '100%',
                          textAlign: 'left',  // Ensures text alignment is consistent
                          pointerEvents: 'none',  // Ensures clicks pass through to the input
                        }}
                      >
                        {userProfileImageLable}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="userTNC"
                      style={{
                        boxShadow: "none",
                        color: "#1d0a15",
                        borderColor: '#C13F86', // Sets the border color to match the label
                        borderWidth: '1px', // Specifies the border width
                        borderStyle: 'solid', // Ensures the border is solid
                        outline: 'none' // Removes the default focus outline
                    }}
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
                  className="btn btn-warning text-uppercase mb-3"
                  style={{ backgroundColor: "#c13f86", color: "white" }}
                >
                  <b>Create an Account</b>
                </button>
              </form>
              <p className="m-0">
                Already have an account?{" "}
                <span
                  className="cursor-pointer"
                  onClick={this.handleForms}
                  style={{ color: "#c13f86" }}
                >
                  Login Here
                </span>
              </p>
            </div>
          ) : (
            <div className="col-lg-4 col-md-6 col-sm-12 mx-auto" style={{ backgroundColor: "#fbf2f7", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "1rem" }}>
              <h2 className="text-center" style={{ marginBottom: "1rem", color: "#C13F86" }}>Login</h2>
              {this.state.loginErrorMessage && (
                <div className="alert alert-danger" role="alert">
                  {this.state.loginErrorMessage}
                </div>
              )}
              <form onSubmit={this.handleLoginNowBtn}>
                <div className="form-group">
                  <label htmlFor="userLoginEmail" style={{ fontWeight: "bold", color: "#C13F86" }}>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userLoginEmail"
                    placeholder="Email"
                    style={{
                      boxShadow: "none",
                      color: "#1d0a15",
                      borderColor: '#C13F86', // Sets the border color to match the label
                      borderWidth: '1px', // Specifies the border width
                      borderStyle: 'solid', // Ensures the border is solid
                      outline: 'none' // Removes the default focus outline
                  }}
                    onChange={(e) =>
                      this.setState({ userLoginEmail: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userLoginPassword" style={{ fontWeight: "bold", color: "#C13F86" }}>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userLoginPassword"
                    placeholder="Password"
                    style={{
                      boxShadow: "none",
                      color: "#1d0a15",
                      borderColor: '#C13F86', // Sets the border color to match the label
                      borderWidth: '1px', // Specifies the border width
                      borderStyle: 'solid', // Ensures the border is solid
                      outline: 'none' // Removes the default focus outline
                  }}
                    onChange={(e) =>
                      this.setState({ userLoginPassword: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-warning text-uppercase mb-3"
                  style={{ backgroundColor: "#c13f86", color: "white" }}
                  onClick={this.handleLoginNowBtn}
                >
                  <b>Login Now</b>
                </button>

              </form>
              <p className="m-0">
                Don't have an account yet?{" "}
                <span
                  className="cursor-pointer"
                  onClick={this.handleForms}
                  style={{ color: "#c13f86" }}
                >
                  Create an Account
                </span>
              </p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}
