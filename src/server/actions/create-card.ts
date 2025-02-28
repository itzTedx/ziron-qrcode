"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { cardSchema } from "@/types/card-schema";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";

import { db } from "../db";
import { emails, links, persons, phones } from "../schema";

const action = createSafeActionClient();

export const createCard = action
  .schema(cardSchema)
  .action(
    async ({
      parsedInput: {
        id,
        name,
        phones: phonesData = [],
        emails: emailsData = [],
        address,
        mapUrl,
        companyId,
        designation,
        attachmentFileName,
        attachmentUrl,
        bio,
        image,
        template,
        cover,
        theme,
        btnColor,
        links: linksData = [],
      },
    }) => {
      const placeholderImage = `https://ui-avatars.com/api/?background=random&name=${name}&size=128`;
      const placeholderCover = "/images/placeholder-cover.jpg";

      try {
        return await db.transaction(async (tx) => {
          if (id) {
            const currentCard = await tx.query.persons.findFirst({
              where: eq(persons.id, id),
            });

            if (!currentCard) {
              throw new Error("Card not found");
            }

            const [editedCard] = await tx
              .update(persons)
              .set({
                name,
                address,
                bio,
                attachmentFileName,
                attachmentUrl,
                companyId,
                mapUrl,
                designation,
                template,
                theme,
                btnColor,
                image: image || placeholderImage,
                cover: cover || placeholderCover,
              })
              .where(eq(persons.id, id))
              .returning();

            // Batch delete operations
            await Promise.all([
              tx.delete(links).where(eq(links.personId, id)),
              tx.delete(phones).where(eq(phones.personId, id)),
              tx.delete(emails).where(eq(emails.personId, id)),
            ]);

            // Batch insert operations
            await Promise.all(
              [
                linksData.length > 0 &&
                  tx.insert(links).values(
                    linksData.map((link, i) => ({
                      icon: link.icon,
                      label: link.label,
                      url: link.url,
                      category: link.category,
                      personId: id,
                      order: i,
                    }))
                  ),
                phonesData.length > 0 &&
                  tx.insert(phones).values(
                    phonesData.map((phone, i) => ({
                      phone: phone.phone,
                      label: phone.label,
                      personId: id,
                      order: i,
                    }))
                  ),
                emailsData.length > 0 &&
                  tx.insert(emails).values(
                    emailsData.map((email, i) => ({
                      email: email.email,
                      label: email.label,
                      personId: id,
                      order: i,
                    }))
                  ),
              ].filter(Boolean)
            );

            revalidateTag("persons");
            revalidatePath("/");

            return {
              success: `Digital Card: (${editedCard.name}) has been edited`,
              company: editedCard.companyId,
            };
          }

          const uniqueSlug = await generateUniqueSlug(name);
          const [newCard] = await tx
            .insert(persons)
            .values({
              name,
              address,
              bio,
              attachmentFileName,
              attachmentUrl,
              companyId,
              mapUrl,
              designation,
              template,
              theme,
              btnColor,
              image: image || placeholderImage,
              cover: cover || placeholderCover,
              slug: uniqueSlug,
            })
            .returning();

          // Batch insert operations for new card
          await Promise.all(
            [
              linksData.length > 0 &&
                tx.insert(links).values(
                  linksData.map((link, i) => ({
                    icon: link.icon,
                    label: link.label,
                    url: link.url,
                    category: link.category,
                    personId: newCard.id,
                    order: i,
                  }))
                ),
              phonesData.length > 0 &&
                tx.insert(phones).values(
                  phonesData.map((phone, i) => ({
                    phone: phone.phone,
                    label: phone.label,
                    personId: newCard.id,
                    order: i,
                  }))
                ),
              emailsData.length > 0 &&
                tx.insert(emails).values(
                  emailsData.map((email, i) => ({
                    email: email.email,
                    label: email.label,
                    personId: newCard.id,
                    order: i,
                  }))
                ),
            ].filter(Boolean)
          );

          revalidatePath("/");

          return {
            success: `Digital Card: (${newCard.name}) has been created`,
            company: newCard.companyId,
          };
        });
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Unknown error occurred",
        };
      }
    }
  );
