const { coolingRate } = require('../domain/temperatureModel');
const { solveEuler } = require('../solver/eulerSolver');

function validateInputs(params) {
  const {
    startTemperature,
    coolingTemperature,
    stepSize,
    coolingCoefficient,
    maxTime,
    tolerance
  } = params;

  if (!Number.isFinite(startTemperature)) {
    throw new Error('Starting temperature must be a valid number.');
  }

  if (!Number.isFinite(coolingTemperature)) {
    throw new Error('Cooling temperature must be a valid number.');
  }

  if (!Number.isFinite(stepSize) || stepSize <= 0) {
    throw new Error('Step size must be a positive number.');
  }

  if (!Number.isFinite(coolingCoefficient) || coolingCoefficient <= 0) {
    throw new Error('Cooling coefficient must be a positive number.');
  }

  if (!Number.isFinite(maxTime) || maxTime <= 0) {
    throw new Error('Maximum simulation time must be a positive number.');
  }

  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new Error('Tolerance must be a non-negative number.');
  }
}

function runCoolingSimulation(params) {
  validateInputs(params);

  const {
    startTemperature,
    coolingTemperature,
    stepSize,
    coolingCoefficient,
    maxTime,
    tolerance
  } = params;

  const derivative = (_, currentTemp) => coolingRate(currentTemp, coolingTemperature, coolingCoefficient);

  const allEulerValues = solveEuler({
    derivative,
    initialValue: startTemperature,
    stepSize,
    startTime: 0,
    maxTime
  });

  const truncatedValues = [];
  for (const entry of allEulerValues) {
    truncatedValues.push(entry);
    if (Math.abs(entry.value - coolingTemperature) <= tolerance) {
      break;
    }
  }

  const finalEntry = truncatedValues[truncatedValues.length - 1];

  return {
    values: truncatedValues,
    metadata: {
      completedAtTime: finalEntry.time,
      finalTemperature: finalEntry.value,
      stoppedByTolerance: Math.abs(finalEntry.value - coolingTemperature) <= tolerance
    }
  };
}

module.exports = {
  runCoolingSimulation
};