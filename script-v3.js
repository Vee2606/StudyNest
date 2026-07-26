
(function(){
 const bar=document.createElement('div');bar.className='sn-reading-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
 const controls=document.createElement('div');controls.className='sn-scroll-controls';controls.innerHTML='<button class="sn-scroll-button sn-up" aria-label="Scroll to top" title="Back to top">↑</button><button class="sn-scroll-button sn-down" aria-label="Scroll to bottom" title="Go to bottom">↓</button>';document.body.appendChild(controls);
 const up=controls.querySelector('.sn-up'),down=controls.querySelector('.sn-down');
 up.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});down.onclick=()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});
 function update(){const max=document.documentElement.scrollHeight-innerHeight;const y=scrollY;bar.style.width=(max>0?Math.min(100,y/max*100):0)+'%';up.hidden=y<180;down.hidden=max-y<180;}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();
