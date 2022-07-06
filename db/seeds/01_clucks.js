const faker = require('faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  return knex('clucks').del().then(() => {
    const clucks = [];
    for (let i = 0; i < 20; i++) {
      clucks.push({
        username: faker.internet.userName(),
        content: faker.company.catchPhrase(),
        image_url: faker.image.imageUrl(),
      });
    }
    return knex('clucks').insert(clucks);
  })
};
