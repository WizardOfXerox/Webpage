//Calculator
function addition() {
    var add1 = parseFloat(document.getElementById("add1").value);
    var add2 = parseFloat(document.getElementById("add2").value);
    var result = add1 + add2;
    document.getElementById("result").innerHTML = "Result: " + result;
}

function subtraction() {
    var sub1 = parseFloat(document.getElementById("sub1").value);
    var sub2 = parseFloat(document.getElementById("sub2").value);
    var result = sub1 - sub2;
    document.getElementById("result").innerHTML = "Result: " + result;
}

function multiplication() {
    var mul1 = parseFloat(document.getElementById("mul1").value);
    var mul2 = parseFloat(document.getElementById("mul2").value);
    var result = mul1 * mul2;
    document.getElementById("result").innerHTML = "Result: " + result;
}

function division() {
    var div1 = parseFloat(document.getElementById("div1").value);
    var div2 = parseFloat(document.getElementById("div2").value);
    if (div2 === 0) {
        document.getElementById("result").innerHTML = "Error: Division by zero is not allowed";
    } else {
        var result = div1 / div2;
        document.getElementById("result").innerHTML = "Result: " + result;
    }
}

function percentage() {
    var num = parseFloat(document.getElementById("num").value);
    var percent = parseFloat(document.getElementById("percent").value);
    var result = (num * percent) / 100;
    document.getElementById("result").innerHTML = "Result: " + result;
}

//Navigations

document.addEventListener("DOMContentLoaded", function() {
    // Query all relevant elements
    const navLinks = document.querySelectorAll(".nav-link, .nav-link-icon");

    // Debugging: Log all nav links
    console.log("Navigation links:", navLinks);

    navLinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.getAttribute("data-target");

            // Debugging: Log clicked link's data-target
            console.log("Clicked link data-target:", target);

            // Remove 'active' class from all nav links
            navLinks.forEach((link) => link.classList.remove("active"));

            // Add 'active' class to the clicked link
            this.classList.add("active");

            // Remove 'active' class from all sections
            const sections = document.querySelectorAll(".section");
            console.log("Sections:", sections); // Debugging
            sections.forEach((section) => section.classList.remove("active"));

            // Add 'active' class to the target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add("active");
                console.log("Showing section:", target); // Debugging
            } else {
                console.error("Target section not found:", target); // Debugging
            }

            topFunction();
        });
    });
});



