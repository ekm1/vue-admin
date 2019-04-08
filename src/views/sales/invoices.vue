<template>
  <div class="app-container">
    <div class="card-holder">
      <el-card>
        <div slot="header" class="clearfix">
          <el-button style="float: right; padding: 3px 0" @click="fetchData" type="text">Download</el-button>
        </div>
        <div id="printable">
          <header>
            <h1>Invoice</h1>
            <address>
              <p>{{orderDetails.buyerDetails.name}}</p>
              <p>
                {{orderDetails.buyerDetails.address}} - {{orderDetails.buyerDetails.address2}}
                <br>
                {{orderDetails.buyerDetails.city}}, {{orderDetails.buyerDetails.country}}, {{orderDetails.buyerDetails.zip_code}}
              </p>
              <p>(800) 555-1234</p>
            </address>
            <span>
              <img alt src="http://www.jonathantneal.com/examples/invoice/logo.png">

              <input type="file" accept="image/*">
            </span>
          </header>
          <article>
            <h1>Recipient</h1>
            <address>
              <p>
                Some Company
                <br>c/o Some Guy
              </p>
            </address>
            <table class="meta">
              <tr>
                <th>
                  <span>Invoice #</span>
                </th>
                <td>
                  <span>{{orderDetails._id}}</span>
                </td>
              </tr>
              <tr>
                <th>
                  <span>Date</span>
                </th>
                <td>
                  <span>January 1, 2012</span>
                </td>
              </tr>
              <tr>
                <th>
                  <span>Amount Due</span>
                </th>
                <td>
                  <span>{{orderDetails.totalPayment}}</span>
                  <span id="prefix">{{orderDetails.currency}}</span>
                </td>
              </tr>
            </table>
            <table class="inventory">
              <thead>
                <tr>
                  <th>
                    <span>Item</span>
                  </th>
                  <th>
                    <span>Description</span>
                  </th>
                  <th>
                    <span>Rate</span>
                  </th>
                  <th>
                    <span>Quantity</span>
                  </th>
                  <th>
                    <span>Price</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in orderDetails.orderdItems">
                  <tr>
                    <td>
                      <span>{{item.itemName}}</span>
                    </td>
                    <td>
                      <span>Experience Review</span>
                    </td>
                    <td>
                      <span>{{item.itemPrice}}</span>
                      <span data-prefix>{{orderDetails.currency}}</span>
                    </td>
                    <td>
                      <span>{{item.itemQuantity}}</span>
                    </td>
                    <td>
                      <span>{{item.itemPrice * item.itemQuantity}}</span>
                      <span data-prefix>{{orderDetails.currency}}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <table class="balance">
              <tr>
                <th>
                  <span>Total</span>
                </th>
                <td>
                  <span>600.00</span>
                  <span data-prefix>{{orderDetails.currency}}</span>
                </td>
              </tr>
              <tr>
                <th>
                  <span>Amount Paid</span>
                </th>
                <td>
                  <span>0.00</span>
                  <span data-prefix>{{orderDetails.currency}}</span>
                </td>
              </tr>
            </table>
          </article>
          <aside>
            <h1>
              <span>Additional Notes</span>
            </h1>
            <div>
              <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
            </div>
          </aside>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import store from "../../store";

import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";

