import React, { Component } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import firebase from "../config/firebase";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      editMode: false,
      imageFile: null, // Added state for storing image file
      profile: {
        restaurantDescription: "",
        typeOfFood: [],
        userAge: "",
        userCity: "",
        userCountry: "",
        userEmail: "",
        userGender: "",
        userName: "",
        userPassword: "",
        userProfileImageUrl: "",
      },
    };
  }

  toggleEditMode = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
    }));
  };
  renderEditableField = (key, value) => {
    const editableFields = [
      "userCountry",
      "restaurantDescription",
      "userCity",
      "userPassword",
      "userProfileImageUrl",
      "userEmail",
      "userName",
    ];

    if (editableFields.includes(key)) {
      return (
        <input
          type={key === "userPassword" ? "password" : "text"}
          value={value}
          onChange={(e) => this.handleChange(key, e.target.value)}
        />
      );
    } else {
      return <span>{value}</span>;
    }
  };

  componentDidMount() {
    if (this.props.user) {
      this.fetchUserProfile();
    }
  }

  fetchUserProfile = async () => {
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(this.props.user.userUid);

    try {
      const doc = await userRef.get();
      if (doc.exists) {
        this.setState({ profile: doc.data(), loading: false });
      } else {
        console.error("No user profile found!");
        this.setState({ error: "No user profile found", loading: false });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      this.setState({ error: error.message, loading: false });
    }
  };

  handleChange = (field, value) => {
    this.setState({
      profile: {
        ...this.state.profile,
        [field]: value,
      },
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(this.props.user.userUid);

    this.setState({ loading: true });
    try {
      await userRef.update(this.state.profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({
        imageFile: file,
      });
    }
  };

  handleImageUpload = async () => {
    const { imageFile } = this.state;
    if (imageFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`user_profile_images/${imageFile.name}`);
      try {
        await fileRef.put(imageFile);
        const imageUrl = await fileRef.getDownloadURL();
        this.setState((prevState) => ({
          profile: {
            ...prevState.profile,
            userProfileImageUrl: imageUrl,
          },
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
      }
    }
  };

  render() {
    const { loading, profile, error, editMode } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <div
          className="container-fluid res-details-cont1"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container px-0 res-details-cont1-text mx-0">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <h1 className="text-uppercase text-white mb-4" style={{marginLeft:"130px"}}>
                      <strong>Edit Profile</strong>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
          <div
            className="col-lg-8 col-md-10 col-sm-12 mx-auto"
            style={{
              backgroundColor: "#fbf2f7",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              padding: "1rem",
            }}
          >
            <h2
              className="text-center"
              style={{ marginBottom: "1rem", color: "#C13F86" }}
            >
              My Profile
            </h2>
            {profile.userProfileImageUrl && (
              <div className="text-center mb-4">
                {editMode === "image" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleImageChange}
                      style={{ display: "none" }}
                      ref={(fileInput) => (this.fileInput = fileInput)}
                    />
                    <img
                      src={profile.userProfileImageUrl}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{
                        maxHeight: "150px",
                        border: "3px solid #c13f86",
                        cursor: "pointer",
                      }}
                      onClick={() => this.fileInput.click()} // Trigger file input click when image is clicked
                    />
                    <button
                      className="btn"
                      onClick={() => this.setState({ editMode: false })}
                      style={{
                        backgroundColor: "#C13F86",
                        color: "#FFFFFF",
                        marginLeft: "10px",
                        marginTop: "10px",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn"
                      onClick={this.handleImageUpload}
                      style={{
                        backgroundColor: "#C13F86",
                        color: "#FFFFFF",
                        marginLeft: "10px",
                        marginTop: "10px",
                      }}
                    >
                      Save Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <img
                      src={profile.userProfileImageUrl}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{
                        maxHeight: "150px",
                        border: "3px solid #c13f86",
                      }}
                    />
                    <button
                      className="btn"
                      onClick={() => this.setState({ editMode: "image" })}
                      style={{
                        backgroundColor: "#C13F86",
                        color: "#FFFFFF",
                        marginLeft: "10px",
                        marginTop: "10px",
                      }}
                    >
                      Edit Image
                    </button>
                  </div>
                )}
              </div>
            )}

            {!editMode && (
              <div>
                {Object.entries(profile).map(([key, value]) => {
                  if (
                    Array.isArray(value) ||
                    key === "userPassword" ||
                    key === "userProfileImageUrl" ||
                    !value
                  ) {
                    return null;
                  }
                  return (
                    <div key={key} className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "bold", color: "#C13F86" }}
                      >
                        {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                      </label>
                      <input
                        type="text"
                        readOnly
                        className="form-control"
                        value={value}
                        style={{
                          boxShadow: "none",
                          color: "#1d0a15",
                          backgroundColor: "#fbf2f7",
                          borderColor: "#C13F86",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          outline: "none",
                        }}
                      />
                    </div>
                  );
                })}
                <button
                  className="btn text-uppercase w-100"
                  onClick={this.toggleEditMode}
                  style={{ backgroundColor: "#C13F86", color: "#FFFFFF" }}
                >
                  <strong>Edit Profile</strong>
                </button>
              </div>
            )}

            {editMode && (
              <form onSubmit={this.handleSubmit} className="mb-4">
                {/* Only render inputs for editable fields */}
                {Object.entries(profile).map(([key, value]) => {
                  if (
                    [
                      "userCountry",
                      "restaurantDescription",
                      "userCity",
                      "userName",
                      "userEmail",
                      "userPassword",
                    ].includes(key)
                  ) {
                    return (
                      <div key={key} className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontWeight: "bold", color: "#C13F86" }}
                        >
                          {key
                            .replace(/([a-z])([A-Z])/g, "$1 $2")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </label>
                        <input
                          type={key === "userPassword" ? "password" : "text"}
                          className="form-control"
                          value={value}
                          onChange={(e) =>
                            this.handleChange(key, e.target.value)
                          }
                          style={{
                            boxShadow: "none",
                            color: "#1d0a15",
                            borderColor: "#C13F86",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            outline: "none",
                            backgroundColor: "#fbf2f7",
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="form-group">
                  <button
                    type="button"
                    onClick={this.toggleEditMode}
                    className="btn btn-secondary w-100 mb-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary w-100">
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
