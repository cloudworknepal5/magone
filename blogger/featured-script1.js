var numPosts = 3; 
var snippetLength = 600; 

function getNepaliDateTime(dateString) {
    var date = new Date(dateString);
    
    // Arrays for Nepali Translation
    var days = ["आइतवार", "सोमवार", "मङ्गलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"];
    var months = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
    
    var dayName = days[date.getDay()];
    var dayNum = date.getDate();
    var monthName = months[date.getMonth()];
    var year = date.getFullYear();
    
    // 24-Hour Format Logic
    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    // Add leading zero to hours and minutes if less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    var strTime = hours + ':' + minutes;
    
    return dayName + ", " + monthName + " " + dayNum + ", " + year + " | " + strTime;
}

function showFeatured(json) {
    var container = document.getElementById('featured-container');
    var html = '';
    
    if (!json.feed.entry) {
        container.innerHTML = "No posts found.";
        return;
    }

    for (var i = 0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        var title = entry.title.$t;
        var link = '';
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') { link = entry.link[k].href; break; }
        }
        
        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image.src.replace('/s113/', '/s100/');
        
        // Calling Updated DateTime function
        var dateTime = getNepaliDateTime(entry.published.$t);
        
        var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s1600/') : 'https://via.placeholder.com/1200x600';
        
        var content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, snippetLength) + '...';

        html += '<div class="fp-item">' +
            '<h1 class="fp-title">' + title + '</h1>' +
            '<div class="fp-meta">' +
                '<img class="fp-author-img" src="' + authorImg + '">' +
                '<span><b>' + authorName + '</b></span><span>|</span><span>' + dateTime + '</span>' +
            '</div>' +
            '<div class="fp-image-wrap"><a href="' + link + '"><img src="' + thumb + '"></a></div>' +
            '<div class="fp-snippet">' + snippet + '</div>' +
            '<a href="' + link + '" class="fp-readmore">थप पढ्नुहोस्</a>' +
        '</div>';
    }
    container.innerHTML = html;
}

document.write('<script src="/feeds/posts/default?alt=json-in-script&max-results=' + numPosts
