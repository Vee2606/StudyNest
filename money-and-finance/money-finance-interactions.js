(() => {
  'use strict';

  const money = value => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2
  }).format(Number(value) || 0);
  const getNumber = (root, id) => Number(root.querySelector(`#${id}`)?.value || 0);
  const setText = (root, id, value) => {
    const el = root.querySelector(`#${id}`);
    if (el) el.textContent = value;
  };
  const setBar = (root, id, value, maximum) => {
    const el = root.querySelector(`#${id}`);
    if (!el) return;
    const pct = maximum > 0 ? Math.max(0, Math.min(100, value / maximum * 100)) : 0;
    el.style.width = `${pct}%`;
    el.setAttribute('aria-label', `${money(value)} on a scale up to ${money(maximum)}`);
  };
  const shortAmount = value => {
    const n = Number(value) || 0;
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `$${n}`;
  };

  function addRangeScales(root) {
    root.querySelectorAll('input[type="range"]').forEach(input => {
      const min = Number(input.min || 0);
      const max = Number(input.max || 100);
      let scale = input.parentElement.querySelector('.range-number-line');
      if (!scale) {
        scale = document.createElement('div');
        scale.className = 'range-number-line';
        scale.setAttribute('aria-hidden', 'true');
        const currencyLike = !input.id.includes('rate') && !input.id.includes('time') && input.id !== 'hours';
        for (let i = 0; i < 5; i++) {
          const v = min + (max - min) * i / 4;
          const span = document.createElement('span');
          span.textContent = currencyLike ? shortAmount(Math.round(v)) : String(Number(v.toFixed(1)));
          scale.appendChild(span);
        }
        input.insertAdjacentElement('afterend', scale);
      }
      const output = root.querySelector(`[data-value-for="${input.id}"]`);
      const render = () => {
        if (output) {
          const isMoney = !input.id.includes('rate') && !input.id.includes('time') && input.id !== 'hours';
          output.textContent = isMoney ? money(input.value) : input.value;
        }
        const minV = Number(input.min || 0), maxV = Number(input.max || 100), val = Number(input.value || 0);
        const pct = maxV > minV ? (val - minV) / (maxV - minV) * 100 : 0;
        input.style.background = `linear-gradient(90deg,#2c7ec0 0%,#2c7ec0 ${pct}%,#dce7f1 ${pct}%,#dce7f1 100%)`;
      };
      input.addEventListener('input', render);
      render();
    });
  }

  function drawLineChart(canvas, series, labels) {
    if (!canvas || !canvas.getContext) return;
    const width = Math.max(300, Math.round(canvas.getBoundingClientRect().width || 640));
    const height = 280;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const pad = { left: 64, right: 18, top: 22, bottom: 44 };
    const values = series.flatMap(s => s.values).filter(Number.isFinite);
    const max = Math.max(...values, 1) * 1.08;
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const x = i => pad.left + i * plotW / Math.max(labels.length - 1, 1);
    const y = v => pad.top + (max - v) * plotH / max;
    const colours = ['#1769aa', '#e07a2d', '#2f9e73'];
    ctx.font = '12px system-ui,sans-serif';
    ctx.fillStyle = '#496078';
    for (let i = 0; i <= 4; i++) {
      const val = max * (4 - i) / 4;
      const py = pad.top + plotH * i / 4;
      ctx.strokeStyle = '#dce7f4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, py); ctx.lineTo(width - pad.right, py); ctx.stroke();
      ctx.fillText(shortAmount(Math.round(val)), 5, py + 4);
    }
    labels.forEach((label, i) => ctx.fillText(String(label), x(i) - 4, height - 18));
    ctx.fillText('Years', width / 2 - 15, height - 2);
    series.forEach((s, si) => {
      ctx.strokeStyle = colours[si % colours.length]; ctx.fillStyle = colours[si % colours.length]; ctx.lineWidth = 3;
      ctx.beginPath();
      s.values.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)));
      ctx.stroke();
      s.values.forEach((v, i) => { ctx.beginPath(); ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2); ctx.fill(); });
    });
  }

  function initialise(root) {
    addRangeScales(root);
    const type = root.dataset.lab;
    const update = () => {
      if (type === 'budget') {
        const income = getNumber(root, 'income'), fixed = getNumber(root, 'fixed'), variable = getNumber(root, 'variable');
        const expenses = fixed + variable, balance = income - expenses;
        const spentPct = income ? expenses / income * 100 : 0, savedPct = income ? balance / income * 100 : 0;
        setText(root, 'budget-income', money(income)); setText(root, 'total-expenses', money(expenses));
        setText(root, 'budget-balance', money(balance)); setText(root, 'budget-saved-percent', `${savedPct.toFixed(1)}%`);
        setText(root, 'budget-income-scale', money(income)); setText(root, 'budget-expense-scale', money(expenses)); setText(root, 'budget-balance-scale', money(balance));
        setBar(root, 'budget-income-bar', income, 3000); setBar(root, 'budget-expense-bar', expenses, 3000); setBar(root, 'budget-balance-bar', Math.max(balance, 0), 3000);
        const fill = root.querySelector('#budget-bar-fill');
        if (fill) { fill.style.width = `${Math.min(Math.max(spentPct,0),100)}%`; fill.style.backgroundColor = spentPct > 100 ? '#c92a2a' : spentPct >= 85 ? '#e07a2d' : '#2f9e73'; }
        setText(root, 'budget-status', balance < 0 ? `Deficit: expenses are ${money(Math.abs(balance))} more than income.` : `Surplus: ${money(balance)} remains after expenses.`);
      }
      if (type === 'percent') {
        const base = getNumber(root, 'percent-base'), rate = getNumber(root, 'percent-rate');
        const mode = root.querySelector('#percent-mode')?.value || 'find';
        const change = base * rate / 100;
        const result = mode === 'increase' ? base + change : mode === 'decrease' ? base - change : change;
        setText(root, 'percent-change', money(change)); setText(root, 'percent-result', money(result));
        setText(root, 'percent-original-scale', money(base)); setText(root, 'percent-change-scale', money(change)); setText(root, 'percent-result-scale', money(result));
        setBar(root, 'percent-original-bar', base, 2200); setBar(root, 'percent-change-bar', change, 2200); setBar(root, 'percent-result-bar', result, 2200);
      }
      if (type === 'profit') {
        const cost = getNumber(root, 'cost-price'), selling = getNumber(root, 'selling-price'), difference = selling - cost;
        const pct = cost ? Math.abs(difference) / cost * 100 : 0;
        setText(root, 'profit-result', money(Math.abs(difference))); setText(root, 'profit-label', difference >= 0 ? 'Profit' : 'Loss'); setText(root, 'profit-percent', `${pct.toFixed(1)}%`);
        setText(root, 'cost-price-scale', money(cost)); setText(root, 'selling-price-scale', money(selling));
        setBar(root, 'cost-price-bar', cost, 700); setBar(root, 'selling-price-bar', selling, 700);
        const pointer = root.querySelector('#profit-pointer');
        if (pointer) { pointer.textContent = difference >= 0 ? `Selling price is ${money(difference)} above cost price → PROFIT` : `Selling price is ${money(Math.abs(difference))} below cost price → LOSS`; pointer.style.background = difference >= 0 ? '#e7f7ef' : '#fff0f0'; pointer.style.color = difference >= 0 ? '#176b4d' : '#a52a2a'; }
      }
      if (type === 'discount') {
        const price = getNumber(root, 'original-price'), dr = getNumber(root, 'discount-rate'), vr = getNumber(root, 'vat-rate');
        const discount = price * dr / 100, after = price - discount, vat = after * vr / 100, final = after + vat;
        setText(root, 'discount-amount', money(discount)); setText(root, 'after-discount', money(after)); setText(root, 'vat-amount', money(vat)); setText(root, 'final-price', money(final));
        setText(root, 'marked-price-scale', money(price)); setText(root, 'after-discount-scale', money(after)); setText(root, 'final-price-scale', money(final));
        setBar(root, 'marked-price-bar', price, 2200); setBar(root, 'after-discount-bar', after, 2200); setBar(root, 'final-price-bar', final, 2200);
      }
      if (type === 'pay') {
        const hours = getNumber(root, 'hours'), rate = getNumber(root, 'hourly-rate');
        const normal = Math.min(hours,40)*rate, overtime = Math.max(hours-40,0)*rate*1.5;
        const commission = getNumber(root,'sales')*getNumber(root,'commission-rate')/100, deductions = getNumber(root,'deductions');
        const earned = normal + overtime, gross = earned + commission, net = gross - deductions;
        setText(root,'gross-pay',money(gross)); setText(root,'overtime-pay',money(overtime)); setText(root,'commission-pay',money(commission)); setText(root,'net-pay',money(net));
        setText(root,'earned-pay-scale',money(earned)); setText(root,'commission-scale-value',money(commission)); setText(root,'net-pay-scale',money(net));
        setBar(root,'earned-pay-bar',earned,2000); setBar(root,'commission-scale-bar',commission,2000); setBar(root,'net-pay-bar',Math.max(net,0),2000);
      }
      if (type === 'simple') {
        const p=getNumber(root,'si-principal'), r=getNumber(root,'si-rate'), t=getNumber(root,'si-time');
        const interest=p*r*t/100, total=p+interest;
        setText(root,'si-interest',money(interest)); setText(root,'si-amount',money(total));
        setText(root,'si-principal-scale',money(p)); setText(root,'si-interest-scale',money(interest)); setText(root,'si-total-scale',money(total));
        setBar(root,'si-principal-bar',p,8000); setBar(root,'si-interest-bar',interest,8000); setBar(root,'si-total-bar',total,8000);
        const years=Array.from({length:Math.floor(t)+1},(_,i)=>i);
        drawLineChart(root.querySelector('canvas'),[{values:years.map(y=>p*(1+r*y/100))}],years);
      }
      if (type === 'compound') {
        const p=getNumber(root,'ci-principal'), r=getNumber(root,'ci-rate')/100, t=Math.floor(getNumber(root,'ci-time')), dr=getNumber(root,'dep-rate')/100;
        const years=Array.from({length:t+1},(_,i)=>i), simple=years.map(y=>p*(1+r*y)), compound=years.map(y=>p*Math.pow(1+r,y)), dep=years.map(y=>p*Math.pow(1-dr,y));
        const final=compound.at(-1), simpleFinal=simple.at(-1);
        setText(root,'ci-amount',money(final)); setText(root,'ci-interest',money(final-p)); setText(root,'dep-value',money(dep.at(-1)));
        setText(root,'ci-principal-scale',money(p)); setText(root,'ci-simple-scale',money(simpleFinal)); setText(root,'ci-compound-scale',money(final));
        const scaleMax=Math.max(20000,final,simpleFinal);
        setBar(root,'ci-principal-bar',p,scaleMax); setBar(root,'ci-simple-bar',simpleFinal,scaleMax); setBar(root,'ci-compound-bar',final,scaleMax);
        drawLineChart(root.querySelector('canvas'),[{values:simple},{values:compound},{values:dep}],years);
      }
    };
    root.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',update);el.addEventListener('change',update);});
    root.__updateMoneyLab=update;
    update();
  }

  function start(){ document.querySelectorAll('[data-lab]').forEach(initialise); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  let timer; window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>document.querySelectorAll('[data-lab]').forEach(r=>r.__updateMoneyLab?.()),120);});
})();
