import React, { useMemo, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({
    fetchOptions,
    debounceTimeout = 800,
    value,
    ...props
}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    /** ================== Debounce Fetch ================== */
    const debounceFetcher = useMemo(() => {
        const loadOptions = (searchText: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setFetching(true);

            fetchOptions(searchText).then((newOptions) => {
                if (fetchId !== fetchRef.current) return; // ignore old fetches
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    /** ================== Fetch khi focus ================== */
    const handleOnFocus = () => {
        if (options.length === 0) {
            fetchOptions('').then((newOptions) => setOptions(newOptions));
        }
    };

    const handleOnBlur = () => {
        // giữ nguyên options
    };

    return (
        <Select
            labelInValue
            showSearch
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
            value={value}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
        />
    );
}
