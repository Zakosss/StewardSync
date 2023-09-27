// document.getElementById("versionTag").innerText = "v"+window.versions.app()

var dev = true

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function padTo3Digits(num) {
    return num.toString().padEnd(3, '0');
}

function convertMsToSMS(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    //var secs = s % 60;
    var secs = s
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return secs + '.' + padTo3Digits(ms); //padTo2Digits(secs)
}


var leaderboardEntries = []

var teams = {
    0: {
        name: "Mercedes",
        colour: "#6CD3BF"
    },
    1: {
        name: "Ferrari",
        colour: "#F91536"
    },
    2: {
        name: "Red Bull Racing",
        colour: "#3671C6"
    },
    3: {
        name: "Williams",
        colour: "#37BEDD"
    },
    4: {
        name: "Aston Martin",
        colour: "#358C75"
    },
    5: {
        name: "Alpine",
        colour: "#2293D1"
    },
    6: {
        name: "Alpha Tauri",
        colour: "#5E8FAA"
    },
    7: {
        name: "Haas",
        colour: "#B6BABD"
    },
    8: {
        name: "McLaren",
        colour: "#F58020"
    },
    9: {
        name: "Alfa Romeo",
        colour: "#C92D4B"
    }
}

window.API.onParticipants((_event, value) => {
    var currentParticipants = value.m_participants

    for (let i = 0; i < value.m_numActiveCars; i++) {
        if (leaderboardEntries[i] == null) {
            document.querySelector(".overview_t1").innerHTML +=
            `
                <div id="driver${i}" class="driver">
                    <div id="driverColour">
                        <p id="position">#</p>
                    </div>
                    <p id="driverName"></p>
                    <p id="lapTime"></p>
                    <p id="gap"></p>
                    <p id="interval"></p>
                    <div id="sectors">
                        <p id="s1"></p>
                        <p id="s2"></p>
                        <p id="s3"></p>
                    </div>
                    <p id="positionChange"></p>
                    <p id="tyre">S</p>
                    <p id="pitAmount">0</p>
                </div>`
    
            leaderboardEntries[i] = document.getElementById("driver"+i)
        }
    }

    for (i in currentParticipants) {
        if (i >= value.m_numActiveCars) {
            continue
        }

        var curData = currentParticipants[i]
        var curEntry = leaderboardEntries[i]

        var currentTeam = teams[curData.m_teamId]
        
        document.querySelector(`#driver${i} #driverName`).innerHTML = curData.m_name
        document.querySelector(`#driver${i} #driverColour`).style.background = currentTeam.colour
    }

    $(".overview_t1").children().each((i,x) => {
        $(x).css("height",`calc(${1/$(".overview_t1").children().length*100}% - 5px)`)
        console.log(1/$(".overview_t1").children().length)
    })
})

var driverSectors = []
var fastestSectors = []

for (i=1; i <= 3; i++) {
    fastestSectors[i] = 10000000000000
}

var fastestDriverSectors = []

