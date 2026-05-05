export function hydrateTripMembers(tripMembers = [], people = []) {
  return tripMembers.map((tripMember) => {
    const personId = tripMember.personId;

    if (!personId) {
      return {
        ...tripMember,
        id: tripMember.id,
        personId: tripMember.id,
        name: tripMember.name || "Old member data",
        email: tripMember.email || "",
        phone: tripMember.phone || "",
        zelle: tripMember.zelle || "",
        avatarColor: "gray",
        role: tripMember.role || "Member",
        paymentStatus: tripMember.paymentStatus || "unpaid",
        partialPayments: tripMember.partialPayments || [],
        globalProfile: null,
        isLegacyMember: true,
      };
    }

    const person = people.find((item) => item.id === personId);

    return {
      ...tripMember,
      id: personId,
      personId,
      name: person?.name || "Unknown person",
      email: person?.email || "",
      phone: person?.phone || "",
      zelle: person?.zelle || "",
      avatarColor: person?.avatarColor || "blue",
      role: tripMember.role || "Member",
      paymentStatus: tripMember.paymentStatus || "unpaid",
      partialPayments: tripMember.partialPayments || [],
      globalProfile: person || null,
      isLegacyMember: false,
    };
  });
}

export function getPersonName(people = [], personId) {
  return (
    people.find((person) => person.id === personId)?.name || "Unknown person"
  );
}