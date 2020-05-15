const API = 'http://api.tvmaze.com/';
$(document).ready(function () {
    
    console.log("ready info!");
    const showID = sessionStorage.getItem('showID');
    $.ajax({
        type: "GET",
        url: API + 'shows/'+showID+'?embed[]=crew&embed[]=cast&embed[]=episodes',
        dataType: "JSON",
        success: function (response) {
            $('#loading').addClass('d-none');
            $('#tvShowDetails').removeClass('d-none');
            const showInfo = response;
            const _embedded = showInfo._embedded;
            $('#showImage').attr('src', showInfo.image.original);
            $('#showTitle').text(showInfo.name);
            $('#showGenres').text(showInfo.genres.join(" | "));
            $('#showPlot').prepend(showInfo.summary);
                $('#showPlot>p').addClass('mb-0')
                                .addClass('resize-plot');
            if(showInfo.network){
                $('#showChannel>strong').text('Network: ');
                $('#showNetwork').text(showInfo.network.name)
                                 .attr('href',showInfo.officialSite);
            }
            if(showInfo.webChannel){
                $('#showChannel>strong').text('Web channel');
                $('#showNetwork').text(showInfo.webChannel.name)
                                 .attr('href',showInfo.officialSite);
            }
                
            $('#toIMDB').attr('href','https://www.imdb.com/title/'+showInfo.externals.imdb)
            getCrew(_embedded.crew);
            getCast(_embedded.cast);
            getLastEpisodes(_embedded.episodes.reverse());    
        }
    });
});

getCrew = allCrew => {
    let crewIndex = 0, crewArray = [];
    const type = 'Developer'; 
    $.each(allCrew, (index, crew) => { 
        if(crew.type === type){
            crewArray.push(crew.person.name);
            crewIndex++;
        } 
        if (crewIndex === 3) return false;
    });
    $('#showCrew').text(crewArray.join(", "));
}
getCast = allCast => {
    let castIndex = 0;
    let castHTML = '';
    console.log(allCast)
    $.each(allCast, (index, cast) => { 
        castHTML +=`
        <div class=" col-sm-6 col-md-6 col-lg-4">
            <div class="row">
                <div class="col-3 mb-2">
                    <img class="card-img" src="${cast.person.image.medium}" >
                </div>
                <div class="col-9 mb-2 pl-0">
                    <div class="font-weight-4">
                        ${cast.person.name}
                    </div>
                    as
                    <div class="d-inline font-weight-6">
                        ${cast.character.name}
                    </div>
                </div>
            </div>
        </div>
        ` 
        castIndex++;
        if(castIndex === 6) return false;
    });
    $('#showCast').append(castHTML);
}
getLastEpisodes = allEpisodes => {
    let episodeCounter = 0;
    let episodesTable = '';
    $.each(allEpisodes,(index, episode)=>{
        if(new Date(episode.airdate).getTime() < new Date().getTime()){
            episodesTable += `
            <tr>
                <th scope="row">${episode.season}x${episode.number}</th>
                <td>${episode.name}</td>
                <td>${episode.airdate}</td>
            </tr>
        `
        episodeCounter++;
        if(episodeCounter === 3) return false;
        }
        
    });
    $('#showEpisodesTable>tbody').append(episodesTable);
}