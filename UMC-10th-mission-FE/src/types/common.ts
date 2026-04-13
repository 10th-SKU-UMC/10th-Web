export type CommonResponse<T> = {
    status: boolean;
    statuscode: number;
    message: string;
    data: T
}