import express from "express";
import pg from "pg";

const router = express.Router();
const client = new pg.Client(process.env.PG_URL);

client.on('error', (err) => console.error(err.stack))
client.connect();

router.get('/xss/:id', async (req, res) => {

    // console.log(1);
    const sqlQuery = `
        SELECT * 
        FROM card
        WHERE id = ${req.params.id};
      `;

    const result = await client.query(sqlQuery);
    
    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
    }
    
    // attention risque d'injection js / css ( faille XSS )
    // pour s'en prémunir il faut soit
    // - nettoyer les données (enlever les balises html) avant de les enregistrer en BDD => attention des données originales
    //   exemple de middleware de nettoyage sanitize-html
    // - échapper les caractères lors de l'affichage
    let card = result.rows[0];
    res.send(`<p>${card.content}</p>`);
});

router.get('/sql', async(req, res) => {
    res.send(`
       <form method="GET" action="/demo/sql/process">
        <input type="text" name="content" />
        <button> Créer</button> 
       </form>
    `);
});

router.get('/sql/process', async(req, res) => {
    // attention injection sql possible
    // pour s'en prémunir il faut 
    // utiliser des requetes paramétrées
    const sqlQuery = `
        INSERT INTO list (position, created_at, updated_at, title)
        VALUES (1, now(), now(), '${req.query.content}')
    `;

    // si l'utilisateur saisit ̀`tata'); delete from card; -- `
    // alors la requete sera
    // INSERT INTO list (position, created_at, updated_at, title)
    //     VALUES (1, now(), now(), 'tata'); delete from card; -- ')
    const result = await client.query(sqlQuery);
    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
    }
    return res.redirect('/demo/sql');
});

router.get('/session/write/:key/:value', (req, res) => {
    /*
    installation du package express-session
    */
   req.session[req.params.key] = req.params.value;
   res.send('<p>valeur stockée en session.</p> <p>allez sur <a href="/demo/session/read">cette page</a></p>');
} )

router.get('/session/read', (req, res) => {
    /*
    installation du package express-session
    */
   let html = '<p>valeurs dans la session</p>';
   html += '<ul>';
    for (const [key, value] of Object.entries(req.session)) {
        html += `<li>${key}: ${value}</li>`;
    }
    html += '</ul>';

    res.send(html);

} )
export default router;
