# MadLibs Maker

Input text, create a prompt list, fill in the blanks, read the monstrosity you've created.

Created for use in MadLib Karaoke in [Station Theater](https://www.stationtheater.com/)'s ['80s Kids](https://www.80skidscomedy.com/)'s variety shows.

See this in action [here](https://no-relation.github.io/madlibs-maker/).

## Special Thanks

- [This site](https://blog.logrocket.com/deploying-react-apps-github-pages/#how-to-deploy-react-application-github-pages) was invaluable in figuring out how to deploy with GitHub Pages.

- Life was made easier by:
    - [clrc](https://www.npmjs.com/package/clrc), for parsing of LRC files
    - [hh-mm-ss](https://www.npmjs.com/package/hh-mm-ss), for parsing of time strings

### TODO list
(as of 12/29/2024)

1. highlighting for story playback
1. autoscrolling for story playback
1. make it backwards compatible for plain txt files
1. file uploads: LRC + MP3 files
1. build an API for it (prerequisite for previous?)