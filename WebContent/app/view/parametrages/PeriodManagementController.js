Ext.define('MaParoisse.view.parametrages.PeriodManagementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parametrages-periodmanagement',
    
    onRender: function(){
    	this.loadInitialData();
    },

	loadInitialData: function(scope){
		var me = this;
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					if(scope){
						scope.loadPeriodsInGrid(arguments[0].BODY.accPeriods);
					} else {
						me.loadPeriodsInGrid(arguments[0].BODY.accPeriods);
					}
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadAccPeriods',
			params: {
				ownerId: AccBureau.Context.principal.data.compId
			}
		});
	},
	
	loadPeriodsInGrid: function(accPeriods){
		var grid = this.getPeriodGrid(),
			ds = grid.getStore();

		ds.loadData(accPeriods);
	},
	
	periodStateRenderer: function(value, metaData, record, rowIdx, volIdx, store, view){
		if(value){
			return '<span class="icon-locked"></span>';
		} else {
			return '<span class="icon-unlocked"></span>';
		}
	},
	
	onPeriodOpenClick: function(){
		var me = this;
		
		var grid = me.getPeriodGrid();
		if(grid.getSelectionModel().hasSelection()){
			var periodRecord = grid.getSelectionModel().getSelection()[0];
			if(periodRecord.get('closed')){
				me.doOpenPeriod(periodRecord, me.loadInitialData);
			} else {
				MaParoisse.plugin.notification.showError('Period is already opened','erreur');
			}
		}
	},
	
	onPeriodCloseClick: function(){
		var me = this;
		
		var grid = me.getPeriodGrid();
		if(grid.getSelectionModel().hasSelection()){
			var periodRecord = grid.getSelectionModel().getSelection()[0];
			if(!periodRecord.get('closed')){
				me.doClosePeriod(periodRecord, me.handleCloseSuccess, false);
			} else {
				MaParoisse.plugin.notification.showError('Period is already closed','erreur');
			}
		}
	},
	
	handleCloseSuccess: function(scope, warnings){
		if (warnings.length > 0 ) {
			var msg = "";
			for (var i = 0; i < warnings.length; i++) {
				msg+=" " + warnings[i] + "<br/>";
			}
//			msg+="Do you want to continue?";
			Ext.create('MaParoisse.lib.MessageBox', {
    			//header: false,
    			title: 'Zachée',
    			formHeight: 145,
    			formWidth: 250,
    			message: msg,
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId) {
	    				if (btnId == MaParoisse.lib.MessageBox.YES) {
	    					var grid = scope.getPeriodGrid();
    						var periodRecord = grid.getSelectionModel().getSelection()[0];
    						scope.doClosePeriod(periodRecord, scope.handleCloseSuccess, true);
	    				} else if (btnId == MaParoisse.lib.MessageBox.NO) {
	    					scope.loadInitialData(scope);
	    				}
	    			}
    			}
			});
		} else {
			scope.loadInitialData(scope);
			
			// create close reports
			var grid = scope.getPeriodGrid();
			if(grid.getSelectionModel().hasSelection()){
				var period = grid.getSelectionModel().getSelection()[0];
				var year = null,
					yearStart = period.get('startDate').getFullYear(),
					yearEnd = period.get('endDate').getFullYear();
				
				if(yearStart === yearEnd){
					year = yearStart;
					window.open(
						'../CefraForm?number=closeReports&ownerId=' + AccBureau.Context.principal.data.compId
						+ '&year=' + year,
						'_Print');
				}
			}
		}
	},
	
	doOpenPeriod: function(period, successCallback){
		var me = this;
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					if(successCallback){
						successCallback(me);
					}
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'openAccPeriod',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				accPeriodId: period.get('id')
			}
		});
	},
	
	doClosePeriod: function(period, successCallback, suppressWarnings){
		var me = this;
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					if(successCallback){
						var warnings = [];
						if (Ext.isDefined(arguments[0].BODY.warnings)){
							warnings = arguments[0].BODY.warnings;
						}
						successCallback(me, warnings);
					}
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'closeAccPeriod',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				accPeriodId: period.get('id'),
				suppressWarnings: suppressWarnings
			}
		});
	},
	
	onPeriodGridSelChange: function(sm, slected, e){
		var me = this;
		if(sm.hasSelection){
			me.getClosePeriodBtn().setDisabled(false);
			me.getOpenPeriodBtn().setDisabled(false);
		} else {
			me.getClosePeriodBtn().setDisabled(true);
			me.getOpenPeriodBtn().setDisabled(true);
		}
	},
	
	getPeriodToolbar: function(){
		var me = this,
			view = me.getView(),
			periodGrid = view.getComponent('periodGrid');
		
		return periodGrid.getDockedComponent('topTbar');
	},
	
	getClosePeriodBtn: function(){
		return this.getPeriodToolbar().getComponent('closePeriodBtn');
	},
	
	getOpenPeriodBtn: function(){
		return this.getPeriodToolbar().getComponent('openPeriodBtn');
	},
	
	getPeriodGrid: function(){
		var me = this,
			view = me.getView();
		
		return view.getComponent('periodGrid');
	},
	
	onPrintClicked: function(){
		var grid = this.getPeriodGrid();
		if(grid.getSelectionModel().hasSelection()){
			var period = grid.getSelectionModel().getSelection()[0];
			var year = null,
				yearStart = period.get('startDate').getFullYear(),
				yearEnd = period.get('endDate').getFullYear();
			
			if(yearStart === yearEnd){
				year = yearStart;
				window.open(
					'../CefraForm?number=archevecheReport&ownerId=' + AccBureau.Context.principal.data.compId
					+ '&year=' + year,
					'_Print');
			}
		}
	},
	
	onPrintReportsClicked: function(){
		var grid = this.getPeriodGrid();
		if(grid.getSelectionModel().hasSelection()){
			var period = grid.getSelectionModel().getSelection()[0];
			var year = null,
				yearStart = period.get('startDate').getFullYear(),
				yearEnd = period.get('endDate').getFullYear();
			
			if(yearStart === yearEnd){
				year = yearStart;
				window.open(
					'../CefraForm?number=batchReport&ownerId=' + AccBureau.Context.principal.data.compId
					+ '&year=' + year,
					'_Print');
			}
		}
	},
	
	onTenantChanged: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	releaseResources: function(){
		this.getPeriodGrid().getStore().removeAll();
	}
});
