(function() {
  'use strict';

  // 获取 DOM 元素
  const filterInput = document.getElementById('filterInput');
  const resetBtn = document.getElementById('resetFilterBtn');
  const table = document.getElementById('dataTable');
  const tbody = table.querySelector('tbody');

  // 如果 tbody 不存在，直接返回
  if (!tbody) return;

  // 获取所有数据行
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // 筛选函数
  function filterTable(keyword) {
    const cleanKeyword = keyword.trim().toLowerCase();

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 0) {
        row.classList.remove('hidden-row');
        return;
      }

      if (cleanKeyword === '') {
        row.classList.remove('hidden-row');
        return;
      }

      const contentCell = cells[0];
      const categoryCell = cells[1];

      let match = false;

      if (contentCell) {
        const contentText = contentCell.textContent.trim().toLowerCase();
        if (contentText.includes(cleanKeyword)) {
          match = true;
        }
      }

      if (!match && categoryCell) {
        const categoryText = categoryCell.textContent.trim().toLowerCase();
        if (categoryText.includes(cleanKeyword)) {
          match = true;
        }
      }

      if (match) {
        row.classList.remove('hidden-row');
      } else {
        row.classList.add('hidden-row');
      }
    });
  }

  // 重置函数：清空输入框 + 显示所有行
  function resetFilter() {
    filterInput.value = '';
    // 显示所有行
    rows.forEach(row => row.classList.remove('hidden-row'));
    // 触发 input 事件，让其他监听器也能同步（如果有）
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 监听输入事件
  filterInput.addEventListener('input', function(e) {
    const keyword = e.target.value;
    filterTable(keyword);
  });

  // 监听重置按钮点击
  resetBtn.addEventListener('click', function() {
    resetFilter();
  });

  // 页面加载完成后初始化
  window.addEventListener('load', function() {
    // 确保所有行可见
    rows.forEach(row => row.classList.remove('hidden-row'));
    // 如果输入框有值，触发筛选（例如浏览器自动填充）
    if (filterInput.value.trim() !== '') {
      filterTable(filterInput.value);
    }
  });

})();