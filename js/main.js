


var field = $('[name="search"]'),
    list = $('.list'),
    audio = document.getElementById('track');

var getTracks  = function(q){
    return $.ajax({
        method: 'GET',
        url: 'https://freemusicarchive.org/api/trackSearch?q='+q+'&limit=20'
    })
};


function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function getData(){
    var el = $(this),
        value = $(this).val();

    getTracks(value).then(function(response){
        return JSON.parse(response).aRows;
    }).then(function(data){
        var ids = data.map(function(item){
            return item.slice(
                item.lastIndexOf('(')+1,
                item.lastIndexOf(')')
            )
        });

        var html = data.map(function(item, index){
            return $('<li data-id="'+ids[index]+'">'+item+'</li>');
            list.append(htm);
        });

        list.html(html);
    })
};

function getTrack(id){
    return $.ajax({
        method: 'GET', url:'http://freemusicarchive.org/services/track/single/'+id+'.json'
    });
}

var callback = debounce(getData, 500);

field.on('keyup', callback);

list.on('click', 'li', function(e){
    var id = $(this).attr('data-id');
    getTrack(id).then(function(response){
        return JSON.parse(response);
    }).then(function(data){
        audio.src = data.track_listen_url;
        audio.load();
        audio.play();
    })
});


