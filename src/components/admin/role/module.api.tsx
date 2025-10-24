import { Card, Col, Collapse, Row, Tooltip, Spin } from 'antd';
import { ProFormSwitch } from '@ant-design/pro-components';
import { grey } from '@ant-design/colors';
import { colorMethod, groupByPermission } from '@/config/utils';
import type { IPermission, IRole } from '@/types/backend';
import 'styles/reset.scss';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useEffect } from 'react';
import type { CollapseProps } from 'antd';
import { useRoleByIdQuery } from '@/hooks/useRoles';

interface IProps {
  form: ProFormInstance;
  listPermissions: {
    module: string;
    permissions: IPermission[];
  }[] | null;
  singleRole: IRole | null;
  openModal: boolean;
}

const ModuleApi = (props: IProps) => {
  const { form, listPermissions, singleRole, openModal } = props;

  // ✅ Dùng React Query để fetch chi tiết role theo id
  const { data: roleDetail, isLoading } = useRoleByIdQuery(singleRole?.id ? String(singleRole.id) : undefined);

  useEffect(() => {
    if (listPermissions?.length && roleDetail?.id && openModal) {
      const userPermissions = groupByPermission(roleDetail.permissions);
      const p: any = {};

      listPermissions.forEach((moduleItem) => {
        let allCheck = true;
        moduleItem.permissions?.forEach((perm) => {
          const temp = userPermissions.find((x) => x.module === moduleItem.module);
          p[perm.id!] = false;

          if (temp) {
            const isExist = temp.permissions.find((k) => k.id === perm.id);
            if (isExist) {
              p[perm.id!] = true;
            } else {
              allCheck = false;
            }
          } else {
            allCheck = false;
          }
        });
        p[moduleItem.module] = allCheck;
      });

      form.setFieldsValue({
        name: roleDetail.name,
        active: roleDetail.active,
        description: roleDetail.description,
        permissions: p,
      });
    }
  }, [openModal, listPermissions, roleDetail, form]);

  const handleSwitchAll = (value: boolean, name: string) => {
    const child = listPermissions?.find((item) => item.module === name);
    if (child) {
      child.permissions?.forEach((perm) => {
        if (perm.id) form.setFieldValue(['permissions', perm.id], value);
      });
    }
  };

  const handleSingleCheck = (value: boolean, child: string, parent: string) => {
    form.setFieldValue(['permissions', child], value);
    const parentModule = listPermissions?.find((item) => item.module === parent);
    if (parentModule) {
      const allTrue = parentModule.permissions.every(
        (perm) => form.getFieldValue(['permissions', perm.id as string])
      );
      form.setFieldValue(['permissions', parent], allTrue);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 30 }}>
        <Spin tip="Đang tải thông tin vai trò..." />
      </div>
    );
  }

  const panels: CollapseProps['items'] =
    listPermissions?.map((item, index) => ({
      key: `${index}-parent`,
      label: <div>{item.module}</div>,
      forceRender: true,
      extra: (
        <div className="customize-form-item">
          <ProFormSwitch
            name={['permissions', item.module]}
            fieldProps={{
              defaultChecked: false,
              onClick: (u, e) => e.stopPropagation(),
              onChange: (value) => handleSwitchAll(value, item.module),
            }}
          />
        </div>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {item.permissions?.map((perm, i: number) => (
            <Col lg={12} md={12} sm={24} key={`${i}-child-${item.module}`}>
              <Card size="small" bodyStyle={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ProFormSwitch
                    name={['permissions', perm.id as string]}
                    fieldProps={{
                      defaultChecked: false,
                      onChange: (v) => handleSingleCheck(v, perm.id as string, item.module),
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Tooltip title={perm?.name}>
                    <p style={{ paddingLeft: 10, marginBottom: 3 }}>{perm?.name || ''}</p>
                    <div style={{ display: 'flex' }}>
                      <p
                        style={{
                          paddingLeft: 10,
                          fontWeight: 'bold',
                          marginBottom: 0,
                          color: colorMethod(perm?.method as string),
                        }}
                      >
                        {perm?.method || ''}
                      </p>
                      <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>
                        {perm?.apiPath || ''}
                      </p>
                    </div>
                  </Tooltip>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    })) || [];

  return (
    <Card size="small" bordered={false}>
      <Collapse items={panels} />
    </Card>
  );
};

export default ModuleApi;
