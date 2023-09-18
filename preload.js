const { contextBridge } = require("electron")

const { F1TelemetryClient, constants } = require('@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;

const client = new F1TelemetryClient({ port: 20777 });

function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { h: hours, m: minutes, s: seconds };
}

var carDots = {}

client.on(PACKETS.participants, data => {
    console.log(data)
})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    app: () => "0.0.1"
})

window.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById("playbackText")
    
    client.on(PACKETS.session, data => {
        var time = toHoursAndMinutes(data.m_sessionDuration - data.m_sessionTimeLeft)
        
        element.innerHTML = `${String(time.h).padStart(2,"0")}:${String(time.m).padStart(2,"0")}:${String(time.s).padStart(2,"0")}`
    });
})

client.start();