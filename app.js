const hamburger = document.querySelector('.hamburger')
const nav = document.querySelector('nav')

// ARRAY FOR LOCAL STORAGE
let links;
hamburger.addEventListener('click', () => {
 nav.classList.toggle('nav-active')
})

// FORM VALIDATION
const form = document.querySelector('form')
const inputField = document.querySelector('.input')
const field = document.querySelector('.field')
// FORM SUBMIT
form.addEventListener('submit', (e) => {
 const errMsg = document.createElement('p')
 e.preventDefault()
 if (inputField.value === ""){
  inputField.className = "input empty"
  errMsg.innerText = `Please add a link`
  errMsg.classList.add('please-fill')
  if (field.children.length === 2){
   return
  } else {
   field.appendChild(errMsg)
   setTimeout(() => {
    errMsg.remove()
    inputField.className = `input`
   }, 3000);
  }
 } else {
  // IF INPUT IS NOT EMPTY
  inputField.className = "input"
   inputField.disabled = true
   createShortUrl(errMsg)
 }
})
inputField.addEventListener('keyup', ()=>{
 inputField.className = "input"
 if(field.children.length === 2){
  field.children[1].remove()
 } else {
  return
 }
})
// CREATING A SHORT URL

const urlContainer = document.querySelector('.url-container')

   const test = document.createElement('p')
   test.innerText = `alsjhdakljdhaksjdhakwjhd`

const createShortUrl = async (errMsg) => {
 const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputField.value}`)
 const data = await res.json()
//  console.log(data)
 try {
  if (!data.ok){
   inputField.disabled = false
    inputField.value = ""
   errMsg.innerText = `Please enter a valid link`
   errMsg.classList.add('please-fill')
   inputField.className = "input empty"
   field.appendChild(errMsg)
   setTimeout(() => {
    errMsg.remove()
    inputField.className = `input`
   }, 3000);
  } else {
   inputField.disabled = false
    inputField.value = ""
   const card = document.createElement('div')
   card.innerHTML = `<p class="long-url"><a href="${data.result.original_link}" target="_blank">${data.result.original_link}</a></p>
    <hr>
    <p class="short-url"><a href="${data.result.full_short_link2}" target="_blank">${data.result.short_link2}</a></p>
    <button class="copy-btn">Copy</button>`
    card.className = "card"
    urlContainer.appendChild(card)

   if (localStorage.getItem('links') === null){
      links = []
   } else {
      links = JSON.parse(localStorage.getItem('links'))
   }
   links.push(data.result.code)
   localStorage.setItem('links', JSON.stringify(links))
 }
} catch (err) {
 console.log(err)
}
}
// COPY SHORT URL TO CLIPBOARD
urlContainer.addEventListener('click', (e) => {
 if (e.target.classList.contains('copy-btn')){
  e.target.classList.add('copied')
  e.target.innerText = `Copied!`
  setTimeout(() => {
   e.target.classList.remove(`copied`)
   e.target.innerText = `Copy`
  }, 10000);
  const shortUrl = e.target.previousElementSibling.children[0].innerText
  const hidden = document.querySelector('.hidden')
  hidden.value = shortUrl
  hidden.select()
  document.execCommand('copy')
 }
})

// GETTING LOCALLY STORED LINKS 
const loadingLinks =  async(links) =>{
   links.forEach(async (link) => {
      const res = await fetch(`https://api.shrtco.de/v2/info?code=${link}`)
      const data = await res.json()
      console.log(data)
      try {
         const card = document.createElement('div')
         card.innerHTML = `<p class="long-url"><a href="${data.result.url}" target="_blank">${data.result.url}</a></p>
         <hr>
         <p class="short-url"><a href="9qr.de/${data.result.code}" target="_blank">9qr.de/${data.result.code}</a></p>
         <button class="copy-btn">Copy</button>`
         card.className = "card"
         urlContainer.appendChild(card)

      } catch (err) {
         
      }
   })
}

document.addEventListener('DOMContentLoaded', () => {
   if (localStorage.getItem(`links`) === null){
      links = []
   } else {
      links = JSON.parse(localStorage.getItem(`links`))
   }
   loadingLinks(links)
   localStorage.setItem(`links`, JSON.stringify(links))
})
