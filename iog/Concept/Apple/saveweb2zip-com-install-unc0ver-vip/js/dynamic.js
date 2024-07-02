function slideUp(){
    document.getElementById("fadeBtn").style.opacity = "0";
    document.getElementById("appe").style.visibility= "visible";
    document.getElementById("mainPart").style.visibility = "hidden";
    document.getElementById("mainPart").style.opacity = "0";
    document.getElementById("appe").style.opacity = "1";
    document.getElementById("appe").style.top = "1px";
}


function slideDown(){
    document.getElementById("fadeBtn").style.opacity = "1";
    document.getElementById("appe").style.visibility= "hidden";
    document.getElementById("mainPart").style.visibility = "visible";
    document.getElementById("mainPart").style.opacity = "1";
    document.getElementById("appe").style.top = "200px";
    document.getElementById("appe").style.opacity = "0";
}

function warning(){

  document.getElementById("conf").style.visibility= "visible";

}

function hideConf(){

  document.getElementById("conf").style.visibility= "hidden";

}

function jailbreak(){
  document.getElementById("cons").style.display = "inline";
  document.getElementById("everything").style.visibility = "hidden";
  document.getElementById("everything").style.opacity = "0";
  setTimeout(function (){document.getElementById("everything").style.display = "none"},1000);
  setTimeout(function (){document.getElementById("appLogo").style.opacity = "1000"},2450);
  document.body.style.backgroundColor = "black";
  setTimeout(function (){document.getElementById("appLogo").style.paddingTop = "70px"},4500);
  setTimeout(function (){document.getElementById("c1").style.opacity= "1"},4800);
  setTimeout(function (){document.getElementById("c2").style.opacity= "1"},5400);
  setTimeout(function (){document.getElementById("c3").style.opacity= "1"},6000);
  setTimeout(function (){document.getElementById("c4").style.opacity= "1"},7000);
  setTimeout(function (){document.getElementById("c5").style.opacity= "1"},7300);
  setTimeout(function (){document.getElementById("c6").style.opacity= "1"},7400);
  setTimeout(function (){document.getElementById("c7").style.opacity= "1"},8900);
  setTimeout(function (){document.getElementById("c8").style.opacity= "1"},10000);
  setTimeout(function (){document.getElementById("c9").style.opacity= "1"},10200);
  setTimeout(function (){document.getElementById("c10").style.opacity= "1"},11000);
  setTimeout(function (){document.getElementById("c11").style.opacity= "1"},12300);
  setTimeout(function (){window.scrollTo(0,document.body.scrollHeight);},12320);
  setTimeout(function (){document.getElementById("c12").style.opacity= "1"},12800);
  setTimeout(function (){document.getElementById("c13").style.opacity= "1"},13000);
  setTimeout(function (){document.getElementById("c14").style.opacity= "1"},13100);
  setTimeout(function (){document.getElementById("c15").style.opacity= "1"},15000);
  setTimeout(function (){document.getElementById("cs").style.opacity= "0"},16000);
  setTimeout(function (){

    var element = document.getElementById("cs");
    element.outerHTML = "";
    delete element;

  },18000);

  setTimeout(function (){document.getElementById("appLogo").style.paddingTop= "200px"},19000);
    setTimeout(function (){document.getElementById("appLogo").style.display="none"},41000);
  setTimeout(function (){document.getElementById("oAn").style.opacity= "1"},19500);
  setTimeout(function (){document.getElementById("lAn").style.width= "190px"},20000);
  setTimeout(function (){document.getElementById("cons").style.opacity= "0"},40000);
  setTimeout(function (){document.body.style.backgroundColor = "#EFEFF5"},40000);
  setTimeout(function (){document.getElementById("off").style.top = "0px"},41000);


}
