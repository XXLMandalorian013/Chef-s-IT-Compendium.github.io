var list = document.getElementById('myList');
var pagination = document.getElementById('pagination');
var itemsPerPage = 3;
var currentPage = 1;
var numberOfPages = Math.ceil(list.children.length / itemsPerPage);

function showPage(page) {
  currentPage = page;
  var start = (page - 1) * itemsPerPage;
  var end = start + itemsPerPage;
  for (var i = 0; i < list.children.length; i++) {
    if (i >= start && i < end) {
      list.children[i].style.display = 'block';
    } else {
      list.children[i].style.display = 'none';
    }
  }
  showPagination();
}

function showPagination() {
  pagination.innerHTML = '';
  for (var i = 1; i <= numberOfPages; i++) {
    var button = document.createElement('button');
    button.innerText = i;
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.addEventListener('click', function() {
      showPage(parseInt(this.innerText));
    });
    pagination.appendChild(button);
  }
}

showPage(1);