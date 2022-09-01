document.addEventListener("DOMContentLoaded", function () {
    const nav_button_collection = document.getElementsByClassName("buttons");
    for (const key in nav_button_collection) {
        if (Object.prototype.hasOwnProperty.call(nav_button_collection, key)) {
            const element = nav_button_collection[key];
            element.remove();
        }
    }
    const log_out_button = document.createElement("a");
    log_out_button.classList.add("button", "is-black", "has-text-warning-light", "has-text-weight-medium");
    log_out_button.innerHTML = "Log Out";
    log_out_button.setAttribute("href", "/logout");
    const nav_bar_end_element = document.getElementById("tapp_nav_items_menu_end_buttons");
    nav_bar_end_element.appendChild(log_out_button);
});
