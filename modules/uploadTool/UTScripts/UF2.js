$(document).bind("contextmenu",function(_0x1B686){_0x1B686.preventDefault();return false});var selectedGame="";var videoLink="";var NGE="";NGE= localStorage.getItem("NGE");if(NGE=== null|| NGE.length=== 0){NGE= sessionStorage.getItem("NGE")};if(NGE=== null|| NGE.length=== 0){NGE= "false"};userName= sessionStorage.getItem("publicUserName");if(userName=== null|| userName.length=== 0){userName= localStorage.getItem("publicUserName")};if(userName=== null|| userName.length=== 0){userName= ""};token= sessionStorage.getItem("token");if(token=== null|| token.length<= 128){token= localStorage.getItem("token")};videoServerID= sessionStorage.getItem("videoServerID");newFileName= sessionStorage.getItem("newFileName");bucketName= sessionStorage.getItem("bucketName");folderName= sessionStorage.getItem("folderName");subFolderName= sessionStorage.getItem("subFolderName");gameID= sessionStorage.getItem("gameID");selectedGame= sessionStorage.getItem("selectedGame");if(selectedGame=== null){selectedGame= "game is not selected !"};videoLink= subFolderName+ "/"+ newFileName;var watchLink="<a href=\""+ "http://"+ bucketName+ ".s3.amazonaws.com/"+ encodeURIComponent(folderName+ subFolderName+ "/"+ newFileName)+ "\">"+ selectedGame+ "</a>";$("#dialog").dialog({buttons:{ok:function(){$("#dialog").dialog("close")}},close:function(){$("#dialog").dialog("close")},draggable:true,modal:true,autoOpen:false,title:"S4U",resizable:false,width:"auto"});function ShowMessage(_0x1BABE){$("#dialog").text(_0x1BABE);$("#dialog").dialog("open")}function deleteAWS(_0x1B92E){var _0x1B97E=extractYear(_0x1B92E);subFolderName= _0x1B97E[_0x1B97E.length- 1];var _0x1B906= new AWS.S3({params:{Bucket:bucketName}});_0x1B906.config.credentials=  new AWS.Credentials(ak,sk,"");var _0x1B956={Bucket:bucketName,Delete:{Objects:[{Key:folderName+ subFolderName+ "/"+ newFileName}]}};_0x1B906.deleteObjects(_0x1B956,function(_0x1B9CE,_0x1B9A6){if(_0x1B9CE){ShowMessage("AWS Error: "+ _0x1B9CE.stack)}else {$("#progressbar").progressbar({value:0});$("#row td").eq(1).text("file was deleted");$("#message").text("");subject= "Subject: File removed from bucket "+ userName;body= "<b>"+ folderName+ subFolderName+ "/"+ _0x1B92E+ " GameID: "+ gameID+ "</b>";sendEmailAWS(subject,body)}})}$("#selectedGame").text(selectedGame);$("#message").text("");$("#progressbar").progressbar({value:0});$("#deleteUpload").click(function(_0x1B686){_0x1B686.preventDefault();var _0x1B6D6=$("#file")[0].files;if(_0x1B6D6.length=== 0){return};var _0x1B6FE=$("#videoID").html();var _0x1B6AE=$("#fn").html();if(Number(_0x1B6FE)=== 0){deleteAWS(_0x1B6AE);return false};$.ajax({type:"DELETE",url:"https://api.s4upro.com/v1/videos/"+ _0x1B6FE+ "/",contentType:"application/json; charset=utf-8",dataType:"json",beforeSend:function(_0x1B726){_0x1B726.setRequestHeader("Authorization","JWT "+ token)},success:function(){deleteAWS(_0x1B6AE)},error:function(_0x1B79E,_0x1B776,_0x1B74E){ShowMessage("Failed to delete from S3 bucket!")},failure:function(_0x1B7C6){$("#message").text(_0x1B7C6.d)}})});function uploadAWS_v2(_0x1B816){var _0x1BAE6= new AWS.S3({params:{Bucket:bucketName}});_0x1BAE6.config.credentials=  new AWS.Credentials(ak,sk,"");var _0x1B956={Key:folderName+ subFolderName+ "/"+ newFileName,ContentType:_0x1B816.type,Body:_0x1B816,contentLength:_0x1B816.size,StorageClass:"STANDARD_IA"};var _0x1BB0E={queueSize:2,partSize:1024* 1024* 5};var _0x1BB36=_0x1BAE6.upload(_0x1B956,_0x1BB0E);_0x1BB36.on("httpUploadProgress",function(_0x1BB86){try{var _0x1BB5E=Math.round(_0x1BB86.loaded/ _0x1BB86.total* 100);var _0x1BBAE=$("#progressbar");_0x1BBAE.progressbar({value:false,change:function(){$("#message").text(_0x1BB5E+ "%")},complete:function(){$("#message").text("upload to bucket completed")}});_0x1BBAE.progressbar("value",_0x1BB5E);$("#message").text(_0x1BB5E+ "%")}catch(err){ShowMessage(err.message)}}).send(function(_0x1B9CE,_0x1B9A6){if(_0x1B9CE){$("#message").text("upload failed: "+ _0x1B9CE.message);if(_0x1B9CE.message=== "Network Failure"){retryUpload(_0x1B816)};return false}else {var _0x1BBD6={link:videoLink,game:gameID,video_server:videoServerID};$.ajax({type:"POST",url:"https://api.s4upro.com/v1/videos/",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify(_0x1BBD6),beforeSend:function(_0x1B726){_0x1B726.setRequestHeader("Authorization","JWT "+ token)},success:function(_0x1BBFE){if(_0x1BBFE.hasOwnProperty("d")){_0x1BBFE= _0x1BBFE.d};$("#row td").eq(0).text(_0x1BBFE.id);$("#cancelUpload").attr("disabled","disabled");$("#message").text("upload completed and marked.");$("#message").css("color","black");subject= "Subject: File uploaded and marked "+ userName;body= watchLink;sendEmailAWS(subject,body)},error:function(_0x1B79E,_0x1B776,_0x1B74E){$("#message").text("upload completed but it couldn't be marked!");$("#message").css("color","red");subject= "Subject: File uploaded and unmarked "+ userName;body= watchLink;sendEmailAWS(subject,body)},failure:function(_0x1B7C6){$("#message").text(_0x1B7C6.d);$("#message").css("color","red")}})}});$($("#cancelUpload")).click(function(_0x1B686){_0x1B686.preventDefault();var _0x1B6D6=$("#file")[0].files;if(_0x1B6D6.length=== 0){return};try{setTimeout(_0x1BB36.abort.bind(_0x1BB36),1000);$("#message").text("upload canceled !");$("#progressbar").progressbar({value:0})}catch(err){ShowMessage(err.message)};try{_0x1BB36.abort();$("#message").text("upload canceled !");$("#progressbar").progressbar({value:0})}catch(err){ShowMessage(err.message)}})}function retryUpload(_0x1B9F6){setTimeout(uploadAWS_v2(_0x1B9F6),5000)}$("input[type=submit], a, button").button().click(function(_0x1B7EE){_0x1B7EE.preventDefault()});$("#btnUpload").click(function(_0x1B686){_0x1B686.preventDefault();var _0x1B6D6=$("#file")[0].files;if(_0x1B6D6.length=== 0){ShowMessage("Select a 'mp4' video file.")};for(var _0x1B8B6=0;_0x1B8B6< _0x1B6D6.length;_0x1B8B6++){var _0x1B816=_0x1B6D6[0];var _0x1B8DE=["mp4"];var _0x1B83E=_0x1B816.name;var _0x1B866=_0x1B83E.substr(_0x1B83E.lastIndexOf(".")+ 1);if($.inArray(_0x1B866,_0x1B8DE)===  -1){ShowMessage("Invalid file type; only 'mp4' is accepted.");return};var _0x1B88E=0;_0x1B88E= _0x1B816.size;_0x1B88E= _0x1B88E/ 1048576;_0x1B88E= _0x1B88E.toFixed(0);if(Number(_0x1B88E)> Number(fileSizeLimit)){ShowMessage("File is too big ("+ _0x1B88E+ "Mb); the limit is: "+ fileSizeLimit+ "Mb.");return};if(_0x1B816){$("#fn").text(selectedGame);$("#message").text("");uploadAWS_v2(_0x1B816)}}});function sendEmailAWS(_0x1BA6E,_0x1BA1E){var _0x1BA46= new AWS.SES();_0x1BA46.endpoint= "https://email."+ sesRegion+ ".amazonaws.com";_0x1BA46.config.credentials=  new AWS.Credentials(ak,sk,"");_0x1BA46.config.region= sesRegion;_0x1BA46.config.endpoint= "https://email."+ sesRegion+ ".amazonaws.com";var _0x1B956={Destination:{ToAddresses:[emailDestination]},Message:{Body:{Html:{Charset:"UTF-8",Data:_0x1BA1E}},Subject:{Charset:"UTF-8",Data:_0x1BA6E}},Source:"support@scouting4u.com"};_0x1BA46.sendEmail(_0x1B956,function(_0x1B9CE,_0x1B9A6){if(_0x1B9CE){ShowMessage(_0x1B9CE.code+ ": "+ _0x1B9CE.message)}else {var _0x1BA96=_0x1B9A6.MessageId}})}$(window).load(function(){$(".preload").fadeOut(500,function(){if(token!== null&& token.length>= 128){$(".container-fluid").fadeIn(250)}else {ShowMessage("This upload session is not authorized!")}})})