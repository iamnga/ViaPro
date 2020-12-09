import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as $ from "jquery";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  viaForm: FormGroup;
  editViaForm: FormGroup;
  currentVia: ViaInfo;
  rows = [];
  temp = [];
  error = "";
  minDate = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  total = 0;
  countries = [];
  status = [{ value: -1, text: "Tất cả" }, { value: 0, text: "Sống" }, { value: 1, text: "Đã bán" }, { value: 2, text: "Khóa" }, { value: 3, text: "Back" }];
  limits = [{ value: "", text: "Tất cả" }, { value: "LM25", text: "Limit 25$" }, { value: "LM50", text: "Limit 50$" }, { value: "LM250", text: "Limit 250$" }, { value: "LM350", text: "Limit 350$" }, { value: "NLM", text: "No limit" }];
  viaInfoChangeStatus: ViaInfo;
  statusChange: number;
  columns = [
    { name: 'UID', prop: 'uid' },
    { name: 'Password', prop: 'password' },
    { name: '2FA', prop: 'privateCode' },
    { name: 'Email', prop: 'email' },
    { name: 'Pass Email', prop: 'passEmail' },
    { name: 'Năm tạo', prop: 'createdYear' },
    { name: 'Ngưỡng', prop: 'type' },
    { name: 'Quốc gia', prop: 'country' },
    { name: 'Ghi chú', prop: 'note' },
    { name: 'Giá', prop: 'price' },
    //{ name: 'Trạng thái', prop: 'status' },
  ];
  allVia: ViaInfo[] = [];
  ColumnMode = ColumnMode;

  constructor(private localeService: BsLocaleService, private toastr: ToastrService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.minDate.setDate(this.maxDate.getDate() - 7);
    this.bsRangeValue = [this.minDate, this.maxDate];

  }

  ngOnInit() {
    this.createForm();
    this.getAllVia();
  }

  createForm() {
    this.viaForm = new FormGroup({
      info: new FormControl("", [
      ]),
      country: new FormControl("", [
      ]),
      status: new FormControl(-1, [
      ]),
      type: new FormControl("", [
      ]),
      date: new FormControl()
    });

    this.editViaForm = new FormGroup({
      uid: new FormControl("", [
      ]),
      password: new FormControl("", [
      ]),
      privateCode: new FormControl("", [
      ]),
      email: new FormControl("", [
      ]),
      passEmail: new FormControl("", [
      ]),
      country: new FormControl("", [
      ]),
      createdYear: new FormControl("", [
      ]),
      type: new FormControl("", [
      ]),
      cookie: new FormControl("", [
      ]),
      note: new FormControl("", [
      ]),
      price: new FormControl("", [
      ])
    });
  }

  summary() {
    const sum = this.rows.reduce((a, { price }) => a + price, 0);
    console.log(sum);
    this.total = sum;
    //$("#btnShowAlertSummary").click();

  }

  searchVia() {
    let data = new ViaSearch();
    data.country = this.viaForm.controls["country"].value;
    data.status = this.viaForm.controls["status"].value;
    data.type = this.viaForm.controls["type"].value;
    data.fromDate = this.viaForm.controls["date"].value[0];
    data.toDate = this.viaForm.controls["date"].value[1];
    console.log(data);

    this.http.post<ViaInfo[]>(this.baseUrl + 'api/ViaInfoes/search', data).subscribe(result => {
      this.rows = result;
      console.log(result);
    }, error => console.error(error));
  }

  updateFilter(event) {
    console.log(event);
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.uid.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  editVIA(id: number) {
    this.currentVia = this.allVia.find(x => x.id == id);
    console.log(this.currentVia);
    console.log(id);
    this.editViaForm.controls["uid"].setValue(this.currentVia.uid);
    this.editViaForm.controls["password"].setValue(this.currentVia.password);
    this.editViaForm.controls["privateCode"].setValue(this.currentVia.privateCode);
    this.editViaForm.controls["email"].setValue(this.currentVia.email);
    this.editViaForm.controls["passEmail"].setValue(this.currentVia.passEmail);
    this.editViaForm.controls["country"].setValue(this.currentVia.country);
    this.editViaForm.controls["createdYear"].setValue(this.currentVia.createdYear);
    this.editViaForm.controls["type"].setValue(this.currentVia.type);
    this.editViaForm.controls["note"].setValue(this.currentVia.note);
    this.editViaForm.controls["cookie"].setValue(this.currentVia.cookie);
    this.editViaForm.controls["price"].setValue(this.currentVia.price);
  }

  confirmEdit() {
    let newItem = new ViaInfo();
    newItem.uid = this.editViaForm.controls["uid"].value;
    newItem.password = this.editViaForm.controls["password"].value;
    newItem.privateCode = this.editViaForm.controls["privateCode"].value;
    newItem.email = this.editViaForm.controls["email"].value;
    newItem.passEmail = this.editViaForm.controls["passEmail"].value;
    newItem.country = this.editViaForm.controls["country"].value;
    newItem.createdYear = this.editViaForm.controls["createdYear"].value;
    newItem.type = this.editViaForm.controls["type"].value;
    newItem.note = this.editViaForm.controls["note"].value;
    newItem.cookie = this.editViaForm.controls["cookie"].value;
    newItem.price = this.getPrice(newItem.type, newItem.country);
    newItem.id = this.currentVia.id;
    newItem.createdDate = this.currentVia.createdDate;
    newItem.updatedDate = new Date();
    newItem.saleUser = "ngann";
    newItem.status = this.currentVia.status;

    this.http.put(this.baseUrl + 'api/ViaInfoes/' + this.currentVia.id, newItem).subscribe(result => {
      console.log(result);
      $(".close").click();
      $("#showAlertUpdateSuccess").click();
      this.getAllVia();

    }, error => console.error(error));
  }

  setDataChangeStatus(data: ViaInfo, status: any) {
    this.viaInfoChangeStatus = data;
    this.statusChange = parseInt(status);
    $("#confirmChangeStatus").click();
    console.log(data);
    console.log(status);
  }

  changeStatus() {
    this.viaInfoChangeStatus.status = this.statusChange;
    this.viaInfoChangeStatus.updatedDate = new Date();
    this.viaInfoChangeStatus.saleUser = "ngann";
    console.log(this.viaInfoChangeStatus);
    this.http.put(this.baseUrl + 'api/ViaInfoes/' + this.viaInfoChangeStatus.id, this.viaInfoChangeStatus).subscribe(result => {
      console.log(result);
      $(".close").click();
      $("#showAlertUpdateSuccess").click();
      this.getAllVia();

    }, error => console.error(error));
  }

  getAllVia() {
    this.http.get<ViaInfo[]>(this.baseUrl + 'api/ViaInfoes').subscribe(result => {
      this.allVia = result;
      this.rows = this.allVia;
      this.temp = [...this.allVia];

      var myArray = this.allVia.map(x => x.country);
      let unique = [...new Set(myArray)];

      let arrCountry: Country[] = [];
      unique.map(x => { let newItem = new Country(); newItem.value = x; newItem.text = x; arrCountry.push(newItem); })
      this.countries = [...[{ value: "", text: "Tất cả" }], ...arrCountry];
      console.log(this.countries);
      //this.countries = [...unique];
      console.log(this.allVia);
    }, error => console.error(error));
  }

  getPrice(type: string, country: string) {
    if (type.toUpperCase() == "LM25" || type.toUpperCase() == "LM50") {
      if (country.toUpperCase() == "US")
        return 150000;
      else
        if (country.toUpperCase() == "PL")
          return 60000;
        else
          return 80000;
    }
    else
      if (type.toUpperCase() == "LM250")
        return 250000;
      else
        if (type.toUpperCase() == "LM350")
          return 300000;
        else
          if (type.toUpperCase() == "NLM")
            return 500000;
          else
            return 0;
  }


  addVia() {
    let newItem = new ViaInfo();
    console.log(this.viaForm);
    let info = this.viaForm.controls["info"].value;
    if (info == "") {
      this.toastr.error("Thông tin không được để trống", "Lỗi");
      return;
    }
    let arrInfo = info.split('\n');
    for (let item of arrInfo) {
      let data = item.split('|');
      newItem.uid = data[0];
      newItem.password = data[1];
      newItem.privateCode = data[2].replaceAll(" ", "");
      newItem.email = data[3];
      newItem.passEmail = data[4];
      newItem.createdYear = data[5];
      newItem.type = data[6];
      newItem.country = data[7];
      newItem.note = data[8];
      newItem.cookie = data[9];
      newItem.createdDate = new Date();
      newItem.updatedDate = new Date();
      newItem.status = 0;
      newItem.price = this.getPrice(newItem.type, newItem.country);
      newItem.saleUser = "";
      this.http.post(this.baseUrl + 'api/ViaInfoes', newItem).subscribe(result => {
        if (result) {
          console.log(result);
          $("#showAlertAddSuccess").click();
          this.getAllVia();
          this.viaForm.controls["info"].setValue("");
        }
      }, error => console.error(error));

    }
    console.log(arrInfo);
  }

  getRowClass(row) {
    if (row.status == 1)
      return {
        'bg-success': row.status == 1
      };
    if (row.status == 2 || row.status == 3)
      return {
        'bg-secondary': row.status == 2 || row.status == 3
      };
  }

  copy(row: ViaInfo) {
    console.log(row);
    let text = row.uid + "|" + row.password + "|" + row.privateCode + "|" + row.email + "|" + row.passEmail + "|" + row.createdYear + "|" + row.type + "|" + row.cookie;
    this.copyToClipboard(text);
    this.toastr.success('Đã copy dữ liệu thành công', 'Thông báo');
  }

  copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
}

class ViaInfo {
  id: number;
  uid: string;
  password: string;
  privateCode: string;
  email: string;
  passEmail: string;
  country: string;
  createdYear: string;
  type: string;
  status: number;
  cookie: string;
  note: string;
  price: number;
  saleUser: string;
  createdDate: Date | string;
  updatedDate: Date | string;
}


class ViaSearch {
  country: string;
  type: string;
  status: number;
  fromDate: Date | string;
  toDate: Date | string;
}

class Country {
  value: string;
  text: string;
}
