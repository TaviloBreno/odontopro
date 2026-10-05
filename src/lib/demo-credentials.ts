export interface DemoCredential {
  email: string
  password: string
}

export function getDemoCredentials(environment: NodeJS.ProcessEnv): DemoCredential[] {
  if (
    environment.NODE_ENV !== "development" ||
    environment.TEST_LOGIN_ENABLED !== "true"
  ) {
    return []
  }

  return [
    {
      email: environment.TEST_LOGIN_EMAIL?.trim().toLowerCase() ?? "",
      password: environment.TEST_LOGIN_PASSWORD ?? "",
    },
    {
      email: environment.TEST_EMPLOYEE_EMAIL?.trim().toLowerCase() ?? "",
      password: environment.TEST_EMPLOYEE_PASSWORD ?? "",
    },
  ].filter((credential) => credential.email.length > 0 && credential.password.length > 0)
}
