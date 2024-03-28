(function () {
    document
        .getElementById("add-expense")
        .addEventListener("click", function () {
            var formItem = document
                .getElementById("new-expense-form")
                .firstChild.cloneNode(true);
            document.getElementById("expense-list").prepend(formItem);
            formItem.querySelector("input[name=date]").value =
                new Date().toLocaleDateString("sv");
            htmx.process(formItem);
            formItem.querySelector("input").focus();
        });
})();
