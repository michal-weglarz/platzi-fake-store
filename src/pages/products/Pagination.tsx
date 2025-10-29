import type {ChangeEvent} from "react";

interface Props {
    page: number;
    pageSize: number;
    changeSelectedPageSize: (event: ChangeEvent<HTMLSelectElement>) => void;
    changeSelectedPage: (page: number) => void;
    total: number;
}


function Pagination(props: Props) {
    const numberOfPages = props.pageSize > 0 ? Math.ceil(props.total / props.pageSize) : 0;

    return (
        <div className={'flex flex-row gap-2'}>
            <select className="select" value={props.pageSize} onChange={props.changeSelectedPageSize}>
                <option disabled>Page size</option>
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

