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
            profile: {
                isRestaurant: false,
                restaurantDescription: "",
                typeOfFood: [],
                userAge: "",
                userCity: "",
                userCountry: "",
                userEmail: "",
                userFavorites: [],
                userGender: "",
                userName: "",
                userPassword: "",
                userProfileImageUrl: "",
            }
        };
    }

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
                [field]: value
            }
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

    render() {
        const { loading, profile, error } = this.state;

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;

        return (
            <div>
                <Navbar2 />
                <div className="container">
                    <h1>Edit Your Profile</h1>
                    <form onSubmit={this.handleSubmit}>
                        {Object.entries(profile).map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return null; // Handle arrays differently if necessary
                            }
                            return (
                                <div key={key}>
                                    <label>{key}:</label>
                                    <input
                                        type={key === "userPassword" ? "password" : "text"}
                                        value={value}
                                        onChange={(e) => this.handleChange(key, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                        <button type="submit">Save Profile</button>
                    </form>
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
