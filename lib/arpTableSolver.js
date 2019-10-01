const arp = require('npm install net-ping@network-utils/arp-lookup')
var ping = require ("net-ping");
const fs = require('fs');

class arpTableSolver {
   async Init() {
   
    var hosts = [];

    // this is required because arpTable is 'temporal' and refresh is needed before get it
    for(var i = 20; i < 60; i++)
    {
      hosts.push(`192.168.1.${i}`);
    }
    
    var session = ping.createSession ();
    await hosts.forEach(function(target){
      session.pingHost (target, function (error, target) {
        if (error)
            console.log (target + ": " + error.toString ());
        else
            console.log (target + ": Alive");
      });
    });

    this.arpTable = await arp.getTable();
   }

   GetIp(mac) {
    this.arpTable.filter(function (item) { return item.mac.toLowerCase() === mac })[0] || null;
    var arpItem = this.arpTable.filter(function (item) { return item.mac.toLowerCase() === mac })[0] || null;
    var ip = arpItem.ip;
    return ip;
   }

   async saveArpTable(fileName) {
      var jsonContent = JSON.stringify(this.arpTable);
      fs.writeFile(fileName, jsonContent, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }
      });
   };
   
   async loadArpTable(filename) {
     let jsonContent = fs.readFileSync(filename);
     return JSON.parse(jsonContent)
   };
};

module.exports = arpTableSolver;