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
        easing: 'easeInOutQuad',
        begin: function(anim) {
            menuMoving = true
        },
        complete: function(anim) {
            menuMoving = false
        }
    })
})

// PLAYBACK

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

var currentTime = 0
var duration = 0

updatePlayback(currentTime)

$("#playback").on("click", (event) => {
    if (event.target.id=="playbackPin") {return}

    console.log(event)
    
    console.log(event.offsetX/$("#playback").width())

    updatePlayback(event.offsetX/$("#playback").width())
})

async function updatePlayback(percent) {
    timeTuple = await window.API.updatePlayback(percent)
    currentTime = timeTuple[0]
    duration = timeTuple[1]

    var realTime = fmtMSS(Math.round(currentTime))

    if (currentTime > duration*0.99) {
        realTime = "LIVE"
        currentTime = duration
        percent = 1
    }

    $("#playbackText").text(realTime);

    anime({
        targets: '#playbackPercentage',
        width: `${percent*100}%`,
        duration: 100,
        easing: 'easeInOutQuad',
    })
}
