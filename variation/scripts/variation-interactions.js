(function () {
  function startVariationInteractions() {

'use strict';
const $=s=>document.querySelector(s);
const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
function drawGraph(svg,{xMax,yMax,xStep=1,yStep=1,curve,points,selected,xLabel='x',yLabel='y'}){
 if(!svg)return; const W=560,H=360,m={l:62,r:28,t:22,b:52},pw=W-m.l-m.r,ph=H-m.t-m.b;
 const sx=x=>m.l+(x/xMax)*pw, sy=y=>m.t+ph-(y/yMax)*ph;
 let gh='',ah='';
 for(let x=0;x<=xMax+1e-9;x+=xStep){gh+=`<line class="grid-line" x1="${sx(x)}" y1="${m.t}" x2="${sx(x)}" y2="${m.t+ph}"/>`;ah+=`<text class="tick-label" x="${sx(x)}" y="${m.t+ph+23}" text-anchor="middle">${fmt(x)}</text>`}
 for(let y=0;y<=yMax+1e-9;y+=yStep){gh+=`<line class="grid-line" x1="${m.l}" y1="${sy(y)}" x2="${m.l+pw}" y2="${sy(y)}"/>`;ah+=`<text class="tick-label" x="${m.l-10}" y="${sy(y)+4}" text-anchor="end">${fmt(y)}</text>`}
 ah+=`<line class="axis-line" x1="${m.l}" y1="${m.t+ph}" x2="${m.l+pw}" y2="${m.t+ph}"/><line class="axis-line" x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t+ph}"/><text class="axis-label" x="${m.l+pw+5}" y="${m.t+ph+5}">${xLabel}</text><text class="axis-label" x="${m.l}" y="${m.t-7}" text-anchor="middle">${yLabel}</text>`;
 svg.querySelector('.grid').innerHTML=gh;svg.querySelector('.axes').innerHTML=ah;
 svg.querySelector('.graph-line').setAttribute('d',curve.map((p,i)=>`${i?'L':'M'} ${sx(p[0])} ${sy(p[1])}`).join(' '));
 svg.querySelector('.graph-points').innerHTML=points.map(([x,y])=>`<circle class="point" cx="${sx(x)}" cy="${sy(y)}" r="5"/>`).join('');
 const [x,y]=selected;svg.querySelector('.selected-coordinate').innerHTML=`<line class="guide" x1="${sx(x)}" y1="${sy(y)}" x2="${sx(x)}" y2="${sy(0)}"/><line class="guide" x1="${sx(0)}" y1="${sy(y)}" x2="${sx(x)}" y2="${sy(y)}"/><circle class="selected-point" cx="${sx(x)}" cy="${sy(y)}" r="7"/><text class="coordinate-label" x="${Math.min(sx(x)+10,W-100)}" y="${Math.max(sy(y)-10,16)}">(${fmt(x)}, ${fmt(y)})</text>`;
}
function bind(id,event,fn){const e=$(id);if(e)e.addEventListener(event,fn)}
// Introduction
const ih=$('#intro-hours');if(ih){const run=()=>{const x=+ih.value,y=3*x;$('#intro-hours-value').textContent=x;$('#intro-hours-card').textContent=x;$('#intro-wages-card').textContent=`$${y}`;$('#intro-direct-result').textContent=`${x} hour${x===1?'':'s'} → $${y}`};ih.addEventListener('input',run);run()}
const iw=$('#intro-workers');if(iw){const run=()=>{const w=+iw.value,d=48/w;$('#intro-workers-value').textContent=w;$('#intro-workers-card').textContent=w;$('#intro-days-card').textContent=fmt(d);$('#intro-inverse-result').textContent=`${w} workers → ${fmt(d)} days`};iw.addEventListener('input',run);run()}
// Direct variation: rate and selected x both change for another example
const dh=$('#direct-hours');if(dh){let rate=3;const run=()=>{const x=+dh.value,y=rate*x;$('#direct-hours-value').textContent=x;$('#direct-x-card').textContent=x;$('#direct-y-card').textContent=`$${fmt(y)}`;$('#direct-equation').textContent=`y = ${rate}x → y = ${rate}(${x}) = ${fmt(y)}`;$('#direct-coordinate').textContent=`(${x}, ${fmt(y)})`;const vals=[1,2,3,4,5],ps=vals.map(v=>[v,rate*v]);drawGraph($('#direct-graph'),{xMax:8,yMax:40,xStep:1,yStep:5,curve:[[0,0],[8,8*rate]],points:ps,selected:[x,y],xLabel:'Hours',yLabel:'Wages'});const cells=$$('#direct-table-y td');cells.forEach((c,i)=>c.textContent=fmt(rate*(i+1)))};const $$=s=>document.querySelectorAll(s);dh.addEventListener('input',run);bind('#direct-reset','click',()=>{rate=3;dh.value=5;run()});bind('#direct-another','click',()=>{rate=rate===3?5:rate===5?2:3;run()});run()}
// Chocolate
const bs=$('#bars-slider');if(bs){let unit=3;const run=()=>{const n=+bs.value,c=unit*n;$('#bars-slider-value').textContent=n;$('#bars-count-card').textContent=`${n} bar${n===1?'':'s'}`;$('#bars-cost-card').textContent=`$${fmt(c)}`;$('#bars-equation').textContent=`k = ${unit}, so C = ${unit}(${n}) = $${fmt(c)}`;$('#chocolate-visual').innerHTML=Array.from({length:n},()=>'<span class="chocolate-bar" aria-hidden="true"></span>').join('');document.querySelectorAll('#bars-table-cost td').forEach((c,i)=>c.textContent=fmt(unit*(i+1)))};bs.addEventListener('input',run);bind('#bars-reset','click',()=>{unit=3;bs.value=5;run()});bind('#bars-another','click',()=>{unit=unit===3?2:unit===2?4:3;run()});run()}
// Inverse
const ws=$('#workers-slider');if(ws){let product=48;const run=()=>{const w=+ws.value,d=product/w;$('#workers-value').textContent=w;$('#workers-card').textContent=w;$('#days-card').textContent=fmt(d);$('#inverse-equation').textContent=`D = ${product} ÷ W → D = ${product} ÷ ${w} = ${fmt(d)}`;$('#inverse-coordinate').textContent=`(${w}, ${fmt(d)})`;const vals=[2,3,4,6,8],ps=vals.map(v=>[v,product/v]),curve=[];for(let x=2;x<=8;x+=.08)curve.push([x,product/x]);drawGraph($('#inverse-graph'),{xMax:8,yMax:32,xStep:1,yStep:4,curve,points:ps,selected:[w,d],xLabel:'Workers',yLabel:'Days'});document.querySelectorAll('#inverse-table-days td').forEach((c,i)=>c.textContent=fmt(product/vals[i]))};ws.addEventListener('input',run);bind('#inverse-reset','click',()=>{product=48;ws.value=4;run()});bind('#inverse-another','click',()=>{product=product===48?72:product===72?24:48;run()});run()}
// Joint
const ls=$('#length-slider'),ww=$('#width-slider');if(ls&&ww){const run=()=>{const l=+ls.value,w=+ww.value,a=l*w;$('#length-value').textContent=`${l} cm`;$('#width-value').textContent=`${w} cm`;$('#area-equation').textContent=`A = ${l} × ${w} = ${a} cm²`;$('#floor-area').textContent=`${a} cm²`;$('#length-caption').textContent=`${l} cm`;$('#width-caption').textContent=`${w} cm`;$('#joint-length-box').textContent=`${l} cm`;$('#joint-width-box').textContent=`${w} cm`;$('#joint-area-box').textContent=`${a} cm²`;const r=$('#floor-rectangle');r.style.width=`${70+l*18}px`;r.style.height=`${50+w*14}px`};ls.addEventListener('input',run);ww.addEventListener('input',run);bind('#joint-reset','click',()=>{ls.value=5;ww.value=8;run()});bind('#joint-another','click',()=>{ls.value=ls.value==='5'?7:5;ww.value=ww.value==='8'?4:8;run()});run()}
// Partial
const ds=$('#distance-slider');if(ds){let fixed=3,rate=.5;const run=()=>{const d=+ds.value,v=rate*d,t=fixed+v;$('#distance-value').textContent=`${d} km`;$('#distance-cost').textContent=`$${fmt(v)}`;$('#total-fare').textContent=`$${fmt(t)}`;$('#fare-equation').textContent=`F = ${fixed} + ${rate.toFixed(2)}(${d}) = $${fmt(t)}`;const vals=[0,5,10,15,20],ps=vals.map(x=>[x,fixed+rate*x]);drawGraph($('#partial-graph'),{xMax:20,yMax:20,xStep:2,yStep:2,curve:[[0,fixed],[20,fixed+20*rate]],points:ps,selected:[d,t],xLabel:'Distance',yLabel:'Fare'});document.querySelectorAll('#fare-table-row td').forEach((c,i)=>c.textContent=fmt(fixed+rate*vals[i]))};ds.addEventListener('input',run);bind('#partial-reset','click',()=>{fixed=3;rate=.5;ds.value=12;run()});bind('#partial-another','click',()=>{if(fixed===3){fixed=2;rate=.75}else{fixed=3;rate=.5}run()});run()}

  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startVariationInteractions, { once: true });
  } else {
    startVariationInteractions();
  }
})();
