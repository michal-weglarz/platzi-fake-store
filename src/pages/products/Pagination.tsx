import type {ChangeEvent} from "react";

interface Props {
    page: number;
    pageSize: number;
    changeSelectedPageSize: (event: ChangeEvent<HTMLSelectElement>) => void;
    changeSelectedPage: (page: number) => void;
}


/**
 * You can access the list of 50 products by using the /products endpoint.
 * See: https://fakeapi.platzi.com/en/rest/products/#_top
 */
const MAX_NUMBER_OF_ITEMS = 50

function Pagination(props: Props) {
    const numberOfPages = Math.ceil(MAX_NUMBER_OF_ITEMS / props.pageSize);


    return (
        <div className={'flex flex-row gap-2'}>
            <select className="select" value={props.pageSize} onChange={props.changeSelectedPageSize}>
                <option disabled selected>Page size</option>
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
            </select>
            <div className="join">
                {new Array(numberOfPages).fill(0).map((_, index) => (
                    <button
                        key={index}
                        className={`join-item btn ${index === props.page ? 'btn-active' : ''}`}
                        onClick={() => props.changeSelectedPage(index)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Pagination;

