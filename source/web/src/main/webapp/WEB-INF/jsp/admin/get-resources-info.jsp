<!DOCTYPE html PUBLIC '-//W3C//DTD Xhtml 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html>
	<head>
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'>
		<meta name='apple-mobile-web-app-capable' content='yes'>
		<meta name='mobile-web-app-capable' content='yes'>
		<meta name='HandheldFriendly' content='True'>
		<meta name='MobileOptimized' content='320'>
		<script src='https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/admin/jquery.min.js'></script> 
		<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
		<link rel='shortcut icon' type='image/png' href='https://dkbg1jftzfsd2.cloudfront.net/favicon.png'/>
		<style type="text/css">
			body {
			    font-family: 'Open Sans', sans-serif!important;
			    font-size: 12px!important;
			    color: #333;
			    font-weight: 100!important;
			}
			#auth-button {
			    position: fixed;
			    bottom: 5px;
			    right: 5px;
			    z-index: 9999;
			}
			#logout{
				position: fixed;
			    top: 2px;
			    right: 2px;
			    text-decoration: none;
			    color: #3b73af;
			    z-index: 9999;
			}
			#mem-piechart, #disk-piechart, #heap-piechart{
				width: 390px;
				float: left;
			}
			#pieContainer{
				width: 1180px;
			}
			#chart_div{
				height: 380px;
			}
			#activeUser{
				font-size: 60px !important;
			    font-weight: 100;
			}
			@media (max-width:440px){
				#active-user-container,#processedFiles-container{
					margin-top: -9px;
				}
				#mem-piechart, #disk-piechart, #heap-piechart{
					width: 140px;
					margin-left: 28px;
				}
				#pieContainer{
					height: auto;
					width: auto;
				}
				#chart_div{
					height: 198px;
				}
				#activeUser{
					font-size: 16px !important;
				    display: inherit;
				    margin-left: 5px;
				    line-height: 0px;
				}
			}
			#workerInfoC{
				position: fixed;
			    bottom: 2px;
			    left: 2px;
			    text-decoration: none;
			    z-index: 9999;
			}
			@media (max-width:1030px) and (min-width:1020px){
				#mem-piechart, #disk-piechart, #heap-piechart{
					width: 330px;
				}
			}
			
			@media (max-width:1350px) and (min-width:1300px){
				#activeUser{
					font-size: 35px !important;
				}
			}
		</style>
	</head>
	<body style='font-family: "Segoe UI",Arial,sans-serif;'>
		<span id="workerInfoC" style='margin-top: 5px; margin-bottom: 0px;'>Worker: <span id="workerInfo">N/A</span></span>
	 	<a id = 'logout' style="display: none;" href="../j_spring_security_logout"> logout</a>
		<button id="auth-button" hidden="">auth</button>
		<input type="hidden" id="refreshIntervalInSec" value="${refreshIntervalInSec}"/>
		<div id="active-user-container" style="text-align: center; font-size: 15px; display: none;">
			<span>Active user(s)</span>
			<b><p id="activeUser" style='margin-top: 5px; margin-bottom: 0px;color: #3b73af;'>N/A</p></b> 
		</div>
		<div id="chart_div" style="width: 100%; margin-left: auto;margin-right: auto;float: none;"></div>
		
		<div id="pieContainer" style='margin-left: auto;margin-right: auto;float: none;'>
			<div id="mem-piechart"></div>
			<div id="disk-piechart"></div>
			<div id="heap-piechart"></div>
		</div>
		

		
		
		<script type="text/javascript">
			var hFree = 0, hUsed = 0, mFree = 0, mUsed = 0, cFree = 0, items_array =  new Array();
			$(document).ready(function(){
				google.charts.load('current', {'packages':['corechart']});
				drawChartRefresh(true);
			});
			
			function addCommas(nStr) {
			    nStr += '';
			    x = nStr.split('.');
			    x1 = x[0];
			    x2 = x.length > 1 ? '.' + x[1] : '';
			    var rgx = /(\d+)(\d{3})/;
			    while (rgx.test(x1)) {
			        x1 = x1.replace(rgx, '$1' + ',' + '$2');
			    }
			    return x1 + x2;
			}
			
			function drawChartRefresh(init){
				var refreshIntervalInSec = parseInt($('#refreshIntervalInSec').val());
				setTimeout(function(){
					items_array =  new Array();
					items_array.push(['', 'C', 'M', 'H', 'D']);
		        	$.ajax({
						dataType : 'json',
						url : '../admin/ajax/get-resources-info',
						type : 'POST',
						contentType: 'application/json; charset=utf-8',
						processData : false,
						success : function(result) {
							$('#workerInfo').text(result.availableWorker + '/' + result.workerPool);
							var latest = result.resourcesInfo[result.resourcesInfo.length - 1];
							
							hFree = parseInt(latest.hI.f);
							hUsed = parseInt(latest.hI.t) - hFree;
					      	google.charts.setOnLoadCallback(drawChartHeap);

							dFree = parseInt(latest.dI.fSMB);
							dUsed = parseInt(latest.dI.tSMB) - dFree;
					      	google.charts.setOnLoadCallback(drawChartDisk);
					      	
							mFree = parseInt(latest.mI.f);
							mUsed = parseInt(latest.mI.t) - mFree;
					      	google.charts.setOnLoadCallback(drawChartMem);
					      	for(var i = 0; i < result.resourcesInfo.length; i++){
					      		items_array.push([i == 0 ? ('-' + (Math.round( ((result.resourcesInfo.length*refreshIntervalInSec)/60) * 10) / 10) + 'm') : '', 
					      							parseInt(result.resourcesInfo[i].cU), 
					      							parseInt(result.resourcesInfo[i].mU),
					      							parseInt(result.resourcesInfo[i].hU),
					      							parseInt(result.resourcesInfo[i].dU)]);
					      	}
					      	google.charts.setOnLoadCallback(drawChart);
					      	drawChartRefresh(false);
						},
						error : function(jqXHR, exception) {
							$('#logout').css('color','#f00');
							//location.reload();
						}
					});
				}, init ? 0 : 2000);
			};
			
			
	      	function drawChart() {
	          var data = google.visualization.arrayToDataTable(items_array);

	          var options = {
	  	            vAxis: {title: 'Percent',viewWindowMode:'explicit',
	  	                viewWindow:{
	  	                    max:100,
	  	                    min:0
	  	                  }},
	  	            legend: 'bottom'
	  	          };

	          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	          chart.draw(data, options);
	        }
	      	
	      	function drawChartHeap() {
		        var data = google.visualization.arrayToDataTable([
		          ['Task', 'Heap'],
		          ['Free',      hFree],
		          ['Used',     hUsed]
		        ]);

		        var options = {
		          title: 'Heap(MB)',
		          pieSliceText: 'value',
		          legend: {position: 'none'}
		        };

		        var chart = new google.visualization.PieChart(document.getElementById('heap-piechart'));
		        chart.draw(data, options);
		    };
	      	
	      	
	      	function drawChartMem() {
		        var data = google.visualization.arrayToDataTable([
		          ['Task', 'Memory'],
		          ['Free',      mFree],
		          ['Used',     mUsed]
		        ]);

		        var options = {
		          title: 'Memory(MB)',
		          pieSliceText: 'value',
		          legend: {position: 'none'}
		        };

		        var chart = new google.visualization.PieChart(document.getElementById('mem-piechart'));
		        chart.draw(data, options);
		    };

			function drawChartDisk() {
		        var data = google.visualization.arrayToDataTable([
		          ['Task', 'Disk'],
		          ['Free',      dFree],
		          ['Used',     dUsed]
		        ]);

		        var options = {
		          title: 'Disk(MB)',
		          pieSliceText: 'value',
		          legend: {position: 'none'}
		        };

		        var chart = new google.visualization.PieChart(document.getElementById('disk-piechart'));
		        chart.draw(data, options);
		    };
		    
		</script>

	</body>
</html>
