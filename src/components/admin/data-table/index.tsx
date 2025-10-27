import type { ParamsType, ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import vi_VN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';
import React from 'react';

/**
 * DataTable chuẩn production — hỗ trợ:
 * - Scroll trong bảng (x/y)
 * - Sticky header
 * - Locale tiếng Việt
 */
const DataTable = <
    T extends Record<string, any>,
    U extends ParamsType = ParamsType,
    ValueType = 'text',
>({
    columns,
    defaultData = [],
    dataSource,
    postData,
    pagination,
    loading,
    rowKey = (record) => record.id,
    scroll,
    params,
    request,
    search,
    polling,
    toolBarRender,
    headerTitle,
    actionRef,
    dateFormatter = 'string',
    rowSelection,
}: ProTableProps<T, U, ValueType>) => {
    return (
        <ConfigProvider locale={vi_VN}>
            <div
                style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#fff',
                }}
            >
                <ProTable<T, U, ValueType>
                    bordered
                    sticky={{ offsetHeader: 64 }} // 👈 header cố định khi cuộn
                    scroll={scroll || { x: 'max-content', y: 550 }} // 👈 scroll trong bảng
                    columns={columns}
                    defaultData={defaultData}
                    dataSource={dataSource}
                    postData={postData}
                    pagination={pagination}
                    loading={loading}
                    rowKey={rowKey}
                    params={params}
                    request={request}
                    search={search}
                    polling={polling}
                    toolBarRender={toolBarRender}
                    headerTitle={headerTitle}
                    actionRef={actionRef}
                    dateFormatter={dateFormatter}
                    rowSelection={rowSelection}
                    options={{
                        density: false,
                        fullScreen: false,
                        reload: true,
                        setting: false,
                    }}
                />
            </div>
        </ConfigProvider>
    );
};

export default DataTable;
