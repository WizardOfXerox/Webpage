let animationFrame;

function animate() {
    if (!document.hidden) {
        animationFrame = requestAnimationFrame(animate);
        console.log("Animating...");
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrame);
        console.log("Animation paused.");
    } else {
        animate();
    }
});

const video = document.querySelector("video");

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        video.pause();
    } else {
        video.play();
    }
});

animate(); // Start animation

document.addEventListener("DOMContentLoaded", () => {
    const iframes = document.querySelectorAll("iframe.lazy");

    const lazyLoadIframe = (iframe) => {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src; // Load actual page
            iframe.classList.remove("hidden"); // Make iframe visible
            delete iframe.dataset.src; // Prevent duplicate loading
        }
    };

    // Observe iframes and load when they enter viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoadIframe(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    iframes.forEach(iframe => observer.observe(iframe));
});

// Unload iframe when tab is hidden and restore when active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.querySelectorAll("iframe").forEach(iframe => {
            if (iframe.src) {
                iframe.dataset.src = iframe.src; // Store source temporarily
                iframe.src = ""; // Unload iframe
                iframe.classList.add("hidden"); // Hide it
            }
        });
    } else {
        document.querySelectorAll("iframe").forEach(iframe => {
            if (iframe.dataset.src) {
                iframe.src = iframe.dataset.src; // Restore iframe
                delete iframe.dataset.src;
                iframe.classList.remove("hidden"); // Show it
            }
        });
    }
});