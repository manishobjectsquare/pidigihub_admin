           // Loader
 var myVar;
   
   function loader() {
       myVar = setTimeout(showPage);
   }
   
   function showPage() {
       document.getElementById("preloader").style.display = "none";
   }
 
    // loder-end

$(document).ready(function(){
  $('.toggle').click(function(){
    $('body').toggleClass('resize-menu');
  });
$('.counter').each(function(){
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        },{
            duration: 3500,
            easing: 'swing',
            step: function (now){
                $(this).text(Math.ceil(now));
            }
        });
    });

});



$("#chart-container").insertFusionCharts({
  type: "spline",
  width: "100%",
  height: "100%",
  dataFormat: "json",
  dataSource: {
    chart: {
      caption: "",
      yaxisname: "",
      anchorradius: "5",
      plottooltext: "Engagement in $label is <b>$dataValue</b>",
      showhovereffect: "1",
      showvalues: "0",
      numbersuffix: "",
      theme: "fusion",
      anchorbgcolor: "#72D7B2",
      palettecolors: "#72D7B2"
    },
    data: [
      {
        label: "12/03",
        value: "1"
      },
      {
        label: "13/03",
        value: "5"
      },
      {
        label: "14/03",
        value: "10"
      },
      {
        label: "15/03",
        value: "12"
      },
      {
        label: "16/03",
        value: "14"
      },
      {
        label: "17/03",
        value: "16"
      },
      {
        label: "18/03",
        value: "20"
      },
      {
        label: "19/03",
        value: "22"
      },
      {
        label: "20/03",
        value: "20"
      },
      {
        label: "21/03",
        value: "16"
      },
      {
        label: "22/03",
        value: "7"
      },
      {
        label: "23/03",
        value: "2"
      }
    ]
  }
});

 