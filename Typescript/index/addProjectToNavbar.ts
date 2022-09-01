window.addEventListener("DOMContentLoaded", function () {
    let nav_bar: HTMLElement = document.getElementById("tapp_nav_items_menu_start");

    let new_button = document.createElement("div");
    new_button.classList.add("navbar-item");
    new_button.id ="tapp_nav_items_menu_start_first";
    new_button.innerHTML = `
                            <a id="tapp_nav_brand_items_menu_projects"
                            class="navbar-item has-text-black has-text-weight-medium is-size-5-desktop"
                            href="/projects">
                                Projects
                            </a>`;
    nav_bar.appendChild(new_button);
})