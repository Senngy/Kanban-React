// Importer nos modèles
import { Card } from "./card.model.js";
import { List } from "./list.model.js";
import { Role } from "./role.model.js";
import { Tag } from "./tag.model.js";
import { User } from "./user.model.js";
import { sequelize } from "./sequelize.client.js";


// List <--> Card (One-to-Many)
List.hasMany(Card, {
  as: "cards", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête un liste, je veux pouvoir récupérer ses..."
  foreignKey: {
    name: "list_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Card.belongsTo(List, {
  as: "list", // Quand je requête une carte, je veux pouvoir récupérer... sa liste
  foreignKey: "list_id" // obligatoire, sinon il créé un champ 'listId' dont on ne veut pas
});

// Card <--> Tag (Many-to-Many)
Card.belongsToMany(Tag, {
  as: "tags",
  through: "card_has_tag",
  foreignKey: "card_id"
});

Tag.belongsToMany(Card, {
  as: "cards",
  through: "card_has_tag",
  foreignKey: "tag_id"
});

User.belongsTo(Role, {
  as: "role",
  foreignKey: {
    name: "role_id",
    allowNull: false,
  }
})

Role.hasMany(User, {
  as: "users", 
  foreignKey: {
    name: "role_id",
  },
})
// Exporter nos modèles
export { Card, List, Role, Tag, User, sequelize };
