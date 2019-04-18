export default function(_this) {
  const roleList = [];
  roleList.push({
    key: 0,
    value: _this.props.intl.formatMessage({ id: 'title_admin' }),
  });
  roleList.push({
    key: 1,
    value: _this.props.intl.formatMessage({ id: 'title_leader' }),
  });

  roleList.push({
    key: 2,
    value: _this.props.intl.formatMessage({ id: 'title_projectManager' }),
  });
  roleList.push({
    key: 4,
    value: _this.props.intl.formatMessage({ id: 'title_projectDirector' }),
  });
  roleList.push({
    key: 5,
    value: _this.props.intl.formatMessage({ id: 'title_produceDirector' }),
  });
  roleList.push({
    key: 6,
    value: _this.props.intl.formatMessage({ id: 'title_professionalForeman' }),
  });
  roleList.push({
    key: 7,
    value: _this.props.intl.formatMessage({ id: 'title_securityGuard' }),
  });
  roleList.push({
    key: 8,
    value: _this.props.intl.formatMessage({ id: 'title_qualityInspector' }),
  });
  roleList.push({
    key: 9,
    value: _this.props.intl.formatMessage({ id: 'title_materialStaff' }),
  });
  roleList.push({
    key: 10,
    value: _this.props.intl.formatMessage({ id: 'title_monitorManager' }),
  });
  roleList.push({
    key: 11,
    value: _this.props.intl.formatMessage({ id: 'title_chiefInspector' }),
  });
  roleList.push({
    key: 12,
    value: _this.props.intl.formatMessage({ id: 'title_specializedSupervisionEngineer' }),
  });
  roleList.push({
    key: 13,
    value: _this.props.intl.formatMessage({ id: 'title_ownerEngineer' }),
  });

  const accountStatus = [];
  accountStatus.push({
    key: 1,
    value: _this.props.intl.formatMessage({ id: 'normal' }),
  });
  accountStatus.push({
    key: 2,
    value: _this.props.intl.formatMessage({ id: 'prohibit' }),
  });
  return {
    roleList,
    accountStatus,
  };
}
