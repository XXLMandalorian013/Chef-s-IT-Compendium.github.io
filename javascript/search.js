function searchSite(query) {
    // Replace with the URL of your website's search results page
    var searchUrl = 'https://xxlmandalorian013.github.io/Chef-s-IT-Compendium.github.io/search.html';

    // Redirect to the search results page with the user's query
    window.location.href = searchUrl + encodeURIComponent(query);
}
