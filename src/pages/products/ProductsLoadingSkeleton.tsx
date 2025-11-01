import PageHeader from "./PageHeader.tsx";
import { DEFAULT_PAGE_SIZE } from "../../utils/consts.ts";

function ProductsLoadingSkeleton() {
	return (
		<div className={"flex flex-col gap-6 items-end"}>
			<PageHeader />

			<div className="card bg-base-100 w-full shadow-sm">
				<div className={"flex flex-col-reverse md:flex-row gap-4 sm:justify-between items-center"}>
					<div className={"flex flex-col md:flex-row gap-3 p-4 sm:justify-between w-full"}>
						<div className="skeleton h-8 w-full"></div>
						<div className="skeleton h-8 w-full"></div>
						<div className="skeleton h-8 w-full"></div>
						<div className="skeleton h-8 w-full"></div>
						<div className="skeleton h-8 w-[300px]"></div>
					</div>
				</div>

				<div className="card-body">
					<div className="overflow-x-auto">
						<table className="table">
							<thead>
								<tr>
									<th className={"hover:cursor-pointer hover:bg-slate-50"} role={"button"}>
										<div className={"flex flex-row gap-2 items-center"}>Title</div>
									</th>
									<th className={"hover:cursor-pointer hover:bg-slate-50"} onClick={() => {}}>
										<div className={"flex flex-row gap-2 items-center"}>Category</div>
									</th>
									<th className={"hover:cursor-pointer hover:bg-slate-50"}>Price</th>
									<th className={"w-[100px]"}>Action</th>
								</tr>
							</thead>
							<tbody>
								{new Array(DEFAULT_PAGE_SIZE).fill(0).map((_, i) => (
									<tr key={i}>
										<td>
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask h-12 w-12">
														<div className="skeleton h-48 w-48"></div>
													</div>
												</div>
												<div className="flex flex-col gap-2">
													<div className="font-bold line-clamp-1">
														<div className="skeleton h-4 w-48"></div>
													</div>
													<div className="skeleton h-4 w-10"></div>
												</div>
											</div>
										</td>
										<td>
											<div className="skeleton h-4 w-48"></div>
										</td>
										<td>
											<div className="skeleton h-4 w-48"></div>
										</td>
										<th>
											<div className="skeleton h-4 w-48"></div>
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductsLoadingSkeleton;
