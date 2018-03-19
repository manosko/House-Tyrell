import React from 'react';
import SaleScreen from './saleScreen.jsx';
import axios from 'axios';
import Login from './login.jsx';
// import ManagerHome from './managerHome.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
      menuCategories: [],
      transactionItems: [],
      tax: 0,
      total: 0,
    };
    this.itemClick = this.itemClick.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.transactionRemove = this.transactionRemove.bind(this);
  }

  componentDidMount() {
    this.getMenuItems();
    this.getCategories();
  }

  getMenuItems() {
    axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data,
        });
      });
  }

  getCategories() {
    axios.get('/fetch/categories')
      .then((results) => {
        this.setState({
          menuCategories: results.data,
        });
      });
  }

  itemClick(item) {
    const temp = this.state.transactionItems.slice();
    temp.push(item);
    let tempTotal = 0;
    for (let i = 0; i < temp.length; i += 1) {
      tempTotal = tempTotal + parseFloat(temp[i].item_price)
    }
    let tempTax = (tempTotal * 0.0875).toFixed(2)

    this.setState({
      transactionItems: temp,
      total: tempTotal,
      tax: parseFloat(tempTax),
    });

  }

  transactionRemove(index) {
    const remove = this.state.transactionItems.slice();
    let tempTotal = this.state.total - remove[index].item_price;
    let tempTax = (tempTotal * 0.0875).toFixed(2)
    remove.splice(index, 1);
    this.setState({
      transactionItems: remove,
      total: tempTotal,
      tax: parseFloat(tempTax),
    })
  }

  render() {
    return (
      <div>
        <SaleScreen
          menuItems={this.state.menuItems}
          itemClick={this.itemClick}
          menuCategories={this.state.menuCategories}
          transactionItems={this.state.transactionItems}
          total={this.state.total}
          tax={this.state.tax}
          transactionRemove={this.transactionRemove}
        />
      </div>
    );
  }
}
