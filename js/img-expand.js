(function (document) {
    'use strict';
    
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i ++) {
        (function (image) {
            var isExpanded = false;
            image.style.cursor = 'hand';
            image.addEventListener('click', function () {
                this.style.maxWidth = isExpanded ? '100%' : 'none';
                isExpanded = !isExpanded;
            });
        })(images[i]);
    }
})(window.document);