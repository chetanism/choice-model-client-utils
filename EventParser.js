const csvParse = require('csv-parse/lib/sync');
const Readlines = require('n-readlines');

class EventParser {
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

  getNextEvent() {
    const nextLine = this.getNextLine();
    if (nextLine === false) {
      return false;
    }
    return this.parseEvent(csvParse(nextLine, {
      auto_parse: true,
      columns: this.headers
    })[0]);
  }

  parseEvent(eventData) {
    throw new Error('Implement in subclass.');
  }
}

module.exports = EventParser;
