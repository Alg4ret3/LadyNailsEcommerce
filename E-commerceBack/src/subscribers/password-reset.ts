import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function passwordResetHandler({
    event,
    container,
}: SubscriberArgs<any>) {
    const notificationModuleService = container.resolve("notification")

    await notificationModuleService.createNotifications({
        to: event.data.entity_id,
        channel: "email",
        template: "password-reset",
        data: {
            email: event.data.entity_id,
            token: event.data.token,
        },
    })
}

export const config: SubscriberConfig = {
    event: "auth.password_reset",
}
