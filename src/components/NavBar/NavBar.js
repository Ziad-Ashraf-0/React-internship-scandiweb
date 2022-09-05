import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";
import alogo from "../../assets/a-logo.png";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsCart2 } from "react-icons/bs";
import CartPreview from "../CartPreview/CartPreview";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyDropdown: false,
      categories: this.props.categories,
      currency: "$",
      currencies: this.props.currencies,
      activeCategory: 0,
    };
    this.handleClickOutside.bind(this);
    this.handleGreyOut.bind(this);
  }

  componentDidMount() {
    this.setState({ currency: this.props.selectedCurrency });
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleGreyOut = () => {
    console.log("a");
    this.props.handleGreyOut();
  };

  handleClickOutside = (e) => {
    if (e.target.querySelector(".sm")) {
      this.props.handleChangeCurrency(e.target.querySelector("span").innerHTML);
      this.setState({
        currency: e.target.querySelector("span").innerHTML,
      });
    }
    this.setState({
      currencyDropdown: false,
    });

    // if (!(e.target.nodeName === "svg")) {
    //   this.props.handleGreyOut(false);
    // }
  };

  handleDropdown = () => {
    this.setState({
      currencyDropdown: !this.state.currencyDropdown,
    });
  };

  changeActiveCategory = (key) => {
    this.setState({
      activeCategory: key,
    });
  };

  renderCurrencyDropdown() {
    return (
      <div className="currency">
        <span>{this.state.currency}</span>
        <div className="dropdown">
          <button className="arrow" onClick={this.handleDropdown}>
            {this.state.currencyDropdown ? (
              <RiArrowUpSLine />
            ) : (
              <RiArrowDownSLine />
            )}
          </button>
          {this.state.currencyDropdown && (
            <div className="dropdown-content">
              {this.state.currencies.map((value, index) => {
                return (
                  <button key={index}>
                    <span className="sm">{value.symbol}</span>
                    {` ${value.label}`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderCart() {
    return (
      <div className="cart">
        <div className="cart-container" onClick={this.handleGreyOut}>
          <BsCart2 />
          <div
            className={`dot + ${this.props.itemsCount > 0 ? "show" : "hidden"}`}
          >
            {this.props.itemsCount > 0 ? this.props.itemsCount : ""}
          </div>
        </div>

        <CartPreview
          handleGreyOut={this.handleGreyOut}
          greyout={this.props.greyout}
          selectedCurrency={this.props.selectedCurrency}
          cartItems={this.props.cartItems}
          itemsCount={this.props.itemsCount}
          total={this.props.total}
          handleIncrement={this.props.handleIncrement}
          handleDecrement={this.props.handleDecrement}
        />
      </div>
    );
  }

  renderCategories() {
    return this.state.categories.map((value, index) => {
      return (
        <Link
          to={`/${value.name}`}
          key={index}
          className={index === this.state.activeCategory ? "selected" : ""}
          onClick={() => this.changeActiveCategory(index)}
        >
          {value.name}
        </Link>
      );
    });
  }

  render() {
    return (
      <>
        <header>
          <div className="navigation">{this.renderCategories()}</div>
          <img src={alogo} alt="#" className="a-logo" />
          <div className="action">
            {this.renderCurrencyDropdown()}
            {this.renderCart()}
          </div>
        </header>
      </>
    );
  }
}
