const EventEmitter = require('events');
const request = require('request-promise');

class RequestManager extends EventEmitter {
  constructor(url, logErrors = true) {
    super();
    this.url = url;
    this.openRequestCount = 0;
    this.errorCount = 0;
    this.successCount = 0;
    this.requestSucceeded = this.requestSucceeded.bind(this);
    this.requestFailed = this.requestFailed.bind(this);
    this.logErrors = logErrors;
    this.completedCount = 0;
    this.initialTimestamp = Date.now();
    this.rps = 0;
  }

  printStatus() {
    console.log(
      `ErrorCount: ${this.errorCount} | successCount: ${this.successCount} | openRequests: ${this.openRequestCount} | RPS: ${this.rps}`
    );
  }

  createNextRequest(body) {
    this.postRequest(body)
      .then((resp) => {
        this.requestSucceeded(body, resp);
      })
      .catch((err) => {
        this.requestFailed(body, err);
      });
    this.openRequestCount++;
  };

  createNextGetRequest(data) {
    request({
      url: data.url,
      json: true
    }).then((resp) => {
      this.requestSucceeded(data, resp);
    }).catch((err) => {
      this.requestFailed(data, err);
    });
    this.openRequestCount++;
  }

  requestCompleted() {
    this.completedCount++;
    this.openRequestCount--;
    this.rps = (this.completedCount * 1000) / (Date.now() - this.initialTimestamp);
    this.emit('completed', this.openRequestCount)
  }

  requestSucceeded(body, resp) {
    this.successCount++;
    this.emit('success', body, resp);
    this.requestCompleted();
  };

  requestFailed(body, err) {
    this.errorCount++;
    if (this.logErrors) {
      console.log(err);
    }
    this.emit('failure', body, err);
    this.requestCompleted();
  };

  postRequest(body) {
    return request({
      url: this.url,
      method: 'POST',
      json: true,
      body: body
    })
  }
}

module.exports = RequestManager;
