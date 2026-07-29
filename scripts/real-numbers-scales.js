
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-scale-calculator]').forEach(box=>{
  const drawing=box.querySelector('[data-drawing]'), unit=box.querySelector('[data-unit]'), factor=box.querySelector('[data-factor]'), out=box.querySelector('[data-output]'), marker=box.querySelector('[data-marker]');
  const update=()=>{const d=parseFloat(drawing?.value||0), f=parseFloat(factor?.value||0); const ans=d*f; if(out) out.textContent=`${d} cm on the drawing represents ${Number.isFinite(ans)?ans.toLocaleString():0} ${unit?.value||'units'} in real life.`.replace(':g',''); if(marker) marker.style.left=Math.min(96,Math.max(4,d*10))+'%';};
  [drawing,unit,factor].forEach(el=>el&&el.addEventListener('input',update)); update();
 });
 document.querySelectorAll('[data-rf-converter]').forEach(box=>{
  const denom=box.querySelector('[data-denom]'), cm=box.querySelector('[data-cm]'), out=box.querySelector('[data-output]');
  const update=()=>{const n=parseFloat(denom.value||0), d=parseFloat(cm.value||0); const realCm=n*d; const m=realCm/100, km=realCm/100000; out.textContent=km>=1?`${d} cm represents ${km.toLocaleString()} km`:`${d} cm represents ${m.toLocaleString()} m`;};
  [denom,cm].forEach(el=>el.addEventListener('input',update)); update();
 });
 document.querySelectorAll('[data-scale-factor]').forEach(box=>{
  const original=box.querySelector('[data-original]'), image=box.querySelector('[data-image]'), out=box.querySelector('[data-output]');
  const update=()=>{const a=parseFloat(original.value||0),b=parseFloat(image.value||0),k=a?b/a:0;out.textContent=`Scale factor = ${b} ÷ ${a} = ${k.toLocaleString()}`};[original,image].forEach(el=>el.addEventListener('input',update));update();
 });
});
