<template>
  <div class="app-container">
    <el-button type="primary" @click="fetchData">Click to download PDF</el-button>

    <el-card class="card-holder" id="printable">
      <header class="clearfix">
        <div class="container">
          <figure>
            <img
              class="logo"
              src="data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDdweCIgdmlld0JveD0iMCAwIDQ4IDQ3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy40LjEgKDE1NjgxKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5ob21lNDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJJTlZPSUNFLTMiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zOC4wMDAwMDAsIC00MS4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9IlpBR0xBVkxKRSIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCAyNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJob21lNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wMDAwMDAsIDE2LjAwMDAwMCkiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00Ni40MzQ3MTE0LDIxLjI5MTAxNzMgTDM5LjI3NzM2MTQsMTMuNjY2ODQ1MyBMMzkuMjc3MzYxNCw0Ljg1OTI0NjYgQzM5LjI3NzM2MTQsMy4yNjcwODUyMSAzOC4wNjYxNTc5LDEuOTc2Mzk3NDIgMzYuNTY4NTk4NCwxLjk3NjM5NzQyIEMzNS4wNzQ4NTIyLDEuOTc2Mzk3NDIgMzMuODYzNjQ4NywzLjI2NzA4NTIxIDMzLjg2MzY0ODcsNC44NTkyNDY2IEwzMy44NjM2NDg3LDcuODk5NzUwNjEgTDI4LjUzNDE4NjQsMi4yMjI3ODA2OCBDMjUuODk5MDY4LC0wLjU4MjEyOTY0NCAyMS4zMTc3MywtMC41NzcxNzkxMzEgMTguNjg5MDQ2NiwyLjIyNzczMTE5IEwwLjc5MjIxNTc1OSwyMS4yOTEwMTczIEMtMC4yNjM5NTI3NTQsMjIuNDE4NTkyIC0wLjI2Mzk1Mjc1NCwyNC4yNDMzMDA2IDAuNzkyMjE1NzU5LDI1LjM2ODg0NDMgQzEuODQ5NDU2NzcsMjYuNDk2NDE5IDMuNTY1Njg1OTEsMjYuNDk2NDE5IDQuNjIxODU0NDIsMjUuMzY4ODQ0MyBMMjIuNTE2Nzc4Niw2LjMwNTU1ODI0IEMyMy4xMDAwOTYzLDUuNjg3NzU5NTEgMjQuMTI3NDI2Nyw1LjY4Nzc1OTUxIDI0LjcwNzQwNzcsNi4zMDM2NTQyIEw0Mi42MDUwNzI3LDI1LjM2ODg0NDMgQzQzLjEzNjE5NTcsMjUuOTMyNTY4MiA0My44Mjc5NTQ1LDI2LjIxMzIyNDMgNDQuNTE5NzEzMywyNi4yMTMyMjQzIEM0NS4yMTI3ODI5LDI2LjIxMzIyNDMgNDUuOTA1OTcxNywyNS45MzI1NjgyIDQ2LjQzNTE4ODEsMjUuMzY4ODQ0MyBDNDcuNDkxODMzMiwyNC4yNDMzMDA2IDQ3LjQ5MTgzMzIsMjIuNDE4NTkyIDQ2LjQzNDcxMTQsMjEuMjkxMDE3MyBMNDYuNDM0NzExNCwyMS4yOTEwMTczIFoiIGlkPSJGaWxsLTEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjQuNTUzODAyNywxMS43NzgyODc3IEMyNC4wMzM4ODEzLDExLjIyNDg0NTcgMjMuMTkyMjExNywxMS4yMjQ4NDU3IDIyLjY3MzcyMDMsMTEuNzc4Mjg3NyBMNi45MzE2NDk1NiwyOC41NDE3NDI4IEM2LjY4MzA2OTIyLDI4LjgwNjAyNDEgNi41NDI0NTMzMSwyOS4xNjc1Mzg2IDYuNTQyNDUzMzEsMjkuNTQ0Mjg1MyBMNi41NDI0NTMzMSw0MS43NzE0MTk3IEM2LjU0MjQ1MzMxLDQ0LjY0MDMwNTkgOC43MjYxNzA3OCw0Ni45NjYyODU3IDExLjQxOTQ0MjIsNDYuOTY2Mjg1NyBMMTkuMjEzMTM4OCw0Ni45NjYyODU3IEwxOS4yMTMxMzg4LDM0LjEwOTAzOTkgTDI4LjAxMjM1ODQsMzQuMTA5MDM5OSBMMjguMDEyMzU4NCw0Ni45NjYyODU3IEwzNS44MDY2NTA4LDQ2Ljk2NjI4NTcgQzM4LjQ5OTkyMjIsNDYuOTY2Mjg1NyA0MC42ODM1MjA1LDQ0LjY0MDMwNTkgNDAuNjgzNTIwNSw0MS43NzE0MTk3IEw0MC42ODM1MjA1LDI5LjU0NDI4NTMgQzQwLjY4MzUyMDUsMjkuMTY3NTM4NiA0MC41NDM4NTc5LDI4LjgwNjAyNDEgNDAuMjk0NDQzNCwyOC41NDE3NDI4IEwyNC41NTM4MDI3LDExLjc3ODI4NzcgWiIgaWQ9IkZpbGwtMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
              alt
            >
          </figure>
          <div class="company-info">
            <h2 class="title">Lorem</h2>
            <div class="address">
              <p>
                455 lorem lorem,
                <br>AZ 85004, US
              </p>
            </div>
            <div class="phone">
              <a href="tel:602-519-0450">(xxx) xxx-xxx</a>
            </div>
            <div class="email">
              <span class="icon">
                <img
                  src="data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjZweCIgaGVpZ2h0PSI0cHgiIHZpZXdCb3g9IjAgMCA2IDQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjQuMSAoMTU2ODEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPmVtYWlsMTk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4KICAgICAgICA8ZyBpZD0iSU5WT0lDRS0zIiBza2V0Y2g6dHlwZT0iTVNBcnRib2FyZEdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDI1LjAwMDAwMCwgLTkzLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8ZyBpZD0iTUFJTCIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDIzLjAwMDAwMCwgOTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMiw3IEw4LDcgTDgsMyBMMiwzIEwyLDcgWiBNNC45OTk4MTU2Miw1LjQ3MDEzMjgyIEwyLjUzOTEzNTI0LDMuMjk2NjA4NzkgTDcuNDYwODY0NzYsMy4yOTY2MDg3OSBMNC45OTk4MTU2Miw1LjQ3MDEzMjgyIFogTTQuMDE5NTQ0NTcsNC45OTkzMDQ2MSBMMi4yOTQ5MjAyNSw2LjUyMjU4ODcyIEwyLjI5NDkyMDI1LDMuNDc1OTI3NzcgTDQuMDE5NTQ0NTcsNC45OTkzMDQ2MSBaIE00LjI0MzIwMDg5LDUuMTk2NjExMTEgTDQuOTk5ODE1NjIsNS44NjQ4Mzg1NSBMNS43NTY0MzAzNSw1LjE5NjYxMTExIEw3LjQ2MjMzOTgyLDYuNzAzMjk4NDkgTDIuNTM3NjYwMTgsNi43MDMyOTg0OSBMNC4yNDMyMDA4OSw1LjE5NjYxMTExIFogTTUuOTgwMDg2NjYsNC45OTkzMDQ2MSBMNy43MDQ3MTA5OCwzLjQ3NTkyNzc3IEw3LjcwNDcxMDk4LDYuNTIyNTg4NzIgTDUuOTgwMDg2NjYsNC45OTkzMDQ2MSBaIiBpZD0iZW1haWwxOSIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                  alt
                >
              </span>
              <a href="mailto:xxxx@xxxxx.com">xxxx@xxxx.com</a>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div class="container">
          <div class="details clearfix">
            <div class="client left">
              <p class="name">{{orderDetails.buyerDetails.name}}</p>
              <p>{{orderDetails.buyerDetails.address}} - {{orderDetails.buyerDetails.address2}}</p>
              <p>{{orderDetails.buyerDetails.city}}, {{orderDetails.buyerDetails.zip_code}}, {{orderDetails.buyerDetails.country}}</p>
              <a href="mailto:john@example.com">john@example.com</a>
            </div>
            <div class="data right">
              <div class="title">Invoice {{orderDetails._id}}</div>
              <div class="date">
                Date of Invoice: 01/06/2014
                <br>Due Date: 30/06/2014
              </div>
            </div>
          </div>

          <table border="0" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="qty">Quantity</th>
                <th class="desc">Description</th>
                <th class="unit">Unit price</th>
                <th class="total">Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in orderDetails.orderdItems">
                <tr>
                  <td class="qty">{{item.itemQuantity}}</td>
                  <td class="desc">
                    <h3>{{item.itemName}}</h3>Creating a recognizable design solution based on the company's existing visual identity
                  </td>
                  <td class="unit">{{item.itemPrice}} {{orderDetails.currency}}</td>
                  <td class="total">{{item.itemPrice * item.itemQuantity}} {{orderDetails.currency}}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="no-break">
            <table class="grand-total">
              <tbody>
                <tr class="total">
                  <td class="qty"></td>
                  <td class="desc"></td>
                  <td class="unit">SUBTOTAL:</td>
                  <td class="total">{{orderDetails.totalPayment}} {{orderDetails.currency}}</td>
                </tr>
                <tr class="total">
                  <td class="qty"></td>
                  <td class="desc"></td>
                  <td class="unit">TAX 25%:</td>
                  <td class="total">{{orderDetails.totalPayment}} {{orderDetails.currency}}</td>
                </tr>
                <tr class="total">
                  <td class="grand-total" colspan="4">
                    <div>
                      <span>GRAND TOTAL:</span>
                      {{orderDetails.totalPayment}} {{orderDetails.currency}}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer>
        <div class="container">
          <div class="thanks">Thank you!</div>
          <div class="notice">
            <div>NOTICE:</div>
            <div>A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
          </div>
          <div
            class="end"
          >Invoice was created on a computer and is valid without the signature and seal.</div>
        </div>
      </footer>
    </el-card>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import store from "../../store";

