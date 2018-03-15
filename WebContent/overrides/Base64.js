Ext.onReady(function(){
	if (Ext.util.Base64) {
        Ext.apply(Ext.util.Base64, {
        	_str : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-",
        	
        	/**
             * Decodes given base64 formatted string
             * @param input
             * @returns {string}
             */
            decode : function (input) {
                var me = this;
                var output = '',
                    chr1, chr2, chr3,
                    enc1, enc2, enc3, enc4,
                    i = 0;

                input = input.replace(/[^A-Za-z0-9\.\_\-]/g, "");

                var len = input.length;

                while (i < len) {

                    enc1 = me._str.indexOf(input.charAt(i++));
                    enc2 = me._str.indexOf(input.charAt(i++));
                    enc3 = me._str.indexOf(input.charAt(i++));
                    enc4 = me._str.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = me._utf8_decode(output);

                return output;
            }
        });
	}
});