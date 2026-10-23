"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HOME_PATH, LOGIN_PATH } from "../constants";
import { REMEMBERED_EMAIL_COOKIE_TARGET } from "../lib/rememberedEmail";
import { getSafeRedirectPath } from "../lib/redirectTarget";

/** "Not you? Use another email": forgets the kept email (e.g. on a shared computer) and shows an empty form. */
export const forgetRememberedEmail = async (formData: FormData) => {
  (await cookies()).delete(REMEMBERED_EMAIL_COOKIE_TARGET);

  const next = getSafeRedirectPath(formData.get("next"));
  redirect(next === HOME_PATH ? LOGIN_PATH : `${LOGIN_PATH}?next=${encodeURIComponent(next)}`);
};
