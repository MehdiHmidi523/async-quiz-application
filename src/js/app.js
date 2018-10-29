'use strict'
import worker from './handler.js'

document.querySelector('#game').style.display = 'none'

let bb1 = document.querySelector('#startBtn')

bb1.addEventListener('click', () => {
  if (document.querySelector('#nickname').value === '') {
    alert('please enter a username the assignment wants you to')
  } else {
    document.querySelector('#game').style.display = 'initial'
    document.querySelector('.alternatives').style.display = 'none'
    const name = document.querySelector('#nickname').value
    document.querySelector('#human').innerHTML = name
    document.querySelector('#intro').style.display = 'none'
    worker.loadQuestion('http://vhost3.lnu.se:20080/question/1')
    let startBtn = document.querySelector('#sendBtn')
    startBtn.addEventListener('click', () => {
      let answer = document.querySelector('#answer').value
      console.log(answer)
      worker.evaluatePlayer(answer)
    })
  }
})
