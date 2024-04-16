import React, { Component } from "react";
// import Navbar from '../components/Navbar';
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { addItem } from "../config/firebase";
import Swal from "sweetalert2";

import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

export default class AddMenuItems extends Component {
  constructor() {
    super();
    this.state = {
      itemImageLable: "Choose image",
      itemTitle: "",
      itemIngredients: "",
      itemPrice: "",
      itemImage: "",
      chooseItemType: "",
      showError: false,
      registerFormError: "",
    };

    // Binding the methods to `this` class instance
    this.handleItemImage = this.handleItemImage.bind(this);
    this.handleAddYourItemBtn = this.handleAddYourItemBtn.bind(this);
  }

  handleItemImage(e) {
    if (e.target.files[0] != null) {
      this.setState({
        itemImageLable: e.target.files[0].name,
        itemImage: e.target.files[0],
      });
    } else {
      this.setState({
        itemImageLable: "Choose image",
        itemImage: "",
      });
    }
  }

  async handleAddYourItemBtn(event) {
    event.preventDefault();
    const { itemTitle, itemIngredients, itemPrice, itemImage, chooseItemType } =
      this.state;
    if (!itemTitle) {
      this.setState({
        showError: true,
        registerFormError: "Invalid item title.",
      });
    } else if (!itemIngredients) {
      this.setState({
        showError: true,
        registerFormError: "Invalid item ingredients.",
      });
    } else if (!itemPrice) {
      this.setState({
        showError: true,
        registerFormError: "Invalid item price.",
      });
    } else if (!itemImage) {
      this.setState({
        showError: true,
        registerFormError: "Image is required.",
      });
    } else if (!chooseItemType) {
      this.setState({
        showError: true,
        registerFormError: "Must be selected any one.",
      });
    } else {
      this.setState({
        showError: false,
        registerFormError: "",
      });
      const itemDetails = {
        itemTitle,
        itemIngredients,
        itemPrice,
        itemImage,
        chooseItemType,
        propsHistory: this.props.history,
      };
      try {
        const addItemReturn = await addItem(itemDetails);
        // console.log(addItemReturn)
        //sweetalert
        Swal.fire({
          title: "Success",
          text: addItemReturn,
          type: "success",
        }).then(() => {
          this.props.history.push("/my-foods");
        });
      } catch (error) {
        // console.log("Error in add menu items => ", error)
        Swal.fire({
          title: "Error",
          text: error,
          type: "error",
        });
      }
    }
  }

