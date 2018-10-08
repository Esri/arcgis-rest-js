import { INotificationResult } from "../../src/notification";

export const UserNotificationsResponse: INotificationResult = {
  notifications: [
    {
      id: "7eee83bb4bc94c1e82bb5b931ab9a818",
      type: "message_received",
      target: "c@sey",
      targetType: "user",
      received: 1534788621000,
      data: {
        fromUser: "adminuser",
        subject: "this is the subject",
        message: "this is the message"
      }
    },
    {
      id: "e8c18248ee2f4eb298d443026982b59c",
      type: "group_join",
      target: "c@sey",
      targetType: "user",
      received: 1534788353000,
      data: {
        groupId: "0c943127d4a545e6874e4ee4e1f88fa8",
        groupTitle: "This is Jupe's Test Event"
      }
    }
  ]
};

export const IDeleteSuccessResponse: any = {
  success: true,
  notificationId: "3ef"
};
