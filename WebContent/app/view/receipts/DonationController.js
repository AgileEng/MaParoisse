Ext.define('MaParoisse.view.receipts.DonationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.receipts-donation',
    
    onRender: function(){
    	/*
		 * temporal fix for Chrome
		 */
		Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
		
    	this.loadInitialData();
    },
    
    onSaveDonationsClicked: function(){
    	var me = this,
			view = me.getView(),
			donationGrid = view.getComponent('donationGrid'),
			yearField = donationGrid.getDockedComponent('topToolbar').getComponent('yearField');
    	
    	var donations = [];
    	var validationError = false;
    	donationGrid.getStore().each(function(donation){
    		var sum = Number(donation.get('amountAcc')) + Number(donation.get('amountChange'));
    		if(sum < 0.0){
    			validationError = true;
    			return false;
    		} /*else {
    			donation.set('amount', sum);
    		}*/
    		donations.push(donation.getDataObjectExt());
    	});
    	
    	if(!validationError){
	    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/Accounting',
				service_type: 'AccService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						var resp = arguments[0].BODY;
						donationGrid.getStore().loadRawData(resp.donations);
						me.calculateTotals();
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveDonations',
				params: {
					ownerId: AccBureau.Context.principal.data.compId,
					donations: donations,
					year: yearField.getValue()
				}
			});
    	} else {
    		MaParoisse.plugin.notification.showError(' ','Erreur de validation');
    	}
    },
    
    contributorRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		var htmlString = '';
		
		var employeeSalutation = '';
		var employeeSalutationID = record.get('employeeSalutationID');
		if(record.get('employeeLastName') != ''){
			switch (employeeSalutationID) {
			case 0:
				employeeSalutation = '';
				break;
			case 10:
				employeeSalutation = 'Monsieur';
				break;
			case 20:
				employeeSalutation = 'Madame';
				break;
			case 30:
				employeeSalutation = 'Mademoiselle';
				break;
			}
			if (employeeSalutation == ''){
				htmlString = '<div style="font-size: 8;white-space:normal!important"><span style="font-weight: 300;color:#4390df">Nom: </span> {0} {1} &#9;'+
				'<span style="font-weight: 300;color:#4390df">Adresse: </span> {2} &#9;' + 
				'<span style="font-weight: 300;color:#4390df">CP: </span> {3} <span style="font-weight: 300;color:#4390df">Commune: </span>{4}' +
				'</div>';
				return Ext.String.format(htmlString, record.get('employeeLastName'), record.get('employeeFirstName'), record.get('employeeAddress'), record.get('employeePostCode'), record.get('employeeTown'));
			} else {
				htmlString = '<div style="font-size: 8;white-space:normal!important"><span style="font-weight: 300;color:#4390df">Salutation: </span>{0} <span style="font-weight: 300;color:#4390df">Nom: </span> {1} {2} &#9;'+
				'<span style="font-weight: 300;color:#4390df">Adresse: </span> {3} &#9;' + 
				'<span style="font-weight: 300;color:#4390df">CP: </span> {4} <span style="font-weight: 300;color:#4390df">Commune: </span>{5}' +
				'</div>';
				return Ext.String.format(htmlString, employeeSalutation, record.get('employeeLastName'), record.get('employeeFirstName'), record.get('employeeAddress'), record.get('employeePostCode'), record.get('employeeTown'));
			}
		}
		
	},
    
	accountRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		if(Ext.isDefined(record.get('accountId')) && 
				record.get('accountCode').length > 0 && 
				record.get('accountName').length > 0){
			return record.get('accountCode') + ' - ' + record.get('accountName');
		} else {
			return '';
		}
	},
	
	loadInitialData: function(doLoadWithYear){
		var me = this;
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.doLoadInitialData(resp);
					
				},
				error: function () {}
			}
		});
		
		var params = {ownerId: AccBureau.Context.principal.data.compId};
		
		if(doLoadWithYear){
			params.year = me.getYearField().getValue();
		}
		
		req.request({
			method: 'loadDonations',
			params: params
		});
	},
	
	doLoadInitialData: function(data){
		var me = this,
			view = me.getView(),
			donationGrid = view.getComponent('donationGrid'),
			yearField = donationGrid.getDockedComponent('topToolbar').getComponent('yearField'),
			accGrid = view.getComponent('accountingGrid');
		
		yearField.suspendEvent('change');
		yearField.setValue(data.year);
		yearField.resumeEvent('change');
		donationGrid.getStore().loadRawData(data.donations);
		accGrid.getStore().loadRawData(data.accountancy);
		
		me.calculateTotals();
	},
	
	calculateTotals: function(record){
		var me = this,
			view = me.getView(),
			donationGrid = view.getComponent('donationGrid'),
			accGrid = view.getComponent('accountingGrid'),
			sumAccTotalField = donationGrid.getDockedComponent('topToolbar').getComponent('totalAcc'),
			sumAccDistributedField = donationGrid.getDockedComponent('topToolbar').getComponent('totalDons'),
			diff = donationGrid.getDockedComponent('topToolbar').getComponent('diff');
		
		//first calculate the third column
		/*
		 * note that not every call of calculateTotals
		 * will provide a defined record
		 */
		if(Ext.isDefined(record)){
			var sum = Number(record.get('amountAcc')) + Number(record.get('amountChange'));
			record.set('amountEnd', sum);
		}
		
		// calculate sumAccIdentified and sumChanges
		var sumAccIdentified = 0.0; // sum of all identified accountancy amounts  
		var sumChanges = 0.0;       // sum of all change amounts (already distributed non identified amounts)
		donationGrid.getStore().each(function(rec){
			if(!isNaN(Number(rec.get('amountAcc')))){
				sumAccIdentified += Number(rec.get('amountAcc'));
			}
			if(!isNaN(Number(rec.get('amountChange')))){
				sumChanges += Number(rec.get('amountChange'));
			}
		});
		
		// calculate sumAccNonIdentified
		var sumAccNonIdentified = 0.0;
		accGrid.getStore().each(function(rec){
			if(!isNaN(Number(rec.get('amount')))){
				sumAccNonIdentified += Number(rec.get('amount'));
			}
		});
		
		// set sumary fields
		var sumAccTotal = sumAccIdentified + sumAccNonIdentified;
		sumAccTotalField.setValue(sumAccTotal);
		
		var sumAccDistributed = sumAccIdentified + sumChanges;
		sumAccDistributedField.setValue(sumAccDistributed);
		
		diff.setValue(sumAccTotal - sumAccDistributed);
	},
	
	releaseResources: function(){
		var me = this,
			view = me.getView(),
			donationGrid = view.getComponent('donationGrid'),
			totalDons = donationGrid.getDockedComponent('topToolbar').getComponent('totalDons'),
			totalAcc = donationGrid.getDockedComponent('topToolbar').getComponent('totalAcc'),
			diff = donationGrid.getDockedComponent('topToolbar').getComponent('diff'),
			accGrid = view.getComponent('accountingGrid');
		
		donationGrid.getStore().removeAll();
		accGrid.getStore().removeAll();
		totalDons.reset();
		totalAcc.reset();
		diff.reset();
	},
	
	/**
     * @event edit
     * Fires after a cell is edited. Usage example:
     *
     *     grid.on('edit', function(editor, e) {
     *         // commit the changes right after editing finished
     *         e.record.commit();
     *     });
     *
     * @param {Ext.grid.plugin.CellEditing} editor
     * @param {Object} context An editing context with the following properties:
     *  @param {Ext.grid.Panel}         context.grid The owning grid Panel.
     *  @param {Ext.data.Model}         context.record The record being edited.
     *  @param {String}                 context.field The name of the field being edited.
     *  @param {Mixed}                  context.value The field's current value.
     *  @param {HTMLElement}            context.row The grid row element.
     *  @param {Ext.grid.column.Column} context.column The {@link Ext.grid.column.Column} Column} being edited.
     *  @param {Number}                 context.rowIdx The index of the row being edited.
     *  @param {Number}                 context.colIdx The index of the column being edited.
     *  @param {Mixed}                  context.originalValue The original value before being edited.
     */
	onEditAmountCompleted: function(editor, context, eOpts ){
		this.calculateTotals(context.record);
	},
	
	onTenantChange: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	getYearField: function() {
		var me = this,
			view = me.getView(),
			donationGrid = view.getComponent('donationGrid'),
			topToolbar = donationGrid.getDockedComponent('topToolbar');
		
		return topToolbar.getComponent('yearField');
	},
	
	onYearChange: function() {
		this.loadInitialData(true);
	},
	
	onSearchFieldKeyUp: function(field, e, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('donationGrid');
		
		grid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('employeeLastName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeFirstName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeAddress').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeePostCode').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeTown').toUpperCase().indexOf(searchValue) > -1 
			) {
				return true;
			} else {
				return false;
			}
		});
	}
});
