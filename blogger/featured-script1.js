var numPosts = 3; 
var snippetLength = 600; 

function toNepaliNum(num) {
    var dict = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
    return num.toString().replace(/[0123456789]/g, function(s) { return dict[s]; });
}

function getNepaliDateTime(dateString) {
    var date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    var days = ["आइतवार", "सोमवार", "मङ्गलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"];
    var months = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
    var dayName = days[date.getDay()];
    var dayNum = toNepaliNum(date.getDate());
    var monthName = months[date.getMonth()];
    var year = toNepaliNum(date.getFullYear());
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var hStr = hours < 10 ? '0' + hours : hours;
    var mStr = minutes < 10 ? '0' + minutes : minutes;
    var time = toNepaliNum(hStr) + ":" + toNepaliNum(mStr);
    return dayName + ", " + monthName + " " + dayNum + ", " + year + " | समय: " + time;
}

function showFeatured(json) {
    var container = document.getElementById('featured-container');
    var html = '';
    var entries = json.feed.entry;

    if (!entries) {
        container.innerHTML = "No posts found.";
        return;
    }

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = entry.title.$t;
        var postUrl = "";
        
        // Improved Link Detection
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                postUrl = entry.link[k].href;
                break;
            }
        }
        
        // If postUrl is still empty, try the first link
        if(postUrl === "") { postUrl = entry.link[0].href; }

        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image ? entry.author[0].gd$image.src.replace('/s113/', '/s100/') : 'https://via.placeholder.com/100';
        var nepaliDateLabel = getNepaliDateTime(entry.published.$t);
        var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s1600/') : 'https://via.placeholder.com/1200x600';
        var content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, snippetLength) + '...';

        // Structure with explicit <a> tags
        html += '<div class="fp-item">' +
            '<h1 class="fp-title"><a href="' + postUrl + '">' + title + '</a></h1>' +
            '<div class="fp-meta">' +
                '<img class="fp-author-img" src="' + authorImg + '">' +
                '<span><b>' + authorName + '</b></span><span>|</span><span>' + nepaliDateLabel + '</span>' +
            '</div>' +
            '<div class="fp-image-wrap"><a href="' + postUrl + '"><img src="' + thumb + '"></a></div>' +
            '<div class="fp-snippet">' + snippet + '</div>' +
            '<a href="' + postUrl + '" class="fp-readmore">थप पढ्नुहोस्</a>' +
        '</div>';
    }
    container.innerHTML = html;
}

document.write('<script src="/feeds/posts/default?alt=json-in-script&max-results=' + numPosts + '&callback=showFeatured"><\/script>');
