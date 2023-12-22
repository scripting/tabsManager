const appConsts = {
	urlFeedlandServer: "https://feedland.com/"
	}
var theTabs =  {
	all: {
		enabled: true,
		name: "All",
		description: "News from all the feeds Dave is following.",
		screenname: "davewiner",
		catname: "All"
		},
	politics: {
		enabled: true,
		name: "Politics",
		description: "Political news from the feeds Dave is following.",
		screenname: "davewiner",
		catname: "politics"
		}
	}
function startup () {
	console.log ("startup");
	const allparams = getAllUrlParams (location.search);
	function deleteTabCallback (tabRec) {
		console.log ("deleteTabCallback: tabRec == " + jsonStringify (tabRec));
		}
	function getInfoTableForTab (tabRec) {
		var htmltext = "";
		function add (s) {
			htmltext += s;
			}
		add ("<table>");
		function addRow (name, flSpan2=false) {
			add ("<tr>");
			if (flSpan2) {
				add ("<td colspan=\"2\">" + tabRec [name] + "</td>");
				}
			else {
				add ("<td>" + name + "</td>");
				add ("<td>" + tabRec [name] + "</td>");
				}
			add ("</tr>");
			}
		addRow ("name");
		addRow ("enabled");
		addRow ("description", true);
		add ("</table>");
		return (htmltext);
		}
	const options = {
		whereToAppend: $(".divPageBody"),
		containerClass: "divDemoTabsContainer",
		nameActiveTab: allparams.tab,
		theTabs,
		deleteTabCallback,
		getInfoTableForTab
		};
	tabsManager (options);
	}
