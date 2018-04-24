export type EntityValueAcceptor = (value: any) => boolean;
export type EntityValueArrayMutator<Value = any> = (values: any[]) => Value[];
export type EntityValueMutator<Value = any> = (value: any) => Value;
