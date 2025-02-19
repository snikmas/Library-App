const deleteButtons = Array.from(document.querySelectorAll('.delete'));
const markReadButtons = Array.from(document.querySelectorAll('.mark-read'));
const markUnreadButtons = Array.from(document.querySelectorAll('.mark-unread'))

markReadButtons.forEach(button => {
  button.addEventListener('click', markRead);
});

markUnreadButtons.forEach(button => {
  button.addEventListener('click', markUnread)
})

async function mark(endpoint, bookTitle){
  try {
    const result = await fetch(endpoint, {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title:bookTitle
      })
    });
    const data = await result.json();
    location.reload();
  } catch(err){
    console.error(`Error marking book: ${err}`);
  };
};

async function markRead() {
  let bookTitle = this.parentNode.textContent;
  bookTitle = bookTitle.trim().split(' by')[0];
  await mark('/markRead', bookTitle);
};

async function markUnread() {
  let bookTitle = this.parentNode.textContent;
  bookTitle = bookTitle.trim().split(' by ')[0];
  await mark('/markUnread', bookTitle)
}

deleteButtons.forEach(button => {
  button.addEventListener('click', deleteBook)
})

async function deleteBook() {
  try {
    console.log(`This func will delete your book`)
    let bookTitle = this.parentNode.textContent;
    bookTitle = bookTitle.trim().split(' by ')[0];

    const result = await fetch('/deleteBook', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: bookTitle
      })
    })
    
    const data = await result.json();
    console.log(data)
    location.reload();
  } catch(err){
    console.error(`Error deleting book: ${err}`)
  }
}