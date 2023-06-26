import * as yup from 'yup'

export const profileSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z ]*$/, 'name must be only characters')
    .min(2, 'name must be at least 2 characters')
    .required('Name is a required field'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nullable()
    .transform((value) => (value.length ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (value.length ? value : null))
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Passwords must match')
          .transform((value) => value || null),
    }),
})

export type FormDataProfile = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}
