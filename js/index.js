
var app;
var labels;
var languages=[]; 			
var errMsg;
var logo;
var homePage;
var connection = new RTCMultiConnection();
// by default, socket.io server is assumed to be deployed on your own URL
//connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
connection.socketURL = 'http://rtcmulticonnection.herokuapp.com:443/';
connection.socketMessageEvent = 'video-broadcast-demo';
connection.session = {  audio: true, video: true, oneway: true };
 

// https://www.rtcmulticonnection.org/docs/iceServers/
// use your own TURN-server here!
connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}];

connection.videosContainer = document.getElementById('videos-container');
connection.onstream = function(event) {
    var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }

    if(event.type === 'local') {
      video.volume = 0;
      try {
          video.setAttributeNode(document.createAttribute('muted'));
      } catch (e) {
          video.setAttribute('muted', true);
      }
    }
    video.srcObject = event.stream;

    var width = parseInt(connection.videosContainer.clientWidth) - 2;
	var height = parseInt(connection.videosContainer.clientHeight) - 2;
    var mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: ['full-screen','mute-audio', 'mute-video'],
        width: width,
		height:height,
        showOnMouseEnter: false
    });

    connection.videosContainer.appendChild(mediaElement);

    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;
}; 

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);

        if(event.userid === connection.sessionid && !connection.isInitiator) {
          alert('Broadcast is ended. We will reload this page to clear the cache.');
          location.reload();
        }
    }
};

connection.onMediaError = function(e) {
    if (e.message === 'Concurrent mic process limit.') {
        if (DetectRTC.audioInputDevices.length <= 1) {
            alert('Please select external microphone. Check github issue number 483.');
            return;
        }

        var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        connection.mediaConstraints.audio = {
            deviceId: secondaryMic
        };

        connection.join(connection.sessionid);
    }
	 document.getElementById('connText').innerHTML=e.message;
};

