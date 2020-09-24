const options = {
  rootMargin: '-40% 0% -60% 0%',
  // current ff-esr needs -39.5% margin to respond.
  // reported solved in ff-release: https://bugzilla.mozilla.org/show_bug.cgi?id=1553673
  threshold: 0.0
}

let routePath = '/'
getRoute = (route) => {
  routePath = route
}

const observerCallback = (entries) => {
  currentObserverEntries = entries
  entries.forEach(entry => {
    const targetId = entry.target.getAttribute('id')

    if (entry.isIntersecting === true) {
      currentSlug = targetId
      if(titleView === true) {
        document.getElementById(`sidebar_${targetId}`).classList.add('selected-title')
      }
      else {
        pullMetadata()
      }
    } else if (titleView === true) {
      document.getElementById(`sidebar_${targetId}`).classList.remove('selected-title') 
    }
  }
  )
}
let currentSlug = null

const observer = new IntersectionObserver(observerCallback, options)
window.onload = () => { // waits for the page to load. Investigate async/defer.
  const targets = document.querySelectorAll('.article')
  targets.forEach(target => {
    observer.observe(target)
  })
}

let titleView = true

const displayTitles = (pageTitles) => {
  titleView= true
  document.getElementById('sidebar-content').innerHTML = pageTitles
  document.getElementById(`sidebar_${currentSlug}`).classList.add('selected-title')
}

const pullMetadata = () => {
// what is preventDefault about?
  fetch(routePath,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentSlug)
    })
    .then(parseJSON)
    .then(displaySemantics)
}

const parseJSON = (response) => response.json()

const displaySemantics = (data) => {
  titleView = false
  document.getElementById('sidebar-content').innerHTML = JSON.stringify(data, null, 2)
}