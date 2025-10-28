import type { ParamsType, ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import vi_VN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';
import React, { useEffect, useRef } from 'react';

/**
 * DataTable chuẩn production:
 * - Scroll bằng rê chuột (ngang + dọc)
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
    const tableWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        // tìm phần thân bảng của antd
        const body = wrapper.querySelector('.ant-table-body') as HTMLElement;
        if (!body) return;

        let isDown = false;
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let scrollTop = 0;

        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            body.classList.add('grabbing');
            startX = e.pageX - body.offsetLeft;
            startY = e.pageY - body.offsetTop;
            scrollLeft = body.scrollLeft;
            scrollTop = body.scrollTop;
        };

        const onMouseLeave = () => {
            isDown = false;
            body.classList.remove('grabbing');
        };

        const onMouseUp = () => {
            isDown = false;
            body.classList.remove('grabbing');
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - body.offsetLeft;
            const y = e.pageY - body.offsetTop;
            const walkX = (x - startX) * 1; // tốc độ cuộn ngang
            const walkY = (y - startY) * 1; // tốc độ cuộn dọc
            body.scrollLeft = scrollLeft - walkX;
            body.scrollTop = scrollTop - walkY;
        };

        body.addEventListener('mousedown', onMouseDown);
        body.addEventListener('mouseleave', onMouseLeave);
        body.addEventListener('mouseup', onMouseUp);
        body.addEventListener('mousemove', onMouseMove);

        // cleanup khi unmount
        return () => {
            body.removeEventListener('mousedown', onMouseDown);
            body.removeEventListener('mouseleave', onMouseLeave);
            body.removeEventListener('mouseup', onMouseUp);
            body.removeEventListener('mousemove', onMouseMove);
        };
    }, [dataSource]);

    return (
        <ConfigProvider locale={vi_VN}>
            <div
                ref={tableWrapperRef}
                style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#fff',
                    userSelect: 'none', // tránh bôi đen text khi rê chuột
                }}
            >
                <ProTable<T, U, ValueType>
                    bordered
                    sticky={{ offsetHeader: 64 }}
                    scroll={scroll || { x: 'max-content', y: 550 }}
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
