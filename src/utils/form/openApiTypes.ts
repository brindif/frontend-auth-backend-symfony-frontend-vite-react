export type XList = {
  route: string;
  label: string;
  labelDefault?: string;
  identifier: string;
};
export type OpenApiElement =  {
  type: string[] | string;
  // Common fields
  nullable?: boolean;
  readOnly?: boolean;
  required?: string[];
  // Enum
  enum?: Array<string | number | boolean | null>;
  "x-list"?: XList;
  "x-join"?: ObjectSchema;
  // Numeric
  minimum?: number;
  maximum?: number;
  // String
  minLength?: number;
  maxLength?: number;
  format?: string;
  pattern?: string;
  // Misc fields
  description?: string;
  default?: string | number | boolean | null;
  examples?: string[];
  example?: string;
};

export type ObjectSchema = {
  type?: string;
  required?: string[];
  properties: Record<string, OpenApiElement>;
};