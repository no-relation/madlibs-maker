// stol- ahem, borrowed from https://glitch.com/~karaoke-js

const dates = new Array(); // Lyrics timing
let startSeconds; // Start time
let linesCount; // Number of Lyric lines

function karaoke() {
  const xhttp = new XMLHttpRequest(); // Load lyrics
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const text = xhttp.responseText;
      const lines = text.split("\n");
      linesCount = lines.length;
      for (i = 0; i < lines.length; i++) {
        if (lines[i] != "") {
          const text = lines[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
          const timing = lines[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
          const time = timing.split(":");
          const date = new Date();
          date.setMinutes(time[0]);
          const subTime = time[1].split(".");
          date.setSeconds(subTime[0]);
          date.setMilliseconds(subTime[1] * 10);
          dates[i] = date;
          let style;
          i == 0 ? (style = "highlight") : (style = "plain");
          document.getElementById("lyrics").innerHTML +=
            '<div class="' + style + '" id="' + i + '">' + text + "</div>"; // Add lyric to page
        }
      }
    }
  };
  // get more lrc files at https://www.lyricsify.com/ or https://lrclib.net/ (TODO: implement lrclib to auto-populate lyrics)
  xhttp.open("GET", "lyrics.lrc", true);
  xhttp.send();
}

function start() {
  document.getElementById("player").controls = false;
  startSeconds = new Date().getTime(); // Song just started
  const nextTime =
    dates[0].getMinutes() * 60000 +
    dates[0].getSeconds() * 1000 +
    dates[0].getMilliseconds();
  setTimeout(function () {
    update(0, linesCount);
  }, nextTime); // Schedule first lyric update
}

function update(current, last) {
  document.getElementById(current).className = "highlight"; // Update current lyric style
  if (current != 0) {
    document.getElementById(current - 1).className = "plain"; // Update previous lyric style
  }
  if (current++ < last) {
    const currentSeconds = new Date().getTime();
    const passedSeconds = currentSeconds - startSeconds;
    const nextTime =
      dates[current].getMinutes() * 60000 +
      dates[current].getSeconds() * 1000 +
      dates[current].getMilliseconds() -
      passedSeconds;
    setTimeout(function () {
      update(current, last);
    }, nextTime); // Schedule next lyric update
  }
}
