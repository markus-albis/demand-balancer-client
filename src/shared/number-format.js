
import numeral from 'numeral';

export class NumberFormatValueConverter {

  toView(value, format) {
    if (value != "W") {
      return numeral(value).format(format);
    }
    else {
      return value;
    }
  }

  fromView(value) {
    return value;
  }

}
