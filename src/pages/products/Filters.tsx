import { SearchIcon } from "../../components/Icons.tsx";
import type { ChangeEvent } from "react";

interface Props {
	onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Filters(props: Props) {
	return (
		<div className="flex self-start mb-8">
			<label className="input">
				<SearchIcon />
				<input
					type="search"
					placeholder="Search by title"
					onChange={props.onSearchChange}
				/>
			</label>
		</div>
	);
}

export default Filters;
