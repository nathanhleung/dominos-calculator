'use strict';

Vue.filter('round', function (value) {
  return Math.round(value * 100) / 100;
});

var app = new Vue({
  el: '#app',
  data: {
    order: {
      pizza: 0,
      lava: 0
    },
    retail: {
      slice: 1,
      cake: 2.5
    },
    extraCharges: {
      delivery: 2,
      tip: 3,
      tax: 6
    },
    customers: [],
    newCustomer: {
      name: '',
      slices: 0,
      cakes: 0,
      amountPaid: 0
    },
    editedCustomer: {
      name: '',
      slices: 0,
      cakes: 0,
      amountPaid: 0,
      index: -1,
      editing: false
    },
    itemData: {
      pizza: {
        cost: 5.99,
        pieces: 8,
        pieceName: 'slice'
      },
      lava: {
        cost: 3.99,
        pieces: 2,
        pieceName: 'cake'
      }
    }
  },
  methods: {
    getSubtotal: function getSubtotal() {
      return this.order.pizza * this.getBaseCost('pizza') + this.order.lava * this.getBaseCost('lava');
    },
    getTipPercentage: function getTipPercentage() {
      var percent = this.extraCharges.tip / this.getSubtotal() * 100;
      if (percent === Infinity) {
        return 0;
      }
      return percent;
    },
    getTax: function getTax() {
      return this.getSubtotal() * (this.extraCharges.tax / 100);
    },
    getTotal: function getTotal() {
      return this.getSubtotal() + this.extraCharges.tip + this.getTax() + this.extraCharges.delivery;
    },
    getExtraChargesMarkup: function getExtraChargesMarkup() {
      return this.getTotal() / this.getSubtotal();
    },
    getUnitCostAfterExtra: function getUnitCostAfterExtra(item) {
      var unit = this.getBaseCost(item) / this.itemData[item].pieces * this.getExtraChargesMarkup();
      if (isNaN(unit) || unit === Infinity) {
        return 0;
      }
      return unit;
    },
    getBaseCost: function getBaseCost(item) {
      return this.itemData[item].cost;
    },
    getQuantity: function getQuantity(item) {
      return this.order[item] * this.itemData[item].pieces;
    },
    getQuantityPurchased: function getQuantityPurchased(item) {
      var _this = this;

      return this.customers.reduce(function (prev, curr) {
        // In the customer object, the pieceName is plural
        return prev + curr[_this.itemData[item].pieceName + 's'];
      }, 0);
    },
    getInventory: function getInventory(item) {
      return this.getQuantity(item) - this.getQuantityPurchased(item);
    },
    getProjectedRevenue: function getProjectedRevenue(item) {
      return this.getQuantity(item) * this.retail[this.itemData[item].pieceName];
    },
    getProjectedProfit: function getProjectedProfit(item) {
      var profit = this.getProjectedRevenue(item) - this.getUnitCostAfterExtra(item) * this.getQuantity(item);
      if (isNaN(profit)) {
        return 0;
      }
      return profit;
    },
    getRevenue: function getRevenue(item) {
      return this.getQuantityPurchased(item) * this.retail[this.itemData[item].pieceName];
    },
    getProfit: function getProfit(item) {
      // Weird bug in which pizza shows but not lava cakes if the return value is NaN
      var profit = this.getRevenue(item) - this.getUnitCostAfterExtra(item) * this.getQuantityPurchased(item);
      if (isNaN(profit)) {
        return 0;
      }
      return profit;
    },
    getMargin: function getMargin(item) {
      var margin = this.retail[this.itemData[item].pieceName] / this.getUnitCostAfterExtra(item) * 100 - 100;
      if (margin === Infinity) {
        return 0;
      }
      return margin;
    },
    getCustomerTotal: function getCustomerTotal(customer) {
      return customer.slices * this.retail.slice + customer.cakes * this.retail.cake;
    },
    addCustomer: function addCustomer() {
      this.customers.push(this.newCustomer);
      // Create new object to dissociate this.newCustomer from the created customer object
      this.newCustomer = {
        name: '',
        slices: 0,
        cakes: 0,
        amountPaid: 0
      };
    },
    deleteCustomer: function deleteCustomer(index) {
      this.customers.splice(index, 1);
    },
    editCustomer: function editCustomer(index) {
      this.editedCustomer.index = index;
      this.editedCustomer.editing = true;
      this.editedCustomer.name = this.customers[index].name;
      this.editedCustomer.slices = this.customers[index].slices;
      this.editedCustomer.cakes = this.customers[index].cakes;
      this.editedCustomer.amountPaid = this.customers[index].amountPaid;
    },
    saveEditedCustomer: function saveEditedCustomer() {
      var index = this.editedCustomer.index;
      this.customers[index].name = this.editedCustomer.name;
      this.customers[index].slices = this.editedCustomer.slices;
      this.customers[index].cakes = this.editedCustomer.cakes;
      this.customers[index].amountPaid = this.editedCustomer.amountPaid;
      this.editedCustomer.index = -1;
      this.editedCustomer.editing = false;
    },
    cancelEdits: function cancelEdits() {
      this.editedCustomemr.editing = false;
      this.editedCustomer.index = -1;
    }
  }
});