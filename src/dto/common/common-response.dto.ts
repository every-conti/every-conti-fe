export default interface CommonResponseDto<T> {
  success: boolean;
  data: T;
}
