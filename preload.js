const { contextBridge, ipcRenderer } = require("electron")

function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { h: hours, m: minutes, s: seconds };
}

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    app: () => "0.0.1"
})

contextBridge.exposeInMainWorld('API', {
    updatePlayback: (percent) => ipcRenderer.invoke("playback:update", percent),
    onParticipants: (callback) => ipcRenderer.on('participants',callback),
    onLapData: (callback) => ipcRenderer.on('lapData',callback)
})

window.addEventListener('DOMContentLoaded', () => {
    /*
    const element = document.getElementById("playbackText")
    
    client.on(PACKETS.session, data => {
        var time = toHoursAndMinutes(data.m_sessionDuration - data.m_sessionTimeLeft)
        
        element.innerHTML = `${String(time.h).padStart(2,"0")}:${String(time.m).padStart(2,"0")}:${String(time.s).padStart(2,"0")}`
    });
    */
})