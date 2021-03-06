//Plugin JS
var divShowing;
var workingSet=[];
var WifiPlugin = {
		callNativeFunction: function (success, fail, native_action, resultType) {
		return cordova.exec( success, fail, "com.wifi.wifigeolocator", native_action, [resultType]);
		}
	}; 
	APobj = new Object();
	APobj.ssid = "NULL";
	APobj.mac="NULL";
	APobj.security="NULL"; 
	APobj.frequency=-999;
	APobj.signal=-999;
	APobj.lat=0;
	APobj.lon=0;



	function startButtonPressed(scanType){
		if(latitude!=-999 && longitude!=-999){
				inter=setInterval(function(){startScanning(scanType)}, scanState*1000);
		}else{
			alert("You need to turn on your GPS");
		}
		$('#startButton').hide();
		$('#stopButton').show();
		$('#analyzeStartButton').hide();
		$('#analyzeStopButton').show();
	}
	function stopButtonPressed(){
		clearInterval(inter);
//		stat.innerHTML="Idle"; 
		$('#stopButton').hide();
		$('#startButton').show();
		$('#analyzeStopButton').hide();
		$('#analyzeStartButton').show();
	}
	function turnOnWifi(){
		WifiPlugin.callNativeFunction(wifiNativePluginSuccessHandler, nativePluginErrorHandler, "TurnOn", null);
	}
	function turnOffWifi(){
		WifiPlugin.callNativeFunction(wifiNativePluginSuccessHandler, nativePluginErrorHandler, "TurnOff", null);
	}
	function startScanning(scanType) {
		WifiPlugin.callNativeFunction(scanType, nativePluginErrorHandler, "Scan", null);
	}

	function captureNativePluginSuccessHandler(result) {
		var latt=latitude;
		var longg=longitude
		var key, i=0, str;
		var newRes = [];
		for(key in result.AP){
			var obj = {
			ssid: result.AP[key].SSID,
			mac: result.AP[key].MAC,
			security: result.AP[key].SECURITY,
			frequency: result.AP[key].FREQUENCY,
			signal: result.AP[key].SIGNAL,
			lat: latitude,
			lon: longitude,
			};
			upload(obj);
		}

	}
	function analyzeNativePluginSuccessHandler(result){
		var key, i=0, str=" ";
		var arr = [], ids=[];
		var previous="", next="", identity="";
		
		for(key in result.AP){
			var obj = {
			ssid: result.AP[key].SSID,
			mac: result.AP[key].MAC,
			security: result.AP[key].SECURITY,
			frequency: result.AP[key].FREQUENCY,
			signal: result.AP[key].SIGNAL,
			lat: latitude,
			lon: longitude,
			};

			arr.push(obj);
		}

		for(i=0; i<arr.length; i++) {
			identity=arr[i].ssid;
			identity = identity.replace(/\s+/g, '');
			var signal = 100-Math.abs(arr[i].signal);
			if(i!=arr.length-1) next=arr[i+1].ssid;

			if(arr[i].ssid!=previous) {

					ids.push(identity);
					str+="<div onclick=\"showDiv(\'listdiv"+identity+"\')\" id=\"maindiv"+arr[i].ssid+"\" data-role=\"listview\" data-inset=\"true\"><table><tr><td><h3>"+arr[i].ssid+"<h3></td><td><progress value="+signal+" max=\"100\"></progress>"+arr[i].signal+"</td></tr><tr><td>Channel:"+arr[i].frequency+"</td><td>Security: "+arr[i].security+"</td></tr></table></div>";

				if(arr[i].ssid==next)
				{ 
				str+="<div id=\"listdiv"+identity+"\" class=\"sublists\" data-role=\"listview\" data-inset=\"true\">";
				}
				previous=arr[i].ssid;
				
			}else{
				
				str+="<li class =\"aps"+arr[i].ssid+"\" data-role=\"listview\" data-inset=\"true\"><table><tr><td><h3>"+arr[i].ssid+"<h3></td><td><progress value="+signal+" max=\"100\"></progress>"+arr[i].signal+"</td></tr><tr><td>Channel:"+arr[i].frequency+"</td><td>Security: "+arr[i].security+"</td></tr></table></li>";
				if(next!=arr[i].ssid)
					str+="</div>";
					 
				previous=arr[i].ssid;
			
			}
		}
		$(".aps").trigger("create");
		$('#analyzeResults').html(str);
		$("#analyzeResults").trigger("create");
		$(".sublists").hide();
		$("#"+divShowing).show();
	}
	function nativePluginErrorHandler(result) {
		alert("Error "+result);
	}
	function wifiNativePluginSuccessHandler(result){
	}
	
	function showDiv(divToShow) {
		if ( $("#"+divToShow).is(':visible') )
			divShowing="";
		else 
			divShowing=divToShow;
		$("#"+divToShow).toggle();
	}	
	function upload(toUp){
		var xmlhttp=new XMLHttpRequest();
		console.log(toUp.ssid);
		var url="http://jmellor.net/wardriveapp/post.php?";
		url +="lat="+toUp.lat+"&long="+toUp.lon+"&ssid="+toUp.ssid+"&mac="+toUp.mac+"&freq="+toUp.frequency+"&sec="+toUp.security+"&signal="+toUp.signal;
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);

		console.log(url);
	}

	
	
