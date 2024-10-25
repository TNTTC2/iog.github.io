
   function changelang(lang)
   {

	lang = lang

	if (parent.location.href.lastIndexOf("#")+1 == parent.location.href.length ){
		len = parent.location.href.length -1
		temp = parent.location.href.substring(parent.location.href.lastIndexOf("/")+1)
		docname =temp.substring(0, temp.length -1)

	}else{
		docname = parent.location.href.substring(parent.location.href.lastIndexOf("/")+1)
	}
	
	 if (docname == ""){
          docname = "index.php";
   }
	 
    dir = parent.location.href.substring(0, parent.location.href.lastIndexOf("/")+1)

		newloc =  "../" + lang + "/" + docname.substring(docname.indexOf("/")+1)
		document.location.href = newloc
   }

