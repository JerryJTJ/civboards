//Error Handling
export class AppError extends Error {
	status: number;
	details: string;
	constructor(message: string, status: number, details: string) {
		super(message);
		this.status = status;
		this.details = details; // Additional validation details
	}
}
