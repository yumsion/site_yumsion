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

  // 将分类单元格转换为按钮样式
  function convertCategoriesToButtons() {
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      
      const categoryCell = cells[1];
      const categoryText = categoryCell.textContent.trim();
      
      // 清空单元格内容
      categoryCell.innerHTML = '';
      
      // 创建按钮元素
      const button = document.createElement('span');
      button.className = 'category-tag';
      button.textContent = categoryText;
      button.setAttribute('data-category', categoryText);
      
      // 添加点击事件
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.textContent.trim();
        // 设置筛选框的值
        filterInput.value = category;
        // 触发筛选
        filterTable(category);
        // 给输入框添加高亮反馈
        filterInput.style.borderColor = '#5b7cfa';
        filterInput.style.boxShadow = '0 0 0 4px rgba(91, 124, 250, 0.2)';
        setTimeout(() => {
          filterInput.style.borderColor = '';
          filterInput.style.boxShadow = '';
        }, 800);
      });
      
      // 添加键盘支持 (辅助功能)
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
    // 先转换分类为按钮
    convertCategoriesToButtons();
    
    // 确保所有行可见
    rows.forEach(row => row.classList.remove('hidden-row'));
    
    // 如果输入框有值，触发筛选（例如浏览器自动填充）
    if (filterInput.value.trim() !== '') {
      filterTable(filterInput.value);
    }
  });

})();