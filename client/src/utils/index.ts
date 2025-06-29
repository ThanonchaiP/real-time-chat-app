export const getAvatarName = (name?: string) => {
  if (!name) return "US";

  const [firstName, lastName = ""] = name.split(" ");
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase();
};
