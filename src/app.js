'use strict';

Vue.filter('round', (value) => {
  return Math.round(value * 100) / 100;
});

const app = new Vue({
  el: '#app',
  data: {
    order: {
      pizza: 0,
      lava: 0,
    },
    retail: {
      slice: 1,
      cake: 2.5,
    },
    extraCharges: {
      delivery: 2,
      tip: 3,
      tax: 6,
    },
    customers: [],
    newCustomer: {
      name: '',
      slices: 0,
      cakes: 0,
      amountPaid: 0,
    },
    editedCustomer: {
      name: '',
      slices: 0,
      cakes: 0,
      amountPaid: 0,
      index: -1,
      editing: false,
    },
    itemData: {
      pizza: {
        cost: 5.99,
        pieces: 8,
        pieceName: 'slice',
      },
      lava: {
        cost: 3.99,
        pieces: 2,
        pieceName: 'cake',
      },
    },
  },
  methods: {
    getSubtotal() {
      return this.order.pizza * this.getBaseCost('pizza') + this.order.lava * this.getBaseCost('lava');
    },
    getTipPercentage() {
      const percent = this.extraCharges.tip / this.getSubtotal() * 100;
      if (percent === Infinity) {
        return 0;
      }
      return percent;
    },
    getTax() {
      return this.getSubtotal() * (this.extraCharges.tax / 100);
    },
    getTotal() {
      return this.getSubtotal() + this.extraCharges.tip + this.getTax() + this.extraCharges.delivery;
    },
    getExtraChargesMarkup() {
      return this.getTotal() / this.getSubtotal();
    },
    getUnitCostAfterExtra(item) {
      const unit = (this.getBaseCost(item) / this.itemData[item].pieces) * this.getExtraChargesMarkup();
      if (isNaN(unit) || unit === Infinity) {
        return 0;
      }
      return unit;
    },
    getBaseCost(item) {
      return this.itemData[item].cost;
    },
    getQuantity(item) {
      return this.order[item] * this.itemData[item].pieces;
    },
    getQuantityPurchased(item) {
      return this.customers.reduce((prev, curr) => {
        // In the customer object, the pieceName is plural
        return prev + curr[this.itemData[item].pieceName + 's'];
      }, 0);
    },
    getInventory(item) {
      return this.getQuantity(item) - this.getQuantityPurchased(item);
    },
    getProjectedRevenue(item) {
      return this.getQuantity(item) * this.retail[this.itemData[item].pieceName];
    },
    getProjectedProfit(item) {
      const profit =
        this.getProjectedRevenue(item) - this.getUnitCostAfterExtra(item) * this.getQuantity(item);
      if (isNaN(profit)) {
        return 0;
      }
      return profit;
    },
    getRevenue(item) {
      return this.getQuantityPurchased(item) * this.retail[this.itemData[item].pieceName];
    },
    getProfit(item) {
      // Weird bug in which pizza shows but not lava cakes if the return value is NaN
      const profit = this.getRevenue(item) - this.getUnitCostAfterExtra(item) * this.getQuantityPurchased(item);
      if (isNaN(profit)) {
        return 0;
      }
      return profit;
    },
    getMargin(item) {
      const margin = (this.retail[this.itemData[item].pieceName] / this.getUnitCostAfterExtra(item) * 100) - 100;
      if (margin === Infinity) {
        return 0;
      }
      return margin;
    },
    getCustomerTotal(customer) {
      return customer.slices * this.retail.slice + customer.cakes * this.retail.cake;
    },
    addCustomer() {
      this.customers.push(this.newCustomer);
      // Create new object to dissociate this.newCustomer from the created customer object
      this.newCustomer = {
        name: '',
        slices: 0,
        cakes: 0,
        amountPaid: 0,
      }
    },
    deleteCustomer(index) {
      this.customers.splice(index, 1);
    },
    editCustomer(index) {
      this.editedCustomer.index = index;
      this.editedCustomer.editing = true;
      this.editedCustomer.name = this.customers[index].name;
      this.editedCustomer.slices = this.customers[index].slices;
      this.editedCustomer.cakes = this.customers[index].cakes;
      this.editedCustomer.amountPaid = this.customers[index].amountPaid;
    },
    saveEditedCustomer() {
      const index = this.editedCustomer.index;
      this.customers[index].name = this.editedCustomer.name;
      this.customers[index].slices = this.editedCustomer.slices;
      this.customers[index].cakes = this.editedCustomer.cakes;
      this.customers[index].amountPaid = this.editedCustomer.amountPaid;
      this.editedCustomer.index = -1;
      this.editedCustomer.editing = false;
    },
    cancelEdits() {
      this.editedCustomemr.editing = false;
      this.editedCustomer.index = -1;
    },
  },
});
