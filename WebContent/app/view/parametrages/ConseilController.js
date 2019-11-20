Ext
		.define(
				'MaParoisse.view.parametrages.ConseilController',
				{
					extend : 'Ext.app.ViewController',
					alias : 'controller.conseil',

					deletedMembers : [],

					/*
					 * use currentCouncil to store the current council record
					 * here when loading data from server set the data here and
					 * update the view from this data
					 * 
					 * when applying changes sync this object with the UI
					 * representation and then send the data from currentCouncil
					 * to the server
					 */
					currentCouncil : null,

					/*
					 * start of view event handlers
					 */
					onRender : function() {
						this.deletedMembers = [];
						this.loadInitialData();
					},

					refreshGridView : function() {
						this.getView().getComponent('bureauGrid').getView()
								.refresh();
					},

					onTenantChange : function(compId) {
						this.releaseResources();
						this.loadInitialData();
					},

					onGridAfterRender : function(grid) {
						var view = grid.getView();
						// validation on record level through "itemupdate" event
						view.on('itemupdate',
								function(record, y, node, options) {
									this.validateRow(this
											.getColumnIndexes(grid), record, y,
											true);
								}, grid);
					},

					onBeforeGridCellEdit : function(editor, context, eOpts) {
						if (context.field === 'positionName'/*
															 * &&
															 * ((context.record.get('positionId') !=
															 * 10) ||
															 * (context.record.get('typeId') !=
															 * 10))
															 */) {
							return false;
						} else if ((context.record.get('typeId') === 20
								|| context.record.get('typeId') === 30 || context.record
								.get('typeId') === 40)
								&& (context.field === 'entryDate'
										|| context.field === 'firstElectionDate' || context.field === 'nextRenewalDate')) {
							return false;
						} else {
							return true;
						}
					},

					onAddClicked : function(btn, eOpts) {

						var grid = this.getView().getComponent('membersGrid');
						var cellEditingPlugin = grid
								.getPlugin('memberEditingPlugin');

						// Initialize empty/default Council Member
						var newRec = Ext.create(
								'MaParoisse.model.CouncilMember', {
									councilId : this.currentCouncil.id,
									typeId : 10,
									positionId : 10,
									guiGroupId : 10,
									employee : {
										address : {},
										contact : {}
									}
								});

						grid.getStore().insert(0, newRec);
						cellEditingPlugin.startEdit(newRec, 2);
					},

					onSaveClicked : function() {
						var vc = this;

						this
								.updateCurrentCouncil(function() {
									var council = vc.currentCouncil
											.getDataObjectExt();
									council.endDate = Ext.Date.format(
											council.endDate, 'd-m-Y');
									if (typeof council.startDate != 'string') {
										council.startDate = Ext.Date.format(
												council.startDate, 'd-m-Y');
									}

									var req = Ext
											.create(
													'MaParoisse.lib.JsonRPC',
													{
														url : '/CouncilServlet',
														service_type : 'CouncilService',
														listeners : {
															success : function() {
																// show success
																// and load the
																// server data
																MaParoisse.plugin.notification
																		.showSuccess(
																				' ',
																				'succès');
																vc
																		.releaseResources();
																vc
																		.setCurrentCouncil(arguments[0].BODY.council);
															},
															error : function() {
															}
														}
													});

									req
											.request({
												method : 'saveCouncil',
												params : {
													ownerId : AccBureau.Context.principal.data.compId,
													council : council
												}
											});
								});

					},

					onDeleteClicked : function() {
						var me = this, memStore = this.getView().getComponent(
								'membersGrid').getStore(), bureauStore = this
								.getView().getComponent('bureauGrid')
								.getStore(), membersSelModel = this.getView()
								.getComponent('membersGrid')
								.getSelectionModel(), bureauSelModel = this
								.getView().getComponent('bureauGrid')
								.getSelectionModel();

						if (membersSelModel.hasSelection()) {
							me
									.doDeleteMember(membersSelModel
											.getSelection()[0], memStore);
						} else if (bureauSelModel.hasSelection()) {
							me.doDeleteMember(bureauSelModel.getSelection()[0],
									bureauStore);
						}
					},

					onElectionsClicked : function() {
						var vc = this;

						vc
								.getView()
								.isSafeToClose(
										function() {
											var councilId = vc.currentCouncil
													.get('id');

											var req = Ext
													.create(
															'MaParoisse.lib.JsonRPC',
															{
																url : '/CouncilServlet',
																service_type : 'CouncilService',
																listeners : {
																	success : function() {
																		// show
																		// success
																		// and
																		// load
																		// the
																		// server
																		// data
																		// in
																		// the
																		// form
																		MaParoisse.plugin.notification
																				.showSuccess(
																						' ',
																						'succès');
																		vc
																				.releaseResources();
																		vc
																				.setCurrentCouncil(arguments[0].BODY.council);
																	},
																	error : function() {
																	}
																}
															});

											req
													.request({
														method : 'closeCouncil',
														params : {
															ownerId : AccBureau.Context.principal.data.compId,
															councilId : councilId
														}
													});
										});
					},

					onBureauGridSelectionChange : function(selModel, record,
							index, eOpts) {
						var membersSelModel = this.getView().getComponent(
								'membersGrid').getSelectionModel();
						if (membersSelModel.hasSelection()) {
							membersSelModel.deselectAll();
						}
					},

					onMembersGridSelectionChange : function(selModel, selected,
							eOpts) {
						var bureauSelModel = this.getView().getComponent(
								'bureauGrid').getSelectionModel();
						if (bureauSelModel.hasSelection()) {
							bureauSelModel.deselectAll();
						}
					},

					onGridItemContextMenu : function(view, rec, item, index, e,
							eOpts) {
						var me = this, memStore = this.getView().getComponent(
								'membersGrid').getStore(), bureauStore = this
								.getView().getComponent('bureauGrid')
								.getStore();

						var menu = Ext.create('Ext.menu.Menu', {
							autoShow : false,
							items : []
						});

						if (rec.get('typeId') == 10
								&& rec.get('positionId') == 10) {
							if (AccBureau.Context.principal['data']['appType'] === 'fabrique') {
								menu
										.add(
												{
													icon : null,
													glyph : 'xe03d@iconFont',
													iconAlign : 'left',
													text : 'Elu en tant que président',
													handler : function() {
														me.doElectMember(rec,
																20);
													}
												},
												{
													icon : null,
													glyph : 'xe03d@iconFont',
													iconAlign : 'left',
													text : 'Elu en tant que trésorier',
													handler : function() {
														me.doElectMember(rec,
																30);
													}
												},
												{
													icon : null,
													glyph : 'xe03d@iconFont',
													iconAlign : 'left',
													text : 'Elu en tant que secrétaire',
													handler : function() {
														me.doElectMember(rec,
																40);
													}
												},
												'-',
												{
													icon : null,
													glyph : 'xe063@iconFont',
													iconAlign : 'left',
													text : 'Définir comme le curé',
													handler : function() {
														me
																.doSetMemberAsOfficio(
																		rec, 20);
													}
												},
												{
													icon : null,
													glyph : 'xe063@iconFont',
													iconAlign : 'left',
													text : 'Définir comme le maire',
													handler : function() {
														me
																.doSetMemberAsOfficio(
																		rec, 30);
													}
												},
												{
													icon : null,
													glyph : 'xe063@iconFont',
													iconAlign : 'left',
													text : 'Définir comme le maire de l\'annexe',
													handler : function() {
														me
																.doSetMemberAsOfficio(
																		rec, 40);
													}
												}, '-', {
													icon : null,
													glyph : 'xe059@iconFont',
													iconAlign : 'left',
													text : 'Supprimer',
													handler : function() {
														me.doDeleteMember(rec,
																memStore);
													}
												});
							} else if (AccBureau.Context.principal['data']['appType'] === 'mense') {
								menu.add({
									icon : null,
									glyph : 'xe03d@iconFont',
									iconAlign : 'left',
									text : 'Elu en tant que trésorier',
									handler : function() {
										me.doElectMember(rec, 30);
									}
								}, '-', {
									icon : null,
									glyph : 'xe063@iconFont',
									iconAlign : 'left',
									text : 'Définir comme le curé',
									handler : function() {
										me.doSetMemberAsOfficio(rec, 20);
									}
								}, {
									icon : null,
									glyph : 'xe063@iconFont',
									iconAlign : 'left',
									text : 'Revenir à membre ordinaire',
									handler : function() {
										me.doSetMemberAsOrdinary(rec);
									}
								}, '-', {
									icon : null,
									glyph : 'xe059@iconFont',
									iconAlign : 'left',
									text : 'Supprimer',
									handler : function() {
										me.doDeleteMember(rec, memStore);
									}
								});
							}
						} else if (rec.get('typeId') != 10
								&& rec.get('positionId') == 10) {
							if (AccBureau.Context.principal['data']['appType'] === 'fabrique') {
								menu.add({
									icon : null,
									glyph : 'xe03d@iconFont',
									iconAlign : 'left',
									text : 'Elu en tant que président',
									handler : function() {
										me.doElectMember(rec, 20);
									}
								}, {
									icon : null,
									glyph : 'xe03d@iconFont',
									iconAlign : 'left',
									text : 'Elu en tant que trésorier',
									handler : function() {
										me.doElectMember(rec, 30);
									}
								}, {
									icon : null,
									glyph : 'xe03d@iconFont',
									iconAlign : 'left',
									text : 'Elu en tant que secrétaire',
									handler : function() {
										me.doElectMember(rec, 40);
									}
								}, {
									icon : null,
									glyph : 'xe063@iconFont',
									iconAlign : 'left',
									text : 'Revenir à membre ordinaire',
									handler : function() {
										me.doSetMemberAsOrdinary(rec);
									}
								}, '-', {
									icon : null,
									glyph : 'xe059@iconFont',
									iconAlign : 'left',
									text : 'Supprimer',
									handler : function() {
										me.doDeleteMember(rec, memStore);
									}
								});
							} else if (AccBureau.Context.principal['data']['appType'] === 'mense') {
								menu.add({
									icon : null,
									glyph : 'xe03d@iconFont',
									iconAlign : 'left',
									text : 'Elu en tant que trésorier',
									handler : function() {
										me.doElectMember(rec, 30);
									}
								}, {
									icon : null,
									glyph : 'xe063@iconFont',
									iconAlign : 'left',
									text : 'Revenir à membre ordinaire',
									handler : function() {
										me.doSetMemberAsOrdinary(rec);
									}
								}, '-', {
									icon : null,
									glyph : 'xe059@iconFont',
									iconAlign : 'left',
									text : 'Supprimer',
									handler : function() {
										me.doDeleteMember(rec, memStore);
									}
								});
							}
						} else if (rec.get('positionId') != 10
								|| rec.get('typeId') != 10) {
							menu.add({
								icon : null,
								glyph : 'xe063@iconFont',
								iconAlign : 'left',
								text : 'Revenir à membre ordinaire',
								handler : function() {
									me.doSetMemberAsOrdinary(rec);
								}
							}, '-', {
								icon : null,
								glyph : 'xe059@iconFont',
								iconAlign : 'left',
								text : 'Supprimer',
								handler : function() {
									me.doDeleteMember(rec, bureauStore);
								}
							});
						}

						e.stopEvent();
						menu.showAt(e.getXY());
						return false;
					},

					/*
					 * End of view event handlers
					 */

					/*
					 * Start of business logic functions
					 */

					loadInitialData : function() {
						var vc = this;
						var req = Ext
								.create(
										'MaParoisse.lib.JsonRPC',
										{
											url : '/CouncilServlet',
											service_type : 'CouncilService',
											listeners : {
												success : function() {
													// show success and load the
													// server data in the form
													MaParoisse.plugin.notification
															.showSuccess(' ',
																	'succès');
													vc
															.setCurrentCouncil(arguments[0].BODY.council);
												},
												error : function() {
												}
											}
										});

						req
								.request({
									method : 'loadInitialData',
									params : {
										ownerId : AccBureau.Context.principal.data.compId
									}
								});
					},

					updateCurrentCouncil : function(callback) {
						// validate council
						if (this.isValidCouncil()) {
							var endDateField = this.getView().getComponent(
									'fieldContainer').getComponent(
									'endDateField');

							this.currentCouncil.set('endDate', endDateField
									.getValue());
							this.currentCouncil.set('members', this
									.getCouncilMembersData());
							callback();
						} else {
							MaParoisse.plugin.notification.showError(' ',
									'Erreur de validation');
						}
					},

					/* Condition added for Update 11.2019 */
					setCurrentCouncil : function(council) {
						if (AccBureau.Context.principal['data']['appType'] == 'fabrique') {
							var membersGrid = this.getView().getComponent(
									'membersGrid');
							var bureauGrid = this.getView().getComponent(
									'bureauGrid');
							var endDateField = this.getView().getComponent(
									'fieldContainer').getComponent(
									'endDateField');

							this.currentCouncil = Ext.create(
									'MaParoisse.model.Council', council);

							var members = this.currentCouncil.get('members'), bureauMembers = [], ordinaryMembers = [];

							for (var i = 0; i < members.length; i++) {
								if (members[i].positionId != 10) {
									bureauMembers.push(members[i]);
								} else {
									ordinaryMembers.push(members[i]);
								}

							}
							membersGrid.getStore().loadRawData(ordinaryMembers);
							bureauGrid.getStore().loadRawData(bureauMembers);

							endDateField.setValue(this.currentCouncil
									.get('endDate'));

						} else {
							// var membersGrid =
							// this.getView().getComponent('membersGrid');
							var bureauGrid = this.getView().getComponent(
									'bureauGrid');
							var endDateField = this.getView().getComponent(
									'fieldContainer').getComponent(
									'endDateField');

							this.currentCouncil = Ext.create(
									'MaParoisse.model.Council', council);

							var members = this.currentCouncil.get('members'), bureauMembers = [];
							// ordinaryMembers = [];
							var ordinaryCount = 0;
							for (var i = 0; i < members.length; i++) {
								if (members[i].positionId != 10) {
									bureauMembers.push(members[i]);
								} else {
									if (ordinaryCount <= 2) {
										bureauMembers.push(members[i]);
										ordinaryCount++;
									}

								}
							}

							// membersGrid.getStore().loadRawData(ordinaryMembers);
							bureauGrid.getStore().loadRawData(bureauMembers);

							endDateField.setValue(this.currentCouncil
									.get('endDate'));
						}
					},

					/*
					 * setCurrentCouncil: function(council){ },
					 */
					isValidCouncil : function() {
						var valid = true, view = this.getView(), membersGrid = view
								.getComponent('membersGrid'), ordinaryMembersStore = membersGrid
								.getStore(), bureauMembersGrid = view
								.getComponent('bureauGrid'), bureauMembersStore = bureauMembersGrid
								.getStore(), endDateField = view.getComponent(
								'fieldContainer').getComponent('endDateField');

						var bureauGridView = bureauMembersGrid.getView(), bureauNodes = bureauGridView
								.getNodes();

						for (var i = 0; i < bureauNodes.length; i++) {
							var rec = bureauGridView.getRecord(bureauNodes[i]);
							bureauMembersGrid.validateRow(bureauMembersGrid
									.getColumnIndexes(bureauMembersGrid), rec,
									bureauMembersStore.indexOf(rec), true);
						}

						var membersGridView = membersGrid.getView(), membersNodes = membersGridView
								.getNodes();

						for (var i = 0; i < membersNodes.length; i++) {
							var rec = membersGridView
									.getRecord(membersNodes[i]);
							membersGrid.validateRow(membersGrid
									.getColumnIndexes(membersGrid), rec,
									ordinaryMembersStore.indexOf(rec), true);
						}

						ordinaryMembersStore
								.each(function(m) {
									var cureCount = 0, maireCount = 0, maireAnnexeCount = 0;

									if (m.validate().items.length > 0) {
										valid = false;
										return valid;
									}
									/*
									 * validate on business logic level for
									 * example: president <=1 tresorier <=1
									 * maire, cure etc. <= 1
									 */
									switch (m.get('typeId')) {
									case 10:
										break;
									case 20:
										cureCount++;
										break;
									case 30:
										maireCount++;
										break;
									case 40:
										maireAnnexeCount++;
										break;
									}

									if (maireAnnexeCount > 1 || maireCount > 1
											|| cureCount > 1) {
										valid = false;
										return valid;
									}
								});

						bureauMembersStore
								.each(function(m) {
									var presidentCount = 0, tresorierCount = 0, secreatireCount = 0;

									if (m.validate().items.length > 0) {
										valid = false;
										return valid;
									}

									switch (m.get('positionId')) {
									case 10:
										break;
									case 20:
										presidentCount++;
										break;
									case 30:
										tresorierCount++;
										break;
									case 40:
										secreatireCount++;
										break;
									}

									if (presidentCount > 1
											|| secreatireCount > 1
											|| tresorierCount > 1) {
										valid = false;
										return valid;
									}
								});

						if (!endDateField.isValid()
								|| typeof endDateField.getValue() != 'object'
								|| endDateField.getValue() == null) {
							valid = false;
						}

						return valid;
					},

					getCouncilMembersData : function() {
						var me = this;
						var membersStore = this.getView().getComponent(
								'membersGrid').getStore(), bureauStore = this
								.getView().getComponent('bureauGrid')
								.getStore();

						var councilMembers = [];

						membersStore.each(function(rec) {
							me.prepareMemberForServer(rec, councilMembers);
						});
						bureauStore.each(function(rec) {
							me.prepareMemberForServer(rec, councilMembers);
						});

						Ext.Array.each(this.deletedMembers, function(rec) {
							me.prepareMemberForServer(rec, councilMembers);
						});

						return councilMembers;
					},

					prepareMemberForServer : function(record, membersArr) {

						var member = record.getDataObjectOpt(options = {
							serialize : true
						});

						if (!Ext.isDefined(member.employee)) {
							member.employee = {
								address : {},
								contact : {}
							};
						}
						;

						member.employee.lastName = member.employeeLastName;
						member.employee.firstName = member.employeeFirstName;
						member.employee.address.address = member.employeeAddress;
						member.employee.address.postCode = member.employeePostCode;
						member.employee.address.town = member.employeeTown;
						member.employee.contact.phone = member.employeePhone;
						member.employee.contact.email = member.employeeEmail;

						if (member.dbState != 3 && !record.phantom) {
							if (record.isModified('employeeAddress')
									|| record.isModified('employeePostCode')
									|| record.isModified('employeeTown')) {
								member.employee.address.dbState = 2;
							}

							if (record.isModified('employeePhone')
									|| record.isModified('employeeEmail')) {
								member.employee.contact.dbState = 2;
							}

							if (record.isModified('employeeLastName')
									|| record.isModified('employeeFirstName')
									|| member.employee.contact.dbState === 2
									|| member.employee.address.dbState === 2) {
								// TODO: replace with "statics"
								member.employee.dbState = 2;
							}
						}

						if (member.entryDate == null) {
							member.entryDate = '';
						}

						if (member.firstElectionDate == null) {
							member.firstElectionDate = '';
						}

						if (member.nextRenewalDate == null) {
							member.nextRenewalDate = '';
						}

						membersArr.push(member);
					},

					releaseResources : function() {
						var membDs = this.getView().getComponent('membersGrid')
								.getStore(), bureauDs = this.getView()
								.getComponent('bureauGrid').getStore();

						membDs.removeAll();
						bureauDs.removeAll();
						this.currentCouncil = null;
						this.deletedMembers = [];
						this.getView().getComponent('fieldContainer')
								.getComponent('endDateField').reset();
					},

					positionRenderer : function(value, metaData, record,
							rowIndex, colIndex, store, view) {
						switch (value) {
						case 20:
							return 'Le curé *';
							break;
						case 30:
							return 'Le maire';
							break;
						case 40:
							return 'Maire de l\'annexe (selon le cas)';
							break;
						default:
							return '';
							break;
						}

					},

					recordValidationRenderer : function(value, metaData,
							record, rowIndex, colIndex, store, view) {
						if (record.validate() != true) {
							metaData.tdAttr = 'bgcolor=#FF8585';
						}
						return value;
					},

					doElectMember : function(member, position) {
						if (this.positionIsAvailable(position)) {
							var ordinaryMemberStore = this.getView()
									.getComponent('membersGrid').getStore(), bureauMemberStore = this
									.getView().getComponent('bureauGrid')
									.getStore();

							ordinaryMemberStore.remove(member);
							member.set('positionId', position);
							member.set('typeId', 10);
							member.set('guiGroupId', 10);
							bureauMemberStore.add(member);
						} else {
							Ext
									.create(
											'MaParoisse.lib.MessageBox',
											{
												title : 'Zachée',
												formHeight : 120,
												message : 'Un autre membre du bureau occupe déjà ce poste. Commencez par annuler la nomination de ce dernier (clic droit - Revenir à membre ordinaire).',
												type : MaParoisse.lib.MessageBox.WARNING,
												callback : {
													fn : function() {
													}
												}
											});
						}
						;
					},

					doDeleteMember : function(member, ds) {
						var me = this;
						Ext
								.create(
										'MaParoisse.lib.MessageBox',
										{
											title : 'Zachée',
											formHeight : 120,
											message : 'Vous êtes sur le point de supprimer cet enregistrement, êtes vous sure de vouloir poursuivre?”',
											type : MaParoisse.lib.MessageBox.QUESTION,
											callback : {
												fn : function(btnId) {
													if (btnId == MaParoisse.lib.MessageBox.YES) {
														if (!member.phantom) {
															ds.remove(member);
															member.setDeleted();
															me.deletedMembers
																	.push(member);
														} else {
															ds.remove(member);
														}
													}
												}
											}
										});

					},

					doSetMemberAsOfficio : function(member, position) {
						if (this.typeIsAvailable(position)) {
							member.set('typeId', position);

							// officio members do not have election date and
							// entry date so set them empty
							member.set('entryDate', null);
							member.set('firstElectionDate', null);
							member.set('nextRenewalDate', null);

							member.set('guiGroupId', 20);
						} else {
							Ext
									.create(
											'MaParoisse.lib.MessageBox',
											{
												title : 'Zachée',
												formHeight : 120,
												message : 'Un autre membre du bureau occupe déjà ce poste. Commencez par annuler la nomination de ce dernier (clic droit - Revenir à membre ordinaire).',
												type : MaParoisse.lib.MessageBox.WARNING,
												callback : {
													fn : function() {
													}
												}
											});
						}
					},

					doSetMemberAsOrdinary : function(member) {
						var me = this, view = me.getView(), membersGrid = view
								.getComponent('membersGrid'), bureauGrid = view
								.getComponent('bureauGrid'), ordinaryMemberStore = membersGrid
								.getStore(), bureauMemberStore = bureauGrid
								.getStore();

						if (member.get('positionId') != 10) {
							bureauMemberStore.remove(member);

							member.set('typeId', 10);
							member.set('positionId', 10);
							member.set('guiGroupId', 10);

							ordinaryMemberStore.add(member);
						} else {
							ordinaryMemberStore.remove(member);

							member.set('typeId', 10);
							member.set('guiGroupId', 10);
							member.set('positionId', 10);

							ordinaryMemberStore.add(member);
						}
					},

					positionIsAvailable : function(position) {
						var ds = this.getView().getComponent('bureauGrid')
								.getStore(), available = true;
						ds.each(function(rec) {
							if (rec.get('positionId') == position) {
								available = false;
								return false;
							}
						});

						return available;
					},

					typeIsAvailable : function(type) {
						var ds = this.getView().getComponent('membersGrid')
								.getStore(), available = true;
						ds.each(function(rec) {
							if (rec.get('typeId') == type) {
								available = false;
								return false;
							}
						});

						return available;
					},

					onPrintCouncilClicked : function() {
						Ext
								.create(
										'MaParoisse.view.receipts.DocGenWindow',
										{
											title : 'Conseil',
											yearField : true,
											submitFunction : function(btn) {
												var view = btn.up('window'), yearField = view
														.getComponent('yearField');

												if (yearField.isValid()) {
													window
															.open(
																	'../CefraForm?number=council&ownerId='
																			+ AccBureau.Context.principal.data.compId
																			+ '&year='
																			+ yearField
																					.getValue(),
																	'_Print');
													view.close();
												}
											}
										});
					},

					onPrintBoardProtocolClicked : function() {
						Ext
								.create(
										'MaParoisse.view.receipts.DocGenWindow',
										{
											title : 'Imprimer PROCÈS VERBAL',
											yearField : true,
											submitFunction : function(btn) {
												var view = btn.up('window'), yearField = view
														.getComponent('yearField');

												if (yearField.isValid()) {
													window
															.open(
																	'../CefraForm?number=councilProtocol&ownerId='
																			+ AccBureau.Context.principal.data.compId
																			+ '&year='
																			+ yearField
																					.getValue(),
																	'_Print');
													view.close();
												}
											}
										});
					}
				});
