Ext.define('MaParoisse.model.util.AuthPrincipal', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	AuthRoleSysId : {
		na : 0,
		administrator : 1,
		power_user : 100,
		maxPowerRole : 199,
		accountant : 200,
		social : 210,
		maxManagerRole : 299,
		operative_accountant : 300,
		operative_social : 310,
		maxId : 1000
	},
	
	fields: [{
		name : 'password',
		type : 'string'
	}, {
		name : 'firstName',
		type : 'string'
	}, {
		name : 'middleName',
		type : 'string'
	}, {
		name : 'lastName',
		type : 'string'
	}, {
		name : 'fullName',
		type : 'string'
	}, {
		name : 'eMail',
		type : 'string'
	}, {
		name : 'phone',
		type : 'string'
	}, {
		name : 'person'
	}, {
		name : 'roles'
	}, {
		name : 'companies'
	}, {
		name : 'compId'
	}],
	
	
	getMaxRole : function() {
		var roleSysId = this.AuthRoleSysId.maxId;
		if(Ext.isArray(this.get('roles'))) {
			var roles = this.get('roles');
			for (var index = 0; index < roles.length; index++) {
				if(roles[index].sysId < roleSysId) {
					roleSysId = roles[index].sysId;
				}
			}
		}
		return roleSysId;
	},
	
	getMaxRoleName : function() {
		var maxRoleId = this.getMaxRole();
		var roleName = '';
		if(Ext.isArray(this.get('roles'))) {
			var roles = this.get('roles');
			for (var i = 0; i < roles.length; i++){
				if(roles[i].sysId == maxRoleId){
					roleName = roles[i].name;
				}
			}
		}
		return roleName
	},
	
	hasRole : function(roleSysId) {
		var hasRole = false;
		if(Ext.isArray(this.get('roles'))) {
			var roles = this.get('roles');
			for (var index = 0; index < roles.length; index++) {
				if(roles[index].sysId === roleSysId) {
					hasRole = true;
					break;
				}
			}
		}
		return hasRole;
	}
});