import { defineAction } from "astro:actions";
import { z } from "astro/zod";

console.log("Actions module loaded!");

export const server = {
  sendContact: defineAction({
    accept: "form",
    //Validation des données du formulaire de contact
    input: z.object({
      firstname: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères"),
      lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
      email: z.string().email("L'email doit être valide"),
      subject: z
        .string()
        .min(5, "Le sujet doit contenir au moins 5 caractères"),
      message: z
        .string()
        .min(10, "Le message doit contenir au moins 10 caractères"),
      hp_field: z.string().optional(), // Honeypot
    }),
    handler: async (input) => {
      // Vérification du champ honeypot
      if (input.hp_field) {
        console.warn("Spam détecté via le champ honeypot.");
        return { success: true }; // Silently succeed
      }

      // Envoie vers l'API REST d'EmailJS
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: import.meta.env.EMAILJS_SERVICE_ID,
            template_id: import.meta.env.EMAILJS_TEMPLATE_ID,
            user_id: import.meta.env.EMAILJS_PUBLIC_ID,
            template_params: {
              prenom: input.firstname,
              nom: input.lastname,
              from_email: input.email,
              subject: input.subject,
              message: input.message,
            },
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur EmailJS:", response.status, errorText);
        throw new Error(
          `Erreur lors de l'envoi de l'email: ${response.status}`
        );
      }

      return { success: true, firstname: input.firstname };
    },
  }),
};
