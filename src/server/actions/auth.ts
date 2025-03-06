"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "@/lib/auth/password-hasher";
import { createUserSession, removeUserFromSession } from "@/lib/auth/session";
import { signInSchema, signUpSchema } from "@/types/auth-schema";

import { db } from "../db";
import { UserTable } from "../schema";

enum AuthError {
  INVALID_CREDENTIALS = "The email or password you entered is incorrect",
  ACCOUNT_NOT_FOUND = "No account found with this email",
  INVALID_INPUT = "Please check your input and try again",
  SYSTEM_ERROR = "An unexpected error occurred. Please try again later",
  ACCOUNT_NOT_CONFIGURED = "Your account is not properly configured. Please contact support",
  EMAIL_EXISTS = "An account already exists with this email",
  SIGNUP_FAILED = "Failed to create account",
  VALIDATION_ERROR = "Invalid signup information provided",
}

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  try {
    const { success, data, error } = signInSchema.safeParse(unsafeData);

    if (!success) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return `${AuthError.INVALID_INPUT}: ${errorMessage}`;
    }

    let user;
    try {
      user = await db.query.UserTable.findFirst({
        columns: {
          password: true,
          salt: true,
          id: true,
          email: true,
          role: true,
        },
        where: eq(UserTable.email, data.email),
      });
    } catch (error) {
      console.error("Database error:", error);
      return { error: AuthError.SYSTEM_ERROR };
    }

    // For security, we use the same error message whether the user doesn't exist
    // or the password is wrong
    if (!user) {
      return { error: AuthError.INVALID_CREDENTIALS };
    }

    if (!user.password || !user.salt) {
      console.error(`User ${user.id} has missing authentication data`);
      return { error: AuthError.ACCOUNT_NOT_CONFIGURED };
    }

    let isCorrectPassword;
    try {
      isCorrectPassword = await comparePasswords({
        hashedPassword: user.password,
        password: data.password,
        salt: user.salt,
      });
    } catch (error) {
      console.error("Password verification error:", error);
      return { error: AuthError.SYSTEM_ERROR };
    }

    if (!isCorrectPassword) {
      return { error: AuthError.INVALID_CREDENTIALS };
    }

    try {
      await createUserSession(user, await cookies());
    } catch (error) {
      console.error("Session creation error:", error);
      return { error: AuthError.SYSTEM_ERROR };
    }

    return { success: "Login successful" };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { error: AuthError.SYSTEM_ERROR };
  }
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  try {
    const { success, data, error } = signUpSchema.safeParse(unsafeData);

    if (!success) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return `${AuthError.VALIDATION_ERROR}: ${errorMessage}`;
    }

    let existingUser;
    try {
      existingUser = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, data.email),
      });
    } catch (error) {
      console.error("Database error checking existing user:", error);
      return { error: AuthError.SYSTEM_ERROR };
    }

    if (existingUser != null) {
      return { error: AuthError.EMAIL_EXISTS };
    }

    try {
      const salt = generateSalt();
      const hashedPassword = await hashPassword(data.password, salt);

      const [user] = await db
        .insert(UserTable)
        .values({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          salt,
        })
        .returning({ id: UserTable.id, role: UserTable.role });

      if (!user) {
        console.error("User creation failed: No user returned from insert");
        return { error: AuthError.SIGNUP_FAILED };
      }

      try {
        await createUserSession(user, cookies());
      } catch (error) {
        console.error("Session creation error:", error);
        return { error: AuthError.SYSTEM_ERROR };
      }
    } catch (error) {
      console.error("User creation error:", error);
      return { error: AuthError.SIGNUP_FAILED };
    }

    return { success: "Login successful" };
  } catch (error) {
    console.error("Signup process error:", error);
    return { error: AuthError.SYSTEM_ERROR };
  }
}

export async function logOut() {
  await removeUserFromSession(cookies());
  redirect("/");
}
