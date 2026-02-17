const { runCoolingSimulation } = require('./application/coolingSimulationService');

const elements = {
  startTemperature: document.getElementById('startTemperature'),
  coolingTemperature: document.getElementById('coolingTemperature'),
  stepSize: document.getElementById('stepSize'),
  coolingCoefficient: document.getElementById('coolingCoefficient'),
  maxTime: document.getElementById('maxTime'),
  tolerance: document.getElementById('tolerance'),
  runSimulation: document.getElementById('runSimulation'),
  statusText: document.getElementById('statusText'),
  valuesBody: document.getElementById('valuesBody'),
  coolingChart: document.getElementById('coolingChart')
};

function toNumber(value) {
  return Number.parseFloat(value);
}

function round(value, digits = 6) {
  return Number.parseFloat(value.toFixed(digits));
}

function readParameters() {
  return {
    startTemperature: toNumber(elements.startTemperature.value),
    coolingTemperature: toNumber(elements.coolingTemperature.value),
    stepSize: toNumber(elements.stepSize.value),
    coolingCoefficient: toNumber(elements.coolingCoefficient.value),
    maxTime: toNumber(elements.maxTime.value),
    tolerance: toNumber(elements.tolerance.value)
  };
}

function renderValues(values) {
  elements.valuesBody.innerHTML = '';

  for (const row of values) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.step}</td>
      <td>${round(row.time, 4)}</td>
      <td>${round(row.value, 6)}</td>
      <td>${round(row.derivative, 6)}</td>
    `;
    elements.valuesBody.appendChild(tr);
  }
}

function drawCoolingChart(values, coolingTemperature) {
  const canvas = elements.coolingChart;
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  context.clearRect(0, 0, width, height);

  if (values.length < 2) {
    return;
  }

  const padding = { top: 24, right: 24, bottom: 40, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const times = values.map((entry) => entry.time);
  const temps = values.map((entry) => entry.value);
  temps.push(coolingTemperature);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempSpan = Math.max(1e-9, maxTemp - minTemp);
  const timeSpan = Math.max(1e-9, maxTime - minTime);

  const xScale = (time) => padding.left + ((time - minTime) / timeSpan) * chartWidth;
  const yScale = (temp) => padding.top + ((maxTemp - temp) / tempSpan) * chartHeight;

  context.strokeStyle = '#cfd6e4';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding.left, padding.top);
  context.lineTo(padding.left, padding.top + chartHeight);
  context.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  context.stroke();

  context.strokeStyle = '#ec6f0a';
  context.setLineDash([6, 4]);
  context.beginPath();
  context.moveTo(padding.left, yScale(coolingTemperature));
  context.lineTo(padding.left + chartWidth, yScale(coolingTemperature));
  context.stroke();
  context.setLineDash([]);

  context.strokeStyle = '#2463eb';
  context.lineWidth = 2;
  context.beginPath();
  values.forEach((entry, index) => {
    const x = xScale(entry.time);
    const y = yScale(entry.value);
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.stroke();

  context.fillStyle = '#1d2433';
  context.font = '13px Inter, Segoe UI, Arial';
  context.fillText('Time', padding.left + chartWidth / 2 - 12, height - 12);

  context.save();
  context.translate(14, padding.top + chartHeight / 2 + 14);
  context.rotate(-Math.PI / 2);
  context.fillText('Temperature', 0, 0);
  context.restore();

  context.fillStyle = '#ec6f0a';
  context.fillText(`Cooling temperature = ${round(coolingTemperature, 4)}`, padding.left + 6, yScale(coolingTemperature) - 8);
}

function run() {
  elements.statusText.textContent = '';
  try {
    const params = readParameters();
    const { values, metadata } = runCoolingSimulation(params);

    renderValues(values);
    drawCoolingChart(values, params.coolingTemperature);

    const mode = metadata.stoppedByTolerance
      ? `Stopped by tolerance at t=${round(metadata.completedAtTime, 4)}`
      : `Stopped at max time t=${round(metadata.completedAtTime, 4)}`;

    elements.statusText.textContent = `${mode}; final T=${round(metadata.finalTemperature, 6)}`;
  } catch (error) {
    elements.valuesBody.innerHTML = '';
    const ctx = elements.coolingChart.getContext('2d');
    ctx.clearRect(0, 0, elements.coolingChart.width, elements.coolingChart.height);
    elements.statusText.textContent = error.message;
  }
}

elements.runSimulation.addEventListener('click', run);
run();