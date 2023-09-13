const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');


router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag, as: 'tagged_products'}]
    });
    return res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag, as: 'tagged_products'}]
    })
    if (!tagData) {
      return res.status(404).json({message: 'No tag found with that id.'})
    }
    return res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    return res.status(200).json({message: `Tag id ${tagData.id} created`})
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      res.status(404).json({message: 'No tag exists with this id!'});
    }

    const [changedRows] = await Tag.update(req.body, {
      where: {
        id: req.params.id 
      }
    })
    if (changedRows != 1) {
      res.status(400).json({message: 'No changes were made'})
    }
    res.status(200).json({message: `Tag id ${req.params.id} updated`})

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
    try {
      const tagData = await Tag.findByPk(req.params.id);
      if (!tagData) {
        return res.status(404).json({message: 'No tag exists with this id!'})
      }
      await Tag.destroy ({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({message: `Tag id ${req.params.id} deleted`})
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