document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".creation-nav-link-btn");
    navLinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.getAttribute("data-target");
            navLinks.forEach((link) => link.classList.remove("active"));
            this.classList.add("active");
            const sections = document.querySelectorAll(".section-c1");
            sections.forEach((section) => section.classList.remove("active"));
            document.getElementById(target).classList.add("active");
            topFunction();
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const footerNavLinks = document.querySelectorAll(".footer-nav a");
    footerNavLinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.getAttribute("data-target");
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach((link) => {
                link.classList.remove("active");
            });
            const sections = document.querySelectorAll(".section");
            sections.forEach((section) => section.classList.remove("active"));
            document.getElementById(target).classList.add("active");

            // Add active class to the corresponding.nav-link element
            const correspondingNavLink = document.querySelector(`.nav-link[data-target="${target}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add("active");
            }

            topFunction();
        });
    });
});

document.addEventListener("keydown", (event) => {
    const navLinks = document.querySelectorAll(".nav-link"); // Get NodeList directly
    const filteredNavLinks = Array.prototype.filter.call(navLinks, link => {
        return link.getAttribute("data-target") !== "admin";
    });

    let activeIndex = -1;

    // Find the currently active link among the filtered links
    filteredNavLinks.forEach((link, index) => {
        if (link.classList.contains("active")) {
            activeIndex = index;
        }
    });

    if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent default behavior

        if (activeIndex > 0) { // If there is a previous link in the filtered list
            const previousIndex = activeIndex - 1; // Index of the previous link

            // Remove the active class from the current active link
            filteredNavLinks[activeIndex].classList.remove("active");

            // Add the active class to the previous link
            filteredNavLinks[previousIndex].classList.add("active");

            // Get the target section from the previous link
            const target = filteredNavLinks[previousIndex].getAttribute("data-target");

            // Remove active class from all sections
            const sections = document.querySelectorAll(".section");
            sections.forEach((section) => section.classList.remove("active"));

            // Add active class to the target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add("active");
                console.log("Showing section:", target); // Debugging
            } else {
                console.error("Target section not found:", target); // Debugging
            }

            console.log("Active Index:", activeIndex);
            console.log("Filtered Nav Links Length:", filteredNavLinks.length);

            topFunction(); // Call custom function
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent default behavior

        if (activeIndex !== -1 && activeIndex < filteredNavLinks.length - 1) { // If there is a next link in the filtered list
            const nextIndex = activeIndex + 1; // Index of the next link

            // Remove the active class from the current active link
            filteredNavLinks[activeIndex].classList.remove("active");

            // Add the active class to the next link
            filteredNavLinks[nextIndex].classList.add("active");

            // Get the target section from the next link
            const target = filteredNavLinks[nextIndex].getAttribute("data-target");

            // Remove active class from all sections
            const sections = document.querySelectorAll(".section");
            sections.forEach((section) => section.classList.remove("active"));

            // Add active class to the target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add("active");
                console.log("Showing section:", target); // Debugging
            } else {
                console.error("Target section not found:", target); // Debugging
            }

            console.log("Active Index:", activeIndex);
            console.log("Filtered Nav Links Length:", filteredNavLinks.length);
            console.log("Next Index:", nextIndex);

            topFunction(); // Call custom function
        }
    }
});


//Sidebar
const body = document.querySelector("body"),
    sidebar = body.querySelector(".nav-sidebar"),
    sidebarToggle = document.getElementById("sidebarToggle");

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.dataset.state === "closed") {
        sidebar.dataset.state = "opened";
    } else {
        sidebar.dataset.state = "closed";
    }
});

/* let isSidebarOpen = false;

function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const content = document.querySelector(".main-content");
    const button = document.getElementById("sidebarToggle");

    if (isSidebarOpen) {
        sidebar.style.transform = "translateX(-250px)";
        content.style.marginLeft = "0px";
        button.textContent = "☰ Open Sidebar";
    } else {
        sidebar.style.transform = "translateX(0)";
        content.style.marginLeft = "220px";
        button.textContent = "✖ Close Sidebar";
    }

    isSidebarOpen = !isSidebarOpen;
}
    */

let lastScrollY = window.scrollY;
let timeout = null;
let isHovered = false; // Track hover state

// Function to reset the header after inactivity
function resetHeader() {
    if (!isHovered) {
        const header = document.getElementById('header');
        const maincontent = document.getElementById('main-content');
        header.style.transform = 'translateY(-48px)';
        maincontent.style.paddingTop = '20px';
    }
}

// Pinned Navigation
const headerElement = document.getElementById('header');
document.querySelector('.nav-pin').addEventListener('click', function() {
    const isPinned = headerElement.getAttribute('data-pinned'); // Check data-pinheaderElementned on the 
    const navpin = document.getElementById("pin");
    if (isPinned === 'true') {
        headerElement.classList.remove('pinned');
        headerElement.setAttribute('data-pinned', 'false'); // Set data-pinned to false
        navpin.style.color = '#B3B3B3';
    }
    if (isPinned === 'false') {
        headerElement.classList.add('pinned');
        headerElement.setAttribute('data-pinned', 'true'); // Set data-pinned to true
        navpin.style.color = '#02ff88';
        navpin.style.animation = 'neon1 1.5s ease-in-out infinite alternate';
        navpin.style.animationPlayState = 'running';
    }
});

const maincontent = document.getElementById('main-content');
headerElement.addEventListener('mouseover', () => {
    isHovered = true;
    // Ensure the header is in the visible state when hovered
    headerElement.style.transform = 'translateY(0px)';
    maincontent.style.paddingTop = '70px';
});

headerElement.addEventListener('mouseout', () => {
    const isPinned = headerElement.getAttribute('data-pinned'); // Check data-pinheaderElementned on the
    if (isPinned === 'true') {
        isHovered = true;
        // Ensure the header is in the visible state when hovered
        headerElement.style.transform = 'translateY(0px)';
        maincontent.style.paddingTop = '70px';

    }
    if (isPinned === 'false') {
        isHovered = false;
        //maincontent.style.paddingTop = '20px';
        //header.style.transform = 'translateY(-48px)'
        // Reset to original state after hover
        timeout = setTimeout(resetHeader, 2000);
    }
});

// Function to handle the scroll event
function handleScroll() {
    const header = document.getElementById('header');
    const maincontent = document.getElementById('main-content');
    const isPinned = headerElement.getAttribute('data-pinned'); // Check data-pinheaderElementned on the
    if (isPinned === 'false') {
        isHovered = true;
        // Ensure the header is in the visible state when hovered
        headerElement.style.transform = 'translateY(0px)';
        maincontent.style.paddingTop = '70px';
    }
    if (isPinned === 'false') {
        isHovered = false;
        if (window.scrollY < lastScrollY) {
            // Scrolling up
            header.style.transform = 'translateY(0px)';
            maincontent.style.paddingTop = '70px';
        } else {
            // Scrolling down
            header.style.transform = 'translateY(-48px)';
            maincontent.style.paddingTop = '20px';
        }

        lastScrollY = window.scrollY;

        // Clear any previous timeout and set a new one
        if (timeout) {
            clearTimeout(timeout);
        }

        // Set a timeout to reset the header after 2 seconds of inactivity
        timeout = setTimeout(resetHeader, 2000);
    }
}

// Check if the device width is less than or equal to 530px
if (window.matchMedia('(max-width: 600px)').matches) {
    window.addEventListener('scroll', handleScroll);
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// SVG-Favicon
// Use SVG image to be a Favicon

function TitleIcon() {
    // document.title = 'Hidden Content';
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7.2" fill="red" stroke="#000" stroke-width="1" />
      <circle cx="8" cy="8" r="3.1" fill="#fff" stroke="#000" stroke-width="1" />
    </svg>
    `;

    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = svgToDataUri(svg);
    favicon_link_html.type = 'image/svg+xml';

    try {
        let favicons = document.querySelectorAll('link[rel~="icon"]');
        favicons.forEach(function(favicon) {
            favicon.parentNode.removeChild(favicon);
        });

        const head = document.getElementsByTagName('head')[0];
        head.insertBefore(favicon_link_html, head.firstChild);
    } catch (e) {}

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function svgToDataUri(svg) {
        var encoded = svg.replace(/\s+/g, " ")
        encoded = replaceAll(encoded, "%", "%25");
        encoded = replaceAll(encoded, "> <", "><");
        encoded = replaceAll(encoded, "; }", ";}");
        encoded = replaceAll(encoded, "<", "%3c");
        encoded = replaceAll(encoded, ">", "%3e");
        encoded = replaceAll(encoded, "\"", "'");
        encoded = replaceAll(encoded, "#", "%23");
        encoded = replaceAll(encoded, "{", "%7b");
        encoded = replaceAll(encoded, "}", "%7d");
        encoded = replaceAll(encoded, "|", "%7c");
        encoded = replaceAll(encoded, "^", "%5e");
        encoded = replaceAll(encoded, "`", "%60");
        encoded = replaceAll(encoded, "@", "%40");
        var dataUri = 'data:image/svg+xml;charset=UTF-8,' + encoded.trim();
        return dataUri;
    }
};

