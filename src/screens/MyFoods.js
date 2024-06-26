import React, { Component } from 'react';
// import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
// import firebase from '../config/firebase';
import { connect } from 'react-redux';
import { my_foods } from '../store/action';
import firebase from "../config/firebase";

import 'bootstrap/dist/css/bootstrap.css';
import '../App.css'

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MyFoods extends Component {
    constructor() {
        super()
        this.state = {
        }
    }

    

    async componentDidMount() {
        this.props.my_foods();
    }

    // Taking user and myFoods from props and setting them into the state.
    static getDerivedStateFromProps(props) {
        const { user, myFoods } = props

        return {
            userDetails: user,
            myFoods: myFoods,
        }
    }

    handleToggleAvailability = (val, userDetails, myFoods) => {
        const menuItemId = myFoods[val].id;
        const menuItemDocRef = firebase
            .firestore()
            .collection("users")
            .doc(userDetails.userUid)
            .collection("menuItems")
            .doc(menuItemId);
    
        // Toggling the availability status
        const newAvailability = !myFoods[val].availability;
    
        menuItemDocRef
            .update({ availability: newAvailability })
            .then(() => {
                alert(`Item marked as ${newAvailability ? "available" : "unavailable"} successfully.`);
                // It would be a good idea to update your component's state here to reflect the changes
                // However, you'll likely need to re-fetch or update the myFoods array in the state to reflect this change.
            })
            .catch((error) =>
                console.error("Error toggling item availability:", error)
            );
    }
    

    _renderMyFoodsList() {
        const { myFoods, userDetails } = this.state;
        if (myFoods) {
            console.log(myFoods);
            console.log(userDetails);
            return Object.keys(myFoods).map((val) => {
                return (
                    <div className="container pt-4 pb-2 border-bottom" key={val}>
                        <div className="row">
                            <div className="col-lg-2 col-md-3 col-8 offset-2 offset-lg-0 offset-md-0 px-0 mb-3 text-center">
                                <img style={{ width: "70px", height: "70px" }} alt="Natural Healthy Food" src={myFoods[val].itemImageUrl} />
                            </div>
                            <div className="col-lg-7 col-md-6 col-sm-12 px-0">
                                <h6 >{myFoods[val].itemTitle}</h6>
                                <p className="mb-1 "><small>{myFoods[val].itemIngredients}</small></p>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-right">
                                <span className="mx-3"><b>${myFoods[val].itemPrice}</b></span>
                                <label className="switch">
                                    <input type="checkbox" checked={myFoods[val].availability} onChange={() => this.handleToggleAvailability(val, userDetails, myFoods)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    }
    

    render() {
        const { userDetails } = this.state;
        // console.log(userDetails)
        return (
            <div>
                <div className="container-fluid res-details-cont1">
                    <div className="">
                        {/* <Navbar history={this.props.history} /> */}
                        <Navbar2 history={this.props.history} />
                        <div className="container px-0 res-details-cont1-text mx-0">
                            <div className="container">
                                {
                                    userDetails ? <div className="row">
                                        <div className="col-lg-2 col-md-3 col-6 text-lg-center text-md-center pr-0 mb-2">
                                            <img className="p-2 bg-white rounded text-center" alt="Natural Healthy Food" style={{ width: "60%" }} src={userDetails.userProfileImageUrl} />
                                        </div>
                                        <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
                                            <h1 className="restaurant-title">{userDetails.userName}</h1>
                                            <p className="restaurant-text">{userDetails.typeOfFood.join(', ')}</p>
                                        </div>
                                    </div> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ background: "#EBEDF3" }} className="container-fluid py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 col-md-10 col-sm-12 offset-lg-1 offset-md-1">
                                <div className="container">
                                    < div className="row">
                                        <div className="col-12 bg-white p-4">
                                            <h4 className="text-center">My Food List</h4>
                                            {this._renderMyFoodsList()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}
// Extracting from the Redux store and pass them as props to your component.
const mapStateToProps = state => {
    // console.log("mapStateToProps states =>> ", state);
    return {
        user: state.user,
        myFoods: state.myFoods,
    }
}

// Updating the props of a component whenever the Redux store's state changes.
const mapDispatchToProps = dispatch => {
    return {
        my_foods: () => dispatch(my_foods()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFoods);
// import React, { Component } from 'react';
// // import Navbar from '../components/Navbar';
// import Navbar2 from '../components/Navbar2';
// import Footer from '../components/Footer';
// // import firebase from '../config/firebase';
// import { connect } from 'react-redux';
// import { my_foods } from '../store/action';
// import firebase from "../config/firebase";

// import 'bootstrap/dist/css/bootstrap.css';
// import '../App.css'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// class MyFoods extends Component {
//     constructor() {
//         super()
//         this.state = {
//         }
//     }

//     async componentDidMount() {
//         this.props.my_foods();
//     }

//     // Taking user and myFoods from props and setting them into the state.
//     static getDerivedStateFromProps(props) {
//         const { user, myFoods } = props

//         return {
//             userDetails: user,
//             myFoods: myFoods,
//         }
//     }

//     handleDelete = (val, userDetails, myFoods) => {
//         // Implement your delete logic here, utilizing val, userDetails, and myFoods
//         console.log("1");
//         console.log('Deleting item with val:', val);
//         console.log("2");
//         console.log('Deleting item with user deets:',userDetails.userUid
//         );
//         console.log("3");
//         console.log('Deleting item with food deets:',myFoods);
//         console.log('IM SO DONE:',myFoods[val].id);
//         // You might call a redux action or a service function here.

//         const menuItemId = myFoods[val].id;
//         const menuItemDocRef = firebase
//             .firestore()
//             .collection("users")
//             .doc(userDetails.userUid) // The UID of the user
//             .collection("menuItems")
//             .doc(menuItemId); // The ID of the document to update


//             menuItemDocRef
//           .update({ availability: false })
//           .then(() => alert("Item availability set to false successfully."))
//           .catch((error) =>
//             console.error("Error setting availability to false:", error)
//           );


//     }

//     _renderMyFoodsList() {
//         const { myFoods, userDetails } = this.state;
//         if (myFoods) {
//             console.log(myFoods);
//             console.log(userDetails);
//             return Object.keys(myFoods).map((val) => {
//                 return (
//                     <div className="container pt-4 pb-2 border-bottom" key={val}>
//                         <div className="row">
//                             <div className="col-lg-2 col-md-3 col-8 offset-2 offset-lg-0 offset-md-0 px-0 mb-3 text-center">
//                                 <img style={{ width: "70px", height: "70px" }} alt="Natural Healthy Food" src={myFoods[val].itemImageUrl} />
//                             </div>
//                             <div className="col-lg-7 col-md-6 col-sm-12 px-0">
//                                 <h6 className="">{myFoods[val].itemTitle}</h6>
//                                 <p className="mb-1"><small>{myFoods[val].itemIngredients}</small></p>
//                             </div>
//                             <div className="col-lg-3 col-md-3 col-sm-12 px-0 text-right">
//                                 <span className="mx-3"><b>${myFoods[val].itemPrice}</b></span>
//                                 <button
//                                     className="btn btn-danger"
//                                     onClick={() => this.handleDelete(val, userDetails, myFoods)}
//                                     style={{ backgroundImage: 'linear-gradient(to right, #EE6EA7, #ed4264)' }}
//                                 >
//                                  Mark As Unavailable   
//                                 </button>
//                             </div>
                            
//                         </div>
//                     </div>
//                 )
//             })
//         }
//     }

//     render() {
//         const { userDetails } = this.state;
//         // console.log(userDetails)
//         return (
//             <div>
//                 <div className="container-fluid res-details-cont1">
//                     <div className="">
//                         {/* <Navbar history={this.props.history} /> */}
//                         <Navbar2 history={this.props.history} />
//                         <div className="container px-0 res-details-cont1-text mx-0">
//                             <div className="container">
//                                 {
//                                     userDetails ? <div className="row">
//                                         <div className="col-lg-2 col-md-3 col-6 text-lg-center text-md-center pr-0 mb-2">
//                                             <img className="p-2 bg-white rounded text-center" alt="Natural Healthy Food" style={{ width: "60%" }} src={userDetails.userProfileImageUrl} />
//                                         </div>
//                                         <div className="col-lg-10 col-md-9 col-12 pl-lg-0 pl-md-0">
//                                             <h1 className="restaurant-title">{userDetails.userName}</h1>
//                                             <p className="restaurant-text">{userDetails.typeOfFood.join(', ')}</p>
//                                         </div>
//                                     </div> : null
//                                 }
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div style={{ background: "#EBEDF3" }} className="container-fluid py-5">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-lg-10 col-md-10 col-sm-12 offset-lg-1 offset-md-1">
//                                 <div className="container">
//                                     < div className="row">
//                                         <div className="col-12 bg-white p-4">
//                                             <h4 className="text-center">My Food List</h4>
//                                             {this._renderMyFoodsList()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <Footer />
//             </div >
//         );
//     }
// }
// // Extracting from the Redux store and pass them as props to your component.
// const mapStateToProps = state => {
//     // console.log("mapStateToProps states =>> ", state);
//     return {
//         user: state.user,
//         myFoods: state.myFoods,
//     }
// }

// // Updating the props of a component whenever the Redux store's state changes.
// const mapDispatchToProps = dispatch => {
//     return {
//         my_foods: () => dispatch(my_foods()),
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(MyFoods);