export default {
  name: 'Personal Invoice',
  directives: { waves },
  data() {
    return {
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      orderDetails: null,

      downloadLoading: false
    };
  },
  created() {
    this.orderDetails = store.state.products.orderDetails;
    this.name = 'test'
  },
  methods: {

    fetchData() {
      var style = `* {
  border: 0;
  box-sizing: content-box;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

/* content editable */

*[contenteditable] {
  border-radius: 0.25em;
  min-width: 1em;
  outline: 0;
}

*[contenteditable] {
  cursor: pointer;
}

*[contenteditable]:hover,
*[contenteditable]:focus,
td:hover *[contenteditable],
td:focus *[contenteditable],
img.hover {
  background: #def;
  box-shadow: 0 0 1em 0.5em #def;
}

span[contenteditable] {
  display: inline-block;
}

/* heading */

h1 {
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
}

/* table */

table {
  font-size: 75%;
  table-layout: fixed;
  width: 100%;
}
table {
  border-collapse: separate;
  border-spacing: 2px;
}
th,
td {
  border-width: 1px;
  padding: 0.5em;
  position: relative;
  text-align: left;
}
th,
td {
  border-radius: 0.25em;
  border-style: solid;
}
th {
  background: #42b983;
  border-color: #42b983;
  color: #fff;
}
td {
  border-color: #ddd;
}

/* page */

html {
  overflow: auto;
  padding: 0.5in;
}
html {
  background: #999;
  cursor: default;
}

body {
  box-sizing: border-box;
  height: 11in;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5in;
  width: 8.5in;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
}
body {
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
}

/* header */

header {
  margin: 0 0 3em;
}
header:after {
  clear: both;
  content: "";
  display: table;
}

header h1 {
  background: #42b983;
  border-radius: 0.25em;
  color: #fff;
  margin: 0 0 1em;
  padding: 0.5em 0;
}
header address {
  float: left;
  font-size: 75%;
  font-style: normal;
  line-height: 1.25;
  margin: 0 1em 1em 0;
}
header address p {
  margin: 0 0 0.25em;
}
header span,
header img {
  display: block;
  float: right;
}
header span {
  margin: 0 0 1em 1em;
  max-height: 25%;
  max-width: 60%;
  position: relative;
}
header img {
  max-height: 100%;
  max-width: 100%;
}
header input {
  cursor: pointer;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

/* article */

article,
article address,
table.meta,
table.inventory {
  margin: 0 0 3em;
}
article:after {
  clear: both;
  content: "";
  display: table;
}
article h1 {
  clip: rect(0 0 0 0);
  position: absolute;
}

article address {
  float: left;
  font-size: 125%;
  font-weight: bold;
}

/* table meta & balance */

table.meta,
table.balance {
  float: right;
  width: 36%;
}
table.meta:after,
table.balance:after {
  clear: both;
  content: "";
  display: table;
}

/* table meta */

table.meta th {
  width: 40%;
}
table.meta td {
  width: 60%;
}

/* table items */

table.inventory {
  clear: both;
  width: 100%;
}
table.inventory th {
  font-weight: bold;
  text-align: center;
}

table.inventory td:nth-child(1) {
  width: 26%;
}
table.inventory td:nth-child(2) {
  width: 38%;
}
table.inventory td:nth-child(3) {
  text-align: right;
  width: 12%;
}
table.inventory td:nth-child(4) {
  text-align: right;
  width: 12%;
}
table.inventory td:nth-child(5) {
  text-align: right;
  width: 12%;
}

/* table balance */

table.balance th,
table.balance td {
  width: 50%;
}
table.balance td {
  text-align: right;
}

/* aside */

aside h1 {
  border: none;
  border-width: 0 0 1px;
  margin: 0 0 1em;
}
aside h1 {
  border-color: #999;
  border-bottom-style: solid;
}

/* javascript */

tr:hover .cut {
  opacity: 1;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
  }
  html {
    background: none;
    padding: 0;
  }
  body {
    box-shadow: none;
    margin: 0;
  }
  span:empty {
    display: none;
  }
  .add,
  .cut {
    display: none;
  }
}

@page {
  margin: 1rem;
}
.card-holder {
  margin: 2%;
}
.download-button {
  padding: 1%;
  margin-bottom: 1%;
  margin: 0 auto;
}`
      setTimeout(() => {
        console.log(style)
        var DocumentContainer = document.getElementById('printable');
        var WindowObject = window.open('', "PrintWindow", "width=1200,height=1200,top=200,left=200,toolbars=no,scrollbars=no,status=no,resizable=no");

        WindowObject.document.writeln('<style>' + style + '</style>')
        WindowObject.document.writeln(DocumentContainer.innerHTML);
        WindowObject.document.close();
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
      }, 2000);
      this.fullscreenLoading = false;

    }

  }
};
</script>
   <style   scoped>
