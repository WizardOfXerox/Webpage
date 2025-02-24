// Calculator
function addition() {
    var add1 = parseFloat($("#add1").val());
    var add2 = parseFloat($("#add2").val());
    var result = add1 + add2;
    $("#result").html("Result: " + result);
}

function subtraction() {
    var sub1 = parseFloat($("#sub1").val());
    var sub2 = parseFloat($("#sub2").val());
    var result = sub1 - sub2;
    $("#result").html("Result: " + result);
}

function multiplication() {
    var mul1 = parseFloat($("#mul1").val());
    var mul2 = parseFloat($("#mul2").val());
    var result = mul1 * mul2;
    $("#result").html("Result: " + result);
}

function division() {
    var div1 = parseFloat($("#div1").val());
    var div2 = parseFloat($("#div2").val());
    if (div2 === 0) {
        $("#result").html("Error: Division by zero is not allowed");
    } else {
        var result = div1 / div2;
        $("#result").html("Result: " + result);
    }
}

function percentage() {
    var num = parseFloat($("#num").val());
    var percent = parseFloat($("#percent").val());
    var result = (num * percent) / 100;
    $("#result").html("Result: " + result);
}

// Navigations
$(document).ready(function() {
    // Navigation Links
    $(".nav-link, .nav-link-icon").on("click", function(event) {
        event.preventDefault();
        var target = $(this).data("target");
        $(".nav-link, .nav-link-icon").removeClass("active");
        $(this).addClass("active");

        $(".section").removeClass("active");
        $("#" + target).addClass("active");

        topFunction();
    });

    // Creation Nav Links
    $(".creation-nav-link-btn").on("click", function(event) {
        event.preventDefault();
        var target = $(this).data("target");
        $(".creation-nav-link-btn").removeClass("active");
        $(this).addClass("active");

        $(".section-c1").removeClass("active");
        $("#" + target).addClass("active");

        topFunction();
    });

    // Footer Nav Links
    $(".footer-nav a").on("click", function(event) {
        event.preventDefault();
        var target = $(this).data("target");
        $(".nav-link").removeClass("active");
        $(".section").removeClass("active");
        $("#" + target).addClass("active");

        var correspondingNavLink = $(".nav-link[data-target=" + target + "]");
        if (correspondingNavLink.length) {
            correspondingNavLink.addClass("active");
        }

        topFunction();
    });

    // Sidebar Toggle
    $("#sidebarToggle").on("click", function() {
        $(".nav-sidebar").toggleClass("close");
        $(".nav-sidebar").data("state", function(_, current) {
            return current === "closed" ? "opened" : "closed";
        });
    });

    // Pinned Navigation
    $(".nav-pin").on("click", function() {
        var isPinned = $("#header").attr("data-pinned") === "true";
        if (isPinned) {
            $("#header").removeClass("pinned").attr("data-pinned", "false");
            $("#pin").css({ "color": "#B3B3B3", "animation": "" });
        } else {
            $("#header").addClass("pinned").attr("data-pinned", "true");
            $("#pin").css({ "color": "#02ff88", "animation": "neon1 1.5s ease-in-out infinite alternate" });
        }
    });

    // Header Hover and Scroll
    let isHovered = false;
    let timeout = null;

    function resetHeader() {
        if (!isHovered) {
            $("#header").css("transform", "translateY(-48px)");
            $("#main-content").css("padding-top", "20px");
        }
    }

    $("#header").hover(
        function() {
            isHovered = true;
            $(this).css("transform", "translateY(0)");
            $("#main-content").css("padding-top", "70px");
        },
        function() {
            isHovered = false;
            if ($("#header").attr("data-pinned") === "false") {
                timeout = setTimeout(resetHeader, 2000);
            }
        }
    );

    if (window.matchMedia('(max-width: 600px)').matches) {
        $(window).on("scroll", function() {
            if ($("#header").attr("data-pinned") === "false") {
                if (window.scrollY < lastScrollY) {
                    $("#header").css("transform", "translateY(0)");
                    $("#main-content").css("padding-top", "70px");
                } else {
                    $("#header").css("transform", "translateY(-48px)");
                    $("#main-content").css("padding-top", "20px");
                }
                lastScrollY = window.scrollY;

                clearTimeout(timeout);
                timeout = setTimeout(resetHeader, 2000);
            }
        });
    }
});

function topFunction() {
    $("html, body").animate({ scrollTop: 0 }, "fast");
}