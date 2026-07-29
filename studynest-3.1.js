(()=>{
 const ready=()=>{
  if(document.querySelector('.sn31-progress'))return;
  const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=document.createElement('div');progress.className='sn31-progress';progress.innerHTML='<span></span>';document.body.appendChild(progress);
  const bar=progress.firstElementChild;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'};
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  const controls=document.createElement('div');controls.className='sn31-scroll';controls.innerHTML='<button type="button" aria-label="Scroll to top">↑</button><button type="button" aria-label="Scroll to bottom">↓</button>';
  controls.children[0].onclick=()=>scrollTo({top:0,behavior:'smooth'});controls.children[1].onclick=()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});document.body.appendChild(controls);

  const pageShell=document.querySelector('main, .main-content, .page-content, .lesson-page, .topic-page, .lesson-main, .content-container, .worksheet-paper');
  if(pageShell && !prefersReducedMotion){
   pageShell.classList.add('sn31-page-shell');
   requestAnimationFrame(()=>pageShell.classList.add('sn31-page-animate'));
   requestAnimationFrame(()=>pageShell.classList.add('sn31-page-ready'));
  }

  const revealTargets=[...document.querySelectorAll('main > section, .lesson-section, .page-section, .hero, .page-hero, .topic-hero, .lesson-hero, .why-strip, .path-section')].filter(el=>!el.classList.contains('sn31-reveal'));
  if(revealTargets.length && !prefersReducedMotion && 'IntersectionObserver' in window){
   revealTargets.forEach((el,i)=>{el.classList.add('sn31-reveal','sn31-animate');el.style.transitionDelay=`${Math.min(i*.06,.24)}s`;});
   const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('sn31-visible');observer.unobserve(entry.target)}})},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
   revealTargets.forEach(el=>observer.observe(el));
  } else if(revealTargets.length){
   revealTargets.forEach(el=>el.classList.add('sn31-reveal','sn31-visible'));
  }

  const animateProgressBars=()=>{
   const progressBars=[...document.querySelectorAll('.progress-fill, .ws-progress-fill, [role="progressbar"], [aria-valuenow]')];
   progressBars.forEach(el=>{
    const rawValue=Number.parseFloat(el.getAttribute('aria-valuenow')||el.dataset.progress||'');
    const min=Number.parseFloat(el.getAttribute('aria-valuemin')||'0');
    const max=Number.parseFloat(el.getAttribute('aria-valuemax')||'100');
    let targetPercent=0;
    if(!Number.isNaN(rawValue) && max>min){targetPercent=((rawValue-min)/(max-min))*100;} else if(el.style.width){const widthValue=Number.parseFloat(el.style.width);targetPercent=Number.isFinite(widthValue)?widthValue:0;} else if(el.getAttribute('style')&&/width:\s*\d+%/.test(el.getAttribute('style'))){const match=el.getAttribute('style').match(/width:\s*(\d+(?:\.\d+)?)%/);targetPercent=match?Number.parseFloat(match[1]):0;}
    if(!Number.isFinite(targetPercent)||targetPercent<0)return;
    if(prefersReducedMotion){el.style.width=`${Math.max(0,Math.min(100,targetPercent))}%`;return;}
    el.style.width='0%';
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{el.style.width=`${Math.max(0,Math.min(100,targetPercent))}%`;});});
   });
  };
  if(prefersReducedMotion){animateProgressBars();} else {window.addEventListener('load',animateProgressBars,{once:true});requestAnimationFrame(animateProgressBars);}

  document.querySelectorAll('details').forEach(details=>{
   const panels=[...details.children].filter(child=>child.tagName!=='SUMMARY');
   if(!panels.length)return;
   panels.forEach(panel=>panel.classList.add('sn31-details-panel'));
   const syncPanel=()=>{
    panels.forEach(panel=>{
     if(details.open){panel.style.maxHeight=`${panel.scrollHeight}px`;panel.style.opacity='1';panel.classList.add('sn31-open');} else {panel.style.maxHeight='0px';panel.style.opacity='0';panel.classList.remove('sn31-open');}
    });
   };
   syncPanel();
   details.addEventListener('toggle',syncPanel);
  });

  const main=document.querySelector('main, article, .lesson-content, .lesson-container, .page-content');
  if(!main)return;
  const heads=[...main.querySelectorAll('h2,h3')].filter(h=>h.textContent.trim().length>2).slice(0,18);
  if(heads.length<3)return;
  document.body.classList.add('sn31-has-toc');
  heads.forEach((h,i)=>{if(!h.id)h.id='section-'+(i+1)});
  const toc=document.createElement('aside');toc.className='sn31-toc';toc.setAttribute('aria-label','Lesson sections');toc.innerHTML='<strong>On this page</strong>'+heads.map(h=>`<a href="#${h.id}">${h.textContent.trim()}</a>`).join('');document.body.appendChild(toc);
  const toggle=document.createElement('button');toggle.type='button';toggle.className='sn31-toc-toggle';toggle.textContent='☰ Sections';toggle.onclick=()=>toc.classList.toggle('open');document.body.appendChild(toggle);
  toc.addEventListener('click',e=>{if(e.target.tagName==='A'&&innerWidth<1300)toc.classList.remove('open')});
  const links=[...toc.querySelectorAll('a')];
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-20% 0px -65% 0px'});heads.forEach(h=>io.observe(h));
 };
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',ready):ready();
})();
