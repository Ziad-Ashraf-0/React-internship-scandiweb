import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { gql } from "@apollo/client";
import { flowRight as compose } from "lodash";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.js";
import Category from "./routes/Category/Category.js";
import Product from "./routes/Product/Product.js";
import CartPage from "./routes/Cart/CartPage.js";
import "./App.css";

const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsCount: 0,
      selectedCurrency: "$",
      cartItems: [],
      greyout: false,
      total: 0,
    };
    this.handleAddToCart.bind(this);
    this.handleChangeCurrency.bind(this);
  }

  handleChangeCurrency = (currency) => {
    if (currency) {
      this.setState(
        {
          selectedCurrency: currency,
        },
        () => {
          this.calcTotal();
        }
      );
    }
  };

  calcTotal = () => {
    let temp = 0;
    this.state.cartItems.forEach((item) => {
      item.prices.forEach((price) => {
        if (price.currency.symbol === this.state.selectedCurrency) {
          temp = temp + price.amount * item.amount;
        }
      });
    });

    this.setState({
      total: temp,
    });
  };

  handleAddToCart = (product) => {
    console.log(product);
    if (
      this.state.cartItems.some(
        (e) =>
          e.id === product.id &&
          arrayEquals(e.selectedAttributes, product.selectedAttributes)
      )
    ) {
      const temp = this.state.cartItems.map((item) => {
        if (
          item.id === product.id &&
          arrayEquals(item.selectedAttributes, product.selectedAttributes)
        ) {
          return { ...item, amount: item.amount + 1 };
        }
        return item;
      });

      this.setState(
        {
          itemsCount: this.state.itemsCount + 1,
          cartItems: temp,
        },
        () => {
          this.calcTotal();
        }
      );
    } else {
      this.setState(
        {
          itemsCount: this.state.itemsCount + 1,
          cartItems: [...this.state.cartItems, { ...product, amount: 1 }],
        },
        () => {
          this.calcTotal();
        }
      );
    }
  };

  handleGreyOut = (value) => {
    console.log(value);

    this.setState({
      greyout: !this.state.greyout,
    });
  };

  handleIncrement = (product) => {
    const temp = this.state.cartItems.map((item) => {
      if (
        item.id === product.id &&
        arrayEquals(item.selectedAttributes, product.selectedAttributes)
      ) {
        return { ...item, amount: item.amount + 1 };
      }
      return item;
    });

    this.setState(
      {
        itemsCount: this.state.itemsCount + 1,
        cartItems: temp,
      },
      () => {
        this.calcTotal();
      }
    );
  };

  handleDecrement = (product) => {
    if (product.amount !== 1) {
      const temp = this.state.cartItems.map((item) => {
        if (
          item.id === product.id &&
          arrayEquals(item.selectedAttributes, product.selectedAttributes)
        ) {
          return { ...item, amount: item.amount - 1 };
        }
        return item;
      });
      this.setState(
        {
          itemsCount: this.state.itemsCount - 1,
          cartItems: temp,
        },
        () => {
          this.calcTotal();
        }
      );
    } else {
      const temp = this.state.cartItems.filter(
        (item) =>
          !(
            arrayEquals(item.selectedAttributes, product.selectedAttributes) &&
            item.id === product.id
          )
      );
      this.setState(
        {
          itemsCount: this.state.itemsCount - 1,
          cartItems: temp,
        },
        () => {
          this.calcTotal();
        }
      );
    }
  };

  render() {
    const { data } = this.props;
    const all = data?.categories
      ?.filter(({ name }) => name === "all")
      .reduce((acc, item) => {
        acc.push(...item.products);
        return acc;
      }, []);

    return (
      <>
        <div className={this.state.greyout ? "greyout" : ""}></div>
        {data.categories && (
          <>
            <NavBar
              categories={data.categories}
              itemsCount={this.state.itemsCount}
              currencies={this.props.data1.currencies}
              handleChangeCurrency={this.handleChangeCurrency}
              handleGreyOut={this.handleGreyOut}
              greyout={this.state.greyout}
              selectedCurrency={this.state.selectedCurrency}
              cartItems={this.state.cartItems}
              total={this.state.total}
              handleIncrement={this.handleIncrement}
              handleDecrement={this.handleDecrement}
            />
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Category
                    products={all}
                    handleAddToCart={this.handleAddToCart}
                    selectedCurrency={this.state.selectedCurrency}
                  />
                }
              />
              {data.categories.map((category) => {
                return (
                  <Route
                    exact
                    path={`/${category.name}`}
                    key={category.name}
                    element={
                      <Category
                        products={category.products}
                        name={category.name}
                        handleAddToCart={this.handleAddToCart}
                        selectedCurrency={this.state.selectedCurrency}
                      />
                    }
                  />
                );
              })}
              {data.categories.map((category) => {
                return (
                  <Route
                    exact
                    path={`/${category.name}/:productId`}
                    key={category.name}
                    element={
                      <Product
                        handleAddToCart={this.handleAddToCart}
                        selectedCurrency={this.state.selectedCurrency}
                      />
                    }
                  />
                );
              })}

              <Route
                path="/cart"
                element={
                  <CartPage
                    cartItems={this.state.cartItems}
                    selectedCurrency={this.state.selectedCurrency}
                    total={this.state.total}
                    handleIncrement={this.handleIncrement}
                    handleDecrement={this.handleDecrement}
                    itemsCount={this.state.itemsCount}
                  />
                }
              />
              <Route path="/checkout" />
            </Routes>
          </>
        )}
      </>
    );
  }
}

export default compose(
  graphql(
    gql`
      query MyQuery1 {
        categories {
          name
          products {
            id
            name
            inStock
            gallery
            category
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
              }
            }
            prices {
              currency {
                label
                symbol
              }
              amount
            }
            brand
          }
        }
      }
    `,
    { name: "data" }
  ),
  graphql(
    gql`
      query MyQuery2 {
        currencies {
          label
          symbol
        }
      }
    `,
    { name: "data1" }
  )
)(App);
