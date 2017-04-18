const csvParse = require('csv-parse/lib/sync');
const Readlines = require('n-readlines');

class CSVReader {
  constructor(filename, headers = true) {
    this.reader = new Readlines(filename);
    if (headers === true) {
      const headerLine = this.getNextLine();
      this.headers = headerLine.split(',');
    } else {
      this.headers = headers;
    }
  }

  getNextLine() {
    const nextLine = this.reader.next();
    if (nextLine) {
      return nextLine.toString('ascii');
    }
    return false;
  }

  getNextObject() {
    const nextLine = this.getNextLine();
    if (nextLine === false) {
      return false;
    }
    return csvParse(nextLine, {
      auto_parse: true,
      columns: this.headers
    })[0];
  }
}

module.exports = CSVReader;
