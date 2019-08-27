var OMDB_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

var _searchTerm='';
var currentPageToken='';
function getDataFromApi(searchTerm, optionalData, callback) {
  if(!searchTerm=='')
  {
    _searchTerm=searchTerm;
  }
  if(optionalData && optionalData.pageToken)
  {
    $('.js-search-results').on('click','.more', function ()
    {
      currentPageToken=optionalData.pageToken;
  });
  }
  var settings = {
    url: OMDB_BASE_URL,
    data: {
      r: 'json',
      part:'snippet',
      key:'AIzaSyBazYEGOymeMcFk4UwO-0Hojmn4WZIztXE',
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
  $(moreClicked());
  if (data.items) {
    data.items.forEach(function(item) {
     resultElement +=
      '<p class="vid2" onclick="lightBox(\''+item.id.videoId+'\')"> <img class="image" src='+item.snippet.thumbnails.medium.url+'>' +  '<p>' + item.snippet.title + '</p>'+'</p>';
      if(!($('.more').data('clicked')||$('.prev2').data('clicked')||$('.nxt2').data('clicked')||$('.more2').data('clicked')))
      {
      resultElement +='<button onclick="getDataFromApi(\'\',{channelId:\''+item.snippet.channelId+'\'},displayOMDBSearchData)" class="more">more from this channel</button>';
      }
      else{
      resultElement +='';
      }
 



    });
    
    if(!($('.more').data('clicked')||$('.prev2').data('clicked')||$('.nxt2').data('clicked')||$('.more2').data('clicked')))
    {
    resultElement+='<br><br><button onclick="getDataFromApi(_searchTerm,{pageToken:\''+data.prevPageToken+'\'},displayOMDBSearchData)" class="prev">previous page</button>';
    resultElement+='<button onclick="getDataFromApi(_searchTerm,{pageToken:\''+data.nextPageToken+'\'},displayOMDBSearchData)" class="nxt">next page</button>';
    }
    else
    {
    resultElement+='<button onclick="getDataFromApi(\'\',{pageToken:\''+data.prevPageToken+'\',channelId:\''+data.items[0].snippet.channelId+'\'},displayOMDBSearchData)" class="prev2">previous</button>';
    resultElement+='<button disabled onclick="getDataFromApi(_searchTerm,{pageToken:\''+data.nextPageToken+'\'},displayOMDBSearchData)" class="nxt2">next</button>';
    resultElement+='<button  onclick="getDataFromApi(\'\',{pageToken:\''+data.nextPageToken+'\',channelId:\''+data.items[0].snippet.channelId+'\'},displayOMDBSearchData)" class="more2">more from this channel</button>';
    resultElement+='<br><br><button onclick="getDataFromApi(_searchTerm,{pageToken:\''+currentPageToken+'\'},displayOMDBSearchData)" class="bck">back to search results</button>';
    }

  }
  else {
    resultElement += '<p>No results</p>';
  }
  
  $('.js-search-results').html(resultElement);
 
  if(!data.prevPageToken)
    {
      $('.prev').prop("disabled",true);
      $('.prev2').prop("disabled",true);
    }
}
function moreClicked()
{
    $('.js-search-results').on('click','.more2',function(event)
    {
      
          $('.more2').data('clicked',true);
        
    });
    $('.js-search-results').on('click','.nxt2',function(event)
    {
      $('.nxt2').data('clicked',true);
    });
    $('.js-search-results').on('click','.prev2',function(event)
    {
       $('.prev2').data('clicked',true);
    });
    $('.js-search-results').on('click','.vid2',function(event)
    {
       $('.vid2').data('clicked',true);
    });
    $('.js-search-results').on('click','.more',function(event)
    {
      
      $('.more').data('clicked',true);
      
    });
    
}

function lightBox(id){
  $(lightboxClose());
    $('body').append('<div class="wrapper"></div>');
    $('.wrapper').fadeIn(function(){
      $('body').append('<div class="lightbox"></div>');
      $('.lightbox').html('<iframe width=100% height=100% src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen class="video"></iframe> <span onclick="lightboxClose()"class="exit">[x]</span>');
      $('.lightbox').fadeIn();
    })
}
function lightboxClose(){
  $('.lightbox').fadeOut(function(){
    $('.wrapper').fadeOut();
    $('.video').attr("src","");
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
