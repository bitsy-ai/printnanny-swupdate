export type PrintNannyEnv = {
  env: string
}

export function getPrintNannyEnv(): PrintNannyEnv {
  let env = process.env.PRINTNANNY_ENV || "local";
  return { env }
}