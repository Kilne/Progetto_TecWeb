document.addEventListener("DOMContentLoaded", function () {
    function open_modal(element) {
        element.classList.add("is-active");
    }
    function close_modal(element) {
        element.classList.remove("is-active");
    }
    (document.querySelectorAll(".js-modal-trigger") || []).forEach((element) => {
        if (element instanceof HTMLElement) {
            const modal = element.dataset.target;
            if (typeof modal === "string") {
                const target = document.getElementById(modal);
                element.addEventListener("click", (event) => {
                    event.preventDefault();
                    open_modal(target);
                });
            }
        }
    });
    (document.querySelectorAll(".modal-background, .modal-close") || []).forEach((element) => {
        if (element instanceof HTMLElement) {
            const target = element.closest(".modal");
            element.addEventListener("click", (event) => {
                event.preventDefault();
                close_modal(target);
            });
        }
    });
});
