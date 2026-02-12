import { Card, Tag, sequelize } from '../models/index.js';

async function test() {
  try {
    const card = await Card.findOne();
    const tag = await Tag.findOne();
    
    if (!card || !tag) {
      console.log("No card or tag found");
      return;
    }

    console.log(`Testing update for Card ${card.id} with Tag ${tag.id}`);

    // Simulate what controller does
    const tagIds = [tag.id];
    
    console.log("Setting tags...");
    await card.setTags(tagIds);
    console.log("Tags set successfully via method.");

    // Simulate controller update structure
    const updatedCard = await Card.findByPk(card.id, { include: "tags" });
    console.log("Fetched updated card:", JSON.stringify(updatedCard.toJSON(), null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

test();
