import * as yup from 'yup'

export const signUpSchema = yup
  .object({
    name: yup
      .string()
      .matches(/^[a-zA-Z ]*$/, 'name must be only characters')
      .min(2, 'name must be at least 2 characters')
      .required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nullable()
      .required(),
    passwordConfirm: yup
      .string()
      .nullable()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required(),
  })
  .required()

export type FormDataSignUp = yup.InferType<typeof signUpSchema>
