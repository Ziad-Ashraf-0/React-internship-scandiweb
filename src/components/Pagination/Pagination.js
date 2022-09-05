import React, { Component } from "react";

import styles from "./Pagination.module.css";

export default class Pagination extends Component {
  handleClick = (e) => {
    this.props.handlePagination(e.target.innerHTML);
    this.setState({ current: e.target.innerHTML });
    console.log(e.target.innerHTML);
  };
  render() {
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.props.totalItems / this.props.ItemsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    return (
      <nav>
        <ul className={styles.pagination}>
          {pageNumbers.map((number) => (
            <li key={number} className={styles.pageItem}>
              <button
                className={
                  parseInt(this.props.currentPage) === number
                    ? styles.active
                    : styles.pageLink
                }
                onClick={this.handleClick}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
