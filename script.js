const searchInput = document.getElementById("searchInput");
const backToTop = document.getElementById("backToTop");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const topicSidebar = document.getElementById("topicSidebar");

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.toLowerCase().trim();

            const algebraKeywords = [
                "algebra",
                "expression",
                "expressions",
                "equation",
                "equations",
                "factorisation",
                "factorization",
                "factorise",
                "factorize",
                "variables",
                "variable",
                "inequality",
                "inequalities"
            ];

            const foundAlgebra = algebraKeywords.some(function (word) {
                return searchTerm.includes(word);
            });

            if (foundAlgebra) {
                window.location.href = "topics/algebra.html";
            } else {
                alert("This topic is coming soon.");
            }
        }
    });
}

if (backToTop) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

if (mobileMenuBtn && topicSidebar) {
    mobileMenuBtn.addEventListener("click", function () {
        topicSidebar.classList.toggle("show");
    });
}