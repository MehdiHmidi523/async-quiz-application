let localStorage
let nextLink
let interv
let i = 0
let sessionScore = 0
let packet
let serverCorrect

async function loadQuestion (url) {
  const Httpresponse = await fetch(url)
  const data = await Httpresponse.json()
  nextLink = data.nextURL
  console.log(data)
  serverCorrect = data
  document.querySelector('#question').innerHTML = serverCorrect.question
  if (serverCorrect.alternatives) {
    fetchAlternatives(data.alternatives)
  } else {
    noAlternatives()
  }
  ticktock(20) // start gam
}

function evaluatePlayer (answer) {
  clearInterval(interv) // he answered within time
  fetch(nextLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answer: answer })
  }).then(res => res.json())
    .then(data => {
      packet = data
      console.log(packet)
      if (!packet.nextURL) {
        if (packet.message === 'Wrong answer! :(') {
          clearInterval(interv)
          gameOver('Wrong answer!')
        } else {
          console.log('You WON!')
          displayTable()
        }
      } else {
        if (i === 1) {
          loadQuestion(data.nextURL)
          i--
        }
      }
    }).catch(error => { console.log(error) })
}

function hasLocal () { // to keep track of the sessionScores
  try {
    localStorage = window.localStorage
  } catch (e) {
    console.log('you have disabled LocalStorage please enable it to play Quiz')
  }
}

function ticktock (quota) {
  i++
  interv = setInterval(() => {
    document.querySelector('#timer').textContent = (--quota) + ' seconds left to answer'
    sessionScore++
    if (quota <= 0) {
      gameOver('Game Over Sport. Time is up!')
    }
  }, 1000)
}

function gameOver (text) {
  clearInterval(interv)
  let h3Tag = document.createElement('h3')
  let tmp = document.createTextNode(text)
  h3Tag.appendChild(tmp)
  let msg = document.querySelector('#override')
  msg.appendChild(h3Tag)
  console.log(text)
  document.querySelector('#game').style.display = 'none'
  let restart = document.createElement('Button')
  restart.appendChild(document.createTextNode('Retry?'))
  restart.addEventListener('click', () => {
    window.location.reload(true)
  })
  msg.appendChild(restart)
}

function fetchAlternatives (alternatives) {
  document.querySelector('.alternatives').style.display = 'initial'
  document.querySelector('#answer').style.display = 'none'
  document.querySelector('#sendBtn').style.display = 'none'
  let array = [alternatives.alt1, alternatives.alt2, alternatives.alt3, alternatives.alt4] // the alt4 is not nice
  document.querySelectorAll('.alternatives button').forEach((button, index) => {
    array[index] === undefined ? button.classList.add('hideThis') : button.classList.remove('hideThis')
    button.textContent = array[index]
  })
  document.querySelectorAll('.alternatives button').forEach(element => {
    element.addEventListener('click', event => {
      evaluatePlayer(event.target.id) // I don't have time to fix this callBack execution
    }, true)
  })
}

function noAlternatives () {
  document.querySelector('.alternatives').style.display = 'none'
  document.querySelector('#answer').style.display = 'initial'
  document.querySelector('#sendBtn').style.display = 'initial'
  console.log('noAlternatives')
}

function displayTable () {
  if (i === 1){

  
  if (hasLocal) {
    window.localStorage.setItem(JSON.stringify(sessionScore), document.querySelector('#nickname').value)
  }
  console.log(sessionScore)
  document.querySelector('#game').style.display = 'none'
  let h3Tag = document.createElement('h3')
  let tmp = document.createTextNode('Congrats you did good mate!')
  h3Tag.appendChild(tmp)
  let msg = document.querySelector('#override')
  msg.appendChild(h3Tag)
  for (let i = 0; i < window.localStorage.length; i++) { // O(N)
    let kVal = window.localStorage.key(i)
    let val = window.localStorage.getItem(kVal)
    if (sessionScore < kVal) {
      window.localStorage.removeItem(JSON.stringify(kVal), val)
      window.localStorage.setItem(JSON.stringify(sessionScore), document.querySelector('#nickname').value)
      window.localStorage.setItem(kVal, val)
    }
  }
  window.localStorage.setItem(JSON.stringify(sessionScore), document.querySelector('#nickname').value)
  if (window.localStorage.length > 5) {
    window.localStorage.removeItem(window.localStorage.key(window.localStorage.length - 1))
  }
  let ul = document.createElement('ul')
  for (let i = 0; i < window.localStorage.length; i++) {
    let li = document.createElement('li')
    let msg = window.localStorage.key(i)
    let val = window.localStorage.getItem(msg)
    let b = document.createTextNode('Score: ' + msg + ' Player : ' + val)
    li.appendChild(b)
    ul.appendChild(li)
  }
  document.querySelector('#override').appendChild(ul)
  i--
  gameOver('Play More?')
  }
}

export default { loadQuestion, evaluatePlayer }
