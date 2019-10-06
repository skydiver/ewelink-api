const arp = require('@network-utils/arp-lookup');
const ping = require('net-ping');
const fs = require('fs');

class arpTableSolver {
  async Init() {
    const hosts = [];

    // this is required because arpTable is 'temporal' and refresh is needed before get it
    for (let i = 20; i < 60; i += 1) {
      hosts.push(`192.168.1.${i}`);
    }

    const session = ping.createSession();
    await hosts.forEach(function(target) {
      session.pingHost(target, function(error, target) {
        if (error) console.log(`${target}: ${error.toString()}`);
        else console.log(`${target}: Alive`);
      });
    });

    this.arpTable = await arp.getTable();
  }

  GetIp(mac) {
    this.arpTable.filter(function(item) {
      return item.mac.toLowerCase() === mac;
    })[0] || null;
    const arpItem =
      this.arpTable.filter(function(item) {
        return item.mac.toLowerCase() === mac;
      })[0] || null;
    const { ip } = arpItem;
    return ip;
  }

  async saveArpTable(fileName) {
    const jsonContent = JSON.stringify(this.arpTable);
    fs.writeFile(fileName, jsonContent, 'utf8', function(err) {
      if (err) {
        console.log('An error occured while writing JSON Object to File.');
        return console.log(err);
      }
    });
  }

  async loadArpTable(filename) {
    const jsonContent = fs.readFileSync(filename);
    return JSON.parse(jsonContent);
  }
}

module.exports = arpTableSolver;
