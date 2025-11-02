export interface Event {
  readonly name: string;
  readonly payload: any;
  readonly ocurredAt: Date;
}
