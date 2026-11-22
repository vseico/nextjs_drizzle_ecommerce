"use server";

import { db } from "@/db/db";
import { address } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "../auth/getCurrentUser";

export interface AddressInput {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function getMyAddresses() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];
  return db
    .select()
    .from(address)
    .where(eq(address.userId, currentUser.id))
    .orderBy(desc(address.isDefault), desc(address.createAt));
}

export async function createAddress(input: AddressInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false as const, message: "Please login first." };
  }

  const data = {
    firstName: input.firstName?.trim() ?? "",
    lastName: input.lastName?.trim() ?? "",
    phone: input.phone?.trim() ?? "",
    street: input.street?.trim() ?? "",
    city: input.city?.trim() ?? "",
    state: input.state?.trim() ?? "",
    postalCode: input.postalCode?.trim() ?? "",
    country: input.country?.trim() ?? "",
  };
  const missing = Object.entries(data).find(([, value]) => !value);
  if (missing) {
    return { success: false as const, message: "All address fields are required." };
  }

  try {
    const existing = await db
      .select({ id: address.id })
      .from(address)
      .where(eq(address.userId, currentUser.id))
      .limit(1);

    const id = crypto.randomUUID();
    await db.transaction(async (tx) => {
      if (existing.length > 0) {
        await tx
          .update(address)
          .set({ isDefault: false })
          .where(and(eq(address.userId, currentUser.id), eq(address.isDefault, true)));
      }
      await tx.insert(address).values({
        id,
        userId: currentUser.id,
        ...data,
        isDefault: true,
      });
    });

    const [created] = await db.select().from(address).where(eq(address.id, id));
    return { success: true as const, address: created };
  } catch (error) {
    console.error("CREATE_ADDRESS_ERROR:", error);
    return { success: false as const, message: "Failed to save address." };
  }
}
