const fs = require('fs');
const arpping = require('arpping')({});

class arpTableSolver {
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
   * Get IP address from a given MAC
   * @param mac
   * @returns {Promise<{error: string}|NodePath<Node>|*|number|bigint>}
   */
  async getIp(mac) {
    await this.initialize();
    const found = this.arpTable.find(item => item.mac.toLowerCase() === mac);
    if (!found) {
      return { error: 'No ip address found' };
    }
    return found;
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
   * Load local ARP table file into memory
   * @returns {Promise<void>}
   */
  async loadArpTable() {
    const fileName = this.defaultArpTableFile;
    const jsonContent = await fs.readFileSync(fileName);
    this.arpTable = JSON.parse(jsonContent);
  }
}

module.exports = arpTableSolver;
