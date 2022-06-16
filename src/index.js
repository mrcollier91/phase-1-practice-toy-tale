let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector('.add-toy-form')
  form.addEventListener('submit', addNewToy)
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
  
});

function getToys() {
  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(data => {
    const toyCollection = document.getElementById('toy-collection')
    toyCollection.innerHTML = ""
    data.forEach(toy => showToy(toy))
  })
}

function showToy(toy) {
  const toyCollection = document.getElementById('toy-collection')
  const div = document.createElement('div')
  div.classList.add('card')
  const h2 = document.createElement('h2')
  h2.textContent = toy.name
  const img = document.createElement('img')
  img.src = toy.image
  img.classList.add('toy-avatar')
  const p = document.createElement('p')
  p.textContent = `${toy.likes} likes`
  const button = document.createElement('button')
  button.classList.add('like-btn')
  button.textContent = 'like'
  button.id = toy.id
  button.addEventListener('click', (event) => {
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: toy.likes + 1
        }),
      })
      .then(resp => resp.json())
      .then(resp => {
        getToys();
      })
    })
  div.append(h2, img, p, button)
  toyCollection.append(div)
}

function addNewToy(event) {
  event.preventDefault()
  const [name, image] = event.target

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: name.value,
      image: image.value,
      likes: 0
    })
  })
  .then(resp => resp.json())
  .then(resp => showToy(resp))
  name.value = ""
  image.value = ""
}
