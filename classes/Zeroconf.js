const fs = require('fs');
const arpping = require('arpping')({});

class Zeroconf {
  /**
   * Build the ARP table
   * @param ip
   * @returns {Promise<unknown>}
   */
  static getArpTable(ip = null) {
    return new Promise((resolve, reject) => {
      arpping.discover(ip, (err, hosts) => {
        if (err) {
          return reject(err);
        }
        const arpTable = Zeroconf.fixMacAddresses(hosts);
        return resolve(arpTable);
      });
    });
  }

  /**
   * Sometime arp command returns mac addresses without leading zeroes.
   * @param hosts
   */
  static fixMacAddresses(hosts) {
    return hosts.map(host => {
      const octets = host.mac.split(':');

      const fixedMac = octets.map(octet => {
        if (octet.length === 1) {
          return `0${octet}`;
        }
        return octet;
      });

      return {
        ip: host.ip,
        mac: fixedMac.join(':'),
      };
    });
  }

  /**
   * Save ARP table to local file
   * @param config
   * @returns {Promise<void>}
   */
  static async saveArpTable(config = {}) {
    const ip = config.ip || null;
    const fileName = config.fileName || './arp-table.json';
    const arpTable = await Zeroconf.getArpTable(ip);
    const jsonContent = JSON.stringify(arpTable, null, 2);
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
