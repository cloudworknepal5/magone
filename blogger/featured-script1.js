var numPosts = 3; 
var snippetLength = 600; 

// 1. Function to convert digits to Nepali numerals
function toNepaliNum(num) {
    var dict = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
    return num.toString().replace(/[0123456789]/g, function(s) { return dict[s]; });
}

// 2. Function to format date/time into Nepali
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
    
    // 24-hour format with leading zeros
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
        
        // FAIL-PROOF LINK DETECTION
        var postUrl = "";
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                postUrl = entry.link[k].href;
                break;
            }
        }
        
        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image ? entry.author[0].gd$image.src.replace('/s113/', '/s100/') : 'https://via.placeholder.com/100';
        
        // CONVERT DATE
        var nepaliDateLabel = getNepaliDateTime(entry.published.$
