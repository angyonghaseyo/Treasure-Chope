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
    if (this.state.editMode) {
        // Exiting edit mode
        this.setState({
            editMode: false,
            profile: {
                ...this.state.profile,
                tempProfileImageUrl: null  // Clear the temporary URL to ensure no old preview is shown
            }
        }, () => {
            this.fetchUserProfile(); // Fetch the latest profile to revert unsaved changes
        });
    } else {
        // Entering edit mode
        this.setState({
            editMode: true,
            tempProfile: { ...this.state.profile }  // Optionally backup current state
        });
    }
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
      // Update the database with the current profile state
      await userRef.update(this.state.profile);
      // After a successful update, exit edit mode and refresh the profile from the database
      this.setState({ editMode: false }, () => {
        this.fetchUserProfile();
        alert("Profile updated successfully!");
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      this.setState({ editMode: true }); // Keep the user in edit mode on error
      alert("Failed to update profile. Please try again.");
    } finally {
      this.setState({ loading: false });
    }
  };
  

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the file
      this.setState({
          imageFile: file,
          profile: {
              ...this.state.profile,
              tempProfileImageUrl: imageUrl, // Temporarily store the URL for preview purposes
          },
      });
  }
  };

  handleImageUpload = async () => {
    const { imageFile } = this.state;
    const { userUid } = this.props.user;

    if (!imageFile) {
      alert("No image selected!");
      return;
    }

    if (!userUid) {
      alert("User ID not found!");
      return;
    }

    const storageRef = firebase.storage().ref();
    const userRef = firebase.firestore().collection("users").doc(userUid);

    this.setState({ loading: true });

    try {
      const doc = await userRef.get();
      let imageName = doc.exists && doc.data().imageName;
      if (!imageName) {
        imageName = `image_${new Date().getTime()}.png`;
        await userRef.update({ imageName });
      }

      const fileRef = storageRef.child(`userProfileImage/${userUid}/${imageName}`);

      // Upload the new image
      await fileRef.put(imageFile);
      const imageUrl = await fileRef.getDownloadURL();

      // Immediately update the UI with the new image URL
      this.setState({
        profile: { ...this.state.profile, userProfileImageUrl: imageUrl, tempProfileImageUrl: null },
        loading: false
      }, () => {
        alert("Image uploaded successfully!");
      });

      // Make sure to update Firestore after the state update
      await userRef.update({ userProfileImageUrl: imageUrl });

    } catch (error) {
      console.error("Error uploading image or updating profile:", error);
      this.setState({ loading: false });
      alert("Failed to upload image or update profile.");
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
                    <h1
                      className="text-uppercase text-white mb-4"
                      style={{ marginLeft: "130px" }}
                    >
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

            {!editMode && (
              <div>
                {profile.userProfileImageUrl && (
                  <div className="text-center mb-4">
                    <img
                      src={profile.userProfileImageUrl}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        border: "3px solid #c13f86",
                        borderRadius: "50%",
                        cursor: "pointer",
                      
                      }}
                    />
                  </div>
                )}

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
                {profile.userProfileImageUrl && (
                  <div className="text-center mb-4">
                    <img
            src={profile.tempProfileImageUrl || profile.userProfileImageUrl}
            alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        border: "3px solid #c13f86",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => this.fileInput.click()}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleImageChange}
                      style={{ display: "none" }}
                      ref={(fileInput) => (this.fileInput = fileInput)}
                    />
                    <div>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          backgroundColor: "#C13F86",
                          color: "#FFFFFF",
                          margin: "10px",
                        }}
                        onClick={() => this.setState({ editMode: false })}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          backgroundColor: "#C13F86",
                          color: "#FFFFFF",
                          margin: "10px",
                        }}
                        onClick={this.handleImageUpload}
                      >
                        Save Image
                      </button>
                    </div>
                  </div>
                )}
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
                  <button type="submit" 
                  className="btn btn-primary w-100">
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
