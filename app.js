var OMDB_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

var _searchTerm='';
function getDataFromApi(searchTerm, optionalData, callback) {
  _searchTerm=searchTerm;
  var settings = {
    url: OMDB_BASE_URL,
    data: {
      r: 'json',
      part:'snippet',
      key:'AIzaSyD0Wt5wCj4aiJLOzuDsST4oLL0bed0WkpU',
      q:searchTerm,
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
    if(optionalData)
  {
    $.extend(settings.data,optionalData);
  }
  $.ajax(settings);
}



function displayOMDBSearchData(data) {
  var resultElement = '';

  if (data.items) {
    data.items.forEach(function(item) {
     resultElement +=
      '<p onclick="lightBox(\''+item.id.videoId+'\')"> <img class="image" src='+item.snippet.thumbnails.medium.url+'>' +  '<p>' + item.snippet.title + '</p>'+'</p>'+
      '<button onclick="getDataFromApi(\'\',{channelId:\''+item.snippet.channelId+'\'},displayOMDBSearchData)" class="more">more from this channel</button>';
 



    });
    resultElement+='<button onclick="getDataFromApi(_searchTerm,{pageToken:\''+data.prevPageToken+'\'},displayOMDBSearchData)" class="prev">previous</button>';
    resultElement+='<button onclick="getDataFromApi(_searchTerm,{pageToken:\''+data.nextPageToken+'\'},displayOMDBSearchData)">next</button>';

  }
  else {
    resultElement += '<p>No results</p>';
  }
  
  $('.js-search-results').html(resultElement);
 
  if(!data.prevPageToken)
    {
      $('.prev').prop("disabled",true);
    }
}
function lightBox(id){
  $(lightboxClose());
    $('body').append('<div class="wrapper"></div>');
    $('.wrapper').fadeIn(function(){
      $('body').append('<div class="lightbox"></div>');
      $('.lightbox').html('<iframe width=100% height=100% src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe> <span onclick="lightboxClose()"class="exit">[x]</span>');
      $('.lightbox').fadeIn();
    })
}
function lightboxClose(){
  $('.lightbox').fadeOut(function(){
    $('.wrapper').fadeOut();
  });
}



function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query =$(this).find('.js-query').val();
    getDataFromApi(query,undefined, displayOMDBSearchData);
  });
}

$(function(){watchSubmit();});