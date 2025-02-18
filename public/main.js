const deleteButtons = Array.from(document.querySelectorAll('.delete'));

deleteButtons.forEach(button => {
  button.addEventListener('clicl', deleteBook)
})

function deleteBook() {
  console.log(`This func will delete your book`)
  let bookTitle = this.parentNode.textContent;

  bookTitle = bookTitle.trim().split(' by ')[0];
}