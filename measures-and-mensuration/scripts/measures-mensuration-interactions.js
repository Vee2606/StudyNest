(() => {
  const page=(location.pathname.split('/').pop()||'').slice(0,2);
  const configs={
    '01':['Unit Converter','Value','From metres to centimetres',2.5,0.1,10,.1,v=>`${v} m = ${(v*100).toFixed(1)} cm`],
    '02':['Perimeter Builder','Width (height fixed at 5 cm)','Rectangle',8,1,15,1,v=>`P = 2(${v} + 5) = ${2*(v+5)} cm`],
    '03':['Triangle Area Explorer','Base (height fixed at 6 cm)','Triangle',10,2,18,1,v=>`A = ½ × ${v} × 6 = ${v*3} cm²`],
    '04':['Circle Lab','Radius','Circle',5,1,12,.5,v=>`C ≈ ${(2*Math.PI*v).toFixed(2)} cm · A ≈ ${(Math.PI*v*v).toFixed(2)} cm²`],
    '05':['Surface Area Lab','Cuboid length (w=5, h=4)','Cuboid',8,2,14,1,v=>`SA = 2(${v*5} + ${v*4} + 20) = ${2*(v*5+v*4+20)} cm²`],
    '06':['Volume Filler','Cuboid length (w=4, h=3)','Volume',6,1,12,1,v=>`V = ${v} × 4 × 3 = ${v*12} cm³`],
    '07':['Cylinder Lab','Radius (height 9 cm)','Cylinder',4,1,10,.5,v=>`V = π × ${v}² × 9 ≈ ${(Math.PI*v*v*9).toFixed(2)} cm³`],
    '08':['Cone Volume Lab','Radius (height 10 cm)','Cone',4,1,9,.5,v=>`V = ⅓π × ${v}² × 10 ≈ ${(Math.PI*v*v*10/3).toFixed(2)} cm³`],
    '09':['Density Calculator','Mass (volume 80 cm³)','Density',240,20,600,10,v=>`Density = ${v} ÷ 80 = ${(v/80).toFixed(2)} g/cm³`],
    '10':['Scale Factor Explorer','Scale factor','Similar shapes',2,.5,4,.5,v=>`Length × ${v} · Area × ${(v*v).toFixed(2)} · Volume × ${(v*v*v).toFixed(2)}`],
    '11':['Composite Shape Splitter','Outer width (height 8, cut-out 4×4)','L-shape',10,6,16,1,v=>`Area = ${v}×8 − 4×4 = ${v*8-16} cm²`],
    '12':['Frustum Explorer','Large radius (r=3, h=12)','Frustum',6,3.5,10,.5,v=>`V ≈ ${(Math.PI*12*(v*v+v*3+9)/3).toFixed(2)} cm³`]
  };
  const c=configs[page]; if(!c) return;
  const sections=document.querySelectorAll('main .lesson-section'); const anchor=sections[1]||sections[0]; if(!anchor)return;
  const lab=document.createElement('section'); lab.className='lesson-section mm-interactive-lab';
  lab.innerHTML=`<div class="section-heading"><span class="section-icon">🎛️</span><div><p class="eyebrow">INTERACTIVE DIAGRAM</p><h2>${c[0]}</h2><p>Move the slider and watch the measurement update instantly.</p></div></div><div class="mm-lab-grid"><div class="mm-controls"><label>${c[1]}: <strong id="mm-value">${c[3]}</strong><input id="mm-range" type="range" value="${c[3]}" min="${c[4]}" max="${c[5]}" step="${c[6]}"></label></div><div class="mm-visual"><svg id="mm-svg" viewBox="0 0 520 280"></svg><div class="mm-result" id="mm-result"></div></div></div>`;
  anchor.insertAdjacentElement('afterend',lab);
  const range=lab.querySelector('#mm-range'), value=lab.querySelector('#mm-value'), result=lab.querySelector('#mm-result'), svg=lab.querySelector('#mm-svg');
  function draw(v){value.textContent=v;result.textContent=c[7](+v);let s=55+Math.min(135,(+v)*8);svg.innerHTML=`<rect x="${260-s}" y="${140-s/2}" width="${s*2}" height="${s}" rx="18" class="mm-shape"/><line x1="260" y1="${140-s/2}" x2="260" y2="${140+s/2}" class="mm-guide"/><text x="260" y="135" text-anchor="middle">${c[2]}</text><text x="260" y="165" text-anchor="middle">value = ${v}</text>`;}
  range.addEventListener('input',e=>draw(e.target.value)); draw(range.value);
})();
