(function() {
  'use strict';

  const filterInput = document.getElementById('filterInput');
  const resetBtn = document.getElementById('resetFilterBtn');
  const table = document.getElementById('dataTable');

  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  // 仅获取 tbody 的直属子行
  const rows = Array.from(tbody.children).filter(el => el.tagName === 'TR');

  // 获取某行的直属 td
  function getDirectCells(row) {
    return Array.from(row.children).filter(el => el.tagName === 'TD');
  }

  // 筛选函数：使用 textContent，允许匹配嵌套 table 中的内容
  function filterTable(keyword) {
    const cleanKeyword = keyword.trim().toLowerCase();

    rows.forEach(row => {
      const cells = getDirectCells(row);
      if (cells.length === 0) {
        row.classList.remove('hidden-row');
        return;
      }

      if (cleanKeyword === '') {
        row.classList.remove('hidden-row');
        return;
      }

      // 整行文本（包含嵌套 table 内容）
      const rowText = row.textContent.trim().toLowerCase();

      if (rowText.includes(cleanKeyword)) {
        row.classList.remove('hidden-row');
      } else {
        row.classList.add('hidden-row');
      }
    });
  }

  // 重置函数
  function resetFilter() {
    filterInput.value = '';
    rows.forEach(row => row.classList.remove('hidden-row'));
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 将分类单元格转换为按钮样式（仅处理直属 td）
  function convertCategoriesToButtons() {
    rows.forEach(row => {
      const cells = getDirectCells(row);
      if (cells.length < 2) return;

      const categoryCell = cells[1];

      // 避免重复转换
      if (categoryCell.querySelector('.category-tag')) return;

      const categoryText = categoryCell.textContent.trim();
      if (!categoryText) return;

      categoryCell.innerHTML = '';

      const button = document.createElement('span');
      button.className = 'category-tag';
      button.textContent = categoryText;
      button.setAttribute('data-category', categoryText);

      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.textContent.trim();
        filterInput.value = category;
        filterTable(category);
        filterInput.style.borderColor = '#5b7cfa';
        filterInput.style.boxShadow = '0 0 0 4px rgba(91, 124, 250, 0.2)';
        setTimeout(() => {
          filterInput.style.borderColor = '';
          filterInput.style.boxShadow = '';
        }, 800);
      });

      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });

      categoryCell.appendChild(button);
    });
  }

  filterInput.addEventListener('input', function(e) {
    filterTable(e.target.value);
  });

  resetBtn.addEventListener('click', function() {
    resetFilter();
  });

  window.addEventListener('load', function() {
    convertCategoriesToButtons();
    rows.forEach(row => row.classList.remove('hidden-row'));
    if (filterInput.value.trim() !== '') {
      filterTable(filterInput.value);
    }
  });

})();