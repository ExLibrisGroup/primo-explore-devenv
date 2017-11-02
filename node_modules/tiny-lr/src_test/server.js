'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _listen = require('./helpers/listen');

var _listen2 = _interopRequireDefault(_listen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('tiny-lr', function () {
  before((0, _listen2.default)());

  describe('GET /', function () {
    it('respond with nothing, but respond', function (done) {
      (0, _supertest2.default)(this.server).get('/').expect('Content-Type', /json/).expect(/\{"tinylr":"Welcome","version":"[\d].[\d].[\d]+"\}/).expect(200, done);
    });

    it('unknown route respond with proper 404 and error message', function (done) {
      (0, _supertest2.default)(this.server).get('/whatev').expect('Content-Type', /json/).expect('{"error":"not_found","reason":"no such route"}').expect(404, done);
    });
  });

  describe('GET /changed', function () {
    it('with no clients, no files', function (done) {
      (0, _supertest2.default)(this.server).get('/changed').expect('Content-Type', /json/).expect(/"clients":\[\]/).expect(/"files":\[\]/).expect(200, done);
    });

    it('with no clients, some files', function (done) {
      (0, _supertest2.default)(this.server).get('/changed?files=gonna.css,test.css,it.css').expect('Content-Type', /json/).expect('{"clients":[],"files":["gonna.css","test.css","it.css"]}').expect(200, done);
    });
  });

  describe('POST /changed', function () {
    it('with no clients, no files', function (done) {
      (0, _supertest2.default)(this.server).post('/changed').expect('Content-Type', /json/).expect(/"clients":\[\]/).expect(/"files":\[\]/).expect(200, done);
    });

    it('with no clients, some files', function (done) {
      var data = { clients: [], files: ['cat.css', 'sed.css', 'ack.js'] };

      (0, _supertest2.default)(this.server).post('/changed')
      // .type('json')
      .send({ files: data.files }).expect('Content-Type', /json/).expect(JSON.stringify(data)).expect(200, done);
    });
  });

  describe('POST /alert', function () {
    it('with no clients, no message', function (done) {
      var data = { clients: [] };
      (0, _supertest2.default)(this.server).post('/alert').expect('Content-Type', /json/).expect(JSON.stringify(data)).expect(200, done);
    });

    it('with no clients, some message', function (done) {
      var message = 'Hello Client!';
      var data = { clients: [], message: message };
      (0, _supertest2.default)(this.server).post('/alert').send({ message: message }).expect('Content-Type', /json/).expect(JSON.stringify(data)).expect(200, done);
    });
  });

  describe('GET /livereload.js', function () {
    it('respond with livereload script', function (done) {
      (0, _supertest2.default)(this.server).get('/livereload.js').expect(/LiveReload/).expect(200, done);
    });
  });

  describe('GET /kill', function () {
    it('shutdown the server', function (done) {
      var srv = this.server;
      (0, _supertest2.default)(srv).get('/kill').expect(200, function (err) {
        if (err) return done(err);
        _assert2.default.ok(!srv._handle);
        done();
      });
    });
  });
});