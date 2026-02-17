function solveEuler({ derivative, initialValue, stepSize, startTime, maxTime }) {
  const values = [];
  let t = startTime;
  let y = initialValue;

  values.push({
    step: 0,
    time: t,
    value: y,
    derivative: derivative(t, y)
  });

  let step = 0;
  while (t + stepSize <= maxTime + 1e-12) {
    const dydt = derivative(t, y);
    y = y + stepSize * dydt;
    t = t + stepSize;
    step += 1;

    values.push({
      step,
      time: t,
      value: y,
      derivative: derivative(t, y)
    });
  }

  return values;
}

module.exports = {
  solveEuler
};