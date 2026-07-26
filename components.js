/* =========================================
   STUDYNEST REUSABLE WEBSITE COMPONENTS
   ========================================= */

class StudyNestHeader extends HTMLElement {
    connectedCallback() {
        const root = this.getAttribute("root") || "";

        this.innerHTML = `
            <div class="announcement">
                🚀 StudyNest is growing. New lessons and worksheets are added regularly.
            </div>

            <header>
                <div class="logo">
                    📚 <span>StudyNest</span>
                </div>

                <nav>
                    <a href="${root}index.html">🏠 Home</a>

                    <a href="${root}topics.html">
                        📘 Study by Topic
                    </a>

                    <a href="${root}levels.html">
                        🎓 Study by Level
                    </a>

                    <a href="${root}worksheets.html">
                        📝 Worksheets
                    </a>

                    <a href="${root}past-papers.html">
                        📂 Past Papers
                    </a>
                </nav>
            </header>
        `;

        this.highlightCurrentPage();
    }

    highlightCurrentPage() {
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        const links = this.querySelectorAll("nav a");

        links.forEach((link) => {
            const linkedPage =
                link.getAttribute("href").split("/").pop();

            if (linkedPage === currentPage) {
                link.classList.add("active-nav-link");
            }
        });
    }
}

class StudyNestFooter extends HTMLElement {
    connectedCallback() {
        const root = this.getAttribute("root") || "";

        this.innerHTML = `
            <button id="backToTop" aria-label="Return to the top">
                ⬆
            </button>

            <footer>
                <div class="footer-content">

                    <h2>📚 StudyNest</h2>

                    <p>
                        Helping students understand Mathematics,
                        not memorise it.
                    </p>

                    <div class="footer-links">
                        <a href="${root}index.html">Home</a>

                        <a href="${root}worksheets.html">
                            Worksheets
                        </a>

                        <a href="${root}past-papers.html">
                            Past Papers
                        </a>
                    </div>

                    <p class="copyright">
                        © 2026 StudyNest
                    </p>

                </div>
            </footer>
        `;

        this.setupBackToTop();
    }

    setupBackToTop() {
        const button = this.querySelector("#backToTop");

        if (!button) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        });

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

customElements.define("studynest-header", StudyNestHeader);
customElements.define("studynest-footer", StudyNestFooter);