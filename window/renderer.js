// document.getElementById("versionTag").innerText = "v"+window.versions.app()

// MENU

var menuOpen = false
var menuMoving = false

anime({
    targets: '.menu',
    translateY: "calc(-22.5px - 150px + 300px)",
    duration: 0,
    easing: 'linear'
})

$("#menuButton").on("click", () => {
    if (menuMoving) {return}

    menuOpen = !menuOpen

    var translateY = "calc(-22.5px - 150px + 300px)"

    if (menuOpen) {
        translateY = "calc(-22.5px - 150px)"
    }

    anime({
        targets: '.menu',
        translateY: translateY,
        duration: 250,
        easing: 'easeOutQuad',
        begin: function(anim) {
            menuMoving = true
        },
        complete: function(anim) {
            menuMoving = false
        }
    })
})

$("#playback").on("click", (event) => {
    console.log(event)

    console.log(event.currentTarget)
})