/* reset */

* {
  border: 0;
  box-sizing: content-box;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

/* content editable */

*[contenteditable] {
  border-radius: 0.25em;
  min-width: 1em;
  outline: 0;
}

*[contenteditable] {
  cursor: pointer;
}

*[contenteditable]:hover,
*[contenteditable]:focus,
td:hover *[contenteditable],
td:focus *[contenteditable],
img.hover {
  background: #def;
  box-shadow: 0 0 1em 0.5em #def;
}

span[contenteditable] {
  display: inline-block;
}

/* heading */

h1 {
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
}

/* table */

table {
  font-size: 75%;
  table-layout: fixed;
  width: 100%;
}
table {
  border-collapse: separate;
  border-spacing: 2px;
}
th,
td {
  border-width: 1px;
  padding: 0.5em;
  position: relative;
  text-align: left;
}
th,
td {
  border-radius: 0.25em;
  border-style: solid;
}
th {
  background: #42b983;
  border-color: #42b983;
  color: #fff;
}
td {
  border-color: #ddd;
}

/* page */

html {
  overflow: auto;
  padding: 0.5in;
}
html {
  background: #999;
  cursor: default;
}

body {
  box-sizing: border-box;
  height: 11in;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5in;
  width: 8.5in;
}
body {
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
}

/* header */

header {
  margin: 0 0 3em;
}
header:after {
  clear: both;
  content: "";
  display: table;
}

header h1 {
  background: #42b983;
  border-radius: 0.25em;
  color: #fff;
  margin: 0 0 1em;
  padding: 0.5em 0;
}
header address {
  float: left;
  font-size: 75%;
  font-style: normal;
  line-height: 1.25;
  margin: 0 1em 1em 0;
}
header address p {
  margin: 0 0 0.25em;
}
header span,
header img {
  display: block;
  float: right;
}
header span {
  margin: 0 0 1em 1em;
  max-height: 25%;
  max-width: 60%;
  position: relative;
}
header img {
  max-height: 100%;
  max-width: 100%;
}
header input {
  cursor: pointer;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

/* article */

article,
article address,
table.meta,
table.inventory {
  margin: 0 0 3em;
}
article:after {
  clear: both;
  content: "";
  display: table;
}
article h1 {
  clip: rect(0 0 0 0);
  position: absolute;
}

article address {
  float: left;
  font-size: 125%;
  font-weight: bold;
}

/* table meta & balance */

table.meta,
table.balance {
  float: right;
  width: 36%;
}
table.meta:after,
table.balance:after {
  clear: both;
  content: "";
  display: table;
}

/* table meta */

table.meta th {
  width: 40%;
}
table.meta td {
  width: 60%;
}

/* table items */

table.inventory {
  clear: both;
  width: 100%;
}
table.inventory th {
  font-weight: bold;
  text-align: center;
}

table.inventory td:nth-child(1) {
  width: 26%;
}
table.inventory td:nth-child(2) {
  width: 38%;
}
table.inventory td:nth-child(3) {
  text-align: right;
  width: 12%;
}
table.inventory td:nth-child(4) {
  text-align: right;
  width: 12%;
}
table.inventory td:nth-child(5) {
  text-align: right;
  width: 12%;
}

/* table balance */

table.balance th,
table.balance td {
  width: 50%;
}
table.balance td {
  text-align: right;
}

/* aside */

aside h1 {
  border: none;
  border-width: 0 0 1px;
  margin: 0 0 1em;
}
aside h1 {
  border-color: #999;
  border-bottom-style: solid;
}

/* javascript */

tr:hover .cut {
  opacity: 1;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
  }
  html {
    background: none;
    padding: 0;
  }
  body {
    box-shadow: none;
    margin: 0;
  }
  span:empty {
    display: none;
  }
  .add,
  .cut {
    display: none;
  }
}

@page {
  margin: 1rem;
}
.card-holder {
  margin: 2%;
}
.download-button {
  padding: 1%;
  margin-bottom: 1%;
  margin: 0 auto;
}
</style>