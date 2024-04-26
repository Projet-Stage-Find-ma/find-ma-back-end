import getUserIdFromToken from '../../function.js';
import dotenv from 'dotenv';
dotenv.config();
import db from '../../databaseConnection.js';
import jwt from 'jsonwebtoken';

const addphone = (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized. Invalid token." });
        }

        const userId = getUserIdFromToken(token);
        const { IMEI1, IMEI2, serialNumber, marque, model, couleur, tel1, tel2, email, statut } = req.body;

        try {
            const searchPhoneSQL = "SELECT * FROM phones WHERE (imei1 = ? OR imei2 = ? OR serialNumber = ?) AND owner = ? AND deleted = ?";
            const [searchPhoneResult] = await db.query(searchPhoneSQL, [IMEI1, IMEI2, serialNumber, userId, true]);
            
            if (searchPhoneResult.length > 0) {
                
                const updateDeleteSQL = "UPDATE phones SET deleted = false WHERE (imei1 = ? OR imei2 = ? OR serialNumber = ?) AND owner = ?";
                await db.query(updateDeleteSQL, [IMEI1, IMEI2, serialNumber, userId]);
                res.json({ message: "Le téléphone a été récupéré avec succès." });
            } else {
                const addPhoneSQL = "INSERT INTO phones (imei1, imei2, serialNumber, brand, model, color, status, tel1, tel2, email, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                await db.query(addPhoneSQL, [IMEI1, IMEI2, serialNumber, marque, model, couleur, statut, tel1, tel2, email, userId]);
                res.json({ message: "Le téléphone a été bien ajouté." });
            }
        } catch (error) {
            console.error("Error during phone management:", error);
            res.status(500).json({ message: "Erreur interne, impossible de gérer le téléphone." });
        }
    });
};

export default addphone;
