function tabsManager (userOptions, callback) {
	console.log ("tabsManager");
	
	var divTabContent = undefined;
	
	const options = {
		defaultType: "river",
		defaultIcon: "fa fa-file-alt",
		flDescriptionTooltip: false,
		flConfirmTabClosing: true,
		containerClass: "tabsContainer",
		nameActiveTab: undefined,
		theTabs: undefined,
		deleteTabCallback: function (tabRec) {
			},
		getInfoTableForTab: function (tabRec) {
			return (undefined);
			}
		};
	for (var x in userOptions) {
		if (userOptions [x] !== undefined) {
			options [x] = userOptions [x];
			}
		}
	
	function getNthTab (n) {
		var ix = 0;
		for (var x in options.theTabs) {
			if (ix == n) {
				return (options.theTabs [x]);
				}
			ix++;
			}
		return (undefined);
		}
	
	if (options.nameActiveTab === undefined) { //not set by caller
		options.nameActiveTab = getNthTab (0).name;
		}
	
	function viewRiver (tabRec) {
		const riverSpec = {
			screenname: tabRec.screenname,
			catname: tabRec.catname
			};
		if (tabRec.riverDisplayData === undefined) {
			displayTraditionalRiver (riverSpec, divTabContent, undefined, function (err) {
				if (err) {
					console.log (err.message);
					}
				else {
					tabRec.riverDisplayData = $(".divRiverDisplay");
					}
				});
			}
		else {
			divTabContent.append (tabRec.riverDisplayData);
			}
		}
	function displayTabContents (tabRec) {
		divTabContent.empty ();
		
		const theType = (tabRec.type === undefined) ? options.defaultType : tabRec.type;
		switch (theType) {
			case "river":
				viewRiver (tabRec);
				break;
			}
		
		
		
		
		}
	function pushState (tabname) {
		var state = {
			tabname
			};
		history.pushState (state, "", location.pathname + "?tab=" + encodeURIComponent (stringLower (tabname)));
		}
	
	function setupDomStructure () {
		const divUsersContainer = $("<div class=\"" + options.containerClass + "\"></div>");
		const divContainer = $("<div class=\"divTabsContainer\"></div>");
		divUsersContainer.append (divContainer);
		const divTabs = $("<div class=\"divTabs\"></div>");
		const ulTabs = $("<ul class=\"nav nav-tabs\"></ul>");
		
		function findTabWithName (theName) {
			for (var x in options.theTabs) {
				let item = options.theTabs [x];
				if (item.name == theName) {
					return (item);
					}
				}
			return (undefined);
			}
		function makeActiveCloseBoxVisible () {
			$(".divTabsContainer ul li.active span.spCloseBox").css ("visibility", "visible");
			}
		function setActiveTab (liTab) {
			$(".spCloseBox").css ("visibility", "hidden"); //hide all closeboxes
			$(".liTab").removeClass ("active"); //make all tabs not active
			liTab.addClass ("active"); //make this tab acrive
			makeActiveCloseBoxVisible ();
			
			var tabRec = findTabWithName (liTab.attr ("name"))
			displayTabContents (tabRec);
			}
		
		divTabContent = $("<div class=\"divTabContent\"></div>");
		
		var flFoundTab = false, firstTab = undefined;
		for (var x in options.theTabs) {
			let item = options.theTabs [x];
			if (item.enabled) {
				function getAnchor () {
					const theAnchor = $("<a data-toggle=\"tab\"></a>");
					
					const iconClass = (item.icon === undefined) ? options.defaultIcon : item.icon;
					const iconHtml = "<i class=\"iTabIcon " + iconClass + "\"></i>";
					const theIcon = $(iconHtml);
					const theName = $("<span>" + item.name + "</span>");
					const theCloseBox = $("<span class=\"spCloseBox\">x</span>");
					theAnchor.append (theIcon);
					theAnchor.append (theName);
					theAnchor.append (theCloseBox);
					
					theCloseBox.click (function (ev) {
						console.log ("click closebox");
						ev.stopPropagation ();
						
						function closeTab () {
							var newTab = liTab.next ();
							if (newTab.length == 0) {
								newTab = liTab.prev ();
								}
							if (newTab.length > 0) {
								var tabRec = findTabWithName (liTab.attr ("name"))
								options.deleteTabCallback (tabRec);
								liTab.remove ();
								setActiveTab (newTab);
								}
							else {
								alertDialog ("Can't remove the last tab, sorry.");
								}
							}
						if (options.flConfirmTabClosing) {
							confirmDialog ("Really close this tab?", function () {
								closeTab ();
								});
							}
						else {
							closeTab ();
							}
						});
					theIcon.mouseenter (function () {
						const htmltext = options.getInfoTableForTab (findTabWithName (liTab.attr ("name")));
						if (htmltext !== undefined) {
							theIcon.data ("toggle", "popover");
							theIcon.data ("placement", "bottom");
							theIcon.data ("html", "true");
							theIcon.data ("content", htmltext);
							theIcon.data ("title", iconHtml + item.name);
							theIcon.popover ("show");
							}
						});
					theIcon.mouseleave (function () {
						theIcon.popover ("hide");
						});
					
					return (theAnchor);
					}
				let liTab = $("<li class=\"liTab\"></li>");
				liTab.attr ("name", item.name);
				liTab.append (getAnchor ());
				if (firstTab === undefined) {
					firstTab = {
						liTab,
						item
						}
					}
				ulTabs.append (liTab);
				if (equalStrings (item.name, options.nameActiveTab)) {
					setActiveTab (liTab);
					flFoundTab = true;
					}
				if (options.flDescriptionTooltip) {
					addToolTip (icon, item.description);
					}
				liTab.click (function () {
					setActiveTab (liTab);
					pushState (item.name);
					});
				}
			}
		if ((!flFoundTab) && (firstTab !== undefined)) {
			setActiveTab (firstTab.liTab);
			}
		
		divContainer.append (divTabs);
		divContainer.append (divTabContent);
		divTabs.append (ulTabs);
		divUsersContainer.on ("afterinsert", function () {
			makeActiveCloseBoxVisible ();
			});
		return (divUsersContainer);
		}
	
	const divContainer = setupDomStructure ();
	options.whereToAppend.append (divContainer);
	divContainer.trigger ("afterinsert");
	
	activateToolTips ();
	window.addEventListener ("popstate", function (ev) {
		if (ev.state != null) {
			console.log ("popstate: ev.state.tabname == " + jsonStringify (ev.state.tabname));
			for (var x in theTabs) {
				var item = theTabs [x];
				if (item.name == ev.state.tabname) {
					displayTabContents (item);
					}
				}
			$(".liTab").removeClass ("active");
			$(".liTab").each (function () {
				if ($(this).text () == ev.state.tabname) {
					$(this).addClass ("active");
					}
				});
			}
		});
	}
