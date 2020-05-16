/**
 * Return daily power usage
 *
 * @param hundredDaysKwhData
 *
 * @returns {{daily: *, monthly: *}}
 */
const parsePowerUsage = ({ hundredDaysKwhData }) => {
  const today = new Date();
  const days = today.getDate();

  let monthlyUsage = 0;
  const dailyUsage = [];

  for (let day = 0; day < days; day += 1) {
    const s = hundredDaysKwhData.substr(6 * day, 2);
    const c = hundredDaysKwhData.substr(6 * day + 2, 2);
    const f = hundredDaysKwhData.substr(6 * day + 4, 2);
    const h = parseInt(s, 16);
    const y = parseInt(c, 16);
    const I = parseInt(f, 16);
    const E = parseFloat(`${h}.${y}${I}`);

    dailyUsage.push({
      day: days - day,
      usage: E,
    });

    monthlyUsage += E;
  }

  return {
    monthly: monthlyUsage,
    daily: dailyUsage,
  };
};

module.exports = parsePowerUsage;
