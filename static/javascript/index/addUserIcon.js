document.addEventListener('DOMContentLoaded', function () {
    let navbarEnd = document.getElementById('tapp_nav_items_menu_end');
    let firstChild = navbarEnd.firstElementChild;
    let userIcon = document.createElement('div');
    userIcon.setAttribute('id', 'tapp_nav_items_menu_end_user');
    userIcon.setAttribute('class', 'navbar-item');
    userIcon.innerHTML = `
        <a id="user_button" class="has-icons-left is-medium" href="/user">
            <i class="bi bi-person-circle"></i>
        </a>
    `;
    navbarEnd.insertBefore(userIcon, firstChild);
});
