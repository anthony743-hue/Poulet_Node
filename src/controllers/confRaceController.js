exports.getAllConfRace = (req,res) => {
    const plats = [
    { id: 1, nom: 'Pastéis de Nata', prix: 2.5 },
    { id: 2, nom: 'Feijoada', prix: 15 }
  ];
  res.status(200).json(plats);
}