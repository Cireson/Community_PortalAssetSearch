/* ----------------------------------------------- */
/* ------------ Hardware Asset Search ------------ */
/* ----------------------------------------------- */
// v6.0.RC
// Contributors: William Udovich, Joivan Hedrick
// Description: Adds hardware asset search functionality to the navigation node. 
// Legacy edition uses a setTimeout, unstead of MutationObserver. setTimeout still exists in IE10, whereas MutationObserver does not.
$(document).ready(function () {
	if (session.user.AssetManager === 0 && session.user.IsAdmin === false) {
		return;
	}
		
	var hardwareAssetNav = $(".nav_trigger").find("h4:contains(Hardware Assets)").first().parent();
	if (hardwareAssetNav.length === 0) {
		setTimeout(
			function() {
				//re-obtain the hardware asset nav node. 
				fn_AddHardwareAssetSearchField();
			}, 
		2500);
	}
	else
		fn_AddHardwareAssetSearchField(hardwareAssetNav);
	
	//Create the function for creating the search control.
	function fn_AddHardwareAssetSearchField (navNodeDiv) {
		if (navNodeDiv === undefined) 
			navNodeDiv = $(".nav_trigger").find("h4:contains(Hardware Assets)").first().parent(); //There "should" always only be one. But do first() just in case. 
		$(navNodeDiv).append("<div class='customassetsearch' style='margin-left: 10px; margin-top: 10px;'>" + 
								"<div style='color:#fff; font-family:'400 18px/22px',?'Segoe UI',?'Open Sans',?Helvetica,?sans-serif; display:inline-block; width: 100%;'>" + 
									"Hardware Asset Search:&nbsp;" + 
								"</div>" + 
								"<input type='text' id='searchAsset' style='color: #000000; width: 95%;' />" + 
							"</div>");
		$("#searchAsset").kendoAutoComplete({
			dataTextField: "DisplayName",
			filter: "contains",
			placeholder: "Type the name...",
			minLength: 3,
			delay: 500,
			dataSource: { 
				type: "json",
				serverFiltering: true,
				transport: {
					read: {
						url:"/api/V3/Config/GetConfigItemsByAbstractClass?userId=" + session.user.Id + "&isUserScoped=false&objectClassId=c0c58e7f-7865-55cc-4600-753305b9be64" 
					},
					parameterMap: function (options) {
							return { searchFilter: options.filter.filters[0].value };
					}
				}
			},
			select: function(e) {
				var newWindow = window.open('/AssetManagement/HardwareAsset/Edit/' + this.dataItem(e.item.index()).Id, '_blank');
				newWindow.focus();
			},
			change: function(e) {
				//$("#searchAsset").data("kendoAutoComplete").value(""); 
			}
		});
		
		$hwAssetNavTriggerLi = navNodeDiv.parent().parent().parent(); //declared here for scope.
		$hwAssetMouseOutNavNodeHandler = $._data( $hwAssetNavTriggerLi[0], 'events' ).mouseout[0].handler;; //declared here for scope. //Save the OOB mouseout event, so we can disable it for now, but re-add it later.
		
		$("#searchAsset").on('keyup', function(e){
			
			var assetSearchText = $("#searchAsset").val(); //Get the value that the user typed in. 
			
			//If the autocomplete text is empty, then allow default OOB behavior. Otherwise, disable the OOB mouseout.
			if (assetSearchText === "")
				cancelAndRestoreHwNavEvents(false);
			else if (e.which == 32 && e.target == $("#searchAsset")[0]) { //Sometimes, when pressing the space bar (char 32), the browser page scrolls. Usually in IE. Can't disable it easily, but adjust for it.
				if (assetSearchText.split("").reverse()[0] != " ") { //the last character isn't a space.
					$("#searchAsset").data("kendoAutoComplete").value(assetSearchText + " "); //add one space manually.
				}
			}
			else if (e.which != 27)  { //Something was typed into the search. Just disable the OOB nav-list mouseout event. Escape key is handled elsewhere.
				$hwAssetNavTriggerLi.off('mouseleave');
			}
		});
		
		//Since the asset search doesn't disappear while there's still text in it, add a window-wide escape event.
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { // escape key is keycode 27
				if (e.target == $("#searchAsset")[0]) 
					cancelAndRestoreHwNavEvents(false);
				else
					cancelAndRestoreHwNavEvents(true);
			}
		});
	}
	
	function cancelAndRestoreHwNavEvents(blnTriggerMouseLeave) {
		$("#searchAsset").data("kendoAutoComplete").value(""); 
		$hwAssetNavTriggerLi.on('mouseleave', $hwAssetMouseOutNavNodeHandler);
		if (blnTriggerMouseLeave === true) {//trigger the event to close the pane.
			$hwAssetNavTriggerLi.mouseleave();
		}
	}
		
});
/* ----------------------------------------------- */
/* ---------- End Hardware Asset Search ---------- */
/* ----------------------------------------------- */