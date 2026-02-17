function coolingRate(currentTemperature, coolingTemperature, coolingCoefficient) {
  return -coolingCoefficient * (currentTemperature - coolingTemperature);
}

module.exports = {
  coolingRate
};