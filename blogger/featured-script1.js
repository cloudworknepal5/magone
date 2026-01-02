var numPosts = 3; 
var snippetLength = 600; 

// 1. Nepali Conversion Logic (Your Code)
function toNepali(n) {
    var digits = ['०','१','२','३','४','५','६','७','८','९'];
    return n.toString().split('').map(function(z) { return digits[z] || z; }).join('');
}

function applyNepaliDate(el) {
    var raw = el.getAttribute('data-iso');
    if (!raw) return;
    var d = new Date(raw);
    if (isNaN(d.getTime())) return;

    var days = ["आइतवार", "सोमवार", "मंगलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"];
    var months = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];

    var year = d.getFullYear() + 56;
    var mon = d.getMonth() + 9;
    var day = d.getDate() + 15;
    if (day > 30) { day -= 30; mon++; }
    if (mon > 12) { mon -= 12; year++; }

    var hh = d.getHours();
    var mm = d.getMinutes();
    var hS = hh < 10 ? '०' + toNepali(hh) : toNepali(hh);
    var mS = mm < 10 ? '०' + toNepali(mm) : toNepali(mm);

    el.innerHTML = days[d.getDay()] + ", " + toNepali(day) + " " + months[mon-1] + " " + toNepali(year) + " | " + hS + ":" + mS;
    el.classList.add('converted');
}

// 2. Fetch and Build the Posts
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
        
        // --- LINK DETECTION FIX ---
        var postUrl = "";
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                postUrl = entry.link[k].href;
                break;
            }
        }
        
        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image ? entry.author[0].gd$image.src.replace('/s113/', '/s100/') : 'https://via.placeholder.com/100';
        var isoDate = entry.published.$t; 
        var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s1600/') : 'https://via.placeholder.com/1200x600';
        var content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, snippetLength) + '...';

        // --- HTML CONSTRUCTION ---
        html += '<div class="fp-item">' +
            '<h1 class="fp-title"><a href="' + postUrl + '">' + title + '</a></h1>' +
            '<div class="fp-meta">' +
                '<img class="fp-author-img" src="' + authorImg + '">' +
                '<span><b>' + authorName + '</b></span><span>|</span>' +
                '<span class="nepali-date" data-iso="' + isoDate + '">Loading Date...</span>' +
            '</div>' +
            '<div class="fp-image-wrap"><a href="' + postUrl + '"><img src="' + thumb + '"></a></div>' +
            '<div class="fp-snippet">' + snippet + '</div>' +
            '<a href="' + postUrl + '" class="fp-readmore">थप पढ्नुहोस्</a>' +
        '</div>';
    }
    container.innerHTML = html;
    
    // Manually trigger the date conversion for the first load
    document.querySelectorAll('.nepali-date:not(.converted)').forEach(applyNepaliDate);
}

// 3. MutationObserver for Dynamic Loading
var observer = new MutationObserver(function(mutations) {
    document.querySelectorAll('.nepali-date:not(.converted)').forEach(applyNepaliDate);
});
observer.observe(document.body, {childList: true, subtree: true});

// 4. Fetch the Blogger Feed
document.write('<script src="/feeds/posts/default?alt=json-in-script&max-results=' + numPosts + '&callback=showFeatured"><\/script>');
