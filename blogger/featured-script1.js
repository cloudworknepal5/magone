var numPosts = 3; 
var snippetLength = 600; 

// Function to convert English digits to Nepali digits
function toNepaliNum(num) {
    var dict = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
    return num.toString().replace(/[0123456789]/g, function(s) { return dict[s]; });
}

function getNepaliDateTime(dateString) {
    var date = new Date(dateString);
    var days = ["आइतवार", "सोमवार", "मङ्गलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"];
    var months = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
    
    var dayName = days[date.getDay()];
    var dayNum = toNepaliNum(date.getDate());
    var monthName = months[date.getMonth()];
    var year = toNepaliNum(date.getFullYear());
    
    // 24-hour format logic
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    var time = toNepaliNum(hours) + ":" + toNepaliNum(minutes);
    
    return dayName + ", " + monthName + " " + dayNum + ", " + year + " | समय: " + time;
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

// Fetching Recent Posts
document.write('<script src="/feeds/posts/default?alt=json-in-script&max-results=' + numPosts + '&callback=showFeatured"><\/script>');