  render() {
    const { showError, registerFormError } = this.state;
    return (
      <div>
        <div className="container-fluid register-cont1">
          <div className="">
            {/* <Navbar history={this.props.history} /> */}
            <Navbar2 history={this.props.history} />
            <div className="container register-cont1-text">
              <h1 className="text-uppercase text-white text-center mb-4">
                <strong>Clear your leftovers!</strong>
              </h1>
            </div>
          </div>
        </div>
        <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
    <div className="col-lg-6 col-md-8 col-sm-12 mx-auto" style={{ backgroundColor: "#fbf2f7", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "1rem" }}>
        <h2 className="text-center" style={{ marginBottom: "1rem", color: "#C13F86" }}>Add Surprise Bag</h2>
        <form onSubmit={this.handleAddYourItemBtn}>
        <div className="mb-3">
    <label htmlFor="itemTitle" className="form-label" style={{ fontWeight: "bold", color: "#C13F86" }}>Name</label>
    <input
        type="text"
        className="form-control"
        id="itemTitle"
        placeholder="Full name of dish"
        style={{
            boxShadow: "none",
            color: "#1d0a15",
            borderColor: '#C13F86', // Sets the border color to match the label
            borderWidth: '1px', // Specifies the border width
            borderStyle: 'solid', // Ensures the border is solid
            outline: 'none' // Removes the default focus outline
        }}
        onChange={(e) => this.setState({ itemTitle: e.target.value })}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(193, 63, 134, 0.25)'} // Adds a pink glow when focused
        onBlur={(e) => e.target.style.boxShadow = 'none'} // Removes the glow when not focused
    />
</div>

            <div className="mb-3">
    <label htmlFor="itemIngredients" className="form-label" style={{ fontWeight: "bold", color: "#C13F86" }}>Description</label>
    <input
        type="text"
        className="form-control"
        id="itemIngredients"
        placeholder="Describe the ingredients"
        style={{
            boxShadow: "none",
            color: "#1d0a15",
            borderColor: '#C13F86', // Sets the border color to pink
            borderWidth: '1px', // Specifies the border width
            borderStyle: 'solid', // Ensures the border is solid
            outline: 'none' // Removes the default focus outline
        }}
        onChange={(e) => this.setState({ itemIngredients: e.target.value })}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(193, 63, 134, 0.25)'} // Adds a pink glow when focused
        onBlur={(e) => e.target.style.boxShadow = 'none'} // Removes the glow when not focused
    />
</div>
<div className="mb-3">
    <label htmlFor="itemPrice" className="form-label" style={{ fontWeight: "bold", color: "#C13F86" }}>Price $</label>
    <input
        type="number"
        className="form-control"
        id="itemPrice"
        placeholder="Enter price"
        style={{
            boxShadow: "none",
            color: "#1d0a15",
            borderColor: '#C13F86', // Sets the border color to pink
            borderWidth: '1px', // Specifies the border width
            borderStyle: 'solid', // Ensures the border is solid
            outline: 'none' // Removes the default focus outline
        }}
        onChange={(e) => this.setState({ itemPrice: e.target.value })}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(193, 63, 134, 0.25)'} // Adds a pink glow when focused
        onBlur={(e) => e.target.style.boxShadow = 'none'} // Removes the glow when not focused
    />
</div>

<div className="mb-4">
    <label htmlFor="itemImage" className="form-label" style={{ fontWeight: "bold", color: "#C13F86" }}>Item Image</label>
    <div className="custom-file" style={{ borderRadius: '0.25rem', overflow: 'hidden' }}>
        <input
            type="file"
            className="form-control"
            id="itemImage"
            style={{
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                borderColor: '#c13f86',
                boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(193, 63, 134, 0.6)',
                color: '#555',
                position: 'absolute',  // Allows the label to fully cover the input visually
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                opacity: 0  // Makes the input invisible but still functional
            }}
            onChange={this.handleItemImage}
        />
        <label className="custom-file-label" htmlFor="itemImage" style={{
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
        }}>
            {this.state.itemImageLabel || "Choose file..."}
        </label>
    </div>
</div>


<fieldset className="mb-4" style={{ border: '1px solid #c13f86', borderRadius: '5px', padding: '20px', backgroundColor: '#fbf2f7', marginTop:'-20px' }}>
    <legend style={{ fontWeight: "bold", color: "#C13F86", marginBottom: '10px', width: 'auto', padding: '0 10px', backgroundColor: '#fbf2f7' }}>Choose Surprise Bag Type</legend>
    <div className="d-flex flex-wrap">
        {["standard", "halal", "vegetarian", "vegan"].map(type => (
            <div key={type} className="form-check form-check-inline" style={{ marginRight: '20px' }}>
                <input
                    className="form-check-input"
                    type="radio"
                    name="chooseItemType"
                    id={type}
                    value={type}
                    style={{
                        cursor: 'pointer',
                        accentColor: '#c13f86' // This styles the color of the radio input
                    }}
                    onChange={(e) => this.setState({ chooseItemType: e.target.value })}
                />
                <label className="form-check-label" htmlFor={type} style={{ color: '#1d0a15' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
            </div>
        ))}
    </div>
</fieldset>

            {showError && (
                <div className="alert alert-danger" role="alert" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>
                    {registerFormError}
                </div>
            )}
            <button
                type="submit"
                className="btn text-uppercase w-100"
                style={{ backgroundColor: "#C13F86", borderColor: "#C13F86", color: "#FFFFFF" }}
            >
                <b>Add your item</b>
            </button>
        </form>
    </div>
</div>

        <Footer />
      </div>
    );
  }
}