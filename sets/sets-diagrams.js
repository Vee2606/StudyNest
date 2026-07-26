document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-venn-interactive]').forEach((board) => {
    const visualBoard = board.closest('.visual-board') || board.parentElement;
    const buttons = [...visualBoard.querySelectorAll('[data-operation]')];
    const label = board.querySelector('[data-operation-label]');
    const regions = {
      left: board.querySelector('.op-left'),
      right: board.querySelector('.op-right'),
      overlap: board.querySelector('.op-overlap'),
      outside: board.querySelector('.op-outside')
    };

    const hideAll = () => {
      Object.values(regions).forEach((region) => {
        if (region) region.style.fillOpacity = '0';
      });
    };

    const show = (region, opacity) => {
      if (region) region.style.fillOpacity = opacity;
    };

    const update = (operation) => {
      hideAll();

      if (operation === 'union') {
        show(regions.left, '.68');
        show(regions.right, '.68');
        show(regions.overlap, '.76');
        if (label) label.textContent = 'A ∪ B: shade every region that belongs to A or B, including the overlap.';
      } else if (operation === 'intersection') {
        show(regions.overlap, '.82');
        if (label) label.textContent = 'A ∩ B: shade only the region shared by both A and B.';
      } else if (operation === 'a-difference') {
        show(regions.left, '.74');
        if (label) label.textContent = 'A − B: shade the part of A that does not belong to B.';
      } else if (operation === 'complement') {
        show(regions.outside, '.54');
        if (label) label.textContent = 'A′: shade everything inside U that lies outside A.';
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        update(button.dataset.operation);
      });
    });

    if (buttons.length) buttons[0].click();
  });
});
