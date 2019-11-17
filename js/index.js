var labels;
var languages=[]; 				 
var app = {
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
		localStorage.setItem("page","initialize");
		console.log("initialize",localStorage);
		$.ajax({
          url: 'https://www.msquaresys.com/teacher/getLanguages.php',
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
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
      	  document.getElementById('errMsg').innerHTML="Language Load Error "+textStatus+'-'+xhr.statusText;
		  }
        });
				
		this.hideDivs();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.getElementById('language').addEventListener('change',  this.onLanguageChange.bind(this), false);
		document.addEventListener('loginSuccess', this.onLoginTeacher.bind(this), false);
		document.addEventListener('loginFail', this.onLoginFail.bind(this), false);
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
		  }, 300);
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
		divLoginData.appendChild(document.createElement('hr'));
		document.getElementById("loginPage").append(divLoginData);
		
		inputloginUserTeacher.addEventListener('click',  this.onLoginForTeacher.bind(this), false);
		inputTeacherSignUp.addEventListener('click',  this.onTeacherRegistrationPage.bind(this), false);
		console.log("onLoginLanding exit");
	},
	onTeacherRegistrationPage: function(){
		localStorage.setItem("page","onTeacherRegistrationPage");
		console.log("onLoginLanding entry",localStorage);
		this.hideDivs();
		
		  
		var teacherRegistrationPage=document.getElementById("teacherRegistrationPage");
		teacherRegistrationPage.hidden=false;
		teacherRegistrationPage.setAttribute('align','center');
		 
		 let selectCategoryHtml="";
		 
		 for(var i=0;i<languages.length;i++){
			 selectCategoryHtml+=" <option value="+labels[languages[i].name]+" >"+labels[languages[i].name]+"</option>";
		 }
		 selectCategoryHtml ="<select> "+selectCategoryHtml+"</select>";

		 
		 
		teacherRegistrationPage.appendChild(document.createTextNode(labels['lblTeacherSignup']));
		teacherRegistrationPage.appendChild(document.createElement('hr'));
	 
		
		let input_table = document.createElement('table');
		
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
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
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
		 teacherRegistrationPage.appendChild(formImg);
	   }
		
	   {
	   // video 
		 let imgDiv =document.createElement('div');
		 imgDiv.setAttribute('id','uploadFormLayerVideo');
		 
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
		 
		 teacherRegistrationPage.appendChild(formImg);
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
	  
	   $("#registerTeacherSave").on('click',(function(e) {
	     
		e.preventDefault();
		 $("#uploadFormPhoto").submit();
		 $("#uploadFormVideo").submit();
 
		$.ajax({
        	url: "#registerTeacherSave.php",
			type: "POST",
			data:  new FormData(this),
		    success: function(data)
		    {
			 console.log(data);
		    },
		  	error: function() 
	    	{
			 console.log(data);
	    	} 	        
	   });
	  }));
	   //document.getElementById("registerTeacher").addEventListener('click',  this.registerTeacher.bind(this), false);
	   app.onHome("changeLang");
	   console.log("onTeacherRegistrationPage exit");
	},
	spanUploadPhoto: function(){
		console.log("spanUploadPhoto");
	},
	spanUploadVideo: function(){
		console.log("spanUploadVideo");
	},
	registerTeacher: function(){ 
        //stop submit the form, we will post it manually.
        event.preventDefault();

        // Get form
        var form = $('#fileUploadForm')[0];

		// Create an FormData object 
        var data = new FormData(form);

		// If you want to add an extra field for the FormData
        data.append("CustomField", "This is some extra data, testing");

		// disabled the submit button
        $("#btnSubmit").prop("disabled", true);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/api/upload/multi",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {

                $("#result").text(data);
                console.log("SUCCESS : ", data);
                $("#btnSubmit").prop("disabled", false);

            },
            error: function (e) {

                $("#result").text(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);

            }
        });

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
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
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
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
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
		let teacherLogin = this.getLogin(document.getElementById('loginName').value, document.getElementById('loginPasswd').value);
		document.getElementById("loginName").value='';
	    document.getElementById("loginPasswd").value='';
		 if(teacherLogin){ 
	      localStorage.setItem("role","Teacher");
	      localStorage.setItem("teacher",JSON.stringify(teacherLogin));
		  this.onLoginTeacher();
	     }else{
			 console.log("login fail");
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
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
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
         }); //end of ajax
		} // for loop  
		app.onImgDisplay();	
		app.onHome("home");
    },
	onLoginTeacherForTeacher: function() {
		localStorage.setItem("page","onLoginTeacher");
   	    //data
		let teacherMain=JSON.parse(localStorage.getItem("teacher"));
		this.hideDivs();
		document.getElementById("homePage").hidden=false;
		
		
		$.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachers.php?teacherId='+teacherMain.id,
          dataType: 'json',
		  async:false,
		  crossOrigin: false,
          success: function(data) {
		   console.log('inside getTeacherSession - Log1',data);
			 data.rows.forEach(function(t){ 
			let img= document.createElement('img');
		    img.setAttribute('src',t.photo_src);
		    img.setAttribute('alt', t.name);
		    img.setAttribute('id', t.id);
		 
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
		  }
		});
		
		 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeacherSession.php?teacherId='+teacherMain.id,
          dataType: 'json',
		  async:true,
		  crossOrigin: true,
          success: function(data) {
		   console.log('inside getTeacherSession - log2',data);
		   if(data.total=="null"){
			   return;
		   }
		   let table= document.createElement('table'); 
		   let schedules=document.createElement('div');
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
			if(Date.parse(t.startTime)<Date.now() && Date.parse(t.endTime)>Date.now()){
		       let live= document.createElement('a');
		       live.setAttribute('liveid',t.lang_id+'_'+t.teacher_id);
		       live.setAttribute('href','./#forward');
		       live.addEventListener('click',  app.goingLive.bind(this), true);
		       live.appendChild(document.createTextNode(' '+labels['lblGoLive']+' '));
			   td2.appendChild(live);
			}
			
			   
			let teacherSessionCloseSpan= document.createElement('span'); 
			teacherSessionCloseSpan.setAttribute('id',t.s_id);
			teacherSessionCloseSpan.setAttribute('class','glyphicon glyphicon-file');
			teacherSessionCloseSpan.innerHTML=labels['lblDismissSession'];
			 
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
			document.getElementById("homePageContent").appendChild(schedules);
			} //end of success
	    }); //end of ajax
	 
			//check admin 
		 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeachersForApproval.php?teacherId='+teacherMain.id,
          dataType: 'json',
		  async:true,
		  crossOrigin: true,
          success: function(data) {
		   console.log('inside getTeachersForApproval ',data);
		   if(data.total==0){
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
		       approve.innerHTML=' '+labels['lblApprove'];
		       teacherApprove.appendChild(approve);
		     
		     				   
		    approvals.appendChild(teacherApprove);
		   
		    });
			 document.getElementById("homePageContent").appendChild(approvals);
			} //end of success
	    }); //end of ajax
		
		  
		app.onImgDisplay();	
		app.onHome("home");
    },
	onLoginFail: function() {
	//console.log("Failed ");
	document.getElementById("logo").hidden=false;
	},
	onShowMore: function(code) {
		console.log('onShowMore entry', code);
		localStorage.setItem("page","onShowMore");
		app.hideDivs();
		document.getElementById("showAllPage").hidden=false;
		//console.log(code.target.attributes.l);
	    let lid;
		try{
			 lid= app.getLanguage(code.target.attributes.l.value);
			 localStorage.setItem("showmoreLang",JSON.stringify(lid));
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
          dataType: 'json',
		  async:true,
		  crossOrigin: true,
          success: function(data) {
            data.rows.forEach(function(t){ 
			//console.log(t);
		    let img= document.createElement('img');
		    img.setAttribute('src',t.photo_src);
		    img.setAttribute('alt', t.name);
		    img.setAttribute('id', t.id); 
		    
		    
	        let divgallery= document.createElement('div');
		    divgallery.setAttribute('class','gallery');
			divgallery.setAttribute('id',t.id);
		    divgallery.append(img);
		    document.getElementById("showAllPage").appendChild(divgallery);
		    
		    let divDesc= document.createElement('div');
			divDesc.setAttribute('id',t.id);
		    divDesc.innerHTML=labels['lblName'] +' : ' + t.name+ '<span id ='+t.id+' style="float:right" class="glyphicon glyphicon-heart">'+t.rating+'</span><br>  '+labels['lblLocation'] +' :<span  id ='+t.id+' >'+t.loc+'</span>'
		    divgallery.append(divDesc);
		   });
		  app.onImgDisplay();
		  app.onHome("home");
          }
        });
	 },
	onTeacherDetails: function(teacher) {
		localStorage.setItem("page","onTeacherDetails");
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
	   ht+="<table>";
       ht+="<tr><td rowspan=8 style='padding:5px'><img src="+t.photo_src+" alt="+t.name+" id="+t.id+"></td><td style='padding-left:5px'>"+labels['lblName']+"</td><td style='padding-left:5px'>"+t.name+"</td></tr>" ;
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
	 $.ajax({
          url: 'https://www.msquaresys.com/teacher/getTeacherSession.php?teacherId='+t.id,
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
          success: function(data) {
			  data.rows.forEach(function(t){
				 if(Date.parse(t.endTime)>Date.now()){  
			      let teacherSession= document.createElement('span');
		   	      teacherSession.setAttribute('class','glyphicon glyphicon-check');
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
			      }
			      teacherSession.appendChild(document.createElement("br"));
			      document.getElementById('sessions_'+t.teacher_id).appendChild(teacherSession);
				}
			  });
		  }
        }); 
		this.onHome("home");
	},
	 
	killSession:function(e){
	console.log("killSession -entry",e, e.target.id);
	let teacherSessionId = e.target.id;
	$.ajax({
          url: 'https://www.msquaresys.com/teacher/killTeacherSession.php?teacherSessionId='+teacherSessionId,
          dataType: 'json',
		  async:false,
		  crossOrigin: true,
          success: function(data) {
		  console.log("removing "+document.getElementById(teacherSessionId));
		  document.getElementById("tr_"+teacherSessionId).remove();
		  //document.getElementById(e.target.id).remove();
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
      dataType: 'json',
	  async:false,
	  crossOrigin: true,
      success: function(data) {
        data.rows.forEach(function(item){ 
	  	teachers.push(item);
	    });
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
	onHome : function(bothHomeAndLogOut){
		document.getElementById("containerFooter").innerHTML="";
		let hr =document.createElement('hr');
		hr.setAttribute('style','margin-top: 10px; margin-bottom: 10px;');
		if(bothHomeAndLogOut=='home'){
		document.getElementById("containerFooter").appendChild(hr); 
		let homespan= document.createElement('span');
		homespan.setAttribute('id','Home');
		homespan.setAttribute('class','glyphicon glyphicon-home'); 
		homespan.setAttribute('style','float :left');
		homespan.appendChild(document.createTextNode(' '+labels['lbl'+localStorage.getItem('role')]+' '+labels['lblHome']));
		document.getElementById("containerFooter").appendChild(homespan);
		
		document.getElementById("containerFooter").appendChild(document.createTextNode(" "));
		homespan.addEventListener('click',  this.onLoginTeacher.bind(this), false); 
		}
		else if(bothHomeAndLogOut=='homeApprove'){
		document.getElementById("containerFooter").appendChild(hr); 
		let homespan= document.createElement('span');
		homespan.setAttribute('id','Home');
		homespan.setAttribute('class','glyphicon glyphicon-home'); 
		homespan.setAttribute('style','float :left');
		homespan.appendChild(document.createTextNode(' '+labels['lbl'+localStorage.getItem('role')]+' '+labels['lblHome']));
		document.getElementById("containerFooter").appendChild(homespan);
		
		document.getElementById("containerFooter").appendChild(document.createTextNode(" "));
		homespan.addEventListener('click',  this.onLoginTeacher.bind(this), false); 
		
		document.getElementById("containerFooter").appendChild(document.createTextNode(" "));
		let approveTeacherspan= document.createElement('span');
		let teacherTobeApproved= JSON.parse(localStorage.getItem('teacher')).id;
		approveTeacherspan.setAttribute('id',teacherTobeApproved);
		approveTeacherspan.setAttribute('class','glyphicon glyphicon-file'); 
		approveTeacherspan.setAttribute('style','float :left');
		approveTeacherspan.appendChild(document.createTextNode(' '+labels['lblApprove']));
		document.getElementById("containerFooter").appendChild(approveTeacherspan);
		
		document.getElementById("containerFooter").appendChild(document.createTextNode(" "));
		localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
		approveTeacherspan.addEventListener('click',  this.approvedTeacher.bind(this), false); 
		}
		let resetspan= document.createElement('span');
		resetspan.setAttribute('id','Logout');
		resetspan.setAttribute('class','glyphicon glyphicon-log-out'); 
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
	   liveSessionId= e.target.attributes.liveid.value;
	   localStorage.setItem(connection.socketMessageEvent, liveSessionId);
	   localStorage.setItem("page", "goingLive");
	   
	   console.log("Click" ,localStorage);
	   document.getElementById("logo").hidden=true;
	   document.getElementById("errMsg").innerHTML="Attempting Connection...";
       }
	  catch(err){
	   console.log("Invalid sessionid on Click Live" ,e);
	   return;
	  }
	  if(localStorage.getItem("role")=="Teacher"){ 
	   console.log("role is teacher so opening Broadcast ",liveSessionId);
	   connection.open(liveSessionId, function() {
       setTimeout(function()
	    { 
		console.log("Check Broadcast Opened -Entry",localStorage);
	    document.getElementsByClassName("media-box")[0].children[0].remove();
		document.getElementById("logo").hidden=true;
		  if(localStorage.getItem("role")=="Teacher"){
		   document.getElementById('errMsg').innerHTML="Broadcasting now...";
		  }else{	 
		   document.getElementById('errMsg').innerHTML="Connected.";
		  }
		  console.log("Check Broadcast Opened -Exit",localStorage);
		  document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
			
		},5000);
		
		document.getElementById("errMsg").innerHTML="Attempting Connection Open...";
		 console.log("Post Attempting  -Exit",localStorage);
      });
	 }
	 else{
		connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      };
      connection.join(liveSessionId);
	
	 }
 app.reCheckRoomPresence();	 
  },joinLive : function(e){
	  let liveSessionId;
	  e.preventDefault();
	  try{
	   console.log("Click joinLive for session id " +e.target.attributes.liveid.value);
	   liveSessionId= e.target.attributes.liveid.value;
	   localStorage.setItem(connection.socketMessageEvent, liveSessionId);
	   localStorage.setItem("page", "joinLive");
	   
	   console.log("joinLive" ,localStorage);
	   
	  /* let section= document.createElement('section');
		section.setAttribute('id','vbContainer');
		section.setAttribute('class','make-center');
		
		  let span1= document.createElement('span');
		span1.setAttribute('id','connText');
		
		  let div2= document.createElement('div');
		div2.setAttribute('id','videos-container');
		div2.setAttribute('style','margin: 5px 0');
		
		  let span3= document.createElement('span');
		span3.setAttribute('id','backToTeacher');
		span3.appendChild(document.createTextNode(' '+labels['lblBack']));
		
		section.appendChild(span1);
		section.appendChild(div2);
		section.appendChild(span3);
		

		document.getElementById("bc").appendChild(section);		
	    */
	   
	   
	   
	   document.getElementById("logo").hidden=true;
	   document.getElementById("errMsg").innerHTML="Attempting Connection...";
       }
	  catch(err){
	   console.log("Invalid sessionid on Click Live" ,e);
	   return;
	  }
	  if(localStorage.getItem("role")=="Teacher"){ 
	   console.log("role is teacher so opening Broadcast");
	   connection.open(liveSessionId, function() {
       setTimeout(function()
	    { 
		console.log("Check Broadcast Opened -Entry",localStorage);
	    document.getElementsByClassName("media-box")[0].children[0].remove();
		document.getElementById("logo").hidden=true;
		  if(localStorage.getItem("role")=="Teacher"){
		   document.getElementById('errMsg').innerHTML="Broadcasting now...";
		  }else{	 
		   document.getElementById('errMsg').innerHTML="Connected.";
		  }
		  console.log("Check Broadcast Opened -Exit",localStorage);
		  document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
			
		},5000);
		
		document.getElementById("errMsg").innerHTML="Attempting Connection Open...";
		 console.log("Post Attempting  -Exit",localStorage);
      });
	 }
	 else{
		connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      };
      connection.join(liveSessionId);
	
	 }
 app.reCheckRoomPresence();	 
  },
 
	approveTeacher:function(e){
	e.preventDefault();
	console.log("approveTeacher-entry" ,localStorage);
	console.log("Teacher id to be approved ="+e.target.id);
	app.onTeacherDetails(e);
	app.onHome('homeApprove');
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
      dataType: 'json',
	  async:false,
	  crossOrigin: true,
      success: function(data) {
       console.log("Teacher Approved : id ="+tid);
      }
     });
	
	localStorage.setItem("teacher", localStorage.getItem('adminTeacher'));
	app.onLoginTeacherForTeacher();
	app.onHome("home");
	console.log("approvedTeacher-exit" ,localStorage);
	},
	reCheckRoomPresence: function() {
	  app.hideDivs();
	  let liveSessionId= localStorage.getItem(connection.socketMessageEvent);
	  console.log("-entry",liveSessionId);
	  if(null==liveSessionId){
		  return;
	  }
        connection.checkPresence(liveSessionId, function(isRoomExist) {
            if (isRoomExist) {
                connection.join(liveSessionId);
				if(localStorage.getItem("role")=="Teacher"){
				 document.getElementById('errMsg').innerHTML="Broadcasting now...";
				 }else{	 
				 document.getElementById('errMsg').innerHTML="Connected.";
				 }
                return;
            }
			document.getElementById('errMsg').innerHTML="No Live Session."
			 document.getElementById("backToTeacher").innerHTML=labels['lblBack'];
			localStorage.setItem("backToTeacher",true);
            setTimeout(app.reCheckRoomPresence, 5000);
        });
    }
};
app.initialize(); 
 