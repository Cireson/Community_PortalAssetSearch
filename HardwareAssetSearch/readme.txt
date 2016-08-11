To use:
Copy the code in custom_HardwareAssetSearch.js , and place it anywhere in your customspace folder. Alternatively, copy the file and place it into your customspace directory, and then add the following line to your custom.js file:
$.getScript("/CustomSpace/custom_HardwareAssetSearch.js");

Purpose:
After this script is in place, it will add an input box within the Hardware Asset navigation node on the left, which allows a very fast dynamic search of hardware assets by Display Name. 

Tips and tricks
1. You can use an automated process (scorch, workflow) to change the display name of all assets to include a serial number or asset tag. Then, this search will also natively search those fields too.
2. This input box does follow navigation node permissions, but it will also only appear if the user is in the AssetManager AD group, or is an SCSM admin. 
3. This script looks for the header "Hardware Assets". If you have modified this navigation node, then you will need to adjust the script accordingly.
