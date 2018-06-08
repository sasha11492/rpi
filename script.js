var form = document.getElementById("form");

form.addEventListener('submit', function () {
    var value = document.getElementById('search').value;

    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=' + value + '&type=video&key=AIzaSyAT8u7_Xlab7yG-ecrenJk6hs-bXKF2fWg')
        .then(function (response) {
            return response.json();
        })
        .then(function (content) {
            var list = document.querySelector(".list");
            if(document.querySelector(".video")){
                list.innerHTML = '';
            }
            content.items.forEach(function (video) {
                fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.id.videoId}&key=AIzaSyAT8u7_Xlab7yG-ecrenJk6hs-bXKF2fWg`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (content) {
                        var duration = content.items[0].contentDetails.duration;
                        var newLi = document.createElement('li');
                        newLi.className += "video";
                        newLi.innerHTML = `<a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                    <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                    </a>
                    <div class="title">${video.snippet.title}</div>
                    <div class="description">${video.snippet.description}</div>
                    <div class="duration">${convert_time(duration)}</div>
                    <div class="author">${video.snippet.channelTitle}</div>`;
                        list.appendChild(newLi);
                    });

            })
        })
        .catch(alert);
});

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    var date = new Date(null);
    date.setSeconds(duration)
    return date.toISOString().substr(11, 8)
}

var started = false;
var startCoordinates;
const ul = document.querySelector('.list');
ul.addEventListener('mousedown', handleStart);

ul.addEventListener('mousemove', handleMove);

ul.addEventListener('mouseup', handleEnd);
ul.addEventListener('mouseleave', handleEnd);

function handleStart(e) {
    e.preventDefault();
    if (!started) {
        startCoordinates = {
            x: e.pageX,
            y: e.pageY,
            scroll: ul.scrollLeft
        };
        started = true;
    }
}

function handleMove(e) {
    e.preventDefault();
    if (started) {
        var offset = startCoordinates.x - e.pageX;
        ul.scrollLeft = startCoordinates.scroll + offset;
    }
}

function handleEnd(e) {
    e.preventDefault();
    if (started) {
        started = false;
    }
}