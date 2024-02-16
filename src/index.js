document.addEventListener('DOMContentLoaded', () => {
  getAllQuotes()
  createQuotes()
})

const getAllQuotes = () => {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(res => res.json())
  .then(quotes => quotes.forEach(quote => displayQuote(quote)))
}

const displayQuote = text => {
  const li = document.createElement('li')
  li.className = 'quote-card'
  li.innerHTML = `
    <blockquote class='blockquote'>
      <p class='mb-0'>${text.quote}</p>
      <footer class='blockquote-footer'>${text.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  `
  li.querySelector('button.btn-success').addEventListener('click', e => handleLike(e, text))  
  li.querySelector('button.btn-danger').addEventListener('click', () => deleteQuote(li, text))
  
  document.querySelector('ul#quote-list').appendChild(li)
}

const createQuotes = () => {
  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    let quoteObj = {
      quote: e.target.quote.value,
      author: e.target.author.value
    }
    
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(quoteObj)
    }).then(res => res.json())
    .then(data => displayQuote(data))
  })
}

const deleteQuote = (element, text) => {
  element.remove()
  fetch(`http://localhost:3000/quotes/${text.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(quote => console.log('Deleted Quote:', quote))
}

const createLikes = num => {
  const currentDateInSeconds = Math.round(new Date() / 1000)
  let likesObj = {
    quoteId: num,
    createdAt: currentDateInSeconds
  }
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(likesObj)
  })
  .then(res => res.json())
  .then(data => console.log({...data, quoteId: +data.quoteId}))
}
 
const handleLike = (event, obj) => {
  let likesNum = +event.target.textContent.split(' ')[1]  
  event.target.textContent = 'Likes: ' + (likesNum + 1)
  createLikes(obj.id)
}