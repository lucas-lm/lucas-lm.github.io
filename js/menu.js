;(function () {
  const openMenu = () => {
    menuIcon.classList.add('hide')
    navMenu.classList.remove('hide-medium')
    navMenu.style.width = '240px'
    backdrop.style.display = 'block'
    document.body.style.overflow = 'hidden'
  }

  const closeMenu = () => {
    menuIcon.classList.remove('hide')
    navMenu.classList.add('hide-medium')
    navMenu.style.width = '0px'
    backdrop.style.display = 'none'
    document.body.removeAttribute('style')
  }

  const menuIcon = document.querySelector('#menu')
  const navMenu = document.querySelector('#nav-menu')
  const navLink = document.querySelectorAll('a.navlink')
  navLink.forEach((link) => link.addEventListener('click', closeMenu))
  const backdrop = document.querySelector('.backdrop')
  backdrop.addEventListener('click', closeMenu)
  menu.addEventListener('click', openMenu)
})()
