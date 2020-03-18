(function() {
  const open = () => {
    myselfBlock.style.transform = 'translate(-50%, -50%) scale(1)'
    backdrop.style.display = 'block'
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    myselfBlock.style.transform = 'translate(-50%, -50%) scale(0) skew(30deg, 20deg)'
    backdrop.style.display = 'none'
    document.body.removeAttribute('style')
  }

  const backdrop = document.querySelector(".backdrop")
  const myselfBlock = document.querySelector("#myself")
  const myselfBio = document.querySelector("#my_bio")
  const myselfPicture = document.querySelector("#my_face")
  const closeButton = document.querySelector("#myself button.close")
  const myName = document.querySelector(".Iam")

  myName.addEventListener('click', open)
  backdrop.addEventListener('click', close)
  closeButton.addEventListener('click', close)

  fetch('https://api.github.com/users/lucas-lm')
    .then(response => response.json())
    .then(data => {
      const { avatar_url: avatarUrl, bio } = data
      myselfPicture.src = avatarUrl
      myselfBio.innerText = bio
    })
})()