/*global describe, it*/

var yaml2properties = require('./');
var File            = require('gulp-util').File;
var PluginError     = require('gulp-util').PluginError;
var es              = require('event-stream');
var assert          = require('assert');
var Readable        = require('stream').Readable;


describe('gulp-yaml2properties', function() {
  'use strict';

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//

  describe('in buffer mode', function() {

    var _createFile = function(contents, filename) {
      if (typeof contents === 'string') {
        contents = new Buffer(contents, 'utf8');
      }
      else if (Array.isArray(contents)) {
        contents = new Buffer(contents.join('\n'), 'utf8');
      }
      return new File({
        cwd: './',
        base: './test/',
        path: './test/' + (filename || 'mock.yml'),
        contents: contents
      });
    };

    var _fileContents = function(file) {
      return file.contents ? file.contents.toString('utf8') : null;
    };


    //-------------------------------------------------------------------------


    it('should convert to .properties', function(done) {
      var stream = yaml2properties();

      stream.once('data', function(file) {
        assert.equal(_fileContents(file), 'root.key = value');
        assert.equal(file.extname, '.properties');
        done();
      });

      stream.write(_createFile(['root:', '  key: value']));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should escape Unicode characters', function(done) {
      var stream = yaml2properties();

      stream.once('data', function(file) {
        assert.equal(_fileContents(file), 'root.key = \\u6b53\\u8fce');
        assert.equal(file.extname, '.properties');
        done();
      });

      stream.write(_createFile(['root:', '  key: "歓迎"']));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if empty file', function(done) {
      var stream = yaml2properties();

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(''));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if not well formatted', function(done) {
      var stream = yaml2properties();

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile([
        '$',
        'missing:',
        '  something?'
      ]));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if loading untrusted document with safe option enabled', function(done) {
      var stream = yaml2properties({safe: true});

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"'));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use safe loading by default', function(done) {
      var stream = yaml2properties({safe: true});

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"'));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use the specified schema ans reject input', function(done) {
      var stream = yaml2properties({schema: 'FAILSAFE_SCHEMA'});

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile('---\nkey: !!null'));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use the specified schema and accept input', function(done) {
      var stream = yaml2properties({schema: 'JSON_SCHEMA', safe: false});

      stream.once('data', function(file) {
        assert.equal(_fileContents(file), '');
        done();
      });

      stream.write(_createFile('---\nkey: !!null'));
      stream.end();
    });
  });


  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//


  describe('in stream mode', function() {

    var _createFile = function(filename, callback) {
      if (arguments.length === 1) {
        callback = arguments[0];
        filename = null;
      }
      var stream = new Readable();
      stream._read = function() {
        callback.apply(this, arguments);
        this.push(null);
      };
      return new File({
        cwd: './',
        base: './test/',
        path: './test/' + (filename || 'mock.yml'),
        contents: stream
      });
    };


    //-------------------------------------------------------------------------


    it('should convert to .properties', function(done) {
      var stream = yaml2properties();

      stream.once('data', function(file) {
        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString('utf8'), 'root.key = value');
          assert.equal(file.extname, '.properties');
          done();
        }));
      });

      stream.write(_createFile(function() {
        this.push('root:\n');
        this.push('  key: "value"\n');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should escape Unicode characters', function(done) {
      var stream = yaml2properties();

      stream.once('data', function(file) {
        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString('utf8'), 'root.key = \\u6b53\\u8fce');
          assert.equal(file.extname, '.properties');
          done();
        }));
      });

      stream.write(_createFile(function() {
          this.push('root:\n');
          this.push('  key: "歓迎"\n');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if empty file', function(done) {
      var stream = yaml2properties();

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(function() { }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if not well formatted', function(done) {
      var stream = yaml2properties();

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(function() {
        this.push('$\n');
        this.push('missing:\n');
        this.push('  something?\n');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should throw if loading untrusted document with safe option enabled', function(done) {
      var stream = yaml2properties({safe: true});

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(function() {
        this.push('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use safe loading by default', function(done) {
      var stream = yaml2properties();

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(function() {
        this.push('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use the specified schema ans reject input', function(done) {
      var stream = yaml2properties({schema: 'FAILSAFE_SCHEMA'});

      stream.once('error', function(err) {
        assert.ok(err instanceof PluginError);
        done();
      });

      stream.write(_createFile(function() {
        this.push('---\nkey: !!null');
      }));
      stream.end();
    });


    //-------------------------------------------------------------------------


    it('should use the specified schema and accept input', function(done) {
      var stream = yaml2properties({schema: 'JSON_SCHEMA', safe: false});

      stream.once('data', function(file) {
        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString('utf8'), '');
          assert.equal(file.extname, '.properties');
          done();
        }));
      });

      stream.write(_createFile(function() {
        this.push('---\nkey: !!null');
      }));
      stream.end();
    });

  });
});
