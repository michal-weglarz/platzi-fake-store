import { Link } from "wouter";

interface Props {
	breadcrumbs: { name: string; link?: string }[];
	title: string;
	actionButton?: React.ReactNode;
}

function PageHeader(props: Props) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full gap-4 md:items-end">
			<div className="flex flex-col gap-2">
				<div className="breadcrumbs text-sm pb-0">
					<ul>
						{props.breadcrumbs?.map((item, i) => (
							<li key={i}>{item.link != null ? <Link to={item.link}>{item.name}</Link> : item.name}</li>
						))}
					</ul>
				</div>
				<h1 className="text-xl font-bold tracking-wide self-start">{props.title}</h1>
			</div>
			{props.actionButton}
		</div>
	);
}

export default PageHeader;
