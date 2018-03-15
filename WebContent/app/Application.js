/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('MaParoisse.Application', {
    extend: 'Ext.app.Application',
    requires: ['MaParoisse.lib.Globals'],
    
    name: 'MaParoisse',

    views: [
            'MaParoisse.view.parametrages.Conseil',
            'MaParoisse.view.parametrages.PlanComptable',
            'MaParoisse.view.parametrages.COAModels',
            'MaParoisse.view.saisir.FinanceTransactionTemplate',
            'MaParoisse.view.saisir.FTTGrid',
            'MaParoisse.view.parametrages.BankCodification',
            'MaParoisse.view.saisir.FinancialTransaction',
            'MaParoisse.view.saisir.FinancialTransactionTab',
            'MaParoisse.view.util.PersonSelectionWindow',
            'MaParoisse.view.saisir.JournalFilter',
            'MaParoisse.view.saisir.JournalFilterTab',
            'MaParoisse.view.saisir.ModeStandart',
            'MaParoisse.view.saisir.ModeStandartTab',
            'MaParoisse.view.receipts.Contributors',
            'MaParoisse.view.receipts.DocGenWindow',
            'MaParoisse.view.library.FileExplorer',
            'MaParoisse.view.parametrages.AccInitialBalance',
            'MaParoisse.view.parametrages.Engagements',
            'MaParoisse.view.parametrages.Users',
            'MaParoisse.view.receipts.Donation',
            'MaParoisse.view.gerer.Budget',
            'MaParoisse.view.gerer.BordereauParoisse',
            'MaParoisse.view.gerer.BudgetRealisation',
            'MaParoisse.view.parametrages.PeriodManagement',
            'MaParoisse.view.gerer.MPChart'
    ],

    controllers: [
        'Root',
        'ApplicationRouter',
        'AppModuleUtil'
        // TODO: add controllers here
    ],

    stores: [
             'MaParoisse.store.dummy.Restaurants',
             'MaParoisse.store.util.DomainRecordArr',
             'MaParoisse.store.util.CustomerArr',
             'MaParoisse.store.CouncilMembersArr',
             'MaParoisse.store.AccountArr',
             'MaParoisse.store.ChartOfAccountsArr'
             
        // TODO: add stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    	//Remove loader element from the DOM
    	var loader = document.getElementById('ae-loader');
    	document.getElementsByTagName("BODY")[0].removeChild(loader);
    	
    	//Load ext default french localization 
    	Ext.Loader.loadScript({url: 'ext/locale/ext-locale-fr.js'});
    	//Load custom french localization
    	Ext.Loader.loadScript({url: 'overrides/locale/MaParoisse-locale-fr.js'});
    	//Load web safe base64 overrides
    	Ext.Loader.loadScript({url: 'overrides/Base64.js'});
    	Ext.Loader.loadScript({url: 'ext/overrides/AbstractSummary.js'});
    	
    	//validation types
    	var accountTest = /^[1-9]{1}[0-9]{2}[0-9]*([0-9]*|[xX]*)$/;
    	Ext.apply(Ext.form.field.VTypes, {
    	    //  vtype validation function
    	    accountcode: function(val, field) {
    	        return accountTest.test(val);
    	    },
    	    // vtype Text property: The error text to display when the validation function returns false
    	    accountcodeText: 'Erreur de validation. Compte invalide.',
    	    // vtype Mask property: The keystroke filter mask
    	    accoundcodeMask: /[0-9xX]/i
    	});
    	
    	//TODO: JSON RPC requires defined AccBureau
    	//		should it stay like this?
    	Ext.ns('AccBureau');
    	
    	//initialize quicktips
    	//after the following call all quicktips should be working
    	Ext.tip.QuickTipManager.init();
    	
    	//create custom vtypes
    	/**
		 * Currently the vtype should be only applied to the confirmation field.
		 * That way another one could be applied to the first password field.
		 */
		Ext.apply(Ext.form.field.VTypes, {
			passConfirm: function(val, fld) {
				var secondFld = fld.up().down('#'+fld.confFldItemId);
				if (secondFld.getValue() == val) {
					secondFld.clearInvalid();
					secondFld.validate();
				}
				return secondFld.getValue() == val;
			},
			passConfirmText: 'Passwords do not match!'
		});
		
		/**
		 * Here the password complexity vtype
		 * Note: Apply only to the first field
		 */
		Ext.apply(Ext.form.field.VTypes, {
			passComplexity: function(val, fld) {
				if (val.length < 6){
					return false;
				} else {
					var hasUpperCase = /[A-Z]/.test(val);
					var hasLowerCase = /[a-z]/.test(val);
					var hasNumbers = /\d/.test(val);
					var hasNonalphas = /\W/.test(val);
					if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3){
						return false;
					}
				}
				return true;
			},
			passComplexityText: 'Passwords doesn\'t meet the complexity requirements!'
		});
    	
    	//load initial data
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
    	    url: '/AccBureau',
    	    service_type: 'AccBureauService',
    	    listeners: {
    	    	success: function () {
    	    		MaParoisse.app.getController('Root').onInitialDataLoaded(arguments[0].BODY);
    	    	},
    	    	error: function () {
    	    		MaParoisse.app.logOff();
    	    	}
    	    }
    	   });
    	   
    	   req.request({
    		   method: 'loadAuthPrincipal',
    		   params: {}
    	   });
    },
	
	logOff: function(){
		Ext.getCmp('ae-viewport').removeAll(true);
		delete AccBureau;
		window.location.assign('/');
	}
});
