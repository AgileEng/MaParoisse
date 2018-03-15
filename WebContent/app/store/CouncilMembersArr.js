Ext.define('MaParoisse.store.CouncilMembersArr', {
	extend: 'Ext.data.Store',
	model: 'MaParoisse.model.CouncilMember',
	//groupField: 'guiGroupId',
	storeId: 'councilmembers',
	grouper: {
		property: 'guiGroupId',
		direction: 'DESC'
	}
	
//	,filters: [
//          function(item) {
//        	  return item.data.dbState != 3;
//          }
//    ]
//	//mock data for testing only
	
//	data : [{
//		councilId: 1,
//		employee: {
//			firstName: 'Atanas',
//			lastName: 'Lozanov',
//			address: {
//				address: 'Krasna Polyana',
//				postCode: '1330',
//				town: 'Sofia'
//			},
//			contact:{
//				phone: 'samsung',
//				email: 'alozanov@agileeng.eu'
//			}
//		},
//			typeId: 10,
//			positionId: 20,
//			guiGroupId: 10
//		}, {
//			councilId: 1,
//			employee: {
//				firstName: 'Nikolay',
//				lastName: 'Haralampiev',
//				address: {
//					address: 'Darvenitsa',
//					postCode: '1000',
//					town: 'Sofia'
//				},
//				contact:{
//					phone: 'pak samsung',
//					email: 'nmihaylov@agileeng.eu'
//				}
//			},
//			typeId: 30,
//			positionId: 10,
//			guiGroupId: 20
//	}]
});