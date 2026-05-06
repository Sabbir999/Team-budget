export function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function snapshotToArray(snapshot) {
  const data = snapshot.val();

  if (!data) {
    return [];
  }

  return Object.keys(data).map((key) => ({
    ...data[key],
    id: data[key].id || key,
  }));
}

export function getPersonById(people = [], personId) {
  return people.find((person) => person.id === personId) || null;
}

export function getPeopleMap(people = []) {
  return people.reduce((map, person) => {
    map[person.id] = person;
    return map;
  }, {});
}
