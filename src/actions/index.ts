import { defineAction } from "astro:actions";
import { z } from "astro/zod";

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
      const debugId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const serviceId =
        process.env.EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID;
      const templateId =
        process.env.EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID;
      const publicId =
        process.env.EMAILJS_PUBLIC_ID || import.meta.env.EMAILJS_PUBLIC_ID;
      const privateKey =
        process.env.EMAILJS_PRIVATE_KEY || import.meta.env.EMAILJS_PRIVATE_KEY;

      // Vérification du champ honeypot
      if (input.hp_field) {
        console.warn("Spam détecté via le champ honeypot.");
        return { success: true }; // Silently succeed
      }

      if (!serviceId || !templateId || !publicId) {
        console.error(
          `[sendContact:${debugId}] Configuration EmailJS manquante.`,
          {
            serviceId: Boolean(serviceId),
            templateId: Boolean(templateId),
            publicId: Boolean(publicId),
          },
        );

        return {
          success: false,
          debugId,
          error:
            "Le formulaire est temporairement indisponible. Reessayez plus tard.",
        };
      }

      // Envoie vers l'API REST d'EmailJS
      try {
        const response = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicId,
              ...(privateKey ? { accessToken: privateKey } : {}),
              template_params: {
                prenom: input.firstname,
                nom: input.lastname,
                from_email: input.email,
                subject: input.subject,
                message: input.message,
              },
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[sendContact:${debugId}] Erreur EmailJS:`,
            response.status,
            errorText,
          );
          return {
            success: false,
            debugId,
            error: `EmailJS ${response.status}: ${errorText.slice(0, 240)}`,
          };
        }
      } catch (error) {
        console.error(`[sendContact:${debugId}] Erreur reseau EmailJS:`, error);
        return {
          success: false,
          debugId,
          error: "Une erreur reseau est survenue pendant l'envoi vers EmailJS.",
        };
      }

      return { success: true, firstname: input.firstname, debugId };
    },
  }),
};
