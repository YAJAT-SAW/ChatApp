exports.authorize = async (req, res) => {
  try {
    if (req.user /*&& req.user.email && req.user.name*/) {
    /*email = req.email;
    username = req.name;*/
res.status(200).json(req.user);
    } else {
      res.status(401).json({ message: 'User not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error getting user', error: error.message });
  }
};