

export default function(_this){
  const roleMap = new Map();
  roleMap.set("admin",_this.props.intl.formatMessage({ id: 'title_admin' }));
  roleMap.set("leader",_this.props.intl.formatMessage({ id: 'title_leader' }));
  roleMap.set("projectManager",_this.props.intl.formatMessage({ id: 'title_projectManager' }));
  roleMap.set('projectDirector', _this.props.intl.formatMessage({ id: 'title_projectDirector' }));
  roleMap.set('produceDirector', _this.props.intl.formatMessage({ id: 'title_produceDirector' }));
  roleMap.set('professionalForeman', _this.props.intl.formatMessage({ id: 'title_professionalForeman' }));
  roleMap.set('securityGuard', _this.props.intl.formatMessage({ id: 'title_securityGuard' }));
  roleMap.set('qualityInspector', _this.props.intl.formatMessage({ id: 'title_qualityInspector' }));
  roleMap.set('materialStaff', _this.props.intl.formatMessage({ id: 'title_materialStaff' }));
  roleMap.set('monitorManager', _this.props.intl.formatMessage({ id: 'title_monitorManager' }));
  roleMap.set('chiefInspector', _this.props.intl.formatMessage({ id: 'title_chiefInspector' }));
  roleMap.set('specializedSupervisionEngineer',_this.props.intl.formatMessage({ id: 'title_specializedSupervisionEngineer' }));
  roleMap.set('ownerEngineer', _this.props.intl.formatMessage({ id: 'title_ownerEngineer' }));
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_admin' }),"admin");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_leader' }),"leader");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_projectManager' }),"projectManager");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_projectDirector' }), "projectDirector");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_produceDirector' }), "produceDirector");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_professionalForeman' }),"professionalForeman");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_securityGuard' }), "securityGuard");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_qualityInspector' }),"qualityInspector");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_materialStaff' }), "materialStaff");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_monitorManager' }), "monitorManager");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_chiefInspector' }), "chiefInspector");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_specializedSupervisionEngineer' }),"specializedSupervisionEngineer");
  roleMap.set(_this.props.intl.formatMessage({ id: 'title_ownerEngineer' }),"ownerEngineer");
  return roleMap
}