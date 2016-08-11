/* ----------------------------------------------- */
/* ------------ Software Asset Search ------------ */
/* ----------------------------------------------- */
// v5.0.6.3
// Contributors: William Udovich, Joivan Hedrick
// Description: Adds software asset search functionality to the navigation node
$(document).ready(function () {
	if (session.user.AssetManager === 0 && session.user.IsAdmin === false) {
		return;
	}
		
	//The navigation node doesn't load immediately. Get the main div that definitely exists.
	var mainPageNode = document.getElementById('main_wrapper');
	
	var observer = new MutationObserver(function(mutations) {
		//The page changed. See if our element exists yet.
		if ($("#searchSoftwareAsset").length > 0) { //It was already added once from somewhere. Fixes an IE multi-observer bug.
			observer.disconnect();
			return;
		}
		
		var softwareAssetNav = $(".nav_trigger").find("h4:contains(Software Assets)").first().parent();
		if (softwareAssetNav.length > 0) {
			fn_AddSoftwareAssetSearchField(softwareAssetNav);
			observer.disconnect();
		}
	});
	 
	// configure the observer and start the instance.
	var observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };
	observer.observe(mainPageNode, observerConfig);
	
	//Create the function for creating the search control.
	function fn_AddSoftwareAssetSearchField (navNodeDiv) {
		if (navNodeDiv === undefined) 
			navNodeDiv = $(".nav_trigger").find("h4:contains(Software Assets)").first().parent(); //There "should" always only be one. But do first() just in case. 
		$(navNodeDiv).append("<div class='customassetsearch' style='margin-left: 10px; margin-top: 10px;'>" + 
								"<div style='color:#fff; font-family:'400 18px/22px',?'Segoe UI',?'Open Sans',?Helvetica,?sans-serif; display:inline-block; width: 100%;'>" + 
									"Software Asset Search:&nbsp;" + 
								"</div>" + 
								"<input type='text' id='searchSoftwareAsset' style='color: #000000; width: 95%;' />" + 
							"</div>");
		$("#searchSoftwareAsset").kendoAutoComplete({
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
						url:"/api/V3/Config/GetConfigItemsByAbstractClass?userId=" + session.user.Id + "&isUserScoped=false&objectClassId=81e3da4f-e41c-311e-5b05-3ca779d030db" 
					},
					parameterMap: function (options) {
							return { searchFilter: options.filter.filters[0].value };
					}
				}
			},
			select: function(e) {
				var newWindow = window.open('/AssetManagement/SoftwareAsset/Edit/' + this.dataItem(e.item.index()).Id, '_blank');
				newWindow.focus();
			},
			change: function(e) {
				//$("#searchSoftwareAsset").data("kendoAutoComplete").value(""); 
			}
		});
		
		$swAssetNavTriggerLi = navNodeDiv.parent().parent().parent(); //declared here for scope.
		$swAssetMouseOutNavNodeHandler = $._data( $swAssetNavTriggerLi[0], 'events' ).mouseout[0].handler;; //declared here for scope. //Save the OOB mouseout event, so we can disable it for now, but re-add it later.
		
		$("#searchSoftwareAsset").on('keyup', function(e){
			
			var assetSearchText = $("#searchSoftwareAsset").val(); //Get the value that the user typed in. 
			
			//If the autocomplete text is empty, then allow default OOB behavior. Otherwise, disable the OOB mouseout.
			if (assetSearchText === "")
				cancelAndRestoreSwNavEvents(false);
			else if (e.which == 32 && e.target == $("#searchSoftwareAsset")[0]) { //Sometimes, when pressing the space bar (char 32), the browser page scrolls. Usually in IE. Can't disable it easily, but adjust for it.
				if (assetSearchText.split("").reverse()[0] != " ") { //the last character isn't a space.
					$("#searchSoftwareAsset").data("kendoAutoComplete").value(assetSearchText + " "); //add one space manually.
				}
			}
			else if (e.which != 27)  { //Something was typed into the search. Just disable the OOB nav-list mouseout event. Escape key is handled elsewhere.
				$swAssetNavTriggerLi.off('mouseleave');
			}
		});
		
		//Since the asset search doesn't disappear while there's still text in it, add a window-wide escape event.
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { // escape key is keycode 27
				if (e.target == $("#searchSoftwareAsset")[0]) 
					cancelAndRestoreSwNavEvents(false);
				else
					cancelAndRestoreSwNavEvents(true);
			}
		});
	}
	
	function cancelAndRestoreSwNavEvents(blnTriggerMouseLeave) {
		$("#searchSoftwareAsset").data("kendoAutoComplete").value(""); 
		$swAssetNavTriggerLi.on('mouseleave', $swAssetMouseOutNavNodeHandler);
		if (blnTriggerMouseLeave === true) {//trigger the event to close the pane.
			$swAssetNavTriggerLi.mouseleave();
		}
	}
});
/* ----------------------------------------------- */
/* ---------- End Software Asset Search ---------- */
/* ----------------------------------------------- */