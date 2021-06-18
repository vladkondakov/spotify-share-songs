const redis = require('redis');
const config = require('../config/config.js');

class RedisOperations {
  constructor() {
    this.host = config.REDIS_HOST || 'localhost';
    this.port = config.REDIS_PORT || '6379';
    this.connected = false;
    this.client = null;
  }

  getConnection() {
    if (this.connected) {
      return this.client;
    }

    this.client = redis.createClient({
      host: this.host,
      port: this.port,
    });

    return this.client;
  }
}

module.exports = new RedisOperations();
