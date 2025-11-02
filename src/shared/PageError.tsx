import { ExclamationCircleIcon } from "./Icons.tsx";
import { Link, useLocation } from "wouter";

interface Props {
	message?: string;
}

function PageError(props: Props) {
	const [location, setLocation] = useLocation();

	return (
		<div className="flex flex-col w-full justify-center items-center gap-4">
			<div className="flex flex-col w-full justify-center items-center gap">
				<ExclamationCircleIcon className={"size-10"} />
				<p className={"font-semibold text-lg"}>An error occurred!</p>
				{props.message != null && <p className={"font-light text-sm"}>{props.message}</p>}
			</div>
			<div className={"flex flex-row gap-4 justify-center items-center"}>
				<Link className={"btn btn-link"} to={"/"}>
					Go to Home
				</Link>
				<button className={"btn btn-primary"} onClick={() => setLocation(location)}>
					Try again
				</button>
			</div>
		</div>
	);
}

export default PageError;