TitleIcon();

// Text-Favicon
// Use Text or Emoji as Favicon

function changeFavicon(text) {
    const canvas = document.createElement('canvas');
    canvas.height = 64;
    canvas.width = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '64px serif';
    ctx.fillText(text, 0, 64);

    const link = document.createElement('link');
    const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
    oldLinks.forEach(e => e.parentNode.removeChild(e));
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
}

//changeFavicon('❤️');

// Link-Favicon
// Change the Favicon Using other websites Favicon

const changeFavicon1 = link => {
    let $favicon = document.querySelector('link[rel="icon"]')
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
    if ($favicon !== null) {
        $favicon.href = link
            // Otherwise, create a new element and append it to <head>.
    } else {
        $favicon = document.createElement("link")
        $favicon.rel = "icon"
        $favicon.href = link
        document.head.appendChild($favicon)
    }
}

//changeFavicon1("http://www.stackoverflow.com/favicon.ico")


//Cards Not Updated

/* window.addEventListener("resize", function() {
    adjustCardLayout();
});

function adjustCardLayout() {
    const cardContainers = document.querySelectorAll(".card-container");
    cardContainers.forEach((container) => {
        const cards = container.querySelectorAll(".card, .card-solo");
        const containerWidth = container.offsetWidth;

        const cardsPerRow = Math.floor(containerWidth / 320);
        const flexBasisValue = `calc(${100 / cardsPerRow}% - 20px)`;

        cards.forEach((card) => {
            card.style.flexBasis = flexBasisValue;
        });
    });
}

window.onload = function() {
    adjustCardLayout();
}; */

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        fetch("/user-inactive", { method: "POST" });
    } else {
        fetch("/user-active", { method: "POST" });
    }
});