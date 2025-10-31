import { type ChangeEvent, useEffect, useState } from "react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleChevronLeftIcon,
	DoubleChevronRightIcon,
} from "../../components/Icons.tsx";

interface Props {
	page: number;
	pageSize: number;
	changeSelectedPageSize: (event: ChangeEvent<HTMLSelectElement>) => void;
	changeSelectedPage: (page: number) => void;
	total: number;
}

function Pagination(props: Props) {
	const [inputValue, setInputValue] = useState(props.page.toString());

	// Update inputValue when props.page changes
	useEffect(() => {
		setInputValue(props.page.toString());
	}, [props.page]);

	const numberOfPages = props.pageSize > 0 ? Math.ceil(props.total / props.pageSize) : 0;

	return (
		<div className={"flex flex-row gap-2"}>
			<select className="select select-sm w-fit" value={props.pageSize} onChange={props.changeSelectedPageSize}>
				<option disabled>Page size</option>
				<option>5</option>
				<option>10</option>
				<option>15</option>
				<option>20</option>
			</select>
			<div className="join gap-2">
				<button
					className={"btn btn-square btn-sm"}
					onClick={() => {
						props.changeSelectedPage(1);
					}}
				>
					<DoubleChevronLeftIcon />
				</button>
				<button
					className={"btn btn-square btn-sm"}
					onClick={() => {
						const newPage = props.page - 1;
						if (newPage > 0 && newPage <= numberOfPages) {
							props.changeSelectedPage(newPage);
						}
					}}
				>
					<ChevronLeftIcon />
				</button>
				<div className="flex flex-row gap-1 justify-center items-center">
					<input
						className={"input input-sm w-[50px]"}
						type={"number"}
						min={"1"}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onBlur={(event) => {
							const value = event.target.value;

							const pageNum = Number(value);
							if (pageNum > numberOfPages) {
								props.changeSelectedPage(numberOfPages);
							} else if (pageNum < 1) {
								props.changeSelectedPage(1);
							} else {
								props.changeSelectedPage(pageNum);
							}
						}}
					/>
					<p className={"text-sm font-light"}>of {numberOfPages}</p>
				</div>
				<button
					className={"btn btn-square btn-sm"}
					onClick={() => {
						const newPage = props.page + 1;
						if (newPage > 0 && newPage <= numberOfPages) {
							props.changeSelectedPage(newPage);
						}
					}}
				>
					<ChevronRightIcon />
				</button>
				<button
					className={"btn btn-square btn-sm"}
					onClick={() => {
						props.changeSelectedPage(numberOfPages);
					}}
				>
					<DoubleChevronRightIcon />
				</button>
			</div>
		</div>
	);
}

export default Pagination;
