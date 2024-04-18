import * as firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyC2gO_-OylPvyUHL49vMlFY4JkucMN_LVQ",
  authDomain: "treasure-chope.firebaseapp.com",
  projectId: "treasure-chope",
  storageBucket: "treasure-chope.appspot.com",
  messagingSenderId: "844460342285",
  appId: "1:844460342285:web:0406fa95d2ec2cdd782944",
  measurementId: "G-R3F53BJH36",
  // apiKey: "AIzaSyBnLUHidIafVYqJ4nwPGn_uK5lLriGokwE",
  // authDomain: "react-quick-food.firebaseapp.com",
  // databaseURL: "https://react-quick-food.firebaseio.com",
  // projectId: "react-quick-food",
  // storageBucket: "react-quick-food.appspot.com",
  // messagingSenderId: "775496944172",
  // appId: "1:775496944172:web:c57dc1dbd0aa26dd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function updateUserProfile(userDetails) {
  return new Promise((resolve, reject) => {
    const {
      userUid,
      userName,
      userEmail,
      userPassword,
      userCity,
      userCountry,
      userGender,
      userAge,
      userProfileImage,  // This should be a File object if updating the image
      isRestaurant,
      typeOfFood,
      restaurantDescription,
      userFavorites,
    } = userDetails;

    // Authenticate first to ensure that only the current logged-in user can update their profile
    const user = firebase.auth().currentUser;
    if (!user || user.uid !== userUid) {
      reject("Unauthorized to update profile");
      return;
    }

    // Handling image upload if a new image is provided
    if (userProfileImage && userProfileImage instanceof File) {
      const storageRef = firebase.storage().ref().child(`userProfileImage/${userUid}/` + userProfileImage.name);
      storageRef.put(userProfileImage).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          updateUserDetailsInFirestore(userUid, { ...userDetails, userProfileImageUrl: downloadURL })
            .then(resolve)
            .catch(reject);
        }).catch(error => reject("Failed to get download URL: " + error.message));
      }).catch(error => reject("Image upload failed: " + error.message));
    } else {
      // Update details directly if no image upload is needed
      updateUserDetailsInFirestore(userUid, userDetails)
        .then(resolve)
        .catch(reject);
    }
  });
}

function updateUserDetailsInFirestore(userUid, userDetails) {
  return db.collection("users").doc(userUid).update(userDetails);
}


function signUp(userDetails) {
  return new Promise((resolve, reject) => {
    const {
      userName,
      userEmail,
      userPassword,
      userCity,
      userCountry,
      userGender,
      userAge,
      userProfileImage,
      isRestaurant,
      typeOfFood,
      restaurantDescription,
      userFavorites, // Add favourites array to userDetails
    } = userDetails;
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        userDetails.userEmail,
        userDetails.userPassword
      )
      .then((success) => {
        let user = firebase.auth().currentUser;
        var uid;
        if (user != null) {
          uid = user.uid;
        }
        firebase
          .storage()
          .ref()
          .child(`userProfileImage/${uid}/` + userProfileImage.name)
          .put(userProfileImage)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                const userProfileImageUrl = success;
                console.log(userProfileImageUrl);
                const userDetailsForDb = {
                  userName: userName,
                  userEmail: userEmail,
                  userPassword: userPassword,
                  userCity: userCity,
                  userCountry: userCountry,
                  userGender: userGender,
                  userAge: userAge,
                  userUid: uid,
                  isRestaurant: isRestaurant,
                  userProfileImageUrl: userProfileImageUrl,
                  typeOfFood: typeOfFood,
                  restaurantDescription: restaurantDescription,
                  userFavorites: userFavorites, // Include favourites array in userDetailsForDb
                };
                db.collection("users")
                  .doc(uid)
                  .set(userDetailsForDb)
                  .then((docRef) => {
                    // console.log("Document written with ID: ", docRef.id);
                    if (userDetailsForDb.isRestaurant) {
                      userDetails.propsHistory.push("/order-requests");
                      resolve(userDetailsForDb);
                    } else {
                      userDetails.propsHistory.push("/");
                      resolve(userDetailsForDb);
                    }
                  })
                  .catch(function (error) {
                    console.error("Error adding document: ", error);
                    reject(error);
                  });
              })
              .catch((error) => {
                // Handle Errors here.
                let errorMessage = error.message;
                console.log("Error in getDownloadURL function", errorMessage);
                reject(errorMessage);
              });
          })
          .catch((error) => {
            // Handle Errors here.
            let errorMessage = error.message;
            console.log("Error in Image Uploading", errorMessage);
            reject(errorMessage);
          });
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log("Error in Authentication", errorMessage);
        reject(errorMessage);
      });
  });
}

