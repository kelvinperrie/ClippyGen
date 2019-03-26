(function ($) {

    $.fn.makeClippy = function (settings) {
                
        // add the required html elements
        $(this).append('<div id="clippy-container"><div id="clippy-itself"><img src="images/clippy.png" alt="clippy" /></div><div id="clippy-bubble"><div id="clippy-bubble-triangle-border"></div><div id="clippy-bubble-triangle"></div><span id="clippy-text"></span><div id="clippy-options"></div></div></div>');
        
        // use jqueryui to make clippy movable
        $("#clippy-container").draggable();

        // create a new clippymodel and put it in a variable that is accessible to every man and his dog
        clippy = new clippyModel();

        return this;
    };

}(jQuery));

// a model to persist the status of clippy
var clippyModel = function () {
    var self = this;

    self.showClippy = false;        // the visibility status of your friend and mine, clippy
    self.currentText = null;        // the text in the speech bubble
    self.options = [];              // the collection of options (actions/questions) displayed in the speech bubble
    self.clickAction = null;        // the action, if any, to take when clippy is clicked
    self.haveBoundEvents = false;   // arg, keep track of whether we've bound the events to our html
    self.isDragging = false;        // track if we're dragging so we can avoid raising a click event on drags

    // allow user to set what happens when clippy is clicked
    self.onClick = function (action) {
        self.clickAction = action;
    };

    // allows the user to get clippy to output some text in his speechbubble
    self.say = function (contents, options) {
        self.currentText = contents;
        $("#clippy-text").html(self.currentText);
            self.updateOptions(options);
        self.showHideSpeechBubble();
        if (!self.showClippy) {
            self.show();
        }
    };

    // used to updated the options (actions/questions) in the speech bubble
    self.updateOptions = function (options) {
        if (options) {
            self.options = options;
        } else {
            self.options = [];
        }
        self.renderOptions();
    };
    // generates the html for the options
    self.renderOptions = function () {
        $("#clippy-options").html(null);
        for (var i = 0; i < self.options.length; i++) {
            var option = self.options[i];
            var newOption = '<div id="clippy-option-'+i+'" data-index="'+i+'" class="clippy-option">' + option.text+'</div>';
            $("#clippy-options").append(newOption);
            $("#clippy-option-" + i).bind("click", function () {
                var optionIndex = $(this).data("index");
                var action = self.options[optionIndex].action;
                action();
            });
        }
    };
    // allows the user to close the speech bubble
    self.closeBubble = function () {
        self.currentText = null;
        $("#clippy-text").html(null);
        self.showHideSpeechBubble();
    };
    // shows or hides the speech bubble html based on the status of the model
    self.showHideSpeechBubble = function () {
        if (self.currentText === null) {
            $("#clippy-bubble").hide();
        } else {
            $("#clippy-bubble").css('display', 'inline-block');
        }
    };

    // shows clippy on the screen
    self.show = function (settings) {
        settings = settings || {};
        var top = settings.top || '100px';
        var left = settings.left || '600px';
        $("#clippy-container").css({ top: top });
        $("#clippy-container").css({ left: left });
        self.showClippy = true;
        self.updateClippyVisibility();
        if (!self.haveBoundEvents) {
            self.haveBoundEvents = true;
            $("#clippy-itself").bind("mouseup", function (e) {
                var actionFunction = function () {
                    var wasDragging = self.isDragging;
                    self.isDragging = false;
                    if (!wasDragging) {
                        if (self.clickAction) {
                            self.clickAction();
                        }
                    }
                }();
                $('#clippy-container').css('cursor', 'grab');
            });
            $("#clippy-itself").bind("mousedown", function (e) {
                $('#clippy-container').css('cursor', 'grabbing');
                self.isDragging = false;
            });
            $("#clippy-itself").bind("mousemove", function (e) {
                self.isDragging = true;
            });
        }
    };
    // allows the user to remove clippy
    self.hide = function () {
        self.showClippy = false;
        self.updateClippyVisibility();
    };
    // shows or hides the clippy html dependant on the model
    self.updateClippyVisibility = function () {
        if (self.showClippy) {
            $("#clippy-container").css('display', 'inline-block');
        } else {
            $("#clippy-container").hide();
        }
    };
};

var clippy = null;