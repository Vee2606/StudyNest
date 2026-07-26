(function () {
  'use strict';

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function number(value) {
    return Number(value);
  }

  function tidy(value) {
    if (!Number.isFinite(value)) return '—';
    return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  }

  function svgElement(name, attributes = {}, text = '') {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== '') element.textContent = text;
    return element;
  }

  const settings = {
    direct: {
      defaultK: 2,
      defaultX: 4,
      examples: [1, 2, 3, 4, 5],
      xMax: 10,
      yMax: 20,
      yStep: 2,
      tableX: [0, 1, 2, 3, 4, 5],
      calc: (x, k) => k * x,
      formula: k => `y = ${tidy(k)}x`
    },
    square: {
      defaultK: 1,
      defaultX: 3,
      examples: [0.5, 1, 1.5, 2],
      xMax: 5,
      yMax: 25,
      yStep: 5,
      tableX: [0, 1, 2, 3, 4, 5],
      calc: (x, k) => k * x * x,
      formula: k => `y = ${tidy(k)}x²`
    },
    inverse: {
      defaultK: 12,
      defaultX: 3,
      examples: [6, 12, 18, 24],
      xMax: 10,
      yMax: 24,
      yStep: 4,
      tableX: [1, 2, 3, 4, 6, 8],
      calc: (x, k) => k / x,
      formula: k => `y = ${tidy(k)}/x`
    },
    joint: {
      defaultK: 2,
      defaultX: 4,
      examples: [1, 2, 3, 4],
      xMax: 10,
      yMax: 40,
      yStep: 5,
      tableX: [0, 1, 2, 3, 4, 5],
      calc: (x, k) => k * x * 2,
      formula: k => `y = ${tidy(k)}xz  (z = 2)`
    }
  };

  function setupLab(lab) {
    const type = lab.dataset.type || 'direct';
    const config = settings[type] || settings.direct;
    const kInput = q('[data-k]', lab);
    const xInput = q('[data-x]', lab);
    const kValue = q('[data-kval]', lab);
    const xValue = q('[data-xval]', lab);
    const yValue = q('[data-yval]', lab);
    const equation = q('[data-equation]', lab);
    const rows = q('[data-rows]', lab);
    const svg = q('svg.graph', lab);

    if (!kInput || !xInput || !svg) return;

    if (type === 'inverse') {
      kInput.min = '6';
      kInput.max = '24';
      kInput.step = '3';
      kInput.value = String(config.defaultK);
    }

    const plot = { left: 54, right: 470, top: 25, bottom: 304 };
    const width = plot.right - plot.left;
    const height = plot.bottom - plot.top;
    const scaleX = value => plot.left + (value / config.xMax) * width;
    const scaleY = value => plot.bottom - (Math.max(0, Math.min(config.yMax, value)) / config.yMax) * height;

    let exampleIndex = Math.max(0, config.examples.indexOf(number(kInput.value)));

    function buildGraphFrame() {
      svg.innerHTML = '';
      const grid = svgElement('g', { class: 'grid' });
      const labels = svgElement('g', { class: 'tick-labels' });

      for (let x = 0; x <= config.xMax; x += 1) {
        const px = scaleX(x);
        grid.appendChild(svgElement('line', { x1: px, y1: plot.top, x2: px, y2: plot.bottom }));
        labels.appendChild(svgElement('text', { x: px, y: plot.bottom + 20, 'text-anchor': 'middle' }, String(x)));
      }

      for (let y = 0; y <= config.yMax; y += config.yStep) {
        const py = scaleY(y);
        grid.appendChild(svgElement('line', { x1: plot.left, y1: py, x2: plot.right, y2: py }));
        labels.appendChild(svgElement('text', { x: plot.left - 10, y: py + 4, 'text-anchor': 'end' }, String(y)));
      }

      svg.appendChild(grid);
      svg.appendChild(labels);
      svg.appendChild(svgElement('line', { class: 'axis', x1: plot.left, y1: plot.bottom, x2: plot.right + 8, y2: plot.bottom }));
      svg.appendChild(svgElement('line', { class: 'axis', x1: plot.left, y1: plot.bottom, x2: plot.left, y2: plot.top - 5 }));
      svg.appendChild(svgElement('text', { class: 'axis-title', x: plot.right + 4, y: plot.bottom + 32 }, 'x'));
      svg.appendChild(svgElement('text', { class: 'axis-title', x: plot.left - 30, y: plot.top + 3 }, 'y'));
      svg.appendChild(svgElement('path', { class: 'plot', d: '' }));
      svg.appendChild(svgElement('g', { class: 'sample-points' }));
      svg.appendChild(svgElement('circle', { class: 'point', r: 8, cx: 0, cy: 0 }));
      svg.appendChild(svgElement('text', { class: 'point-label', x: 0, y: 0 }, ''));
    }

    function addButtons() {
      if (q('.lab-actions', lab)) return;
      const actions = document.createElement('div');
      actions.className = 'lab-actions';
      actions.innerHTML = '<button type="button" data-reset-example>Reset example</button><button type="button" data-next-example>Try another example</button>';
      q('.lab-controls', lab).appendChild(actions);
      q('[data-reset-example]', actions).addEventListener('click', () => {
        kInput.value = String(config.defaultK);
        xInput.value = String(config.defaultX);
        exampleIndex = Math.max(0, config.examples.indexOf(config.defaultK));
        update();
      });
      q('[data-next-example]', actions).addEventListener('click', () => {
        exampleIndex = (exampleIndex + 1) % config.examples.length;
        kInput.value = String(config.examples[exampleIndex]);
        const suggestedX = type === 'inverse' ? [2, 3, 4, 6][exampleIndex % 4] : [2, 3, 4, 5][exampleIndex % 4];
        xInput.value = String(suggestedX);
        update();
      });
    }

    function update() {
      const k = number(kInput.value);
      const x = number(xInput.value);
      const y = config.calc(x, k);

      if (kValue) kValue.textContent = tidy(k);
      if (xValue) xValue.textContent = tidy(x);
      if (yValue) yValue.textContent = tidy(y);
      if (equation) equation.textContent = config.formula(k);

      const path = q('.plot', svg);
      let pathData = '';
      const startX = type === 'inverse' ? 0.5 : 0;
      const steps = 140;
      for (let i = 0; i <= steps; i += 1) {
        const graphX = startX + ((config.xMax - startX) * i) / steps;
        const graphY = config.calc(graphX, k);
        if (graphY > config.yMax * 1.15) continue;
        pathData += `${pathData ? ' L' : 'M'} ${scaleX(graphX)} ${scaleY(graphY)}`;
      }
      path.setAttribute('d', pathData);

      const sampleGroup = q('.sample-points', svg);
      sampleGroup.innerHTML = '';
      config.tableX.forEach(sampleX => {
        if (sampleX === 0 && type === 'inverse') return;
        const sampleY = config.calc(sampleX, k);
        if (sampleY < 0 || sampleY > config.yMax) return;
        sampleGroup.appendChild(svgElement('circle', {
          class: 'sample-point',
          r: 4.5,
          cx: scaleX(sampleX),
          cy: scaleY(sampleY)
        }));
      });

      const point = q('.point', svg);
      point.setAttribute('cx', scaleX(x));
      point.setAttribute('cy', scaleY(y));

      const pointLabel = q('.point-label', svg);
      pointLabel.setAttribute('x', Math.min(plot.right - 65, scaleX(x) + 12));
      pointLabel.setAttribute('y', Math.max(plot.top + 16, scaleY(y) - 12));
      pointLabel.textContent = `(${tidy(x)}, ${tidy(y)})`;

      if (rows) {
        rows.innerHTML = '';
        config.tableX.forEach(tableX => {
          if (tableX === 0 && type === 'inverse') return;
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${tidy(tableX)}</td><td>${tidy(config.calc(tableX, k))}</td>`;
          rows.appendChild(tr);
        });
      }
    }

    buildGraphFrame();
    addButtons();
    kInput.addEventListener('input', update);
    xInput.addEventListener('input', update);
    update();
  }

  qa('[data-variation-lab]').forEach(setupLab);

  qa('[data-choice]').forEach(group => {
    const feedback = q('[data-feedback]', group);
    qa('button', group).forEach(button => button.addEventListener('click', () => {
      const correct = button.dataset.answer === group.dataset.correct;
      feedback.textContent = correct
        ? 'Correct — the defining relationship stays constant.'
        : 'Not quite. Check whether y/x or xy remains constant.';
      feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    }));
  });

  qa('[data-checkpoint]').forEach(box => {
    const button = q('button', box);
    const input = q('input', box);
    const output = q('[data-result]', box);
    if (!button) return;
    button.addEventListener('click', () => {
      const target = number(box.dataset.answer);
      const value = number(input.value);
      const correct = Math.abs(value - target) < 0.01;
      output.textContent = correct
        ? 'Correct!'
        : 'Try again. Write the variation equation first, then find k.';
      output.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    });
  });
}());
