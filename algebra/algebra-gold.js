
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-gold-lab]').forEach(lab=>{
    const output=lab.querySelector('.step-output');
    lab.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const steps=JSON.parse(lab.dataset.steps||'[]'); const i=Number(btn.dataset.step||0)%steps.length;
      if(output&&steps.length) output.innerHTML=steps[i]; btn.dataset.step=(i+1)%steps.length;
    }));
    lab.querySelectorAll('[data-highlight]').forEach(btn=>btn.addEventListener('click',()=>{
      lab.querySelectorAll('.factor-chip').forEach(c=>c.classList.toggle('active',c.dataset.group===btn.dataset.highlight));
      if(output) output.textContent=btn.dataset.message||'Matching factors are highlighted.';
    }));
  });
});