import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "Invoices",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
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
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    fetchData() {
      setTimeout(() => {
        this.fullscreenLoading = false;

        var headstr = "<el-card>";
        var footstr = "</el-card>";
        var newstr = document.getElementById("printable").innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr + newstr + footstr;
        window.print();
        document.body.innerHTML = oldstr;
        return false;
      }, 3000);
    }
  }
};
</script>
   <style <style  scoped>
* {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  font-size: 100%;
  vertical-align: baseline;
  line-height: 1.2;
}

ol,
ul {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

caption,
th,
td {
  text-align: left;
  font-weight: normal;
  vertical-align: middle;
}

q,
blockquote {
  quotes: none;
}
q:before,
q:after,
blockquote:before,
blockquote:after {
  content: "";
  content: none;
}

a img {
  border: none;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
  display: block;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0;
  padding: 0;
  color: #555555;
}
body a {
  text-decoration: none;
  color: inherit;
}
body a:hover {
  color: inherit;
  opacity: 0.7;
}
body .container {
  min-width: 460px;
  margin: 0 auto;
  padding: 0 20px;
}
body .clearfix:after {
  content: "";
  display: table;
  clear: both;
}
body .left {
  float: left;
}
body .right {
  float: right;
}
body .helper {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
body .no-break {
  page-break-inside: avoid;
}

header {
  margin-top: 15px;
  margin-bottom: 45px;
}
header figure {
  float: left;
  margin-right: 10px;
  width: 65px;
  height: 70px;
  background-color: #42b983;
  text-align: center;
}
header figure img {
  margin-top: 10px;
}
header .company-info {
  float: right;
  color: #42b983;
  line-height: 14px;
}
header .company-info .address,
header .company-info .phone,
header .company-info .email {
  position: relative;
}
header .company-info .address img,
header .company-info .phone img {
  margin-top: 2px;
}
header .company-info .email img {
  margin-top: 3px;
}
header .company-info .title {
  color: #42b983;
  font-weight: 400;
  font-size: 1.33333333333333em;
}
header .company-info .icon {
  position: absolute;
  left: -15px;
  top: 1px;
  width: 10px;
  height: 10px;
  background-color: #42b983;
  text-align: center;
  line-height: 0;
}

section .details {
  min-width: 440px;
  margin-bottom: 40px;
  padding: 5px 10px;
  background-color: #cc5a6a;
  color: #ffffff;
  line-height: 20px;
}
section .details .client {
  width: 50%;
}
section .details .client .name {
  font-size: 1.16666666666667em;
  font-weight: 600;
}
section .details .data {
  width: 50%;
  font-weight: 600;
  text-align: right;
}
section .details .title {
  margin-bottom: 5px;
  font-size: 1.33333333333333em;
  text-transform: uppercase;
}
section table {
  width: 100%;
  margin-bottom: 20px;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}
section table .qty,
section table .unit,
section table .total {
  width: 15%;
}
section table .desc {
  width: 55%;
}
section table thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
section table thead th {
  padding: 7px 10px;
  background: #42b983;
  border-right: 5px solid #ffffff;
  color: white;
  text-align: center;
  font-weight: 400;
  text-transform: uppercase;
}
section table thead th:last-child {
  border-right: none;
}
section table tbody tr:first-child td {
  border-top: 10px solid #ffffff;
}
section table tbody td {
  padding: 10px 10px;
  text-align: center;
  border-right: 3px solid #42b983;
}
section table tbody td:last-child {
  border-right: none;
}
section table tbody td.desc {
  text-align: left;
}
section table tbody td.total {
  color: #42b983;
  font-weight: 600;
  text-align: right;
}
section table tbody h3 {
  margin-bottom: 5px;
  color: #42b983;
  font-weight: 600;
}
section table.grand-total {
  margin-bottom: 50px;
}
section table.grand-total tbody tr td {
  padding: 0px 10px 12px;
  border: none;
  background-color: #b2ddd4;
  color: #555555;
  font-weight: 300;
  text-align: right;
}
section table.grand-total tbody tr:first-child td {
  padding-top: 12px;
}
section table.grand-total tbody tr:last-child td {
  background-color: transparent;
}
section table.grand-total tbody .grand-total {
  padding: 0;
}
section table.grand-total tbody .grand-total div {
  float: right;
  padding: 11px 10px;
  background-color: #42b983;
  color: #ffffff;
  font-weight: 600;
}
section table.grand-total tbody .grand-total div span {
  display: inline-block;
  margin-right: 20px;
  width: 80px;
}

footer {
  margin-bottom: 15px;
  padding: 0 5px;
}
footer .thanks {
  margin-bottom: 40px;
  color: #42b983;
  font-size: 1.16666666666667em;
  font-weight: 600;
}
footer .notice {
  margin-bottom: 15px;
}
footer .end {
  padding-top: 5px;
  border-top: 2px solid #42b983;
  text-align: center;
}
.card-holder {
  margin: 2%;
}
</style>