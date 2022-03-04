import Link from 'next/link';
import getAsString from '../getAsString';
import { Pagination, PaginationItem } from "@mui/material";
import { forwardRef } from "react";
import { useRouter } from 'next/router';
import { MaterialUiLinkProps } from '../pages/cars';

export function CarPagination({totalPages}: {totalPages: number}) {
    const { query } = useRouter();
    return (
        <Pagination
        page={parseInt(getAsString(query.page) || '1')}               
        count={totalPages}
        renderItem={item => (
            <PaginationItem
                component={MaterialUiLink}
                query = {query}
                item = {item} 
                {...item}
            />
            )}
        />
    )
}

// eslint-disable-next-line react/display-name
const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps> (({ item, query, ...props }, ref) => (
    (
        <Link href={{
            pathname: '/cars',
            query: {...query, page: item.page}
        }}
        shallow
        >
            <a ref={ref} {...props}></a>
        </Link>
    )
  ));