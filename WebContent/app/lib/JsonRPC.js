Ext.define('MaParoisse.lib.JsonRPC', {
	//make sure the class below is included, as the current one needs it
	requires: ['MaParoisse.lib.LoginWindow', 'MaParoisse.lib.ErrorWindow'],
	extend: 'Ext.util.Observable',
	
	//according to JsonRPC specification from http://www.jsonrpc.org/specification
	url : "/AccBureau",
	service_type : "rpc",
	method : null,
	params: null,
	timeout: 30000,
	
//	tokenId: null,
//	tenantId: null,
	
	constructor: function(config) {
		this.url = config.url || '/AccBureau';
		this.service_type = config.service_type || 'rpc';
		this.timeout = config.timeout || this.timeout;
	
		//class custom events for users/coders to bind their own handler
		//deprecated
//        this.addEvents({
//            'success': true,
//			'error': true,
//			'retry': true
//        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;
        
        this.requestObject = this.getRequestObject();
    	
		this.requestObject.HEAD.method = this.method;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
    },
	
	request: function(config) {
//		this.method = config.method || '';
//		this.params = config.params || {};
		// The two below should be always fetched from Globals.
//		this.tokenId = /*config.token || */MedCom.lib.Globals.getTokenId();
//		this.tenantId = /*config.tenantId || */MedCom.lib.Globals.getTenantId();
//		this.params.tokenId = this.tokenId;
//		this.params.tenantId = this.tenantId;
		//init and show mask while ajax is working
		if(Ext.isDefined(config)) {
			// set system arguments
			config.params.sOwnerId = Ext.isDefined(AccBureau.Context) ? AccBureau.Context.ownerId : '';
		}
		this.requestObject.HEAD.method = config.method;
		this.requestObject.BODY.args = config.params;
		Ext.getBody().mask('Chargement...', 'splashscreen');
		
		Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
	        cls: 'x-splash-icon'
	    });
		
		//send request and subscribe to events
		Ext.Ajax.request({
			url: this.url,
			scope: this,
			params: {
				"metoken" : Ext.isDefined(AccBureau.Context) ? AccBureau.Context.metoken : '',
				"json" : Ext.encode(this.requestObject)
			},
			timeout : this.timeout,
			//success: this.onAjaxSucceeded,
			failure: this.onAjaxFailed,
			callback: this.onAjaxCompleted
		});
	},
	
	onAjaxSucceeded: function(resp, opts) {
		
	},
	
	onAjaxFailed: function(resp, opts) {
		if (resp.statusText != undefined && resp.statusText != "") {
			var errData = resp.request.timedout === true ? "The request has been timed out!" : "";
			Ext.create('MaParoisse.lib.ErrorWindow', {
				error: {message: resp.statusText, data: errData}
			});
		} else {
			Ext.create('MaParoisse.lib.ErrorWindow', {
				error: {message: "An unknown error has occurred. Please consult your System Administrator."}
			});
		}
		this.fireEvent('error');
	},
	
	//TODO: UTF-8!
	onAjaxCompleted: function(opts, isSuccessful, resp) {
		//hide mask
		Ext.getBody().unmask();
		try {
			this.responseObject = Ext.decode(resp.responseText);
			
			if (this.responseObject.HEAD.result == 1) {
				this.fireEvent("success", this.responseObject, this);
			} else {
				if(this.responseObject.HEAD.errCode && this.responseObject.HEAD.errCode === 1) {
					//AccBureau.showError(this.responseObject.HEAD.errors);
					this.fireEvent("retry", this.responseObject, this);
					Ext.create('MaParoisse.lib.ErrorWindow', {
						error: {message: this.responseObject.HEAD.errors},
						callback: {
							fn: this.showLoginWindow,
							scope: this
						}
					});

				} else {
					
					Ext.create('MaParoisse.lib.ErrorWindow', {
						error: {message: this.responseObject.HEAD.errors},
						callback: {
							fn: function () { this.fireEvent('error', this.responseObject, this);},
							scope: this
						}
					});
				}
			}
		} catch (e) {
			this.fireEvent("error", e, this);
			//AccBureau.showError(e.message || e);
		}
	},
	
	onAjaxRetry: function() {
		//send request and subscribe to events
		Ext.Ajax.request({
			url: this.url,
			scope: this,
			params: {
				"metoken" : Ext.isDefined(AccBureau.Context) ? AccBureau.Context.metoken : '',
				"json" : Ext.encode(this.requestObject)
			},
			timeout : this.timeout,
			//success: this.onAjaxSucceeded,
			failure: this.onAjaxFailed,
			callback: this.onAjaxCompleted
		});
	},
	
	showLoginWindow: function(btnId) {
		
		Ext.widget('loginwindow', {
			retry: this.onAjaxRetry,
			rpc_scope: this
		});
	},
	
	getRequestObject: function() {
		return {
			"HEAD" : {
				"service_type" : this.service_type,
				"method" : null,
				"sessionId" : Ext.isDefined(AccBureau.Context) ? AccBureau.Context.sessionId : ''
			},
			"BODY" : {
				"args" : null
			}
		};
	}
});