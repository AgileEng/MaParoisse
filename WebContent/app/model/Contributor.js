Ext.define('MaParoisse.model.Contributor', {
	requires: 'MaParoisse.model.util.DomainRecord',
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'employeeLastName',
		type: 'string',
		persist: false,
		mapping: 'employee.lastName'
	}, {
		name: 'employeeFirstName',
		type: 'string',
		persist: false,
		mapping: 'employee.firstName'
	}, {
		name: 'employeeAddress',
		type: 'string',
		persist: false,
		mapping: 'employee.address.address'
	}, {
		name: 'employeePostCode',
		type: 'string',
		persist: false,
		mapping: 'employee.address.postCode'
	}, {
		name: 'employeeTown',
		type: 'string',
		persist: false,
		mapping: 'employee.address.town'
	}, {
		name: 'employeePhone',
		type: 'string',
		persist: false,
		mapping: 'employee.contact.phone'
	}, {
		name: 'employeeEmail',
		type: 'string',
		persist: false,
		mapping : 'employee.contact.email'
	}, {
		name: 'employee' //expected to be like described in MaParoisse.model.Employee
	}, {
		name: 'checked',
		type: 'boolean',
		persist: false
	}]
});