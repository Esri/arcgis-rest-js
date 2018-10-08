import { IInvitation, IInvitationResult } from "../../src/invitation";

export const UserInvitationsResponse: IInvitationResult = {
  userInvitations: [
    {
      id: "G45ad52e7560e470598815499003c13f6",
      targetType: "group",
      targetId: "5d780fcf924e4e7ab1952a71472bc950",
      received: 1538516323000,
      accepted: false,
      mustApprove: false,
      email: null,
      role: "group_member",
      type: "user",
      dateAccepted: -1,
      expiration: 1539725923000,
      created: 1538516323000,
      username: "mjuniper_dcqa",
      fromUsername: {
        username: "dcadminqa"
      },
      groupId: "5d780fcf924e4e7ab1952a71472bc950"
    }
  ]
};

export const UserInvitationResponse: IInvitation = {
  id: "G45ad52e7560e470598815499003c13f6",
  targetType: "group",
  targetId: "5d780fcf924e4e7ab1952a71472bc950",
  received: 1538516323000,
  accepted: false,
  mustApprove: false,
  email: null,
  role: "group_member",
  type: "user",
  dateAccepted: -1,
  expiration: 1539725923000,
  created: 1538516323000,
  username: "mjuniper_dcqa",
  fromUsername: {
    username: "dcadminqa",
    fullname: "DcAdminQA QaExtDc"
  },
  group: {
    id: "5d780fcf924e4e7ab1952a71472bc950",
    title: "Jupe test group 2",
    isInvitationOnly: true,
    owner: "dcadminqa",
    description: null,
    snippet: null,
    tags: ["hub"],
    phone: null,
    sortField: "title",
    sortOrder: "asc",
    isViewOnly: false,
    thumbnail: null,
    created: 1538516296000,
    modified: 1538516296000,
    access: "public",
    capabilities: [],
    isFav: false,
    isReadOnly: false,
    protected: false,
    autoJoin: false,
    notificationsEnabled: false,
    provider: null,
    providerGroupName: null
  }
};
