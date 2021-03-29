class InMemoryCache {
  constructor(max_size) {
    this.max_size = max_size;
    this.size = 0;
    this.db = {};
    this.key_queue = [];
  }

  add(name, country, data) {
    let key = name + '_' + country;
    if (key in this.db) return;
    let data_size = data.length;

    while (data_size + this.size > this.max_size) {
      this.size -= this.db[this.key_queue[0]].length;
      delete this.db[this.key_queue[0]];
      this.key_queue.shift();
    }
    
    this.db[key] = data;
    this.key_queue.push(key);
    this.size += data_size;
  }

  get(name, country) {
    let key = name + '_' + country;
    return this.db[key];
  }

  contains(name, country) {
    let key = name + '_' + country;
    return key in this.db;
  }

  clear() {
    this.db = {};
    this.size = 0;
    this.key_queue = [];
  }

}

module.exports = InMemoryCache;