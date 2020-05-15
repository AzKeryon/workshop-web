const API = 'http://api.tvmaze.com/';
$(document).ready(function() {

    console.log("ready!");
    $(".btn-pastel").click(function (e) { 
        e.preventDefault();
        $('#searchDisplay').empty();
        const show = $(".searchInput").val();
        const searchURL = 'search/shows?q='+show;
        console.log(API+searchURL)
        $.ajax({
            type: "GET",
            url: API + searchURL,
            dataType: "JSON",
            success: function (response) {
                let tvShows = response;
                let output = '';
                console.log('response', tvShows);
                $.each(tvShows, (indexTVShow, TVShow) => { 
                    console.log('index: '+indexTVShow+ ' tvShow: '+TVShow.show.name);
                    output += `
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <div class="card poster text-center mb-2 shadow-sm" data-id="${TVShow.show.id}">            
                                <div class="bg-img" style="background-image: url(${TVShow.show.image ? TVShow.show.image.original : '/assets/noImageAvailable.png'});">
                                    <!--Image-->
                                </div> 
                                <h5 class="mt-2 mb-1 nowrapScroll">${TVShow.show.name}</h5>
                        </div>
                    </div>
                    `
                });
                $('#searchDisplay').append(output);
            }
        });
        $("div.search>input").val("")      
    });

    $('#searchDisplay').on('click','.poster',function (e) { 
        e.preventDefault();
        const showID = $(this).data('id');
        console.log('clicked! in id: '+ showID);
        sessionStorage.setItem('showID',showID);
        window.location = 'tvShow.html';
    });
});


