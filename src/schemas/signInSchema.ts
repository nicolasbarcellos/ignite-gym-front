import * as yup from 'yup'

export const SignInSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })
  .required()

export type FormDataSignIn = yup.InferType<typeof SignInSchema>