$(document).ready(function($) {	
 //capture all fixed data
 errMsg=document.getElementById('errMsg');
 logo=document.getElementById('logo');
 homePage=document.getElementById('homePage');
 errMsg=document.getElementById('errMsg');
 errMsg=document.getElementById('errMsg');
	 
 
 $("#backToTeacher").on('click',function(e){
 console.log('back button pressed',localStorage); 
 $("#errMsg").innerHTML='Closing Connection...';
 setTimeout(function(){  location.reload(); },200);
 });

 if (window.history && window.history.pushState) {
  window.history.pushState('forward', null, './#forward');
  	$(window).on('popstate', function() {
	 console.log("popState entry",localStorage);
	 let page =localStorage.getItem("page");
	   if(page=="onShowMore"){
	      app.onLoginTeacher();
	   }else if(page=="onTeacherDetails"){
	      app.onLoginTeacher();
	   }else if(page=="goingLive"){
	      location.reload();
	   }else if(page=="joinLive"){
	      location.reload();
	   }
	   else {
	      app.onReset();
	  }
	   console.log("popState exit",localStorage);
	  return;
    });
  }

});
app = {
	 loadJS :function(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
	},
 
    // Application Constructor
    initialize: function() {
		languages=[];
		if(new Date().getTime()-localStorage.getItem("currTime")>(30*1000)){
			localStorage.clear();
		}
		localStorage.setItem("page","initialize");
		localStorage.setItem("currTime",new Date().getTime());
		console.log("initialize",localStorage);
		$.ajax({
          url: 'https://www.msquaresys.com/teacher/getLanguages.php',
          dataType: 'json',  crossOrigin: true,  async:false,
		  success: function(data) {
			let options=""
            data.rows.forEach(function(item){
  			const picked = Object.assign({}, {id: item.id, name: 'lblLearn'+item.name, suffix:item.suffix});
			languages.push(picked);
			options+="<option value="+item.suffix+" >" +item.name+ "</option>"
			});
			document.getElementById('language').innerHTML="<option value='-1'>Select</option>"+options;
          },
		  error: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Language Load Error "+textStatus+'-'+xhr.statusText;
		  },
		  fail: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Language Load Fail "+textStatus+'-'+xhr.statusText;
		  }
        });
				
		this.hideDivs();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.getElementById('language').addEventListener('change',  this.onLanguageChange.bind(this), false);
		document.addEventListener('loginSuccess', this.onLoginTeacher.bind(this), false);
		document.getElementById("logo").hidden=false;
		if(localStorage.getItem("backToTeacher")=="true"){
		  localStorage.removeItem("backToTeacher");
		  console.log("back To Teacher",localStorage);
		  var promise0 = new Promise(function(resolve, reject) {
		  app.loadJS("js/label_"+localStorage.getItem("lang")+".js");
		  setTimeout(function() {
		  resolve('foo');
		  }, 500);
		  });
		  promise0.then(function(value) {
		  document.getElementById("deviceready").hidden=false;
		   if(localStorage.getItem("role")=="Student"){
			 app.onTeacherDetails(JSON.parse(localStorage.getItem("teacher")));
		  }
		  else
		  {
			 app.onLoginTeacher();//(JSON.parse(localStorage.getItem("role")));
		  }
		  });
		 }		 
	},
	onLanguageChange: function(id) {
        let lang = document.getElementById('language').value;
		localStorage.setItem("lang",lang);
		console.log("onLanguageChange",localStorage);
		if(lang=='-1'){
		    return;
		}
		  
		var promise1 = new Promise(function(resolve, reject) {
		  app.loadJS("js/label_"+lang+".js");
		  console.log("onLanguageChange-Loadjs",lang+".js");
		  setTimeout(function() {
			console.log("onLanguageChange-resolve-promise1");
		    resolve('foo');
		  }, 500);
		});
		promise1.then(function(value) {
		 console.log("promise1 entry");
		 app.onUserSelection();
		 console.log("promise1 exit");
		});
	},
	onUserSelection: function(){
		 console.log("onUserSelection entry");
		document.getElementById("logo").hidden=false;
		document.getElementById("deviceready").hidden=false;
		document.getElementById("userSelection").hidden=false;
		document.getElementById("userSelection").innerHTML="";
		
		let divUser= document.createElement('div');
		divUser.appendChild(document.createElement('hr'));
		 let inputUserStudent= document.createElement('input');
		 inputUserStudent.setAttribute('id','loginUserStudent');	
		 inputUserStudent.setAttribute('type','button');			 
		 inputUserStudent.setAttribute('value',labels['lblStudent']);
		divUser.appendChild(inputUserStudent);
		 
		divUser.appendChild(document.createTextNode('    '));
		 let inputUserTeacher= document.createElement('input');
		 inputUserTeacher.setAttribute('id','loginUserTeacher');	
		 inputUserTeacher.setAttribute('type','button');			 
		 inputUserTeacher.setAttribute('value',labels['lblTeacher']);
		divUser.appendChild(inputUserTeacher);
		divUser.appendChild(document.createElement('hr'));
		document.getElementById("userSelection").appendChild(divUser);
		inputUserStudent.addEventListener('click',  this.onLoginSuccessStudent.bind(this), false);
		inputUserTeacher.addEventListener('click',  this.onLoginLanding.bind(this), false);
		console.log("onUserSelection exit");
	},
	onLoginSuccessStudent: function() {
		console.log("onLoginSuccessStudent entry");
		try
		{ 
		this.onLoginLanding();
		 document.getElementById("loginName").value='';
		 document.getElementById("loginPasswd").value='';
		}catch(e)
		{
		  console.log("onLoginSuccessStudent-error",e);
		}
		localStorage.setItem("role","Student");
		console.log("onLoginSuccessStudent",localStorage);
		this.onLoginTeacher();
		console.log("onLoginSuccessStudent exit");
	},
	onLoginLanding: function(){
		localStorage.setItem("page","onLoginLanding");
		localStorage.setItem("currTime",new Date().getTime());
		console.log("onLoginLanding",localStorage);
		document.getElementById("deviceready").hidden=true;
		document.getElementById("userSelection").hidden=true;
		document.getElementById("loginPage").hidden=false;
		document.getElementById("loginPage").innerHTML=""
		
		let divLoginData= document.createElement('div');
		divLoginData.appendChild(document.createElement('hr'));
		divLoginData.appendChild(document.createTextNode(labels['lblTeacher']+' '+labels['lbllogin']));
		//divLoginData.appendChild(document.createElement('br'));
		let inputLoginName= document.createElement('input');
		 inputLoginName.setAttribute('id','loginName');	
		 inputLoginName.setAttribute('type','text');	
		 inputLoginName.setAttribute('placeholder',labels['lbllogin']);			 
		 inputLoginName.setAttribute('value','Teacher1');
		divLoginData.appendChild(inputLoginName);
		divLoginData.appendChild(document.createElement('br'));
		divLoginData.appendChild(document.createTextNode(labels['lblTeacher']+' '+labels['lblpasswd']));
		
		let inputLoginPass= document.createElement('input');
		 inputLoginPass.setAttribute('id','loginPasswd');	
		 inputLoginPass.setAttribute('type','password');	
		 inputLoginPass.setAttribute('placeholder',labels['lblpasswd']);			 
		 inputLoginPass.setAttribute('value','Teacher1');
		divLoginData.appendChild(inputLoginPass); 		
		divLoginData.appendChild(document.createElement('br'));
		divLoginData.appendChild(document.createElement('br'));
		let inputloginUserTeacher= document.createElement('button');
		 inputloginUserTeacher.setAttribute('id','loginUserTeacher');	
		 inputloginUserTeacher.setAttribute('type','button');
		 inputloginUserTeacher.setAttribute('class','btn btn-default btn-sm');		 
		  let spanTeacherSignIn= document.createElement('span');
		   	spanTeacherSignIn.setAttribute('class','glyphicon glyphicon-user');
			spanTeacherSignIn.appendChild(document.createTextNode(labels['lblTeacherSignIn']));
		 inputloginUserTeacher.append(spanTeacherSignIn);
		divLoginData.appendChild(inputloginUserTeacher);
		divLoginData.appendChild(document.createElement('br'));
		divLoginData.appendChild(document.createElement('br'));
		let inputTeacherSignUp= document.createElement('button');
		 inputTeacherSignUp.setAttribute('id','teacherSignUp');
		 inputTeacherSignUp.setAttribute('type','button');
		 inputTeacherSignUp.setAttribute('class','btn btn-default btn-sm');
		   let spanTeacherSignUp= document.createElement('span');
		   	spanTeacherSignUp.setAttribute('class','glyphicon glyphicon-user');
			spanTeacherSignUp.appendChild(document.createTextNode(labels['lblTeacherSignup']));
		 inputTeacherSignUp.append(spanTeacherSignUp);
 		divLoginData.appendChild(inputTeacherSignUp);
		let inputForgot= document.createElement('button');
		 inputForgot.setAttribute('id','forgotPassword');
		 inputForgot.setAttribute('type','button');
		 inputForgot.setAttribute('class','btn btn-link btn-sm');
		 inputForgot.innerHTML=labels['lblForgotPassword'];  
 		divLoginData.appendChild(inputForgot);
		divLoginData.appendChild(document.createElement('hr'));
		document.getElementById("loginPage").append(divLoginData);
		
		inputloginUserTeacher.addEventListener('click',  this.onLoginForTeacher.bind(this), false);
		inputTeacherSignUp.addEventListener('click',  this.onTeacherRegistrationPage.bind(this), false);
		console.log("onLoginLanding exit");
	},
	onTeacherRegistrationPage: function(){
		localStorage.setItem("page","onTeacherRegistrationPage");
		localStorage.setItem("currTime",new Date().getTime());
		console.log("onLoginLanding entry",localStorage);
		this.hideDivs();
		
		  
		var teacherRegistrationPage=document.getElementById("teacherRegistrationPage");
		teacherRegistrationPage.hidden=false;
		teacherRegistrationPage.setAttribute('align','center');
		 
		 let header= document.createElement('div');
		 header.setAttribute('class','well-sm');
		 header.innerHTML= labels['lblTeacherSignup'];
		 
		teacherRegistrationPage.appendChild(header);
		
		let input_table = document.createElement('table');
		input_table.setAttribute('class','table-striped');
		{
		let input_tr= document.createElement('tr');
		 input_tr.setAttribute('hidden','true');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode('TeacherId') );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','tid');
		  $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeacherRegistartionId.php',
          dataType: 'json', crossOrigin: true, async:false, 
          success: function(data) {
		   input.setAttribute('value',data.total);
		  },
		   error: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Teacher Registration Error "+textStatus+'-'+xhr.statusText;
		  },
		  fail: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Teacher Registration Error "+textStatus+'-'+xhr.statusText;
		  }
		  });
		  
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		 
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblName']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblName');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblUniversity']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblUniversity');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblLocation']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblLocation');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblYearOfExp']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		 
		 let selectExpHtml="";
		 for(var i=0;i<15;i++){
		 	selectExpHtml+=" <option value="+i+" >"+i+"</option>";
		 }
		 selectExpHtml+=" <option value='&gt;15' > &gt; 15</option>"; 
		 
		  let input = document.createElement('select');
		  input.setAttribute('id','lblYearOfExp');
		  input.innerHTML=selectExpHtml;
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblEmail']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblEmail');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		{
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblPhone']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblPhone');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		 
		 {
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblMobileNo']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblMobileNo');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		 // Languages
	   {
		   let selectCategoryHtml="";
		 for(var i=0;i<languages.length;i++){
			 selectCategoryHtml+=" <option value="+labels[languages[i].name]+" >"+labels[languages[i].name]+"</option>";
		 }
		  
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblLanguage']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let select = document.createElement('select');
		  select.setAttribute('id','lblLanguage');
		  select.innerHTML=selectCategoryHtml;
		 input_td1.appendChild(select);
		 
		  let inputAdd= document.createElement('input');
		 inputAdd.setAttribute('id','addLanguage');	
		 inputAdd.setAttribute('type','button');			 
		 inputAdd.setAttribute('value',labels['lblAdd']);
		input_td1.appendChild(inputAdd);
		 
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		let input_tr2= document.createElement('tr');
		let input_td2= document.createElement('td');
		let input_langDivs= document.createElement('div');
		input_langDivs.setAttribute('id','languagesToAdd');	
		input_td2.appendChild(input_langDivs);
		input_table.appendChild(input_tr2);
		 
	   }
	   
	   //desc
	    {
		let input_tr= document.createElement('tr');
		let input_td0= document.createElement('td');
		 input_td0.setAttribute('style','padding-left:5px');
		 input_td0.appendChild(document.createTextNode(labels['lblDescription']) );
		 input_tr.appendChild(input_td0);
		
		 let input_td1= document.createElement('td');
		 input_td1.setAttribute('style','padding-left:5px');
		  let input = document.createElement('input');
		  input.setAttribute('id','lblDescription');
		  input.setAttribute('type','text');
		 input_td1.appendChild(input);
		input_tr.appendChild(input_td1);
		input_table.appendChild(input_tr);
		}
		
		//All data
		 let formData =document.createElement('form');
	   { let dataDiv =document.createElement('div');
		 dataDiv.appendChild(input_table);
		 formData.setAttribute('id','teacherRegistrationForm');
		 formData.setAttribute('action','registerTeacherSave.php');
		 formData.setAttribute('method','post');
		 formData.appendChild(input_table);
	     teacherRegistrationPage.appendChild(formData);
	   }
	   
	   {
			// photo
		 let imgDiv =document.createElement('div');
		 imgDiv.setAttribute('id','uploadFormLayerPhoto');
		 imgDiv.setAttribute('class','well');
		 
		 let imgDivInput =document.createElement('input');
		 imgDivInput.setAttribute('name','userPhoto');
		 imgDivInput.setAttribute('type','file');
		 imgDivInput.setAttribute('class','inputFile');
		 
		 let imgDivUpload =document.createElement('input');
		 imgDivUpload.setAttribute('value','Upload Photo');
		 imgDivUpload.setAttribute('type','submit');
		 imgDivUpload.setAttribute('class','btnSubmit');
		 
		 imgDiv.appendChild(imgDivInput); 
		 imgDiv.appendChild(imgDivUpload);
		 
		 
		 let imgDisp =document.createElement('div');
		 imgDisp.setAttribute('id','targetLayerPhoto');
		 
		 let formImg =document.createElement('form');
		 formImg.setAttribute('id','uploadFormPhoto');
		 formImg.setAttribute('action','uploadPhoto.php');
		 formImg.setAttribute('method','post');
		 formImg.appendChild(imgDisp);
		 formImg.appendChild(imgDiv);
		 
		 let table=document.createElement('table');
		 let tr=document.createElement('tr');
		 let td=document.createElement('td');
		 td.appendChild(document.createTextNode(labels['lblUploadPhoto']) );
		 tr.appendChild(td);
		 
		 let td1=document.createElement('td');
		 td1.setAttribute("style","padding-left:10px");
		 td1.appendChild(formImg);
		 tr.appendChild(td1);
		 table.appendChild(tr);
		 
		 teacherRegistrationPage.appendChild(table);
	   }
		{
			// certificate
		 let imgDiv =document.createElement('div');
		 imgDiv.setAttribute('id','uploadFormLayerCerti');
		 imgDiv.setAttribute('class','well');
		  
		 let imgDivInput =document.createElement('input');
		 imgDivInput.setAttribute('name','userCerti');
		 imgDivInput.setAttribute('type','file');
		 imgDivInput.setAttribute('class','inputFile');
		 
		 let imgDivUpload =document.createElement('input');
		 imgDivUpload.setAttribute('value','Upload Certi');
		 imgDivUpload.setAttribute('type','submit');
		 imgDivUpload.setAttribute('class','btnSubmit');
		 
		 imgDiv.appendChild(imgDivInput); 
		 imgDiv.appendChild(imgDivUpload);
		 
		 
		 let imgDisp =document.createElement('div');
		 imgDisp.setAttribute('id','targetLayerCerti');
		 
		 let formImg =document.createElement('form');
		 formImg.setAttribute('id','uploadFormCerti');
		 formImg.setAttribute('action','uploadCerti.php');
		 formImg.setAttribute('method','post');
		 formImg.appendChild(imgDisp);
		 formImg.appendChild(imgDiv);
		 
		 let table=document.createElement('table');
		 let tr=document.createElement('tr');
		 let td=document.createElement('td');
		 td.appendChild(document.createTextNode(labels['lblUploadCerti']) );
		 tr.appendChild(td);
		 
		 let td1=document.createElement('td');
		 td1.setAttribute("style","padding-left:10px");
		 td1.appendChild(formImg);
		 tr.appendChild(td1);
		 table.appendChild(tr);
		 
		 teacherRegistrationPage.appendChild(table);
	   }
		
	   {
	   // video 
		 let imgDiv =document.createElement('div');
		 imgDiv.setAttribute('id','uploadFormLayerVideo');
		 imgDiv.setAttribute('class','well');
		 
		 let imgDivInput =document.createElement('input');
		 imgDivInput.setAttribute('name','userVideo');
		 imgDivInput.setAttribute('type','file');
		 imgDivInput.setAttribute('class','inputFile');
		 
		 let imgDivUpload =document.createElement('input');
		 imgDivUpload.setAttribute('value','Upload Video');
		 imgDivUpload.setAttribute('type','submit');
		 imgDivUpload.setAttribute('class','btnSubmit');
		 
		 imgDiv.appendChild(imgDivInput); 
		 imgDiv.appendChild(imgDivUpload);
		 
		 
		 let imgDisp =document.createElement('div');
		 imgDisp.setAttribute('id','targetLayerVideo');
		 
		 let formImg =document.createElement('form');
		 formImg.setAttribute('id','uploadFormVideo');
		 formImg.setAttribute('action','uploadVideo.php');
		 formImg.setAttribute('method','post');
		 formImg.appendChild(imgDisp);
		 formImg.appendChild(imgDiv);
		 
		 let table=document.createElement('table');
		 let tr=document.createElement('tr');
		 let td=document.createElement('td');
		 td.appendChild(document.createTextNode(labels['lblUploadVideo']) );
		 tr.appendChild(td);
		 
		 let td1=document.createElement('td');
		 td1.setAttribute("style","padding-left:10px");
		 td1.appendChild(formImg);
		 tr.appendChild(td1);
		 table.appendChild(tr);
		 
		 teacherRegistrationPage.appendChild(table);
		  
	   }
	  
	   {
		   // savebutton
		   let imgSaveTeacherRegisteration =document.createElement('div');
		 let saveInput =document.createElement('input');
		 saveInput.setAttribute('id','registerTeacherSave');
		 saveInput.setAttribute('type','submit');
		 saveInput.setAttribute('value',labels['lblSave']);
		 imgSaveTeacherRegisteration.appendChild(saveInput);
		 teacherRegistrationPage.appendChild(imgSaveTeacherRegisteration);
		 teacherRegistrationPage.appendChild(document.createElement('hr'));
	   }
		  
	   $("#uploadFormPhoto").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "uploadPhoto.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayerPhoto").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	  }));
	   $("#uploadFormCerti").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "uploadCerti.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayerCerti").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	  }));
	  
	  $("#uploadFormVideo").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "uploadVideo.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayerVideo").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	  }));
	  
	  $("#addLanguage").on('click',(function(e) {
		   e.preventDefault();
		   $("#languagesToAdd").html($("#lblLanguage").val());
		  }));
	  
	  
	   $("#registerTeacherSave").on('click',(function(e) {
	    e.preventDefault();
		 $("#uploadFormPhoto").submit();
		 $("#uploadFormCerti").submit();
		 $("#uploadFormVideo").submit();
		 
		 let formEl = document.forms.teacherRegistrationForm
		 // Create an FormData object 
        let tid=document.getElementById("tid").value;
		let lblName=document.getElementById("lblName").value;
		let lblUniversity=document.getElementById("lblUniversity").value;
		let lblLocation=document.getElementById("lblLocation").value;
		let lblYearOfExp=document.getElementById("lblYearOfExp").value;
		let lblEmail=document.getElementById("lblEmail").value;
		let lblPhone=document.getElementById("lblPhone").value;
		let lblMobileNo=document.getElementById("lblMobileNo").value;
		let lblDescription=document.getElementById("lblDescription").value;
		let photo_src;
		let certi;
		let sample_video;
		try{
		photo_src=$($("#uploadFormPhoto").children()[0]).children()[0].src;
		}catch(err){
			document.getElementById("errMsg").innerHTML="Upload Image Failed";
			photo_src="";
			return;
		}	
		try{
		certi=$($("#uploadFormCerti").children()[0]).children()[0].src;
		}catch(err){
			document.getElementById("errMsg").innerHTML="Upload Certificate Failed";
			certi="";
			return;
		}
		
		try{
		sample_video=$($("#uploadFormVideo").children()[0]).children()[0].src;
		}catch(err){
			document.getElementById("errMsg").innerHTML="Upload Video Failed";
			sample_video="";
		}
		

        
		$.ajax({
        	url: "registerTeacherSave.php",
			type: "get",
			data: {
				tid: tid,
				lblName:lblName,
				lblUniversity:lblUniversity,
				lblLocation:lblLocation,
				lblYearOfExp:lblYearOfExp,
				lblEmail:lblEmail,
				lblPhone:lblPhone,
				lblMobileNo:lblMobileNo,
				lblDescription:lblDescription,
				photo_src:photo_src,
				certi:certi,
				sample_video:sample_video
			},
		    success: function(out)
		    {
				if(out.success=="true")
					document.getElementById("errMsg").innerHTML="Registration Completed Sucessfully ";
				else
					document.getElementById("errMsg").innerHTML=out.msg;
		    },
		  	error: function(a,b,c) 
	    	{
			 console.log(a,b,c);
	    	}, fail: function(a,b,c) 
	    	{
			 console.log(a,b,c);
	    	} 	        
	   });
	  }));
	   //document.getElementById("registerTeacher").addEventListener('click',  this.registerTeacher.bind(this), false);
	   app.onHome("changeLang");
	   console.log("onTeacherRegistrationPage exit");
	},
    hideDivs:function(){
	document.getElementById("logo").hidden=true;
	document.getElementById("homePage").hidden=true;
	document.getElementById("loginPage").hidden=true;
	document.getElementById("teacherPage").hidden=true;
	document.getElementById("showAllPage").hidden=true;
	document.getElementById("userSelection").hidden=true;
	document.getElementById("teacherRegistrationPage").hidden=true;
	document.getElementById("homePageContent").innerHTML="";
	document.getElementById("teacherPage").innerHTML="";
	document.getElementById("showAllPage").innerHTML="";
	if(document.getElementById("errMsg").innerHTML.length!=0)
	  setTimeout(function(){document.getElementById("errMsg").innerHTML="";},2000);
	//document.getElementById("userSelection").innerHTML=""
	//document.getElementById("loginPage").innerHTML="";
	document.getElementById("containerFooter").innerHTML="";
	document.getElementById("teacherRegistrationPage").innerHTML="";
 	},
	getLogin(userName,password){
	 console.log("userName="+userName,"password"+password);
	 let t_id=false;
	 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getLogin.php?username='+userName+'&password='+password,
          dataType: 'json', crossOrigin: true, async:false,		 
          success: function(data) {
			if(data.login){
				t_id=data.id;
			}
          },
		  error: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Login Error"+textStatus+'-'+xhr.statusText;
		  },
		  fail: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Login Fail"+textStatus+'-'+xhr.statusText;
		  }
        });
		let teacher=false;
		if(t_id){
			 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachers.php?teacherId='+t_id,
          dataType: 'json', crossOrigin: true, async:false,
          success: function(data) {
			 teacher =data.rows[0];
          },
		  error: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Teacher Login Error"+textStatus+'-'+xhr.statusText;
		  },
		  fail: function(xhr, textStatus, errorThrown){
      	  document.getElementById('errMsg').innerHTML="Teacher Login Fail"+textStatus+'-'+xhr.statusText;
		  }
        });
		return teacher;
		}
		 
	 
	},
	onLoginForTeacher: function() {
		localStorage.setItem("page","onLoginForTeacher");
		localStorage.setItem("currTime",new Date().getTime());
		let teacherLogin = this.getLogin(document.getElementById('loginName').value, document.getElementById('loginPasswd').value);
		document.getElementById("loginName").value='';
	    document.getElementById("loginPasswd").value='';
		 if(teacherLogin){ 
	      localStorage.setItem("role","Teacher");
	      localStorage.setItem("teacher",JSON.stringify(teacherLogin));
		  this.onLoginTeacher();
	     }else{
			 console.log("login fail");
			 document.getElementById("errMsg").innerHTML='Invalid Login';
		 }			 
	},
	onLoginTeacher:function(){
	 if(localStorage.getItem("role")=="Teacher" ){
	 this.onLoginTeacherForTeacher();
	 }
	 else{
	 this.onLoginTeacherForStudent();
	 }
	},
	onLoginTeacherForStudent: function() {
		localStorage.setItem("page","onLoginTeacher");
		localStorage.setItem("currTime",new Date().getTime());
   	    //data
		this.hideDivs();
		document.getElementById("homePage").hidden=false;
		for(var i=0;i<languages.length;i++){
		 let learn=languages[i];
		  
		 let divLearn= document.createElement('div');
		 divLearn.setAttribute('id','heading_'+learn.id);
		 divLearn.setAttribute('class','ib');
		 //divLearn.setAttribute("style","display:block");
		 divLearn.innerHTML=labels[learn.name];
		 document.getElementById("homePageContent").appendChild(divLearn);
		 
		 let divShowAll= document.createElement('div');
		 divShowAll.setAttribute('id','subHeading_'+learn.id);
		 divShowAll.setAttribute('class','ib');
		 //divShowAll.setAttribute("style","display:block");
		 
		 divShowAll.setAttribute('style','float:right;');
			let a_showAllLink= document.createElement('a');
			 	a_showAllLink.setAttribute('href','./#forward'); 
			let showAllLink= document.createElement('span');
				showAllLink.setAttribute('class','glyphicon glyphicon-th-list');
				showAllLink.setAttribute('l',learn.id);
				showAllLink.appendChild(document.createTextNode(' '+labels['lblShowAll']));
			a_showAllLink.appendChild(showAllLink);
			a_showAllLink.addEventListener('click',  app.onShowMore.bind(this), true);
		 divShowAll.appendChild(a_showAllLink);
		
		 divLearn.parentElement.appendChild(divShowAll);
		 
		 let divOuter= document.createElement('div');
		 divOuter.setAttribute('id','learn_'+learn.id);
		 divOuter.setAttribute('style','overflow:auto;');
		 divLearn.parentElement.appendChild(divOuter);
		 
		 let divInner= document.createElement('div');
		  divInner.setAttribute('id','learn_inner_'+learn.id);
		  divInner.setAttribute('style','width: 830px;');
		 divOuter.appendChild(divInner); 
	
		 //document.getElementById("heading_"+learn.id).setAttribute("style","display:none");
		 //document.getElementById("subHeading_"+learn.id).setAttribute("style","display:none");
		 console.log('invoking AJAX getTeachersForLang.php?langId='+learn.id);;	
		 
		  
		 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachersForLang.php?langId='+learn.id,
          dataType: 'json', crossOrigin: true, async:false,
          success: function(data) {
		   console.log('inside getTeachersForLang ',data);	
            data.rows.forEach(function(t){ 
			let img= document.createElement('img');
		    img.setAttribute('src',t.photo_src);
		    img.setAttribute('alt', t.name);
		    img.setAttribute('id', t.id);
		 
	        let divgallery= document.createElement('div');
		    divgallery.setAttribute('class','gallery');
			divgallery.setAttribute('id',t.id);
		    divgallery.appendChild(img);
			let divInner = document.getElementById("learn_inner_"+t.lang_id);
			divInner.appendChild(divgallery);
		 	 
		  });
		  } //end of success
		  ,
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Language Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Language Fail "+textStatus+'-'+xhr.statusText;
	  }
         }); //end of ajax
		} // for loop  
		app.onImgDisplay();	
		app.onHome("home");
    },
	onLoginTeacherForTeacher: function() {
		localStorage.setItem("page","onLoginTeacher");
		localStorage.setItem("currTime",new Date().getTime());
   	    //data
		let teacherMain=JSON.parse(localStorage.getItem("teacher"));
		this.hideDivs();
		document.getElementById("homePage").hidden=false;
		
		
		$.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachers.php?teacherId='+teacherMain.id,
          dataType: 'json', crossOrigin: true, async:false,
          success: function(data) {
		   console.log('inside getTeacherSession - Log1',data);
			data.rows.forEach(function(t){ 
			let img= document.createElement('img');
		    img.setAttribute('src',t.photo_src);
		    img.setAttribute('alt', t.name);
		    img.setAttribute('id', t.id);
			img.setAttribute('class', 'img-thumbnail');
		 
	        let divgallery= document.createElement('div');
		    divgallery.setAttribute('class','gallery');
			divgallery.setAttribute('id',t.id);
		    divgallery.appendChild(img);
			document.getElementById("homePageContent").appendChild(divgallery);
			document.getElementById("homePageContent").appendChild(document.createElement('hr'));
			document.getElementById("homePageContent").appendChild(document.createTextNode(labels['lblWelcome']+' '+t.name));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
		 	document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			document.getElementById("homePageContent").appendChild(document.createElement('br'));
			
			});
			app.onImgDisplay();	
		  },
	      error: function(xhr, textStatus, errorThrown){
         	  document.getElementById('errMsg').innerHTML="Getting Teacher Error "+textStatus+'-'+xhr.statusText;
	      },
	      fail: function(xhr, textStatus, errorThrown){
         	  document.getElementById('errMsg').innerHTML="Getting Teacher Fail "+textStatus+'-'+xhr.statusText;
	      }
		});
		
		 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeacherSession.php?teacherId='+teacherMain.id,
          dataType: 'json', crossOrigin: true, async:true,
		  success: function(data) {
		   console.log('inside getTeacherSession - log2',data);
		   /*if(data.total==0){
			   return;
		   }*/
		   let table= document.createElement('table'); 
		   let schedules=document.createElement('div');
		   table.setAttribute('class',' table-striped');
		   schedules.appendChild(document.createTextNode(labels['lblMyScheduleManager']));
		   data.rows.forEach(function(t){
		   if(Date.parse(t.endTime)>Date.now()){
		   let tr= document.createElement('tr');
			tr.setAttribute('id','tr_'+t.s_id);
			let td0= document.createElement('td');
			let td1= document.createElement('td');
			let td2= document.createElement('td');
			let td3= document.createElement('td');
		   
		      let teacherSession= document.createElement('span'); 
		      teacherSession.appendChild(document.createElement('br'));
		      
			  let teacherSessionSpan= document.createElement('span'); 
		      teacherSessionSpan.setAttribute('class','glyphicon glyphicon-check');
		      teacherSessionSpan.appendChild(document.createTextNode(' '+t.startTime+' '));
		      teacherSessionSpan.appendChild(document.createTextNode('-'));
		      teacherSessionSpan.appendChild(document.createTextNode(' '+t.endTime+' '));
			  let sessionDiv=document.createElement('div');
			  sessionDiv.setAttribute('id',"sess_"+t.s_id);
			  sessionDiv.appendChild(teacherSessionSpan)
		      
		      td0.appendChild(sessionDiv);     
			  td1.appendChild(document.createTextNode(labels['lblLearn'+t.l_name]));
			if(Date.parse(t.startTime)<Date.now() && Date.parse(t.endTime)>Date.now() && t.status=='SCHEDULED'){
		       let golive= document.createElement('a');
		       golive.setAttribute('liveid',t.lang_id+'_'+t.teacher_id);
			   golive.setAttribute('class','badge badge-success');
		       golive.setAttribute('href','./#forward');
		       golive.addEventListener('click',  app.goingLive.bind(this), true);
		       golive.appendChild(document.createTextNode(' '+labels['lblGoLive']+' '));
			   td2.appendChild(golive);
			}else{
				 let status= document.createElement('span');
				 status.setAttribute('class','badge badge-success');
				 status.appendChild(document.createTextNode(' ' +t.status))
				 td2.appendChild(status);
			 }
			
			   
			let teacherSessionCloseSpan= document.createElement('span'); 
			teacherSessionCloseSpan.setAttribute('id',t.s_id);
			teacherSessionCloseSpan.setAttribute('class','btn btn-danger glyphicon glyphicon-remove');
			//teacherSessionCloseSpan.innerHTML=labels['lblDismissSession'];
			 
			teacherSessionCloseSpan.addEventListener('click',  app.killSession.bind(this), true);
			td3.appendChild(teacherSessionCloseSpan);
			
			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			table.appendChild(tr);
			}
		    });
			
			schedules.appendChild(table);
			let addSchedule= document.createElement('span'); 
			addSchedule.setAttribute('id','addTeacherSessionPre');
			addSchedule.setAttribute('class','btn btn-info glyphicon glyphicon-plus');
			addSchedule.appendChild(document.createTextNode(' Add Session'));
			schedules.appendChild(addSchedule);
			
			document.getElementById("homePageContent").appendChild(schedules);
			} //end of success
			,
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher Session Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher Session Fail "+textStatus+'-'+xhr.statusText;
	  }
	    }); //end of ajax
	 
			//check admin 
		 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachersForApproval.php?teacherId='+teacherMain.id,
          dataType: 'json', crossOrigin: true, async:true,
		  success: function(data) {
		   console.log('inside getTeachersForApproval ',data);
		   if(data.rows.length==0){
		    localStorage.removeItem("isAdmin");
		    localStorage.removeItem("adminTeacher");
			   return;
		   }
		   localStorage.setItem("isAdmin",true);
		   localStorage.setItem("adminTeacher",JSON.stringify(teacherMain));
		   let approvals=document.createElement('div');
		   approvals.appendChild(document.createTextNode(labels['lblApproveTeachers']));
		  
		   data.rows.forEach(function(t){
		      let teacherApprove= document.createElement('span'); 
		      teacherApprove.appendChild(document.createElement('br'));
		      teacherApprove.appendChild(document.createTextNode(labels['lblName']+" : "+ t.name));
			
		       let approve= document.createElement('a');
		       approve.setAttribute('id',t.id);
		       approve.setAttribute('href','./#forward');
		       approve.addEventListener('click',  app.approveTeacher.bind(this), true);
		       approve.innerHTML=' '+labels['lblShowDtl'];
		       teacherApprove.appendChild(approve);
		     
		     				   
		    approvals.appendChild(teacherApprove);
		   
		    });
			 document.getElementById("homePageContent").appendChild(approvals);
			} //end of success
			,
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Approval Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Approval Fail "+textStatus+'-'+xhr.statusText;
	  }
	    }); //end of ajax
		
		  
		app.onImgDisplay();	
		app.onHome("home");
    },
	onShowMore: function(code) {
		console.log('onShowMore entry', code);
		localStorage.setItem("page","onShowMore");
		localStorage.setItem("currTime",new Date().getTime());
		app.hideDivs();
		document.getElementById("showAllPage").hidden=false;
		//console.log(code.target.attributes.l);
	    let lid;
		try{
			 lid= app.getLanguage(code.target.attributes.l.value);
			 localStorage.setItem("showmoreLang",JSON.stringify(lid));
			 code.preventDefault();
		}catch(err){
			lid =JSON.parse(localStorage.getItem("showmoreLang"));
		}
		let learn= lid;
		let divShowAllPage= document.createElement('div');
		divShowAllPage.setAttribute('id','showAllPage'+learn.id);
		divShowAllPage.innerHTML=labels[learn.name] +'<input type ="text" placeholder="'+labels['lblSearch']+'" style="float:right;" ><br>';
		document.getElementById("showAllPage").appendChild(divShowAllPage);
		//console.log('//www.msquaresys.com/teacher/getTeachersForLang.php?langId='+learn.id);
	$.ajax({
      url: 'https://www.msquaresys.com/teacher/getTeachersForLang.php?langId='+learn.id,
      dataType: 'json', crossOrigin: true, async:true,
      success: function(data) {
        data.rows.forEach(function(t){ 
		//console.log(t);
	    let img= document.createElement('img');
	    img.setAttribute('src',t.photo_src);
	    img.setAttribute('alt', t.name);
	    img.setAttribute('id', t.id); 
		img.setAttribute('class', 'img-thumbnail');
	    
	    let divgallery= document.createElement('div');
	    divgallery.setAttribute('class','gallery');
		divgallery.setAttribute('id',t.id);
	    divgallery.append(img);
	    document.getElementById("showAllPage").appendChild(divgallery);
	    
	    let divDesc= document.createElement('div');
		divDesc.setAttribute('id',t.id);
	    divDesc.innerHTML=labels['lblName'] +' : ' + t.name+ '<span class="badge"><span id ='+t.id+' style="float:right" class="glyphicon glyphicon-heart"> '+t.rating+' </span></span><br>  '+labels['lblLocation'] +' :<span  id ='+t.id+' >'+t.loc+'</span>'
	    divgallery.append(divDesc);
	   });
	   app.onImgDisplay();
	   app.onHome("home");
      },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Language Session Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher for Language Session Fail "+textStatus+'-'+xhr.statusText;
	  }
     });
	 },
	onTeacherDetails: function(teacher) {
		localStorage.setItem("page","onTeacherDetails");
		localStorage.setItem("currTime",new Date().getTime());
		console.log("onTeacherDetails-entry",localStorage, teacher);
		let tid;
		try{
		 tid = teacher.target.id
		}catch(err) {
		  if(localStorage.getItem("isAdmin")=="true")
		  {
		   tid= JSON.parse(localStorage.getItem("adminTeacher")).id
		  }else
		  { try{
		     tid = teacher.id;
		     } catch(err){
				 tid= JSON.parse(localStorage.getItem("teacher")).id
			 }
		  }
		   
		}//end of catch
		console.log("onTeacherDetails-entry2 tid=",tid,teacher);
	 
	     let t; 
		 try{
	     t=this.getTeacher(tid);
	     localStorage.setItem("teacher",JSON.stringify(t));
		 }catch(err){
		  t=JSON.parse(localStorage.getItem("teacher"));
		 }
		  
	this.hideDivs();
	var teacherPage=document.getElementById("teacherPage");
	teacherPage.hidden=false;
	
	let divrow0= document.createElement('div');
	divrow0.setAttribute('class','row');
	teacherPage.append(divrow0);
	
	let divrow0col1= document.createElement('div');
	divrow0col1.setAttribute('class','col-sm-1');
	
	 var ht="";
	   ht+="<table class='table-striped'>";
       ht+="<tr><td rowspan=8 style='padding:5px'><img src="+t.photo_src+" alt="+t.name+" id="+t.id+" class= 'img-thumbnail'></td><td style='padding-left:5px'>"+labels['lblName']+"</td><td style='padding-left:5px'>"+t.name+"</td></tr>" ;
       ht+="<tr><td style='padding-left:5px'>"+labels['lblUniversity']+"</td><td style='padding-left:5px'>"+t.university+"</td></tr>";
       ht+="<tr><td style='padding-left:5px'>"+labels['lblLocation']+"</td><td style='padding-left:5px'>"+t.loc+"</td></tr>";
       ht+="<tr><td style='padding-left:5px'>"+labels['lblYearOfExp']+"</td><td style='padding-left:5px'>"+t.yrs+"</td></tr>";
       ht+="<tr><td style='padding-left:5px'>"+labels['lblEmail']+"</td><td style='padding-left:5px'>"+t.email+"</td></tr>";
       ht+="<tr><td style='padding-left:5px'>"+labels['lblPhone']+"</td><td style='padding-left:5px'>"+t.phone+"</td></tr>";
       ht+="<tr><td style='padding-left:5px'>"+labels['lblMobileNo']+"</td><td style='padding-left:5px'>"+t.mobile+"</td></tr>";
       ht+="</table>";
	 divrow0col1.innerHTML=ht;
	 divrow0.append(divrow0col1);
  
  
    let divrow1= document.createElement('div');
	divrow1.setAttribute('class','row');
	teacherPage.append(divrow1);
	
	let divrow1col0= document.createElement('div');
	divrow1col0.setAttribute('class','col-sm-9');
	divrow1col0.innerHTML=labels['lblDescription']+'<p>'+t.description+'</p>';
	divrow1.append(divrow1col0);
	
	if(t.certificate=="" || t.certificate==null || t.certificate==undefined){
	}else{
	let divrow2a= document.createElement('div');
	divrow2a.setAttribute('class','row');
	teacherPage.append(divrow2a);
	
	let divrow2acol0= document.createElement('div');
	divrow2acol0.setAttribute('class','col-sm-9');
	divrow2acol0.innerHTML=labels['lblCertificate']+"<p><img src="+t.certificate+" alt="+t.name+" id="+t.id+"></p>";
	divrow2a.append(divrow2acol0);
	}
	
	 if(t.sampleVideos==undefined){
	 }
	 else
	 {
	   let divOuter1= document.createElement('div');
	   divOuter1.setAttribute('style','overflow:auto;');
	   teacherPage.append(divOuter1);
	   
	   let divInner1= document.createElement('div');
	   divInner1.setAttribute('style','width: 1000px;');
	   divOuter1.append(divInner1);
	   if(t.introVideoMP4==undefined){
	   }else{
	   divInner1.innerHTML='<hr>'+labels['lblSampleVideo']+'<br><br><video id="introVideo_'+t.id+'" width="250" controls preload="none" style="padding:5px;"><source src="'+t.introVideoMP4+'" type="video/mp4" /></video>';
	   }
	   for(var v=0;v<t.sampleVideos.length;v++){
	  	 divInner1.innerHTML+='<video id="sampleVideo_'+t.sampleVideos[v].id+'" width="250" controls preload="none" style="padding:5px;" ><source src="'+t.sampleVideos[v].srcMP4+'" type="video/mp4" /></video>';
	   }
	 }
	 
	  if(t.sampleVideosYouTube.length==0){
	 }
	 else
	 {
	 let divOuter2= document.createElement('div');
	 divOuter2.setAttribute('style','overflow:auto;');
	 teacherPage.append(divOuter2);
	
	 let divInner2= document.createElement('div');
	 divInner2.setAttribute('style','width: 1000px;');
	 divOuter2.append(divInner2);
	 divInner2.innerHTML+="<hr>"+labels['lblYoutubeVideos']+"<br><br>";
	  for(var v=0;v<t.sampleVideosYouTube.length;v++){ 
		  divInner2.innerHTML+='<iframe width="250" src="'+t.sampleVideosYouTube[v]+'" frameborder="5" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	 }
	 }
	 
	
	 
    let divrow2= document.createElement('div');
	divrow2.setAttribute('class','row');
	teacherPage.append(divrow2);
	
	 let divrow2col0= document.createElement('div');
	 divrow2col0.setAttribute('id','sessions_'+t.id);
	 divrow2col0.setAttribute('class','col-sm-9');
	 divrow2col0.innerHTML="";
	 divrow2.appendChild(divrow2col0);
	 console.log("invoking AJAX getTeacherSession.php?teacherId="+t.id);
	 $.ajax({
        url: 'https://www.msquaresys.com/teacher/getTeacherSession.php?teacherId='+t.id,
        dataType: 'json',crossOrigin: true,  async:false,	  
        success: function(data) {
			console.log('inside getTeacherSession ', data);
		 data.rows.forEach(function(t){
		 if(Date.parse(t.endTime)>Date.now()){  
		     let teacherSession= document.createElement('span');
	   	     teacherSession.setAttribute('class','well glyphicon glyphicon-check');
		     teacherSession.appendChild(document.createTextNode(' '+t.startTime));
		     teacherSession.appendChild(document.createTextNode(' - '));
		     teacherSession.appendChild(document.createTextNode( t.endTime+' '));
		     teacherSession.appendChild(document.createTextNode(' '+labels['lblLearn'+t.l_name]));
		     if(Date.parse(t.startTime)<Date.now() && Date.parse(t.endTime)>Date.now()){
		     let live= document.createElement('a');
		     live.setAttribute('liveid',t.lang_id+'_'+t.teacher_id);
			 live.setAttribute('href','./#forward');
			 live.addEventListener('click',  app.joinLive.bind(this), true);
		     live.appendChild(document.createTextNode(' '+labels['lblLive']+' '));
		     teacherSession.appendChild(live);
		     }else{
				 teacherSession.appendChild(document.createTextNode(' ' +t.status));
			 }
		     teacherSession.appendChild(document.createElement("br"));
		     document.getElementById('sessions_'+t.teacher_id).appendChild(teacherSession);
		 }
		});
	  },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher Session Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Getting Teacher Session Fail "+textStatus+'-'+xhr.statusText;
	  }
     }); 
	this.onHome("home");
	},
	 
	killSession:function(e){
	console.log("killSession -entry",e, e.target.id);
	let teacherSessionId = e.target.id;
	$.ajax({
      url: 'https://www.msquaresys.com/teacher/killTeacherSession.php?teacherSessionId='+teacherSessionId,
      dataType: 'json',	  crossOrigin: true, async:false,
      success: function(data) {
	     console.log("removing "+document.getElementById(teacherSessionId));
	     document.getElementById("tr_"+teacherSessionId).remove();
	     //document.getElementById(e.target.id).remove();
	  },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Remove Session Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Remove Session Fail "+textStatus+'-'+xhr.statusText;
	  }
    }); 
	
	},
	onReset: function() {
		 localStorage.clear(); 
		 document.getElementById("deviceready").hidden=false;
		 document.getElementById("userSelection").hidden=false;
		 this.initialize();
	},
	getUrlVars :function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
	console.log(vars);
    return vars;
	},

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },
	getTeacher(tid){
	 console.log("getTeacher-entry tid=",tid);
	 let teachers=[];
	 $.ajax({
      url: 'https://www.msquaresys.com/teacher/getTeachers.php?teacherId='+tid,
      dataType: 'json', crossOrigin: true, async:false,
	  success: function(data) {
        data.rows.forEach(function(item){ 
	  	teachers.push(item);
	    });
      },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="get Teacher Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="get Teacher Fail "+textStatus+'-'+xhr.statusText;
	  }
     });
	 for(var i=0;i<teachers.length;i++){
		if(teachers[i].id==tid){
		console.log("getTeacher-exit",teachers[i]);
		return teachers[i];
		}
	 }
	},
	getLanguage(lid){
	 console.log(lid);
	 for(var i=0;i<languages.length;i++){
		if(languages[i].id==lid){
		 console.log(languages[i]);
		return languages[i];
		}
	 }
	},
	onImgDisplay : function(){
	var gallery = document.getElementsByClassName("gallery");
	console.log("Updating image Click on Gallery items = ",gallery.length);
	for(var i =0;i<gallery.length;i++)
		{
		gallery[i].addEventListener('click',  this.onTeacherDetails.bind(this), false);
		} 	
	},
	acceptReject :function(){  
	    var teacherPage=document.getElementById("teacherPage");
 		teacherPage.appendChild(document.createTextNode(" "));
		let approveTeacherspan= document.createElement('button');
		let teacherTobeApproved= JSON.parse(localStorage.getItem('teacher')).id;
		approveTeacherspan.setAttribute('id',teacherTobeApproved);
		approveTeacherspan.setAttribute('class','btn btn-success'); 
		approveTeacherspan.setAttribute('style','float :left');
		approveTeacherspan.appendChild(document.createTextNode(' '+labels['lblApprove']));
		teacherPage.appendChild(approveTeacherspan);
		
		teacherPage.appendChild(document.createTextNode(" "));
		 
		approveTeacherspan.addEventListener('click',  this.approvedTeacher.bind(this), false); 
		
		teacherPage.appendChild(document.createTextNode(" "));
		let rejectTeacherspan= document.createElement('button');
		rejectTeacherspan.setAttribute('id',teacherTobeApproved);
		rejectTeacherspan.setAttribute('class','btn btn-danger'); 
		rejectTeacherspan.setAttribute('style','float :right');
		rejectTeacherspan.appendChild(document.createTextNode(' '+labels['lblReject']));
		teacherPage.appendChild(rejectTeacherspan);
		teacherPage.appendChild(document.createTextNode(" "));
		rejectTeacherspan.addEventListener('click',  this.rejectedTeacher.bind(this), false); 
		localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
	},
	onHome : function(bothHomeAndLogOut){
		document.getElementById("containerFooter").innerHTML="";
		let hr =document.createElement('hr');
		hr.setAttribute('style','margin-top: 10px; margin-bottom: 10px;');
		if(bothHomeAndLogOut=='home'){
		document.getElementById("containerFooter").appendChild(hr); 
		let homespan= document.createElement('button');
		homespan.setAttribute('id','Home');
		homespan.setAttribute('class','glyphicon glyphicon-home'); 
		homespan.setAttribute('style','float :left');
		homespan.appendChild(document.createTextNode(' '+labels['lbl'+localStorage.getItem('role')]+' '+labels['lblHome']));
		document.getElementById("containerFooter").appendChild(homespan);
		
		document.getElementById("containerFooter").appendChild(document.createTextNode(" "));
		homespan.addEventListener('click',  this.onLoginTeacher.bind(this), false); 
		}
		
		let resetspan= document.createElement('button');
		resetspan.setAttribute('id','Logout');
		resetspan.setAttribute('class','glyphicon glyphicon-cog'); 
		resetspan.setAttribute('style','float :right');
		resetspan.appendChild(document.createTextNode(' '+labels['lblLogout']));
		document.getElementById("containerFooter").appendChild(resetspan);
		document.getElementById("containerFooter").appendChild(document.createElement('br')); 
		document.getElementById("containerFooter").appendChild(document.createElement('br')); 
		 if(localStorage.getItem("role")=="Student" ){
		  
		 }
		localStorage.removeItem("video-broadcast-demo");
		 
		
        resetspan.addEventListener('click',  this.onReset.bind(this), false); 
	},
    onDeviceReady: function() {
        this.receivedEvent('deviceready');  
	},
	onBackKeyDown : function(){
		console.log("back");
	if(performance.navigation.type == 2) {
		console.log("back 1")
		}
	},
	goingLive : function(e){
	  let liveSessionId;
	  e.preventDefault();
	  try{
	   console.log("Click Live for session id " +e.target.attributes.liveid.value);
	   //app.hideDivs();
	   liveSessionId= e.target.attributes.liveid.value;
	   localStorage.setItem(connection.socketMessageEvent, liveSessionId);
	   localStorage.setItem("page", "goingLive");
	   localStorage.setItem("currTime",new Date().getTime());
	   console.log("Click" ,localStorage);
	   document.getElementById("logo").hidden=true;
	   document.getElementById("errMsg").innerHTML="1. Attempting Connection for Teacher Broadcast...";
	   connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
      };
      
      }
	  catch(err){
	   console.log("Invalid sessionid on Click Live" ,e);
	   return;
	  } 
	   console.log("role is teacher so opening Broadcast ",liveSessionId);
	   app.hideDivs();
	   connection.open(liveSessionId, function() {
       setTimeout(function()
	    { 
		console.log("Check Broadcast Opened -Entry",localStorage);
	    //document.getElementsByClassName("media-box")[0].children[0].remove();
		document.getElementById("logo").hidden=true;
		document.getElementById('errMsg').innerHTML="Teacher is Broadcasting now ...";
		
		console.log("Check Broadcast Opened -Exit",localStorage);
		document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
		},5000);
		
		document.getElementById("errMsg").innerHTML="2. Attempting Connection Open for Teacher Broadcast...";
		 console.log("Post Attempting  -Exit",localStorage);
      });
	 	 
  },
  joinLive : function(e){
	e.preventDefault();
	try{
	localStorage.setItem("page", "joinLive");
	localStorage.setItem("currTime",new Date().getTime());
	console.log("Click joinLive for session id " +e.target.attributes.liveid.value);
	let liveSessionId= e.target.attributes.liveid.value;
	localStorage.setItem(connection.socketMessageEvent, liveSessionId);
	console.log("joinLive" ,localStorage);
	document.getElementById("logo").hidden=true;
	document.getElementById("errMsg").innerHTML="Attempting Connection for Student to Join...";
	document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
	connection.sdpConstraints.mandatory = {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
		};
		connection.join(liveSessionId);
	setTimeout(function()
	{ 
	try{
	document.getElementsByClassName("media-box")[0].children[0].remove();
	}catch(err){
	}
	},5000);
	app.hideDivs();
	app.reconnectStundentOnDisconnect();	
		}
	catch(err){
	console.log("Invalid sessionid on Click Live" ,e);
	return;
	}	  
  },
 
	approveTeacher:function(e){
	e.preventDefault();
	console.log("approveTeacher-entry" ,localStorage);
	console.log("Teacher id to be approved ="+e.target.id);
	app.onTeacherDetails(e);
	app.acceptReject();
	app.onHome('home');
	localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
	console.log("approveTeacher-exit");
 	},
	approvedTeacher:function(e){
	console.log("approvedTeacher-entry" ,localStorage);
	console.log(e.target.id);
	let tid = e.target.id;
	console.log("AJAX to approve Teacher" ,'https://www.msquaresys.com/teacher/approveTeacher.php?teacherId='+tid);
	
	 $.ajax({
      url: 'https://www.msquaresys.com/teacher/approveTeacher.php?teacherId='+tid,
      dataType: 'json', crossOrigin: true, async:false,
	  success: function(data) {
       console.log("Teacher Approved : id ="+tid);
      },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Approve Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Approve Fail "+textStatus+'-'+xhr.statusText;
	  }
     });
	
	localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
	app.onLoginTeacherForTeacher();
	app.onHome("home");
	console.log("approvedTeacher-exit" ,localStorage);
	},
	rejectedTeacher:function(e){
	console.log("rejectedTeacher-entry" ,localStorage);
	console.log(e.target.id);
	let tid = e.target.id;
	console.log("AJAX to reject Teacher" ,'https://www.msquaresys.com/teacher/rejectTeacher.php?teacherId='+tid);
	
	 $.ajax({
      url: 'https://www.msquaresys.com/teacher/rejectTeacher.php?teacherId='+tid,
      dataType: 'json', crossOrigin: true, async:false,
	  success: function(data) {
       console.log("for Teacher Rejected : id ="+tid,data);
      },
	  error: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Reject Error "+textStatus+'-'+xhr.statusText;
	  },
	  fail: function(xhr, textStatus, errorThrown){
     	  document.getElementById('errMsg').innerHTML="Reject Fail "+textStatus+'-'+xhr.statusText;
	  }
     });
	
	localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
	app.onLoginTeacherForTeacher();
	app.onHome("home");
	console.log("rejectedTeacher-exit" ,localStorage);
	},
	reconnectStundentOnDisconnect:function() {
	  let liveSessionId= localStorage.getItem(connection.socketMessageEvent);
	  console.log("reconnectStundentOnDisconnect-entry",liveSessionId);
	  if(null==liveSessionId){
		  return;
	  }
	  connection.checkPresence(liveSessionId, function(isRoomExist) {
			console.log("checkPresence liveSessionId isRoomExist",liveSessionId,isRoomExist);
            if (isRoomExist) {
				 document.getElementById('errMsg').innerHTML="Student is Connected.";
				 if(connection.studentDisconnected){
					  document.getElementById('errMsg').innerHTML="Student is Connecting Again.";
					  connection.join(liveSessionId);
					  connection.studentDisconnected=false;
					    setTimeout(function()
						{ 
						document.getElementsByClassName("media-box")[0].children[0].remove();
						},5000);
				 }

			}
			else{
				 document.getElementById('errMsg').innerHTML="Probably Teacher is Disconnected. Attempting Retry "+new Date();
				 connection.studentDisconnected=true;
			}
	  });
	  localStorage.setItem("backToTeacher",true);
      setTimeout(app.reconnectStundentOnDisconnect, 5000);
	},
	reCheckRoomPresence: function() {
	  localStorage.setItem("currTime",new Date().getTime());
	  let liveSessionId= localStorage.getItem(connection.socketMessageEvent);
	  console.log("reCheckRoomPresence-entry",liveSessionId);
	  if(null==liveSessionId){
		  return;
	  }
        connection.checkPresence(liveSessionId, function(isRoomExist) {
			console.log("checkPresence liveSessionId isRoomExist",liveSessionId,isRoomExist);
            if (isRoomExist) {
               if(localStorage.getItem("role")=="Teacher"){
				 document.getElementById('errMsg').innerHTML="Broadcasting now 2...";
				 }else{	 
				 document.getElementById('errMsg').innerHTML="Student is Connected.";
				 }
				 document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
			     localStorage.setItem("backToTeacher",true);
				 app.hideDivs();
                
            }
			else{
			 document.getElementById('errMsg').innerHTML="No Live Session."
			 console.log("checkPresence joining againg ",liveSessionId);
			 connection.join(liveSessionId);
			 
			}
			
			localStorage.setItem("backToTeacher",true);
            setTimeout(app.reCheckRoomPresence, 5000);
        });
    }
};
app.initialize(); 
