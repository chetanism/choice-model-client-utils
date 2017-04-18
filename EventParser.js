const CSVReader = require('./CSVReader');

class EventParser {
  constructor(filename, headers = true) {
    this.reader = new CSVReader(filename, headers);
  }

  getNextEvent() {
    const nextObject = this.reader.getNextObject();
    if (nextObject === false) {
      return false;
    }
    return this.parseEvent(nextObject);
  }

  parseEvent(eventData) {
    throw new Error('Implement in subclass.');
  }
}

module.exports = EventParser;