function logIn(userLoginDetails) {
  return new Promise((resolve, reject) => {
    const { userLoginEmail, userLoginPassword } = userLoginDetails;
    firebase
      .auth()
      .signInWithEmailAndPassword(userLoginEmail, userLoginPassword)
      .then((success) => {
        db.collection("users")
          .doc(success.user.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.data().isRestaurant) {
              userLoginDetails.propsHistory.push("/order-requests");
              resolve(success);
            } else {
              userLoginDetails.propsHistory.push("/");
              resolve(success);
            }
          });
      })
      .catch((error) => {
        // Provide a more user-friendly error message
        reject("Invalid username or password. Please try again.");
      });
  });
}

function addItem(itemDetails) {
  const { itemTitle, itemIngredients, itemPrice, itemImage, chooseItemType } =
    itemDetails;
  return new Promise((resolve, reject) => {
    let user = firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
    }
    firebase
      .storage()
      .ref()
      .child(`itemImage/${uid}/` + itemImage.name)
      .put(itemImage)
      .then((url) => {
        url.ref
          .getDownloadURL()
          .then((success) => {
            const itemImageUrl = success;
            console.log(itemImageUrl);
            const itemDetailsForDb = {
              itemTitle: itemTitle,
              itemIngredients: itemIngredients,
              itemPrice: itemPrice,
              itemImageUrl: itemImageUrl,
              chooseItemType: chooseItemType,
              availability : true,
              // userUid: uid,
            };
            db.collection("users")
              .doc(uid)
              .collection("menuItems")
              .add(itemDetailsForDb)
              .then((docRef) => {
                // console.log("Document written with ID: ", docRef.id);
                // itemDetails.propsHistory.push("/my-foods");
                resolve("Successfully added food item");
              })
              .catch(function (error) {
                let errorMessage = error.message;
                reject(errorMessage);
                // console.error("Error adding document: ", error);
              });
          })
          .catch((error) => {
            // Handle Errors here.
            let errorMessage = error.message;
            console.log("Error in getDownloadURL function", errorMessage);
            reject(errorMessage);
          });
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("Error in Image Uploading", errorMessage);
        reject(errorMessage);
      });
  });
}

function orderNow(cartItemsList, totalPrice, resDetails, userDetails, history) {
  return new Promise((resolve, reject) => {
    let user = firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
    }
    //changes made -e
    // Destructure 'id' out and collect the rest of the properties into 'resDetailsWithoutId'
    const { id, ...resDetailsWithoutId } = resDetails;

    const myOrder = {
      itemsList: cartItemsList,
      totalPrice: totalPrice,
      status: "PENDING",
      //changes made -e
      ...resDetailsWithoutId, // Spread the rest of the resDetails properties
      customerId: uid,
      restaurantId: resDetails.id,
    };

    const orderRequest = {
      itemsList: cartItemsList,
      totalPrice: totalPrice,
      status: "PENDING",
      ...userDetails,
      //changes made -e
      customerId: uid,
      restaurantId: resDetails.id,
    };

    // console.log("myOrder => ", myOrder)
    // console.log("orderRequest => ", orderRequest)
    db.collection("users")
      .doc(uid)
      .collection("myOrder")
      .add(myOrder)
      .then((docRef) => {
        // console.log(docRef.id)
        db.collection("users")
          .doc(resDetails.id)
          .collection("orderRequest")
          .doc(docRef.id)
          .set(orderRequest)
          .then((docRef) => {
            // console.log("Document written with ID: ", docRef.id);
            resolve("Successfully ordered");
            // history.push("/my-orders");
          })
          .catch(function (error) {
            console.error("Error adding document: ", error.message);
            reject(error.message);
          });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error.message);
        reject(error.message);
      });
  });
}

export default firebase;
export { signUp, logIn, addItem, orderNow, updateUserProfile };
