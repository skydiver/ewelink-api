const fs = require('fs');
const arpping = require('arpping')({});

class arpTableSolver {
  constructor() {
    this.defaultArpTableFile = './arp-table.json';
  }

  async init() {
    const arp = await arpTableSolver.getArpTable();
    this.arpTable = arp;
  }

  static getArpTable() {
    return new Promise((resolve, reject) => {
      arpping.discover(null, (err, hosts) => {
        if (err) {
          reject(err);
        }
        resolve(hosts);
      });
    });
  }

  getIp(mac) {
    const found = this.arpTable.find(item => item.mac.toLowerCase() === mac);
    if (!found) {
      return 'No ip address found';
    }
    return found.ip;
  }

  async saveArpTable(fileName = this.defaultArpTableFile) {
    const jsonContent = JSON.stringify(this.arpTable, null, 4);
    await fs.writeFile(fileName, jsonContent, 'utf8', function(err) {
      if (err) {
        return err;
      }
    });
  }

  async loadArpTable(fileName = this.defaultArpTableFile) {
    const jsonContent = await fs.readFileSync(fileName);
    return JSON.parse(jsonContent);
  }
}

module.exports = arpTableSolver;
