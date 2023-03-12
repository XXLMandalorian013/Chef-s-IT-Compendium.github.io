$("#search").on("submit", function(event) {
    event.preventDefault();
    var query = $("#query").val();
    $("#results").load("/search?q=" + query);
});
