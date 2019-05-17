app.controller('HomeController', function ($scope) {
    $("#openVideo").click(function() {
        $('#yt_video').attr('src','https://www.youtube.com/embed/tlqFkEq0tWQ?ecver=1');
        $("#see_yourself").modal('show');
    });
    $('.close-youtube').click(function(){
        $('#yt_video').attr('src',null);
    });
});

app.controller('sliderController', function(){
    var allSlides = $('.each_slide'),
        firstSlide = $('.slide1'),
        currentCount = 1;

    firstSlide.animate({opacity: '1'}, 1000);
    firstSlide.animate({display: 'block'}, 4000);
    firstSlide.animate({opacity: '0'}, 1000);

    setInterval(function () {
        var currentSlide = allSlides[currentCount];
        if (currentCount < allSlides.length) {
            $(currentSlide).animate({opacity: '1'}, 1000);
            $(currentSlide).animate({display: 'block'}, 4000);
            $(currentSlide).animate({opacity: '0'}, 1000);
            currentCount++;
        }
        else {
            allSlides.css("opacity", "0");
            firstSlide.animate({opacity: '1'}, 1000);
            currentCount = 0;
        }
    }, 6000);

});