window.API.onLapData((_event, value) => {
    var lapDatas = value.m_lapData

    for (i in lapDatas) {
        var curData = lapDatas[i]

        // SECTORS

        var sectors = []

        sectors[1] = curData.m_sector1TimeInMS
        sectors[2] = curData.m_sector2TimeInMS

        if (driverSectors[i] == null) {
            driverSectors[i] = []
            fastestDriverSectors[i] = []
            for (x=1; x <= 3; x++) {
                fastestDriverSectors[i][x] = 10000000000000
            }
        }

        if (driverSectors[i][curData.m_currentLapNum] == null) {
            driverSectors[i][curData.m_currentLapNum] = []
        }

        sectors[3] = curData.m_lastLapTimeInMS - (curData.m_sector1TimeInMS + curData.m_sector2TimeInMS) // possible fix would be to use sector times from last lap duh
        
        if (driverSectors[i][curData.m_currentLapNum-1] != null) {
            driverSectors[i][curData.m_currentLapNum-1][3] = sectors[3]
        }

        sectors.forEach((sector,sectorIndex) => {
            if (sector <= 0) {
                
            } else {
                if (sectorIndex != 3) {
                    driverSectors[i][curData.m_currentLapNum][sectorIndex] = sector
                }
                console.log(sector,fastestDriverSectors[i][sectorIndex])
                if (sector < fastestDriverSectors[i][sectorIndex]) {
                    fastestDriverSectors[i][sectorIndex] = sector
                }
                if (sector < fastestSectors[sectorIndex]) {
                    fastestSectors[sectorIndex] = sector
                } 
            }
        })

        //console.log(fastestDriverSectors[i])

        if (sectors[1] != 0) {
            document.querySelector(`#driver${i} #s1`).innerHTML = convertMsToSMS(driverSectors[i][curData.m_currentLapNum][1])
            if (fastestDriverSectors[i][1] == driverSectors[i][curData.m_currentLapNum][1]) {
                document.querySelector(`#driver${i} #s1`).style.color = "yellowgreen"
                if (fastestSectors[1] == driverSectors[i][curData.m_currentLapNum][1]) {
                    document.querySelector(`#driver${i} #s1`).style.color = "violet"
                }
            } else {
                document.querySelector(`#driver${i} #s2`).style.color = null
            }
            if (sectors[2] != 0) {
                document.querySelector(`#driver${i} #s2`).innerHTML = convertMsToSMS(driverSectors[i][curData.m_currentLapNum][2])
                if (fastestDriverSectors[i][2] == driverSectors[i][curData.m_currentLapNum][2]) {
                    document.querySelector(`#driver${i} #s2`).style.color = "yellowgreen"
                    if (fastestSectors[2] == driverSectors[i][curData.m_currentLapNum][2]) {
                        document.querySelector(`#driver${i} #s2`).style.color = "violet"
                    }
                } else {
                    document.querySelector(`#driver${i} #s2`).style.color = null
                }
            } else {
                document.querySelector(`#driver${i} #s2`).innerHTML = ""
            }
            document.querySelector(`#driver${i} #s3`).innerHTML = ""
        } else {
            if (driverSectors[i][curData.m_currentLapNum-1] != null) {
                document.querySelector(`#driver${i} #s3`).innerHTML = convertMsToSMS(driverSectors[i][curData.m_currentLapNum-1][3])
                if (fastestDriverSectors[i][3] == driverSectors[i][curData.m_currentLapNum-1][3]) {
                    document.querySelector(`#driver${i} #s3`).style.color = "yellowgreen"
                    if (fastestSectors[3] == driverSectors[i][curData.m_currentLapNum-1][3]) {
                        document.querySelector(`#driver${i} #s3`).style.color = "violet"
                    }
                } else {
                    document.querySelector(`#driver${i} #s2`).style.color = null
                }
            }
        }

        // POSITION

        document.querySelector(`#driver${i} #position`).innerHTML = curData.m_carPosition
        var positionChange = curData.m_gridPosition - curData.m_carPosition
        if (positionChange >= 0) {
            positionChange = "+"+positionChange
        }
        document.querySelector(`#driver${i} #positionChange`).innerHTML = positionChange

        // DELTAS

        if (curData.m_deltaToRaceLeaderInMS == 0) {
            $(`#driver${i} #gap`).text("")
        $(`#driver${i} #interval`).text("")
        } else {
            $(`#driver${i} #gap`).text("+"+convertMsToSMS(curData.m_deltaToRaceLeaderInMS))
            $(`#driver${i} #interval`).text("+"+convertMsToSMS(curData.m_deltaToCarInFrontInMS))
        }

        $(`#driver${i}`).css("z-index",20-curData.m_carPosition)

        anime({
            targets: `#driver${i}`,
            translateY: ((curData.m_carPosition-1)*$(`#driver${i}`).height())+((curData.m_carPosition-1)*5),
            duration: 100,
            easing: 'linear',
        })
    }
})

// DISCLAIMER

if (dev) {
    $("#earlyDisclaimer").remove()
}

$("#acceptTerms").on("click", () => {
    if ($("#acceptTerms").is(":checked")) {
        anime({
            targets: '.container_terms .checkmark',
            opacity: 0,
            duration: 1000,
            easing: 'linear',
            begin: function(anim) {
                $("#earlyDisclaimer p").text("Thank you!")
            },
            complete: function(anim) {
                anime({
                    targets: '#earlyDisclaimer p',
                    duration: 2500,
                    easing: 'linear',
                    complete: function(anim) {
                        anime({
                            targets: '#earlyDisclaimer',
                            opacity: 0,
                            duration: 1000,
                            easing: 'linear',
                            complete: function(anim) {
                                $("#earlyDisclaimer").remove()
                            }
                        })
                    }
                })
            }
        })
    }
})

// TAB SYSTEM

tabs = {
    overview: {
        name: "OVERVIEW",
        elementCache: {}
    },
    analyse: {
        name: "ANALYSE",
        elementCache: {}
    },
    penalise: {
        name: "PENALISE",
        elementCache: {}
    }
}

var tabButtonJQ
var currentTab = tabs.overview

function updateTab(tabButtonJQRec){
    if (tabButtonJQ != undefined) {
        tabButtonJQ.css("border-color","var(--accent)")
        tabButtonJQ.css("border-size","5px")
        tabButtonJQ.css("border-style","none")
    }

    tabButtonJQ = tabButtonJQRec

    $("#tabName").text(currentTab.name)
    if (tabButtonJQ != undefined) {
        tabButtonJQ.css("border-color","var(--accent)")
        tabButtonJQ.css("border-size","5px")
        tabButtonJQ.css("border-style","solid")
    }
}

updateTab($(".menu div:first"))

// MENU

var menuOpen = false
var menuMoving = false

anime({
    targets: '.menu',
    translateY: "calc(-22.5px - 150px + 300px)",
    duration: 0,
    easing: 'linear'
})

function updateMenu(){
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
}

$("#menuButton").on("click", () => {
    if (menuMoving) {return}

    menuOpen = !menuOpen

    updateMenu()
})

$(".tab_button").on("click", (event) => {
    menuOpen = false

    updateMenu()

    var tabName = event.currentTarget.getAttribute("value")

    currentTab = tabs[tabName]
    updateTab($(event.currentTarget))
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
