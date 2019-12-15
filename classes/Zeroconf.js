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
   * @returns {Promise<{error: string}|{file: {request: string; resolved: string} | any | string | string, status: string}>}
   */
  static async saveArpTable(config = {}) {
    const ip = config.ip || null;
    const fileName = config.file || './arp-table.json';
    try {
      const arpTable = await Zeroconf.getArpTable(ip);
      const jsonContent = JSON.stringify(arpTable, null, 2);
      fs.writeFileSync(fileName, jsonContent, 'utf8');
      return { status: 'ok', file: fileName };
    } catch (e) {
      return { error: e.toString() };
    }
  }

  /**
   * Read ARP table file
   * @param fileName
   * @returns {Promise<{error: string}|any>}
   */
  static async loadArpTable(fileName = './arp-table.json') {
    try {
      const jsonContent = await fs.readFileSync(fileName);
      return JSON.parse(jsonContent);
    } catch (e) {
      return { error: e.toString() };
    }
  }

  /**
   * Read devices cache file
   * @param fileName
   * @returns {Promise<{error: string}>}
   */
  static async loadCachedDevices(fileName = './devices-cache.json') {
    try {
      const jsonContent = await fs.readFileSync(fileName);
      return JSON.parse(jsonContent);
    } catch (e) {
      return { error: e.toString() };
    }
  }
}

module.exports = Zeroconf;
