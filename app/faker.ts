import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

export function createRandomUser() {
  return {
    _id: new ObjectId(),
    name: faker.internet.userName(),
    email: faker.internet.email(),
    role: "admin",
    // avatar: faker.image.avatar(),
    password: "Sag@frog",
    passwordConfirm: "Sag@frog",
    // birthdate: faker.date.birthdate(),
    // registeredAt: faker.date.past(),
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 500,
});
