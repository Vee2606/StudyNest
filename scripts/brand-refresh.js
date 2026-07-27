(()=>{
 const script=document.currentScript;
 const root=(script?.src||'').replace(/scripts\/brand-refresh\.js(?:\?.*)?$/,'');
 const logo=root+'assets/studynest-mark.svg';
 const home=root+'index.html';
 const makeBrand=(href=home)=>`<a class="sn-brand-lockup" href="${href}" aria-label="StudyNest home"><img class="sn-brand-mark" src="${logo}" alt=""><span class="sn-brand-copy"><span class="sn-brand-name">Study<em>Nest</em></span><span class="sn-brand-motto">Learn Mathematics Through Understanding</span></span></a>`;
 const ready=()=>{
  document.body.classList.add('sn-brand-refresh');
  const path=location.pathname.toLowerCase();
  if(path.endsWith('/worksheets.html')||path.includes('/study-by-form/index.html')) document.body.classList.add('sn-warm-landing');

  // Favicon on every page.
  let icon=document.querySelector('link[rel~="icon"]');
  if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon)}
  icon.type='image/svg+xml';icon.href=logo;

  // Replace every visible header logo with the approved StudyNest lock-up.
  document.querySelectorAll('.site-header').forEach(header=>{
   const old=header.querySelector(':scope > a.brand-lockup,:scope > a.logo,:scope > .logo');
   if(old){
    const holder=document.createElement('div');holder.innerHTML=makeBrand(old.getAttribute?.('href')||home);
    old.replaceWith(holder.firstElementChild);
   } else if(!header.querySelector('.sn-brand-lockup')){
    header.insertAdjacentHTML('afterbegin',makeBrand(home));
   }
  });
  // Support legacy custom component header.
  document.querySelectorAll('studynest-header header').forEach(header=>{
   const old=header.querySelector('.logo');if(old){const holder=document.createElement('div');holder.innerHTML=makeBrand(home);old.replaceWith(holder.firstElementChild)}
  });

  // Brand footers without disturbing their links or copy.
  document.querySelectorAll('.site-footer, footer').forEach(footer=>{
   if(footer.querySelector('.sn-footer-brand'))return;
   const candidates=[...footer.querySelectorAll('.footer-logo,strong,h2')];
   const old=candidates.find(el=>/studynest/i.test(el.textContent||''));
   const brand=document.createElement('div');brand.className='sn-footer-brand';brand.innerHTML=`<img src="${logo}" alt=""><span>Study<em>Nest</em></span>`;
   if(old)old.replaceWith(brand);else footer.prepend(brand);
  });

  // Apply watermark to key hero variants.
  const selectors=['.minimal-hero','.topics-hero','.level-hero','.worksheet-hero','.topic-hero','.lesson-hero','.page-hero','.form-hero','.hero'];
  for(const sel of selectors)document.querySelectorAll(sel).forEach(el=>el.classList.add('sn-watermark-host'));

  // Remove only temporary NEW labels, never educational text containing the word new.
  document.querySelectorAll('.sn-new-badge,.new-badge,.badge-new,[data-badge="new"]').forEach(el=>el.remove());

  // Loading identity. Kept brief so it feels polished rather than obstructive.
  const loader=document.querySelector('.sn-loader');
  const finish=()=>loader?.classList.add('sn-loader-done');
  if(document.readyState==='complete')setTimeout(finish,420);else addEventListener('load',()=>setTimeout(finish,420),{once:true});
  setTimeout(finish,1800);
 };
 // Insert immediately so the logo appears while the document is loading.
 if(!document.querySelector('.sn-loader')){
  const loader=document.createElement('div');loader.className='sn-loader';loader.setAttribute('aria-label','Loading StudyNest');
  loader.innerHTML=`<div class="sn-loader-card"><img class="sn-loader-logo" src="${logo}" alt="StudyNest book nest logo"><div class="sn-loader-name">Study<em>Nest</em></div><div class="sn-loader-motto">Learn Mathematics Through Understanding</div><div class="sn-loader-line"><span></span></div></div>`;
  (document.body||document.documentElement).appendChild(loader);
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',ready,{once:true}):ready();
})();
