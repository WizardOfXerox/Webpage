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
    const navLinks = document.querySelectorAll(".nav-link");
    console.log("Navigation links:", navLinks); // Debugging

    navLinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.getAttribute("data-target");
            console.log("Clicked link data-target:", target); // Debugging

            navLinks.forEach((link) => link.classList.remove("active"));
            this.classList.add("active");

            const sections = document.querySelectorAll(".section");
            console.log("Sections:", sections); // Debugging
            sections.forEach((section) => {
                section.classList.remove("active");
            });

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
            sections.forEach((section) => {
                section.classList.remove("active");
            });
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
            sections.forEach((section) => {
                section.classList.remove("active");
            });
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

//Sidebar
let isSidebarOpen = false;

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

// Function to handle the scroll event
function handleScroll() {
    const header = document.getElementById('header');
    const maincontent = document.getElementById('main-content');

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

// Handle hover state
const headerElement = document.getElementById('header');
const maincontent = document.getElementById('main-content');
headerElement.addEventListener('mouseover', () => {
    isHovered = true;
    // Ensure the header is in the visible state when hovered
    headerElement.style.transform = 'translateY(0px)';
    maincontent.style.paddingTop = '70px';
});

headerElement.addEventListener('mouseout', () => {
    isHovered = false;
    maincontent.style.paddingTop = '20px';
    // Reset to original state after hover
    header.style.transform = 'translateY(-48px)'
        // timeout = setTimeout(resetHeader, 2000);
});

// Check if the device width is less than or equal to 530px
if (window.matchMedia('(max-width: 600px) and (orientation: portrait)').matches) {
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