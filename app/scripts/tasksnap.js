"use strict";

var TASK = chrome.i18n.getMessage("task");
var $bubble;
var wasBubbleVisible;

function simulateMouseEvent(event, element) {
	var simulatedMouseEvent = document.createEvent("MouseEvents"); 
	simulatedMouseEvent.initMouseEvent(event, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	element.dispatchEvent(simulatedMouseEvent);
}

function onBubbleMutation(event) {
	if (wasBubbleVisible == false && $bubble.is(":visible")) {
		var $switcher = $bubble.find(".cb-switcher");

		$switcher.children().each(function(i, elem) {
			if (elem.innerText == TASK) {
				simulateMouseEvent("mousedown", elem);
			}
		});
	}

	wasBubbleVisible = $bubble.is(":visible");
}

function registerBubbleObserver() {
	$bubble = $("div.bubble");
	if ($bubble.length == 0) {
		return false;
	}

	var observer = new MutationObserver(onBubbleMutation);
	observer.observe($bubble[0], {
		childList: true,
		subtree: true,
		attributes: true
	});

	wasBubbleVisible = $bubble.is(":visible");

	return true;
}

function init() {
	if (!registerBubbleObserver()) {
		var documentObserver = new MutationObserver(function(event) {
			if (registerBubbleObserver()) {
				documentObserver.disconnect();
			}
		});
		documentObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}

init();
