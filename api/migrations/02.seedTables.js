import { Card, List, Role, Tag, User, sequelize } from "../models/index.js";
import { scrypt } from "../utils/scrypt.js";

console.log("🚧 Ajout des roles...");
const adminRole = await Role.create({ name: "admin"});
const userRole = await Role.create({ name: "user"});

console.log("🚧 Ajout de admin de test...");
const hashedPassword = await scrypt.hash('admin');
const adminUser = await User.create({ 
    username: "admin", 
    password: hashedPassword, 
    role_id: adminRole.id,
    email: "admin@kanban.app",
    first_name: "Admin",
    last_name: "System"
});
const testUser = await User.create({ 
    username: "test", 
    password: await scrypt.hash('test'), 
    role_id: userRole.id,
    email: "test@kanban.app",
    first_name: "Test",
    last_name: "User"
});

console.log("🚧 Ajout de listes de test...");
const shoppingList  = await List.create({ title: "Liste des courses", position: 1, user_id: testUser.id });
const studentsList  = await List.create({ title: "Liste des apprennants", position: 3, user_id: testUser.id });
const birthdaysList = await List.create({ title: "Liste des anniversaires", position: 2, user_id: adminUser.id });

console.log("🚧 Ajout de cartes de test...");
const coffeeCard    = await Card.create({ content: "Café", description: "Acheter du café Arabica grain bio.", color: "#5c3715", list_id: shoppingList.id });
await Card.create({ content: "Thé", description: "Thé vert à la menthe.", color: "#0d3d0f", list_id: shoppingList.id });
const reblochonCard = await Card.create({ content: "Reblochon savoyard", description: "Vérifier qu'il soit bien crémeux (AOP).", list_id: shoppingList.id});

const momBirthday   = await Card.create({ content: "Maman le 01/01/1970", position: 1, list_id: birthdaysList.id });
await Card.create({ content: "Mamie le 01/01/1940", position: 2, list_id: birthdaysList.id });

await Card.create({ content: "John Doe", position: 1, list_id: studentsList.id });

console.log("🚧 Ajout de tags de test...");
const urgentTag = await Tag.create({ name: "Urgent", color: "#FF0000", user_id: testUser.id});
const ecoTag    = await Tag.create({ name: "Eco-responsable", color: "#00FF00", user_id: testUser.id});

console.log("🚧 Ajout de tags sur nos cartes...");
await coffeeCard.addTag(urgentTag);
await coffeeCard.addTag(ecoTag);
await reblochonCard.addTag(urgentTag);

// Tags pour admin
const adminTag = await Tag.create({ name: "Important", color: "#FF0000", user_id: adminUser.id });
await momBirthday.addTag(adminTag);


console.log("✅ Migration OK ! Fermeture de la base..."); // On ferme le tunnel de connexion pour que le script s'arrête bien
await sequelize.close();

// Ce fichier nous évite de créer le fichier `seed_database.sql` en utilisant directement notre ORM Sequelize !

// Pour réviser le SQL, n'hésitez pas à reproduire ce script directement en SQL !
// Et pourquoi pas pour les autres tables également.
