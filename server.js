const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à la base de données'))
  .catch(error => console.log('Erreur de connexion à la base de données:', error));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id; 
  const { name, email, password } = req.body; 

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      user.name = name;
      user.email = email;
      user.password = password;

      return user.save();
    })
    .then(updatedUser => {
      res.json({ message: 'Utilisateur modifié avec succès', user: updatedUser });
    })
    .catch(error => {
      console.log('Erreur lors de la modification de l\'utilisateur:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la modification de l\'utilisateur' });
    });
});


app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
  });

  newUser.save()
    .then(() => {
      res.json({ message: 'Utilisateur créé avec succès' });
    })
    .catch(error => {
      console.log('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur' });
    });
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil');
});

app.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000');
});


