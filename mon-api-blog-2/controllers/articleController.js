const testApi = (req , res ) => {
res.status(200 ).json({ message : 'Le test depuis le controleur a fonctionné!', success : true });
};

// const createArticle = (req, res) => {
//     res.status(200).json({ 
//         message: 'Le test a fonctionné !', 
//         success: true  
//     });
// }

// --- Routes POST ---
const createArticle =  (req, res) => {
    const articleData = req.body;
    console.log('Données reçues :', articleData);
    
    res.status(201).json({
        message: 'Article créé avec succès !',
        article: { id: Date.now(), ...articleData }
    });
};

module.exports = {
    testApi,
    createArticle
};