const fs = require('fs');
const arpping = require('arpping')({});

class Zeroconf {
  constructor(config = {}) {
    const { ip, arpTableFile } = config;
    this.localIp = ip;
    this.defaultArpTableFile = arpTableFile || './arp-table.json';
  }

  /**
   * Initialize internal ARP table if needed
   * @returns {Promise<void>}
   */
  async initialize() {
    if (!this.arpTable) {
      await this.getArpTable();
    }
  }

  /**
   * Build the ARP table
   * @returns {Promise<unknown>}
   */
  getArpTable() {
    return new Promise((resolve, reject) => {
      arpping.discover(this.localIp, (err, hosts) => {
        if (err) {
          reject(err);
        }
        this.arpTable = hosts;
        resolve(hosts);
      });
    });
  }

  /**
   * Save ARP table to local file
   * @returns {Promise<void>}
   */
  async saveArpTable() {
    await this.initialize();
    const fileName = this.defaultArpTableFile;
    const jsonContent = JSON.stringify(this.arpTable, null, 2);
    await fs.writeFile(fileName, jsonContent, 'utf8', function(err) {
      if (err) {
        return err;
      }
    });
  }

  /**
   * Read ARP table file
   * @param fileName
   * @returns {Promise<any>}
   */
  static async loadArpTable(fileName = './arp-table.json') {
    const jsonContent = await fs.readFileSync(fileName);
    return JSON.parse(jsonContent);
  }

  /**
   * Read devices cache file
   * @param fileName
   * @returns {Promise<any>}
   */
  static async loadCachedDevices(fileName = './devices-cache.json') {
    const jsonContent = await fs.readFileSync(fileName);
    return JSON.parse(jsonContent);
  }
}

module.exports = Zeroconf;
