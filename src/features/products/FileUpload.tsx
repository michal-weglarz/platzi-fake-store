import { DeleteIcon } from "../../shared/Icons.tsx";
import type { FileUploadResponse } from "../../utils/types.ts";
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api.ts";
import { toast } from "react-toastify";

interface Props {
	uploadedImages: FileUploadResponse[];
	setUploadedImages: React.Dispatch<React.SetStateAction<FileUploadResponse[]>>;
	isInEditMode: boolean;
	setIsAddingImages: React.Dispatch<React.SetStateAction<boolean>>;
}

function FileUpload(props: Props) {
	const uploadMutation = useMutation({
		mutationFn: api.files.uploadMultiple,
		onMutate: () => {
			props.setIsAddingImages(true);
		},
		onSuccess: (data) => {
			props.setUploadedImages((prev) => [...prev, ...data]);
			toast.success(`${data.length} file(s) uploaded successfully!`);
		},
		onError: () => {
			toast.error("Failed to upload files!");
		},
		onSettled: () => {
			props.setIsAddingImages(false);
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			uploadMutation.mutate(Array.from(files));
		}
	};

	const removeImage = (index: number) => {
		props.setUploadedImages((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div>
			<fieldset className="fieldset flex-1 w-full">
				<legend className="fieldset-legend">Pick files</legend>
				<div className={"flex flex-row gap-2"}>
					<input
						type="file"
						className="file-input"
						onChange={handleFileChange}
						multiple
						disabled={uploadMutation.isPending}
						accept="image/png, image/jpeg, image/jpg"
					/>
					{uploadMutation.isPending && <span className="loading loading-spinner"></span>}
				</div>
				<label className="label">Max size 2MB per file</label>
			</fieldset>

			{props.uploadedImages.length > 0 && (
				<div className="mt-4">
					<p className="text-sm font-medium mb-2">Uploaded images ({props.uploadedImages.length}):</p>
					<div className="flex flex-wrap flex-row gap-5">
						{props.uploadedImages.map((image, index) => (
							<div key={index} className="flex flex-row flex-wrap gap-2">
								<div className={"tooltip"} data-tip={image.filename}>
									{/*Can't display an image because of the CORS issue*/}
									<img
										src={image.location}
										alt={`Upload ${index + 1}`}
										className="w-20 h-20 object-cover rounded"
										onError={(e) => {
											e.currentTarget.src = "https://placehold.co/400x400";
										}}
									/>
								</div>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="btn btn-square btn-xs"
								>
									<DeleteIcon />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default FileUpload;
