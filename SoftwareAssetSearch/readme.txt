To use:
Copy the code in custom_SoftwareAssetSearch.js , and place it anywhere in your customspace folder. Alternatively, copy the file and place it into your customspace directory, and then add the following line to your custom.js file:
$.getScript("/CustomSpace/custom_SoftwareAssetSearch.js");

Purpose:
After this script is in place, it will add an input box within the Software Asset navigation node on the left, which allows a very fast dynamic search of software assets by Display Name. 

Tips and tricks
1. This input box does follow navigation node permissions, but it will also only appear if the user is in the AssetManager AD group, or is an SCSM admin. 
