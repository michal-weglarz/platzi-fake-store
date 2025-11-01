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

	// Update inputValue when props.page changes.
	// This effect is not pretty, but it lets me keep the url param and the internal input value in sync.
	useEffect(() => {
		setInputValue(props.page.toString());
	}, [props.page]);

	const numberOfPages = props.pageSize > 0 ? Math.ceil(props.total / props.pageSize) : 0;

	const updateSelectedPage = (value: string | number) => {
		const pageNum = Number(value);
		if (pageNum > numberOfPages) {
			props.changeSelectedPage(numberOfPages);
			setInputValue(numberOfPages.toString());
		} else if (pageNum < 1) {
			props.changeSelectedPage(1);
			setInputValue("1");
		} else {
			props.changeSelectedPage(pageNum);
			setInputValue(pageNum.toString());
		}
	};

	return (
		<div className={"flex flex-row justify-center md:justify-between gap-2 items-center"}>
			<label className="select select-xs w-[175px] hidden md:flex">
				<span className="label">Per page</span>
				<select className="select select-xs" value={props.pageSize} onChange={props.changeSelectedPageSize}>
					<option disabled>Page size</option>
					<option>5</option>
					<option>10</option>
					<option>15</option>
					<option>20</option>
				</select>
			</label>

			<div className="p-4 pb-2 text-xs opacity-60 tracking-wide hidden md:flex">
				Showing &nbsp;
				<b>
					{(props.page - 1) * props.pageSize + 1} to {Math.min(props.page * props.pageSize, props.total)}
				</b>
				&nbsp; of {props.total} items
			</div>

			<div className="join gap-2">
				<button
					className={"btn btn-square btn-xs"}
					onClick={() => {
						props.changeSelectedPage(1);
					}}
				>
					<DoubleChevronLeftIcon />
				</button>
				<button className={"btn btn-square btn-xs"} onClick={() => updateSelectedPage(props.page - 1)}>
					<ChevronLeftIcon />
				</button>
				<div className="flex flex-row gap-1 justify-center items-center">
					<input
						className={"input input-xs w-[50px]"}
						type={"number"}
						min={"1"}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onBlur={(e) => updateSelectedPage(e.target.value)}
					/>
					<p className={"text-sm font-light"}>of {numberOfPages}</p>
				</div>
				<button className={"btn btn-square btn-xs"} onClick={() => updateSelectedPage(props.page + 1)}>
					<ChevronRightIcon />
				</button>
				<button
					className={"btn btn-square btn-xs"}
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
