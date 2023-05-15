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
  // Add previous button
  if (currentPage > 1) {
    var prevButton = document.createElement('button');
    prevButton.innerText = 'Prev';
    prevButton.addEventListener('click', function() {
      showPage(currentPage - 1);
    });
    pagination.appendChild(prevButton);
  }
  // Add page buttons
  var start = Math.max(currentPage - 1, 1);
  var end = Math.min(currentPage + 1, numberOfPages);
  for (var i = start; i <= end; i++) {
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
  // Add next button
  if (currentPage < numberOfPages) {
    var nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.addEventListener('click', function() {
      showPage(currentPage + 1);
    });
    pagination.appendChild(nextButton);
  }
}

showPage(1);
