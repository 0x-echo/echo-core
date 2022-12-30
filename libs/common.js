export function hashString(str) {
  var hash = 0,
    i,
    chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export function insertStyle(css, id) {
  if (document.querySelector(`#${id}`)) {
    return
  }
  const head = document.head
  const style = document.createElement('style')

  if (id) {
    style.id = id
  }

  head.appendChild(style)
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
}

export function appendMessageEl() {
  const id = 'echo-core-message'
  let $message = document.querySelector(`#${id}`)
  if (!$message) {
    $message = document.createElement('div')
    $message.id = id
    document.body.appendChild($message)
  }
  return $message
}

export function showMessage($message, type, text) {
  $message.className = ''
  $message.classList.add(`echo-${type}`)
  $message.innerHTML = text
  $message.style.display = 'block'
  setTimeout(() => {
    $message.style.display = 'none'
  }, 1500)
}
