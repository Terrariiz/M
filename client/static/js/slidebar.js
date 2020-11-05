(function() {
  var menuEl = document.getElementById('ml-menu');

  // mobile menu toggle
  var openMenuCtrl = document.querySelector('.action--open'),
      closeMenuCtrl = document.querySelector('.action--close');

    if(openMenuCtrl){
    openMenuCtrl.addEventListener('click', openMenu);
    }

    if(closeMenuCtrl){
    closeMenuCtrl.addEventListener('click', closeMenu);
    }

    function openMenu() {
        classie.add(menuEl, 'menu--open');
        closeMenuCtrl.focus();
    }

    function closeMenu() {
        classie.remove(menuEl, 'menu--open');
        openMenuCtrl.focus();
    }
})();