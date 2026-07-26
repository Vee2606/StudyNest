(()=>{
 const ready=()=>{
  if(document.querySelector('.sn31-progress'))return;
  const progress=document.createElement('div');progress.className='sn31-progress';progress.innerHTML='<span></span>';document.body.appendChild(progress);
  const bar=progress.firstElementChild;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'};
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  const controls=document.createElement('div');controls.className='sn31-scroll';controls.innerHTML='<button type="button" aria-label="Scroll to top">↑</button><button type="button" aria-label="Scroll to bottom">↓</button>';
  controls.children[0].onclick=()=>scrollTo({top:0,behavior:'smooth'});controls.children[1].onclick=()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});document.body.appendChild(controls);
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
