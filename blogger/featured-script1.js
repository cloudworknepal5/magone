var numPosts = 3; 
var snippetLength = 100; 

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
        
        // Find Post URL
        var postUrl = "";
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                postUrl = entry.link[k].href;
                break;
            }
        }
        
        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image ? entry.author[0].gd$image.src : 'https://via.placeholder.com/100';
        var pubDate = new Date(entry.published.$t);
        var dateString = pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s1600/') : 'https://via.placeholder.com/1200x600';
        var content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, snippetLength) + '...';

        html += '<div class="fp-item">' +
            '<h1 class="fp-title"><a href="' + postUrl + '">' + title + '</a></h1>' +
            '<div class="fp-meta">' +
                '<img class="fp-author-img" src="' + authorImg + '">' +
                '<span><b>' + authorName + '</b></span><span>|</span>' +
                '<span class="fp-date">' + dateString + '</span>' +
            '</div>' +
            '<div class="fp-image-wrap"><a href="' + postUrl + '"><img src="' + thumb + '"></a></div>' +
            '<div class="fp-snippet">' + snippet + '</div>' +
            /* UPDATED BUTTON TEXT BELOW */
            '<a href="' + postUrl + '" class="fp-readmore">पूरा पढ्नुहोस्</a>' + 
        '</div>';
    }
    container.innerHTML = html;
}

document.write('<script src="/feeds/posts/default?alt=json-in-script&max-results=' + numPosts + '&callback=showFeatured"><\/script>');


