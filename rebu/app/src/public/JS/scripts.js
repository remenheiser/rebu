var request = new XMLHttpRequest()

request.open('GET', 'http://localhost:3000/spots', true)
request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)

  if (request.status >= 200 && request.status < 400) {
    data.forEach(Spot => {
      console.log(spot.title)
    })
  } else {
    console.log('error')
  }
}

request.send()