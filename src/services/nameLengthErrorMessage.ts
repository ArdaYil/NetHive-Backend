export const minLength = (property: string, min: number) =>
  `${property} has to be at least ${min} character long`;

export const maxLength = (property: string, max: number) =>
  `${property} has to be less than ${max} character long`;
