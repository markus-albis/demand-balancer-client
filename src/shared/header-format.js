export class HeaderFormatValueConverter {

  toView(value) {
    let week = value % 100;
    let year = (value - (value % 100))/100;
    let output = "KW" + week + "/" + year;
    return output;
  }
}
