Ext.define('MaParoisse.model.CouncilMember', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'councilId',
		type: 'int'
	}, {
		name: 'employee' //expected to be like described in MaParoisse.model.Employee
	}, {
		name: 'employeeFirstName',
		type: 'string',
		mapping: 'employee.firstName'
	}, {
		name: 'employeeLastName',
		type: 'string',
		mapping: 'employee.lastName'
	}, {
		name: 'employeeAddress',
		type: 'string',
		mapping: 'employee.address.address'
	}, {
		name: 'employeePostCode',
		type: 'string',
		mapping: 'employee.address.postCode'
	}, {
		name: 'employeeTown',
		type: 'string',
		mapping: 'employee.address.town'
	}, {
		name: 'employeePhone',
		type: 'string',
		mapping: 'employee.contact.phone'
	}, {
		name: 'employeeEmail',
		type: 'string',
		mapping : 'employee.contact.email'
	}, {
		name: 'startDate', //probably null as it won't be used for now
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'endDate', //the same here
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name : 'entryDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name : 'firstElectionDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name : 'nextRenewalDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'typeId', //member type: ordinary(10L),cure(20L),maire(30L),maire_annex(40L)
		type: 'int'
	}, {
		name: 'positionId', //council board position: none(10L), president(20L), tresorier(30L), secretaire(40L)
		type: 'int'
	}, {
		name: 'guiGroupId', //ordinary(10L) or officio(20L)
		type: 'int'
	}],
	
	validators: {
		employeeFirstName: 'presence',
		employeeLastName: 'presence'
	},
	
	validate: function(options){
		var errors = this.callParent(arguments),
			employeeFirstName = this.get('employeeFirstName'),
			employeeLastName = this.get('employeeLastName'),
			employeeAddress = this.get('employeeAddress'),
			employeePostCode = this.get('employeePostCode'),
			employeeTown = this.get('employeeTown'),
			employeePhone = this.get('employeePhone'),
			//employeeEmail = this.get('employeeEmail'),
			positionId = this.get('positionId');
		
		if(!Ext.isDefined(employeeFirstName) || employeeFirstName == null || employeeFirstName == ''){
			errors.add({
                field: 'employeeFirstName',
                message: 'Hello!'
            });
		}
		if(!Ext.isDefined(employeeLastName) || employeeLastName == null || employeeLastName == ''){
			errors.add({
                field: 'employeeLastName'
            });
		};
		
		if(positionId === 20 || positionId === 30 ){
			if(!Ext.isDefined(employeeAddress) || employeeAddress == null || employeeAddress == ''){
				errors.add({
                    field: 'employeeAddress'
                });
			}
			if(!Ext.isDefined(employeePostCode) || employeePostCode == null || employeePostCode == ''){
				errors.add({
                    field: 'employeePostCode'
                });
			}
			if(!Ext.isDefined(employeeTown) || employeeTown == null || employeeTown == ''){
				errors.add({
                    field: 'employeeTown'
                });
			}
			if(!Ext.isDefined(employeePhone) || employeePhone == null || employeePhone == ''){
				errors.add({
                    field: 'employeePhone'
                });
			}
			/*if(!Ext.isDefined(employeeEmail) || employeeEmail == null || employeeEmail == ''){
				errors.add({
                    field: 'employeeEmail'
                });
			}*/
		}
		
		return errors;
	}
});