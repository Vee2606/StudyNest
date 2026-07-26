(function(){
  const root=document.querySelector('[data-worksheet]'); if(!root)return;
  const cards=[...root.querySelectorAll('.question-card')];
  const answered=new Set(), correct=new Set();
  const esc=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ');
  function selected(card){
    const type=card.dataset.type;
    if(type==='choice') return card.querySelector('input:checked')?.value ?? '';
    if(type==='text') return card.querySelector('.short-answer')?.value ?? '';
    if(type==='matching') return [...card.querySelectorAll('select')].map(x=>x.value).join('|');
    return '';
  }
  function isCorrect(card,value){
    if(card.dataset.type==='matching') return value===card.dataset.answer;
    const answers=(card.dataset.answer||'').split('||').map(esc);
    return answers.includes(esc(value));
  }
  function update(){
    const total=cards.length, done=answered.size, score=correct.size;
    root.querySelector('[data-answered]').textContent=`${done} / ${total}`;
    root.querySelector('[data-score]').textContent=done?`${score} correct`:'Not marked';
    root.querySelector('[data-progress]').style.width=`${done/total*100}%`;
  }
  function check(card){
    const value=selected(card), feedback=card.querySelector('.feedback');
    if(!value || value.split('|').some(v=>!v)) {feedback.className='feedback show bad';feedback.textContent='Please answer every part before checking.';return;}
    answered.add(card.dataset.q); const ok=isCorrect(card,value);
    if(ok) correct.add(card.dataset.q); else correct.delete(card.dataset.q);
    card.classList.toggle('correct',ok); card.classList.toggle('incorrect',!ok);
    feedback.className=`feedback show ${ok?'good':'bad'}`;
    feedback.textContent=ok?'Correct — well done!':'Not quite. Use the hint or review the worked solution, then try again.';
    update();
  }
  root.addEventListener('click',e=>{
    const card=e.target.closest('.question-card');
    if(e.target.matches('[data-check]')) check(card);
    if(e.target.matches('[data-hint]')) card.querySelector('.hint').classList.toggle('show');
    if(e.target.matches('[data-solution]')) card.querySelector('.solution').classList.toggle('show');
    if(e.target.matches('[data-finish]')) finish();
    if(e.target.matches('[data-retry]')) location.reload();
  });
  function finish(){
    cards.forEach(card=>{if(selected(card))check(card)});
    const panel=root.querySelector('.results-panel'), total=cards.length, score=correct.size, pct=Math.round(score/total*100);
    panel.querySelector('[data-final-score]').textContent=`${score} / ${total}`;
    panel.querySelector('[data-percent]').textContent=`${pct}%`;
    panel.querySelector('[data-message]').textContent=pct>=80?'Excellent — you are ready for the next practice pack.':pct>=60?'Good progress — review the missed questions, then try again.':'Keep practising — use the hints and worked solutions before retrying.';
    const missed=cards.filter(c=>!correct.has(c.dataset.q)).map(c=>`Question ${c.dataset.q}`);
    panel.querySelector('[data-review]').textContent=missed.length?`Review: ${missed.join(', ')}`:'You answered every question correctly.';
    panel.classList.add('show'); panel.scrollIntoView({behavior:'smooth',block:'center'});
  }
  update();
})();
